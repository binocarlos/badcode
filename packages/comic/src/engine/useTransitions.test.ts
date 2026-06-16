import { describe, it, expect } from 'vitest'
import { isInstantCut } from './useTransitions'
import type { TransitionInstance } from '../types'

const tx = (duration: number): TransitionInstance => ({
  duration,
  run: async () => {},
})

describe('isInstantCut', () => {
  it('cuts when there is no transition', () => {
    expect(isInstantCut(0, 1, null)).toBe(true)
  })

  it('cuts when the transition has zero duration', () => {
    expect(isInstantCut(0, 1, tx(0))).toBe(true)
  })

  it('animates a single-page step', () => {
    expect(isInstantCut(0, 1, tx(600))).toBe(false)
    expect(isInstantCut(3, 2, tx(600))).toBe(false)
  })

  it('cuts a multi-page jump so stale intermediate pages are not replayed', () => {
    expect(isInstantCut(0, 5, tx(600))).toBe(true)
    expect(isInstantCut(8, 2, tx(600))).toBe(true)
  })
})
