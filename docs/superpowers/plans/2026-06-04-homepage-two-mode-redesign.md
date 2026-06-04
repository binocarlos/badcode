# Homepage Two-Mode Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll-driven progressive line reveal, sticky node activation, pluggable per-step camera behaviours, and storytelling/menu dual modes to the BadCode homepage.

**Architecture:** `ctrl.drawProgress` (a mutable number on the shared `CameraController`) is written by a scroll handler in `Scene.tsx` as a high-water value (only ever increases). `Constellation` receives a `revealedSteps: Set<string>` prop — nodes are invisible until the Spine line reaches their position. A `mode: 'story' | 'menu'` React state in `Scene.tsx` controls camera locking and node interactivity, persisted to `localStorage`.

**Tech Stack:** React 18, Three.js / `@react-three/fiber`, `@react-three/drei`, GSAP, Vitest, TypeScript, `@badcode/scroll-timeline`.

---

## File map

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/web/src/home/behaviors.ts` | **Create** | `CameraBehaviorFn` type + `bespokePose` + `interpolatePoses` |
| `apps/web/src/home/behaviors.test.ts` | **Create** | Tests for the two built-in behaviors |
| `apps/web/src/home/graph.ts` | **Modify** | Add `drawThreshold()` utility |
| `apps/web/src/home/graph.test.ts` | **Modify** | Tests for `drawThreshold()` |
| `apps/web/src/home/timeline.ts` | **Modify** | Extend `HomeStep` with `kind`/`cameraBehavior`; add `'history'` branch; add 3 historical events |
| `apps/web/src/home/timeline.test.ts` | **Modify** | Update stale assertions |
| `apps/web/src/home/CameraRig.tsx` | **Modify** | Call `cameraBehavior` per step; lock to `OVERVIEW_POSE` in menu mode |
| `apps/web/src/home/Scene.tsx` | **Modify** | `mode` state; `revealedSteps` state; drawProgress scroll wiring; `enterMenu`/`enterStory` |
| `apps/web/src/home/OpeningSequence.tsx` | **Modify** | Remove drawProgress tween (scroll owns it now) |
| `apps/web/src/home/Constellation.tsx` | **Modify** | Accept + pass `revealedSteps` and `menuMode` props |
| `apps/web/src/home/StoryNode.tsx` | **Modify** | `revealed` gate; `kind: 'event'` tick rendering; menu-mode click |
| `apps/web/src/home/Chrome.tsx` | **Modify** | Add `mode`/`onEnterMenu`/`onEnterStory` props; Skip and Story buttons |

---

## Task 1 — Camera behavior types and built-ins

**Files:**
- Create: `apps/web/src/home/behaviors.ts`
- Create: `apps/web/src/home/behaviors.test.ts`

`CameraBehaviorFn` and `CameraBehaviorCtx` are defined in `timeline.ts` (next task) so `behaviors.ts` can import them without creating a circular dependency. For now, define a local re-export shape to write the tests first.

- [ ] **Step 1.1 — Write the failing tests**

Create `apps/web/src/home/behaviors.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { bespokePose, interpolatePoses } from './behaviors'
import type { CameraBehaviorCtx } from './timeline'

const A = { position: [0, 0, 10] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] }
const B = { position: [10, 0, 10] as [number, number, number], lookAt: [10, 0, 0] as [number, number, number] }

const ctx = (focus: number): CameraBehaviorCtx => ({ focus, prev: A, self: B, next: B })

describe('bespokePose', () => {
  it('returns self regardless of focus', () => {
    expect(bespokePose(ctx(0))).toEqual(B)
    expect(bespokePose(ctx(0.5))).toEqual(B)
    expect(bespokePose(ctx(1))).toEqual(B)
  })
})

