# Scroll-timeline core — design spec

**Date:** 2026-06-04
**Status:** approved design, ready for implementation planning
**Builds on:** round-1 homepage tuning (branch `homepage-tuning`, 7 commits). Tunes and extends the scroll/camera/content choreography without touching `@badcode/comic`'s rendering pipeline or `CampingComic`'s panels.

---

## What this builds

A renderer-agnostic scroll-timeline engine that drives **both** the 3D homepage and the existing 2D comic reader. The engine lives in a new pure package `@badcode/scroll-timeline`; each consumer adds a thin adapter layer on top.

The central abstraction: every story beat is a **step** with three scroll-budget phases (`enter`, `hold`, `exit`) in relative units. A global unit coefficient scales all phases uniformly. The engine lays these budgets onto the scroll track, then on each scroll frame returns a **`focus`** value per step (0 → 1 → 0 trapezoid) plus flags for `current`, `overview`, `direction`, and overall `position`. Consumers react to those signals — cameras, effects, content visibility — without knowing anything about the budget math.

---

## Decisions made

| Question | Decision |
|---|---|
| Shared engine scope | New `@badcode/scroll-timeline` package — pure, no DOM/React/three.js |
| Build order | Core + homepage + 2D comic migration all in this iteration |
| Transition model | **Sequential hand-off** — step i fully exits before step i+1 enters; transition span = `exit(i) + enter(i+1)` |
| Camera model | **Explicit poses** — each step declares `{ position: [x,y,z], lookAt: [x,y,z] }` |

---

## Part 1 · `@badcode/scroll-timeline` (new package)

### Location

`packages/scroll-timeline/` — a new npm workspace package exporting pure TypeScript. No dependencies beyond the monorepo root `tsconfig.base.json`.

### Public API

```ts
// A step's scroll-budget in relative units (1 = one global "standard unit").
export interface Phases { enter: number; hold: number; exit: number }

// Minimal step definition (consumers extend this with their own fields).
export interface StepDef { id: string; phases: Phases }

// Computed layout — stable object, recomputed only when unitPx or steps change.
export interface StepLayout {
  id: string
  enterStart: number  // absolute scroll px
  holdStart:  number
  exitStart:  number
  end:        number
}
export interface TimelineLayout {
  steps:       StepLayout[]
  totalHeight: number  // scroll track height including bookend pads
}

// Layout: convert phase budgets → absolute scroll offsets.
// unitPx = one standard unit in pixels (e.g. window.innerHeight for UNIT_VH = 1).
// Bookend pads of 0.5 × unitPx are added before step 0 and after the last step.
export function layoutTimeline(steps: StepDef[], unitPx: number): TimelineLayout

// Per-frame sample result.
export interface TimelineSample {
  focus:     number[]           // focus[i] ∈ [0,1]; trapezoid per step
  current:   number             // index of highest-focus step
  overview:  boolean            // true when outside all steps (start or end bookend)
  position:  number             // 0..1 across the whole track
  direction: 'fwd' | 'bwd' | 'none'
}

// Sample: called on every scroll frame.
export function sampleTimeline(
  layout: TimelineLayout,
  scrollPx: number,
  prevScrollPx?: number,        // needed for direction
): TimelineSample
```

### Focus trapezoid (sequential hand-off)

For step `i` with layout `{ enterStart, holdStart, exitStart, end }`:

```
focus[i] = clamp01((scrollPx - enterStart) / (holdStart - enterStart))   during enter
          = 1                                                               during hold
          = clamp01((end - scrollPx) / (end - exitStart))                  during exit
          = 0                                                               outside
```

Steps never overlap on the scroll track — `end(i) === enterStart(i+1)` — so at any scroll position at most one step has `focus > 0` (apart from the boundary instant). `current` is the index with the largest `focus`; ties go to the later step (forward travel convention).

### Overview bookends

`overview = true` when `scrollPx < steps[0].enterStart` (start bookend) **or** `scrollPx >= steps[last].end` (end bookend). When overview, `current` is `0` (start bookend) or `steps.length - 1` (end bookend) — the nearest step — so consumers can read its pose as the "resting" framing.

