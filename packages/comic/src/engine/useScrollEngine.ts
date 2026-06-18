// packages/comic/src/engine/useScrollEngine.ts
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { layoutTimeline, sampleTimeline, type Phases } from '@badcode/scroll-timeline'
import { nextVelocity } from './velocity'

export interface ScrollEngineState {
  /** Per-page scroll progress (0..1) — linear through each page's full span. */
  percents:    number[]
  currentPage: number
  overall:     number
  velocity:    number
  totalHeight: number
}

function arraysClose(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 0.0005) return false
  }
  return true
}

function clamp01(v: number): number { return v < 0 ? 0 : v > 1 ? 1 : v }

const MOBILE_BREAKPOINT = 768
const BASE_SECTION_VH  = 1.0
const MOBILE_SECTION_VH = 0.5

/**
 * Owns the scroll listener and maps scroll position to per-page progress and
 * the current page. rAF-throttled; state updates are coalesced when nothing
 * meaningfully changed to avoid re-render storms.
 *
 * Frame of reference: viewport centre (scrollY + vh/2 - containerTop).
 * This preserves the exact behaviour of the previous computeScrollState impl —
 * the page is "current" when the viewport centre is inside its section.
 */
export function useScrollEngine(
  containerRef: RefObject<HTMLElement>,
  phases: Phases[],
): ScrollEngineState {
  const [viewport, setViewport] = useState(() => ({
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    mobile: typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  }))

  const unitPx = (viewport.mobile ? MOBILE_SECTION_VH : BASE_SECTION_VH) * viewport.height

  const layout = useMemo(() => {
    const stepDefs = phases.map((p, i) => ({ id: String(i), phases: p }))
    return layoutTimeline(stepDefs, unitPx)
  }, [phases, unitPx])

  const [state, setState] = useState<{
    percents:    number[]
    currentPage: number
    overall:     number
    velocity:    number
  }>(() => ({ percents: phases.map(() => 0), currentPage: 0, overall: 0, velocity: 0 }))

  const ticking = useRef(false)
  const lastTs = useRef(0)
  const lastOverall = useRef(0)
  const lastVelocity = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const update = (ts?: number) => {
      ticking.current = false
      const container = containerRef.current
      if (!container) return
      const vh = window.innerHeight
      const scrollTop = window.scrollY
      const containerTop = container.offsetTop
      const containerHeight = container.offsetHeight

      // Viewport-centre reference frame — preserves previous behaviour.
      const relScrollPx = scrollTop + vh / 2 - containerTop

      const sample = sampleTimeline(layout, relScrollPx)

      // Linear progress 0..1 through each step's full span (used by effects).
      const percents = layout.steps.map((step) => {
        const span = step.end - step.enterStart
        return span > 0 ? clamp01((relScrollPx - step.enterStart) / span) : 0
      })

      const maxScroll = Math.max(1, containerHeight - vh)
      const overall = clamp01((scrollTop - containerTop) / maxScroll)

      const now = ts ?? (typeof performance !== 'undefined' ? performance.now() : 0)
      const dt = lastTs.current ? now - lastTs.current : 0
      const velocity = nextVelocity(lastVelocity.current, lastOverall.current, overall, dt)
      lastTs.current = now
      lastOverall.current = overall
      lastVelocity.current = velocity

      setState((prev) => {
        if (
          prev.currentPage === sample.current &&
          Math.abs(prev.overall - overall) < 0.0005 &&
          arraysClose(prev.percents, percents) &&
          Math.abs(prev.velocity - velocity) < 0.01
        ) {
          return prev
        }
        return { percents, currentPage: sample.current, overall, velocity }
      })

      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        lastVelocity.current = 0
        setState((prev) => (prev.velocity === 0 ? prev : { ...prev, velocity: 0 }))
      }, 120)
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [containerRef, layout])

  useEffect(() => {
    const onResize = () =>
      setViewport({
        height: window.innerHeight,
        mobile: window.innerWidth < MOBILE_BREAKPOINT,
      })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    percents:    state.percents,
    currentPage: state.currentPage,
    overall:     state.overall,
    velocity:    state.velocity,
    totalHeight: layout.totalHeight,
  }
}
