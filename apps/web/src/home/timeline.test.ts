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

  it('history steps precede bad steps, bad steps precede good steps', () => {
    const firstBad  = homeSteps.findIndex((s) => s.branch === 'bad')
    const firstGood = homeSteps.findIndex((s) => s.branch === 'good')
    const lastBad   = homeSteps.map((s) => s.branch).lastIndexOf('bad')
    expect(firstBad).toBeGreaterThan(0)            // history comes before bad
    expect(firstGood).toBeGreaterThan(lastBad)     // bad comes before good
  })

  it('camping is present and is live', () => {
    const camping = homeSteps.find((s) => s.id === 'camping')
    expect(camping).toBeDefined()
    expect(camping?.status).toBe('live')
    expect(camping?.route).toBe('/comics/camping')
  })

  it('historical event steps come before content steps', () => {
    const firstContent = homeSteps.findIndex((s) => s.kind !== 'event')
    const lastEventIdx = homeSteps.map((s, i) => s.kind === 'event' ? i : -1).filter(i => i >= 0).at(-1) ?? -1
    expect(lastEventIdx).toBeLessThan(firstContent)
  })

  it('event steps have no route', () => {
    for (const step of homeSteps.filter((s) => s.kind === 'event')) {
      expect(step.route).toBeUndefined()
    }
  })

  it('layouts without error at UNIT_VH=1, unitPx=800', () => {
    const layout = layoutTimeline(homeSteps, UNIT_VH * 800)
    expect(layout.steps.length).toBe(homeSteps.length)
    expect(layout.totalHeight).toBeGreaterThan(0)
  })
})