describe('interpolatePoses', () => {
  it('returns prev when focus = 0', () => {
    const r = interpolatePoses({ focus: 0, prev: A, self: B, next: B })
    expect(r.position[0]).toBeCloseTo(A.position[0])
    expect(r.lookAt[0]).toBeCloseTo(A.lookAt[0])
  })

  it('returns next when focus = 1', () => {
    const r = interpolatePoses({ focus: 1, prev: A, self: B, next: B })
    expect(r.position[0]).toBeCloseTo(B.position[0])
    expect(r.lookAt[0]).toBeCloseTo(B.lookAt[0])
  })

  it('interpolates midpoint at focus = 0.5', () => {
    const r = interpolatePoses({ focus: 0.5, prev: A, self: B, next: B })
    expect(r.position[0]).toBeCloseTo(5)
    expect(r.lookAt[0]).toBeCloseTo(5)
  })
})
```

- [ ] **Step 1.2 — Run tests, confirm they fail**

```bash
npx vitest run --reporter=verbose apps/web/src/home/behaviors.test.ts
```

Expected: `Cannot find module './behaviors'`

- [ ] **Step 1.3 — Add `CameraBehaviorCtx` and `CameraBehaviorFn` to `timeline.ts`**

In `apps/web/src/home/timeline.ts`, add these types after the `CameraPose` interface:

```typescript
export interface CameraBehaviorCtx {
  focus: number       // 0-1 trapezoid for this step
  prev:  CameraPose   // previous step's pose (clamps to self at index 0)
  self:  CameraPose   // this step's declared camera pose
  next:  CameraPose   // next step's pose (clamps to self at last index)
}

export type CameraBehaviorFn = (ctx: CameraBehaviorCtx) => CameraPose
```

- [ ] **Step 1.4 — Create `behaviors.ts`**

Create `apps/web/src/home/behaviors.ts`:

```typescript
import type { CameraBehaviorFn } from './timeline'

export const bespokePose: CameraBehaviorFn = ({ self }) => self

