/**
 * Camera distance for the overview, sized to the viewport aspect so the whole
 * timeline stays on screen. Wide screens keep the tuned desktop `base`; narrow
 * (portrait) screens pull the camera back far enough to fit the map's width.
 */
export function overviewDistance(
  aspect: number,
  {
    fovDeg = 50,
    halfWidth = 22, // bias toward the fork on portrait (don't frame the empty trunk ends)
    base = 76,
    margin = 1.06,
    max = 220,
  }: { fovDeg?: number; halfWidth?: number; base?: number; margin?: number; max?: number } = {},
): number {
  const tanV = Math.tan(((fovDeg * Math.PI) / 180) / 2)
  const widthFit = (halfWidth / (tanV * Math.max(0.2, aspect))) * margin
  return Math.min(max, Math.max(base, widthFit))
}
