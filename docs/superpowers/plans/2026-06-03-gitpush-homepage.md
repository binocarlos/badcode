# GitPush Origin Master Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the BadCode homepage as a 3D git-history hub — a bent-fork commit graph in black space you travel by scroll, with cyan story-nodes that fly you into comics — plus routing, an About/Storyverse/Future-Proof skeleton, and an accessible 2D fallback.

**Architecture:** A single `graph.ts` data file is the source of truth for branches, history commits, story nodes and camera waypoints, consumed by **both** a react-three-fiber 3D scene and a static SVG 2D fallback. The 3D camera is one rig sampling a Catmull-Rom spline at a normalized scroll progress `t`; scroll, GSAP waypoint tweens, and GSAP autoplay all move the page-scroll position (the single source of `t`). react-router-dom provides the page skeleton; the 3D bundle is lazy-loaded so comic/text pages stay light.

**Tech Stack:** Vite + React 18 + TypeScript (existing), `react-router-dom`, `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` (bloom), `gsap`, `vitest` (tests).

**Spec:** `docs/superpowers/specs/2026-06-03-gitpush-homepage-design.md`

**Conventions for this codebase (read before starting):**
- `tsconfig.base.json` sets `verbatimModuleSyntax: true` → **type-only imports must use `import type`**.
- `strict`, `noUnusedLocals`, `noUnusedParameters` are on → no unused symbols, no implicit `any`.
- JSX is automatic (`react-jsx`) → do **not** `import React` just for JSX.
- Tests use `vitest` in the default node environment: `import { describe, it, expect } from 'vitest'`. No DOM/jsdom — only pure logic is unit-tested. `three` imports fine in node (no DOM needed for curve math).
- Run a single workspace's tests with: `npm run test --workspace @badcode/web`.
- Typecheck a workspace with: `npm run typecheck --workspace @badcode/web`.
- The whole repo: `npm run typecheck` and `npm run test` from the root.

**Known simplification vs spec (intentional for this first pass):** the continuous **scroll** tour follows `history → fork → bad branch → Storyverse` (the EP1 content branch). The **good branch + Future Proof** are fully rendered and visible, shown in the overview and 2D fallback, and reached by **clicking** (camera fly-to + navigate) — not by scroll. A selectable both-branch scroll tour is a future enhancement. Everything else matches the spec.

---

## File Structure

**Modified**
- `apps/web/package.json` — add deps + `test` script.
- `apps/web/src/App.tsx` — becomes the router.
- `apps/web/src/index.css` — black base, monospace font, fixed-canvas + scroll-driver layout.

**Created — shared logic (unit-tested)**
- `apps/web/src/home/colors.ts` — palette constants shared by 2D + 3D.
- `apps/web/src/home/graph.ts` + `graph.test.ts` — branches, commits, nodes, waypoints + integrity.
- `apps/web/src/home/path.ts` + `path.test.ts` — Catmull-Rom spline + `t` sampling + waypoint lookup.
- `apps/web/src/home/environment.ts` + `environment.test.ts` — `shouldUse2D()` decision + browser probe.
- `apps/web/src/home/comics.ts` + `comics.test.ts` — slug → live-comic | stub | not-found resolution.

**Created — routes (manual-verified)**
- `apps/web/src/routes/Home.tsx` — picks 3D scene (lazy) vs 2D fallback.
- `apps/web/src/routes/ComicPage.tsx` — resolves `:slug` → real comic or stub.
- `apps/web/src/routes/ComicStub.tsx` — in-aesthetic "coming soon".
- `apps/web/src/routes/Storyverse.tsx`, `FutureProof.tsx`, `About.tsx`, `NotFound.tsx`.
- `apps/web/src/routes/TextPage.tsx` — shared layout for the text pages above.

**Created — 3D scene + 2D fallback (manual-verified)**
- `apps/web/src/home/Fallback2D.tsx` — static navigable SVG fork.
- `apps/web/src/home/Scene.tsx` — default-exported `<Canvas>` assembly (lazy import target).
- `apps/web/src/home/cameraController.ts` — the `t`/mode controller object + React context.
- `apps/web/src/home/CameraRig.tsx` — samples spline at `t`, drives the camera, scroll listener.
- `apps/web/src/home/drivers.ts` — GSAP `flyTo(t)` and `autoplay()` (move page scroll).
- `apps/web/src/home/Spine.tsx` — branch lines + faint history commits.
- `apps/web/src/home/Constellation.tsx` + `StoryNode.tsx` — cyan nodes, tethers, hover labels, click.
- `apps/web/src/home/BranchTip.tsx` — Storyverse / Future Proof markers.
- `apps/web/src/home/Atmosphere.tsx` — fog, stars, accent light, bloom.
- `apps/web/src/home/Narration.tsx` — type-on two-step narrator overlay.
- `apps/web/src/home/Chrome.tsx` — wordmark, About link, overview/replay, skip-intro.
- `apps/web/src/home/OpeningSequence.tsx` — GSAP draw-in timeline controller.
- `apps/web/src/home/useScrollProgress.ts` — normalized page-scroll `t` hook.

---

## Task 1: Dependencies and test wiring

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Add runtime + dev deps and a `test` script**

Edit `apps/web/package.json` so `scripts`, `dependencies`, and `devDependencies` read:

```jsonc
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@badcode/comic": "*",
    "@badcode/comic-meta": "*",
    "@react-three/drei": "^9.114.3",
    "@react-three/fiber": "^8.17.10",
    "@react-three/postprocessing": "^2.16.3",
    "gsap": "^3.12.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "three": "^0.169.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vitest": "^2.1.8"
  }
```

- [ ] **Step 2: Install from the repo root**

Run: `npm install`
Expected: completes without peer-dependency errors. If npm reports a peer conflict between `@react-three/fiber` and `three`, align `three`/`@types/three` to the version fiber requests, then re-run.

- [ ] **Step 3: Verify vitest runs (no tests yet)**

Run: `npm run test --workspace @badcode/web`
Expected: vitest reports "No test files found" (exit 0) — wiring works.

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json package-lock.json
git commit -m "build(web): add r3f/drei/postprocessing, gsap, react-router, vitest"
```

---

## Task 2: Palette constants

**Files:**
- Create: `apps/web/src/home/colors.ts`

- [ ] **Step 1: Write the palette module**

Create `apps/web/src/home/colors.ts`:

```ts
/** BadCode homepage palette. Black void, white spine, cyan = enterable, grey = history. */
export const COLORS = {
  black: '#000000',
  white: '#ffffff',
  /** Electric cyan — anything the user can enter glows this colour. */
  cyan: '#46d5ff',
  /** Faint grey — history commits / atmosphere. */
  grey: '#6a7480',
  /** Dim tether lines. */
  tether: '#244657',
} as const

export type ColorName = keyof typeof COLORS
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/colors.ts
git commit -m "feat(home): shared palette constants"
```

---

## Task 3: Graph data model (TDD)

The single source of truth. Branches as ordered point lists (x,y in the side-on plane), faint history commits, story nodes with a normalized `t` along the scroll tour, and named waypoints.

**Files:**
- Create: `apps/web/src/home/graph.ts`
- Test: `apps/web/src/home/graph.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/home/graph.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { GRAPH, storyNodes, waypoints, type StoryNode } from './graph'

