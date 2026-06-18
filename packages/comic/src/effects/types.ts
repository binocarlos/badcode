import type { EffectInstance } from '../types'

export type { EffectInstance } from '../types'

/**
 * Build a custom scroll-linked effect. `apply` runs every scroll frame with the
 * page's progress (0..1) and mutates the element's inline style; `cleanup`
 * resets whatever it touched (defaults to clearing transform/filter/opacity).
 *
 * @example
 * const slideUp = (px: number) => defineEffect((el, p) => {
 *   el.style.transform = `translateY(${(1 - p) * px}px)`
 * })
 */
export function defineEffect(
  apply: (el: HTMLElement, scrollPercent: number, ctx?: import('../types').EffectContext) => void,
  cleanup?: (el: HTMLElement) => void,
): EffectInstance {
  return {
    apply,
    cleanup:
      cleanup ??
      ((el: HTMLElement) => {
        el.style.transform = ''
        el.style.transformOrigin = ''
        el.style.filter = ''
        el.style.opacity = ''
        el.style.transition = ''
      }),
  }
}

/** Clamp a value to the 0..1 range. */
export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}
