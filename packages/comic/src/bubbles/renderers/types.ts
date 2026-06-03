import type { ReactNode } from 'react'

export type BubbleType = 'speech' | 'thought' | 'narration'
export type RendererType = 'clean' | 'rough'

/** Where the tail points, for speech/thought bubbles. */
export type TailDirection =
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'none'

export interface BubbleRendererProps {
  type: BubbleType
  children: ReactNode
  /** Tail direction (ignored for narration). Default 'bottom-left'. */
  tail?: TailDirection
  /** Fill color of the bubble body. */
  background?: string
  /** Outline / stroke color. */
  color?: string
  /** Text color. */
  textColor?: string
  /** Font size in px. */
  fontSize?: number
}
