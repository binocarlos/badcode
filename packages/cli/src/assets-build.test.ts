import { describe, it, expect, vi } from 'vitest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { VideoProcessor } from './video-processor'
import type { AssetManifest } from '@badcode/comic-manifest'
import { assetsBuild } from './assets-build'

function fakeBucket(over: Partial<Bucket> & { keys?: string[] }): Bucket {
  return {
    list: vi.fn(async () => []),
    copy: vi.fn(async () => {}),
    upload: vi.fn(async () => {}),
    download: vi.fn(async () => {}),
    downloadMany: vi.fn(async () => {}),
    listKeys: vi.fn(async () => over.keys ?? []),
    ...over,
  } as Bucket
}

function fakeProcessor(): ImageProcessor {
  return {
    dimensions: vi.fn(async () => ({ width: 1600, height: 900 })),
    toWebp: vi.fn(async () => {}),
    thumbhash: vi.fn(async () => 'HASHB64'),
  }
}

function fakeVideo(): VideoProcessor {
  return {
    probe: vi.fn(async () => ({ width: 1920, height: 1080, frameCount: 242, fps: 24 })),
    encode: vi.fn(async () => {}),
    extractPoster: vi.fn(async () => {}),
    framesToVideo: vi.fn(async () => {}),
  }
}

const SRC = 'comics-v2/ep1'

describe('assetsBuild', () => {
  it('builds variant entries for raster images and uploads both tiers', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/main.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC })

    expect(manifest.basePath).toBe(SRC)
    expect(manifest.assets['p1/main.png']).toEqual({
      thumbhash: 'HASHB64',
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
    const manifest = await assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC })

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
    const manifest = await assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC })
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
    const manifest = await assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC, previous })

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
    const manifest = await assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC, previous, force: true })

    expect(manifest.assets['p1/main.png'].thumbhash).toBe('HASHB64')
    expect(proc.toWebp).toHaveBeenCalledTimes(2)
  })

  it('dry-run computes the manifest without uploading', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/main.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC, dryRun: true })

    expect(manifest.assets['p1/main.png'].low).toBe('derived/p1/main.low.webp')
    expect(bucket.upload).not.toHaveBeenCalled()
    expect(proc.toWebp).not.toHaveBeenCalled()
  })

  it('downloads to distinct local destinations under concurrency (no filename collision)', async () => {
    // These two keys flatten to the same name under the old `/` -> `__` scheme.
    const bucket = fakeBucket({ keys: [`${SRC}/a/b__c.png`, `${SRC}/a/b/c.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC, concurrency: 4 })

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
    await expect(assetsBuild({ bucket, processor: proc, video: fakeVideo(), src: SRC })).rejects.toThrow('boom')
  })
})

describe('assetsBuild — animations', () => {
  it('builds an animations entry for a video.mp4 folder and excludes its frames from assets', async () => {
    const bucket = fakeBucket({ keys: [
      `${SRC}/p7/anim/x/video.mp4`, `${SRC}/p7/anim/x/frame_000.jpg`, `${SRC}/p2/main.png`,
    ] })
    const manifest = await assetsBuild({ bucket, processor: fakeProcessor(), video: fakeVideo(), src: SRC })

    expect(Object.keys(manifest.assets)).toEqual(['p2/main.png'])         // frame excluded
    expect(Object.keys(manifest.animations ?? {})).toEqual(['p7/anim/x']) // one animation
    expect(manifest.animations!['p7/anim/x'].renditions.map((r) => r.height)).toEqual([480, 720, 1080])
  })

  it('reuses a prior animation entry when its poster + renditions already exist and !force', async () => {
    const prior = {
      thumbhash: 'OLD', poster: 'derived/a/anim.poster.webp',
      renditions: [
        { height: 480, width: 854, proxy: 'derived/a/anim.480.mp4' },
        { height: 720, width: 1280, proxy: 'derived/a/anim.720.mp4' },
      ],
      width: 1280, height: 720, frameCount: 3, fps: 24,
    }
    const bucket = fakeBucket({ keys: [
      `${SRC}/a/anim/frame_0.jpg`, `${SRC}/a/anim/frame_1.jpg`, `${SRC}/a/anim/frame_2.jpg`,
      `${SRC}/derived/a/anim.poster.webp`,
      `${SRC}/derived/a/anim.480.mp4`, `${SRC}/derived/a/anim.720.mp4`,
    ] })
    const video = fakeVideo()
    const manifest = await assetsBuild({
      bucket, processor: fakeProcessor(), video, src: SRC,
      previous: { basePath: SRC, assets: {}, animations: { 'a/anim': prior } },
    })

    expect(manifest.animations!['a/anim']).toEqual(prior)
    expect(video.encode).not.toHaveBeenCalled()
    expect(bucket.download).not.toHaveBeenCalled()
  })

  it('dry-run lists animations but does not encode or upload', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/a/anim/frame_0.jpg`, `${SRC}/a/anim/frame_1.jpg`] })
    const video = fakeVideo()
    const manifest = await assetsBuild({ bucket, processor: fakeProcessor(), video, src: SRC, dryRun: true })

    expect(Object.keys(manifest.animations ?? {})).toEqual(['a/anim'])
    expect(video.encode).not.toHaveBeenCalled()
    expect(bucket.upload).not.toHaveBeenCalled()
  })
})
