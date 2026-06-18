import { describe, it, expect } from 'vitest'
import { resolvePlate, decodeThumb } from './plateSource'
import type { AssetManifest } from '@badcode/comic-manifest'

const manifest = {
  basePath: 'comics-v2/camping-jack-test',
  assets: {
    'img/i01.jpg': { thumbhash: 'nOcRDIJ3d4d/h3eHd3Z5YI0Htw==', low: 'derived/img/i01.low.webp', high: 'derived/img/i01.high.webp', width: 1920, height: 1080 },
  },
  animations: {
    'anim/a01': { thumbhash: 'nOcRDIJ3d4d/h3eHd3Z4YI0Gtw==', poster: 'derived/anim/a01.poster.webp', renditions: [
      { height: 480, width: 854, proxy: 'derived/anim/a01.480.mp4' },
      { height: 1080, width: 1920, proxy: 'derived/anim/a01.1080.mp4' },
    ], width: 1920, height: 1080, frameCount: 96, fps: 24 },
  },
} as unknown as AssetManifest

const BASE = 'https://storage.googleapis.com/badcode-storage'

describe('resolvePlate', () => {
  it('resolves an image asset to poster + thumb, no video', () => {
    const p = resolvePlate(manifest, 'img/i01.jpg')!
    expect(p.posterUrl).toBe(`${BASE}/comics-v2/camping-jack-test/derived/img/i01.high.webp`)
    expect(p.videoUrl).toBeUndefined()
    expect(p.thumbDataUrl.startsWith('data:image/')).toBe(true)
    expect(p.width).toBe(1920)
  })
  it('resolves an animation to poster + the smallest rendition >= maxHeight', () => {
    const p = resolvePlate(manifest, 'anim/a01', { maxHeight: 720 })!
    expect(p.posterUrl).toContain('a01.poster.webp')
    expect(p.videoUrl).toContain('a01.1080.mp4') // 480 too small, 1080 is next up
  })
  it('returns null for an unknown key', () => {
    expect(resolvePlate(manifest, 'nope')).toBeNull()
  })
})

describe('decodeThumb', () => {
  it('returns a transparent pixel for empty hash', () => {
    expect(decodeThumb('')).toContain('data:image')
  })
})
