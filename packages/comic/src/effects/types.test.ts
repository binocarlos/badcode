import { describe, it, expect } from 'vitest'
import { defineEffect } from './types'
import type { EffectContext } from '../types'

describe('defineEffect context arg', () => {
  it('forwards the optional EffectContext to apply', () => {
    let seen: EffectContext | undefined
    const e = defineEffect((_el, _p, ctx) => { seen = ctx })
    const ctx: EffectContext = { scrollPercent: 0.5, velocity: 2, pointer: null, audio: null }
    e.apply({} as HTMLElement, 0.5, ctx)
    expect(seen).toEqual(ctx)
  })

  it('still works for a legacy two-arg apply (no context)', () => {
    let pct = -1
    const e = defineEffect((_el, p) => { pct = p })
    e.apply({} as HTMLElement, 0.42)
    expect(pct).toBe(0.42)
  })
})
