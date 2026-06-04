import { describe, it, expect } from 'vitest'
import { bespokePose, interpolatePoses } from './behaviors'
import type { CameraBehaviorCtx } from './timeline'

const A = { position: [0, 0, 10] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] }
const B = { position: [10, 0, 10] as [number, number, number], lookAt: [10, 0, 0] as [number, number, number] }

const ctx = (focus: number): CameraBehaviorCtx => ({ focus, prev: A, self: B, next: B })

describe('bespokePose', () => {
  it('returns self regardless of focus', () => {
    expect(bespokePose(ctx(0))).toEqual(B)
    expect(bespokePose(ctx(0.5))).toEqual(B)
    expect(bespokePose(ctx(1))).toEqual(B)
  })
})

describe('interpolatePoses', () => {
  it('returns prev when focus = 0', () => {
    const r = interpolatePoses({ focus: 0, prev: A, self: B, next: B })
    expect(r.position[0]).toBeCloseTo(A.position[0])
    expect(r.lookAt[0]).toBeCloseTo(A.lookAt[0])
  })

  it('returns next when focus = 1', () => {
    const r = interpolatePoses({ focus: 1, prev: A, self: B, next: B })
    expect(r.position[0]).toBeCloseTo(B.position[0])
    expect(r.lookAt[0]).toBeCloseTo(B.lookAt[0])
  })

  it('interpolates midpoint at focus = 0.5', () => {
    const r = interpolatePoses({ focus: 0.5, prev: A, self: B, next: B })
    expect(r.position[0]).toBeCloseTo(5)
    expect(r.lookAt[0]).toBeCloseTo(5)
  })
})
