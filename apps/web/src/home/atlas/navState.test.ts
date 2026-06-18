import { describe, it, expect } from 'vitest'
import { altitudeToLod, focusNode, toGalaxy, withLod, INITIAL_NAV } from './navState'

describe('altitudeToLod', () => {
  it('is galaxy when far out (> 50)', () => {
    expect(altitudeToLod(76)).toBe('galaxy')
    expect(altitudeToLod(51)).toBe('galaxy')
  })
  it('is mid at medium distance (22..50]', () => {
    expect(altitudeToLod(50)).toBe('mid')
    expect(altitudeToLod(30)).toBe('mid')
  })
  it('is node when close (<= 22)', () => {
    expect(altitudeToLod(22)).toBe('node')
    expect(altitudeToLod(12)).toBe('node')
  })
})

describe('nav reducers', () => {
  it('focusNode sets focus and drops to node lod', () => {
    expect(focusNode(INITIAL_NAV, 'camping')).toEqual({ focusId: 'camping', lod: 'node' })
  })
  it('toGalaxy clears focus and rises to galaxy lod', () => {
    expect(toGalaxy({ focusId: 'camping', lod: 'node' })).toEqual({ focusId: null, lod: 'galaxy' })
  })
  it('withLod updates lod without touching focus', () => {
    expect(withLod({ focusId: 'karen', lod: 'node' }, 'mid')).toEqual({ focusId: 'karen', lod: 'mid' })
  })
})
