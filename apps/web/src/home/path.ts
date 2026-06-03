import { CatmullRomCurve3, Vector3 } from 'three'
import { GRAPH } from './graph'

/** The camera tour as a smooth-but-tight curve through the authored points. */
export const tourCurve = new CatmullRomCurve3(
  GRAPH.tour.map(([x, y]) => new Vector3(x, y, 0)),
  false,
  'catmullrom',
  0.0, // tension 0 → straight-ish segments, crisp elbows
)

export function clampT(t: number): number {
  return Math.min(1, Math.max(0, t))
}

/** Position on the tour at normalized t (by arc length). */
export function pointAtT(t: number, target = new Vector3()): Vector3 {
  return tourCurve.getPointAt(clampT(t), target)
}
