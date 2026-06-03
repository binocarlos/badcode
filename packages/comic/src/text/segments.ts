import type { TextEffectConfig } from './types'

/**
 * A composable fragment of a text-reveal configuration. Combine several in a
 * `reveal={[...]}` array; later segments override earlier ones on conflict.
 *
 * Example: `reveal={[scrollIn(), pause(0.2), fadeOut()]}`
 */
export type RevealSegment = Partial<TextEffectConfig>

const DEFAULTS: TextEffectConfig = {
  scrollIn: false,
  scrollOut: false,
  fadeIn: false,
  fadeOut: false,
  pause: false,
  pausePercent: 20,
  startBuffer: 15,
  endBuffer: 15,
}

/** Text scrolls in from below at the start of the section. */
export const scrollIn = (): RevealSegment => ({ scrollIn: true })

/** Text scrolls out upward at the end of the section. */
export const scrollOut = (): RevealSegment => ({ scrollOut: true })

/** Text fades in at the start of the section. */
export const fadeIn = (): RevealSegment => ({ fadeIn: true })

/** Text fades out at the end of the section. */
export const fadeOut = (): RevealSegment => ({ fadeOut: true })

/**
 * Text holds, centered, for the middle of the scroll.
 * @param fraction - portion of the scroll spent paused (0..1, default 0.2)
 */
export const pause = (fraction = 0.2): RevealSegment => ({
  pause: true,
  pausePercent: Math.max(0, Math.min(1, fraction)) * 100,
})

/**
 * Override the lead-in / lead-out buffers (dead space before/after the reveal).
 * @param start - fraction of scroll before the reveal begins (0..1)
 * @param end - fraction of scroll after the reveal ends (0..1)
 */
export const buffers = (start: number, end: number): RevealSegment => ({
  startBuffer: Math.max(0, Math.min(1, start)) * 100,
  endBuffer: Math.max(0, Math.min(1, end)) * 100,
})

/** Merge reveal segments into a complete TextEffectConfig over the defaults. */
export function buildTextConfig(segments: RevealSegment[] = []): TextEffectConfig {
  return segments.reduce<TextEffectConfig>(
    (acc, seg) => ({ ...acc, ...seg }),
    { ...DEFAULTS },
  )
}
