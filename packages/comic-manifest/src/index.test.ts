import { describe, it, expect } from 'vitest'
import { validateManifest } from './index'
import type { AssetManifest } from './index'

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
