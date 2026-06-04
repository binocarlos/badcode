import { describe, it, expect } from 'vitest'
import { layoutTimeline, sampleTimeline } from './index'

const TWO_STEPS = [
  { id: 'a', phases: { enter: 1, hold: 2, exit: 1 } },
  { id: 'b', phases: { enter: 1, hold: 1, exit: 1 } },
]

describe('layoutTimeline', () => {
  it('adds 0.5-unit bookend pads', () => {
    const { steps, totalHeight } = layoutTimeline(
      [{ id: 'x', phases: { enter: 0, hold: 1, exit: 0 } }],
      100,
    )
    expect(steps[0].enterStart).toBe(50)   // leading pad = 0.5 × 100
    expect(steps[0].holdStart).toBe(50)    // enter = 0
    expect(steps[0].exitStart).toBe(150)   // hold = 1 × 100
    expect(steps[0].end).toBe(150)         // exit = 0
    expect(totalHeight).toBe(200)          // 50 + 100 + 50
  })

  it('steps are adjacent (end(i) === enterStart(i+1))', () => {
    const { steps } = layoutTimeline(TWO_STEPS, 100)
    expect(steps[1].enterStart).toBe(steps[0].end)
  })

  it('total height matches sum-of-phases × unitPx + pads', () => {
    const unitPx = 100
    const { totalHeight } = layoutTimeline(TWO_STEPS, unitPx)
    // phases total = (1+2+1) + (1+1+1) = 4 + 3 = 7 units; pads = 2 × 0.5 = 1 unit
    expect(totalHeight).toBe((4 + 3 + 1) * unitPx)
  })
})

describe('sampleTimeline', () => {
  const layout = layoutTimeline(TWO_STEPS, 100)
  // a: enterStart=50 holdStart=150 exitStart=350 end=450
  // b: enterStart=450 holdStart=550 exitStart=650 end=750
  // totalHeight=800

  it('focus is 0 before first enterStart', () => {
    const { focus, overview } = sampleTimeline(layout, 0)
    expect(focus[0]).toBe(0)
    expect(focus[1]).toBe(0)
    expect(overview).toBe(true)
  })

  it('focus rises linearly during enter', () => {
    const { focus } = sampleTimeline(layout, 100) // midpoint of a.enter (50..150)
    expect(focus[0]).toBeCloseTo(0.5)
    expect(focus[1]).toBe(0)
  })

  it('focus is 1 throughout hold', () => {
    const { focus } = sampleTimeline(layout, 200) // inside a.hold (150..350)
    expect(focus[0]).toBe(1)
    expect(focus[1]).toBe(0)
  })

  it('focus falls during exit', () => {
    const { focus } = sampleTimeline(layout, 400) // midpoint of a.exit (350..450)
    expect(focus[0]).toBeCloseTo(0.5)
    expect(focus[1]).toBe(0)
  })

  it('at most one step has focus > 0 at any position', () => {
    for (let px = 0; px <= 800; px += 5) {
      const { focus } = sampleTimeline(layout, px)
      const active = focus.filter((f) => f > 0).length
      expect(active).toBeLessThanOrEqual(1)
    }
  })

  it('overview is true after last step ends', () => {
    expect(sampleTimeline(layout, 760).overview).toBe(true)  // past b.end=750
    expect(sampleTimeline(layout, 200).overview).toBe(false) // inside a
  })

  it('direction reflects scroll delta', () => {
    expect(sampleTimeline(layout, 200, 100).direction).toBe('fwd')
    expect(sampleTimeline(layout, 100, 200).direction).toBe('bwd')
    expect(sampleTimeline(layout, 200, 200).direction).toBe('none')
  })
})
