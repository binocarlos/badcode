import { describe, it, expect } from 'vitest'
import { groupAssets, renditionKey, posterKey, rungsFor } from './animation-paths'

describe('groupAssets', () => {
  it('detects an animation folder by a video.mp4 and excludes its files from statics', () => {
    const g = groupAssets(['pages/p1/anim/x/video.mp4', 'pages/p1/anim/x/frame_000.jpg', 'pages/p2/main.png'])
    expect(g.animations).toEqual([
      { folder: 'pages/p1/anim/x', sourceVideo: 'pages/p1/anim/x/video.mp4', frames: ['pages/p1/anim/x/frame_000.jpg'] },
    ])
    expect(g.staticImages).toEqual(['pages/p2/main.png'])
  })

  it('detects a frames-only animation (≥2 numbered frames, no video)', () => {
    const g = groupAssets(['a/anim/frame_000.jpg', 'a/anim/frame_001.jpg', 'a/anim/frame_002.jpg'])
    expect(g.animations).toEqual([
      { folder: 'a/anim', sourceVideo: null, frames: ['a/anim/frame_000.jpg', 'a/anim/frame_001.jpg', 'a/anim/frame_002.jpg'] },
    ])
    expect(g.staticImages).toEqual([])
  })

  it('sorts frames numerically (not lexically)', () => {
    const g = groupAssets(['a/frame_2.jpg', 'a/frame_10.jpg', 'a/frame_1.jpg'])
    expect(g.animations[0].frames).toEqual(['a/frame_1.jpg', 'a/frame_2.jpg', 'a/frame_10.jpg'])
  })

  it('treats a lone single frame as a static image, not an animation', () => {
    const g = groupAssets(['a/frame_000.jpg'])
    expect(g.animations).toEqual([])
    expect(g.staticImages).toEqual(['a/frame_000.jpg'])
  })

  it('ignores derived outputs and keeps svg as a static image', () => {
    const g = groupAssets(['derived/x.low.webp', 'p/bg.svg'])
    expect(g.animations).toEqual([])
    expect(g.staticImages).toEqual(['p/bg.svg'])
  })
})

describe('renditionKey / posterKey', () => {
  it('builds derived keys for a folder', () => {
    expect(renditionKey('pages/p1/anim/x', 720)).toBe('derived/pages/p1/anim/x.720.mp4')
    expect(posterKey('pages/p1/anim/x')).toBe('derived/pages/p1/anim/x.poster.webp')
  })
})

describe('rungsFor', () => {
  it('includes ladder rungs at or below source height', () => {
    expect(rungsFor(1080)).toEqual([480, 720, 1080])
    expect(rungsFor(720)).toEqual([480, 720])
  })
  it('allows a 10% tolerance so a near-1080 source still gets the 1080 rung', () => {
    expect(rungsFor(1072)).toEqual([480, 720, 1080])
  })
  it('falls back to a single source-height rung when below the smallest rung', () => {
    expect(rungsFor(360)).toEqual([360])
  })
})
