import type { EffectInstance } from '../types'
import { defineEffect } from './types'

export interface ScaleOptions {
  /** Scale at scroll 0 (default 1). */
  from?: number
  /** Scale at scroll 1 (default 1.2). */
  to?: number
}

/** Linearly scale the widget from `from` to `to` across the page's scroll. */
export function scale(options: ScaleOptions = {}): EffectInstance {
  const from = options.from ?? 1
  const to = options.to ?? 1.2
  return defineEffect((el, scrollPercent) => {
    const s = from + scrollPercent * (to - from)
    el.style.transformOrigin = 'center center'
    el.style.transform = `scale(${s})`
    el.style.transition = 'transform 0.1s ease-out'
  })
}