export const interpolatePoses: CameraBehaviorFn = ({ focus, prev, next }) => ({
  position: [
    prev.position[0] + (next.position[0] - prev.position[0]) * focus,
    prev.position[1] + (next.position[1] - prev.position[1]) * focus,
    prev.position[2] + (next.position[2] - prev.position[2]) * focus,
  ],
  lookAt: [
    prev.lookAt[0] + (next.lookAt[0] - prev.lookAt[0]) * focus,
    prev.lookAt[1] + (next.lookAt[1] - prev.lookAt[1]) * focus,
    prev.lookAt[2] + (next.lookAt[2] - prev.lookAt[2]) * focus,
  ],
})
```

- [ ] **Step 1.5 — Run tests, confirm they pass**

```bash
npx vitest run --reporter=verbose apps/web/src/home/behaviors.test.ts
```

Expected: `✓ bespokePose > returns self regardless of focus`, `✓ interpolatePoses > ...` (3 tests pass)

- [ ] **Step 1.6 — Commit**

```bash
git add apps/web/src/home/behaviors.ts apps/web/src/home/behaviors.test.ts apps/web/src/home/timeline.ts
git commit -m "feat(home): CameraBehaviorFn type + bespokePose + interpolatePoses"
```

---

## Task 2 — `drawThreshold` utility

**Files:**
- Modify: `apps/web/src/home/graph.ts`
- Modify: `apps/web/src/home/graph.test.ts`

`drawThreshold` maps a node's branch + clip-x position to the `drawProgress` value at which the Spine tip first reaches it. The branch ratios mirror the constants already in `Spine.tsx`: history occupies 0→0.4, bad 0.4→0.72, good 0.72→1.0.

- [ ] **Step 2.1 — Write the failing tests**

First update the import at the top of `apps/web/src/home/graph.test.ts` (line 2):

```typescript
import { GRAPH, drawThreshold } from './graph'
```

Then append the new describe block at the end of the same file:

```typescript
// history: threshold = ((x + 30) / 30) * 0.4
describe('drawThreshold', () => {
  it('history node at x = -18 → ~0.16', () => {
    expect(drawThreshold({ branch: 'history', clip: [-18, 0] })).toBeCloseTo(0.16)
  })

  it('history node at x = 0 (fork) → 0.4', () => {
    expect(drawThreshold({ branch: 'history', clip: [0, 0] })).toBeCloseTo(0.4)
  })

  it('bad branch node at x = 10 → ~0.507', () => {
    expect(drawThreshold({ branch: 'bad', clip: [10, 6] })).toBeCloseTo(0.507)
  })

  it('bad branch tip at x = 30 → 0.72', () => {
    expect(drawThreshold({ branch: 'bad', clip: [30, 6] })).toBeCloseTo(0.72)
  })

  it('good branch node at x = 18 → ~0.888', () => {
    expect(drawThreshold({ branch: 'good', clip: [18, -6] })).toBeCloseTo(0.888)
  })

  it('good branch tip at x = 30 → 1.0', () => {
    expect(drawThreshold({ branch: 'good', clip: [30, -6] })).toBeCloseTo(1.0)
  })
})
```

- [ ] **Step 2.2 — Run tests, confirm they fail**

```bash
npx vitest run --reporter=verbose apps/web/src/home/graph.test.ts
```

Expected: `drawThreshold is not a function`

- [ ] **Step 2.3 — Add `drawThreshold` to `graph.ts`**

Append to `apps/web/src/home/graph.ts` (after the `GRAPH` export):

```typescript
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
```

- [ ] **Step 2.4 — Run tests, confirm they pass**

```bash
npx vitest run --reporter=verbose apps/web/src/home/graph.test.ts
```

Expected: all 9 tests pass (3 existing + 6 new)

- [ ] **Step 2.5 — Commit**

```bash
git add apps/web/src/home/graph.ts apps/web/src/home/graph.test.ts
git commit -m "feat(home): drawThreshold utility — maps node position to draw reveal point"
```

---

## Task 3 — `HomeStep` data model + historical events

**Files:**
- Modify: `apps/web/src/home/timeline.ts`
- Modify: `apps/web/src/home/timeline.test.ts`

Adds `kind` and `cameraBehavior` to `HomeStep`, extends `branch` to include `'history'`, and prepends three historical event steps before the existing content nodes.

- [ ] **Step 3.1 — Update `HomeStep` interface in `timeline.ts`**

Replace the `HomeStep` interface (lines 17–26 in the current file):

```typescript
export interface HomeStep extends StepDef {
  phases:          Phases
  camera:          CameraPose
  title:           string
  branch:          'bad' | 'good' | 'history'
  clip:            [number, number]
  pos:             [number, number]
  kind?:           'event' | 'content'   // default 'content'
  cameraBehavior?: CameraBehaviorFn
  route?:          string
  status?:         'live' | 'coming-soon'
}
```

- [ ] **Step 3.2 — Prepend three historical event steps to `homeSteps`**

Replace the opening of the `homeSteps` array so it reads (historical events first, then existing steps unchanged):

```typescript
export const homeSteps: HomeStep[] = [
  {
    id:     'gold-standard',
    kind:   'event',
    branch: 'history',
    phases: { enter: 0.5, hold: 0.5, exit: 0.5 },
    camera: { position: [-18, 2, 30], lookAt: [-18, 0, 0] },
    title:  '1971 — Off the Gold Standard',
    clip:   [-18, 0],
    pos:    [-18, 0],
  },
  {
    id:     'git-born',
    kind:   'event',
    branch: 'history',
    phases: { enter: 0.5, hold: 0.5, exit: 0.5 },
    camera: { position: [-10, 2, 30], lookAt: [-10, 0, 0] },
    title:  '2005 — Git Is Born',
    clip:   [-10, 0],
    pos:    [-10, 0],
  },
  {
    id:     'financial-crisis',
    kind:   'event',
    branch: 'history',
    phases: { enter: 0.5, hold: 0.5, exit: 0.5 },
    camera: { position: [-4, 2, 30], lookAt: [-4, 0, 0] },
    title:  '2008 — The Crash',
    clip:   [-4, 0],
    pos:    [-4, 0],
  },
  // --- existing steps below, unchanged ---
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
```

- [ ] **Step 3.3 — Update stale tests in `timeline.test.ts`**

The `'camping is the first step'` assertion is now wrong — camping is index 3. Replace that test block:

```typescript
it('camping is present and is live', () => {
  const camping = homeSteps.find((s) => s.id === 'camping')
  expect(camping).toBeDefined()
  expect(camping?.status).toBe('live')
  expect(camping?.route).toBe('/comics/camping')
})

it('historical event steps come before content steps', () => {
  const firstContent = homeSteps.findIndex((s) => s.kind !== 'event')
  const lastEvent    = [...homeSteps].reverse().findIndex((s) => s.kind === 'event')
  const lastEventIdx = homeSteps.length - 1 - lastEvent
  expect(lastEventIdx).toBeLessThan(firstContent)
})

it('event steps have no route', () => {
  for (const step of homeSteps.filter((s) => s.kind === 'event')) {
    expect(step.route).toBeUndefined()
  }
})
```

Also replace the `'bad-branch steps come before good-branch steps'` test since `'history'` is now a valid branch and history steps come first:

```typescript
it('history steps precede bad steps, bad steps precede good steps', () => {
  const firstBad  = homeSteps.findIndex((s) => s.branch === 'bad')
  const firstGood = homeSteps.findIndex((s) => s.branch === 'good')
  const lastBad   = homeSteps.map((s) => s.branch).lastIndexOf('bad')
  expect(firstBad).toBeGreaterThan(0)            // history comes before bad
  expect(firstGood).toBeGreaterThan(lastBad)     // bad comes before good
})
```

- [ ] **Step 3.4 — Run all home tests**

```bash
npx vitest run --reporter=verbose apps/web/src/home/
```

Expected: all tests pass

- [ ] **Step 3.5 — Commit**

```bash
git add apps/web/src/home/timeline.ts apps/web/src/home/timeline.test.ts
git commit -m "feat(home): HomeStep kind/cameraBehavior/history branch + 3 historical events"
```

---

## Task 4 — `CameraRig` uses camera behaviors + menu mode lock

**Files:**
- Modify: `apps/web/src/home/CameraRig.tsx`

`CameraRig` now receives a `mode` prop. In `'menu'` mode it locks to `OVERVIEW_POSE`. Otherwise it calls each step's `cameraBehavior` (or the appropriate default) to compute the desired pose, rather than reading `step.camera` directly.

- [ ] **Step 4.1 — Rewrite `CameraRig.tsx`**

Replace the entire file:

```typescript
// apps/web/src/home/CameraRig.tsx
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { homeSteps, OVERVIEW_POSE } from './timeline'
import { bespokePose, interpolatePoses } from './behaviors'
import { useCameraController } from './cameraController'
import type { TimelineSample } from '@badcode/scroll-timeline'

const desiredPos  = new Vector3()
const desiredLook = new Vector3()
const lookTarget  = new Vector3(6, 0, 0)
const tmpPos      = new Vector3()
const tmpLook     = new Vector3()

const overviewPos  = new Vector3(...OVERVIEW_POSE.position)
const overviewLook = new Vector3(...OVERVIEW_POSE.lookAt)

export function CameraRig({
  sample,
  mode,
}: {
  sample: TimelineSample
  mode:   'story' | 'menu'
}) {
  const camera = useThree((s) => s.camera)
  const ctrl   = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt)

    if (mode === 'menu' || ctrl.mode === 'intro' || sample.overview) {
      desiredPos.copy(overviewPos)
      desiredLook.copy(overviewLook)
    } else {
      desiredPos.set(0, 0, 0)
      desiredLook.set(0, 0, 0)
      let totalFocus = 0

      for (let i = 0; i < homeSteps.length; i++) {
        const f = sample.focus[i]
        if (f <= 0) continue

        const step     = homeSteps[i]
        const behavior = step.cameraBehavior
          ?? (step.kind === 'event' ? interpolatePoses : bespokePose)
        const prev = homeSteps[Math.max(0, i - 1)].camera
        const next = homeSteps[Math.min(homeSteps.length - 1, i + 1)].camera
        const pose = behavior({ focus: f, prev, self: step.camera, next })

        tmpPos.set(...pose.position)
        tmpLook.set(...pose.lookAt)
        desiredPos.addScaledVector(tmpPos, f)
        desiredLook.addScaledVector(tmpLook, f)
        totalFocus += f
      }

      if (totalFocus > 0) {
        desiredPos.divideScalar(totalFocus)
        desiredLook.divideScalar(totalFocus)
      } else {
        const pose = homeSteps[sample.current].camera
        desiredPos.set(...pose.position)
        desiredLook.set(...pose.lookAt)
      }
    }

    camera.position.lerp(desiredPos, k)
    lookTarget.lerp(desiredLook, k)
    camera.lookAt(lookTarget)
  })

  return null
}
```

- [ ] **Step 4.2 — Run typecheck**

```bash
npm run typecheck
```

Expected: no errors

- [ ] **Step 4.3 — Commit**

```bash
git add apps/web/src/home/CameraRig.tsx
git commit -m "feat(home): CameraRig pluggable cameraBehavior + menu mode lock to overview"
```

---

## Task 5 — Scene mode state + drawProgress wiring + OpeningSequence

**Files:**
- Modify: `apps/web/src/home/Scene.tsx`
- Modify: `apps/web/src/home/OpeningSequence.tsx`

`Scene.tsx` gains `mode` state, a `revealedSteps` state, a scroll handler that advances `ctrl.drawProgress` as a high-water mark, and `enterMenu`/`enterStory` callbacks. `OpeningSequence.tsx` loses its drawProgress tween — scroll owns that now.

- [ ] **Step 5.1 — Simplify `OpeningSequence.tsx`**

Replace the entire file:

```typescript
import { useEffect } from 'react'
import { useCameraController } from './cameraController'

