import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { computeSectionLayout, computeScrollState } from './sectionLayout'

export interface ScrollEngineState {
  /** Per-page scroll progress (0..1). */
  percents: number[]
  /** Index of the current (focused) page. */
  currentPage: number
  /** Overall progress through the whole comic (0..1). */
  overall: number
  /** Total height of the scroll track, in px. */
  totalHeight: number
}

function arraysClose(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 0.0005) return false
  }
  return true
}

const MOBILE_BREAKPOINT = 768

/**
 * Owns the scroll listener and maps scroll position to per-page progress and the
 * current page. rAF-throttled, and state updates are coalesced (skipped when
 * nothing meaningfully changed) to avoid re-render storms — a fix over the
 * source, which called setState directly in the scroll handler.
 *
 * @param containerRef - ref to the scroll-track element
 * @param durations - per-page scrollDuration multipliers (stable identity, memoized)
 */
export function useScrollEngine(
  containerRef: RefObject<HTMLElement>,
  durations: number[],
): ScrollEngineState {
  const [viewport, setViewport] = useState(() => ({
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    mobile: typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  }))

  const layout = useMemo(
    () => computeSectionLayout(durations, viewport.height, viewport.mobile),
    [durations, viewport.height, viewport.mobile],
  )

  const [state, setState] = useState<{ percents: number[]; currentPage: number; overall: number }>(
    () => ({ percents: durations.map(() => 0), currentPage: 0, overall: 0 }),
  )

  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      ticking.current = false
      const container = containerRef.current
      if (!container) return
      const vh = window.innerHeight
      const scrollTop = window.scrollY
      const containerTop = container.offsetTop
      const containerHeight = container.offsetHeight

      const { percents, currentPage } = computeScrollState(layout, scrollTop, containerTop, vh)
      const maxScroll = Math.max(1, containerHeight - vh)
      const overall = Math.max(0, Math.min(1, (scrollTop - containerTop) / maxScroll))

      setState((prev) => {
        if (
          prev.currentPage === currentPage &&
          Math.abs(prev.overall - overall) < 0.0005 &&
          arraysClose(prev.percents, percents)
        ) {
          return prev
        }
        return { percents, currentPage, overall }
      })
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update() // initial sync (also re-syncs whenever layout changes)
    return () => window.removeEventListener('scroll', onScroll)
  }, [containerRef, layout])

  useEffect(() => {
    const onResize = () => {
      setViewport({ height: window.innerHeight, mobile: window.innerWidth < MOBILE_BREAKPOINT })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    percents: state.percents,
    currentPage: state.currentPage,
    overall: state.overall,
    totalHeight: layout.totalHeight,
  }
}
