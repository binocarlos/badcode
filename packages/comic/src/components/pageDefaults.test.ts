import { describe, it, expect } from 'vitest'
import { resolvePage } from './pageDefaults'
import type { TransitionInstance, EffectInstance } from '../types'

const tx = (duration: number): TransitionInstance => ({ duration, run: async () => {} })
const fx = (): EffectInstance => ({ apply: () => {}, cleanup: () => {} })

describe('resolvePage timing', () => {
  it('defaults to library hold=1 when nothing is set', () => {
    expect(resolvePage({}).phases).toEqual({ enter: 0, hold: 1, exit: 0 })
  })
  it('uses page.hold as the hold phase', () => {
    expect(resolvePage({ hold: 2.8 }).phases).toEqual({ enter: 0, hold: 2.8, exit: 0 })
  })
  it('prefers phases over hold over scrollDuration within a level', () => {
    expect(resolvePage({ phases: { enter: 1, hold: 2, exit: 3 }, hold: 9, scrollDuration: 5 }).phases)
      .toEqual({ enter: 1, hold: 2, exit: 3 })
    expect(resolvePage({ hold: 4, scrollDuration: 5 }).phases).toEqual({ enter: 0, hold: 4, exit: 0 })
  })
  it('lets a page timing prop fully override a default timing prop', () => {
    expect(resolvePage({ hold: 2 }, { phases: { enter: 0, hold: 9, exit: 0 } }).phases)
      .toEqual({ enter: 0, hold: 2, exit: 0 })
  })
  it('falls back to default timing when the page sets none', () => {
    expect(resolvePage({}, { hold: 3 }).phases).toEqual({ enter: 0, hold: 3, exit: 0 })
  })
  it('guards a non-positive hold to 1', () => {
    expect(resolvePage({ hold: 0 }).phases).toEqual({ enter: 0, hold: 1, exit: 0 })
  })
})

describe('resolvePage transition', () => {
  it('defaults to a crossfade instance', () => {
    expect(resolvePage({}).transition).not.toBeNull()
    expect(resolvePage({}).transition?.duration).toBeGreaterThan(0)
  })
  it('explicit null means no transition (does NOT inherit the default)', () => {
    expect(resolvePage({ transition: null }).transition).toBeNull()
  })
  it('page transition beats defaults beats library', () => {
    const a = tx(100), b = tx(200)
    expect(resolvePage({ transition: a }, { transition: b }).transition).toBe(a)
    expect(resolvePage({}, { transition: b }).transition).toBe(b)
  })
})

describe('resolvePage effect + background', () => {
  it('defaults effect to null and background to undefined', () => {
    expect(resolvePage({}).effect).toBeNull()
    expect(resolvePage({}).background).toBeUndefined()
  })
  it('merges background page-over-defaults', () => {
    expect(resolvePage({}, { background: '#0a0f1c' }).background).toBe('#0a0f1c')
    expect(resolvePage({ background: '#fff' }, { background: '#000' }).background).toBe('#fff')
  })
  it('merges effect page-over-defaults; explicit null wins', () => {
    const e = fx()
    expect(resolvePage({ effect: e }).effect).toBe(e)
    expect(resolvePage({ effect: null }, { effect: e }).effect).toBeNull()
  })
})
