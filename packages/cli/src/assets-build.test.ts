import { describe, it, expect, vi } from 'vitest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { AssetManifest } from '@badcode/comic-manifest'
import { assetsBuild } from './assets-build'

function fakeBucket(over: Partial<Bucket> & { keys?: string[] }): Bucket {
  return {
    list: vi.fn(async () => []),
    copy: vi.fn(async () => {}),
    upload: vi.fn(async () => {}),
    download: vi.fn(async () => {}),
    listKeys: vi.fn(async () => over.keys ?? []),
    ...over,
  } as Bucket
}

function fakeProcessor(): ImageProcessor {
  return {
    dimensions: vi.fn(async () => ({ width: 1600, height: 900 })),
    toWebp: vi.fn(async () => {}),
    thumbhashDataUri: vi.fn(async () => 'data:image/png;base64,HASH'),
  }
}

const SRC = 'comics-v2/ep1'

describe('assetsBuild', () => {
  it('builds variant entries for raster images and uploads both tiers', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/main.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC })

    expect(manifest.basePath).toBe(SRC)
    expect(manifest.assets['p1/main.png']).toEqual({
      thumbhash: 'data:image/png;base64,HASH',
      low: 'derived/p1/main.low.webp',
      high: 'derived/p1/main.high.webp',
      width: 1600,
      height: 900,
    })
    expect(proc.toWebp).toHaveBeenCalledTimes(2) // low + high
    expect(bucket.upload).toHaveBeenCalledTimes(2)
  })

  it('treats SVG/video as passthrough: original key, empty thumbhash, no processing', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/bg.svg`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC })

    expect(manifest.assets['p1/bg.svg']).toEqual({
      thumbhash: '',
      low: 'p1/bg.svg',
      high: 'p1/bg.svg',
      width: 0,
      height: 0,
    })
    expect(proc.toWebp).not.toHaveBeenCalled()
    expect(bucket.upload).not.toHaveBeenCalled()
  })

  it('skips files classified as skip (derived outputs, manifests)', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/derived/p1/main.low.webp`, `${SRC}/assets.manifest.json`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC })
    expect(Object.keys(manifest.assets)).toHaveLength(0)
  })

  it('reuses a prior entry when variants already exist and --force is off', async () => {
    const bucket = fakeBucket({
      keys: [`${SRC}/p1/main.png`, `${SRC}/derived/p1/main.low.webp`, `${SRC}/derived/p1/main.high.webp`],
    })
    const proc = fakeProcessor()
    const previous: AssetManifest = {
      basePath: SRC,
      assets: {
        'p1/main.png': { thumbhash: 'OLD', low: 'derived/p1/main.low.webp', high: 'derived/p1/main.high.webp', width: 1, height: 2 },
      },
    }
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC, previous })

    expect(manifest.assets['p1/main.png'].thumbhash).toBe('OLD')
    expect(proc.toWebp).not.toHaveBeenCalled()
    expect(bucket.download).not.toHaveBeenCalled()
  })

  it('reprocesses a prior entry when force is set', async () => {
    const bucket = fakeBucket({
      keys: [`${SRC}/p1/main.png`, `${SRC}/derived/p1/main.low.webp`, `${SRC}/derived/p1/main.high.webp`],
    })
    const proc = fakeProcessor()
    const previous: AssetManifest = {
      basePath: SRC,
      assets: {
        'p1/main.png': { thumbhash: 'OLD', low: 'derived/p1/main.low.webp', high: 'derived/p1/main.high.webp', width: 1, height: 2 },
      },
    }
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC, previous, force: true })

    expect(manifest.assets['p1/main.png'].thumbhash).toBe('data:image/png;base64,HASH')
    expect(proc.toWebp).toHaveBeenCalledTimes(2)
  })

  it('dry-run computes the manifest without uploading', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/main.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC, dryRun: true })

    expect(manifest.assets['p1/main.png'].low).toBe('derived/p1/main.low.webp')
    expect(bucket.upload).not.toHaveBeenCalled()
    expect(proc.toWebp).not.toHaveBeenCalled()
  })

  it('downloads to distinct local destinations under concurrency (no filename collision)', async () => {
    // These two keys flatten to the same name under the old `/` -> `__` scheme.
    const bucket = fakeBucket({ keys: [`${SRC}/a/b__c.png`, `${SRC}/a/b/c.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC, concurrency: 4 })

    const calls = (bucket.download as any).mock.calls
    expect(calls).toHaveLength(2)
    const dests = calls.map((c: any[]) => c[1])
    expect(new Set(dests).size).toBe(2) // distinct local destinations

    expect(manifest.assets['a/b__c.png']).toBeDefined()
    expect(manifest.assets['a/b/c.png']).toBeDefined()
  })

  it('propagates processing errors', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/main.png`] })
    const proc = fakeProcessor()
    proc.toWebp = vi.fn(async () => {
      throw new Error('boom')
    })
    await expect(assetsBuild({ bucket, processor: proc, src: SRC })).rejects.toThrow('boom')
  })
})
