import { describe, it, expect } from 'vitest'
import { selectRendition, lowestRendition } from './selectRendition'

const R = [
  { height: 480, width: 854, url: 'a' },
  { height: 720, width: 1280, url: 'b' },
  { height: 1080, width: 1920, url: 'c' },
]

describe('selectRendition', () => {
  it('picks the smallest rung >= viewport*dpr', () => {
    expect(selectRendition(R, 600, 1).height).toBe(720)   // need 600 → 720
    expect(selectRendition(R, 400, 1).height).toBe(480)   // need 400 → 480
    expect(selectRendition(R, 700, 1.5).height).toBe(1080) // need 1050 → 1080
  })
  it('uses the largest rung when none reach the target', () => {
    expect(selectRendition(R, 2000, 2).height).toBe(1080)
  })
  it('caps to 480 on Save-Data', () => {
    expect(selectRendition(R, 1080, 2, { saveData: true }).height).toBe(480)
  })
  it('caps to 480 on 2g and 720 on 3g', () => {
    expect(selectRendition(R, 1080, 2, { effectiveType: '2g' }).height).toBe(480)
    expect(selectRendition(R, 1080, 2, { effectiveType: 'slow-2g' }).height).toBe(480)
    expect(selectRendition(R, 1080, 2, { effectiveType: '3g' }).height).toBe(720)
  })
  it('does not exceed the cap even if pixels demand more, but still picks within cap', () => {
    expect(selectRendition(R, 1080, 2, { effectiveType: '3g' }).height).toBe(720)
  })
})

describe('lowestRendition', () => {
  it('returns the smallest rung', () => {
    expect(lowestRendition(R).height).toBe(480)
  })
})