describe('graph', () => {
  it('every story node has a unique id', () => {
    const ids = storyNodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every story node t is within [0,1]', () => {
    for (const n of storyNodes) {
      expect(n.t).toBeGreaterThanOrEqual(0)
      expect(n.t).toBeLessThanOrEqual(1)
    }
  })

  it('every story node route starts with a slash', () => {
    for (const n of storyNodes) expect(n.route.startsWith('/')).toBe(true)
  })

  it('camping is a live node on the bad branch routed under /comics', () => {
    const camping = storyNodes.find((n) => n.id === 'camping') as StoryNode
    expect(camping).toBeDefined()
    expect(camping.status).toBe('live')
    expect(camping.branch).toBe('bad')
    expect(camping.route).toBe('/comics/camping')
  })

  it('defines the three branches with at least two points each', () => {
    expect(GRAPH.branches.history.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.bad.length).toBeGreaterThanOrEqual(2)
    expect(GRAPH.branches.good.length).toBeGreaterThanOrEqual(2)
  })

  it('the tour spline begins at history start and ends at the bad (storyverse) tip', () => {
    const first = GRAPH.tour[0]
    const last = GRAPH.tour[GRAPH.tour.length - 1]
    expect(first).toEqual(GRAPH.branches.history[0])
    expect(last).toEqual(GRAPH.branches.bad[GRAPH.branches.bad.length - 1])
  })

  it('exposes fork, storyverse and futureProof waypoints', () => {
    expect(waypoints.fork).toBeDefined()
    expect(waypoints.storyverse).toBeDefined()
    expect(waypoints.futureProof).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/web`
Expected: FAIL — cannot resolve `./graph`.

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/home/graph.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/web`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/graph.ts apps/web/src/home/graph.test.ts
git commit -m "feat(home): graph data model + integrity tests"
```

---

## Task 4: Spline + `t` sampling (TDD)

Wraps the tour points in a `THREE.CatmullRomCurve3` and exposes pure helpers. `three` runs in node, so this is unit-testable.

**Files:**
- Create: `apps/web/src/home/path.ts`
- Test: `apps/web/src/home/path.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/home/path.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { tourCurve, pointAtT, clampT } from './path'
import { GRAPH } from './graph'

describe('path', () => {
  it('clampT keeps values within [0,1]', () => {
    expect(clampT(-0.5)).toBe(0)
    expect(clampT(1.5)).toBe(1)
    expect(clampT(0.3)).toBeCloseTo(0.3)
  })

  it('pointAtT(0) is the first tour point', () => {
    const p = pointAtT(0)
    expect(p.x).toBeCloseTo(GRAPH.tour[0][0])
    expect(p.y).toBeCloseTo(GRAPH.tour[0][1])
    expect(p.z).toBeCloseTo(0)
  })

  it('pointAtT(1) is the last tour point (storyverse tip)', () => {
    const p = pointAtT(1)
    const last = GRAPH.tour[GRAPH.tour.length - 1]
    expect(p.x).toBeCloseTo(last[0])
    expect(p.y).toBeCloseTo(last[1])
  })

  it('x increases monotonically along the tour', () => {
    let prev = -Infinity
    for (let i = 0; i <= 20; i++) {
      const p = pointAtT(i / 20)
      expect(p.x).toBeGreaterThanOrEqual(prev - 1e-6)
      prev = p.x
    }
  })

  it('tourCurve is a reusable curve instance', () => {
    expect(tourCurve.getPointAt(0)).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/web`
Expected: FAIL — cannot resolve `./path`.

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/home/path.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/path.ts apps/web/src/home/path.test.ts
git commit -m "feat(home): tour spline + t-sampling helpers"
```

---

## Task 5: Environment decision (TDD)

Pure decision function plus a thin browser probe (probe not unit-tested).

**Files:**
- Create: `apps/web/src/home/environment.ts`
- Test: `apps/web/src/home/environment.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/home/environment.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { shouldUse2D } from './environment'

describe('shouldUse2D', () => {
  it('falls back to 2D when reduced motion is requested', () => {
    expect(shouldUse2D({ reducedMotion: true, webglAvailable: true })).toBe(true)
  })

  it('falls back to 2D when WebGL is unavailable', () => {
    expect(shouldUse2D({ reducedMotion: false, webglAvailable: false })).toBe(true)
  })

  it('uses 3D when motion is allowed and WebGL is available', () => {
    expect(shouldUse2D({ reducedMotion: false, webglAvailable: true })).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/web`
Expected: FAIL — cannot resolve `./environment`.

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/home/environment.ts`:

```ts
export interface EnvSignals {
  reducedMotion: boolean
  webglAvailable: boolean
}

/** Pure policy: use the static 2D fallback if motion is reduced or WebGL is missing. */
export function shouldUse2D({ reducedMotion, webglAvailable }: EnvSignals): boolean {
  return reducedMotion || !webglAvailable
}

/** Browser probe (not unit-tested; guarded for SSR/test envs). */
export function detectEnvironment(): EnvSignals {
  if (typeof window === 'undefined') {
    return { reducedMotion: true, webglAvailable: false }
  }
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  let webglAvailable = false
  try {
    const canvas = document.createElement('canvas')
    webglAvailable = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    webglAvailable = false
  }
  return { reducedMotion, webglAvailable }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/environment.ts apps/web/src/home/environment.test.ts
git commit -m "feat(home): 2D-fallback environment decision + probe"
```

---

## Task 6: Comic resolution (TDD)

Maps a URL slug to a live comic component, a coming-soon stub, or not-found — driven by the graph.

**Files:**
- Create: `apps/web/src/home/comics.ts`
- Test: `apps/web/src/home/comics.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/home/comics.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { resolveComic } from './comics'

describe('resolveComic', () => {
  it('resolves a live comic to a component', () => {
    const r = resolveComic('camping')
    expect(r.kind).toBe('live')
    if (r.kind === 'live') expect(typeof r.Component).toBe('function')
  })

  it('resolves a known coming-soon comic to a stub with its title', () => {
    const r = resolveComic('karen')
    expect(r.kind).toBe('stub')
    if (r.kind === 'stub') expect(r.title).toContain('Karen')
  })

  it('resolves an unknown slug to not-found', () => {
    expect(resolveComic('does-not-exist').kind).toBe('not-found')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/web`
Expected: FAIL — cannot resolve `./comics`.

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/home/comics.ts`:

```ts
import type { ComponentType } from 'react'
import { CampingComic } from '../comics/camping/CampingComic'
import { storyNodes } from './graph'

export type ComicResolution =
  | { kind: 'live'; title: string; Component: ComponentType }
  | { kind: 'stub'; title: string }
  | { kind: 'not-found' }

/** Live comics: slug → component. Add an entry here when a comic ships. */
const liveComics: Record<string, ComponentType> = {
  camping: CampingComic,
}

export function resolveComic(slug: string): ComicResolution {
  const node = storyNodes.find((n) => n.route === `/comics/${slug}`)
  if (!node) return { kind: 'not-found' }
  const Component = liveComics[slug]
  if (node.status === 'live' && Component) return { kind: 'live', title: node.title, Component }
  return { kind: 'stub', title: node.title }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/comics.ts apps/web/src/home/comics.test.ts
git commit -m "feat(home): slug → live/stub/not-found comic resolution"
```

---

## Task 7: Base styles (black canvas + scroll driver)

**Files:**
- Modify: `apps/web/src/index.css`

- [ ] **Step 1: Replace the stylesheet**

Overwrite `apps/web/src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

:root {
  --black: #000;
  --white: #fff;
  --cyan: #46d5ff;
  --grey: #6a7480;
  --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

* { box-sizing: border-box; }

html, body, #root {
  margin: 0;
  padding: 0;
  background: var(--black);
  color: var(--white);
  font-family: var(--mono);
}

a { color: var(--cyan); text-decoration: none; }
a:hover { text-decoration: underline; }

/* The 3D canvas is fixed; a tall spacer drives scroll → camera t. */
.home-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
}
.home-scroll-driver { position: relative; width: 100%; }

/* Honour reduced motion globally for any CSS transitions we add. */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 2: Typecheck (CSS has no types; just confirm nothing else broke)**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/index.css
git commit -m "style(web): black base, IBM Plex Mono, fixed-canvas scroll layout"
```

---

## Task 8: Text pages (About / Storyverse / Future Proof / stub / 404)

Build the simple pages first so routing in Task 9 has real targets.

**Files:**
- Create: `apps/web/src/routes/TextPage.tsx`
- Create: `apps/web/src/routes/About.tsx`, `Storyverse.tsx`, `FutureProof.tsx`, `ComicStub.tsx`, `NotFound.tsx`

- [ ] **Step 1: Write the shared layout**

Create `apps/web/src/routes/TextPage.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function TextPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px', lineHeight: 1.7 }}>
      <Link to="/" style={{ fontSize: 13 }}>← timeline</Link>
      <h1 style={{ letterSpacing: 2, marginTop: 24 }}>{title}</h1>
      {children}
    </main>
  )
}
```

- [ ] **Step 2: Write the four content pages + stub + 404**

Create `apps/web/src/routes/About.tsx`:

```tsx
import { TextPage } from './TextPage'

export function About() {
  return (
    <TextPage title="BadCode">
      <p>BadCode is an art collective broadcasting from a future that already went wrong.</p>
      <p>
        The conceit: humanity ran <code>git push origin master</code> on its worst code — greed,
        runaway inequality, politics that couldn't keep pace with its own machines — and shipped it
        straight to production with no review. This homepage is that repository. Walk its history,
        reach the fork, and choose a branch.
      </p>
      <p>
        The bad branch ends in the <a href="/storyverse">Storyverse</a>. The good branch ends in{' '}
        <a href="/future-proof">Future Proof</a>. We are here to make sure you take the second one.
      </p>
    </TextPage>
  )
}
```

Create `apps/web/src/routes/Storyverse.tsx`:

```tsx
import { TextPage } from './TextPage'

export function Storyverse() {
  return (
    <TextPage title="Storyverse">
      <p>The tip of the bad branch — the physics the intelligence worked out, too late and alone.</p>
      <p>Consciousness is the root; matter is the projection. Humans are connected to that ground; the machine is not. That is why it came back.</p>
      <p style={{ color: 'var(--grey)' }}>Full chapter coming soon.</p>
    </TextPage>
  )
}
```

Create `apps/web/src/routes/FutureProof.tsx`:

```tsx
import { TextPage } from './TextPage'

export function FutureProof() {
  return (
    <TextPage title="Future Proof">
      <p>The good branch's destination — govern ourselves well enough to deserve the abundance we can already build.</p>
      <p>Composition over inheritance. Continuous, tested governance. Competence-qualified participation. A politics borrowed from how we build resilient systems.</p>
      <p style={{ color: 'var(--grey)' }}>Full chapter coming soon.</p>
    </TextPage>
  )
}
```

Create `apps/web/src/routes/ComicStub.tsx`:

```tsx
import { TextPage } from './TextPage'

export function ComicStub({ title }: { title: string }) {
  return (
    <TextPage title={title}>
      <p style={{ color: 'var(--grey)' }}>This story is still being drawn.</p>
      <p>It clips to the timeline, but the comic isn't published yet. Check back soon.</p>
    </TextPage>
  )
}
```

Create `apps/web/src/routes/NotFound.tsx`:

```tsx
import { TextPage } from './TextPage'

export function NotFound() {
  return (
    <TextPage title="404 — no such commit">
      <p style={{ color: 'var(--grey)' }}>That path isn't on any branch.</p>
    </TextPage>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/routes
git commit -m "feat(web): About/Storyverse/FutureProof/stub/404 text pages"
```

---

## Task 9: Router shell + ComicPage + temporary Home

Wire routing. Home temporarily renders a placeholder so we can verify navigation before the scene exists.

**Files:**
- Create: `apps/web/src/routes/ComicPage.tsx`
- Create: `apps/web/src/routes/Home.tsx` (temporary body, replaced in Task 11/15)
- Modify: `apps/web/src/App.tsx`

- [ ] **Step 1: Write ComicPage**

Create `apps/web/src/routes/ComicPage.tsx`:

```tsx
import { useParams } from 'react-router-dom'
import { resolveComic } from '../home/comics'
import { ComicStub } from './ComicStub'
import { NotFound } from './NotFound'

export function ComicPage() {
  const { slug = '' } = useParams()
  const r = resolveComic(slug)
  if (r.kind === 'live') return <r.Component />
  if (r.kind === 'stub') return <ComicStub title={r.title} />
  return <NotFound />
}
```

- [ ] **Step 2: Write a temporary Home**

Create `apps/web/src/routes/Home.tsx`:

```tsx
import { Link } from 'react-router-dom'

// TEMPORARY body — replaced by the 3D scene / 2D fallback in later tasks.
export function Home() {
  return (
    <main style={{ padding: 48 }}>
      <h1 style={{ letterSpacing: 4 }}>BADCODE</h1>
      <p style={{ color: 'var(--grey)' }}>git push origin master</p>
      <ul>
        <li><Link to="/comics/camping">Camping (live)</Link></li>
        <li><Link to="/comics/karen">Karen (stub)</Link></li>
        <li><Link to="/storyverse">Storyverse</Link></li>
        <li><Link to="/future-proof">Future Proof</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </main>
  )
}
```

- [ ] **Step 3: Rewrite App as the router**

Overwrite `apps/web/src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './routes/Home'
import { ComicPage } from './routes/ComicPage'
import { About } from './routes/About'
import { Storyverse } from './routes/Storyverse'
import { FutureProof } from './routes/FutureProof'
import { NotFound } from './routes/NotFound'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comics/:slug" element={<ComicPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/storyverse" element={<Storyverse />} />
        <Route path="/future-proof" element={<FutureProof />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 5: Manual smoke test**

Run: `npm run dev` (from repo root). Open `http://localhost:5173`.
Expected: the temporary BADCODE list page. Verify:
- `/comics/camping` renders the existing Camping scroll comic.
- `/comics/karen` renders the "still being drawn" stub.
- `/storyverse`, `/future-proof`, `/about` render their text pages.
- a nonsense path (`/nope`) renders the 404.
Stop the dev server (Ctrl-C) when done.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/App.tsx apps/web/src/routes/Home.tsx apps/web/src/routes/ComicPage.tsx
git commit -m "feat(web): router shell + comic page resolution + temp home"
```

---

## Task 10: 2D fallback (the static navigable fork)

The accessible homepage and the milestone where `/` shows the real fork. Driven by `graph.ts`.

**Files:**
- Create: `apps/web/src/home/Fallback2D.tsx`

- [ ] **Step 1: Write the fallback**

Create `apps/web/src/home/Fallback2D.tsx`. It maps plane coords (x:-30..30, y:-13..13) into an SVG viewBox and draws spine, commits, tethers, nodes (as links), tips, and the narrator line.

```tsx
import { Link } from 'react-router-dom'
import { GRAPH, storyNodes } from './graph'
import { COLORS } from './colors'

// Plane (x:-32..32, y:-14..14) → SVG (0..1280, 0..560). y is flipped (up = -screen).
const SX = (x: number) => ((x + 32) / 64) * 1280
const SY = (y: number) => ((14 - y) / 28) * 560
const pts = (ps: readonly (readonly [number, number])[]) =>
  ps.map(([x, y]) => `${SX(x)},${SY(y)}`).join(' ')

export function Fallback2D() {
  const { branches, historyCommits, tips } = GRAPH
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: 'min(1100px, 96vw)' }}>
        <h1 style={{ letterSpacing: 6, textAlign: 'center', margin: '0 0 4px' }}>BADCODE</h1>
        <p style={{ textAlign: 'center', color: COLORS.grey, marginTop: 0 }}>
          humans, you done fucked up… thankfully you are loved, and we can fix it.
        </p>
        <svg viewBox="0 0 1280 560" role="img" aria-label="The BadCode timeline: shared history forking into a bad branch and a good branch" style={{ width: '100%', height: 'auto' }}>
          <polyline points={pts(branches.history)} fill="none" stroke={COLORS.white} strokeWidth={2.5} />
          <polyline points={pts(branches.bad)} fill="none" stroke="#bbb" strokeWidth={2.5} />
          <polyline points={pts(branches.good)} fill="none" stroke="#bbb" strokeWidth={2.5} />
          {historyCommits.map(([x, y], i) => (
            <circle key={i} cx={SX(x)} cy={SY(y)} r={3} fill={COLORS.grey} />
          ))}
          {/* tips */}
          {(['storyverse', 'futureProof'] as const).map((k) => (
            <Link key={k} to={tips[k].route}>
              <circle cx={SX(tips[k].pos[0])} cy={SY(tips[k].pos[1])} r={9} fill="none" stroke={COLORS.white} strokeWidth={2.5} />
              <text x={SX(tips[k].pos[0]) - 10} y={SY(tips[k].pos[1]) + (tips[k].branch === 'bad' ? -16 : 26)} fill={COLORS.white} fontSize={14}>
                {tips[k].title}
              </text>
            </Link>
          ))}
          {/* story nodes */}
          {storyNodes.map((n) => (
            <Link key={n.id} to={n.route} aria-label={`${n.title}${n.status === 'live' ? '' : ' (coming soon)'}`}>
              <line x1={SX(n.clip[0])} y1={SY(n.clip[1])} x2={SX(n.pos[0])} y2={SY(n.pos[1])} stroke={COLORS.tether} strokeWidth={1} />
              <circle cx={SX(n.pos[0])} cy={SY(n.pos[1])} r={8} fill="none" stroke={COLORS.cyan} strokeWidth={2} opacity={n.status === 'live' ? 1 : 0.5} />
              <text x={SX(n.pos[0]) + 12} y={SY(n.pos[1]) + 4} fill={COLORS.cyan} fontSize={12} opacity={n.status === 'live' ? 1 : 0.6}>
                {n.title}
              </text>
            </Link>
          ))}
        </svg>
        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/about">about</Link>
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Point Home at the fallback temporarily to verify it**

In `apps/web/src/routes/Home.tsx`, replace the body with:

```tsx
import { Fallback2D } from '../home/Fallback2D'

export function Home() {
  return <Fallback2D />
}
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: the static fork — white history line, grey commits, cyan tethered nodes (Camping bright; Karen/Emperor's/Optimistic dimmer), Storyverse/Future Proof tips, narrator line. Clicking Camping → comic; clicking Storyverse → its page. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Fallback2D.tsx apps/web/src/routes/Home.tsx
git commit -m "feat(home): accessible 2D fallback fork (navigable)"
```

---

## Task 11: 3D scene scaffold + Home picks 3D vs 2D

Stand up the Canvas and a minimal scene (camera + background + a placeholder line), and make Home choose based on environment, lazy-loading the scene.

**Files:**
- Create: `apps/web/src/home/Scene.tsx`
- Modify: `apps/web/src/routes/Home.tsx`

- [ ] **Step 1: Write a minimal Scene (default export for lazy import)**

Create `apps/web/src/home/Scene.tsx`:

```tsx
import { Canvas } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { GRAPH } from './graph'
import { COLORS } from './colors'

function historyLine(): [number, number, number][] {
  return GRAPH.branches.history.map(([x, y]) => [x, y, 0])
}

export default function Scene() {
  return (
    <div className="home-canvas">
      <Canvas camera={{ position: [0, 0, 40], fov: 50 }}>
        <color attach="background" args={[COLORS.black]} />
        <Line points={historyLine()} color={COLORS.white} lineWidth={1.5} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Make Home choose 3D vs 2D**

Overwrite `apps/web/src/routes/Home.tsx`:

```tsx
import { Suspense, lazy, useMemo } from 'react'
import { detectEnvironment, shouldUse2D } from '../home/environment'
import { Fallback2D } from '../home/Fallback2D'

const Scene = lazy(() => import('../home/Scene'))

export function Home() {
  const use2D = useMemo(() => shouldUse2D(detectEnvironment()), [])
  if (use2D) return <Fallback2D />
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#000' }} />}>
      <Scene />
    </Suspense>
  )
}
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: a black full-screen canvas with a faint white horizontal line (the history spine). Enable OS "reduce motion" and reload → the 2D fallback appears instead. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Scene.tsx apps/web/src/routes/Home.tsx
git commit -m "feat(home): 3D scene scaffold + env-based 3D/2D switch"
```

---

## Task 12: Spine — full branch geometry + history commits

**Files:**
- Create: `apps/web/src/home/Spine.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Write Spine**

Create `apps/web/src/home/Spine.tsx`:

```tsx
import { Line } from '@react-three/drei'
import { GRAPH } from './graph'
import { COLORS } from './colors'

const to3 = (ps: readonly (readonly [number, number])[]): [number, number, number][] =>
  ps.map(([x, y]) => [x, y, 0])

export function Spine() {
  const { branches, historyCommits } = GRAPH
  return (
    <group>
      <Line points={to3(branches.history)} color={COLORS.white} lineWidth={2} />
      <Line points={to3(branches.bad)} color="#bbbbbb" lineWidth={2} />
      <Line points={to3(branches.good)} color="#bbbbbb" lineWidth={2} />
      {historyCommits.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={COLORS.grey} />
        </mesh>
      ))}
    </group>
  )
}
```

- [ ] **Step 2: Use Spine in Scene (replace the placeholder Line)**

Overwrite `apps/web/src/home/Scene.tsx`:

```tsx
import { Canvas } from '@react-three/fiber'
import { Spine } from './Spine'
import { COLORS } from './colors'

export default function Scene() {
  return (
    <div className="home-canvas">
      <Canvas camera={{ position: [0, 0, 45], fov: 50 }}>
        <color attach="background" args={[COLORS.black]} />
        <Spine />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: the full bent fork in white/grey — flat history, steep up/down at the fork, flat parallel runs, four grey commit dots. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Spine.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): full bent-fork spine + history commits in 3D"
```

---

## Task 13: Story nodes (constellation) with hover labels + click-to-navigate

**Files:**
- Create: `apps/web/src/home/StoryNode.tsx`
- Create: `apps/web/src/home/Constellation.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Write StoryNode**

Create `apps/web/src/home/StoryNode.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line, Html } from '@react-three/drei'
import type { StoryNode as StoryNodeData } from './graph'
import { COLORS } from './colors'

export function StoryNode({ node }: { node: StoryNodeData }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const dim = node.status === 'live' ? 1 : 0.45
  const [cx, cy] = node.pos
  const [tx, ty] = node.clip
  return (
    <group>
      <Line points={[[tx, ty, 0], [cx, cy, 0]]} color={COLORS.tether} lineWidth={1} transparent opacity={0.7} />
      <mesh
        position={[cx, cy, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); navigate(node.route) }}
      >
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={dim} toneMapped={false} />
      </mesh>
      <Html position={[cx + 1, cy + 0.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: COLORS.cyan, fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'nowrap',
          opacity: hovered || node.status === 'live' ? dim : 0.25, transition: 'opacity 120ms',
        }}>
          {node.title}{node.status === 'coming-soon' ? ' · soon' : ''}
        </div>
      </Html>
    </group>
  )
}
```

- [ ] **Step 2: Write Constellation**

Create `apps/web/src/home/Constellation.tsx`:

```tsx
import { storyNodes } from './graph'
import { StoryNode } from './StoryNode'

export function Constellation() {
  return (
    <group>
      {storyNodes.map((n) => <StoryNode key={n.id} node={n} />)}
    </group>
  )
}
```

- [ ] **Step 3: Add Constellation to Scene**

In `apps/web/src/home/Scene.tsx`, add the import and render it after `<Spine />`:

```tsx
import { Constellation } from './Constellation'
// …
        <Spine />
        <Constellation />
```

- [ ] **Step 4: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: cyan nodes floating off the branches with tethers; hovering shows the title and enlarges the node; clicking Camping navigates to the comic; clicking Karen navigates to its stub. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/StoryNode.tsx apps/web/src/home/Constellation.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): cyan story-node constellation with hover + click nav"
```

---

## Task 14: Branch tips (Storyverse / Future Proof)

**Files:**
- Create: `apps/web/src/home/BranchTip.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Write BranchTip**

Create `apps/web/src/home/BranchTip.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html } from '@react-three/drei'
import { COLORS } from './colors'

export function BranchTip({ title, pos, route, up }: {
  title: string
  pos: readonly [number, number]
  route: string
  up: boolean
}) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [x, y] = pos
  return (
    <group position={[x, y, 0]}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); navigate(route) }}
      >
        <torusGeometry args={[1, 0.12, 16, 40]} />
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>
      <Html position={[0, up ? 2 : -2, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ color: COLORS.white, fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2, whiteSpace: 'nowrap', opacity: hovered ? 1 : 0.85 }}>
          {title.toUpperCase()}
        </div>
      </Html>
    </group>
  )
}
```

- [ ] **Step 2: Render both tips in Scene**

In `apps/web/src/home/Scene.tsx`, import `BranchTip` and `GRAPH`, and render after `<Constellation />`:

```tsx
import { BranchTip } from './BranchTip'
import { GRAPH } from './graph'
// …
        <Constellation />
        <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
        <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`. Expected: white ring markers at both branch ends labelled STORYVERSE / FUTURE PROOF; clicking each navigates to its page. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/BranchTip.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): clickable Storyverse / Future Proof branch tips"
```

---

## Task 15: Camera controller + scroll driver

Introduce the `t` controller (context) and a CameraRig that samples the spline at scroll progress. Add the tall scroll-driver spacer.

**Files:**
- Create: `apps/web/src/home/cameraController.ts`
- Create: `apps/web/src/home/useScrollProgress.ts`
- Create: `apps/web/src/home/CameraRig.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Write the controller (mutable `t` + mode, shared via context)**

Create `apps/web/src/home/cameraController.ts`:

```ts
import { createContext, useContext } from 'react'

export type CameraMode = 'intro' | 'travel'

/** Mutable, ref-like controller shared by the rig and UI. Not React state — read in useFrame. */
export interface CameraController {
  /** Normalized tour position [0,1], the single source of truth for the camera. */
  t: number
  mode: CameraMode
  /** Spine draw progress [0,1] for the opening sequence. */
  drawProgress: number
}

export function createCameraController(): CameraController {
  // drawProgress starts at 0 so the opening sequence (Task 20) can draw the spine in.
  // The reduced-motion and re-emerge paths set it to 1 immediately.
  return { t: 0, mode: 'intro', drawProgress: 0 }
}

export const CameraControllerContext = createContext<CameraController | null>(null)

export function useCameraController(): CameraController {
  const c = useContext(CameraControllerContext)
  if (!c) throw new Error('useCameraController must be used within CameraControllerContext')
  return c
}
```

- [ ] **Step 2: Write the scroll-progress hook**

Create `apps/web/src/home/useScrollProgress.ts`:

```ts
import { useEffect } from 'react'

/** Calls back with normalized page scroll [0,1] whenever it changes. */
export function useScrollProgress(onChange: (t: number) => void): void {
  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      onChange(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [onChange])
}
```

- [ ] **Step 3: Write CameraRig**

Create `apps/web/src/home/CameraRig.tsx`:

```tsx
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { pointAtT } from './path'
import { useCameraController } from './cameraController'

const here = new Vector3()
const ahead = new Vector3()
const desired = new Vector3()
const introPos = new Vector3(2, 0, 60) // pulled-back overview
const introTarget = new Vector3(2, 0, 0)

/** Side-on follow camera: sits back on +Z above the local tour point, looks slightly ahead. */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const ctrl = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt) // frame-rate-independent damping
    if (ctrl.mode === 'intro') {
      camera.position.lerp(introPos, k)
      camera.lookAt(introTarget)
      return
    }
    pointAtT(ctrl.t, here)
    pointAtT(Math.min(1, ctrl.t + 0.04), ahead)
    desired.set(here.x, here.y + 2, 14) // back on +Z, slightly above
    camera.position.lerp(desired, k)
    camera.lookAt(ahead.x, ahead.y, 0)
  })

  return null
}
```

- [ ] **Step 4: Wire controller + rig + scroll spacer into Scene**

Overwrite `apps/web/src/home/Scene.tsx`:

```tsx
import { useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Spine } from './Spine'
import { Constellation } from './Constellation'
import { BranchTip } from './BranchTip'
import { CameraRig } from './CameraRig'
import { GRAPH } from './graph'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useScrollProgress } from './useScrollProgress'

