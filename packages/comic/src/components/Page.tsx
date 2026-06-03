import { useEffect, useRef, type ReactNode } from 'react'
import { usePageContext, useEngineContext } from '../engine/PageContext'
import { useScrollEffect } from '../hooks/useScrollEffect'
import { sortChildren } from './slots'
import type { EffectInstance, TransitionInstance } from '../types'

export interface PageProps {
  /**
   * How many viewport-heights of scroll this page occupies (default 1). Longer
   * pages give effects and text reveals more room to breathe.
   */
  scrollDuration?: number
  /**
   * Transition played when this page becomes current (read by <ScrollComic>).
   * Omit for an instant cut.
   */
  transition?: TransitionInstance | null
  /** Scroll-linked effect applied to this page's widget (e.g. zoom({...})). */
  effect?: EffectInstance | ((el: HTMLElement, scrollPercent: number) => void) | null
  /** Background shown behind the widget (e.g. while an image loads). */
  background?: string
  /** ImageWidget/AnimationWidget, SpeechBubble/NarrationBox, and SidePanelText. */
  children: ReactNode
}

/**
 * A single comic page. Sorts its children into a widget layer, an overlaid
 * bubble layer, and side-text, applies the scroll-linked effect to the widget,
 * and registers its layer element so transitions can animate it.
 */
export function Page({ effect, background, children }: PageProps) {
  const { index, visible, zIndex } = usePageContext()
  const { registerLayer } = useEngineContext()
  const layerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerLayer(index, layerRef.current)
    return () => registerLayer(index, null)
  }, [index, registerLayer])

  useScrollEffect(widgetRef, effect)

  const { widget, bubble, side } = sortChildren(children)

  return (
    <div
      ref={layerRef}
      className="badcode-comic__layer"
      style={{ display: visible ? 'block' : 'none', zIndex, background }}
    >
      <div ref={widgetRef} className="badcode-comic__widget">
        {widget}
      </div>
      {bubble.length > 0 && <div className="badcode-comic__bubbles">{bubble}</div>}
      {side}
    </div>
  )
}
