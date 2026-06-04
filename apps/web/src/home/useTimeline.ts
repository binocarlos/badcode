import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { layoutTimeline, sampleTimeline, type TimelineLayout, type TimelineSample } from '@badcode/scroll-timeline'
import { homeSteps, UNIT_VH } from './timeline'

export interface UseTimelineResult {
  sample: TimelineSample
  layout: TimelineLayout
}

const INITIAL_SAMPLE: TimelineSample = {
  focus:     homeSteps.map(() => 0),
  current:   0,
  overview:  true,
  position:  0,
  direction: 'none',
}

/**
 * Owns the scroll track for the homepage.
 * - Computes unitPx = window.innerHeight × UNIT_VH (responsive)
 * - Calls layoutTimeline(homeSteps, unitPx) — memoised on resize
 * - Calls sampleTimeline on each scroll frame → returns { sample, layout }
 * - Caller (Scene.tsx) sets the scroll-driver div height to layout.totalHeight
 */
export function useTimeline(): UseTimelineResult {
  const [unitPx, setUnitPx] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight * UNIT_VH : 800,
  )

  const layout = useMemo(() => layoutTimeline(homeSteps, unitPx), [unitPx])

  const [sample, setSample] = useState<TimelineSample>(INITIAL_SAMPLE)
  const prevScrollY = useRef(0)
  const ticking = useRef(false)

  const update = useCallback(() => {
    ticking.current = false
    const scrollY = window.scrollY
    const next = sampleTimeline(layout, scrollY, prevScrollY.current)
    prevScrollY.current = scrollY
    setSample((prev) => {
      // Skip re-render if nothing meaningful changed.
      if (
        prev.overview === next.overview &&
        prev.current === next.current &&
        Math.abs(prev.position - next.position) < 0.001 &&
        prev.focus.every((f, i) => Math.abs(f - next.focus[i]) < 0.001)
      ) {
        return prev
      }
      return next
    })
  }, [layout])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [update])

  useEffect(() => {
    const onResize = () => setUnitPx(window.innerHeight * UNIT_VH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return { sample, layout }
}