/** Pages of scroll length that map to t = 0..1. */
const SCROLL_PAGES = 6

export default function Scene() {
  const ctrl = useRef(createCameraController()).current
  const onScroll = useCallback((t: number) => {
    if (t > 0 && ctrl.mode === 'intro') ctrl.mode = 'travel'
    ctrl.t = t
  }, [ctrl])
  useScrollProgress(onScroll)

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas">
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <CameraRig />
          <Spine />
          <Constellation />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <div className="home-scroll-driver" style={{ height: `${SCROLL_PAGES * 100}vh` }} aria-hidden />
    </CameraControllerContext.Provider>
  )
}
```

- [ ] **Step 5: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: page opens on the pulled-back overview; scrolling down flies the camera from history, through the fork, up the bad branch toward Storyverse, passing the Camping/Karen nodes. Nodes remain clickable. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/home/cameraController.ts apps/web/src/home/useScrollProgress.ts apps/web/src/home/CameraRig.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): camera rig + scroll-driven travel along the tour"
```

---

## Task 16: Waypoint + autoplay drivers (GSAP)

Add programmatic camera moves by tweening the page scroll position to a target `t`, plus an autoplay sweep.

**Files:**
- Create: `apps/web/src/home/drivers.ts`

- [ ] **Step 1: Write the drivers**

