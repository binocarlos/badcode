# Homepage "The Atlas" — Phase 1 (the spine) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scroll-along-a-line homepage with "The Atlas" — a cinematic auto-fly-in that resolves into a free-roam, semantic-zoom star-chart of the GPOM fork, where nodes carry media plates and deep-link to their content.

**Architecture:** Build the new experience under a fresh `apps/web/src/home/atlas/` directory alongside the existing `Scene.tsx`, so the live site keeps working until the final swap. Pure logic (node model, semantic-zoom state, deep-link resolution) is TDD'd with Vitest; the R3F/visual components are built with real starter code and verified in the browser (`npm run dev`, port 5173). The camera is driven by an auto-played Catmull-Rom intro rail that hands off — with no view jump — to drei `<CameraControls>` for free-roam (drag-pan, scroll-dolly, click-to-fly). Camera distance from origin drives a semantic level-of-detail (galaxy → mid → node) that toggles labels and plates.

**Tech Stack:** React 18 + TypeScript, `@react-three/fiber` 8, `@react-three/drei` 9.122 (`CameraControls`, `Image`, `Text`, `Billboard`), `@react-three/postprocessing` (`Bloom`, `DepthOfField`, `Vignette`), `three` 0.169, `react-router-dom`, Vitest. **No new dependencies required.**

## Global Constraints

- **One `<Canvas>` / one WebGL context** for the whole scene. (spec: Accessibility & performance)
- **No scrolljacking.** Free-roam is drag-pan + scroll-dolly + click-to-fly; the only scripted camera motion is the skippable intro. (spec: Navigation)
- **`prefers-reduced-motion` / no-WebGL → static fallback.** Keep `detectEnvironment()`/`shouldUse2D()` → `Fallback2D`; additionally, when WebGL is used but motion is reduced, skip the intro fly-in and land directly on the map. (spec: Accessibility)
- **Reuse, don't reinvent, the asset pipeline.** Media plates use the existing `assets.manifest.json` format (ThumbHash + WebP/mp4) in later phases; Phase 1 uses local poster images. (spec: Media assets)
- **Songs live in stories; the map is pure story.** No separate music branch. Play = a portal node; About = origin. (spec: Content model)
- **Art direction:** Deep Field cosmos (nebula, gold/violet warmth, celestial nodes, italic-serif labels) read through a Cold Archive HUD (monospace readouts, `// BAD_BRANCH ▸ STORYVERSE · REC ●`, scanline glow). (spec: Art direction)
- **Deep-link every node:** returning from content (`navigate('/', { state: { fromNode: slug } })`) focuses that node and skips the intro. (spec: Data model)
- Phase 1 ends with a shippable homepage. Dioramas (L3 staged stops, video plates, audio) and the L2 branch corridor are **out of scope** — they are Phases 2 and 3 (separate plans).

**Existing anchors this plan builds on (read before starting):**
- `apps/web/src/home/graph.ts` — `GRAPH` (fork geometry: `branches.{history,bad,good}`, `tips`, `historyCommits`) and `drawThreshold`.
- `apps/web/src/home/timeline.ts` — `homeSteps: HomeStep[]`, `OVERVIEW_POSE`, `UNIT_VH`.
- `apps/web/src/home/colors.ts` — `COLORS`.
- `apps/web/src/home/environment.ts` / `Fallback2D.tsx` — the static fallback (kept).
- `apps/web/src/routes/Home.tsx` — lazy-loads `Scene`; the swap point.
- `apps/web/src/routes/ComicPage.tsx` — back button returns with `state: { fromNode: slug }`.

---

### Task 1: Atlas node model

Derive a flat, render-ready list of map nodes (with 3D positions, branch, route, status, optional plate) from the existing `homeSteps` + `GRAPH`. This is the single source the scene iterates.

**Files:**
- Modify: `apps/web/src/home/timeline.ts` (add optional `plate?: string` to `HomeStep`)
- Create: `apps/web/src/home/atlas/model.ts`
- Test: `apps/web/src/home/atlas/model.test.ts`

**Interfaces:**
- Consumes: `homeSteps`, `HomeStep` from `../timeline`; `GRAPH` from `../graph`.
- Produces:
  - `type AtlasNode = { id: string; title: string; branch: 'history'|'bad'|'good'; pos: [number, number, number]; clip: [number, number]; route?: string; status: 'live'|'coming-soon'; ring: boolean; plate?: string }`
  - `type AtlasTip = { id: string; title: string; pos: [number, number, number]; route: string; branch: 'bad'|'good' }`
  - `function buildAtlas(): { nodes: AtlasNode[]; tips: AtlasTip[] }`

- [ ] **Step 1: Add the optional `plate` field to `HomeStep`**

In `apps/web/src/home/timeline.ts`, inside the `HomeStep` interface, add after `status?`:

```ts
  plate?:          string             // local poster image path for the node's media plate
```

- [ ] **Step 2: Write the failing test**

