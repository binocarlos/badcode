// packages/comic/src/bubbles/reveal.ts
import { computeTextEffectStyles } from '../text/computeTextStyles'
import { buildTextConfig, type RevealSegment } from '../text/segments'

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/** Map page scroll into 0..1 progress within a bubble's appearAt window. */
export function bubbleLocalProgress(
  scrollPercent: number,
  appearAt?: readonly [number, number],
): number {
  if (!appearAt) return scrollPercent
  const [start, end] = appearAt
  const span = end - start
  return span > 0 ? clamp01((scrollPercent - start) / span) : 0
}

export interface BubbleReveal {
  visible: boolean
  opacity: number
  transform: string
}

/**
 * Scroll-scrubbed bubble reveal: drives opacity + transform through the same
 * scroll-linked text-effect engine SidePanelText uses, keyed to the bubble's
 * appearAt window. The reader scrubs the bubble in as they scroll.
 */
export function computeBubbleReveal(
  scrollPercent: number,
  appearAt: readonly [number, number] | undefined,
  reveal: RevealSegment[],
): BubbleReveal {
  const visible = appearAt ? scrollPercent >= appearAt[0] && scrollPercent <= appearAt[1] : true
  const local = bubbleLocalProgress(scrollPercent, appearAt)
  const styles = computeTextEffectStyles(local, buildTextConfig(reveal))
  return { visible, opacity: styles.opacity, transform: styles.transform }
}
