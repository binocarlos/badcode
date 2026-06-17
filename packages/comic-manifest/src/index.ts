/** One encoded video rendition of an animation. Paths are basePath-relative. */
export interface Rendition {
  /** Encoded height in px (a rung of the 480/720/1080 ladder). */
  height: number
  /** Encoded width in px (aspect-correct, even). */
  width: number
  /** basePath-relative key of the H.264 MP4 proxy. */
  proxy: string
}

/** One animation: a video scrubbed by the runtime. Replaces N per-frame entries. */
export interface VideoAsset {
  /** Compact base64 ThumbHash of the poster (decoded client-side). */
  thumbhash: string
  /** basePath-relative key of the WebP poster (first frame). */
  poster: string
  /** Renditions sorted ascending by height; only rungs ≤ source height (+tolerance). */
  renditions: Rendition[]
  /** Source pixel dimensions (defines aspect ratio). */
  width: number
  height: number
  /** Total frame count and frames-per-second of the source. */
  frameCount: number
  fps: number
}

/** Generated variants + placeholder for one image asset. Paths are basePath-relative. */
export interface ImageVariant {
  /** Compact base64 of the raw ThumbHash bytes (~33 chars), or empty string for passthrough assets (SVG/video). Decode to a data-URI at runtime via thumbHashToDataURL. */
  thumbhash: string
  /** basePath-relative key of the low-res WebP (~720w). For passthrough, the original key. */
  low: string
  /** basePath-relative key of the high-res WebP (~1920w). For passthrough, the original key. */
  high: string
  /** Intrinsic pixel width of the source image. */
  width: number
  /** Intrinsic pixel height of the source image. */
  height: number
}

/** The full pipeline output for one bucket subfolder. */
export interface AssetManifest {
  /** Bucket-relative subfolder the assets live under, no trailing slash. */
  basePath: string
  /** Map of basePath-relative source key → its image variants. */
  assets: Record<string, ImageVariant>
  /** Map of basePath-relative animation-folder key → its video asset. */
  animations?: Record<string, VideoAsset>
}

function fail(msg: string): never {
  throw new Error(`invalid manifest: ${msg}`)
}

/** Validate an untrusted value is a well-formed AssetManifest; returns it typed or throws. */
export function validateManifest(value: unknown): AssetManifest {
  if (typeof value !== 'object' || value === null) fail('not an object')
  const m = value as Record<string, unknown>
  if (typeof m.basePath !== 'string') fail('basePath must be a string')
  if (typeof m.assets !== 'object' || m.assets === null) fail('assets must be an object')
  for (const [key, raw] of Object.entries(m.assets as Record<string, unknown>)) {
    if (typeof raw !== 'object' || raw === null) fail(`asset "${key}" is not an object`)
    const e = raw as Record<string, unknown>
    if (typeof e.thumbhash !== 'string') fail(`asset "${key}" thumbhash must be a string`)
    if (typeof e.low !== 'string') fail(`asset "${key}" low must be a string`)
    if (typeof e.high !== 'string') fail(`asset "${key}" high must be a string`)
    if (typeof e.width !== 'number') fail(`asset "${key}" width must be a number`)
    if (typeof e.height !== 'number') fail(`asset "${key}" height must be a number`)
  }
  if (m.animations !== undefined) {
    if (typeof m.animations !== 'object' || m.animations === null) fail('animations must be an object')
    for (const [key, raw] of Object.entries(m.animations as Record<string, unknown>)) {
      if (typeof raw !== 'object' || raw === null) fail(`animation "${key}" is not an object`)
      const a = raw as Record<string, unknown>
      if (typeof a.thumbhash !== 'string') fail(`animation "${key}" thumbhash must be a string`)
      if (typeof a.poster !== 'string') fail(`animation "${key}" poster must be a string`)
      if (!Array.isArray(a.renditions)) fail(`animation "${key}" renditions must be an array`)
      for (const r of a.renditions as unknown[]) {
        if (typeof r !== 'object' || r === null) fail(`animation "${key}" has a non-object rendition`)
        const rr = r as Record<string, unknown>
        if (typeof rr.height !== 'number') fail(`animation "${key}" rendition height must be a number`)
        if (typeof rr.width !== 'number') fail(`animation "${key}" rendition width must be a number`)
        if (typeof rr.proxy !== 'string') fail(`animation "${key}" rendition proxy must be a string`)
      }
      if (typeof a.width !== 'number') fail(`animation "${key}" width must be a number`)
      if (typeof a.height !== 'number') fail(`animation "${key}" height must be a number`)
      if (typeof a.frameCount !== 'number') fail(`animation "${key}" frameCount must be a number`)
      if (typeof a.fps !== 'number') fail(`animation "${key}" fps must be a number`)
    }
  }
  return value as AssetManifest
}
