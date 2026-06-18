# Homepage "The Atlas" — Phase 3 (Branch corridor + polish) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the "play the whole branch" corridor — fly down a branch through a streaming gallery of its scenes (the flip-book-in-3D) — and finish the experience for production: full media coverage, KTX2 textures, a code-split scene bundle, and mobile performance.

**Architecture:** Build on Phases 1–2. The corridor is a second camera mode in the same `<Canvas>`: a `CatmullRomCurve3` rail running down a branch, past that branch's nodes laid out as a sequence of media plates ("stations"); a progress value (scroll while in corridor mode, or an auto "play" tween) drives the camera along the rail with a look-ahead target. A small `mode` flag in nav state switches input between map (Phase 1, pan/zoom/dive) and corridor (rail). Pure logic — corridor station layout, mode transitions, rail progress→pose — is TDD'd; the rail/plates/perf work is built and verified in the browser and on a real device.

**Tech Stack:** React 18 + TS, `@react-three/fiber` 8, `@react-three/drei` 9.122 (`CameraControls`, `useKTX2`, `Image`, `Line`), `@react-three/postprocessing`, `three` 0.169 (`CatmullRomCurve3`, `KTX2Loader`), `gltf-transform`/`toktx` for offline KTX2 encode, Vitest.

## Global Constraints

- One `<Canvas>` / one WebGL context. The corridor is a mode, not a second scene. (spec: Accessibility & performance)
- **No scrolljacking on the map.** Scroll only drives the camera while in **corridor mode**; in map mode scroll stays zoom (Phase 1). Provide an always-visible exit. (spec: Navigation; research: NN/g scrolljacking)
- **Video discipline holds**: in the corridor, only the 1–2 plates nearest the camera play video; the rest show poster/ThumbHash. Pause + release on pass. (spec: performance)
- **KTX2 everywhere it helps**: plate textures ship as KTX2/Basis (compressed in VRAM); WebP poster remains the fallback when KTX2 is unsupported. (research: textures)
- **Mobile budget**: ≤2048² textures, capped DPR, `frameloop="demand"` at rest, dispose on unload. Verify on a real phone. (spec: performance)
- **Reduced motion**: the corridor offers a non-flythrough fallback (a vertical list/strip of the branch's scenes) and respects `prefers-reduced-motion`. (spec: Accessibility)

**Phase 1–2 anchors this extends (read first):**
- `apps/web/src/home/graph.ts` — `GRAPH.branches.{bad,good}` geometry and `tips`.
- `apps/web/src/home/atlas/model.ts` — `AtlasNode` (now with `plate`/`blurb`/`song`), `buildAtlas()`.
- `apps/web/src/home/atlas/navState.ts` — `NavState`, reducers.
- `apps/web/src/home/atlas/CameraControlsRig.tsx` — `RigHandle`, the face-on lock.
- `apps/web/src/home/atlas/MediaPlate.tsx` / `plateSource.ts` — plates + manifest resolution.
- `apps/web/src/home/atlas/AtlasScene.tsx` — scene composition + input modes.

---

### Task 1: Corridor station model

For a branch, produce the ordered list of "stations" (its story nodes) with a position along the branch and a camera waypoint, plus the rail curve.

**Files:**
- Create: `apps/web/src/home/atlas/corridor.ts`
- Test: `apps/web/src/home/atlas/corridor.test.ts`

**Interfaces:**
- Consumes: `AtlasNode` from `./model`; `GRAPH` from `../graph`.
- Produces:
  - `type Station = { node: AtlasNode; t: number; platePos: [number, number, number]; camPos: [number, number, number]; lookAt: [number, number, number] }`
  - `function buildCorridor(branch: 'bad' | 'good', nodes: AtlasNode[]): { stations: Station[]; railPoints: [number, number, number][] }`
  - `function poseAt(corridor: { railPoints: [number,number,number][] }, progress: number): { position: [number,number,number]; target: [number,number,number] }` (arc-length sampled with a look-ahead)

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/home/atlas/corridor.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildCorridor, poseAt } from './corridor'
import { buildAtlas } from './model'

