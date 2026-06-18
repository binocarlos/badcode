import { describe, it, expect } from 'vitest'
import { pushIn, dipToBlack, lightDissolve } from './builtins'

describe('cinematic transitions', () => {
  it('pushIn defaults to a slow 900ms and exposes a run fn', () => {
    const t = pushIn()
    expect(t.duration).toBe(900)
    expect(typeof t.run).toBe('function')
  })
  it('dipToBlack honors a custom duration', () => {
    expect(dipToBlack({ duration: 1200 }).duration).toBe(1200)
  })
  it('lightDissolve defaults to 800ms', () => {
    expect(lightDissolve().duration).toBe(800)
  })
})
