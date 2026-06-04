# Scroll-Timeline Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `@badcode/scroll-timeline` (a pure phase-budget engine), migrate the 3D homepage to use it with explicit camera poses and zoom-out bookends, and migrate `@badcode/comic`'s scroll engine to use the same core.

**Architecture:** A new pure workspace package owns the `layoutTimeline` / `sampleTimeline` math. The homepage and comic each add a thin adapter. The homepage replaces spline-t camera follow with explicit per-step `{ position, lookAt }` poses blended by `focus[]`. All three subsystems are TDD where they have a pure surface; motion is browser-verified.

**Tech Stack:** TypeScript, vitest (node env), React 18, react-three-fiber, three.js `Vector3`, GSAP.

**Spec:** [`docs/superpowers/specs/2026-06-04-scroll-timeline-design.md`](../specs/2026-06-04-scroll-timeline-design.md)

> ⚠️ **Ordering note:** Task 8 (`Constellation`/`StoryNode`) imports `flyToStep` from `drivers.ts`, which is created in Task 10. **Execute Task 10 before Task 8** when running sequentially. Subagent-driven mode: dispatch Task 10 first, then Task 8.

---

## File Structure

| File | Action | Task |
|---|---|---|
| `packages/scroll-timeline/package.json` | Create | 1 |
| `packages/scroll-timeline/tsconfig.json` | Create | 1 |
| `packages/scroll-timeline/src/index.ts` | Create | 1 |
| `packages/scroll-timeline/src/index.test.ts` | Create | 1 |
| `packages/comic/package.json` | Modify — add dep | 2 |
| `packages/comic/src/components/Page.tsx` | Modify — `phases` prop | 2 |
| `packages/comic/src/components/ScrollComic.tsx` | Modify — extract phases | 2 |
| `packages/comic/src/engine/useScrollEngine.ts` | Modify — use core | 2 |
| `apps/web/src/comics/camping/CampingComic.tsx` | Modify — add `phases` to Pages | 3 |
| `apps/web/package.json` | Modify — add dep | 4 |
| `apps/web/src/home/timeline.ts` | Create | 4 |
| `apps/web/src/home/timeline.test.ts` | Create | 4 |
| `apps/web/src/home/useTimeline.ts` | Create | 4 |
| `apps/web/src/home/graph.ts` | Modify — remove storyNodes/waypoints | 5 |
| `apps/web/src/home/graph.test.ts` | Modify — remove node/waypoint tests | 5 |
| `apps/web/src/home/cameraController.ts` | Modify — remove `t` field | 6 |
| `apps/web/src/home/CameraRig.tsx` | Rewrite — explicit pose interpolation | 7 |
| `apps/web/src/home/drivers.ts` | Rewrite — flyToStep / autoplay | 10 (run before 8) |
| `apps/web/src/home/Chrome.tsx` | Modify — step-id buttons | 10 (run before 8) |
| `apps/web/src/home/Constellation.tsx` | Rewrite — use homeSteps + focus | 8 |
| `apps/web/src/home/StoryNode.tsx` | Modify — focus-driven opacity | 8 |
| `apps/web/src/home/Fallback2D.tsx` | Modify — import from timeline.ts | 5 |
| `apps/web/src/home/Spine.tsx` | No changes — verify only | 9 |
| `apps/web/src/home/Scene.tsx` | Rewrite — useTimeline wiring | 11 |

---

## Task 1: `@badcode/scroll-timeline` package

**Files:**
- Create: `packages/scroll-timeline/package.json`
- Create: `packages/scroll-timeline/tsconfig.json`
- Create: `packages/scroll-timeline/src/index.ts`
- Create: `packages/scroll-timeline/src/index.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// packages/scroll-timeline/src/index.test.ts
import { describe, it, expect } from 'vitest'
import { layoutTimeline, sampleTimeline } from './index'

const TWO_STEPS = [
  { id: 'a', phases: { enter: 1, hold: 2, exit: 1 } },
  { id: 'b', phases: { enter: 1, hold: 1, exit: 1 } },
]

describe('layoutTimeline', () => {
  it('adds 0.5-unit bookend pads', () => {
    const { steps, totalHeight } = layoutTimeline(
      [{ id: 'x', phases: { enter: 0, hold: 1, exit: 0 } }],
      100,
    )
    expect(steps[0].enterStart).toBe(50)   // leading pad = 0.5 × 100
    expect(steps[0].holdStart).toBe(50)    // enter = 0
    expect(steps[0].exitStart).toBe(150)   // hold = 1 × 100
    expect(steps[0].end).toBe(150)         // exit = 0
    expect(totalHeight).toBe(200)          // 50 + 100 + 50
  })

  it('steps are adjacent (end(i) === enterStart(i+1))', () => {
    const { steps } = layoutTimeline(TWO_STEPS, 100)
    expect(steps[1].enterStart).toBe(steps[0].end)
  })

  it('total height matches sum-of-phases × unitPx + pads', () => {
    const unitPx = 100
    const { totalHeight } = layoutTimeline(TWO_STEPS, unitPx)
    // phases total = (1+2+1) + (1+1+1) = 4 + 3 = 7 units; pads = 2 × 0.5 = 1 unit
    expect(totalHeight).toBe((4 + 3 + 1) * unitPx)
  })
})

describe('sampleTimeline', () => {
  const layout = layoutTimeline(TWO_STEPS, 100)
  // a: enterStart=50 holdStart=150 exitStart=350 end=450
  // b: enterStart=450 holdStart=550 exitStart=650 end=750
  // totalHeight=800

  it('focus is 0 before first enterStart', () => {
    const { focus, overview } = sampleTimeline(layout, 0)
    expect(focus[0]).toBe(0)
    expect(focus[1]).toBe(0)
    expect(overview).toBe(true)
  })

  it('focus rises linearly during enter', () => {
    const { focus } = sampleTimeline(layout, 100) // midpoint of a.enter (50..150)
    expect(focus[0]).toBeCloseTo(0.5)
    expect(focus[1]).toBe(0)
  })

  it('focus is 1 throughout hold', () => {
    const { focus } = sampleTimeline(layout, 200) // inside a.hold (150..350)
    expect(focus[0]).toBe(1)
    expect(focus[1]).toBe(0)
  })

  it('focus falls during exit', () => {
    const { focus } = sampleTimeline(layout, 400) // midpoint of a.exit (350..450)
    expect(focus[0]).toBeCloseTo(0.5)
    expect(focus[1]).toBe(0)
  })

  it('at most one step has focus > 0 at any position', () => {
    for (let px = 0; px <= 800; px += 5) {
      const { focus } = sampleTimeline(layout, px)
      const active = focus.filter((f) => f > 0).length
      expect(active).toBeLessThanOrEqual(1)
    }
  })

  it('overview is true after last step ends', () => {
    expect(sampleTimeline(layout, 760).overview).toBe(true)  // past b.end=750
    expect(sampleTimeline(layout, 200).overview).toBe(false) // inside a
  })

  it('direction reflects scroll delta', () => {
    expect(sampleTimeline(layout, 200, 100).direction).toBe('fwd')
    expect(sampleTimeline(layout, 100, 200).direction).toBe('bwd')
    expect(sampleTimeline(layout, 200, 200).direction).toBe('none')
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd packages/scroll-timeline && npx vitest run src/index.test.ts 2>&1 | tail -8
```
Expected: FAIL — `index.ts` does not exist yet.

