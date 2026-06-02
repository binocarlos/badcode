import { createContext, useContext } from 'react'

/**
 * Per-page context. Provided by <ScrollComic> around each rendered <Page>, and
 * read by the page and its descendants (bubbles, side text, custom widgets).
 */
export interface PageContextValue {
  /** This page's scroll progress, 0..1. */
  scrollPercent: number
  /** This page's index within the comic. */
  index: number
  /** Whether this is the current (focused) page. */
  isCurrent: boolean
  /** Whether this page's layer should be shown (current or outgoing). */
  visible: boolean
  /** Stacking order for this page's layer. */
  zIndex: number
}

export const PageContext = createContext<PageContextValue | null>(null)

export function usePageContext(): PageContextValue {
  const ctx = useContext(PageContext)
  if (!ctx) {
    throw new Error('usePageContext must be used within a <ScrollComic> page')
  }
  return ctx
}

/**
 * Engine context. Lets each <Page> register its layer element so the transition
 * driver can animate between outgoing and incoming pages.
 */
export interface EngineContextValue {
  registerLayer: (index: number, el: HTMLElement | null) => void
}

export const EngineContext = createContext<EngineContextValue | null>(null)

export function useEngineContext(): EngineContextValue {
  const ctx = useContext(EngineContext)
  if (!ctx) {
    throw new Error('useEngineContext must be used within a <ScrollComic>')
  }
  return ctx
}
