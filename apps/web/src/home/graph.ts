/** 2D coordinate in the canonical side-on plane (z = 0 in 3D). */
export type Vec2 = readonly [x: number, y: number]

export type Branch = 'history' | 'bad' | 'good'

/** History runs flat along -x → 0; fork at origin; bad up, good down, then flat. */
const FORK: Vec2 = [0, 0]
const BAD_ELBOW: Vec2 = [6, 6]
const BAD_TIP: Vec2 = [30, 6]
const GOOD_ELBOW: Vec2 = [6, -6]
const GOOD_TIP: Vec2 = [30, -6]

const history: Vec2[] = [
  [-30, 0],
  [-22, 0],
  [-14, 0],
  [-7, 0],
  FORK,
]
const bad: Vec2[] = [FORK, BAD_ELBOW, [18, 6], BAD_TIP]
const good: Vec2[] = [FORK, GOOD_ELBOW, [18, -6], GOOD_TIP]

/** Faint history commits (decorative; positions only). */
const historyCommits: Vec2[] = [
  [-26, 0],
  [-18, 0],
  [-10, 0],
  [-3, 0],
]

/**
 * The scroll tour spline: shared history → up the bad branch → Storyverse,
 * then RETRACE back through the fork → down the good branch → Future Proof.
 * The fork (the decision point) is travelled twice.
 */
const tour: Vec2[] = [
  ...history, //                       -30..0, ending at the FORK
  BAD_ELBOW, [18, 6], BAD_TIP, //      up the bad branch → Storyverse
  [18, 6], BAD_ELBOW, FORK, //         rewind back down through the fork
  GOOD_ELBOW, [18, -6], GOOD_TIP, //   down the good branch → Future Proof
]

export const GRAPH = {
  branches: { history, bad, good },
  historyCommits,
  tour,
  tips: {
    storyverse: { title: 'Storyverse', pos: BAD_TIP, route: '/storyverse', branch: 'bad' as const },
    futureProof: { title: 'Future Proof', pos: GOOD_TIP, route: '/future-proof', branch: 'good' as const },
  },
} as const

type DrawThresholdInput = {
  branch: 'bad' | 'good' | 'history'
  clip:   readonly [number, number]
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Returns the drawProgress value (0-1) at which the Spine tip first reaches
 * this node's clip position on the tour path.
 *
 * Branch draw ranges mirror Spine.tsx:
 *   history  x ∈ [-30, 0]  →  drawProgress ∈ [0.00, 0.40]
 *   bad      x ∈ [  0, 30] →  drawProgress ∈ [0.40, 0.72]
 *   good     x ∈ [  0, 30] →  drawProgress ∈ [0.72, 1.00]
 */
export function drawThreshold({ branch, clip }: DrawThresholdInput): number {
  const x = clip[0]
  if (branch === 'history') return clamp01(((x + 30) / 30) * 0.4)
  if (branch === 'bad')     return clamp01(0.4 + (x / 30) * 0.32)
  return                           clamp01(0.72 + (x / 30) * 0.28)
}
