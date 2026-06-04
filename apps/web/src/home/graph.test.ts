// apps/web/src/home/graph.test.ts
import { describe, it, expect } from 'vitest'
import { GRAPH, drawThreshold } from './graph'

describe('graph', () => {
  it('defines the three branches with at least two points each', () => {
    expect(GRAPH.branches.history.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.bad.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.good.length).toBeGreaterThanOrEqual(2)
  })

  it('the tour begins at history start and ends at the good (future proof) tip', () => {
    const first = GRAPH.tour[0]
    const last  = GRAPH.tour[GRAPH.tour.length - 1]
    expect(first).toEqual(GRAPH.branches.history[0])
    expect(last).toEqual(GRAPH.branches.good[GRAPH.branches.good.length - 1])
  })

  it('the tour retraces through the fork (origin appears twice)', () => {
    const atFork = GRAPH.tour.filter(([x, y]) => x === 0 && y === 0)
    expect(atFork.length).toBe(2)
  })
})

// history: threshold = ((x + 30) / 30) * 0.4
describe('drawThreshold', () => {
  it('history node at x = -18 → ~0.16', () => {
    expect(drawThreshold({ branch: 'history', clip: [-18, 0] })).toBeCloseTo(0.16)
  })

  it('history node at x = 0 (fork) → 0.4', () => {
    expect(drawThreshold({ branch: 'history', clip: [0, 0] })).toBeCloseTo(0.4)
  })

  // bad branch: segment-based geometry, elbow at x=6
  // camping x=10: segment 1 frac=(10-6)/12=0.333 → head=1.333 → local=0.444 → 0.4+0.444*0.32=0.542
  it('bad branch node at x = 10 → ~0.542', () => {
    expect(drawThreshold({ branch: 'bad', clip: [10, 6] })).toBeCloseTo(0.542)
  })

  it('bad branch tip at x = 30 → 0.72', () => {
    expect(drawThreshold({ branch: 'bad', clip: [30, 6] })).toBeCloseTo(0.72)
  })

  // good branch draws over 0.72→0.95 (localGood range)
  // x=18: segment 1 frac=1 → head=2 → local=0.667 → 0.72+0.667*0.23=0.873
  it('good branch node at x = 18 → ~0.873', () => {
    expect(drawThreshold({ branch: 'good', clip: [18, -6] })).toBeCloseTo(0.873)
  })

  it('good branch tip at x = 30 → 0.95', () => {
    expect(drawThreshold({ branch: 'good', clip: [30, -6] })).toBeCloseTo(0.95)
  })
})
