import { describe, it, expect, vi, afterEach } from 'vitest'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { VideoProcessor } from './video-processor'
import type { AnimationFolder } from './animation-paths'
import { buildAnimation } from './build-animation'

const tmpDirs: string[] = []
async function workDir(): Promise<string> {
  const d = await mkdtemp(join(tmpdir(), 'build-anim-test-'))
  tmpDirs.push(d)
  return d
}
afterEach(async () => {
  for (const d of tmpDirs.splice(0)) await rm(d, { recursive: true, force: true })
})

function fakeBucket(): Bucket {
  return {
    list: vi.fn(async () => []), copy: vi.fn(async () => {}), upload: vi.fn(async () => {}),
    download: vi.fn(async () => {}),
    // simulate a batch download by materializing the raw files the rename step expects
    downloadMany: vi.fn(async (keys: string[], dir: string) => {
      await mkdir(dir, { recursive: true })
      for (const k of keys) await writeFile(join(dir, basename(k)), '')
    }),
    listKeys: vi.fn(async () => []),
  } as Bucket
}
function fakeImage(): ImageProcessor {
  return {
    dimensions: vi.fn(async () => ({ width: 0, height: 0 })),
    toWebp: vi.fn(async () => {}),
    thumbhash: vi.fn(async () => 'POSTERHASH'),
  }
}
function fakeVideo(meta = { width: 1920, height: 1080, frameCount: 242, fps: 24 }): VideoProcessor {
  return {
    probe: vi.fn(async () => meta),
    encode: vi.fn(async () => {}),
    extractPoster: vi.fn(async () => {}),
    framesToVideo: vi.fn(async () => {}),
  }
}
async function deps(over: Partial<{ bucket: Bucket; image: ImageProcessor; video: VideoProcessor }> = {}) {
  return {
    basePath: 'comics-v2/ep1', tmpDir: await workDir(), index: 0, log: () => {},
    bucket: over.bucket ?? fakeBucket(), image: over.image ?? fakeImage(), video: over.video ?? fakeVideo(),
  }
}

describe('buildAnimation — source video present', () => {
  it('downloads the video, encodes the ladder, posters, and returns a VideoAsset', async () => {
    const bucket = fakeBucket(); const video = fakeVideo(); const image = fakeImage()
    const anim: AnimationFolder = { folder: 'p7/anim/x', sourceVideo: 'p7/anim/x/video.mp4', frames: [] }
    const asset = await buildAnimation(anim, await deps({ bucket, video, image }))

    expect(bucket.download).toHaveBeenCalledWith('comics-v2/ep1/p7/anim/x/video.mp4', expect.any(String))
    expect(video.framesToVideo).not.toHaveBeenCalled()
    expect(video.probe).toHaveBeenCalledTimes(1)
    expect((video.encode as any).mock.calls.map((c: any[]) => c[2])).toEqual([480, 720, 1080])
    expect(asset.renditions.map((r) => r.height)).toEqual([480, 720, 1080])
    expect(asset.renditions[0]).toEqual({ height: 480, width: 854, proxy: 'derived/p7/anim/x.480.mp4' })
    expect(asset.poster).toBe('derived/p7/anim/x.poster.webp')
    expect(asset.thumbhash).toBe('POSTERHASH')
    expect(asset).toMatchObject({ width: 1920, height: 1080, frameCount: 242, fps: 24 })
    expect((bucket.upload as any).mock.calls.length).toBe(4) // 3 renditions + poster
  })
})

describe('buildAnimation — frames only', () => {
  it('batch-downloads frames once, re-encodes to a source video, uses frames.length as frameCount', async () => {
    const bucket = fakeBucket()
    const video = fakeVideo({ width: 1280, height: 720, frameCount: 0, fps: 24 })
    const anim: AnimationFolder = {
      folder: 'a/anim', sourceVideo: null,
      frames: ['a/anim/frame_0.jpg', 'a/anim/frame_1.jpg', 'a/anim/frame_2.jpg'],
    }
    const asset = await buildAnimation(anim, await deps({ bucket, video }))

    expect(bucket.downloadMany).toHaveBeenCalledTimes(1) // one batched call, not one-per-frame
    expect((bucket.downloadMany as any).mock.calls[0][0]).toEqual([
      'comics-v2/ep1/a/anim/frame_0.jpg', 'comics-v2/ep1/a/anim/frame_1.jpg', 'comics-v2/ep1/a/anim/frame_2.jpg',
    ])
    expect(bucket.download).not.toHaveBeenCalled()
    expect(video.framesToVideo).toHaveBeenCalledTimes(1)
    expect(asset.frameCount).toBe(3)                            // from frames.length, not probe
    expect(asset.renditions.map((r) => r.height)).toEqual([480, 720]) // 720 source → two rungs
  })
})
