import { describe, it, expect } from 'vitest'
import { buildAtlas } from './model'
import { homeSteps } from '../timeline'

describe('buildAtlas', () => {
  it('returns one node per home step, preserving id/title/branch/status', () => {
    const { nodes } = buildAtlas()
    expect(nodes).toHaveLength(homeSteps.length)
    const camping = nodes.find((n) => n.id === 'camping')!
    expect(camping.title).toBe('Camping')
    expect(camping.branch).toBe('bad')
    expect(camping.status).toBe('live')
  })

  it('places nodes on the z=0 plane at their float position', () => {
    const { nodes } = buildAtlas()
    const karen = nodes.find((n) => n.id === 'karen')!
    expect(karen.pos).toEqual([18, 14, 0])
  })

  it('defaults status to live and ring to false', () => {
    const { nodes } = buildAtlas()
    const gold = nodes.find((n) => n.id === 'gold-standard')!
    expect(gold.status).toBe('live')
    expect(gold.ring).toBe(false)
  })

  it('marks the branch tips as rings and exposes them separately', () => {
    const { nodes, tips } = buildAtlas()
    expect(nodes.find((n) => n.id === 'storyverse')!.ring).toBe(true)
    expect(tips.map((t) => t.id).sort()).toEqual(['future-proof', 'storyverse'])
    expect(tips.find((t) => t.id === 'storyverse')!.route).toBe('/storyverse')
  })
})