Create `apps/web/src/home/drivers.ts`:

```ts
import gsap from 'gsap'

/** Convert a normalized t into a page scrollY target. */
function scrollTargetForT(t: number): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return Math.min(1, Math.max(0, t)) * max
}

/** Cinematic waypoint: tween the page scroll to a target t (so the rig follows). */
export function flyToT(t: number, duration = 1.6): gsap.core.Tween {
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: scrollTargetForT(t),
    duration,
    ease: 'power2.inOut',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}

/** Trailer/attract: sweep from start to end over `duration` seconds. */
export function autoplay(duration = 12): gsap.core.Tween {
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: () => document.documentElement.scrollHeight - window.innerHeight,
    duration,
    ease: 'none',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/drivers.ts
git commit -m "feat(home): GSAP waypoint fly-to + autoplay scroll drivers"
```

---

## Task 17: Chrome (wordmark, About, overview/replay, autoplay)

DOM overlay over the canvas, wired to the drivers and the controller.

**Files:**
- Create: `apps/web/src/home/Chrome.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Write Chrome**

Create `apps/web/src/home/Chrome.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { flyToT, autoplay } from './drivers'
import { waypoints } from './graph'
import { useCameraController } from './cameraController'

const btn: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
  font: 'inherit', fontSize: 12, padding: '6px 10px', cursor: 'pointer', letterSpacing: 1,
}

