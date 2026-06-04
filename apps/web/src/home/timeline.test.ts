import { describe, it, expect } from 'vitest'
import { homeSteps, UNIT_VH } from './timeline'
import { layoutTimeline } from '@badcode/scroll-timeline'

describe('homeSteps', () => {
  it('every step has a unique id', () => {
    const ids = homeSteps.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every step has valid phases (all >= 0)', () => {
    for (const step of homeSteps) {
      expect(step.phases.enter).toBeGreaterThanOrEqual(0)
      expect(step.phases.hold).toBeGreaterThanOrEqual(0)
      expect(step.phases.exit).toBeGreaterThanOrEqual(0)
    }
  })

  it('bad-branch steps come before good-branch steps', () => {
    const firstGood = homeSteps.findIndex((s) => s.branch === 'good')
    const lastBad   = homeSteps.map((s) => s.branch).lastIndexOf('bad')
    expect(firstGood).toBeGreaterThan(lastBad)
  })

  it('camping is the first step and is live', () => {
    const camping = homeSteps[0]
    expect(camping.id).toBe('camping')
    expect(camping.status).toBe('live')
    expect(camping.route).toBe('/comics/camping')
  })

  it('layouts without error at UNIT_VH=1, unitPx=800', () => {
    const layout = layoutTimeline(homeSteps, UNIT_VH * 800)
    expect(layout.steps.length).toBe(homeSteps.length)
    expect(layout.totalHeight).toBeGreaterThan(0)
  })
})
