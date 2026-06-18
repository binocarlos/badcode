import type { ReactNode } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { computeBubbleVisibility } from '../bubbles/visibility'
import { computeBubbleReveal } from '../bubbles/reveal'
import type { RevealSegment } from '../text/segments'
import { BubbleFactory } from '../bubbles/renderers'
import type { BubbleType, RendererType, TailDirection } from '../bubbles/renderers'
import { markSlot } from './slots'

export interface SpeechBubbleProps {
  /** Horizontal position, percent of the page (0..100). */
  x: number
  /** Vertical position, percent of the page (0..100). */
  y: number
  /** Scroll window [start, end] (0..1) in which the bubble is shown. */
  appearAt?: readonly [number, number]
  /** Fade at the edges of the window instead of a hard cut. */
  fade?: boolean
  type?: BubbleType
  renderer?: RendererType
  tail?: TailDirection
  /** Max width, percent of the page (default 40). */
  width?: number
  background?: string
  color?: string
  textColor?: string
  fontSize?: number
  /** Scroll-scrubbed reveal segments, e.g. [scrollIn(), pause(0.2), fadeOut()].
   *  When set, overrides the simple appearAt+fade visibility. */
  reveal?: RevealSegment[]
  children: ReactNode
}

/** A scroll-gated, absolutely-positioned speech/thought/narration bubble. */
export const SpeechBubble = markSlot(function SpeechBubble({
  x,
  y,
  appearAt,
  fade = false,
  type = 'speech',
  renderer = 'clean',
  tail,
  width = 40,
  background,
  color,
  textColor,
  fontSize,
  reveal,
  children,
}: SpeechBubbleProps) {
  const scrollPercent = useScrollProgress()
  const r = reveal
    ? computeBubbleReveal(scrollPercent, appearAt, reveal)
    : (() => {
        const v = computeBubbleVisibility({ appearAt, fade }, scrollPercent)
        return { visible: v.isVisible, opacity: v.opacity, transform: 'none' }
      })()
  if (!r.visible) return null
  const revealTransform = r.transform === 'none' ? '' : ` ${r.transform}`

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%)${revealTransform}`,
        maxWidth: `${width}%`,
        opacity: r.opacity,
        pointerEvents: 'auto',
        transition: 'opacity 0.12s linear',
      }}
    >
      <BubbleFactory
        type={type}
        renderer={renderer}
        tail={tail}
        background={background}
        color={color}
        textColor={textColor}
        fontSize={fontSize}
      >
        {children}
      </BubbleFactory>
    </div>
  )
}, 'bubble')

export interface NarrationBoxProps extends Omit<SpeechBubbleProps, 'type' | 'tail'> {}

/** A narration caption box (a SpeechBubble with type='narration', no tail). */
export const NarrationBox = markSlot(function NarrationBox(props: NarrationBoxProps) {
  return <SpeechBubble {...props} type="narration" tail="none" />
}, 'bubble')