- [ ] **Step 3: Create the package scaffold**

```json
// packages/scroll-timeline/package.json
{
  "name": "@badcode/scroll-timeline",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^2.1.8"
  }
}
```

```json
// packages/scroll-timeline/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "./dist" },
  "include": ["src"]
}
```

- [ ] **Step 4: Implement `src/index.ts`**

```ts
// packages/scroll-timeline/src/index.ts

/** A step's scroll-budget in relative units (1 = one global standard unit). */
export interface Phases { enter: number; hold: number; exit: number }

/** Minimal step definition — consumers extend this with domain-specific fields. */
export interface StepDef { id: string; phases: Phases }

/** Computed scroll offsets for a single step — all values are absolute px. */
export interface StepLayout {
  id: string
  enterStart: number
  holdStart:  number
  exitStart:  number
  end:        number
}

/** Full timeline layout, stable across frames when inputs haven't changed. */
export interface TimelineLayout {
  steps:       StepLayout[]
  totalHeight: number
}

/** Per-frame sample — returned by sampleTimeline on every scroll event. */
export interface TimelineSample {
  /** focus[i] ∈ [0,1]: trapezoid — rises over enter, = 1 through hold, falls over exit. */
  focus:     number[]
  /** Index of the step with the highest focus (nearest step during overview). */
  current:   number
  /** True when scroll is before step 0's enter or after the last step's exit. */
  overview:  boolean
  /** 0..1 across the full scroll track (for progress indicators). */
  position:  number
  direction: 'fwd' | 'bwd' | 'none'
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/**
 * Convert phase budgets into absolute scroll offsets.
 *
 * unitPx = one relative unit in pixels (pass `window.innerHeight` for UNIT_VH = 1).
 * Adds 0.5 × unitPx bookend pads before step 0 and after the last step,
 * so the first and last steps can "rest" in the overview state at scroll = 0 / max.
 */
export function layoutTimeline(
  steps: readonly StepDef[],
  unitPx: number,
): TimelineLayout {
  const pad = 0.5 * unitPx
  let offset = pad
  const layouts: StepLayout[] = []
  for (const step of steps) {
    const enterStart = offset
    const holdStart  = enterStart + step.phases.enter * unitPx
    const exitStart  = holdStart  + step.phases.hold  * unitPx
    const end        = exitStart  + step.phases.exit  * unitPx
    layouts.push({ id: step.id, enterStart, holdStart, exitStart, end })
    offset = end
  }
  return { steps: layouts, totalHeight: offset + pad }
}

/**
 * Sample the timeline at a given scroll position.
 *
 * scrollPx: raw scroll offset relative to the timeline start (window.scrollY for
 *   a full-page timeline; window.scrollY + vh/2 - containerTop for a mid-page
 *   timeline that preserves the viewport-centre reference used by @badcode/comic).
 * prevScrollPx: previous value, used to compute direction.
 */
export function sampleTimeline(
  layout: TimelineLayout,
  scrollPx: number,
  prevScrollPx?: number,
): TimelineSample {
  const { steps } = layout
  const focus: number[] = new Array(steps.length).fill(0)
  let current = 0
  let maxFocus = -1

  for (let i = 0; i < steps.length; i++) {
    const { enterStart, holdStart, exitStart, end } = steps[i]
    let f = 0
    if (scrollPx >= holdStart && scrollPx < exitStart) {
      f = 1
    } else if (scrollPx >= enterStart && scrollPx < holdStart) {
      const span = holdStart - enterStart
      f = span > 0 ? clamp01((scrollPx - enterStart) / span) : 1
    } else if (scrollPx >= exitStart && scrollPx < end) {
      const span = end - exitStart
      f = span > 0 ? clamp01((end - scrollPx) / span) : 1
    }
    focus[i] = f
    if (f > maxFocus) { maxFocus = f; current = i }
  }

  const first = steps[0]
  const last  = steps[steps.length - 1]
  const overview =
    steps.length === 0 ||
    scrollPx < first.enterStart ||
    scrollPx >= last.end

  if (overview) {
    current = scrollPx < (first?.enterStart ?? 0) ? 0 : steps.length - 1
  }

  const position = layout.totalHeight > 0 ? clamp01(scrollPx / layout.totalHeight) : 0

  let direction: 'fwd' | 'bwd' | 'none' = 'none'
  if (prevScrollPx !== undefined) {
    if (scrollPx > prevScrollPx)      direction = 'fwd'
    else if (scrollPx < prevScrollPx) direction = 'bwd'
  }

  return { focus, current, overview, position, direction }
}
```

