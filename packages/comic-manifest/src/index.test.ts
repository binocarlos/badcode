import { describe, it, expect } from 'vitest'
import { validateManifest } from './index'
import type { AssetManifest } from './index'
import type { VideoAsset } from './index'

const valid: AssetManifest = {
  basePath: 'comics-v2/gpom-ep1',
  assets: {
    'p1/main.png': {
      thumbhash: 'data:image/png;base64,abc',
      low: 'derived/p1/main.low.webp',
      high: 'derived/p1/main.high.webp',
      width: 1600,
      height: 900,
    },
  },
}

describe('validateManifest', () => {
  it('returns the manifest unchanged when the shape is valid', () => {
    expect(validateManifest(valid)).toEqual(valid)
  })

  it('throws when basePath is missing', () => {
    expect(() => validateManifest({ assets: {} })).toThrow(/basePath/)
  })

  it('throws when an asset entry is missing a numeric width', () => {
    const bad = { basePath: 'x', assets: { 'a.png': { thumbhash: '', low: 'a', high: 'a', height: 1 } } }
    expect(() => validateManifest(bad)).toThrow(/width/)
  })
})

const withAnim = {
  basePath: 'comics-v2/ep1',
  assets: {},
  animations: {
    'p7/anim/x': {
      thumbhash: 'HASH', poster: 'derived/p7/anim/x.poster.webp',
      renditions: [{ height: 480, width: 854, proxy: 'derived/p7/anim/x.480.mp4' }],
      width: 1920, height: 1080, frameCount: 242, fps: 24,
    } satisfies VideoAsset,
  },
}

describe('validateManifest — animations', () => {
  it('accepts a manifest with a valid animations map', () => {
    expect(validateManifest(withAnim)).toEqual(withAnim)
  })

  it('accepts a manifest with no animations key (optional)', () => {
    expect(validateManifest({ basePath: 'x', assets: {} })).toEqual({ basePath: 'x', assets: {} })
  })

  it('throws when an animation rendition is missing a numeric height', () => {
    const bad = { basePath: 'x', assets: {}, animations: { a: {
      thumbhash: 'H', poster: 'p', renditions: [{ width: 854, proxy: 'q' }],
      width: 1, height: 2, frameCount: 3, fps: 4 } } }
    expect(() => validateManifest(bad)).toThrow(/height/)
  })

  it('throws when an animation is missing frameCount', () => {
    const bad = { basePath: 'x', assets: {}, animations: { a: {
      thumbhash: 'H', poster: 'p', renditions: [], width: 1, height: 2, fps: 4 } } }
    expect(() => validateManifest(bad)).toThrow(/frameCount/)
  })
})
