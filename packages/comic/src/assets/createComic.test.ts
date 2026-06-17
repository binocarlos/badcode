import { describe, it, expect } from 'vitest'
import type { AssetManifest } from '@badcode/comic-manifest'
import { createComic } from './createComic'

const BASE = 'https://storage.googleapis.com/badcode-storage'
const manifest: AssetManifest = {
  basePath: 'comics-v2/ep1',
  assets: {
    'p1/main.png': { thumbhash: '', low: 'derived/p1/main.low.webp', high: 'derived/p1/main.high.webp', width: 1600, height: 900 },
  },
  animations: {
    'p7/anim': {
      thumbhash: '', poster: 'derived/p7/anim.poster.webp',
      renditions: [
        { height: 480, width: 854, proxy: 'derived/p7/anim.480.mp4' },
        { height: 720, width: 1280, proxy: 'derived/p7/anim.720.mp4' },
      ],
      width: 1920, height: 1080, frameCount: 242, fps: 24,
    },
  },
}

describe('createComic.resolve', () => {
  const comic = createComic(manifest)
  it('absolutizes low/high to GCS URLs under basePath', () => {
    const a = comic.resolve('p1/main.png')
    expect(a.low).toBe(`${BASE}/comics-v2/ep1/derived/p1/main.low.webp`)
    expect(a.high).toBe(`${BASE}/comics-v2/ep1/derived/p1/main.high.webp`)
    expect(a.width).toBe(1600)
    expect(a.thumb).toBe('') // empty hash → empty data-uri
  })

  it('degrades a missing key to high-only using the key as a relative path', () => {
    const a = comic.resolve('p9/missing.png')
    expect(a.thumb).toBe('')
    expect(a.low).toBe(`${BASE}/comics-v2/ep1/p9/missing.png`)
    expect(a.high).toBe(a.low)
  })

  it('passes through an absolute URL key unchanged', () => {
    const a = comic.resolve('https://example.com/x.png')
    expect(a.high).toBe('https://example.com/x.png')
  })
})

describe('createComic.resolveAnimation', () => {
  const comic = createComic(manifest)
  it('absolutizes renditions + poster and carries metadata', () => {
    const v = comic.resolveAnimation('p7/anim')
    expect(v.renditions).toEqual([
      { height: 480, width: 854, url: `${BASE}/comics-v2/ep1/derived/p7/anim.480.mp4` },
      { height: 720, width: 1280, url: `${BASE}/comics-v2/ep1/derived/p7/anim.720.mp4` },
    ])
    expect(v.poster).toBe(`${BASE}/comics-v2/ep1/derived/p7/anim.poster.webp`)
    expect(v).toMatchObject({ width: 1920, height: 1080, frameCount: 242, fps: 24 })
  })

  it('throws for an unknown animation key', () => {
    expect(() => comic.resolveAnimation('nope')).toThrow(/unknown animation/)
  })
})

describe('createComic — custom baseUrl', () => {
  it('honors an overridden baseUrl', () => {
    const comic = createComic(manifest, { baseUrl: 'https://cdn.test' })
    expect(comic.resolve('p1/main.png').high).toBe('https://cdn.test/comics-v2/ep1/derived/p1/main.high.webp')
  })
})
