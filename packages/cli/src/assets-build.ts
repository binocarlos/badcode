import { mkdtemp, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { AssetManifest, ImageVariant } from '@badcode/comic-manifest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import { IMMUTABLE_CC } from './bucket'
import { relKey, variantKey, classifyAsset } from './asset-paths'

const LOW_WIDTH = 720
const LOW_QUALITY = 70
const HIGH_WIDTH = 1920
const HIGH_QUALITY = 80

export interface AssetsBuildOptions {
  bucket: Bucket
  processor: ImageProcessor
  /** Bucket-relative source subfolder (no trailing slash, no gs://). */
  src: string
  /** Previous manifest, used to reuse unchanged entries. */
  previous?: AssetManifest
  /** Recompute every asset even if variants exist. */
  force?: boolean
  /** Compute the manifest but perform no uploads or image processing. */
  dryRun?: boolean
  /** Max concurrent assets processed. Default 6. */
  concurrency?: number
  /** Progress sink. Default: no-op. */
  log?: (msg: string) => void
}

/** Run `fn` over `items` with at most `limit` in flight, preserving order. */
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  async function worker(): Promise<void> {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker)
  await Promise.all(workers)
  return results
}

export async function assetsBuild(opts: AssetsBuildOptions): Promise<AssetManifest> {
  const { bucket, processor, src, previous, force = false, dryRun = false, concurrency = 6 } = opts
  const log = opts.log ?? (() => {})
  const basePath = src.endsWith('/') ? src.slice(0, -1) : src

  const allKeys = await bucket.listKeys(basePath)
  const existing = new Set(allKeys.map((k) => relKey(basePath, k)))
  const rasterOrPass = allKeys
    .map((k) => relKey(basePath, k))
    .filter((rel) => classifyAsset(rel) !== 'skip')

  let tmp: string | null = null
  const ensureTmp = async (): Promise<string> => {
    if (!tmp) tmp = await mkdtemp(join(tmpdir(), 'assets-build-'))
    return tmp
  }

  try {
    const entries = await mapPool(rasterOrPass, concurrency, async (rel): Promise<[string, ImageVariant]> => {
      if (classifyAsset(rel) === 'passthrough') {
        log(`passthrough ${rel}`)
        return [rel, { thumbhash: '', low: rel, high: rel, width: 0, height: 0 }]
      }

      const lowKey = variantKey(rel, 'low')
      const highKey = variantKey(rel, 'high')
      const prior = previous?.assets[rel]
      const variantsExist = existing.has(lowKey) && existing.has(highKey)

      if (!force && prior && variantsExist) {
        log(`reuse ${rel}`)
        return [rel, prior]
      }

      if (dryRun) {
        log(`would build ${rel}`)
        return [rel, { thumbhash: '', low: lowKey, high: highKey, width: 0, height: 0 }]
      }

      const dir = await ensureTmp()
      const localSrc = join(dir, rel.replace(/\//g, '__'))
      await mkdir(dirname(localSrc), { recursive: true })
      await bucket.download(`${basePath}/${rel}`, localSrc)

      const localLow = `${localSrc}.low.webp`
      const localHigh = `${localSrc}.high.webp`
      const { width, height } = await processor.dimensions(localSrc)
      await processor.toWebp(localSrc, localLow, LOW_WIDTH, LOW_QUALITY)
      await processor.toWebp(localSrc, localHigh, HIGH_WIDTH, HIGH_QUALITY)
      const thumbhash = await processor.thumbhashDataUri(localSrc)

      await bucket.upload(localLow, `${basePath}/${lowKey}`, IMMUTABLE_CC)
      await bucket.upload(localHigh, `${basePath}/${highKey}`, IMMUTABLE_CC)
      log(`built ${rel}`)

      return [rel, { thumbhash, low: lowKey, high: highKey, width, height }]
    })

    return { basePath, assets: Object.fromEntries(entries) }
  } finally {
    if (tmp) await rm(tmp, { recursive: true, force: true })
  }
}
