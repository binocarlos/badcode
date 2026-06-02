/**
 * Scroll-gated bubble visibility.
 *
 * Ported and simplified from the storyteller engine's per-bubble timing (the
 * approach it documented as "preferred" over scene grouping). A bubble can be
 * gated to a scroll window `appearAt: [start, end]` and optionally fade at the
 * edges of that window.
 */

const FADE_ZONE = 0.1 // fraction of the window used for fade in / out

export interface BubbleVisibility {
  opacity: number
  isVisible: boolean
}

export interface BubbleTiming {
  /** [start, end] scroll window (0..1) in which the bubble is shown. */
  appearAt?: readonly [number, number]
  /** Fade in/out at the edges of the window instead of hard cut. */
  fade?: boolean
}

/**
 * Compute opacity + visibility for a bubble at a given scroll position.
 * With no `appearAt`, the bubble is always visible.
 *
 * @param timing - the bubble's scroll window and fade preference
 * @param scrollPercent - current scroll progress through the page (0..1)
 */
export function computeBubbleVisibility(
  timing: BubbleTiming,
  scrollPercent: number,
): BubbleVisibility {
  if (!timing.appearAt) {
    return { opacity: 1, isVisible: true }
  }

  const [start, end] = timing.appearAt

  if (scrollPercent < start || scrollPercent > end) {
    return { opacity: 0, isVisible: false }
  }

  let opacity = 1
  if (timing.fade) {
    const range = end - start
    if (range > 0) {
      const positionInRange = (scrollPercent - start) / range
      if (positionInRange < FADE_ZONE) {
        opacity = positionInRange / FADE_ZONE
      } else if (positionInRange > 1 - FADE_ZONE) {
        opacity = (1 - positionInRange) / FADE_ZONE
      }
    }
  }

  return { opacity: Math.max(0, Math.min(1, opacity)), isVisible: true }
}
