import type { ResolvedRendition } from '../assets/types'

export interface NetworkHint {
  saveData?: boolean
  effectiveType?: string
}

function capFor(net?: NetworkHint): number {
  if (!net) return Infinity
  if (net.saveData) return 480
  if (net.effectiveType === '2g' || net.effectiveType === 'slow-2g') return 480
  if (net.effectiveType === '3g') return 720
  return Infinity
}

/** The smallest rung. Assumes `renditions` is sorted ascending by height. */
export function lowestRendition(renditions: ResolvedRendition[]): ResolvedRendition {
  return renditions[0]
}

/**
 * Pick a rendition: the smallest rung whose height ≥ viewportHeight×dpr, but never
 * above the network cap. Falls back to the largest rung within the cap, else the smallest.
 */
export function selectRendition(
  renditions: ResolvedRendition[],
  viewportHeight: number,
  dpr: number,
  net?: NetworkHint,
): ResolvedRendition {
  const cap = capFor(net)
  const target = viewportHeight * dpr
  const eligible = renditions.filter((r) => r.height <= cap)
  const pool = eligible.length > 0 ? eligible : [renditions[0]]
  return pool.find((r) => r.height >= target) ?? pool[pool.length - 1]
}