### Testing

Unit-tested in `packages/scroll-timeline/src/index.test.ts` (vitest, node env):

- `layoutTimeline` produces correctly ordered scroll offsets; `totalHeight` matches sum of all phases × unitPx + pads.
- `focus[i]` is 0 at `enterStart`, ramps to 1 at `holdStart`, stays 1 through hold, ramps to 0 at `end`.
- At any scroll position, at most one `focus[i] > 0`.
- `overview = true` before the first enter and after the last exit.
- `direction` matches scroll delta sign.

---

## Part 2 · Homepage migration

### New files

| File | Role |
|---|---|
| `apps/web/src/home/timeline.ts` | `homeSteps` array + `UNIT_VH` + `OVERVIEW_POSE` |
| `apps/web/src/home/useTimeline.ts` | React hook — wraps `layoutTimeline`/`sampleTimeline`, drives scroll listener, returns `TimelineSample` |

### Modified files

| File | Change |
|---|---|
| `graph.ts` | `storyNodes` and `waypoints` removed; geometry constants (`FORK`, branches, etc.) kept for `Spine.tsx` |
| `CameraRig.tsx` | Replaces spline-t follow with pose interpolation driven by `focus[]` |
| `StoryNode.tsx` | Receives `focus` prop; visibility and opacity gated on it |
| `Constellation.tsx` | Passes `focus[i]` down to each `StoryNode` |
| `Chrome.tsx` | `flyToT` / `autoplay` replaced with `flyToStep(id)` / `autoplay()` using `useTimeline` |
| `drivers.ts` | Rewritten around step ids and scroll offsets from the layout |
| `Scene.tsx` | Mounts `useTimeline`; passes `overview` flag to `CameraRig`; connects `drawProgress` label gate |
| `Spine.tsx` | Label gate: node label visibility gated on `drawProgress` reaching clip x (extends existing commit-sphere gate) |

### `timeline.ts` — authoring shape

```ts
export const UNIT_VH = 1.0   // 1 unit = 1 viewport of scroll; global speed knob

export interface CameraPose { position: [number, number, number]; lookAt: [number, number, number] }

export const OVERVIEW_POSE: CameraPose = {
  position: [6, 0, 76],   // existing pulled-back overview
  lookAt:   [6, 0, 0],
}

export interface HomeStep extends StepDef {
  camera:  CameraPose
  title:   string
  branch:  'bad' | 'good'     // which branch the node sits on (for draw-gate threshold)
  route?:  string
  status?: 'live' | 'coming-soon'
  clip:    [number, number]   // branch attachment point (for Spine tether)
  pos:     [number, number]   // node float position (for StoryNode)
}

export const homeSteps: HomeStep[] = [
  { id: 'camping',
    phases: { enter: 1, hold: 1, exit: 1 },
    camera: { position: [10, 8, 18], lookAt: [10, 6, 0] },
    title: 'Camping', route: '/comics/camping', status: 'live',
    clip: [10, 6], pos: [10, 10] },
  { id: 'karen',
    phases: { enter: 1, hold: 2, exit: 1 },
    camera: { position: [18, 12, 18], lookAt: [18, 6, 0] },
    title: 'Karen Will Lead the Revolution', status: 'coming-soon',
    clip: [18, 6], pos: [18, 14] },
  { id: 'emperors-coin',
    phases: { enter: 1, hold: 1, exit: 1 },
    camera: { position: [25, 9, 18], lookAt: [25, 6, 0] },
    title: "Emperor's New Coin", status: 'coming-soon',
    clip: [25, 6], pos: [25, 10.5] },
  { id: 'storyverse',
    phases: { enter: 2, hold: 1, exit: 2 },
    camera: { position: [30, 8, 22], lookAt: [30, 6, 0] },
    title: 'Storyverse', route: '/storyverse',
    clip: [30, 6], pos: [30, 6] },
  { id: 'optimistic-lens',
    phases: { enter: 2, hold: 1, exit: 1 },
    camera: { position: [18, -9, 18], lookAt: [18, -6, 0] },
    title: 'An Optimistic Lens', status: 'coming-soon',
    clip: [18, -6], pos: [18, -11] },
  { id: 'future-proof',
    phases: { enter: 1, hold: 1, exit: 2 },
    camera: { position: [30, -8, 22], lookAt: [30, -6, 0] },
    title: 'Future Proof', route: '/future-proof',
    clip: [30, -6], pos: [30, -6] },
]
```

