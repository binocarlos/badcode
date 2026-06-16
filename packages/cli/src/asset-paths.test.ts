import { describe, it, expect } from 'vitest'
import { relKey, variantKey, classifyAsset } from './asset-paths'

describe('relKey', () => {
  it('strips the basePath prefix', () => {
    expect(relKey('comics-v2/ep1', 'comics-v2/ep1/p1/main.png')).toBe('p1/main.png')
  })
  it('tolerates a trailing slash on basePath', () => {
    expect(relKey('comics-v2/ep1/', 'comics-v2/ep1/p1/main.png')).toBe('p1/main.png')
  })
})

describe('variantKey', () => {
  it('builds derived WebP keys, swapping the extension', () => {
    expect(variantKey('p1/main.png', 'low')).toBe('derived/p1/main.low.webp')
    expect(variantKey('p1/main.png', 'high')).toBe('derived/p1/main.high.webp')
  })
  it('handles multi-dot filenames by replacing only the final extension', () => {
    expect(variantKey('p7/anim/f000.latest.jpg', 'low')).toBe('derived/p7/anim/f000.latest.low.webp')
  })
})

describe('classifyAsset', () => {
  it('classifies raster images', () => {
    expect(classifyAsset('p1/main.png')).toBe('raster')
    expect(classifyAsset('p1/main.JPG')).toBe('raster')
    expect(classifyAsset('p1/f.jpeg')).toBe('raster')
    expect(classifyAsset('p1/f.webp')).toBe('raster')
  })
  it('classifies passthrough assets', () => {
    expect(classifyAsset('p1/bg.svg')).toBe('passthrough')
    expect(classifyAsset('p1/clip.mp4')).toBe('passthrough')
    expect(classifyAsset('p1/clip.webm')).toBe('passthrough')
  })
  it('skips derived outputs, manifests, and unknown files', () => {
    expect(classifyAsset('derived/p1/main.low.webp')).toBe('skip')
    expect(classifyAsset('assets.manifest.json')).toBe('skip')
    expect(classifyAsset('notes.txt')).toBe('skip')
  })
})
