import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useScrollEngine } from '../engine/useScrollEngine'
import { useTransitions } from '../engine/useTransitions'
import { EngineContext, PageContext, MotionContext } from '../engine/PageContext'
import type { TransitionInstance } from '../types'
import type { PageProps } from './Page'
import type { Phases } from '@badcode/scroll-timeline'
import { resolvePage } from './pageDefaults'
import { GrainOverlay } from './GrainOverlay'
import '../styles/comic.css'

export interface ScrollComicProps {
  /** A sequence of <Page> elements. */
  children: ReactNode
  /** Show a thin progress bar across the top. */
  progressBar?: boolean
  /** Show a "01 / 04" page indicator bottom-left. */
  pageIndicator?: boolean
  /** Show a bouncing "scroll to explore" hint until the reader scrolls. */
  scrollHint?: boolean
  /** Text of the scroll hint (default "Scroll to explore ↓"). */
  hintText?: string
  /** Page props every <Page> inherits unless it sets its own (explicit prop wins). */
  pageDefaults?: Partial<PageProps>
  /** Animated film-grain coat over the whole comic (opt-in). */
  grain?: boolean
  /** Radial vignette over the whole comic (opt-in). */
  vignette?: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The scroll-driven comic container. Pins a full-viewport stage while the reader
 * scrolls through a tall track; maps scroll position to per-page progress and
 * the current page; and runs page transitions. Pages are authored as children.
 */
export function ScrollComic({
  children,
  progressBar = false,
  pageIndicator = false,
  scrollHint = false,
  hintText = 'Scroll to explore ↓',
  pageDefaults,
  grain = false,
  vignette = false,
}: ScrollComicProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef(new Map<number, HTMLElement>())

  const pageElements = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<PageProps>[],
    [children],
  )
  const total = pageElements.length

  const resolved = useMemo<ReturnType<typeof resolvePage>[]>(
    () => pageElements.map((p) => resolvePage(p.props, pageDefaults)),
    [pageElements, pageDefaults],
  )
  const phases = useMemo<Phases[]>(() => resolved.map((r) => r.phases), [resolved])
  const transitions = useMemo<(TransitionInstance | null)[]>(
    () => resolved.map((r) => r.transition),
    [resolved],
  )

  const { percents, currentPage, overall, totalHeight, velocity } = useScrollEngine(containerRef, phases)

  const getLayer = useCallback((i: number) => layerRefs.current.get(i) ?? null, [])
  const { outgoingPage } = useTransitions(currentPage, transitions, getLayer)

  const registerLayer = useCallback((i: number, el: HTMLElement | null) => {
    if (el) layerRefs.current.set(i, el)
    else layerRefs.current.delete(i)
  }, [])
  const engineValue = useMemo(() => ({ registerLayer }), [registerLayer])

  const motionValue = useMemo(
    () => ({ velocity, pointer: null, audio: null }),
    [velocity],
  )

  // Rolling window: current ± 2 (preloads two pages ahead/behind to beat fast-scroll),
  // plus the outgoing page during a transition. Only current + outgoing are *visible*;
  // the rest are mounted-but-hidden so their assets fetch early.
  const windowIndices = useMemo(() => {
    const set = new Set<number>()
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i >= 0 && i < total) set.add(i)
    }
    if (outgoingPage != null && outgoingPage >= 0 && outgoingPage < total) set.add(outgoingPage)
    return [...set].sort((a, b) => a - b)
  }, [currentPage, outgoingPage, total])

  if (total === 0) return null

  return (
    <EngineContext.Provider value={engineValue}>
      <MotionContext.Provider value={motionValue}>
        <div ref={containerRef} className="badcode-comic" style={{ height: totalHeight }}>
          <div className="badcode-comic__stage">
            {windowIndices.map((i) => {
              const isCurrent = i === currentPage
              const visible = isCurrent || i === outgoingPage
              const zIndex = isCurrent ? 2 : i === outgoingPage ? 1 : 0
              return (
                <PageContext.Provider
                  key={i}
                  value={{ scrollPercent: percents[i] ?? 0, index: i, isCurrent, visible, zIndex }}
                >
                  {cloneElement(pageElements[i], {
                    effect: resolved[i].effect,
                    background: resolved[i].background,
                  })}
                </PageContext.Provider>
              )
            })}
          </div>
        </div>
        {progressBar && (
          <div className="badcode-comic__progress" style={{ width: `${overall * 100}%` }} />
        )}
        {pageIndicator && (
          <div className="badcode-comic__indicator">
            {pad(currentPage + 1)} / {pad(total)}
          </div>
        )}
        {scrollHint && overall < 0.02 && <div className="badcode-comic__hint">{hintText}</div>}
        <GrainOverlay grain={grain} vignette={vignette} />
      </MotionContext.Provider>
    </EngineContext.Provider>
  )
}