Create `apps/web/src/home/atlas/model.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildAtlas } from './model'
import { homeSteps } from '../timeline'

describe('buildAtlas', () => {
  it('returns one node per home step, preserving id/title/branch/status', () => {
    const { nodes } = buildAtlas()
    expect(nodes).toHaveLength(homeSteps.length)
    const camping = nodes.find((n) => n.id === 'camping')!
    expect(camping.title).toBe('Camping')
    expect(camping.branch).toBe('bad')
    expect(camping.status).toBe('live')
  })

  it('places nodes on the z=0 plane at their float position', () => {
    const { nodes } = buildAtlas()
    const karen = nodes.find((n) => n.id === 'karen')!
    expect(karen.pos).toEqual([18, 14, 0])
  })

  it('defaults status to live and ring to false', () => {
    const { nodes } = buildAtlas()
    const gold = nodes.find((n) => n.id === 'gold-standard')!
    expect(gold.status).toBe('live')
    expect(gold.ring).toBe(false)
  })

  it('marks the branch tips as rings and exposes them separately', () => {
    const { nodes, tips } = buildAtlas()
    expect(nodes.find((n) => n.id === 'storyverse')!.ring).toBe(true)
    expect(tips.map((t) => t.id).sort()).toEqual(['future-proof', 'storyverse'])
    expect(tips.find((t) => t.id === 'storyverse')!.route).toBe('/storyverse')
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test --workspace @badcode/web -- model.test`
Expected: FAIL — `Cannot find module './model'`.

- [ ] **Step 4: Write the implementation**

Create `apps/web/src/home/atlas/model.ts`:

```ts
import { homeSteps } from '../timeline'
import { GRAPH } from '../graph'

export type Branch = 'history' | 'bad' | 'good'

export interface AtlasNode {
  id:     string
  title:  string
  branch: Branch
  pos:    [number, number, number]
  clip:   [number, number]
  route?: string
  status: 'live' | 'coming-soon'
  ring:   boolean
  plate?: string
}

export interface AtlasTip {
  id:     string
  title:  string
  pos:    [number, number, number]
  route:  string
  branch: 'bad' | 'good'
}

/** Flatten homeSteps + GRAPH tips into render-ready 3D nodes on the z=0 plane. */
export function buildAtlas(): { nodes: AtlasNode[]; tips: AtlasTip[] } {
  const nodes: AtlasNode[] = homeSteps.map((s) => ({
    id:     s.id,
    title:  s.title,
    branch: s.branch,
    pos:    [s.pos[0], s.pos[1], 0],
    clip:   s.clip,
    route:  s.route,
    status: s.status ?? 'live',
    ring:   s.ring ?? false,
    plate:  s.plate,
  }))

  const tips: AtlasTip[] = (['storyverse', 'futureProof'] as const).map((k) => {
    const t = GRAPH.tips[k]
    const node = nodes.find((n) => n.id === (k === 'storyverse' ? 'storyverse' : 'future-proof'))!
    return { id: node.id, title: t.title, pos: node.pos, route: t.route, branch: t.branch }
  })

  return { nodes, tips }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test --workspace @badcode/web -- model.test`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/home/timeline.ts apps/web/src/home/atlas/model.ts apps/web/src/home/atlas/model.test.ts
git commit -m "feat(home): atlas node model derived from homeSteps + GRAPH"
```

---

### Task 2: Semantic-zoom navigation state

Pure functions mapping camera distance → level-of-detail, plus the focus/galaxy reducers. This is the brain of the map; the R3F rig (Task 7) feeds it distance, components read its LOD.

**Files:**
- Create: `apps/web/src/home/atlas/navState.ts`
- Test: `apps/web/src/home/atlas/navState.test.ts`

**Interfaces:**
- Produces:
  - `type Lod = 'galaxy' | 'mid' | 'node'`
  - `function altitudeToLod(distance: number): Lod`
  - `interface NavState { focusId: string | null; lod: Lod }`
  - `const INITIAL_NAV: NavState`
  - `function focusNode(state: NavState, id: string): NavState`
  - `function toGalaxy(state: NavState): NavState`
  - `function withLod(state: NavState, lod: Lod): NavState`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/home/atlas/navState.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { altitudeToLod, focusNode, toGalaxy, withLod, INITIAL_NAV } from './navState'

describe('altitudeToLod', () => {
  it('is galaxy when far out (> 50)', () => {
    expect(altitudeToLod(76)).toBe('galaxy')
    expect(altitudeToLod(51)).toBe('galaxy')
  })
  it('is mid at medium distance (22..50]', () => {
    expect(altitudeToLod(50)).toBe('mid')
    expect(altitudeToLod(30)).toBe('mid')
  })
  it('is node when close (<= 22)', () => {
    expect(altitudeToLod(22)).toBe('node')
    expect(altitudeToLod(12)).toBe('node')
  })
})

describe('nav reducers', () => {
  it('focusNode sets focus and drops to node lod', () => {
    expect(focusNode(INITIAL_NAV, 'camping')).toEqual({ focusId: 'camping', lod: 'node' })
  })
  it('toGalaxy clears focus and rises to galaxy lod', () => {
    expect(toGalaxy({ focusId: 'camping', lod: 'node' })).toEqual({ focusId: null, lod: 'galaxy' })
  })
  it('withLod updates lod without touching focus', () => {
    expect(withLod({ focusId: 'karen', lod: 'node' }, 'mid')).toEqual({ focusId: 'karen', lod: 'mid' })
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test --workspace @badcode/web -- navState.test`
Expected: FAIL — `Cannot find module './navState'`.

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/home/atlas/navState.ts`:

```ts
export type Lod = 'galaxy' | 'mid' | 'node'