- [ ] **Step 5: Run tests — confirm they pass**

```bash
cd packages/scroll-timeline && npx vitest run src/index.test.ts 2>&1 | tail -6
```
Expected: all tests PASS.

- [ ] **Step 6: Typecheck and commit**

```bash
cd /home/kai/projects/badcode/badcode
npm install                            # links the new workspace package
npm run typecheck 2>&1 | tail -12
git add packages/scroll-timeline
git commit -m "feat: add @badcode/scroll-timeline core package (layoutTimeline + sampleTimeline)"
```

---

## Task 2: Migrate `@badcode/comic` to use `@badcode/scroll-timeline`

**Files:**
- Modify: `packages/comic/package.json`
- Modify: `packages/comic/src/components/Page.tsx`
- Modify: `packages/comic/src/components/ScrollComic.tsx`
- Modify: `packages/comic/src/engine/useScrollEngine.ts`

- [ ] **Step 1: Add the dependency**

In `packages/comic/package.json`, add under `"dependencies"`:
```json
"@badcode/scroll-timeline": "*"
```

Run `npm install` from the repo root to link it.

- [ ] **Step 2: Add `phases` to `Page.tsx`**

At the top of `packages/comic/src/components/Page.tsx`, add the import:
```ts
import type { Phases } from '@badcode/scroll-timeline'
```

Inside `PageProps`, add the new field directly after `scrollDuration`:
```ts
/**
 * Three-phase scroll budget. If provided, takes precedence over scrollDuration.
 * `{ enter: 0, hold: 1, exit: 0 }` is exactly equivalent to `scrollDuration={1}`.
 */
phases?: Phases
```

No other changes to `Page.tsx` — it passes props down; `ScrollComic` reads them.

- [ ] **Step 3: Rewrite the `durations` extraction in `ScrollComic.tsx`**

Add import at the top of `packages/comic/src/components/ScrollComic.tsx`:
```ts
import type { Phases } from '@badcode/scroll-timeline'
```

Replace the `durations` memo with `phases`:
```ts
// BEFORE:
const durations = useMemo(
  () => pageElements.map((p) => p.props.scrollDuration ?? 1),
  [pageElements],
)

// AFTER:
const phases = useMemo<Phases[]>(
  () =>
    pageElements.map((p) => {
      if (p.props.phases) return p.props.phases
      const d = p.props.scrollDuration ?? 1
      return { enter: 0, hold: d, exit: 0 }
    }),
  [pageElements],
)
```

Replace the `useScrollEngine` call:
```ts
// BEFORE:
const { percents, currentPage, overall, totalHeight } = useScrollEngine(containerRef, durations)

// AFTER:
const { percents, currentPage, overall, totalHeight } = useScrollEngine(containerRef, phases)
```

- [ ] **Step 4: Rewrite `useScrollEngine.ts` to use the core**

Replace the entire file content:

```ts
// packages/comic/src/engine/useScrollEngine.ts
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { layoutTimeline, sampleTimeline, type Phases } from '@badcode/scroll-timeline'

export interface ScrollEngineState {
  /** Per-page scroll progress (0..1) — linear through each page's full span. */
  percents:    number[]
  currentPage: number
  overall:     number
  totalHeight: number
}

function arraysClose(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > 0.0005) return false
  }
  return true
}

function clamp01(v: number): number { return v < 0 ? 0 : v > 1 ? 1 : v }

const MOBILE_BREAKPOINT = 768
const BASE_SECTION_VH  = 1.0
const MOBILE_SECTION_VH = 0.5

/**
 * Owns the scroll listener and maps scroll position to per-page progress and
 * the current page. rAF-throttled; state updates are coalesced when nothing
 * meaningfully changed to avoid re-render storms.
 *
 * Frame of reference: viewport centre (scrollY + vh/2 - containerTop).
 * This preserves the exact behaviour of the previous computeScrollState impl —
 * the page is "current" when the viewport centre is inside its section.
 */
export function useScrollEngine(
  containerRef: RefObject<HTMLElement>,
  phases: Phases[],
): ScrollEngineState {
  const [viewport, setViewport] = useState(() => ({
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    mobile: typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  }))

  const unitPx = (viewport.mobile ? MOBILE_SECTION_VH : BASE_SECTION_VH) * viewport.height

  const layout = useMemo(() => {
    const stepDefs = phases.map((p, i) => ({ id: String(i), phases: p }))
    return layoutTimeline(stepDefs, unitPx)
  }, [phases, unitPx])

  const [state, setState] = useState<{
    percents:    number[]
    currentPage: number
    overall:     number
  }>(() => ({ percents: phases.map(() => 0), currentPage: 0, overall: 0 }))

  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      ticking.current = false
      const container = containerRef.current
      if (!container) return
      const vh = window.innerHeight
      const scrollTop = window.scrollY
      const containerTop = container.offsetTop
      const containerHeight = container.offsetHeight

      // Viewport-centre reference frame — preserves previous behaviour.
      const relScrollPx = scrollTop + vh / 2 - containerTop

      const sample = sampleTimeline(layout, relScrollPx)

      // Linear progress 0..1 through each step's full span (used by effects).
      const percents = layout.steps.map((step) => {
        const span = step.end - step.enterStart
        return span > 0 ? clamp01((relScrollPx - step.enterStart) / span) : 0
      })

      const maxScroll = Math.max(1, containerHeight - vh)
      const overall = clamp01((scrollTop - containerTop) / maxScroll)

      setState((prev) => {
        if (
          prev.currentPage === sample.current &&
          Math.abs(prev.overall - overall) < 0.0005 &&
          arraysClose(prev.percents, percents)
        ) {
          return prev
        }
        return { percents, currentPage: sample.current, overall }
      })
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [containerRef, layout])

  useEffect(() => {
    const onResize = () =>
      setViewport({
        height: window.innerHeight,
        mobile: window.innerWidth < MOBILE_BREAKPOINT,
      })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    percents:    state.percents,
    currentPage: state.currentPage,
    overall:     state.overall,
    totalHeight: layout.totalHeight,
  }
}
```