Camera values above are **seed estimates** to be refined in the browser — the architecture is the contract, not the numbers.

### Camera interpolation

`CameraRig` drives the camera from `TimelineSample` each frame:

```
if overview:
  desiredPos  = OVERVIEW_POSE.position
  desiredLook = OVERVIEW_POSE.lookAt

else:
  // weighted blend of all steps with focus > 0
  // (in practice at most one has focus > 0 at a time due to sequential hand-off;
  //  boundary instant: two steps at focus > 0 — blend naturally)
  desiredPos  = Σ( focus[i] × homeSteps[i].camera.position )
  desiredLook = Σ( focus[i] × homeSteps[i].camera.lookAt  )
  // normalise by Σ(focus[i]) if > 1 (safety; normally == 1 or ≤ 1)

camera.position.lerp(desiredPos, k)   // same frame-rate-independent k as round-1
lookTarget.lerp(desiredLook, k)
camera.lookAt(lookTarget)
```

During a step's **hold** phase `focus[i] = 1`, so the camera is locked onto that step's pose (still damped, so it settles smoothly). During the transition (`exit(i) + enter(i+1)`) `focus[i]` falls from 1→0 while `focus[i+1]` rises from 0→1, so the camera interpolates naturally between the two poses with no extra code.

### Overview bookend behaviour

