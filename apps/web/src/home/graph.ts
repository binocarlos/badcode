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

/** Decorative commit dots on the history trunk — one per event node. */
const historyCommits: Vec2[] = [
  [-18, 0],  // gold-standard
  [-10, 0],  // git-born
  [-4,  0],  // financial-crisis
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
  branch: Branch
  clip:   readonly [number, number]
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Returns the drawProgress value (0-1) at which the Spine tip first reaches
 * this node's clip position on the tour path.
 *
 * Uses segment-index geometry (matching drawnSlice) rather than a linear x/30
 * approximation, so nodes appear the moment the line actually reaches them.
 *
 * Branch draw ranges mirror Spine.tsx:
 *   history  →  drawProgress ∈ [0.00, 0.40]
 *   bad      →  drawProgress ∈ [0.40, 0.72]  (3 segments: diagonal + 2 flat)
 *   good     →  drawProgress ∈ [0.72, 0.95]  (3 segments: diagonal + 2 flat)
 */
export function drawThreshold({ branch, clip }: DrawThresholdInput): number {
  const cx = clip[0]
  if (branch === 'history') {
    // Straight horizontal line from x=-30 to x=0 — linear x maps directly.
    return clamp01(((cx + 30) / 30) * 0.4)
  }

  // bad3 = [(0,0), (6,6), (18,6), (30,6)]  — 3 segments
  // good3 = [(0,0), (6,-6), (18,-6), (30,-6)] — 3 segments
  // drawnSlice gives equal weight to each segment by index, so we compute
  // the fractional segment index (head) at which the line tip first hits cx.
  let head: number
  if (cx <= 6) {
    head = cx / 6           // diagonal segment 0: FORK → elbow
  } else if (cx <= 18) {
    head = 1 + (cx - 6) / 12   // flat segment 1
  } else {
    head = 2 + (cx - 18) / 12  // flat segment 2
  }
  const localProgress = clamp01(head / 3)

  if (branch === 'bad') {
    return clamp01(0.4 + localProgress * 0.32)
  }
  // good branch draws over 0.72→0.95 (matches Spine localGood range)
  return clamp01(0.72 + localProgress * 0.23)
}