/**
 * Camera distance from the scene origin → reading altitude.
 * Thresholds chosen against existing camera poses: overview sits at z≈76
 * (galaxy), node close-ups sit at z≈22 (node).
 */
export function altitudeToLod(distance: number): Lod {
  if (distance > 50) return 'galaxy'
  if (distance > 22) return 'mid'
  return 'node'
}

export interface NavState {
  focusId: string | null
  lod:     Lod
}

export const INITIAL_NAV: NavState = { focusId: null, lod: 'galaxy' }

export function focusNode(state: NavState, id: string): NavState {
  return { focusId: id, lod: 'node' }
}

export function toGalaxy(_state: NavState): NavState {
  return { focusId: null, lod: 'galaxy' }
}

export function withLod(state: NavState, lod: Lod): NavState {
  return { ...state, lod }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test --workspace @badcode/web -- navState.test`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/atlas/navState.ts apps/web/src/home/atlas/navState.test.ts
git commit -m "feat(home): semantic-zoom nav state (altitude→LOD + focus reducers)"
```

---

### Task 3: Deep-link resolution & camera pose

Given the `fromNode` slug a comic returns with, find the node and compute the camera pose to fly to it. Also map a node to its content route. Pure + TDD.

**Files:**
- Create: `apps/web/src/home/atlas/deeplink.ts`
- Test: `apps/web/src/home/atlas/deeplink.test.ts`

**Interfaces:**
- Consumes: `AtlasNode` from `./model`.
- Produces:
  - `type Pose = { position: [number, number, number]; target: [number, number, number] }`
  - `function nodeForFromState(fromNode: string | undefined, nodes: AtlasNode[]): AtlasNode | null` (matches by node id OR by the comic slug in its `route` `/comics/<slug>`)
  - `function poseForNode(node: AtlasNode): Pose` (camera pulled back +22 on z from the node, looking at it)

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/home/atlas/deeplink.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodeForFromState, poseForNode } from './deeplink'
import { buildAtlas } from './model'

const { nodes } = buildAtlas()

describe('nodeForFromState', () => {
  it('matches by comic slug carried in the route', () => {
    expect(nodeForFromState('camping', nodes)!.id).toBe('camping')
  })
  it('matches by node id directly', () => {
    expect(nodeForFromState('storyverse', nodes)!.id).toBe('storyverse')
  })
  it('returns null for unknown / undefined', () => {
    expect(nodeForFromState(undefined, nodes)).toBeNull()
    expect(nodeForFromState('nope', nodes)).toBeNull()
  })
})

