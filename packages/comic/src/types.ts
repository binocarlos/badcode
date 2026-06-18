/**
 * Shared types for @badcode/comic.
 *
 * This library is code-first: authors compose typed React components and drive
 * scroll-linked animation with factory functions. There is no config JSON and no
 * editor — the types here are the public contract.
 */

/** A normalized [x, y] point in the 0..1 range (e.g. a zoom focal point). */
export type Point = [number, number]

/**
 * Direction of travel when the current page changes.
 * - 'forward': scrolling down (to a later page)
 * - 'backward': scrolling up (to an earlier page)
 */
export type ScrollDirection = 'forward' | 'backward'

/**
 * Live, per-frame context passed to an effect's `apply` as an optional 3rd arg.
 * `scrollPercent` duplicates the 2nd positional arg (kept for back-compat).
 * `velocity` is smoothed scroll speed (overall-fraction per second). `pointer`
 * and `audio` are reserved for later phases and are `null` until then.
 */
export interface EffectContext {
  scrollPercent: number
  velocity: number
  pointer: { x: number; y: number } | null
  audio: { bass: number; mid: number; high: number; beat: boolean } | null
}

/**
 * A scroll-linked, continuous visual effect applied to a page's widget element.
 *
 * `apply` runs on every scroll frame with the page's scroll progress (0..1) and
 * mutates the element's inline style directly. `cleanup` resets whatever `apply`
 * touched. Build one with `defineEffect` or import a built-in from
 * `@badcode/comic/effects`.
 */
export interface EffectInstance {
  apply: (el: HTMLElement, scrollPercent: number, ctx?: EffectContext) => void
  cleanup: (el: HTMLElement) => void
}

/**
 * A time-based page transition, fired when the current page changes (NOT
 * scroll-linked). `run` animates between the outgoing and incoming page layers
 * using the Web Animation API and resolves when the animation completes.
 * Build one with `defineTransition` or import a built-in from
 * `@badcode/comic/transitions`.
 */
export interface TransitionInstance {
  /** Animation duration in milliseconds. */
  duration: number
  run: (
    outgoing: HTMLElement | null,
    incoming: HTMLElement,
    direction: ScrollDirection,
  ) => Promise<void>
}
