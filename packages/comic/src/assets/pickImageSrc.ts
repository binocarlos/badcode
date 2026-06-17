import type { ResolvedImage } from './types'

/** Which URL the main <img> layer should show given which tiers have decoded. */
export function pickImageSrc(asset: ResolvedImage, lowReady: boolean, highReady: boolean): string {
  if (highReady) return asset.high
  if (lowReady) return asset.low
  return ''
}
