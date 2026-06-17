import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import type { VideoAsset, Rendition } from '@badcode/comic-manifest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { VideoProcessor } from './video-processor'
import type { AnimationFolder } from './animation-paths'
import { IMMUTABLE_CC } from './bucket'
import { renditionKey, posterKey, rungsFor } from './animation-paths'

const FRAMES_FPS = 24
const POSTER_WIDTH = 1280
const POSTER_QUALITY = 80

export interface AnimationDeps {
  basePath: string
  bucket: Bucket
  image: ImageProcessor
  video: VideoProcessor
  /** Working directory (already created) for temp files. */
  tmpDir: string
  /** Unique index for collision-free temp filenames. */
  index: number
  log: (m: string) => void
}

/** Even, aspect-correct width for a target height. */
function widthFor(srcW: number, srcH: number, h: number): number {
  return Math.round((srcW * h) / srcH / 2) * 2
}

export async function buildAnimation(anim: AnimationFolder, deps: AnimationDeps): Promise<VideoAsset> {
  const { basePath, bucket, image, video, tmpDir, index, log } = deps
  const stem = join(tmpDir, `anim-${index}`)
  const localSource = `${stem}.source.mp4`
  const cleanup: string[] = [localSource]

  // 1. Normalize a local source video.
  let frameCount: number
  let meta: Awaited<ReturnType<typeof video.probe>>
  if (anim.sourceVideo) {
    await bucket.download(`${basePath}/${anim.sourceVideo}`, localSource)
    meta = await video.probe(localSource)
    frameCount = meta.frameCount
  } else {
    const framesDir = `${stem}.frames`
    await mkdir(framesDir, { recursive: true })
    cleanup.push(framesDir)
    for (let i = 0; i < anim.frames.length; i++) {
      const n = String(i + 1).padStart(5, '0')
      await bucket.download(`${basePath}/${anim.frames[i]}`, join(framesDir, `frame_${n}.jpg`))
    }
    await video.framesToVideo(join(framesDir, 'frame_%05d.jpg'), FRAMES_FPS, localSource)
    frameCount = anim.frames.length
    meta = await video.probe(localSource)
  }

  // 2. Encode the rendition ladder.
  const renditions: Rendition[] = []
  for (const h of rungsFor(meta.height)) {
    const out = `${stem}.${h}.mp4`
    await video.encode(localSource, out, h)
    const key = renditionKey(anim.folder, h)
    await bucket.upload(out, `${basePath}/${key}`, IMMUTABLE_CC)
    await rm(out, { force: true })
    renditions.push({ height: h, width: widthFor(meta.width, meta.height, h), proxy: key })
  }

  // 3. Poster (WebP) + ThumbHash, from the first frame.
  const posterPng = `${stem}.poster.png`
  const posterWebp = `${stem}.poster.webp`
  cleanup.push(posterPng, posterWebp)
  await video.extractPoster(localSource, posterPng)
  await image.toWebp(posterPng, posterWebp, POSTER_WIDTH, POSTER_QUALITY)
  const thumbhash = await image.thumbhash(posterPng)
  const pKey = posterKey(anim.folder)
  await bucket.upload(posterWebp, `${basePath}/${pKey}`, IMMUTABLE_CC)

  for (const f of cleanup) await rm(f, { recursive: true, force: true })
  log(`built animation ${anim.folder} (${renditions.length} renditions, ${frameCount} frames)`)

  return { thumbhash, poster: pKey, renditions, width: meta.width, height: meta.height, frameCount, fps: meta.fps }
}
