import { describe, it, expect } from 'vitest'
import { gopBoundsFor, nearestCached, gopsToEvict } from './gop'

describe('gopBoundsFor', () => {
  const starts = [0, 12, 24, 36]
  it('returns [gopStart, gopEnd] for the GOP containing target', () => {
    expect(gopBoundsFor(starts, 5, 48)).toEqual([0, 11])
    expect(gopBoundsFor(starts, 12, 48)).toEqual([12, 23])
    expect(gopBoundsFor(starts, 40, 48)).toEqual([36, 47]) // last GOP → frameCount-1
  })
  it('clamps to the first GOP for a target before any keyframe', () => {
    expect(gopBoundsFor([3, 15], 1, 30)).toEqual([3, 14])
  })
})

describe('nearestCached', () => {
  const cache = new Set([10, 11, 20])
  const has = (i: number) => cache.has(i)
  it('prefers the nearest cached frame at or before target', () => {
    expect(nearestCached(has, 13, 30)).toBe(11)
  })
  it('falls forward when nothing is cached before target', () => {
    expect(nearestCached(has, 5, 30)).toBe(10)
  })
  it('returns -1 when nothing is cached', () => {
    expect(nearestCached(() => false, 5, 30)).toBe(-1)
  })
})

describe('gopsToEvict', () => {
  it('returns the oldest GOPs beyond the resident cap (FIFO)', () => {
    expect(gopsToEvict([0, 12, 24, 36], 2)).toEqual([0, 12])
  })
  it('returns [] when within cap', () => {
    expect(gopsToEvict([0, 12], 4)).toEqual([])
  })
})
