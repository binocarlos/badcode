import { defineEffect } from '@badcode/comic/effects'

/**
 * Woozy psychedelic warp for the post-ayahuasca pages — hue drift + a gentle
 * "breathing" scale that intensifies across the page's scroll. Worked example of
 * a comic-local custom effect (graduate to @badcode/comic/effects if a second
 * comic wants it).
 */
export const trip = (intensity = 1) =>
  defineEffect((el, p) => {
    const hue = p * 60 * intensity
    const scale = 1 + Math.sin(p * Math.PI * 4) * 0.02 * intensity
    el.style.filter = `hue-rotate(${hue}deg) saturate(${1 + p * 0.5 * intensity})`
    el.style.transform = `scale(${scale})`
  })