- [ ] **Step 5: Typecheck the comic package**

```bash
cd /home/kai/projects/badcode/badcode
npm run typecheck 2>&1 | tail -12
```
Expected: PASS for all workspaces.

- [ ] **Step 6: Commit**

```bash
git add packages/comic packages/scroll-timeline/package.json
git commit -m "feat(comic): migrate scroll engine to @badcode/scroll-timeline; add phases prop to Page"
```

---

## Task 3: Validate migration — add `phases` to CampingComic

This confirms backwards-compat works on a real shipped comic. The reader experience must not change.

**Files:**
- Modify: `apps/web/src/comics/camping/CampingComic.tsx`

- [ ] **Step 1: Add `phases` to each `<Page>` in `CampingComic.tsx`**

For each `<Page scrollDuration={d} ...>`, add `phases={{ enter: 0, hold: d, exit: 0 }}` (equivalent — explicit for validation). Example for the first page:

```tsx
<Page
  phases={{ enter: 0, hold: 1.4, exit: 0 }}
  scrollDuration={1.4}
  effect={zoom({ amount: 1.4, focal: [0.75, 0.27] })}
  background="#0a0f1c"
>
```

Do this for all 8 pages. The `scrollDuration` can be kept alongside or removed — keep it for now to confirm backwards-compat coexistence.

- [ ] **Step 2: Browser verify CampingComic still reads correctly**

Visit `http://localhost:5173/comics/camping`. Scroll all the way through. Confirm: zoom effects work, grayscale transitions correctly, speech bubbles appear at the right scroll positions, no visible regression.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/comics/camping/CampingComic.tsx
git commit -m "feat(camping): add explicit phases prop to each Page (validates comic migration)"
```

---

## Task 4: Homepage `timeline.ts` + `useTimeline.ts`

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/src/home/timeline.ts`
- Create: `apps/web/src/home/timeline.test.ts`
- Create: `apps/web/src/home/useTimeline.ts`

- [ ] **Step 1: Add `@badcode/scroll-timeline` to web package**

In `apps/web/package.json`, add under `"dependencies"`:
```json
"@badcode/scroll-timeline": "*"
```

Run `npm install`.

- [ ] **Step 2: Write failing tests**

```ts
// apps/web/src/home/timeline.test.ts
import { describe, it, expect } from 'vitest'
import { homeSteps, UNIT_VH } from './timeline'
import { layoutTimeline } from '@badcode/scroll-timeline'

describe('homeSteps', () => {
  it('every step has a unique id', () => {
    const ids = homeSteps.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every step has valid phases (all >= 0)', () => {
    for (const step of homeSteps) {
      expect(step.phases.enter).toBeGreaterThanOrEqual(0)
      expect(step.phases.hold).toBeGreaterThanOrEqual(0)
      expect(step.phases.exit).toBeGreaterThanOrEqual(0)
    }
  })

  it('bad-branch steps come before good-branch steps', () => {
    const firstGood = homeSteps.findIndex((s) => s.branch === 'good')
    const lastBad   = homeSteps.map((s) => s.branch).lastIndexOf('bad')
    expect(firstGood).toBeGreaterThan(lastBad)
  })

  it('camping is the first step and is live', () => {
    const camping = homeSteps[0]
    expect(camping.id).toBe('camping')
    expect(camping.status).toBe('live')
    expect(camping.route).toBe('/comics/camping')
  })

  it('layouts without error at UNIT_VH=1, unitPx=800', () => {
    const layout = layoutTimeline(homeSteps, UNIT_VH * 800)
    expect(layout.steps.length).toBe(homeSteps.length)
    expect(layout.totalHeight).toBeGreaterThan(0)
  })
})
```

Run to confirm FAIL:
```bash
cd /home/kai/projects/badcode/badcode/apps/web && npx vitest run src/home/timeline.test.ts 2>&1 | tail -8
```
Expected: FAIL — `timeline.ts` does not exist.

- [ ] **Step 3: Create `timeline.ts`**

```ts
// apps/web/src/home/timeline.ts
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
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
cd /home/kai/projects/badcode/badcode/apps/web && npx vitest run src/home/timeline.test.ts 2>&1 | tail -6
```
Expected: PASS.

- [ ] **Step 5: Create `useTimeline.ts`**

