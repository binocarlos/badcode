import { describe, it, expect } from 'vitest'
import { tourCurve, pointAtT, clampT } from './path'
import { GRAPH } from './graph'

describe('path', () => {
  it('clampT keeps values within [0,1]', () => {
    expect(clampT(-0.5)).toBe(0)
    expect(clampT(1.5)).toBe(1)
    expect(clampT(0.3)).toBeCloseTo(0.3)
  })

  it('pointAtT(0) is the first tour point', () => {
    const p = pointAtT(0)
    expect(p.x).toBeCloseTo(GRAPH.tour[0][0])
    expect(p.y).toBeCloseTo(GRAPH.tour[0][1])
    expect(p.z).toBeCloseTo(0)
  })

  it('pointAtT(1) is the last tour point (future proof tip)', () => {
    const p = pointAtT(1)
    const last = GRAPH.tour[GRAPH.tour.length - 1]
    expect(p.x).toBeCloseTo(last[0])
    expect(p.y).toBeCloseTo(last[1])
  })

  it('never overshoots the geometry bounds (no cusp/loop on the retrace)', () => {
    for (let i = 0; i <= 100; i++) {
      const p = pointAtT(i / 100)
      expect(Math.abs(p.x)).toBeLessThanOrEqual(31)
      expect(Math.abs(p.y)).toBeLessThanOrEqual(7)
    }
  })

  it('tourCurve is a reusable curve instance', () => {
    expect(tourCurve.getPointAt(0)).toBeDefined()
  })
})