export function Chrome() {
  const ctrl = useCameraController()
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      <div style={{ position: 'absolute', top: 20, left: 24, pointerEvents: 'auto' }}>
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700 }}>BADCODE</div>
        <div style={{ color: 'var(--grey)', fontSize: 11 }}>git push origin master</div>
      </div>
      <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 10, pointerEvents: 'auto' }}>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToT(waypoints.fork) }}>fork</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToT(waypoints.storyverse) }}>storyverse</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; autoplay() }}>play</button>
        <Link to="/about" style={{ ...btn, display: 'inline-block' }}>about</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Render Chrome in Scene (inside the provider, outside the Canvas)**

In `apps/web/src/home/Scene.tsx`, import `Chrome` and render it right after the `.home-canvas` div, still inside `CameraControllerContext.Provider`:

```tsx
import { Chrome } from './Chrome'
// …
      </div>
      <Chrome />
      <div className="home-scroll-driver" style={{ height: `${SCROLL_PAGES * 100}vh` }} aria-hidden />
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: BADCODE wordmark top-left; buttons top-right. "fork" flies to the fork, "storyverse" flies to the tip, "play" auto-sweeps the whole tour, "about" navigates. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Chrome.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): overlay chrome — wordmark, fork/storyverse/play, about"
```

