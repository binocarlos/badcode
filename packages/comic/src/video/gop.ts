/** [gopStart, gopEnd] frame indices for the GOP containing `target`. */
export function gopBoundsFor(gopStarts: number[], target: number, frameCount: number): [number, number] {
  let gs = gopStarts[0] ?? 0
  let gi = 0
  for (let i = 0; i < gopStarts.length; i++) {
    if (gopStarts[i] <= target) { gs = gopStarts[i]; gi = i } else break
  }
  const ge = gi + 1 < gopStarts.length ? gopStarts[gi + 1] - 1 : frameCount - 1
  return [gs, ge]
}

/** Nearest cached frame index at/before target, else nearest after, else -1. */
export function nearestCached(has: (i: number) => boolean, target: number, frameCount: number): number {
  for (let i = target; i >= 0; i--) if (has(i)) return i
  for (let i = target + 1; i < frameCount; i++) if (has(i)) return i
  return -1
}

/** Oldest GOP starts to evict so that at most `maxResident` remain (FIFO order). */
export function gopsToEvict(cachedGops: number[], maxResident: number): number[] {
  const excess = cachedGops.length - maxResident
  return excess > 0 ? cachedGops.slice(0, excess) : []
}
