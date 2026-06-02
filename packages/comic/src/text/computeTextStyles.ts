import type { TextEffectConfig, TextEffectStyles } from './types'

/**
 * Compute CSS styles for text based on scroll position and enabled effects.
 *
 * Ported from the storyteller comic engine (pure, dependency-free). Effects can
 * be combined freely:
 * - scrollIn: text scrolls in from below at the start of the section
 * - scrollOut: text scrolls out upward at the end of the section
 * - fadeIn / fadeOut: opacity at the start / end of the section
 * - pause: text holds at center for `pausePercent` of the scroll
 *
 * Timing is controlled by startBuffer / endBuffer / pausePercent. When all
 * effects are off, text is simply centered (opacity 1, no transform).
 *
 * @param scrollPercent - Scroll progress through this section (0 to 1)
 * @param effects - Which effects are enabled and their timing values
 */
export function computeTextEffectStyles(
  scrollPercent: number,
  effects: TextEffectConfig,
): TextEffectStyles {
  const { scrollIn, scrollOut, fadeIn, fadeOut, pause, pausePercent, startBuffer, endBuffer } =
    effects

  // Convert percentages to decimals (0-1 range)
  const startBuf = Math.max(0, Math.min(0.4, startBuffer / 100))
  const endBuf = Math.max(0, Math.min(0.4, endBuffer / 100))
  const pausePct = pause ? Math.max(0, Math.min(0.6, pausePercent / 100)) : 0

  // Calculate zone boundaries
  const availableSpace = 1 - startBuf - endBuf

  let inStart: number, inEnd: number, pauseEnd: number, outStart: number, outEnd: number

  if (pause && pausePct > 0) {
    // With pause: divide available space into in, pause, out
    const transitionSpace = Math.max(0, (availableSpace - pausePct) / 2)
    inStart = startBuf
    inEnd = startBuf + transitionSpace
    pauseEnd = inEnd + pausePct
    outStart = pauseEnd
    outEnd = pauseEnd + transitionSpace
  } else {
    // Without pause: divide available space into in and out
    const transitionSpace = availableSpace / 2
    inStart = startBuf
    inEnd = startBuf + transitionSpace
    pauseEnd = inEnd // No pause zone
    outStart = inEnd
    outEnd = 1 - endBuf
  }

  // Calculate opacity
  let opacity = 1

  if (fadeIn || fadeOut) {
    if (fadeIn) {
      if (scrollPercent <= inStart) {
        opacity = 0
      } else if (scrollPercent <= inEnd) {
        opacity = (scrollPercent - inStart) / (inEnd - inStart)
      }
    }

    if (fadeOut && opacity > 0) {
      if (scrollPercent >= outEnd) {
        opacity = 0
      } else if (scrollPercent >= outStart) {
        const progress = (scrollPercent - outStart) / (outEnd - outStart)
        opacity = Math.min(opacity, 1 - progress)
      }
    }

    opacity = Math.max(0, Math.min(1, opacity))
  }

  // Calculate translateY for scroll effects
  let translateY = 0
  const hasAnyScroll = scrollIn || scrollOut

  if (hasAnyScroll) {
    const offScreenDistance = 150 // vh units for off-screen position

    if (scrollPercent <= inStart) {
      if (scrollIn) {
        translateY = offScreenDistance
        if (!fadeIn) opacity = 0
      }
    } else if (scrollPercent <= inEnd) {
      if (scrollIn) {
        const progress = (scrollPercent - inStart) / (inEnd - inStart)
        translateY = offScreenDistance * (1 - progress)
      }
    } else if (scrollPercent <= pauseEnd) {
      translateY = 0 // Centered (pause zone, or center if no pause)
    } else if (scrollPercent <= outEnd) {
      if (scrollOut) {
        const progress = (scrollPercent - outStart) / (outEnd - outStart)
        translateY = -offScreenDistance * progress
      }
    } else {
      if (scrollOut) {
        translateY = -offScreenDistance
        if (!fadeOut) opacity = 0
      }
    }
  }

  return {
    opacity,
    transform: translateY !== 0 ? `translateY(${translateY}vh)` : 'none',
  }
}