---

## Task 18: Atmosphere (fog, stars, accent light, bloom)

Make cyan glow and add depth. Bloom needs an emissive/bright material — our node/tip materials use `toneMapped={false}`, which reads as emissive under bloom.

**Files:**
- Create: `apps/web/src/home/Atmosphere.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Write Atmosphere**

Create `apps/web/src/home/Atmosphere.tsx`:

```tsx
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { COLORS } from './colors'

export function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={[COLORS.black, 30, 90]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 20]} intensity={30} color={COLORS.cyan} />
      <Stars radius={120} depth={60} count={1400} factor={3} fade speed={0.4} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </>
  )
}
```

- [ ] **Step 2: Add Atmosphere to Scene (inside Canvas, after the background color)**

In `apps/web/src/home/Scene.tsx`, import `Atmosphere` and render it just after `<color attach="background" … />`:

```tsx
import { Atmosphere } from './Atmosphere'
// …
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig />
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: a starfield, cyan nodes now glow with bloom, distant branch fades into fog until approached. Travel still works. If bloom washes the whole scene, lower `intensity` / raise `luminanceThreshold`. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Atmosphere.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): atmosphere — fog, stars, cyan accent light, bloom"
```

---

## Task 19: Narration overlay (type-on two-step line)

**Files:**
- Create: `apps/web/src/home/Narration.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Write Narration**

Create `apps/web/src/home/Narration.tsx`. It types the two-step line on mount, then fades; respects reduced motion by showing it statically.

```tsx
import { useEffect, useRef, useState } from 'react'

const LINE = 'humans, you done fucked up… thankfully you are loved, and we can fix it.'

export function Narration() {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  ).current

  useEffect(() => {
    if (reduced) { setShown(LINE); setDone(true); return }
    let i = 0
    const id = window.setInterval(() => {
      i++
      setShown(LINE.slice(0, i))
      if (i >= LINE.length) {
        window.clearInterval(id)
        window.setTimeout(() => setDone(true), 2600)
      }
    }, 38)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 48, textAlign: 'center',
      pointerEvents: 'none', zIndex: 2, padding: '0 24px',
      color: 'var(--cyan)', fontSize: 14, letterSpacing: 0.5,
      opacity: done ? 0 : 1, transition: 'opacity 1.2s ease',
    }}>
      {shown}
    </div>
  )
}
```

