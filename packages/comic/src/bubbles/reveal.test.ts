import { describe, it, expect } from 'vitest'
import { bubbleLocalProgress, computeBubbleReveal, visibleWordCount } from './reveal'
import { fadeIn, scrollIn } from '../text/segments'

describe('bubbleLocalProgress', () => {
  it('maps the appearAt window to 0..1', () => {
    expect(bubbleLocalProgress(0.5, [0.4, 0.6])).toBeCloseTo(0.5)
    expect(bubbleLocalProgress(0.4, [0.4, 0.6])).toBeCloseTo(0)
    expect(bubbleLocalProgress(0.6, [0.4, 0.6])).toBeCloseTo(1)
  })
  it('returns scrollPercent unchanged with no window', () => {
    expect(bubbleLocalProgress(0.3, undefined)).toBeCloseTo(0.3)
  })
})

describe('computeBubbleReveal', () => {
  it('is invisible outside the appearAt window', () => {
    expect(computeBubbleReveal(0.1, [0.4, 0.6], [fadeIn()]).visible).toBe(false)
  })
  it('fades in across the early part of the window', () => {
    const early = computeBubbleReveal(0.41, [0.4, 0.6], [fadeIn()])
    const mid = computeBubbleReveal(0.5, [0.4, 0.6], [fadeIn()])
    expect(early.visible).toBe(true)
    expect(early.opacity).toBeLessThan(mid.opacity)
  })
  it('produces a translate transform early when scrollIn is set', () => {
    const early = computeBubbleReveal(0.41, [0.4, 0.6], [scrollIn()])
    expect(early.transform).toContain('translateY')
  })
})

describe('visibleWordCount', () => {
  it('reveals no words at progress 0', () => {
    expect(visibleWordCount(5, 0)).toBe(0)
  })
  it('reveals all words at progress 1', () => {
    expect(visibleWordCount(5, 1)).toBe(5)
  })
  it('reveals a proportional prefix mid-scroll', () => {
    expect(visibleWordCount(6, 0.5)).toBe(3)
  })
  it('clamps out-of-range progress', () => {
    expect(visibleWordCount(4, -1)).toBe(0)
    expect(visibleWordCount(4, 2)).toBe(4)
  })
})