```ts
// apps/web/src/home/useTimeline.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { layoutTimeline, sampleTimeline, type TimelineLayout, type TimelineSample } from '@badcode/scroll-timeline'
import { homeSteps, UNIT_VH } from './timeline'

export interface UseTimelineResult {
  sample: TimelineSample
  layout: TimelineLayout
}

const INITIAL_SAMPLE: TimelineSample = {
  focus:     homeSteps.map(() => 0),
  current:   0,
  overview:  true,
  position:  0,
  direction: 'none',
}

/**
 * Owns the scroll track for the homepage.
 * - Computes unitPx = window.innerHeight × UNIT_VH (responsive)
 * - Calls layoutTimeline(homeSteps, unitPx) — memoised on resize
 * - Calls sampleTimeline on each scroll frame → returns { sample, layout }
 * - Caller (Scene.tsx) sets the scroll-driver div height to layout.totalHeight
 */
export function useTimeline(): UseTimelineResult {
  const [unitPx, setUnitPx] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight * UNIT_VH : 800,
  )

  const layout = useMemo(() => layoutTimeline(homeSteps, unitPx), [unitPx])

  const [sample, setSample] = useState<TimelineSample>(INITIAL_SAMPLE)
  const prevScrollY = useRef(0)
  const ticking = useRef(false)

  const update = useCallback(() => {
    ticking.current = false
    const scrollY = window.scrollY
    const next = sampleTimeline(layout, scrollY, prevScrollY.current)
    prevScrollY.current = scrollY
    setSample((prev) => {
      // Skip re-render if nothing meaningful changed.
      if (
        prev.overview === next.overview &&
        prev.current === next.current &&
        Math.abs(prev.position - next.position) < 0.001 &&
        prev.focus.every((f, i) => Math.abs(f - next.focus[i]) < 0.001)
      ) {
        return prev
      }
      return next
    })
  }, [layout])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [update])

  useEffect(() => {
    const onResize = () => setUnitPx(window.innerHeight * UNIT_VH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return { sample, layout }
}
```

- [ ] **Step 6: Typecheck and commit**

```bash
cd /home/kai/projects/badcode/badcode
npm run typecheck 2>&1 | tail -12
git add apps/web/package.json apps/web/src/home/timeline.ts apps/web/src/home/timeline.test.ts apps/web/src/home/useTimeline.ts
git commit -m "feat(home): timeline.ts homeSteps + useTimeline hook"
```

---

## Task 5: Remove `storyNodes` and `waypoints` from `graph.ts`

**Files:**
- Modify: `apps/web/src/home/graph.ts`
- Modify: `apps/web/src/home/graph.test.ts`

- [ ] **Step 1: Update `graph.test.ts` — remove tests that reference removed exports**

Replace the entire file content:

```ts
// apps/web/src/home/graph.test.ts
import { describe, it, expect } from 'vitest'
import { GRAPH } from './graph'

describe('graph', () => {
  it('defines the three branches with at least two points each', () => {
    expect(GRAPH.branches.history.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.bad.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.good.length).toBeGreaterThanOrEqual(2)
  })

  it('the tour begins at history start and ends at the good (future proof) tip', () => {
    const first = GRAPH.tour[0]
    const last  = GRAPH.tour[GRAPH.tour.length - 1]
    expect(first).toEqual(GRAPH.branches.history[0])
    expect(last).toEqual(GRAPH.branches.good[GRAPH.branches.good.length - 1])
  })

  it('the tour retraces through the fork (origin appears twice)', () => {
    const atFork = GRAPH.tour.filter(([x, y]) => x === 0 && y === 0)
    expect(atFork.length).toBe(2)
  })
})
```

- [ ] **Step 2: Remove `storyNodes`, `waypoints`, and their types from `graph.ts`**

In `apps/web/src/home/graph.ts`:

1. Remove the `StoryNode` interface and `NodeStatus` type entirely.
2. Remove the `storyNodes` export.
3. Remove the `waypoints` export.
4. Keep everything else (`Vec2`, `Branch`, geometry constants, `GRAPH`).

The file after editing should export only: `Vec2`, `Branch`, `GRAPH`.

The `StoryNode` type equivalent is now `HomeStep` in `timeline.ts`. The `Branch` type is kept because `Spine.tsx` and other geometry code still references it.

- [ ] **Step 3: Fix broken imports — `Scene.tsx`, `Fallback2D.tsx`**

In `apps/web/src/home/Scene.tsx`, change:
```ts
// BEFORE
import { GRAPH, storyNodes } from './graph'
// AFTER
import { GRAPH } from './graph'
```
(Full Scene.tsx rewrite comes in Task 11 — this is a minimal fix to unbreak the build now.)

Also remove the re-emerge `storyNodes.find(...)` block for now (it will be rewritten in Task 11):
```ts
// Remove this block entirely for now:
// const fromNode = ...
// if (fromNode && ctrl.mode === 'intro') { ... }
```

In `apps/web/src/home/Fallback2D.tsx`, change:
```ts
// BEFORE
import { GRAPH, storyNodes } from './graph'
// AFTER
import { GRAPH } from './graph'
import { homeSteps } from './timeline'
```

And update the story-node render inside the SVG:
```tsx
{homeSteps.map((n) => (
  <Link key={n.id} to={n.route ?? '#'} aria-label={`${n.title}${n.status === 'live' ? '' : ' (coming soon)'}`}>
    <rect x={SX(n.pos[0]) - 14} y={SY(n.pos[1]) - 14} width={240} height={28} fill="transparent" />
    <line x1={SX(n.clip[0])} y1={SY(n.clip[1])} x2={SX(n.pos[0])} y2={SY(n.pos[1])} stroke={COLORS.tether} strokeWidth={1} />
    <circle cx={SX(n.pos[0])} cy={SY(n.pos[1])} r={8} fill="none" stroke={COLORS.cyan} strokeWidth={2} opacity={n.status === 'live' ? 1 : 0.5} />
    <text x={SX(n.pos[0]) + 12} y={SY(n.pos[1]) + 4} fill={COLORS.cyan} fontSize={12} opacity={n.status === 'live' ? 1 : 0.6}>
      {n.title}
    </text>
  </Link>
))}
```

- [ ] **Step 4: Run the full test suite and typecheck**

