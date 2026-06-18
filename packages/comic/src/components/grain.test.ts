import { describe, it, expect } from 'vitest'
import { grainIntensity } from './grain'

describe('grainIntensity', () => {
  it('returns the base opacity at rest', () => {
    expect(grainIntensity(0)).toBeCloseTo(0.06)
  })
  it('rises with velocity but never exceeds the cap', () => {
    expect(grainIntensity(100)).toBeCloseTo(0.14)
    expect(grainIntensity(1)).toBeGreaterThan(0.06)
  })
  it('honors custom base/max', () => {
    expect(grainIntensity(0, 0.02, 0.2)).toBeCloseTo(0.02)
    expect(grainIntensity(100, 0.02, 0.2)).toBeCloseTo(0.2)
  })
})