- [ ] **Step 2: Render Narration in Scene (after Chrome, inside the provider)**

In `apps/web/src/home/Scene.tsx`:

```tsx
import { Narration } from './Narration'
// …
      <Chrome />
      <Narration />
```

- [ ] **Step 3: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: the two-step line types out along the bottom on load, then fades. With reduced motion on, it appears instantly. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Narration.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): type-on two-step narrator overlay"
```

---

## Task 20: Opening sequence (self-drawing spine → overview)

Animate the spine drawing itself in on first load, skipped under reduced motion / re-emerge. Implemented by animating a `drawProgress` value on the controller and having Spine imperatively reveal the history polyline up to that point.

**Files:**
- Create: `apps/web/src/home/OpeningSequence.tsx`
- Modify: `apps/web/src/home/Spine.tsx`
- Modify: `apps/web/src/home/Scene.tsx`

- [ ] **Step 1: Make Spine respect `drawProgress`**

Overwrite `apps/web/src/home/Spine.tsx`. The history line is revealed by imperatively rewriting its
geometry each frame to a polyline truncated at the current draw head (reliable; no dashed-material
trickery). Branches and commits appear once drawing completes.

```tsx
import { useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GRAPH } from './graph'
import { COLORS } from './colors'
import { useCameraController } from './cameraController'

const to3 = (ps: readonly (readonly [number, number])[]): [number, number, number][] =>
  ps.map(([x, y]) => [x, y, 0])

/** History polyline truncated at `progress` (0..1) along its points, with an interpolated head. */
function drawnHistory(progress: number): [number, number, number][] {
  const pts = to3(GRAPH.branches.history)
  if (progress >= 1) return pts
  const segs = pts.length - 1
  const head = Math.max(0, progress) * segs
  const idx = Math.floor(head)
  const frac = head - idx
  const out = pts.slice(0, idx + 1)
  if (idx < segs) {
    const a = pts[idx]
    const b = pts[idx + 1]
    out.push([a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac, 0])
  }
  return out.length >= 2 ? out : [pts[0], pts[0]]
}

export function Spine() {
  const { branches, historyCommits } = GRAPH
  const ctrl = useCameraController()
  // drei's <Line> forwards its ref to a three-stdlib Line2; typed `any` to avoid a brittle
  // deep import. We only call geometry.setPositions(number[]) on it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const historyRef = useRef<any>(null)
  const lastProgress = useRef(-1)

  useFrame(() => {
    const line = historyRef.current
    if (!line || ctrl.drawProgress === lastProgress.current) return
    lastProgress.current = ctrl.drawProgress
    line.geometry.setPositions(drawnHistory(ctrl.drawProgress).flat())
  })

  const branchesVisible = ctrl.drawProgress > 0.98
  return (
    <group>
      <Line ref={historyRef} points={to3(branches.history)} color={COLORS.white} lineWidth={2} />
      {branchesVisible && (
        <>
          <Line points={to3(branches.bad)} color="#bbbbbb" lineWidth={2} />
          <Line points={to3(branches.good)} color="#bbbbbb" lineWidth={2} />
        </>
      )}
      {historyCommits.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} visible={branchesVisible}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={COLORS.grey} />
        </mesh>
      ))}
    </group>
  )
}
```

> `geometry.setPositions(number[])` exists on the `LineGeometry` drei builds for `<Line>` and accepts
> a variable-length flat `[x,y,z, x,y,z, …]` array, so truncating the point list each frame is safe.
> The repo lints with `tsc` only (no ESLint), so the explicit `any` is fine; the disable comment is
> harmless if ESLint is added later.

- [ ] **Step 2: Write the opening controller component**

Create `apps/web/src/home/OpeningSequence.tsx`:

```tsx
import { useEffect } from 'react'
import gsap from 'gsap'
import { useCameraController } from './cameraController'

/** Drives drawProgress 0→1 on first load. Skipped when re-emerging from a node or reduced-motion. */
export function OpeningSequence() {
  const ctrl = useCameraController()
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // mode === 'travel' here means Scene re-emerged us at a node (Task 21) — don't replay the intro.
    if (reduced || ctrl.mode === 'travel') { ctrl.drawProgress = 1; return }
    ctrl.drawProgress = 0 // already the default; explicit for clarity
    const tween = gsap.to(ctrl, { drawProgress: 1, duration: 2.4, ease: 'power2.out', delay: 0.6 })
    return () => { tween.kill() }
  }, [ctrl])
  return null
}
```

- [ ] **Step 3: Render OpeningSequence in Scene (inside Canvas so useFrame in Spine sees the same controller; OpeningSequence itself needs the context but not the canvas — render it inside the provider, outside Canvas)**

In `apps/web/src/home/Scene.tsx`, import `OpeningSequence` and render it just after `<Chrome />`:

```tsx
import { OpeningSequence } from './OpeningSequence'
// …
      <Chrome />
      <OpeningSequence />
      <Narration />
```

Also set the controller's initial `drawProgress` to `0` for the non-reduced path by leaving `createCameraController()` as-is (defaults to 1) — `OpeningSequence` sets it to 0 on mount before the first frame.

- [ ] **Step 4: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: on load the history line draws itself in over ~2.4s, then the branches/commits appear, settling on the overview with the narrator line; scrolling then travels. Reduced motion → 2D fallback (the 3D opening does not run). Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/OpeningSequence.tsx apps/web/src/home/Spine.tsx apps/web/src/home/Scene.tsx
git commit -m "feat(home): self-drawing opening sequence → overview"
```

---

## Task 21: Node fly-in transition + re-emerge on return

Clicking a node should dive the camera in, glow-out, then navigate. Returning to `/` from a comic should re-position near that node.

**Files:**
- Modify: `apps/web/src/home/StoryNode.tsx`
- Modify: `apps/web/src/home/Scene.tsx`
- Modify: `apps/web/src/routes/TextPage.tsx` (carry `from` state on the back link is optional; comic back-link below)

- [ ] **Step 1: Add a glow-out overlay + fly-in to StoryNode**

Overwrite `apps/web/src/home/StoryNode.tsx` to tween scroll to the node's `t`, flash a cyan overlay, then navigate with `state` recording the node:

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line, Html } from '@react-three/drei'
import gsap from 'gsap'
import type { StoryNode as StoryNodeData } from './graph'
import { flyToT } from './drivers'
import { useCameraController } from './cameraController'
import { COLORS } from './colors'

