import { describe, it, expect } from 'vitest'
import { isInstantCut, resetLayer } from './useTransitions'
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

describe('resetLayer', () => {
  function fakeEl(style: Record<string, string>) {
    let cancelled = 0
    const el = {
      style,
      getAnimations: () => [{ cancel: () => { cancelled++ } }],
    } as unknown as HTMLElement
    return { el, cancels: () => cancelled }
  }

  it('cancels animations and clears transform/opacity but PRESERVES zIndex', () => {
    // Clearing zIndex would drop the layer to `auto`; React won't rewrite an
    // unchanged prop, so the old page paints on top for a frame (the flicker).
    const { el, cancels } = fakeEl({
      opacity: '0', transform: 'scale(1.2)', filter: 'blur(2px)', clipPath: 'inset(0)', zIndex: '1',
    })
    resetLayer(el)
    expect(el.style.opacity).toBe('')
    expect(el.style.transform).toBe('')
    expect(el.style.filter).toBe('')
    expect(el.style.clipPath).toBe('')
    expect(el.style.zIndex).toBe('1') // preserved — owned by React
    expect(cancels()).toBe(1)
  })

  it('is a no-op for null', () => {
    expect(() => resetLayer(null)).not.toThrow()
  })
})