/**
 * If re-emerging from a comic (ctrl.mode already 'travel'), ensure drawProgress
 * is at 1 so all nodes are visible. Scroll drives drawProgress in story mode;
 * menu mode sets it directly in Scene. Nothing else to do here.
 */
export function OpeningSequence() {
  const ctrl = useCameraController()
  useEffect(() => {
    if (ctrl.mode === 'travel') ctrl.drawProgress = 1
  }, [ctrl])
  return null
}
```

- [ ] **Step 5.2 — Rewrite `Scene.tsx`**

Replace the entire file:

```typescript
// apps/web/src/home/Scene.tsx
import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import { Spine } from './Spine'
import { Constellation } from './Constellation'
import { BranchTip } from './BranchTip'
import { CameraRig } from './CameraRig'
import { Atmosphere } from './Atmosphere'
import { Chrome } from './Chrome'
import { Narration } from './Narration'
import { OpeningSequence } from './OpeningSequence'
import { GRAPH, drawThreshold } from './graph'
import { homeSteps } from './timeline'
import { flyToStep } from './drivers'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useTimeline } from './useTimeline'

function initialMode(): 'story' | 'menu' {
  try { return localStorage.getItem('badcode-visited') ? 'menu' : 'story' } catch { return 'story' }
}

const ALL_REVEALED = new Set(homeSteps.map((s) => s.id))

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)
  const [mode, setMode] = useState<'story' | 'menu'>(initialMode)
  const [revealedSteps, setRevealedSteps] = useState<Set<string>>(() =>
    initialMode() === 'menu' ? ALL_REVEALED : new Set(),
  )

  const { sample, layout } = useTimeline()

  // On mount in menu mode, ensure drawProgress starts at 1.
  useEffect(() => {
    if (mode === 'menu') ctrl.drawProgress = 1
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const enterMenu = useCallback(() => {
    ctrl.drawProgress = 1
    try { localStorage.setItem('badcode-visited', '1') } catch { /* */ }
    setMode('menu')
    setRevealedSteps(ALL_REVEALED)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ctrl])

  const enterStory = useCallback(() => {
    try { localStorage.removeItem('badcode-visited') } catch { /* */ }
    ctrl.drawProgress = 0
    ctrl.mode = 'intro'
    setMode('story')
    setRevealedSteps(new Set())
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ctrl])

  // Drive drawProgress from scroll (high-water). Auto-enter menu at end.
  useEffect(() => {
    if (mode !== 'story') return
    const onScroll = () => {
      const scrollable = Math.max(1, layout.totalHeight - window.innerHeight)
      const raw        = window.scrollY / scrollable
      const next       = Math.min(1, Math.max(ctrl.drawProgress, raw))
      ctrl.drawProgress = next

      // Reveal newly crossed nodes.
      const revealed = new Set(
        homeSteps.filter((s) => next >= drawThreshold(s)).map((s) => s.id),
      )
      if (revealed.size !== revealedSteps.size) setRevealedSteps(revealed)

      if (raw >= 1) enterMenu()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mode, layout, ctrl, revealedSteps, enterMenu])

  // Transition from intro to travel when timeline leaves overview state.
  useEffect(() => {
    if (!sample.overview && ctrl.mode === 'intro') ctrl.mode = 'travel'
  }, [sample.overview, ctrl])

  // Any-interaction: clicking while at the overview triggers travel to step 0.
  const handleFirstClick = () => {
    if (ctrl.mode === 'intro') {
      ctrl.mode = 'travel'
      flyToStep(homeSteps.find((s) => s.kind !== 'event')?.id ?? homeSteps[0].id, layout, 0.8)
    }
  }

  // Re-emerge: returning from a comic scrolls to that step's hold position.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  useEffect(() => {
    if (!fromNode) return
    const step = layout.steps.find((s) => s.id === fromNode)
    if (step) {
      window.scrollTo({ top: step.holdStart, behavior: 'instant' })
      ctrl.mode = 'travel'
      ctrl.drawProgress = 1
      setRevealedSteps(ALL_REVEALED)
    }
  }, [fromNode, layout, ctrl])

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas" onPointerDown={handleFirstClick}>
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig sample={sample} mode={mode} />
          <Spine />
          <Constellation
            sample={sample}
            layout={layout}
            onFlash={() => setFlash(true)}
            revealedSteps={revealedSteps}
            menuMode={mode === 'menu'}
          />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <Chrome layout={layout} mode={mode} onEnterMenu={enterMenu} onEnterStory={enterStory} />
      <OpeningSequence />
      <Narration />
      {flash && (
        <div
          style={{ position: 'fixed', inset: 0, background: COLORS.cyan, zIndex: 3, pointerEvents: 'none' }}
        />
      )}
      <div
        className="home-scroll-driver"
        style={{ height: layout.totalHeight }}
        aria-hidden
      />
    </CameraControllerContext.Provider>
  )
}
```

- [ ] **Step 5.3 — Run typecheck**

```bash
npm run typecheck
```

Expected: errors only on `Chrome` (prop mismatch — fixed in Task 7) and `Constellation` (prop mismatch — fixed in Task 6). No other errors.

- [ ] **Step 5.4 — Commit**

```bash
git add apps/web/src/home/Scene.tsx apps/web/src/home/OpeningSequence.tsx
git commit -m "feat(home): mode state + scroll-driven drawProgress high-water + enterMenu/enterStory"
```

---

## Task 6 — Constellation + StoryNode reveal system

**Files:**
- Modify: `apps/web/src/home/Constellation.tsx`
- Modify: `apps/web/src/home/StoryNode.tsx`

`Constellation` accepts `revealedSteps` and `menuMode` and passes them to each `StoryNode`. `StoryNode` renders differently based on `kind` and hides entirely when not revealed.

- [ ] **Step 6.1 — Update `Constellation.tsx`**

Replace the entire file:

```typescript
// apps/web/src/home/Constellation.tsx
import { homeSteps } from './timeline'
import { StoryNode } from './StoryNode'
import type { TimelineSample, TimelineLayout } from '@badcode/scroll-timeline'

