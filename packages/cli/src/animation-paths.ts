import { classifyAsset } from './asset-paths'

export const LADDER = [480, 720, 1080]

/** A folder treated as a single scroll-scrubbed animation. */
export interface AnimationFolder {
  /** basePath-relative folder key (the manifest key). */
  folder: string
  /** basePath-relative key of a source video.mp4, or null (frames-only). */
  sourceVideo: string | null
  /** basePath-relative frame keys, sorted by frame number. */
  frames: string[]
}

export interface Grouped {
  animations: AnimationFolder[]
  staticImages: string[]
}

const FRAME_RE = /(?:^|\/)frame_(\d+)\.(?:jpe?g|png|webp)$/i

function dirOf(rel: string): string {
  const i = rel.lastIndexOf('/')
  return i >= 0 ? rel.slice(0, i) : ''
}
function baseOf(rel: string): string {
  const i = rel.lastIndexOf('/')
  return i >= 0 ? rel.slice(i + 1) : rel
}
function frameNum(rel: string): number | null {
  const m = rel.match(FRAME_RE)
  return m ? Number(m[1]) : null
}

/** Split keys into animation folders vs static images. `skip` keys are dropped. */
export function groupAssets(relKeys: string[]): Grouped {
  const considered = relKeys.filter((k) => classifyAsset(k) !== 'skip')
  const byDir = new Map<string, string[]>()
  for (const k of considered) {
    const d = dirOf(k)
    const list = byDir.get(d)
    if (list) list.push(k)
    else byDir.set(d, [k])
  }

  const animations: AnimationFolder[] = []
  const staticImages: string[] = []
  for (const [dir, keys] of byDir) {
    const sourceVideo = keys.find((k) => baseOf(k) === 'video.mp4') ?? null
    const frames = keys
      .filter((k) => frameNum(k) !== null)
      .sort((a, b) => (frameNum(a) as number) - (frameNum(b) as number))
    const isAnimation = sourceVideo !== null || frames.length >= 2
    if (isAnimation) {
      animations.push({ folder: dir, sourceVideo, frames })
    } else {
      for (const k of keys) staticImages.push(k)
    }
  }
  return { animations, staticImages }
}

/** basePath-relative key for a rendition MP4, e.g. derived/<folder>.720.mp4 */
export function renditionKey(folder: string, height: number): string {
  return `derived/${folder}.${height}.mp4`
}

/** basePath-relative key for the WebP poster, e.g. derived/<folder>.poster.webp */
export function posterKey(folder: string): string {
  return `derived/${folder}.poster.webp`
}

/** Ladder rungs to encode for a source of the given height (no real upscaling; 10% tolerance). */
export function rungsFor(sourceHeight: number): number[] {
  const rungs = LADDER.filter((h) => h <= sourceHeight * 1.1)
  return rungs.length > 0 ? rungs : [sourceHeight]
}
