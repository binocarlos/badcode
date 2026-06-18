import { describe, it, expect } from 'vitest'
import { overviewDistance } from './viewport'

describe('overviewDistance', () => {
  it('keeps the desktop base distance on wide aspect ratios', () => {
    expect(overviewDistance(1.8)).toBe(76)
  })

  it('pulls the camera back on portrait so the full width fits', () => {
    const portrait = overviewDistance(0.5)
    expect(portrait).toBeGreaterThan(76)
  })

  it('pulls back further the narrower the screen gets', () => {
    expect(overviewDistance(0.45)).toBeGreaterThan(overviewDistance(0.6))
  })

  it('clamps to a sane maximum', () => {
    expect(overviewDistance(0.01)).toBeLessThanOrEqual(220)
  })
})
