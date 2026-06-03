/**
 * Configuration for scroll-linked text reveal.
 * Each flag can be combined with the others.
 */
export interface TextEffectConfig {
  /** Text scrolls in from below at the start of the section. */
  scrollIn: boolean
  /** Text scrolls out upward at the end of the section. */
  scrollOut: boolean
  /** Text fades in at the start of the section. */
  fadeIn: boolean
  /** Text fades out at the end of the section. */
  fadeOut: boolean
  /** Text pauses, centered, during the middle of the scroll. */
  pause: boolean
  /** Percentage of scroll time spent paused in the middle (0-100). */
  pausePercent: number
  /** Percentage of scroll time as buffer before the transition begins (0-100). */
  startBuffer: number
  /** Percentage of scroll time as buffer after the transition ends (0-100). */
  endBuffer: number
}

/** Result of computing text reveal styles for a given scroll position. */
export interface TextEffectStyles {
  /** Opacity (0-1), controlled by the fade flags. */
  opacity: number
  /** CSS transform string, controlled by the scroll/pause flags. */
  transform: string
}
