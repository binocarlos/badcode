import type { CSSProperties } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { markSlot } from './slots'

export interface AnimationWidgetProps {
  /** Ordered frame image URLs; scrubbed by scroll progress. */
  frames: string[]
  alt?: string
  objectPosition?: string
  fit?: CSSProperties['objectFit']
}

/**
 * Plays a sequence of frames, scrubbed by the page's scroll progress (frame 0 at
 * the top, last frame at the bottom). Extracted from the storyteller animation
 * widget's playback path — none of its editor/upload machinery.
 */
export const AnimationWidget = markSlot(function AnimationWidget({
  frames,
  alt = '',
  objectPosition = 'center',
  fit = 'cover',
}: AnimationWidgetProps) {
  const progress = useScrollProgress()
  if (frames.length === 0) return null
  const index = Math.max(0, Math.min(frames.length - 1, Math.floor(progress * frames.length)))
  return (
    <img
      src={frames[index]}
      alt={alt}
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: fit,
        objectPosition,
        display: 'block',
        userSelect: 'none',
      }}
    />
  )
}, 'widget')