```bash
cd /home/kai/projects/badcode/badcode
npm test 2>&1 | tail -20
npm run typecheck 2>&1 | tail -10
```
Expected: all tests PASS, typecheck PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/graph.ts apps/web/src/home/graph.test.ts apps/web/src/home/Scene.tsx apps/web/src/home/Fallback2D.tsx
git commit -m "refactor(home): remove storyNodes/waypoints from graph.ts (replaced by homeSteps in timeline.ts)"
```

---

## Task 6: Update `cameraController.ts` — remove `t`

The `t` field (spline position) is no longer used. `CameraRig` will read `focus[]` from context instead.

**Files:**
- Modify: `apps/web/src/home/cameraController.ts`

- [ ] **Step 1: Rewrite `cameraController.ts`**

Replace the entire file:

```ts
// apps/web/src/home/cameraController.ts
import { createContext, useContext } from 'react'

export type CameraMode = 'intro' | 'travel'

/** Mutable ref-like controller shared by the rig, the opening sequence, and Chrome. */
export interface CameraController {
  mode:         CameraMode
  drawProgress: number
}

export function createCameraController(): CameraController {
  return { mode: 'intro', drawProgress: 0 }
}

export const CameraControllerContext = createContext<CameraController | null>(null)

export function useCameraController(): CameraController {
  const c = useContext(CameraControllerContext)
  if (!c) throw new Error('useCameraController must be inside CameraControllerContext')
  return c
}
```

- [ ] **Step 2: Typecheck**

```bash
cd /home/kai/projects/badcode/badcode && npm run typecheck 2>&1 | tail -10
```
Expected: PASS. If `ctrl.t` is referenced anywhere the compiler will tell you; fix each occurrence (there should be none after Task 5's Scene.tsx edit).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/cameraController.ts
git commit -m "refactor(home): remove t from CameraController (camera now uses explicit poses)"
```

---

## Task 7: Rewrite `CameraRig.tsx` — explicit pose interpolation

Camera blends between neighbouring step poses weighted by `focus[]` from a `TimelineSample` passed as a prop. When `overview = true`, it eases to `OVERVIEW_POSE`.

**Files:**
- Modify: `apps/web/src/home/CameraRig.tsx`

- [ ] **Step 1: Rewrite `CameraRig.tsx`**

```tsx
// apps/web/src/home/CameraRig.tsx
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { homeSteps, OVERVIEW_POSE, type CameraPose } from './timeline'
import { useCameraController } from './cameraController'
import type { TimelineSample } from '@badcode/scroll-timeline'

const desiredPos  = new Vector3()
const desiredLook = new Vector3()
const lookTarget  = new Vector3(6, 0, 0)

function poseToVectors(pose: CameraPose): [Vector3, Vector3] {
  return [
    new Vector3(...pose.position),
    new Vector3(...pose.lookAt),
  ]
}

const [overviewPos, overviewLook] = poseToVectors(OVERVIEW_POSE)

/**
 * Drives the camera from the timeline sample each frame.
 * overview=true → ease to OVERVIEW_POSE (the zoomed-out bookend).
 * overview=false → blend between neighbouring step poses weighted by focus[].
 *
 * Because the hand-off is sequential, at most one focus[i] > 0 at a time, so the
 * blend is simply: desiredPos = homeSteps[current].camera.position (during hold).
 * During enter/exit, focus[prev] falls while focus[next] rises — they interpolate
 * naturally without extra code.
 */
export function CameraRig({ sample }: { sample: TimelineSample }) {
  const camera = useThree((s) => s.camera)
  const ctrl   = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt) // frame-rate-independent lerp factor

    if (ctrl.mode === 'intro' || sample.overview) {
      desiredPos.copy(overviewPos)
      desiredLook.copy(overviewLook)
    } else {
      // Weighted blend of all step poses by focus.
      desiredPos.set(0, 0, 0)
      desiredLook.set(0, 0, 0)
      let totalFocus = 0
      for (let i = 0; i < homeSteps.length; i++) {
        const f = sample.focus[i]
        if (f <= 0) continue
        const [p, l] = poseToVectors(homeSteps[i].camera)
        desiredPos.addScaledVector(p, f)
        desiredLook.addScaledVector(l, f)
        totalFocus += f
      }
      if (totalFocus > 0) {
        desiredPos.divideScalar(totalFocus)
        desiredLook.divideScalar(totalFocus)
      } else {
        // Between steps (both focus = 0) — hold nearest step's pose.
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

Note: `CameraRig` now takes `sample` as a prop. `Scene.tsx` (Task 11) passes it.

- [ ] **Step 2: Typecheck**

```bash
cd /home/kai/projects/badcode/badcode && npm run typecheck 2>&1 | tail -10
```
Expected: PASS (Scene.tsx won't compile yet if it passes wrong props — that's fine, it will be fixed in Task 11).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/CameraRig.tsx
git commit -m "feat(home): CameraRig explicit pose interpolation driven by focus[]"
```

---

## Task 8: Update `Constellation.tsx`, `StoryNode.tsx`, `Fallback2D.tsx`

Story nodes are now driven by `homeSteps` and `focus[]` from the timeline sample.

**Files:**
- Modify: `apps/web/src/home/Constellation.tsx`
- Modify: `apps/web/src/home/StoryNode.tsx`

- [ ] **Step 1: Rewrite `Constellation.tsx`**

```tsx
// apps/web/src/home/Constellation.tsx
import { homeSteps } from './timeline'
import { StoryNode } from './StoryNode'
import type { TimelineSample } from '@badcode/scroll-timeline'

export function Constellation({
  sample,
  nodesUnlocked,
  onFlash,
}: {
  sample:        TimelineSample
  nodesUnlocked: boolean[]
  onFlash:       () => void
}) {
  return (
    <group>
      {homeSteps.map((step, i) => (
        <StoryNode
          key={step.id}
          step={step}
          focus={sample.focus[i] ?? 0}
          unlocked={nodesUnlocked[i] ?? false}
          onFlash={onFlash}
        />
      ))}
    </group>
  )
}
```

