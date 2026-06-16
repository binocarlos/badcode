export type AssetClass = 'raster' | 'passthrough' | 'skip'

const RASTER = new Set(['png', 'jpg', 'jpeg', 'webp'])
const PASSTHROUGH = new Set(['svg', 'mp4', 'webm'])

function ext(key: string): string {
  const dot = key.lastIndexOf('.')
  return dot >= 0 ? key.slice(dot + 1).toLowerCase() : ''
}

/** Strip the basePath prefix from a full bucket key, yielding the manifest key. */
export function relKey(basePath: string, fullKey: string): string {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  return fullKey.startsWith(base) ? fullKey.slice(base.length) : fullKey
}

/** basePath-relative key for a generated variant, e.g. derived/p1/main.low.webp */
export function variantKey(rel: string, tier: 'low' | 'high'): string {
  const dot = rel.lastIndexOf('.')
  const withoutExt = dot >= 0 ? rel.slice(0, dot) : rel
  return `derived/${withoutExt}.${tier}.webp`
}

/** Decide how the pipeline treats a key based on its extension and location. */
export function classifyAsset(rel: string): AssetClass {
  if (rel.startsWith('derived/')) return 'skip'
  const e = ext(rel)
  if (RASTER.has(e)) return 'raster'
  if (PASSTHROUGH.has(e)) return 'passthrough'
  return 'skip'
}
