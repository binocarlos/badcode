import { describe, it, expect } from 'vitest'
import { GRAPH, storyNodes, waypoints, type StoryNode } from './graph'

describe('graph', () => {
  it('every story node has a unique id', () => {
    const ids = storyNodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every story node t is within [0,1]', () => {
    for (const n of storyNodes) {
      expect(n.t).toBeGreaterThanOrEqual(0)
      expect(n.t).toBeLessThanOrEqual(1)
    }
  })

  it('every story node route starts with a slash', () => {
    for (const n of storyNodes) expect(n.route.startsWith('/')).toBe(true)
  })

  it('camping is a live node on the bad branch routed under /comics', () => {
    const camping = storyNodes.find((n) => n.id === 'camping') as StoryNode
    expect(camping).toBeDefined()
    expect(camping.status).toBe('live')
    expect(camping.branch).toBe('bad')
    expect(camping.route).toBe('/comics/camping')
  })

  it('defines the three branches with at least two points each', () => {
    expect(GRAPH.branches.history.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.bad.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.good.length).toBeGreaterThanOrEqual(2)
  })

  it('the tour begins at history start and ends at the good (future proof) tip', () => {
    const first = GRAPH.tour[0]
    const last = GRAPH.tour[GRAPH.tour.length - 1]
    expect(first).toEqual(GRAPH.branches.history[0])
    expect(last).toEqual(GRAPH.branches.good[GRAPH.branches.good.length - 1])
  })

  it('the tour retraces through the fork (origin appears twice)', () => {
    const atFork = GRAPH.tour.filter(([x, y]) => x === 0 && y === 0)
    expect(atFork.length).toBe(2)
  })

  it('story node t increases monotonically in authored order', () => {
    let prev = -Infinity
    for (const n of storyNodes) {
      expect(n.t).toBeGreaterThan(prev)
      prev = n.t
    }
  })

  it('the good-branch node has a real (non-zero) tour position', () => {
    const lens = storyNodes.find((n) => n.id === 'optimistic-lens') as StoryNode
    expect(lens.t).toBeGreaterThan(0.5)
  })

  it('futureProof waypoint is the end of the tour', () => {
    expect(typeof waypoints.futureProof).toBe('number')
    expect(waypoints.futureProof).toBeCloseTo(1)
  })

  it('exposes fork, storyverse and futureProof waypoints', () => {
    expect(waypoints.fork).toBeDefined()
    expect(waypoints.storyverse).toBeDefined()
    expect(waypoints.futureProof).toBeDefined()
  })
})
