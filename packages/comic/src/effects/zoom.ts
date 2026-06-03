import type { EffectInstance, Point } from '../types'
import { defineEffect, clamp01 } from './types'

export interface ZoomOptions {
  /** Scale reached at the end of the page's scroll (default 1.5). */
  amount?: number
  /** Focal point to zoom toward, as [x, y] in 0..1 (default center). */
  focal?: Point
  /** [start, end] portion of the scroll over which the zoom happens (default [0, 1]). */
  range?: readonly [number, number]
}

/**
 * Zoom into a focal point as the page scrolls. Ported from the storyteller
 * ZoomEffect, with typed options replacing the stringly config.
 */
export function zoom(options: ZoomOptions = {}): EffectInstance {
  const amount = options.amount ?? 1.5
  const [fx, fy] = options.focal ?? [0.5, 0.5]
  const [start, end] = options.range ?? [0, 1]

  return defineEffect((el, scrollPercent) => {
    const span = end - start
    const local = span > 0 ? clamp01((scrollPercent - start) / span) : scrollPercent
    const scale = 1 + local * (amount - 1)
    el.style.transformOrigin = `${fx * 100}% ${fy * 100}%`
    el.style.transform = `scale(${scale})`
    el.style.transition = 'transform 0.1s ease-out'
  })
}
