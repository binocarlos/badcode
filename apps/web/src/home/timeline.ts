import type { StepDef, Phases } from '@badcode/scroll-timeline'

/** 1 unit = 1 viewport of scroll. Change this to speed up / slow down everything. */
export const UNIT_VH = 1.0

export interface CameraPose {
  position: [number, number, number]
  lookAt:   [number, number, number]
}

/** The zoomed-out overview — shown at scroll = 0 and scroll = max. */
export const OVERVIEW_POSE: CameraPose = {
  position: [6, 0, 76],
  lookAt:   [6, 0, 0],
}

export interface HomeStep extends StepDef {
  phases:  Phases
  camera:  CameraPose
  title:   string
  branch:  'bad' | 'good'
  clip:    [number, number]   // branch attachment point for Spine tether
  pos:     [number, number]   // node float position for StoryNode label
  route?:  string
  status?: 'live' | 'coming-soon'
}

/**
 * The ordered list of story beats on the timeline.
 * Camera values are seed estimates — tune them in the browser.
 * Phase budgets are in UNIT_VH units (1 = one viewport of scroll).
 */
export const homeSteps: HomeStep[] = [
  {
    id:     'camping',
    branch: 'bad',
    phases: { enter: 1, hold: 1, exit: 1 },
    camera: { position: [10, 9, 18], lookAt: [10, 6, 0] },
    title:  'Camping',
    route:  '/comics/camping',
    status: 'live',
    clip:   [10, 6],
    pos:    [10, 10],
  },
  {
    id:     'karen',
    branch: 'bad',
    phases: { enter: 1, hold: 2, exit: 1 },
    camera: { position: [18, 12, 18], lookAt: [18, 6, 0] },
    title:  'Karen Will Lead the Revolution',
    route:  '/comics/karen',
    status: 'coming-soon',
    clip:   [18, 6],
    pos:    [18, 14],
  },
  {
    id:     'emperors-coin',
    branch: 'bad',
    phases: { enter: 1, hold: 1, exit: 1 },
    camera: { position: [25, 10, 18], lookAt: [25, 6, 0] },
    title:  "Emperor's New Coin",
    route:  '/comics/emperors-coin',
    status: 'coming-soon',
    clip:   [25, 6],
    pos:    [25, 10.5],
  },
  {
    id:     'storyverse',
    branch: 'bad',
    phases: { enter: 2, hold: 1, exit: 2 },
    camera: { position: [30, 9, 22], lookAt: [30, 6, 0] },
    title:  'Storyverse',
    route:  '/storyverse',
    clip:   [30, 6],
    pos:    [30, 6],
  },
  {
    id:     'optimistic-lens',
    branch: 'good',
    phases: { enter: 2, hold: 1, exit: 1 },
    camera: { position: [18, -9, 18], lookAt: [18, -6, 0] },
    title:  'An Optimistic Lens',
    route:  '/comics/optimistic-lens',
    status: 'coming-soon',
    clip:   [18, -6],
    pos:    [18, -11],
  },
  {
    id:     'future-proof',
    branch: 'good',
    phases: { enter: 1, hold: 1, exit: 2 },
    camera: { position: [30, -8, 22], lookAt: [30, -6, 0] },
    title:  'Future Proof',
    route:  '/future-proof',
    clip:   [30, -6],
    pos:    [30, -6],
  },
]
