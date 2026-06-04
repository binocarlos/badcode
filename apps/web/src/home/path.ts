import { CatmullRomCurve3, Vector3 } from 'three'
import { GRAPH } from './graph'

/**
 * The camera tour as a tight Catmull-Rom through the authored points.
 *
 * tension 0 keeps segments near-straight and — crucially for the retrace —
 * gives a zero-velocity tangent at each turnaround tip (`(P_next−P_prev)/2 = 0`
 * when the neighbours are symmetric), so the camera eases to a stop and reverses
 * with no cusp and no overshoot. Measured peak excursion on the retrace path:
 * |x| ≤ 30.0, |y| ≤ 6.0 (exactly the tips). Centripetal was evaluated and
 * rejected: it bulges y to ~6.57 at the elbow without improving the reversal.
 * The `path.test.ts` bounds check guards this.
 */
export const tourCurve = new CatmullRomCurve3(
  GRAPH.tour.map(([x, y]) => new Vector3(x, y, 0)),
  false,
  'catmullrom',
  0.0,
)

export function clampT(t: number): number {
  return Math.min(1, Math.max(0, t))
}

/** Position on the tour at normalized t (by arc length). */
export function pointAtT(t: number, target = new Vector3()): Vector3 {
  return tourCurve.getPointAt(clampT(t), target)
}