const { nodes } = buildAtlas()

describe('buildCorridor', () => {
  it('includes the bad-branch stories in branch order, ending at the tip', () => {
    const { stations } = buildCorridor('bad', nodes)
    const ids = stations.map((s) => s.node.id)
    expect(ids).toEqual(['camping', 'karen', 'emperors-coin', 'storyverse'])
    expect(stations.every((s) => s.t >= 0 && s.t <= 1)).toBe(true)
  })
  it('orders stations by increasing t', () => {
    const { stations } = buildCorridor('good', nodes)
    const ts = stations.map((s) => s.t)
    expect([...ts].sort((a, b) => a - b)).toEqual(ts)
  })
})

describe('poseAt', () => {
  it('returns a pose with a forward look-ahead along the rail', () => {
    const c = buildCorridor('bad', nodes)
    const a = poseAt(c, 0.2)
    const b = poseAt(c, 0.21)
    // look target should be ahead of the camera position along +x as progress grows
    expect(b.position[0]).toBeGreaterThanOrEqual(a.position[0])
    expect(a.target[0]).toBeGreaterThan(a.position[0] - 50)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test --workspace @badcode/web -- corridor.test`
Expected: FAIL — `Cannot find module './corridor'`.

- [ ] **Step 3: Implement**

Create `apps/web/src/home/atlas/corridor.ts`. Build stations from the branch's nodes ordered by their x position (history→tip); compute each `t` from its index; build a `CatmullRomCurve3` from the branch waypoints (`GRAPH.branches.bad`/`good`), offset the camera back on +z and slightly above; `poseAt` uses `curve.getPointAt(progress)` for position and `getPointAt(min(1, progress+0.04))` for the look target (look-ahead), with a z back-off. Return `railPoints` as the sampled curve.

```ts
import { CatmullRomCurve3, Vector3 } from 'three'
import { GRAPH } from '../graph'
import type { AtlasNode } from './model'

export type Station = {
  node:     AtlasNode
  t:        number
  platePos: [number, number, number]
  camPos:   [number, number, number]
  lookAt:   [number, number, number]
}

const BACK = 18 // camera distance back from the rail

export function buildCorridor(branch: 'bad' | 'good', nodes: AtlasNode[]) {
  const onBranch = nodes
    .filter((n) => n.branch === branch)
    .sort((a, b) => a.pos[0] - b.pos[0])

  const curve = new CatmullRomCurve3(
    GRAPH.branches[branch].map(([x, y]) => new Vector3(x, y, 0)),
    false, 'catmullrom', 0.2,
  )

  const stations: Station[] = onBranch.map((node, i) => {
    const t = onBranch.length > 1 ? i / (onBranch.length - 1) : 1
    const p = curve.getPointAt(Math.min(1, t))
    return {
      node, t,
      platePos: [p.x, p.y + 3, p.z],
      camPos:   [p.x, p.y + 1, p.z + BACK],
      lookAt:   [p.x, p.y, p.z],
    }
  })

  const railPoints = curve.getPoints(80).map((v) => [v.x, v.y, v.z] as [number, number, number])
  return { stations, railPoints }
}

export function poseAt(
  corridor: { railPoints: [number, number, number][] },
  progress: number,
) {
  const pts = corridor.railPoints.map((p) => new Vector3(...p))
  const curve = new CatmullRomCurve3(pts)
  const p = curve.getPointAt(Math.min(1, Math.max(0, progress)))
  const ahead = curve.getPointAt(Math.min(1, Math.max(0, progress) + 0.04))
  return {
    position: [p.x, p.y + 1, p.z + 18] as [number, number, number],
    target:   [ahead.x, ahead.y, ahead.z] as [number, number, number],
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test --workspace @badcode/web -- corridor.test`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/atlas/corridor.ts apps/web/src/home/atlas/corridor.test.ts
git commit -m "feat(home): corridor station model + rail pose sampling"
```

---

### Task 2: Corridor mode in nav state

Add a mode switch so input/UX knows whether we're roaming the map or riding a branch.

**Files:**
- Modify: `apps/web/src/home/atlas/navState.ts`
- Modify: `apps/web/src/home/atlas/navState.test.ts`

**Interfaces:**
- `NavState` gains `mode: 'map' | 'corridor'` and `branch: 'bad' | 'good' | null`.
- New reducers: `enterCorridor(state, branch)`, `exitCorridor(state)`.

- [ ] **Step 1: Extend the tests**

Add to `navState.test.ts`:

```ts
import { enterCorridor, exitCorridor } from './navState'

describe('corridor mode', () => {
  it('enterCorridor sets mode + branch and clears focus', () => {
    const s = enterCorridor({ focusId: 'camping', lod: 'node', mode: 'map', branch: null }, 'bad')
    expect(s).toEqual({ focusId: null, lod: 'mid', mode: 'corridor', branch: 'bad' })
  })
  it('exitCorridor returns to the map', () => {
    const s = exitCorridor({ focusId: null, lod: 'mid', mode: 'corridor', branch: 'bad' })
    expect(s.mode).toBe('map')
    expect(s.branch).toBeNull()
  })
})
```

Update the existing `INITIAL_NAV`/reducer assertions in this file to include the new `mode: 'map'` and `branch: null` fields.

- [ ] **Step 2: Run to verify it fails**

Run: `npm test --workspace @badcode/web -- navState.test`
Expected: FAIL — `enterCorridor` not exported / shape mismatch.

- [ ] **Step 3: Implement**

In `navState.ts`: extend `NavState` with `mode: 'map' | 'corridor'` and `branch: 'bad' | 'good' | null`; update `INITIAL_NAV` to `{ focusId: null, lod: 'galaxy', mode: 'map', branch: null }`; ensure `focusNode`/`toGalaxy`/`withLod` preserve `mode`/`branch`; add:

```ts
export function enterCorridor(state: NavState, branch: 'bad' | 'good'): NavState {
  return { ...state, focusId: null, lod: 'mid', mode: 'corridor', branch }
}
export function exitCorridor(state: NavState): NavState {
  return { ...state, mode: 'map', branch: null, lod: 'galaxy' }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test --workspace @badcode/web -- navState.test`
Expected: PASS (existing + 2 new).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/atlas/navState.ts apps/web/src/home/atlas/navState.test.ts
git commit -m "feat(home): corridor mode in nav state (enter/exit)"
```

---

### Task 3: Corridor view — rail camera + plate stations

Render the branch as a corridor of plates and drive the camera down the rail by a progress value.

**Files:**
- Create: `apps/web/src/home/atlas/Corridor.tsx`

**Interfaces:**
- Consumes: `buildCorridor`, `poseAt` from `./corridor`; `RigHandle` from `./CameraControlsRig`; `MediaPlate`.
- Produces: `function Corridor(props: { branch: 'bad'|'good'; nodes: AtlasNode[]; rig: React.RefObject<RigHandle>; progress: number }): JSX.Element` — renders the stations' plates along the rail and, each frame, writes `rig.flyTo(poseAt(progress), true)` (immediate; smoothing comes from how `progress` is driven).

- [ ] **Step 1: Build the corridor view**

Create `apps/web/src/home/atlas/Corridor.tsx`: memoize `buildCorridor(branch, nodes)`; render each station's `<MediaPlate>` at `station.platePos` (active = the station nearest `progress`); use `useFrame` to set the camera pose from `poseAt(corridor, progress)`. Disable `CameraControls` (corridor owns the camera) while in this mode.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors. (Rendered in Task 4.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/Corridor.tsx
git commit -m "feat(home): Corridor view — rail camera + plate stations"
```

---

### Task 4: Enter/exit the corridor + drive progress

Let the user start a branch flythrough and ride it; scroll (in corridor mode only) or an auto "play" drives progress; an always-visible exit returns to the map.

**Files:**
- Modify: `apps/web/src/home/atlas/AtlasScene.tsx`
- Modify: `apps/web/src/home/atlas/Hud.tsx` (a "▶ play branch" control when a tip is focused; an "✕ exit" while riding)

**Interfaces:**
- Consumes: `enterCorridor`/`exitCorridor` from `./navState`; `Corridor`.

- [ ] **Step 1: Wire mode switching + progress**

In `AtlasScene.tsx`: add `const [progress, setProgress] = useState(0)`. When `nav.mode === 'corridor'`, render `<Corridor branch={nav.branch!} nodes={nodes} rig={rig} progress={progress} />` instead of the map nodes, disable the rig, and drive `progress` from a wheel listener (clamped 0→1) — only while in corridor mode. A "play" button auto-tweens `progress` 0→1. Entering: from a focused tip (Storyverse/Future Proof) the Diorama gains a "▶ play branch" that calls `setNav(enterCorridor(s, branch))` + `setProgress(0)`. Exiting: an "✕ exit" (and Esc) calls `setNav(exitCorridor(s))` + `flyTo(INTRO_END)`.

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev`. Dive into Storyverse → "▶ play branch" → camera rides down the bad branch past Camping → Karen → Emperor's Coin → the ring; scroll scrubs; "✕ exit"/Esc returns to the map.
Expected: a smooth flythrough past the plates; only the nearest plate plays video; exit is always available; map-mode scroll is unaffected (still zoom).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/AtlasScene.tsx apps/web/src/home/atlas/Hud.tsx
git commit -m "feat(home): enter/ride/exit the branch corridor"
```

---

### Task 5: KTX2 plate textures

Ship plate textures as KTX2/Basis (compressed in VRAM, no main-thread decode), with WebP poster fallback.

**Files:**
- Modify: `apps/web/src/home/atlas/plateSource.ts` (add `ktx2Url?` derived from the manifest/basePath)
- Modify: `apps/web/src/home/atlas/MediaPlate.tsx` (load KTX2 via drei `useKTX2` when present, else WebP)
- Modify: `apps/web/src/main.tsx` or a `three` setup module (configure `KTX2Loader` transcoder path)
- Modify: `packages/cli` (emit `.ktx2` next to `derived/...` in the asset build) — or document the manual `toktx`/`gltf-transform` step if CLI change is out of appetite.

- [ ] **Step 1: Encode + reference KTX2**

Add KTX2 outputs to the asset pipeline (or document `npx @gltf-transform/cli` / `toktx` for the home plates). Extend `resolvePlate` to also return `ktx2Url` when the manifest lists a `.ktx2` rendition.

- [ ] **Step 2: Load KTX2 with fallback**

In `MediaPlate.tsx`, when `ktx2Url` is present use drei `useKTX2(ktx2Url)`; otherwise fall back to the WebP `<Image>`. Configure the `KTX2Loader` transcoder (basis) path once at app init.

- [ ] **Step 3: Verify**

Run: `npm run dev`; confirm plates still render and check (DevTools Memory / `renderer.info`) that VRAM is lower than the WebP path.
Expected: identical visuals, lower texture memory; WebP fallback works when KTX2 is absent.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/plateSource.ts apps/web/src/home/atlas/MediaPlate.tsx apps/web/src/main.tsx packages/cli
git commit -m "perf(home): KTX2 plate textures with WebP fallback"
```

---

### Task 6: Mobile performance

Budget the scene for phones.

**Files:**
- Modify: `apps/web/src/home/atlas/AtlasScene.tsx` (Canvas dpr cap, `frameloop`, `AdaptiveDpr`, `PerformanceMonitor`)
- Modify: `apps/web/src/home/atlas/MediaPlate.tsx` / `Corridor.tsx` (texture-size cap, dispose on unmount)

- [ ] **Step 1: Apply budgets**

On `<Canvas>`: `dpr={[1, isMobile ? 1.5 : 2]}`, add drei `<AdaptiveDpr pixelated />` and `<PerformanceMonitor>` to step DPR down under load; set `frameloop="demand"` when the camera is at rest (invalidate on interaction/animation). Cap plate textures at 2048² on mobile. Ensure videos/textures `.dispose()` on unmount (and `ImageBitmap.close()` where used).

- [ ] **Step 2: Verify on a real device**

Open the dev server from a phone on the LAN (`npm run dev -- --host`).
Expected: ≥30fps on the map and corridor; no crash from concurrent videos; memory stable when diving in/out repeatedly.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas
git commit -m "perf(home): mobile budgets — dpr cap, adaptive dpr, demand frameloop, dispose"
```

---

### Task 7: Code-split the scene bundle

The `AtlasScene` chunk is ~300KB gzip (three + drei + postprocessing). Split it so the initial route stays light.

**Files:**
- Modify: `apps/web/vite.config.ts` (`build.rollupOptions.output.manualChunks`)

- [ ] **Step 1: Add manual chunks**

Split `three`, `@react-three/*`, and `postprocessing` into a `three-vendor` chunk so they cache independently of app code:

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
      },
    },
  },
},
```

- [ ] **Step 2: Verify**

Run: `npm run build --workspace @badcode/web`
Expected: a separate `three-vendor` chunk; the per-route app chunk shrinks; the chunk-size warning is contained.

- [ ] **Step 3: Commit**

```bash
git add apps/web/vite.config.ts
git commit -m "perf(home): code-split three/drei into a vendor chunk"
```

---

### Task 8: Reduced-motion corridor fallback + Phase 3 verification

- [ ] **Step 1: Reduced-motion corridor**

When `prefers-reduced-motion`, "play branch" shows the branch's scenes as a static vertical strip/list (reuse `Diorama` content per station) instead of a camera flythrough; Esc/exit returns to the map.

- [ ] **Step 2: Full green**

Run: `npm run typecheck && npm test && npm run build --workspace @badcode/web`
Expected: typecheck clean; all suites (incl. `corridor`, extended `navState`) pass; build succeeds with the vendor chunk.

- [ ] **Step 3: Manual checklist**

Map mode unaffected (pan/zoom/dive) · play-branch rides the rail past plates · only nearest plate plays video · scroll scrubs only in corridor · exit/Esc always works · KTX2 loads with WebP fallback · phone ≥30fps · reduced-motion shows the strip.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(home): reduced-motion corridor fallback + Phase 3 verification"
```

---

## Self-Review

**Spec coverage (Phase 3 scope):** L2 branch corridor flythrough → Tasks 1–4; full media coverage (manifest plates per station) → Tasks 1, 3 (+ Phase 2 plate source); KTX2 textures → Task 5; mobile perf tuning → Task 6; (added) code-split the heavy chunk surfaced in Phase 1 → Task 7; reduced-motion + a11y → Task 8. ✓

**Placeholder scan:** none — pure tasks (corridor model, nav mode) carry full tests + code; the build/verify tasks carry concrete config/code and named browser+device checks. The one appetite-dependent item (CLI KTX2 emit vs. manual encode in Task 5) is called out explicitly with both paths.

**Type consistency:** `Station`/`buildCorridor`/`poseAt` (Task 1) consumed by `Corridor` (Task 3) and the scene (Task 4); `NavState.mode`/`branch` + `enterCorridor`/`exitCorridor` (Task 2) used in Task 4; `RigHandle.flyTo` reused for the rail; `resolvePlate` extended with `ktx2Url` (Task 5) consumed by `MediaPlate`. ✓

---

## Done = the whole design shipped

With Phases 1–3 complete, "The Atlas" delivers the full brief: a guided intro that resolves into a free-roam semantic-zoom map (Phase 1), nodes you dive into as staged media theatres with sound (Phase 2), and branches you fly through as a corridor of scenes (Phase 3) — performant on desktop and mobile, with reduced-motion and no-WebGL fallbacks throughout.
