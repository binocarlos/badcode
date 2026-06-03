import type { EffectInstance } from '../types'
import { defineEffect } from './types'

export interface PanOptions {
  /** Horizontal travel across the scroll, in percent of the element (default 0). */
  x?: number
  /** Vertical travel across the scroll, in percent of the element (default 0). */
  y?: number
  /** Constant scale to hold while panning, so edges don't show (default 1.15). */
  scale?: number
}

/**
 * Pan (and optionally hold a slight zoom on) the widget across the page scroll —
 * a Ken Burns-style move. `x`/`y` are percentages of the element's own size.
 */
export function pan(options: PanOptions = {}): EffectInstance {
  const x = options.x ?? 0
  const y = options.y ?? 0
  const scale = options.scale ?? 1.15
  return defineEffect((el, scrollPercent) => {
    const tx = scrollPercent * x
    const ty = scrollPercent * y
    el.style.transform = `scale(${scale}) translate(${tx}%, ${ty}%)`
    el.style.transition = 'transform 0.1s ease-out'
  })
}
