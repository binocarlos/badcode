import type { ScrollDirection, TransitionInstance } from '../types'

export type { ScrollDirection, TransitionInstance } from '../types'

/**
 * Build a custom page transition. `run` animates between the outgoing and
 * incoming page layers (Web Animation API) and resolves when done. The engine
 * resets inline styles on both elements afterward, so transitions need only run
 * the animation.
 *
 * @example
 * const fade = (duration = 500) => defineTransition(duration, async (out, inc) => {
 *   await Promise.all([
 *     out?.animate([{opacity:1},{opacity:0}], {duration, fill:'forwards'}).finished,
 *     inc.animate([{opacity:0},{opacity:1}], {duration, fill:'forwards'}).finished,
 *   ].filter(Boolean))
 * })
 */
export function defineTransition(
  duration: number,
  run: (
    outgoing: HTMLElement | null,
    incoming: HTMLElement,
    direction: ScrollDirection,
  ) => Promise<void>,
): TransitionInstance {
  return { duration, run }
}

/** Await an Animation's completion, tolerating cancellation. */
export async function settle(...animations: (Animation | undefined)[]): Promise<void> {
  await Promise.all(
    animations.filter(Boolean).map((a) => (a as Animation).finished.catch(() => {})),
  )
}
