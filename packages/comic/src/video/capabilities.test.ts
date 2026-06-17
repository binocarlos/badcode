import { describe, it, expect } from 'vitest'
import { frameIndexFor } from './capabilities'

describe('frameIndexFor', () => {
  it('maps progress 0..1 to a clamped frame index', () => {
    expect(frameIndexFor(0, 242)).toBe(0)
    expect(frameIndexFor(1, 242)).toBe(241)
    expect(frameIndexFor(0.5, 242)).toBe(Math.round(0.5 * 241))
  })
  it('clamps out-of-range progress', () => {
    expect(frameIndexFor(-0.2, 100)).toBe(0)
    expect(frameIndexFor(1.5, 100)).toBe(99)
  })
  it('returns 0 for an empty clip', () => {
    expect(frameIndexFor(0.5, 0)).toBe(0)
  })
})
