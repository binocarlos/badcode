import type { EffectInstance } from '../types'
import { defineEffect } from './types'

export interface GrayscaleOptions {
  /** Reverse it: start black & white, gain color as you scroll. */
  invert?: boolean
}

/**
 * Fade from color to black & white as the page scrolls (or the reverse).
 * Ported from the storyteller GrayscaleEffect.
 */
export function grayscale(options: GrayscaleOptions = {}): EffectInstance {
  const invert = options.invert ?? false
  return defineEffect((el, scrollPercent) => {
    const value = invert ? 1 - scrollPercent : scrollPercent
    el.style.filter = `grayscale(${value})`
    el.style.transition = 'filter 0.1s ease-out'
  })
}