- **Start bookend** (`overview = true`, scroll near 0): camera eases to `OVERVIEW_POSE`. The self-assembly opening plays once when `drawProgress` animates 0→1.
- **Any-interaction trigger**: first scroll or pointer event while `overview = true` → `ctrl.mode = 'travel'`; camera begins following the timeline. No special "enter the experience" button needed.
- **End bookend** (`overview = true`, scroll past last step's exit): camera eases back to `OVERVIEW_POSE`. User can reverse and travel back through the timeline.

### Content-gated label reveal (during opening draw)

Extends the round-1 commit-sphere gate already in `Spine.tsx`. When `drawProgress` reaches the `clip.x` of a `HomeStep`, that step's `StoryNode` (label + sphere) becomes visible. Before the draw front reaches it, `StoryNode` renders with `opacity: 0` and `pointer-events: none`. This replaces the immediate full-render of all nodes at page load.

The unlock threshold for each clip point is derived from the same staged mapping used for commit spheres. `drawProgress` is staged as:

- history (`x ∈ [-30, 0]`): draw front is at `x` when `p = ((x + 30) / 30) * 0.4`
- bad branch (`x ∈ [0, 30]`, `branch = 'bad'`): draw front is at `x` when `p = 0.4 + (x / 30) * 0.32`
- good branch (`x ∈ [0, 30]`, `branch = 'good'`): draw front is at `x` when `p = 0.72 + (x / 30) * 0.28`

```ts
// In Spine.tsx useFrame — after computing commit-sphere visibility:
homeSteps.forEach((step, i) => {
  const [cx] = step.clip
  let unlockAt: number
  if (step.branch === 'bad')       unlockAt = 0.4 + (cx / 30) * 0.32
  else if (step.branch === 'good') unlockAt = 0.72 + (cx / 30) * 0.28
  else                             unlockAt = ((cx + 30) / 30) * 0.4
  nodesUnlocked[i] = drawProgress >= unlockAt
})
```

`HomeStep` gains a `branch: 'bad' | 'good'` field (already present in the old `StoryNode`); `nodesUnlocked` is passed down via `CameraControllerContext` or a new `TimelineContext`.

### `useTimeline` hook

```ts
export function useTimeline(): { sample: TimelineSample; layout: TimelineLayout } {
  // 1. Computes unitPx from window.innerHeight * UNIT_VH (responsive to resize)
  // 2. Calls layoutTimeline(homeSteps, unitPx) — memoised on unitPx changes
  // 3. Returns layout.totalHeight to Scene.tsx, which sets it on the .home-scroll-driver div
  //    (replaces SCROLL_PAGES * 100vh hardcode — height is now derived from authored budgets)
  // 4. window scroll listener → sampleTimeline(layout, scrollY, prevScrollY) → setState
  // 5. Returns { sample, layout }
}
```

`Scene.tsx` sets the scroll-driver height: `<div className="home-scroll-driver" style={{ height: layout.totalHeight }} />`.  
`layout` is also passed into `drivers.ts` functions so `flyToStep` can compute `holdStart` offsets.

### Chrome / drivers

`flyToT(t)` replaced by `flyToStep(id: string, layout: TimelineLayout)` — looks up the step's `holdStart` offset in `layout` and tweens `window.scrollY` there. `autoplay(layout)` sweeps from 0 to `layout.totalHeight`. `Chrome.tsx` receives `layout` from `useTimeline` and passes it to both functions. The chrome buttons (`fork`, `storyverse`, `future proof`) are re-keyed to step ids (`'storyverse'`, `'future-proof'`).

---

## Part 3 · `@badcode/comic` migration

### `Page` component — new `phases` prop

```tsx
// New (explicit entry/hold/exit):
<Page phases={{ enter: 0.5, hold: 2, exit: 0.5 }} ...>

// Old (backwards-compat, maps to hold only):
<Page scrollDuration={2} ...>   // equivalent to phases={{ enter: 0, hold: 2, exit: 0 }}
```

`scrollDuration` stays valid; it maps to `phases = { enter: 0, hold: scrollDuration, exit: 0 }` internally.

### `ScrollComic` internals

- `computeSectionLayout(durations, …)` replaced by `layoutTimeline(pages, unitPx)` from `@badcode/scroll-timeline`.
- `computeScrollState(…)` replaced by `sampleTimeline(layout, scrollPx)`.
- Each page's `scrollPercent` (passed to effects) becomes `focus[i]` from `sampleTimeline`.
- `currentPage` becomes `sample.current`.

### CampingComic

Each `<Page>` gains an explicit `phases` prop (default `{ enter: 0, hold: scrollDuration, exit: 0 }` matching current behaviour). No visible change to readers. This validates that the migration path works on a real shipped comic before the `@badcode/comic` package bumps its minor version.

---

## Testing strategy

| Layer | Test type | What |
|---|---|---|
| `@badcode/scroll-timeline` | vitest unit | focus trapezoid, layout offsets, overview flags, direction, edge cases |
| `apps/web` graph | vitest unit | existing graph/path tests (unchanged); `useTimeline` layout snapshot |
| `@badcode/comic` | vitest unit | `scrollDuration` backwards-compat; `phases` produces same layout as old `computeSectionLayout` for enter=exit=0 |
| Homepage motion | Browser manual | camera poses, overview bookend zoom, label gate, any-interaction start, end bookend |
| Comic reader | Browser manual | CampingComic still reads correctly after migration |

---

## Scope

**In:** `@badcode/scroll-timeline` package, homepage migration (timeline.ts, CameraRig, Constellation, StoryNode, Chrome, drivers, Scene, Spine, useTimeline), `@badcode/comic` ScrollComic/Page migration, CampingComic update.

**Out:** New per-step 3D content elements (the `content` field on `HomeStep` is defined in the type but no concrete `<CampingOrbit />` etc. is built — that's a follow-on feature); audio; the AI agent framework; any change to comic panel rendering.

---

## Risks

- **Camera pose seeding** — the `CameraPose` values in `timeline.ts` are estimates; the browser pass is where they get tuned. The architecture doesn't depend on specific numbers.
- **`@badcode/comic` migration regression** — CampingComic is shipped. The backwards-compat `scrollDuration` path and a visual browser pass on the comic mitigate this. Any regression is caught before merging.
- **Sequential hand-off transition feel** — with explicit poses, the camera travels between two unrelated 3D positions during the `exit + enter` span. If the poses are too far apart the transition may feel abrupt. Mitigated by authoring poses that are spatially adjacent on the branch.
