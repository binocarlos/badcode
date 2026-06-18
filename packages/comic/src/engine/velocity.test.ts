import { describe, it, expect } from 'vitest'
import { nextVelocity } from './velocity'

describe('nextVelocity', () => {
  it('is 0 when dt is 0 (guards divide-by-zero)', () => {
    expect(nextVelocity(0, 0, 0.5, 0)).toBe(0)
  })
  it('decays toward 0 when there is no scroll delta', () => {
    const v = nextVelocity(4, 0.5, 0.5, 16)
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(4)
  })
  it('rises toward the instantaneous speed on a constant delta', () => {
    // 0.1 overall-fraction in 100ms = 1.0 /s instantaneous; EMA from 0 moves toward it
    const v = nextVelocity(0, 0.0, 0.1, 100)
    expect(v).toBeGreaterThan(0)
    expect(v).toBeLessThanOrEqual(1)
  })
  it('clamps to a sane ceiling', () => {
    expect(nextVelocity(0, 0, 1, 1)).toBeLessThanOrEqual(10)
  })
})
