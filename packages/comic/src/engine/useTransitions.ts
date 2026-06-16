import { useEffect, useRef, useState } from 'react'
import type { TransitionInstance } from '../types'

export interface TransitionDriverState {
  /** The page currently animating out, or null when stable. */
  outgoingPage: number | null
  /** Whether a transition is in flight. */
  isTransitioning: boolean
}

export function resetLayer(el: HTMLElement | null) {
  if (!el) return
  el.getAnimations().forEach((a) => a.cancel())
  el.style.opacity = ''
  el.style.transform = ''
  el.style.filter = ''
  el.style.clipPath = ''
  // NB: do NOT clear zIndex here. Cancelling the fade snaps the outgoing layer's
  // opacity back to 1 for the frame before React hides it; z-ordering is what keeps
  // it behind the incoming page during that frame. Clearing the inline zIndex drops
  // both layers to `auto` (React skips the DOM write because its zIndex prop is
  // unchanged), so they paint in DOM order — and scrolling up that puts the OLD page
  // on top for one frame. That is the end-of-transition flicker. zIndex is owned by
  // React via PageContext (current = 2, outgoing = 1); leave it alone.
}

/**
 * Whether moving from page `from` to `to` should be an instant cut rather than an
 * animated transition. Cut when there is no transition (or a zero-duration one),
 * or when the reader has jumped more than one page — replaying a transition for a
 * page already scrolled past flashes a stale image over the current one.
 */
export function isInstantCut(
  from: number,
  to: number,
  transition: TransitionInstance | null,
): boolean {
  return !transition || transition.duration === 0 || Math.abs(to - from) !== 1
}

/**
 * Watches the current page and, when it changes, runs the incoming page's
 * transition between the outgoing and incoming layer elements (Web Animation
 * API). Holds an in-flight lock and, on completion, catches up if the page moved
 * again mid-transition. Inline styles are reset on both layers afterward.
 *
 * @param currentPage - the focused page index from the scroll engine
 * @param transitions - per-page incoming transition (null = instant cut)
 * @param getLayer - resolve a page index to its registered layer element
 */
export function useTransitions(
  currentPage: number,
  transitions: (TransitionInstance | null)[],
  getLayer: (index: number) => HTMLElement | null,
): TransitionDriverState {
  const currentRef = useRef(currentPage)
  currentRef.current = currentPage
  const lastRef = useRef(0)
  const runningRef = useRef(false)
  const mountedRef = useRef(true)
  const [tick, setTick] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (runningRef.current) return
    const to = currentRef.current
    const from = lastRef.current
    if (to === from) return

    const transition = transitions[to] ?? null
    const direction = to > from ? 'forward' : 'backward'

    // Instant cut: advance without animating, and make sure no outgoing page
    // lingers (a multi-page jump must not leave an intermediate page painted).
    if (isInstantCut(from, to, transition)) {
      lastRef.current = to
      setOutgoing(null)
      if (currentRef.current !== to) setTick((t) => t + 1)
      return
    }

    runningRef.current = true
    lastRef.current = to
    setOutgoing(from)

    ;(async () => {
      // Let React commit the outgoing/incoming layers before measuring refs.
      await new Promise((r) => requestAnimationFrame(r))
      const incoming = getLayer(to)
      const out = getLayer(from)
      if (incoming) {
        incoming.style.zIndex = '2'
        if (out) out.style.zIndex = '1'
        try {
          await transition!.run(out, incoming, direction)
        } catch {
          /* animation cancelled — fall through to reset */
        }
      }
      resetLayer(out)
      resetLayer(incoming)
      runningRef.current = false
      // Always clear the outgoing page once the animation ends — even if the
      // reader scrolled on mid-transition. Leaving it set keeps the previous
      // page painted under the current one (the scroll "flicker"). The catch-up
      // tick then reconciles to wherever the reader actually is now.
      if (mountedRef.current) {
        setOutgoing(null)
        if (currentRef.current !== lastRef.current) setTick((t) => t + 1)
      }
    })()
  }, [currentPage, tick, transitions, getLayer])

  return { outgoingPage: outgoing, isTransitioning: outgoing !== null }
}
