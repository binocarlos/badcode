/** 2D coordinate in the canonical side-on plane (z = 0 in 3D). */
export type Vec2 = readonly [x: number, y: number]

export type Branch = 'history' | 'bad' | 'good'
export type NodeStatus = 'live' | 'coming-soon'

export interface StoryNode {
  /** Stable id; live comics match their comic.meta id (e.g. 'camping'). */
  id: string
  title: string
  branch: Branch
  /** Clip point on the branch in plane coords (where the tether attaches). */
  clip: Vec2
  /** Where the node floats, offset from the branch. */
  pos: Vec2
  /** Normalized position along the scroll tour [0,1] for camera fly-to. */
  t: number
  route: string
  status: NodeStatus
}

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
 * The scroll tour spline: shared history → fork → up the bad branch → Storyverse.
 * (The good branch is reached by clicking, not scrolling — see plan header.)
 */
const tour: Vec2[] = [...history, BAD_ELBOW, [18, 6], BAD_TIP]

export const storyNodes: StoryNode[] = [
  {
    id: 'camping',
    title: 'Camping',
    branch: 'bad',
    clip: [10, 6],
    pos: [10, 11],
    t: 0.62,
    route: '/comics/camping',
    status: 'live',
  },
  {
    id: 'karen',
    title: 'Karen Will Lead the Revolution',
    branch: 'bad',
    clip: [18, 6],
    pos: [18, 12],
    t: 0.78,
    route: '/comics/karen',
    status: 'coming-soon',
  },
  {
    id: 'emperors-coin',
    title: "Emperor's New Coin",
    branch: 'bad',
    clip: [25, 6],
    pos: [25, 11],
    t: 0.9,
    route: '/comics/emperors-coin',
    status: 'coming-soon',
  },
  {
    id: 'optimistic-lens',
    title: 'An Optimistic Lens',
    branch: 'good',
    clip: [18, -6],
    pos: [18, -12],
    t: 0,
    route: '/comics/optimistic-lens',
    status: 'coming-soon',
  },
]

/** Named camera waypoints, expressed as a `t` along the tour where applicable. */
export const waypoints = {
  start: 0,
  fork: 0.42,
  storyverse: 1,
  /** Good-branch destinations live off the scroll tour; reached via fly-to pose. */
  futureProof: 'pose:good-tip',
} as const

export const GRAPH = {
  branches: { history, bad, good },
  historyCommits,
  tour,
  tips: {
    storyverse: { title: 'Storyverse', pos: BAD_TIP, route: '/storyverse', branch: 'bad' as const },
    futureProof: { title: 'Future Proof', pos: GOOD_TIP, route: '/future-proof', branch: 'good' as const },
  },
} as const