- [ ] **Step 2: Rewrite `StoryNode.tsx`**

```tsx
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
  unlocked,
  layout,
  onFlash,
}: {
  step:     HomeStep
  focus:    number
  unlocked: boolean
  layout:   TimelineLayout
  onFlash:  () => void
}) {
  const navigate   = useNavigate()
  const ctrl       = useCameraController()
  const [hovered, setHovered] = useState(false)
  const dim   = step.status === 'live' ? 1 : 0.45
  const [cx, cy] = step.pos
  const [tx, ty] = step.clip

  const enter = () => {
    ctrl.mode = 'travel'
    flyToStep(step.id, layout, 1.1)
    gsap.delayedCall(1.0, () => {
      onFlash()
      gsap.delayedCall(0.35, () =>
        navigate(step.route ?? '#', { state: { fromNode: step.id } }),
      )
    })
  }

  if (!unlocked) return null

  return (
    <group>
      <Line
        points={[[tx, ty, 0], [cx, cy, 0]]}
        color={COLORS.tether}
        lineWidth={1}
        transparent
        opacity={0.7 * focus}
      />
      {/* Invisible hit-sphere (radius 1.2) — carries hover/click handlers. */}
      <mesh
        position={[cx, cy, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); enter() }}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Visible sphere — size driven by hover; opacity driven by focus. */}
      <mesh position={[cx, cy, 0]}>
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={dim * Math.max(focus, 0.15)}  // faint when not in focus
          toneMapped={false}
        />
      </mesh>
      <Html position={[cx + 1, cy + 0.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color:       COLORS.cyan,
          fontFamily:  'var(--mono)',
          fontSize:    12,
          whiteSpace:  'nowrap',
          opacity:     hovered || step.status === 'live' ? dim * Math.max(focus, 0.2) : 0.25 * focus,
          transition:  'opacity 120ms',
        }}>
          {step.title}{step.status === 'coming-soon' ? ' · soon' : ''}
        </div>
      </Html>
    </group>
  )
}
```

Note: `StoryNode` now receives `layout` (for `flyToStep`). `Constellation` passes it through (Scene.tsx provides it). Update `Constellation.tsx` to thread `layout`:

```tsx
// apps/web/src/home/Constellation.tsx  (updated)
import { homeSteps } from './timeline'
import { StoryNode } from './StoryNode'
import type { TimelineSample, TimelineLayout } from '@badcode/scroll-timeline'

export function Constellation({
  sample,
  layout,
  nodesUnlocked,
  onFlash,
}: {
  sample:        TimelineSample
  layout:        TimelineLayout
  nodesUnlocked: boolean[]
  onFlash:       () => void
}) {
  return (
    <group>
      {homeSteps.map((step, i) => (
        <StoryNode
          key={step.id}
          step={step}
          focus={sample.focus[i] ?? 0}
          unlocked={nodesUnlocked[i] ?? false}
          layout={layout}
          onFlash={onFlash}
        />
      ))}
    </group>
  )
}
```

- [ ] **Step 3: Typecheck**

```bash
cd /home/kai/projects/badcode/badcode && npm run typecheck 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Constellation.tsx apps/web/src/home/StoryNode.tsx
git commit -m "feat(home): Constellation + StoryNode driven by focus[] and nodesUnlocked[]"
```

---

## Task 9: Verify `Spine.tsx` — no changes required

The round-1 `Spine.tsx` (staged self-draw, constant-length buffer) is already correct. Node label visibility is gated by `focus[]` opacity in `StoryNode` (Task 8) — a focus near 0 makes nodes invisible — so no additional draw-progress gate is needed in `Spine.tsx`.

**Files:** none modified.

- [ ] **Step 1: Confirm `Spine.tsx` has no unused imports after Tasks 5–8**

```bash
cd /home/kai/projects/badcode/badcode && npm run typecheck 2>&1 | tail -10
```
Expected: PASS. If any stale import surfaces, remove it.

- [ ] **Step 2: Browser verify the opening self-draw**

Visit `http://localhost:5173/` and reload. Confirm: history line draws, then bad branch, then good branch; no full-fork snap; commit spheres appear as the draw front passes them. This is the round-1 behaviour — confirm it still works after Task 8's changes.

No commit needed (no files changed).

---

## Task 10: Rewrite `drivers.ts` + update `Chrome.tsx`

`flyToT` is replaced by `flyToStep(id, layout)`. `autoplay(layout)` sweeps to `layout.totalHeight`.

**Files:**
- Modify: `apps/web/src/home/drivers.ts`
- Modify: `apps/web/src/home/Chrome.tsx`

- [ ] **Step 1: Rewrite `drivers.ts`**

```ts
// apps/web/src/home/drivers.ts
import gsap from 'gsap'
import type { TimelineLayout } from '@badcode/scroll-timeline'

/** Fly to a step's hold-start position — where the camera settles on that beat. */
export function flyToStep(
  id: string,
  layout: TimelineLayout,
  duration = 1.6,
): gsap.core.Tween {
  const step = layout.steps.find((s) => s.id === id)
  const target = step ? step.holdStart : 0
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: target,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}

/** Trailer/attract: sweep from the current scroll position to the end of the track. */
export function autoplay(layout: TimelineLayout, duration = 18): gsap.core.Tween {
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: Math.max(0, layout.totalHeight - window.innerHeight),
    duration,
    ease: 'none',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}
```

- [ ] **Step 2: Rewrite `Chrome.tsx`**

