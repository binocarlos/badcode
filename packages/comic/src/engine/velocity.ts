/**
 * Smoothed scroll velocity in "overall-fraction per second". EMA toward the
 * instantaneous speed so it rises while scrolling and decays when scrolling
 * slows or stops. Pure + clamped so it is unit-testable and bounded.
 */
export function nextVelocity(
  prev: number,
  prevOverall: number,
  currOverall: number,
  dtMs: number,
  smoothing = 0.2,
): number {
  const instantaneous = dtMs > 0 ? Math.abs(currOverall - prevOverall) / (dtMs / 1000) : 0
  const next = prev + smoothing * (instantaneous - prev)
  return Math.max(0, Math.min(10, next))
}