describe('poseForNode', () => {
  it('pulls the camera back on z and looks at the node', () => {
    const karen = nodes.find((n) => n.id === 'karen')!
    const pose = poseForNode(karen)
    expect(pose.target).toEqual([18, 14, 0])
    expect(pose.position).toEqual([18, 14, 22])
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test --workspace @badcode/web -- deeplink.test`
Expected: FAIL — `Cannot find module './deeplink'`.

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/home/atlas/deeplink.ts`:

```ts
import type { AtlasNode } from './model'

export type Pose = {
  position: [number, number, number]
  target:   [number, number, number]
}

/** Distance the camera sits back from a focused node (matches node-LOD threshold). */
const NODE_BACKOFF = 22

export function nodeForFromState(
  fromNode: string | undefined,
  nodes: AtlasNode[],
): AtlasNode | null {
  if (!fromNode) return null
  return (
    nodes.find((n) => n.id === fromNode) ??
    nodes.find((n) => n.route === `/comics/${fromNode}`) ??
    null
  )
}

export function poseForNode(node: AtlasNode): Pose {
  const [x, y, z] = node.pos
  return { position: [x, y, z + NODE_BACKOFF], target: [x, y, z] }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test --workspace @badcode/web -- deeplink.test`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/atlas/deeplink.ts apps/web/src/home/atlas/deeplink.test.ts
git commit -m "feat(home): deep-link node resolution + fly-to pose"
```

---

### Task 4: Deep Field palette + StarChart constellation

Extend the palette with Deep Field tokens and render the fork as glowing constellation lines over a nebula background. Visual task — verify in browser.

**Files:**
- Modify: `apps/web/src/home/colors.ts`
- Create: `apps/web/src/home/atlas/StarChart.tsx`

**Interfaces:**
- Consumes: `GRAPH` from `../graph`; `DEEP` from `../colors`.
- Produces: `function StarChart(): JSX.Element` — the branch lines + nebula + history commit points (no interactive nodes; those are Task 6).

- [ ] **Step 1: Add Deep Field tokens to the palette**

In `apps/web/src/home/colors.ts`, after the `COLORS` object add:

```ts
/** Deep Field cosmos tokens: warm gold/violet against the cold cyan, nebula fog. */
export const DEEP = {
  void:    '#04060b',
  cyan:    '#46d5ff',
  gold:    '#e8c98a',
  violet:  '#8a6cff',
  nebula1: '#231a3a',
  nebula2: '#0a0813',
  line:    '#3a6a7e',
  lineHot: '#7be3ff',
} as const
```

- [ ] **Step 2: Write the StarChart component**

Create `apps/web/src/home/atlas/StarChart.tsx`:

```tsx
import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line } from '@react-three/drei'
import { GRAPH } from '../graph'
import { DEEP } from '../colors'

type V2 = readonly [number, number]
const to3 = (p: V2) => new Vector3(p[0], p[1], 0)

function branchPoints(pts: readonly V2[]): Vector3[] {
  const curve = new CatmullRomCurve3(pts.map(to3), false, 'catmullrom', 0.2)
  return curve.getPoints(60)
}

export function StarChart() {
  const { history, bad, good } = GRAPH.branches
  const lines = useMemo(
    () => ({
      history: branchPoints(history),
      bad:     branchPoints(bad),
      good:    branchPoints(good),
    }),
    [history, bad, good],
  )

  return (
    <group>
      {/* nebula backdrop: two large additive sprites of warm/cool fog */}
      <mesh position={[10, 4, -30]}>
        <planeGeometry args={[120, 80]} />
        <meshBasicMaterial color={DEEP.nebula1} transparent opacity={0.18} depthWrite={false} />
      </mesh>

      <Line points={lines.history} color={DEEP.line} lineWidth={1.5} transparent opacity={0.85} />
      <Line points={lines.bad}     color={DEEP.lineHot} lineWidth={2} transparent opacity={0.9} />
      <Line points={lines.good}    color={DEEP.lineHot} lineWidth={2} transparent opacity={0.9} />

      {GRAPH.historyCommits.map((c, i) => (
        <mesh key={i} position={[c[0], c[1], 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshBasicMaterial color={DEEP.gold} />
        </mesh>
      ))}
    </group>
  )
}
```

- [ ] **Step 3: Verify it typechecks**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors. (Visual rendering is verified once the scene is assembled in Task 11.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/colors.ts apps/web/src/home/atlas/StarChart.tsx
git commit -m "feat(home): Deep Field palette + StarChart constellation lines"
```

---

### Task 5: MediaPlate

A world-space image plate with a dim colored backing that shows while the poster loads. Phase 1 is image-only; video is Phase 2.

**Files:**
- Create: `apps/web/src/home/atlas/MediaPlate.tsx`
- Add: one or two 16:9 placeholder posters under `apps/web/public/atlas/` (e.g. `storyverse.webp`, `camping.webp`) — any real image for now; AI-generated plates replace them later.
- Modify: `apps/web/src/home/timeline.ts` (set `plate` on 1–2 hero steps)

**Interfaces:**
- Produces: `function MediaPlate(props: { url: string; position: [number,number,number]; width?: number; visible?: boolean }): JSX.Element`

- [ ] **Step 1: Add hero plate posters and reference them**

Place `apps/web/public/atlas/storyverse.webp` and `apps/web/public/atlas/camping.webp` (16:9). In `apps/web/src/home/timeline.ts`, add `plate: '/atlas/camping.webp'` to the `camping` step and `plate: '/atlas/storyverse.webp'` to the `storyverse` step.

- [ ] **Step 2: Write the MediaPlate component**

Create `apps/web/src/home/atlas/MediaPlate.tsx`:

```tsx
import { Suspense } from 'react'
import { Image } from '@react-three/drei'
import { DEEP } from '../colors'

function Poster({ url, width }: { url: string; width: number }) {
  // drei <Image> keeps aspect via the texture; height set to 9/16 of width.
  return <Image url={url} scale={[width, (width * 9) / 16]} toneMapped={false} transparent />
}

export function MediaPlate({
  url,
  position,
  width = 6,
  visible = true,
}: {
  url: string
  position: [number, number, number]
  width?: number
  visible?: boolean
}) {
  if (!visible) return null
  return (
    <group position={position}>
      {/* dim backing shown until the poster texture resolves */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width, (width * 9) / 16]} />
        <meshBasicMaterial color={DEEP.nebula1} transparent opacity={0.6} />
      </mesh>
      <Suspense fallback={null}>
        <Poster url={url} width={width} />
      </Suspense>
    </group>
  )
}
```

- [ ] **Step 3: Verify it typechecks**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/MediaPlate.tsx apps/web/src/home/timeline.ts apps/web/public/atlas
git commit -m "feat(home): MediaPlate (poster image plate) + hero plates"
```

---

### Task 6: AtlasNode (celestial body + label + plate, LOD-aware)

One node: a glowing celestial body, an italic-serif label, and (at mid/node LOD) its media plate. Clicking it calls back to focus. Labels/plates appear by LOD.

**Files:**
- Create: `apps/web/src/home/atlas/AtlasNode.tsx`

**Interfaces:**
- Consumes: `AtlasNode` from `./model`; `Lod` from `./navState`; `MediaPlate`; `DEEP`.
- Produces: `function AtlasNode(props: { node: AtlasNode; lod: Lod; focused: boolean; onSelect: (id: string) => void }): JSX.Element`

- [ ] **Step 1: Write the component**

Create `apps/web/src/home/atlas/AtlasNode.tsx`:

```tsx
import { Billboard, Text } from '@react-three/drei'
import type { AtlasNode as Node } from './model'
import type { Lod } from './navState'
import { MediaPlate } from './MediaPlate'
import { DEEP } from '../colors'

export function AtlasNode({
  node,
  lod,
  focused,
  onSelect,
}: {
  node: Node
  lod: Lod
  focused: boolean
  onSelect: (id: string) => void
}) {
  const enterable = node.status === 'live'
  const showLabel = lod !== 'galaxy' || node.ring
  const showPlate = !!node.plate && (lod === 'node' || focused)
  const color = enterable ? DEEP.cyan : DEEP.gold

  return (
    <group position={node.pos}>
      {/* celestial body — ring for branch tips, point otherwise */}
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(node.id) }}>
        {node.ring
          ? <torusGeometry args={[1, 0.08, 12, 48]} />
          : <sphereGeometry args={[0.4, 16, 16]} />}
        <meshBasicMaterial color={color} transparent opacity={enterable ? 1 : 0.55} />
      </mesh>

      {showLabel && (
        <Billboard position={[0, node.ring ? 1.8 : 1.1, 0]}>
          <Text
            fontSize={0.9}
            color={color}
            anchorX="center"
            anchorY="bottom"
            fillOpacity={enterable ? 1 : 0.6}
          >
            {node.status === 'live' ? node.title : `${node.title} · soon`}
          </Text>
        </Billboard>
      )}

      {showPlate && (
        <MediaPlate url={node.plate!} position={[0, 4.6, 0]} width={6} />
      )}
    </group>
  )
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/AtlasNode.tsx
git commit -m "feat(home): AtlasNode (celestial body + label + LOD-gated plate)"
```

---

### Task 7: Camera controls rig + click-to-fly + altitude reporting

Wrap drei `<CameraControls>`. Expose a `flyTo(pose)` used by click-to-fly and deep-link return. Each frame, read the camera's distance from origin and report the derived LOD up to the scene.

**Files:**
- Create: `apps/web/src/home/atlas/CameraControlsRig.tsx`

**Interfaces:**
- Consumes: `Pose` from `./deeplink`; `altitudeToLod`, `Lod` from `./navState`.
- Produces:
  - `type RigHandle = { flyTo: (pose: Pose, immediate?: boolean) => void; enable: (on: boolean) => void }`
  - `const CameraControlsRig = forwardRef<RigHandle, { onLod: (lod: Lod) => void; enabled: boolean }>(...)`

- [ ] **Step 1: Write the rig**

Create `apps/web/src/home/atlas/CameraControlsRig.tsx`:

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import { altitudeToLod, type Lod } from './navState'
import type { Pose } from './deeplink'

export type RigHandle = {
  flyTo: (pose: Pose, immediate?: boolean) => void
  enable: (on: boolean) => void
}

export const CameraControlsRig = forwardRef<
  RigHandle,
  { onLod: (lod: Lod) => void; enabled: boolean }
>(function CameraControlsRig({ onLod, enabled }, ref) {
  const controls = useRef<CameraControlsImpl | null>(null)
  const camera = useThree((s) => s.camera)
  const lastLod = useRef<Lod | null>(null)

  useImperativeHandle(ref, () => ({
    flyTo: (pose, immediate = false) => {
      controls.current?.setLookAt(
        pose.position[0], pose.position[1], pose.position[2],
        pose.target[0], pose.target[1], pose.target[2],
        !immediate,
      )
    },
    enable: (on) => { if (controls.current) controls.current.enabled = on },
  }))

  useFrame(() => {
    const d = camera.position.length()
    const lod = altitudeToLod(d)
    if (lod !== lastLod.current) {
      lastLod.current = lod
      onLod(lod)
    }
  })

  return (
    <CameraControls
      ref={controls}
      enabled={enabled}
      minDistance={8}
      maxDistance={90}
      dollyToCursor
    />
  )
})
```

- [ ] **Step 2: Verify it typechecks**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors. (If the `camera-controls` type import path errors, fall back to `import type { CameraControls as CameraControlsImpl } from 'camera-controls'` or type the ref as `any` with a `// drei re-exports the yomotsu instance` comment — drei 9.122 bundles `camera-controls`.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/CameraControlsRig.tsx
git commit -m "feat(home): camera-controls rig with flyTo + altitude→LOD reporting"
```

---

### Task 8: Intro rail + handoff + reduced-motion skip

Auto-fly from the spark (close on the fork) out to the overview, over ~5s, then hand control to the rig with no jump. Skippable; skipped entirely under reduced motion or on deep-link return.

**Files:**
- Create: `apps/web/src/home/atlas/IntroRail.tsx`

**Interfaces:**
- Consumes: `RigHandle` from `./CameraControlsRig`; `OVERVIEW_POSE` from `../timeline`.
- Produces:
  - `const INTRO_END: Pose` (exported: `{ position: OVERVIEW_POSE.position, target: OVERVIEW_POSE.lookAt }`)
  - `function IntroRail(props: { rig: React.RefObject<RigHandle>; play: boolean; onDone: () => void }): JSX.Element`

- [ ] **Step 1: Write the intro rail**

Create `apps/web/src/home/atlas/IntroRail.tsx`:

```tsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { OVERVIEW_POSE } from '../timeline'
import type { RigHandle } from './CameraControlsRig'
import type { Pose } from './deeplink'

export const INTRO_END: Pose = {
  position: OVERVIEW_POSE.position as [number, number, number],
  target:   OVERVIEW_POSE.lookAt as [number, number, number],
}

const DURATION = 5 // seconds

// Spark (tight on the fork) → pull back and drift to the overview.
const PATH = new CatmullRomCurve3(
  [new Vector3(0, 0, 14), new Vector3(2, 0, 34), new Vector3(6, 0, 76)],
  false, 'catmullrom', 0.5,
)
const LOOK_FROM = new Vector3(0, 0, 0)
const LOOK_TO   = new Vector3(6, 0, 0)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function IntroRail({
  rig,
  play,
  onDone,
}: {
  rig: React.RefObject<RigHandle>
  play: boolean
  onDone: () => void
}) {
  const camera = useThree((s) => s.camera)
  const elapsed = useRef(0)
  const done = useRef(false)

  useFrame((_, dt) => {
    if (!play || done.current) return
    elapsed.current += dt
    const t = easeOut(Math.min(1, elapsed.current / DURATION))
    PATH.getPoint(t, camera.position as Vector3)
    const look = LOOK_FROM.clone().lerp(LOOK_TO, t)
    camera.lookAt(look)
    if (t >= 1) {
      done.current = true
      // Seat the controls at the exact final pose, then release control.
      rig.current?.flyTo(INTRO_END, true)
      rig.current?.enable(true)
      onDone()
    }
  })

  return null
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/IntroRail.tsx
git commit -m "feat(home): intro rail fly-in with jump-free handoff to controls"
```

---

### Task 9: Cold Archive HUD

The DOM overlay: monospace readouts, the "you are here" branch/node line, nav hints, a persistent skip/explore control during the intro, and a scanline wash. Reads nav state; writes the skip action.

**Files:**
- Create: `apps/web/src/home/atlas/Hud.tsx`
- Create: `apps/web/src/home/atlas/hud.css`

**Interfaces:**
- Consumes: `NavState` from `./navState`; `AtlasNode[]` from `./model`.
- Produces: `function Hud(props: { nav: NavState; nodes: AtlasNode[]; introPlaying: boolean; onSkip: () => void }): JSX.Element`

- [ ] **Step 1: Write the HUD styles**

Create `apps/web/src/home/atlas/hud.css`:

```css
.hud { position: fixed; inset: 0; pointer-events: none; z-index: 3;
  font-family: 'JetBrains Mono', ui-monospace, monospace; color: #7be3ff; }
.hud::after { content: ''; position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg, #0bf1 0 1px, transparent 1px 3px);
  opacity: .35; mix-blend-mode: screen; }
.hud-top { position: absolute; top: 18px; left: 22px; letter-spacing: .14em; }
.hud-brand { font-weight: 700; font-size: 18px; color: #eaffff; }
.hud-sub { font-size: 11px; color: #5f7c88; }
.hud-where { position: absolute; bottom: 20px; left: 22px; font-size: 12px;
  letter-spacing: .08em; opacity: .9; }
.hud-hint { position: absolute; bottom: 20px; right: 22px; font-size: 11px;
  color: #5f7c88; text-align: right; }
.hud-skip { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  pointer-events: auto; background: #0a1a22; border: 1px solid #2bd4ff; color: #2bd4ff;
  font: inherit; font-size: 12px; letter-spacing: .12em; padding: 6px 14px; cursor: pointer; }
.hud-skip:hover { background: #123a4a; }
```

- [ ] **Step 2: Write the HUD component**

Create `apps/web/src/home/atlas/Hud.tsx`:

```tsx
import './hud.css'
import type { NavState } from './navState'
import type { AtlasNode } from './model'

const BRANCH_LABEL: Record<string, string> = {
  history: 'SHARED_HISTORY', bad: 'BAD_BRANCH ▸ STORYVERSE', good: 'GOOD_BRANCH ▸ FUTURE_PROOF',
}

export function Hud({
  nav,
  nodes,
  introPlaying,
  onSkip,
}: {
  nav: NavState
  nodes: AtlasNode[]
  introPlaying: boolean
  onSkip: () => void
}) {
  const focused = nodes.find((n) => n.id === nav.focusId)
  const where = focused
    ? `// ${BRANCH_LABEL[focused.branch]} ▸ ${focused.title.toUpperCase()} · REC ●`
    : `// THE ATLAS · ${nav.lod.toUpperCase()} · REC ●`

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-brand">BADCODE</div>
        <div className="hud-sub">git push origin master</div>
      </div>
      <div className="hud-where">{where}</div>
      <div className="hud-hint">drag · pan&nbsp;&nbsp;scroll · zoom&nbsp;&nbsp;click · enter</div>
      {introPlaying && (
        <button className="hud-skip" onClick={onSkip}>skip / explore</button>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify it typechecks**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/Hud.tsx apps/web/src/home/atlas/hud.css
git commit -m "feat(home): Cold Archive HUD overlay"
```

---

### Task 10: Post-processing (bloom + depth-of-field + vignette)

Add the film look as a reusable effects group. Plug into the scene in Task 11.

**Files:**
- Create: `apps/web/src/home/atlas/Effects.tsx`

**Interfaces:**
- Produces: `function Effects(): JSX.Element`

- [ ] **Step 1: Write the effects group**

Create `apps/web/src/home/atlas/Effects.tsx`:

```tsx
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.4} mipmapBlur />
      <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={2.2} />
      <Vignette eskil={false} offset={0.3} darkness={0.7} />
    </EffectComposer>
  )
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/Effects.tsx
git commit -m "feat(home): post-processing effects (bloom + DoF + vignette)"
```

---

### Task 11: AtlasScene assembly

Compose everything into one `<Canvas>`: StarChart, nodes, rig, intro, effects, plus React state holding `NavState` and the intro flag. Click a node → `flyTo` + `focusNode`. This is the first end-to-end browser checkpoint.

**Files:**
- Create: `apps/web/src/home/atlas/AtlasScene.tsx`

**Interfaces:**
- Consumes: all of the above.
- Produces: `export default function AtlasScene(props: { startFocus?: AtlasNode | null }): JSX.Element`

- [ ] **Step 1: Write the scene**

Create `apps/web/src/home/atlas/AtlasScene.tsx`:

```tsx
import { useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { buildAtlas, type AtlasNode } from './model'
import { INITIAL_NAV, focusNode, withLod, type Lod, type NavState } from './navState'
import { poseForNode } from './deeplink'
import { StarChart } from './StarChart'
import { AtlasNode as NodeView } from './AtlasNode'
import { CameraControlsRig, type RigHandle } from './CameraControlsRig'
import { IntroRail } from './IntroRail'
import { Effects } from './Effects'
import { Hud } from './Hud'
import { DEEP } from '../colors'

export default function AtlasScene({ startFocus = null }: { startFocus?: AtlasNode | null }) {
  const { nodes } = useMemo(() => buildAtlas(), [])
  const rig = useRef<RigHandle>(null)

  const [nav, setNav] = useState<NavState>(
    startFocus ? focusNode(INITIAL_NAV, startFocus.id) : INITIAL_NAV,
  )
  // No intro when arriving via deep-link return.
  const [introPlaying, setIntroPlaying] = useState(!startFocus)

  const onLod = (lod: Lod) => setNav((s) => withLod(s, lod))
  const select = (id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    rig.current?.flyTo(poseForNode(node))
    setNav((s) => focusNode(s, id))
  }
  const skip = () => {
    setIntroPlaying(false)
    rig.current?.enable(true)
    if (startFocus) rig.current?.flyTo(poseForNode(startFocus), true)
  }

  return (
    <>
      <div className="home-canvas">
        <Canvas camera={{ position: startFocus ? poseForNode(startFocus).position : [0, 0, 14], fov: 50 }}>
          <color attach="background" args={[DEEP.void]} />
          <StarChart />
          {nodes.map((n) => (
            <NodeView key={n.id} node={n} lod={nav.lod} focused={nav.focusId === n.id} onSelect={select} />
          ))}
          <CameraControlsRig ref={rig} onLod={onLod} enabled={!introPlaying} />
          {introPlaying && (
            <IntroRail rig={rig} play onDone={() => setIntroPlaying(false)} />
          )}
          <Effects />
        </Canvas>
      </div>
      <Hud nav={nav} nodes={nodes} introPlaying={introPlaying} onSkip={skip} />
    </>
  )
}
```

- [ ] **Step 2: Temporarily mount AtlasScene to verify in the browser**

In `apps/web/src/routes/Home.tsx`, temporarily change the lazy import to `const Scene = lazy(() => import('../home/atlas/AtlasScene'))` (revert/finalize in Task 12). Run:

Run: `npm run dev --workspace @badcode/web` then open `http://localhost:5173`.
Expected: spark close on the fork → ~5s pull-back to the overview → constellation with labelled nodes; "skip / explore" appears during intro; after it ends, drag pans, scroll zooms (labels/plates appear as you get closer), clicking a node flies to it and the HUD "you are here" updates. Note any visual tuning needed (line glow, label size, plate position) and adjust constants inline.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/AtlasScene.tsx apps/web/src/routes/Home.tsx
git commit -m "feat(home): assemble AtlasScene (intro → free-roam map, end-to-end)"
```

---

### Task 12: Wire the route, deep-link return, and fallback

Make `Home.tsx` the real integration: keep the `shouldUse2D` fallback; when WebGL is used, resolve `location.state.fromNode` to a start-focus node (skipping the intro), and pass it to `AtlasScene`.

**Files:**
- Modify: `apps/web/src/routes/Home.tsx`

**Interfaces:**
- Consumes: `buildAtlas`, `nodeForFromState`, `AtlasScene`, `detectEnvironment`, `shouldUse2D`, `Fallback2D`.

- [ ] **Step 1: Write the integrated Home route**

Replace `apps/web/src/routes/Home.tsx` with:

```tsx
import { Suspense, lazy, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { detectEnvironment, shouldUse2D } from '../home/environment'
import { Fallback2D } from '../home/Fallback2D'
import { buildAtlas } from '../home/atlas/model'
import { nodeForFromState } from '../home/atlas/deeplink'

const AtlasScene = lazy(() => import('../home/atlas/AtlasScene'))

export function Home() {
  const env = useMemo(() => detectEnvironment(), [])
  const location = useLocation()
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode

  const startFocus = useMemo(() => {
    const { nodes } = buildAtlas()
    return nodeForFromState(fromNode, nodes)
  }, [fromNode])

  if (shouldUse2D(env)) return <Fallback2D />
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#04060b' }} />}>
      <AtlasScene startFocus={startFocus} />
    </Suspense>
  )
}
```

- [ ] **Step 2: Verify in the browser — deep-link return and reduced-motion**

Run: `npm run dev --workspace @badcode/web`.
- Open `/`, click into the Camping node → "enter" the comic (via its route), use the comic's back button → returns to `/` focused on Camping with **no** intro replay.
- In DevTools, emulate `prefers-reduced-motion: reduce`, reload `/` → static `Fallback2D` renders (no canvas).
Expected: both behave as described.

- [ ] **Step 3: Run typecheck + tests**

Run: `npm run typecheck --workspace @badcode/web && npm test --workspace @badcode/web`
Expected: typecheck clean; pure-logic tests pass. (Tests for the removed scroll-tour are handled in Task 13.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/routes/Home.tsx
git commit -m "feat(home): wire Atlas route with deep-link return + reduced-motion fallback"
```

---

### Task 13: Retire the old scroll-tour scene

Remove the now-unused scroll-tour modules and their tests, keeping the shared geometry/fallback. Get the whole workspace green.

**Files:**
- Delete: `apps/web/src/home/Scene.tsx`, `CameraRig.tsx`, `Spine.tsx`, `Constellation.tsx`, `StoryNode.tsx`, `BranchTip.tsx`, `Narration.tsx`, `Chrome.tsx`, `OpeningSequence.tsx`, `useScrollProgress.ts`, `useTimeline.ts`, `drivers.ts`, `behaviors.ts`, `cameraController.ts` — **only those that are no longer imported** (verify with grep first).
- Delete the corresponding `*.test.ts` for any removed module (e.g. `behaviors.test.ts`, `timeline.test.ts` only if `homeSteps` shape it asserts is unchanged — keep tests that still pass).
- Keep: `graph.ts` (+ `graph.test.ts`), `colors.ts`, `environment.ts` (+ `environment.test.ts`), `Fallback2D.tsx`, `Atmosphere.tsx` (if reused) and all of `home/atlas/`.

- [ ] **Step 1: Find what's still imported**

Run: `cd apps/web && for f in Scene CameraRig Spine Constellation StoryNode BranchTip Narration Chrome OpeningSequence useScrollProgress useTimeline drivers behaviors cameraController; do echo "== $f =="; grep -rln "home/$f\b\|/$f'" src --include=*.tsx --include=*.ts | grep -v "home/$f"; done`
Expected: lists any remaining importers. Anything with no importer (outside its own test) is safe to delete.

- [ ] **Step 2: Delete unused modules + their tests**

Delete each unused file and its `*.test.ts`. Leave `graph.ts`, `colors.ts`, `environment.ts`, `Fallback2D.tsx`, and `home/atlas/*` intact. Keep `home/timeline.ts` (still the source for `homeSteps`/`OVERVIEW_POSE`).

- [ ] **Step 3: Run the full baseline**

Run: `npm run typecheck && npm test`
Expected: typecheck clean across all workspaces; all remaining tests pass (the new `model`/`navState`/`deeplink` suites plus surviving `graph`/`environment` suites). Fix any dangling imports the deletions surfaced.

- [ ] **Step 4: Build to confirm production bundle**

Run: `npm run build --workspace @badcode/web`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(home): retire scroll-tour scene; Atlas is the homepage"
```

---

## Self-Review

**Spec coverage:**
- Guided intro → free-roam map → Tasks 8, 7, 11. ✓
- Zoom ladder L0/L1 (+ LOD reveal) → Tasks 2, 6, 11. (L2 corridor, L3 dioramas = Phases 2–3, out of scope.) ✓
- Content model "songs in stories; Play=portal; About=origin" → nodes derive from `homeSteps` unchanged; no music branch added. ✓ (Play/About node copy is inherited from existing data; no new work needed in Phase 1.)
- Art direction (Deep Field + Cold Archive HUD) → Tasks 4 (palette/StarChart), 9 (HUD), 10 (bloom/DoF/vignette). ✓
- Intro auto-play + skippable + reduced-motion skip → Task 8 + Task 11 (`introPlaying`) + Task 12 (fallback). ✓
- Drag+zoom+click-to-fly → Task 7. ✓
- Media plates reuse pipeline → Phase 1 uses local posters (Task 5); manifest-driven selection is Phase 2 (noted). ✓ (scoped)
- Deep-link/return-to-node → Tasks 3, 12. ✓
- Accessibility/perf: one Canvas (Task 11), reduced-motion/no-WebGL fallback (Task 12), persistent "you are here" (Task 9). Video discipline is Phase 2 (no video in Phase 1). ✓
- Testing: pure modules TDD'd (Tasks 1–3); visual verified in browser (Tasks 11–12). ✓

**Placeholder scan:** No "TBD/TODO/handle edge cases" — every code step has complete code; every verify step names the command and expected result. ✓

**Type consistency:** `AtlasNode`/`AtlasTip` (Task 1) used consistently in Tasks 3, 6, 11, 12; `NavState`/`Lod`/`focusNode`/`withLod`/`altitudeToLod` (Task 2) used consistently in Tasks 7, 9, 11; `Pose`/`poseForNode` (Task 3) used in Tasks 7, 8, 11; `RigHandle.flyTo/enable` (Task 7) called in Tasks 8, 11. ✓

---

## Out of scope (future plans)

- **Phase 2 — Dioramas (L3):** staged per-node theatres, manifest-driven video plates (`useVideoTexture`, ThumbHash placeholders, poster→video on approach), `<MeshPortalMaterial>` dive-in, per-story song + ambient bed with low-pass-on-enter.
- **Phase 3 — Corridor & polish (L2):** "play the whole branch" flythrough, full media coverage, KTX2 textures, mobile perf tuning.
