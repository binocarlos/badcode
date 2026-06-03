import { describe, it, expect } from 'vitest'
import { shouldUse2D } from './environment'

describe('shouldUse2D', () => {
  it('falls back to 2D when reduced motion is requested', () => {
    expect(shouldUse2D({ reducedMotion: true, webglAvailable: true })).toBe(true)
  })

  it('falls back to 2D when WebGL is unavailable', () => {
    expect(shouldUse2D({ reducedMotion: false, webglAvailable: false })).toBe(true)
  })

  it('uses 3D when motion is allowed and WebGL is available', () => {
    expect(shouldUse2D({ reducedMotion: false, webglAvailable: true })).toBe(false)
  })
})