```tsx
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

export function Chrome({ layout }: { layout: TimelineLayout }) {
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
      <div style={{ position: 'absolute', top: 20, left: 24, pointerEvents: 'auto' }}>
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700 }}>BADCODE</div>
        <div style={{ color: 'var(--grey)', fontSize: 11 }}>git push origin master</div>
      </div>
      <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 10, pointerEvents: 'auto' }}>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToStep('storyverse', layout) }}>storyverse</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToStep('future-proof', layout) }}>future proof</button>
        <button style={btn} onClick={togglePlay}>{playing ? 'stop' : 'play'}</button>
        <Link to="/about" style={{ ...btn, display: 'inline-block' }}>about</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

```bash
cd /home/kai/projects/badcode/badcode && npm run typecheck 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/drivers.ts apps/web/src/home/Chrome.tsx
git commit -m "feat(home): flyToStep + autoplay(layout); Chrome buttons keyed to step ids"
```

---

## Task 11: Rewrite `Scene.tsx` — wire `useTimeline` + overview + any-interaction

**Files:**
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Rewrite `Scene.tsx`**

```tsx
// apps/web/src/home/Scene.tsx
import { useRef, useState, useEffect } from 'react'
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
import { GRAPH } from './graph'
import { homeSteps } from './timeline'
import { flyToStep } from './drivers'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useTimeline } from './useTimeline'

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)

  const { sample, layout } = useTimeline()

  // Transition from intro to travel when timeline leaves overview state.
  useEffect(() => {
    if (!sample.overview && ctrl.mode === 'intro') {
      ctrl.mode = 'travel'
    }
  }, [sample.overview, ctrl])

  // Any-interaction: clicking while at the overview (scroll=0) triggers travel to step 0.
  const handleFirstClick = () => {
    if (ctrl.mode === 'intro') {
      ctrl.mode = 'travel'
      flyToStep(homeSteps[0].id, layout, 0.8)
    }
  }

  // Re-emerge: returning from a comic navigates scroll to that step's hold position.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  useEffect(() => {
    if (!fromNode) return
    const step = layout.steps.find((s) => s.id === fromNode)
    if (step) {
      window.scrollTo({ top: step.holdStart, behavior: 'instant' })
      ctrl.mode = 'travel'
      ctrl.drawProgress = 1
    }
  }, [fromNode, layout, ctrl])

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas" onPointerDown={handleFirstClick}>
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig sample={sample} />
          <Spine />
          <Constellation sample={sample} layout={layout} onFlash={() => setFlash(true)} />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <Chrome layout={layout} />
      <OpeningSequence />
      <Narration />
      {flash && (
        <div
          style={{ position: 'fixed', inset: 0, background: COLORS.cyan, zIndex: 3, pointerEvents: 'none' }}
        />
      )}
      {/* Scroll track height is derived from phase budgets, not SCROLL_PAGES. */}
      <div
        className="home-scroll-driver"
        style={{ height: layout.totalHeight }}
        aria-hidden
      />
    </CameraControllerContext.Provider>
  )
}
```

Node visibility is gated by `focus[]` opacity in `StoryNode` — a `focus` near 0 makes nodes invisible, so no additional `nodesUnlocked` prop is needed. `Spine` owns the line-geometry reveal (draw-progress); `StoryNode` opacity owns the label/sphere reveal (focus). Clean separation.

- [ ] **Step 2: Verify `Constellation` and `StoryNode` match the Task 8 implementation**

The Task 8 code already uses the simplified form (no `nodesUnlocked` prop, focus-based opacity). Confirm the Scene.tsx props match what Task 8's `Constellation.tsx` expects. No extra edits needed.

- [ ] **Step 3: Full typecheck**

```bash
cd /home/kai/projects/badcode/badcode
npm run typecheck 2>&1 | tail -15
```
Expected: PASS for all workspaces.

- [ ] **Step 4: Run full test suite**

```bash
npm test 2>&1 | tail -20
```
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/Scene.tsx apps/web/src/home/Constellation.tsx apps/web/src/home/StoryNode.tsx apps/web/src/home/Spine.tsx
git commit -m "feat(home): wire useTimeline + CameraRig explicit poses + overview bookends + any-interaction"
```

---

## Task 12: Final verification

- [ ] **Full unit suite from root**

```bash
npm test 2>&1 | tail -20
```
Expected: all workspaces green.

- [ ] **Full typecheck from root**

```bash
npm run typecheck 2>&1 | tail -10
```
Expected: PASS.

- [ ] **Browser pass — dev server at http://localhost:5173/**

Verify each item:

1. **Opening**: Spine draws history → bad → good; node labels fade in as the draw front reaches each clip point; camera holds the wide overview throughout.
2. **Any-interaction**: clicking the screen while at the overview flies the camera to the first step.
3. **Scrolling**: camera travels step by step — Camping → Karen → Emperor's → Storyverse → Optimistic Lens → Future Proof.
4. **Overview bookend at end**: scrolling past Future Proof zooms out to the overview.
5. **Back-scroll**: reversing all the way back to scroll=0 zooms out again.
6. **play / stop**: play sweeps the full track; stop halts it.
7. **Waypoint buttons**: storyverse and future-proof buttons fly to their steps.
8. **Clickable nodes**: Camping navigates to `/comics/camping`; Karen → `/comics/karen`; cursor changes to pointer on hover.
9. **Re-emerge**: navigating back from `/comics/camping` resumes with camera at the Camping step.
10. **Reduced-motion 2D fallback**: shows the static SVG fork with all nodes.
11. **CampingComic**: scroll through `/comics/camping` — all effects (zoom, grayscale, transitions, bubbles) work correctly.

- [ ] **Camera pose tuning**

The seed `position` and `lookAt` values in `timeline.ts` are estimates. On the browser pass, adjust them step by step:
- For each step, use `flyToStep('step-id', layout)` from the Chrome buttons (or scroll to that step's hold phase).
- Tweak `camera.position` and `camera.lookAt` in `timeline.ts` until the framing feels right.
- Commit the tuned values.
