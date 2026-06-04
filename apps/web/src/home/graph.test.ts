// apps/web/src/home/graph.test.ts
import { describe, it, expect } from 'vitest'
import { GRAPH } from './graph'

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
