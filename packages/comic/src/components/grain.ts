/** Grain overlay opacity: a low base that drifts up with scroll velocity,
 *  capped so it never overwhelms the art. */
export function grainIntensity(velocity: number, base = 0.06, max = 0.14): number {
  const v = Math.max(0, base + velocity * 0.02)
  return Math.min(max, v)
}
