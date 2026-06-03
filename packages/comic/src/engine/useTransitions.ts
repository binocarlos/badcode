import { useEffect, useRef, useState } from 'react'
import type { TransitionInstance } from '../types'

export interface TransitionDriverState {
  /** The page currently animating out, or null when stable. */
  outgoingPage: number | null
  /** Whether a transition is in flight. */
  isTransitioning: boolean
}

function resetLayer(el: HTMLElement | null) {
  if (!el) return
  el.getAnimations().forEach((a) => a.cancel())
  el.style.opacity = ''
  el.style.transform = ''
  el.style.filter = ''
  el.style.clipPath = ''
  el.style.zIndex = ''
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
  const [tick, setTick] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)

  useEffect(() => {
    if (runningRef.current) return
    const to = currentRef.current
    const from = lastRef.current
    if (to === from) return

    const transition = transitions[to] ?? null
    const direction = to > from ? 'forward' : 'backward'

    // Instant cut: just advance.
    if (!transition || transition.duration === 0) {
      lastRef.current = to
      if (currentRef.current !== to) setTick((t) => t + 1)
      return
    }

    runningRef.current = true
    lastRef.current = to
    setOutgoing(from)
    let cancelled = false

    ;(async () => {
      // Let React commit the outgoing/incoming layers before measuring refs.
      await new Promise((r) => requestAnimationFrame(r))
      const incoming = getLayer(to)
      const out = getLayer(from)
      if (incoming) {
        incoming.style.zIndex = '2'
        if (out) out.style.zIndex = '1'
        try {
          await transition.run(out, incoming, direction)
        } catch {
          /* animation cancelled — fall through to reset */
        }
      }
      resetLayer(out)
      resetLayer(incoming)
      runningRef.current = false
      if (!cancelled) {
        setOutgoing(null)
        // Caught more page changes while animating — run again.
        if (currentRef.current !== lastRef.current) setTick((t) => t + 1)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [currentPage, tick, transitions, getLayer])

  return { outgoingPage: outgoing, isTransitioning: outgoing !== null }
}
