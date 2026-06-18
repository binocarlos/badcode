import type { AssetManifest } from '@badcode/comic-manifest'
import { thumbHashToDataURL } from 'thumbhash'

const CDN_BASE = 'https://storage.googleapis.com/badcode-storage'
const TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export type PlateSource = {
  thumbDataUrl: string
  posterUrl:    string
  videoUrl?:    string
  width:        number
  height:       number
}

export function decodeThumb(base64: string): string {
  if (!base64) return TRANSPARENT
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return thumbHashToDataURL(bytes)
}

const url = (manifest: AssetManifest, path: string) => `${CDN_BASE}/${manifest.basePath}/${path}`

export function resolvePlate(
  manifest: AssetManifest,
  key: string,
  opts: { maxHeight?: number } = {},
): PlateSource | null {
  const img = manifest.assets?.[key]
  if (img) {
    return {
      thumbDataUrl: decodeThumb(img.thumbhash),
      posterUrl:    url(manifest, img.high),
      width:        img.width,
      height:       img.height,
    }
  }
  const vid = manifest.animations?.[key]
  if (vid) {
    const maxH = opts.maxHeight ?? 1080
    const sorted = [...vid.renditions].sort((a, b) => a.height - b.height)
    const pick = sorted.find((r) => r.height >= maxH) ?? sorted[sorted.length - 1]
    return {
      thumbDataUrl: decodeThumb(vid.thumbhash),
      posterUrl:    url(manifest, vid.poster),
      videoUrl:     url(manifest, pick.proxy),
      width:        vid.width,
      height:       vid.height,
    }
  }
  return null
}
