# Homepage Two-Mode Redesign

**Date:** 2026-06-04  
**Status:** Approved — ready for implementation

---

## Overview

The homepage gains two distinct modes — **storytelling** and **menu** — and a scroll-driven progressive line-reveal system where the git-graph line grows as the user scrolls, activating nodes as it reaches them.

First-time visitors experience the story told sequentially. Return visitors land straight in menu mode. A "Story" button in menu mode resets to first-visit state. A "Skip →" button in storytelling mode jumps straight to menu.

---

## Modes

### Storytelling mode
- Scroll drives `drawProgress` (0→1), which grows the Spine line
- Nodes are invisible until the line reaches their position (sticky reveal — once lit, stays lit)
- Camera follows a pluggable per-step behavior function
- A **"Skip →"** button (small, corner) jumps to menu mode at any time

### Menu mode
- `drawProgress = 1` — full diagram visible, all nodes lit
- Camera holds at `OVERVIEW_POSE`
- All story nodes are clickable (existing `flyToStep` → flash → navigate)
- Nav shows a **"Story"** button that clears `localStorage` and resets to storytelling from scroll 0

### Mode persistence
- `localStorage.getItem('badcode-visited')` present → start in menu
- Absent → start in storytelling
- Entering menu (end of scroll or Skip) sets the key
- "Story" button removes the key and resets

---

## Architecture

```
scrollY
  └─► drawProgress (high-water mark on ctrl — only ever increases during scroll)
        ├─► Spine.drawnSlice()            — line grows right
        ├─► revealedSet                   — sticky node visibility
        └─► CameraRig(cameraBehavior[])   — pluggable per-step pose
```

`ctrl.drawProgress` lives on the existing shared `CameraController` mutable ref.  
`Scene.tsx` writes it on every scroll frame:

```typescript
const raw = window.scrollY / Math.max(1, layout.totalHeight - window.innerHeight)
ctrl.drawProgress = Math.min(1, Math.max(ctrl.drawProgress, raw)) // high-water
```

On menu entry, `ctrl.drawProgress` is forced to `1`.  
On story reset, `ctrl.drawProgress` is reset to `0`.

---

## Data model additions to `HomeStep`

```typescript
export interface HomeStep extends StepDef {
  // existing fields unchanged ...

  kind?:           'event' | 'content'   // default 'content'
  cameraBehavior?: CameraBehaviorFn      // default: bespokePose
}
```

`kind: 'event'` nodes are historical markers on the trunk — no route, no sphere, no tether, not clickable.  
`kind: 'content'` (default) nodes are the existing story/branch-tip nodes.

---

## Camera behavior system

New file `apps/web/src/home/behaviors.ts`:

```typescript
export type CameraBehaviorFn = (ctx: {
  focus: number       // 0-1 trapezoid for this step
  prev:  CameraPose   // previous step's pose
  self:  CameraPose   // this step's declared pose
  next:  CameraPose   // next step's pose
}) => CameraPose

// Default: lerp camera to this step's bespoke pose
export const bespokePose: CameraBehaviorFn

// Smooth glide: blends prev→next across the full enter+hold+exit arc
export const interpolatePoses: CameraBehaviorFn
```

`CameraRig` calls `(step.cameraBehavior ?? bespokePose)(ctx)` for each step with `focus > 0`, then blends the resulting poses weighted by `focus[]` — identical to today's logic, just with the target pose sourced from the behavior function.

Historical `event` nodes default to `interpolatePoses` (camera glides through).  
Story `content` nodes default to `bespokePose` (camera snaps to their individual vantage).

---

## Sticky reveal system

Each `HomeStep` gets a `drawThreshold` — the `drawProgress` value at which the Spine tip first reaches that node's position on the tour path:

```
history branch  x ∈ [-30,  0]  →  drawProgress ∈ [0.00, 0.40]
bad branch      x ∈ [  0, 30]  →  drawProgress ∈ [0.40, 0.72]
good branch     x ∈ [  0, 30]  →  drawProgress ∈ [0.72, 1.00]
```

A per-node `revealed` boolean (`ctrl.drawProgress >= drawThreshold(step)`) is computed in `Constellation` and passed to each `StoryNode`. Revealed nodes render at full opacity; unrevealed nodes: `opacity: 0`, `pointerEvents: none`.

In menu mode all nodes are considered revealed regardless of threshold.

---

## Node visual treatment by kind

### `content` nodes (existing behaviour)
- Floating cyan sphere + label
- Tether line from branch to float position
- Clickable (in menu mode or when focused in story mode)
- `status: 'coming-soon'` nodes render at reduced opacity

### `event` nodes (new)
- Small vertical tick mark on the trunk line
- Label above the trunk in white (dimmer than cyan)
- No sphere, no tether
- Not clickable, no pointer events
- Default camera behavior: `interpolatePoses`

---

## New historical events on the trunk

Added to `homeSteps` before the existing content nodes:

| id | title | x position | phases |
|----|-------|-----------|--------|
| `gold-standard` | 1971 — Off the Gold Standard | −18 | 0.5 / 0.5 / 0.5 |
| `git-born` | 2005 — Git Is Born | −10 | 0.5 / 0.5 / 0.5 |
| `financial-crisis` | 2008 — The Crash | −4 | 0.5 / 0.5 / 0.5 |

Camera poses are loose estimates — tune in browser. These nodes sit at `y: 0` (on the trunk).

---

## Chrome / UI changes

### Storytelling mode overlay
- Small **"Skip →"** button — fixed position, unobtrusive corner placement
- Calls `enterMenu()`

### Menu mode overlay
- **"Story"** button in the top nav alongside existing links
- Calls `enterStory()` — removes `localStorage` key, resets `ctrl.drawProgress = 0`, scrolls to top

---

## `enterMenu()` / `enterStory()` logic

```typescript
const enterMenu = () => {
  ctrl.drawProgress = 1
  localStorage.setItem('badcode-visited', '1')
  setMode('menu')
  window.scrollTo({ top: 0, behavior: 'instant' })
}

const enterStory = () => {
  localStorage.removeItem('badcode-visited')
  ctrl.drawProgress = 0
  setMode('story')
  window.scrollTo({ top: 0, behavior: 'instant' })
}
```

Auto-trigger: scroll handler calls `enterMenu()` when `raw >= 1`.

---

## Files to create / modify

| File | Change |
|------|--------|
| `apps/web/src/home/behaviors.ts` | **New** — `CameraBehaviorFn`, `bespokePose`, `interpolatePoses` |
| `apps/web/src/home/timeline.ts` | Add `kind`, `cameraBehavior` to `HomeStep`; add three historical steps |
| `apps/web/src/home/CameraRig.tsx` | Use `cameraBehavior` per step instead of direct pose |
| `apps/web/src/home/Scene.tsx` | `mode` state, `drawProgress` scroll wiring, `enterMenu`/`enterStory` |
| `apps/web/src/home/Chrome.tsx` | "Skip →" button (story mode) + "Story" button (menu mode) |
| `apps/web/src/home/Constellation.tsx` | Pass `revealed` flag per node |
| `apps/web/src/home/StoryNode.tsx` | Render by `kind`; hide when not revealed; menu-mode click |
| `apps/web/src/home/graph.ts` | `drawThreshold(step)` utility |
