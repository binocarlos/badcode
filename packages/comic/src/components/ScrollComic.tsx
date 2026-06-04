import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useScrollEngine } from '../engine/useScrollEngine'
import { useTransitions } from '../engine/useTransitions'
import { EngineContext, PageContext } from '../engine/PageContext'
import type { TransitionInstance } from '../types'
import type { PageProps } from './Page'
import type { Phases } from '@badcode/scroll-timeline'
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
}: ScrollComicProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef(new Map<number, HTMLElement>())

  const pageElements = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<PageProps>[],
    [children],
  )
  const total = pageElements.length

  const phases = useMemo<Phases[]>(
    () =>
      pageElements.map((p) => {
        if (p.props.phases) return p.props.phases
        const d = p.props.scrollDuration ?? 1
        return { enter: 0, hold: d > 0 ? d : 1, exit: 0 }
      }),
    [pageElements],
  )
  const transitions = useMemo<(TransitionInstance | null)[]>(
    () => pageElements.map((p) => p.props.transition ?? null),
    [pageElements],
  )

  const { percents, currentPage, overall, totalHeight } = useScrollEngine(containerRef, phases)

  const getLayer = useCallback((i: number) => layerRefs.current.get(i) ?? null, [])
  const { outgoingPage } = useTransitions(currentPage, transitions, getLayer)

  const registerLayer = useCallback((i: number, el: HTMLElement | null) => {
    if (el) layerRefs.current.set(i, el)
    else layerRefs.current.delete(i)
  }, [])
  const engineValue = useMemo(() => ({ registerLayer }), [registerLayer])

  // Rolling window: current ± 1, plus the outgoing page during a transition.
  const windowIndices = useMemo(() => {
    const set = new Set<number>()
    for (const i of [currentPage - 1, currentPage, currentPage + 1]) {
      if (i >= 0 && i < total) set.add(i)
    }
    if (outgoingPage != null && outgoingPage >= 0 && outgoingPage < total) set.add(outgoingPage)
    return [...set].sort((a, b) => a - b)
  }, [currentPage, outgoingPage, total])

  if (total === 0) return null

  return (
    <EngineContext.Provider value={engineValue}>
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
                {pageElements[i]}
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
    </EngineContext.Provider>
  )
}
