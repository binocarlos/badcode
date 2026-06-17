import { thumbHashToDataURL } from 'thumbhash'
import type { AssetManifest } from '@badcode/comic-manifest'
import type { Comic, ResolvedImage, ResolvedAnimation } from './types'

/** GCS bucket root the manifest's basePath-relative keys live under. */
export const DEFAULT_BASE_URL = 'https://storage.googleapis.com/badcode-storage'

function decodeThumb(hashB64: string): string {
  if (!hashB64) return ''
  const bin = atob(hashB64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return thumbHashToDataURL(bytes)
}

export function createComic(manifest: AssetManifest, opts: { baseUrl?: string } = {}): Comic {
  const baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
  const prefix = `${baseUrl}/${manifest.basePath}`

  /** Absolutize a basePath-relative key (pass absolute URLs through unchanged). */
  const abs = (rel: string): string => (/^https?:\/\//.test(rel) ? rel : `${prefix}/${rel}`)

  return {
    resolve(key: string): ResolvedImage {
      const v = manifest.assets[key]
      if (!v) {
        // Graceful degradation: treat the key as a direct path, high-only.
        const url = abs(key)
        return { thumb: '', low: url, high: url, width: 0, height: 0 }
      }
      return { thumb: decodeThumb(v.thumbhash), low: abs(v.low), high: abs(v.high), width: v.width, height: v.height }
    },

    resolveAnimation(key: string): ResolvedAnimation {
      const a = manifest.animations?.[key]
      if (!a) throw new Error(`unknown animation "${key}" in manifest "${manifest.basePath}"`)
      return {
        thumb: decodeThumb(a.thumbhash),
        poster: abs(a.poster),
        renditions: a.renditions.map((r) => ({ height: r.height, width: r.width, url: abs(r.proxy) })),
        width: a.width, height: a.height, frameCount: a.frameCount, fps: a.fps,
      }
    },
  }
}