export function Constellation({
  sample,
  layout,
  onFlash,
  revealedSteps,
  menuMode,
}: {
  sample:       TimelineSample
  layout:       TimelineLayout
  onFlash:      () => void
  revealedSteps: Set<string>
  menuMode:     boolean
}) {
  return (
    <group>
      {homeSteps.map((step, i) => (
        <StoryNode
          key={step.id}
          step={step}
          focus={sample.focus[i] ?? 0}
          layout={layout}
          onFlash={onFlash}
          revealed={revealedSteps.has(step.id)}
          menuMode={menuMode}
        />
      ))}
    </group>
  )
}
```

- [ ] **Step 6.2 — Rewrite `StoryNode.tsx`**

Replace the entire file:

```typescript
// apps/web/src/home/StoryNode.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line, Html } from '@react-three/drei'
import gsap from 'gsap'
import { flyToStep } from './drivers'
import type { HomeStep } from './timeline'
import type { TimelineLayout } from '@badcode/scroll-timeline'
import { useCameraController } from './cameraController'
import { COLORS } from './colors'

export function StoryNode({
  step,
  focus,
  layout,
  onFlash,
  revealed,
  menuMode,
}: {
  step:     HomeStep
  focus:    number
  layout:   TimelineLayout
  onFlash:  () => void
  revealed: boolean
  menuMode: boolean
}) {
  const navigate   = useNavigate()
  const ctrl       = useCameraController()
  const [hovered, setHovered] = useState(false)
  const [cx, cy] = step.pos
  const [tx, ty] = step.clip

  const enter = () => {
    if (!step.route) return
    if (menuMode) {
      onFlash()
      gsap.delayedCall(0.35, () => navigate(step.route!, { state: { fromNode: step.id } }))
    } else {
      ctrl.mode = 'travel'
      flyToStep(step.id, layout, 1.1)
      gsap.delayedCall(1.0, () => {
        onFlash()
        gsap.delayedCall(0.35, () => navigate(step.route!, { state: { fromNode: step.id } }))
      })
    }
  }

  if (!revealed) return null

  // Historical event nodes: tick mark + label, no sphere, not clickable.
  if (step.kind === 'event') {
    return (
      <group>
        <Line
          points={[[cx, cy - 0.35, 0], [cx, cy + 0.35, 0]]}
          color={COLORS.white}
          lineWidth={2}
          transparent
          opacity={0.5}
        />
        <Html position={[cx + 0.3, cy + 0.6, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            color:      COLORS.white,
            fontFamily: 'var(--mono)',
            fontSize:   10,
            whiteSpace: 'nowrap',
            opacity:    0.55,
          }}>
            {step.title}
          </div>
        </Html>
      </group>
    )
  }

  // Content nodes: floating sphere + tether + label.
  const dim = step.status === 'live' ? 1 : 0.45

  return (
    <group>
      <Line
        points={[[tx, ty, 0], [cx, cy, 0]]}
        color={COLORS.tether}
        lineWidth={1}
        transparent
        opacity={menuMode ? 0.7 : 0.7 * focus}
      />
      {step.route && (
        <mesh
          position={[cx, cy, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
          onClick={(e) => { e.stopPropagation(); enter() }}
        >
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      <mesh position={[cx, cy, 0]}>
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={dim * (menuMode ? 1 : Math.max(focus, 0.15))}
          toneMapped={false}
        />
      </mesh>
      <Html position={[cx + 1, cy + 0.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color:      COLORS.cyan,
          fontFamily: 'var(--mono)',
          fontSize:   12,
          whiteSpace: 'nowrap',
          opacity:    menuMode
            ? dim
            : (hovered || step.status === 'live' ? dim * Math.max(focus, 0.2) : 0.25 * focus),
          transition: 'opacity 120ms',
        }}>
          {step.title}{step.status === 'coming-soon' ? ' · soon' : ''}
        </div>
      </Html>
    </group>
  )
}
```

- [ ] **Step 6.3 — Run typecheck**

```bash
npm run typecheck
```

Expected: errors only on `Chrome` (prop mismatch — next task). No R3F/Constellation errors.

- [ ] **Step 6.4 — Commit**

```bash
git add apps/web/src/home/Constellation.tsx apps/web/src/home/StoryNode.tsx
git commit -m "feat(home): sticky reveal gating + event tick rendering + menuMode click path"
```

---

## Task 7 — Chrome Skip / Story buttons

**Files:**
- Modify: `apps/web/src/home/Chrome.tsx`

Add `mode`, `onEnterMenu`, `onEnterStory` props. Show a small **"Skip →"** button in story mode and a **"Story"** button in the nav in menu mode. The play button is only relevant in story mode.

- [ ] **Step 7.1 — Rewrite `Chrome.tsx`**

Replace the entire file:

```typescript
// apps/web/src/home/Chrome.tsx
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { flyToStep, autoplay } from './drivers'
import { useCameraController } from './cameraController'
import type { TimelineLayout } from '@badcode/scroll-timeline'

const btn: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
  font: 'inherit', fontSize: 12, padding: '6px 10px', cursor: 'pointer', letterSpacing: 1,
}

const skipBtn: React.CSSProperties = {
  ...btn,
  position: 'fixed', bottom: 24, right: 24,
  opacity: 0.55,
  fontSize: 11,
}

export function Chrome({
  layout,
  mode,
  onEnterMenu,
  onEnterStory,
}: {
  layout:       TimelineLayout
  mode:         'story' | 'menu'
  onEnterMenu:  () => void
  onEnterStory: () => void
}) {
  const ctrl = useCameraController()
  const [playing, setPlaying] = useState(false)
  const tween = useRef<ReturnType<typeof autoplay> | null>(null)

  const togglePlay = () => {
    if (playing) {
      tween.current?.kill()
      tween.current = null
      setPlaying(false)
      return
    }
    ctrl.mode = 'travel'
    window.scrollTo(0, 0)
    const tw = autoplay(layout)
    tw.eventCallback('onComplete', () => { setPlaying(false); tween.current = null })
    tween.current = tw
    setPlaying(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {/* Logo */}
      <div style={{ position: 'absolute', top: 20, left: 24, pointerEvents: 'auto' }}>
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700 }}>BADCODE</div>
        <div style={{ color: 'var(--grey)', fontSize: 11 }}>git push origin master</div>
      </div>

      {/* Top-right nav */}
      <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 10, pointerEvents: 'auto' }}>
        {mode === 'menu' && (
          <button style={btn} onClick={onEnterStory}>story</button>
        )}
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToStep('storyverse', layout) }}>storyverse</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToStep('future-proof', layout) }}>future proof</button>
        {mode === 'story' && (
          <button style={btn} onClick={togglePlay}>{playing ? 'stop' : 'play'}</button>
        )}
        <Link to="/about" style={{ ...btn, display: 'inline-block' }}>about</Link>
      </div>

      {/* Skip button — only in story mode */}
      {mode === 'story' && (
        <button style={{ ...skipBtn, pointerEvents: 'auto' }} onClick={onEnterMenu}>
          skip →
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 7.2 — Run typecheck across the whole project**

```bash
npm run typecheck
```

Expected: no errors

- [ ] **Step 7.3 — Run all tests**

```bash
npx vitest run --reporter=verbose
```

Expected: all tests pass

- [ ] **Step 7.4 — Commit**

```bash
git add apps/web/src/home/Chrome.tsx
git commit -m "feat(home): Skip button (story mode) + Story button (menu mode)"
```

---

## Task 8 — Smoke-test in browser

- [ ] **Step 8.1 — Start dev server**

```bash
npm run dev
```

Open `http://localhost:5173`.

- [ ] **Step 8.2 — Verify storytelling mode (first visit)**

Clear `localStorage` in DevTools (`localStorage.clear()`), reload.

Expected:
- No nodes visible on load
- Scroll down slowly — the Spine line grows right
- Historical event ticks (1971, 2005, 2008) appear with white labels when the line reaches them
- Content nodes (Camping etc.) appear as cyan spheres when the line reaches them
- Camera glides through historical events; snaps to each content node's bespoke pose
- "skip →" button visible bottom-right
- Reaching scroll end enters menu mode automatically

- [ ] **Step 8.3 — Verify menu mode**

Expected:
- All nodes visible immediately, full opacity
- Camera at overview pose
- Clicking Camping → flash → navigate to comic
- "story" button visible in top-right nav
- "skip →" button gone

- [ ] **Step 8.4 — Verify Story button resets**

Click "story" button in menu mode.

Expected:
- All nodes disappear
- Camera returns to overview
- Scroll position at top
- Scrolling re-reveals nodes progressively

- [ ] **Step 8.5 — Verify return-from-comic flow**

Navigate to camping comic, use the back link to return.

Expected:
- All nodes revealed (drawProgress = 1)
- Camera at camping step pose

- [ ] **Step 8.6 — Final commit (if any tweaks were needed)**

```bash
git add -p   # stage only intentional adjustments
git commit -m "fix(home): browser smoke-test tweaks"
```