export function StoryNode({ node, onFlash }: { node: StoryNodeData; onFlash: () => void }) {
  const navigate = useNavigate()
  const ctrl = useCameraController()
  const [hovered, setHovered] = useState(false)
  const dim = node.status === 'live' ? 1 : 0.45
  const [cx, cy] = node.pos
  const [tx, ty] = node.clip

  const enter = () => {
    ctrl.mode = 'travel'
    flyToT(node.t, 1.1)
    gsap.delayedCall(1.0, () => {
      onFlash()
      gsap.delayedCall(0.35, () => navigate(node.route, { state: { fromNode: node.id } }))
    })
  }

  return (
    <group>
      <Line points={[[tx, ty, 0], [cx, cy, 0]]} color={COLORS.tether} lineWidth={1} transparent opacity={0.7} />
      <mesh
        position={[cx, cy, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); enter() }}
      >
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={dim} toneMapped={false} />
      </mesh>
      <Html position={[cx + 1, cy + 0.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: COLORS.cyan, fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'nowrap',
          opacity: hovered || node.status === 'live' ? dim : 0.25, transition: 'opacity 120ms',
        }}>
          {node.title}{node.status === 'coming-soon' ? ' · soon' : ''}
        </div>
      </Html>
    </group>
  )
}
```

- [ ] **Step 2: Thread `onFlash` from Constellation**

Overwrite `apps/web/src/home/Constellation.tsx`:

```tsx
import { storyNodes } from './graph'
import { StoryNode } from './StoryNode'

export function Constellation({ onFlash }: { onFlash: () => void }) {
  return (
    <group>
      {storyNodes.map((n) => <StoryNode key={n.id} node={n} onFlash={onFlash} />)}
    </group>
  )
}
```

- [ ] **Step 3: Replace Scene with the authoritative final version**

This consolidates every earlier incremental edit (Tasks 15, 17, 18, 19, 20) plus the new flash
overlay and re-emerge logic. Overwrite `apps/web/src/home/Scene.tsx` entirely:

```tsx
import { useRef, useState, useCallback } from 'react'
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
import { GRAPH, storyNodes } from './graph'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useScrollProgress } from './useScrollProgress'

/** Pages of scroll length that map to t = 0..1. */
const SCROLL_PAGES = 6

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)

  // Re-emerge: if we returned to "/" from a node, start the camera already at that node.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  if (fromNode && ctrl.mode === 'intro') {
    const node = storyNodes.find((n) => n.id === fromNode)
    if (node) {
      ctrl.mode = 'travel'
      ctrl.t = node.t
      ctrl.drawProgress = 1
    }
  }

  const onScroll = useCallback(
    (t: number) => {
      if (t > 0 && ctrl.mode === 'intro') ctrl.mode = 'travel'
      ctrl.t = t
    },
    [ctrl],
  )
  useScrollProgress(onScroll)

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas">
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig />
          <Spine />
          <Constellation onFlash={() => setFlash(true)} />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <Chrome />
      <OpeningSequence />
      <Narration />
      {flash && (
        <div style={{ position: 'fixed', inset: 0, background: COLORS.cyan, zIndex: 3, pointerEvents: 'none' }} />
      )}
      <div className="home-scroll-driver" style={{ height: `${SCROLL_PAGES * 100}vh` }} aria-hidden />
    </CameraControllerContext.Provider>
  )
}
```

> Because this is the authoritative final `Scene.tsx`, ignore the incremental "add X to Scene" notes
> in Tasks 17–20 if you are implementing Task 21 directly — they are already folded in here.

- [ ] **Step 4: Add a "← timeline" back-link to the comic**

Comics render full-screen; add an unobtrusive back control in `ComicPage.tsx` for live comics.
Overwrite `apps/web/src/routes/ComicPage.tsx`:

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { resolveComic } from '../home/comics'
import { ComicStub } from './ComicStub'
import { NotFound } from './NotFound'

function BackToTimeline({ slug }: { slug: string }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/', { state: { fromNode: slug } })}
      style={{ position: 'fixed', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.6)', border: '1px solid var(--cyan)', color: 'var(--cyan)', font: 'inherit', fontSize: 12, padding: '6px 10px', cursor: 'pointer' }}
    >
      ← timeline
    </button>
  )
}

export function ComicPage() {
  const { slug = '' } = useParams()
  const r = resolveComic(slug)
  if (r.kind === 'live') {
    return (
      <>
        <BackToTimeline slug={slug} />
        <r.Component />
      </>
    )
  }
  if (r.kind === 'stub') return <ComicStub title={r.title} />
  return <NotFound />
}
```

- [ ] **Step 5: Typecheck + manual smoke**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.
Run: `npm run dev`, open `/`.
Expected: clicking Camping dives the camera toward the node, a cyan flash, then the comic loads at `/comics/camping`; a `← timeline` button sits top-left; clicking it returns to `/` with the camera already positioned at the Camping node. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/home/StoryNode.tsx apps/web/src/home/Constellation.tsx apps/web/src/home/Scene.tsx apps/web/src/routes/ComicPage.tsx
git commit -m "feat(home): node fly-in + cyan flash + re-emerge on return"
```

---

## Task 22: Final integration — full checks + README note

**Files:**
- Modify: `README.md` (append a short homepage section — keep the existing uncommitted edit intact)

- [ ] **Step 1: Whole-repo typecheck**

Run: `npm run typecheck`
Expected: PASS across all workspaces.

- [ ] **Step 2: Whole-repo tests**

Run: `npm run test`
Expected: PASS — cli tests plus the new `@badcode/web` suites (graph, path, environment, comics).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: `tsc --noEmit` clean and Vite build succeeds. Confirm the 3D libraries land in a **separate lazy chunk** (Vite logs a chunk for `Scene`); the initial route bundle should not include three.js.

- [ ] **Step 4: Cross-cutting manual pass**

Run: `npm run dev`. Verify end to end:
- Opening draws in → overview → narrator types and fades.
- Scroll travels history → fork → bad branch → Storyverse; nodes glow.
- Chrome: fork / storyverse / play / about all work.
- Camping fly-in → comic → `← timeline` → re-emerge at node.
- Storyverse / Future Proof tips navigate.
- Reduced motion → 2D fallback; every node/tip is a working link.
Stop the dev server.

- [ ] **Step 5: Add a README homepage note**

Append to `README.md` (below existing content) a short paragraph:

```markdown
## Homepage

The homepage renders *GitPush Origin Master* as a 3D git-history graph (react-three-fiber): scroll
to travel the timeline to the fork and up the bad branch; cyan nodes are stories you can enter
(Camping is live). A static 2D fork is served under `prefers-reduced-motion` or without WebGL. See
`docs/superpowers/specs/2026-06-03-gitpush-homepage-design.md`.
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs(web): note the 3D homepage in the README"
```

---

## Self-Review notes (for the implementer)

- **Spec coverage:** geometry (Task 12), two-tier nodes (Tasks 12–13), palette (Tasks 2,7), opening D→B (Tasks 19–20), navigation one-rig/three-drivers (Tasks 15–17), transition A + re-emerge (Task 21), routing/IA (Tasks 8–9), single source of truth graph (Task 3), 2D fallback + a11y (Tasks 5,10,11), tech stack (Task 1), testing (Tasks 3–6, 22). The good-branch-by-scroll simplification is documented in the header.
- **Tuning expected:** camera offset distances, fog near/far, bloom intensity, node sizes, and the dash-trim opening are visual values — adjust live in `npm run dev`. None affect types/tests.
- **If `@react-three/postprocessing` peer-warns** against the installed `three`/`fiber`, align versions to the combination fiber requests (Task 1, Step 2) and re-run `npm install`.
```
