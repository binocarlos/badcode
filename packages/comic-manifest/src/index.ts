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
  /** Map of basePath-relative source key → its variants. */
  assets: Record<string, ImageVariant>
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
  return value as AssetManifest
}
