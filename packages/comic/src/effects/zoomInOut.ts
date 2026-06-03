import type { EffectInstance } from '../types'
import { defineEffect } from './types'

export interface ZoomInOutOptions {
  /** Peak scale reached at the midpoint of the scroll (default 1.4). */
  peak?: number
}

/**
 * Zoom in to `peak` at the middle of the page's scroll, then back out — a
 * breathing/punch-in move. Ported from the storyteller ZoomInOutEffect.
 */
export function zoomInOut(options: ZoomInOutOptions = {}): EffectInstance {
  const peak = options.peak ?? 1.4
  return defineEffect((el, scrollPercent) => {
    // Triangle wave: 0 at the ends, 1 at the midpoint.
    const t = 1 - Math.abs(scrollPercent - 0.5) * 2
    const s = 1 + t * (peak - 1)
    el.style.transformOrigin = 'center center'
    el.style.transform = `scale(${s})`
    el.style.transition = 'transform 0.1s ease-out'
  })
}
