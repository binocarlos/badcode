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

  it('the tour spline begins at history start and ends at the bad (storyverse) tip', () => {
    const first = GRAPH.tour[0]
    const last = GRAPH.tour[GRAPH.tour.length - 1]
    expect(first).toEqual(GRAPH.branches.history[0])
    expect(last).toEqual(GRAPH.branches.bad[GRAPH.branches.bad.length - 1])
  })

  it('exposes fork, storyverse and futureProof waypoints', () => {
    expect(waypoints.fork).toBeDefined()
    expect(waypoints.storyverse).toBeDefined()
    expect(waypoints.futureProof).toBeDefined()
  })
})
