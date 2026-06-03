# Homepage Tuning — Iteration 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the seven feedback fixes to the live 3D homepage — the retrace tour through both branches, a staged self-assembling opening, a smoother camera handoff, play/stop, reliable node clicks, looser node spacing, and deterministic editor resolution.

**Architecture:** Pure-data and tooling changes are unit-tested (vitest, node env); the motion/interaction changes (opening draw, camera, play/stop, hit targets) have no pure surface and are verified in the browser. Everything stays inside `apps/web` + `tsconfig.base.json`; `@badcode/comic`, `@badcode/comic-meta`, and `CampingComic` are untouched.

**Tech Stack:** Vite + React 18 + TS, react-three-fiber, drei `<Line>`, three `CatmullRomCurve3` (centripetal), GSAP, vitest.

**Spec:** [`docs/superpowers/specs/2026-06-03-homepage-tuning.md`](../specs/2026-06-03-homepage-tuning.md)

---

## File Structure

| File | Change | Task |
| --- | --- | --- |
| `tsconfig.base.json` | add `baseUrl` + `@badcode/*` paths | 1 |
| `apps/web/src/home/graph.ts` | retrace `tour`, recomputed node/waypoint `t`, node spacing | 2 |
| `apps/web/src/home/graph.test.ts` | retrace + `t` assertions | 2 |
| `apps/web/src/home/path.ts` | centripetal spline | 3 |
| `apps/web/src/home/path.test.ts` | endpoint + no-overshoot bounds | 3 |
| `apps/web/src/home/Spine.tsx` | staged self-draw of all three lines + commits | 4 |
| `apps/web/src/home/OpeningSequence.tsx` | draw duration/easing | 4 |
| `apps/web/src/home/CameraRig.tsx` | smoothed look-at + unified handoff | 5 |
| `apps/web/src/home/Chrome.tsx` | play/stop toggle + future-proof button | 6 |
| `apps/web/src/home/drivers.ts` | `autoplay` duration default | 6 |
| `apps/web/src/home/StoryNode.tsx` | invisible hit-sphere | 7 |

---

## Task 1: Deterministic editor resolution (`@badcode/comic-meta`)

**Files:**
- Modify: `tsconfig.base.json`

- [ ] **Step 1: Add baseUrl + paths**

Edit `tsconfig.base.json` — add these two keys inside `compilerOptions` (after `"verbatimModuleSyntax": true`, add a comma to that line):

```jsonc
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": {
      "@badcode/*": ["packages/*/src"]
    }
```

- [ ] **Step 2: Verify the whole workspace still typechecks**

Run: `npm run typecheck`
Expected: PASS for every workspace (exit 0). The `paths` mapping resolves `@badcode/comic`, `@badcode/comic-meta`, `@badcode/cli` from source; bundler resolution is unchanged for the runtime build.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.base.json
git commit -m "fix(tooling): map @badcode/* to package src for editor resolution"
```

---

## Task 2: Retrace tour, recomputed `t`, looser node spacing (`graph.ts`)

The tour now runs out the bad branch to Storyverse, **back through the fork**, and out the good branch to Future Proof. Node and waypoint `t` are seeded from the arc-length of that path (refined later in the browser). Node `pos.y` is staggered so labels stop colliding.

**Files:**
- Modify: `apps/web/src/home/graph.ts`
- Test: `apps/web/src/home/graph.test.ts`

- [ ] **Step 1: Update the failing tests first**

Replace the two tests in `graph.test.ts` that assume the old tour (the `'the tour spline begins at history start and ends at the bad (storyverse) tip'` test) and add retrace/`t` assertions. Replace that single `it(...)` block with this block:

```ts
  it('the tour begins at history start and ends at the good (future proof) tip', () => {
    const first = GRAPH.tour[0]
    const last = GRAPH.tour[GRAPH.tour.length - 1]
    expect(first).toEqual(GRAPH.branches.history[0])
    expect(last).toEqual(GRAPH.branches.good[GRAPH.branches.good.length - 1])
  })

  it('the tour retraces through the fork (origin appears twice)', () => {
    const atFork = GRAPH.tour.filter(([x, y]) => x === 0 && y === 0)
    expect(atFork.length).toBe(2)
  })

  it('story node t increases monotonically in authored order', () => {
    let prev = -Infinity
    for (const n of storyNodes) {
      expect(n.t).toBeGreaterThan(prev)
      prev = n.t
    }
  })

  it('the good-branch node has a real (non-zero) tour position', () => {
    const lens = storyNodes.find((n) => n.id === 'optimistic-lens') as StoryNode
    expect(lens.t).toBeGreaterThan(0.5)
  })

  it('futureProof waypoint is the end of the tour', () => {
    expect(typeof waypoints.futureProof).toBe('number')
    expect(waypoints.futureProof).toBeCloseTo(1)
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/web && npx vitest run src/home/graph.test.ts`
Expected: FAIL — the old tour ends at the bad tip, the fork appears once, `optimistic-lens.t` is `0`, and `waypoints.futureProof` is the string `'pose:good-tip'`.

- [ ] **Step 3: Rewrite the tour, node `t`/`pos`, and waypoints**

In `graph.ts`, replace the `tour` definition (currently `const tour: Vec2[] = [...history, BAD_ELBOW, [18, 6], BAD_TIP]`) with:

```ts
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
```

Replace the entire `storyNodes` array with the re-spaced, re-`t`'d version (clip points unchanged; `pos.y` staggered; `t` seeded from arc length along the new path):

```ts
export const storyNodes: StoryNode[] = [
  {
    id: 'camping',
    title: 'Camping',
    branch: 'bad',
    clip: [10, 6],
    pos: [10, 10],
    t: 0.33,
    route: '/comics/camping',
    status: 'live',
  },
  {
    id: 'karen',
    title: 'Karen Will Lead the Revolution',
    branch: 'bad',
    clip: [18, 6],
    pos: [18, 14],
    t: 0.4,
    route: '/comics/karen',
    status: 'coming-soon',
  },
  {
    id: 'emperors-coin',
    title: "Emperor's New Coin",
    branch: 'bad',
    clip: [25, 6],
    pos: [25, 10.5],
    t: 0.45,
    route: '/comics/emperors-coin',
    status: 'coming-soon',
  },
  {
    id: 'optimistic-lens',
    title: 'An Optimistic Lens',
    branch: 'good',
    clip: [18, -6],
    pos: [18, -11],
    t: 0.91,
    route: '/comics/optimistic-lens',
    status: 'coming-soon',
  },
]
```

Replace the `waypoints` block with:

```ts
/** Named camera waypoints as a `t` along the retrace tour. */
export const waypoints = {
  start: 0,
  fork: 0.235, //       first divergence — frames the split ahead
  storyverse: 0.49, //  bad tip, ~midpoint of the out-and-back tour
  futureProof: 1, //    good tip, end of the tour
} as const
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/web && npx vitest run src/home/graph.test.ts`
Expected: PASS (all assertions green).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/graph.ts apps/web/src/home/graph.test.ts
git commit -m "feat(home): retrace tour through both branches; recompute node t + spacing"
```

---

## Task 3: Centripetal spline (no overshoot on the retrace) (`path.ts`)

A tension-0 Catmull-Rom cusps and overshoots on the sharp Storyverse turnaround. Centripetal parameterisation stays inside the control points.

**Files:**
- Modify: `apps/web/src/home/path.ts`
- Test: `apps/web/src/home/path.test.ts`

- [ ] **Step 1: Update the tests first**

In `path.test.ts`, replace the `'x increases monotonically along the tour'` test (it is no longer true — the rewind decreases x) with a no-overshoot bounds test, and update the `pointAtT(1)` test name to reflect the good tip. Replace those two `it(...)` blocks with:

```ts
  it('pointAtT(1) is the last tour point (future proof tip)', () => {
    const p = pointAtT(1)
    const last = GRAPH.tour[GRAPH.tour.length - 1]
    expect(p.x).toBeCloseTo(last[0])
    expect(p.y).toBeCloseTo(last[1])
  })

  it('never overshoots the geometry bounds (no cusp/loop on the retrace)', () => {
    for (let i = 0; i <= 100; i++) {
      const p = pointAtT(i / 100)
      expect(Math.abs(p.x)).toBeLessThanOrEqual(31)
      expect(Math.abs(p.y)).toBeLessThanOrEqual(7)
    }
  })
```

- [ ] **Step 2: Run tests to verify the bounds test fails**

Run: `cd apps/web && npx vitest run src/home/path.test.ts`
Expected: FAIL — tension-0 overshoots `|x| ≤ 31` / `|y| ≤ 7` at the Storyverse turnaround.

- [ ] **Step 3: Switch the curve to centripetal**

In `path.ts`, replace the `tourCurve` definition with:

```ts
/** The camera tour as a centripetal Catmull-Rom — stays inside its control
 * points so the Storyverse turnaround and the fork pass-through don't cusp. */
export const tourCurve = new CatmullRomCurve3(
  GRAPH.tour.map(([x, y]) => new Vector3(x, y, 0)),
  false,
  'centripetal',
)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/web && npx vitest run src/home/path.test.ts`
Expected: PASS — sampled points stay within bounds; endpoints match.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/path.ts apps/web/src/home/path.test.ts
git commit -m "fix(home): centripetal tour spline to avoid retrace overshoot"
```

---

## Task 4: Staged self-assembling opening (no snap) (`Spine.tsx`, `OpeningSequence.tsx`)

One `drawProgress 0→1` draws history `[0,0.40]`, the bad branch `[0.40,0.72]`, then the good branch `[0.72,1.0]`. History commits appear as the draw front passes their `x`. No `branchesVisible` pop. This is a motion change — verified in the browser, not unit-tested.

**Files:**
- Modify: `apps/web/src/home/Spine.tsx`
- Modify: `apps/web/src/home/OpeningSequence.tsx`

- [ ] **Step 1: Rewrite `Spine.tsx`**

Replace the entire file with:

```tsx
import { useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GRAPH } from './graph'
import { COLORS } from './colors'
import { useCameraController } from './cameraController'

const to3 = (ps: readonly (readonly [number, number])[]): [number, number, number][] =>
  ps.map(([x, y]) => [x, y, 0])

/** Truncate a polyline at local progress [0,1], with an interpolated head. */
function drawnSlice(
  pts: [number, number, number][],
  progress: number,
): [number, number, number][] {
  if (progress >= 1) return pts
  if (progress <= 0) return [pts[0], pts[0]]
  const segs = pts.length - 1
  const head = progress * segs
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

// Global drawProgress → per-branch local progress (staged: history, then bad, then good).
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const localHistory = (p: number) => clamp01(p / 0.4)
const localBad = (p: number) => clamp01((p - 0.4) / 0.32)
const localGood = (p: number) => clamp01((p - 0.72) / 0.28)

export function Spine() {
  const { branches, historyCommits } = GRAPH
  const ctrl = useCameraController()
  // drei <Line> forwards a three-stdlib Line2; typed `any` to avoid a brittle deep import.
  // We only call geometry.setPositions(number[]) on it.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const historyRef = useRef<any>(null)
  const badRef = useRef<any>(null)
  const goodRef = useRef<any>(null)
  const commitRefs = useRef<any[]>([])
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const last = useRef(-1)

  const history3 = to3(branches.history)
  const bad3 = to3(branches.bad)
  const good3 = to3(branches.good)

  // drawProgress is mutated outside React (gsap), so drive the geometry from useFrame.
  useFrame(() => {
    const p = ctrl.drawProgress
    if (p === last.current) return
    last.current = p
    historyRef.current?.geometry.setPositions(drawnSlice(history3, localHistory(p)).flat())
    badRef.current?.geometry.setPositions(drawnSlice(bad3, localBad(p)).flat())
    goodRef.current?.geometry.setPositions(drawnSlice(good3, localGood(p)).flat())
    commitRefs.current.forEach((m, i) => {
      if (!m) return
      const x = historyCommits[i][0]
      const appearAt = ((x + 30) / 30) * 0.4 // history spans x −30..0 over draw [0,0.40]
      m.visible = p >= appearAt
    })
  })

  return (
    <group>
      <Line ref={historyRef} points={history3} color={COLORS.white} lineWidth={3} />
      <Line ref={badRef} points={bad3} color="#dfe7ec" lineWidth={3} />
      <Line ref={goodRef} points={good3} color="#dfe7ec" lineWidth={3} />
      {historyCommits.map(([x, y], i) => (
        <mesh
          key={i}
          position={[x, y, 0]}
          visible={false}
          ref={(el) => {
            commitRefs.current[i] = el
          }}
        >
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={COLORS.grey} />
        </mesh>
      ))}
    </group>
  )
}
```

- [ ] **Step 2: Lengthen/ease the draw in `OpeningSequence.tsx`**

In `OpeningSequence.tsx`, change the tween line (currently `duration: 2.4, ease: 'power2.out', delay: 0.6`) to:

```ts
    const tween = gsap.to(ctrl, { drawProgress: 1, duration: 3.0, ease: 'power1.inOut', delay: 0.6 })
```

- [ ] **Step 3: Typecheck**

Run: `cd apps/web && npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 4: Browser verify (manual)**

Run `npm run dev`, open `http://localhost:5173`, reload. Expected: the white history line draws left→right, faint commits appear as it passes them, then the bad branch grows up to Storyverse, then the good branch grows down to Future Proof — **no sudden full-fork pop**. Camera holds the wide shot throughout.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/Spine.tsx apps/web/src/home/OpeningSequence.tsx
git commit -m "feat(home): staged self-assembling opening draw (history → bad → good)"
```

---

## Task 5: Smoother camera handoff (`CameraRig.tsx`)

Kill the "two tweens" by smoothing the look-at target (lerp a persistent vector instead of snapping to `ahead`) and damping position + look-at with one factor, so leaving the overview into travel is a single gentle ease. Motion change — browser-verified.

**Files:**
- Modify: `apps/web/src/home/CameraRig.tsx`

- [ ] **Step 1: Rewrite `CameraRig.tsx`**

Replace the entire file with:

```tsx
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { pointAtT } from './path'
import { useCameraController } from './cameraController'

const here = new Vector3()
const ahead = new Vector3()
const desiredPos = new Vector3()
const desiredLook = new Vector3()
const lookTarget = new Vector3(6, 0, 0) // persistent, smoothed look-at
const introPos = new Vector3(6, 0, 76) // pulled-back overview that frames the whole fork
const introTarget = new Vector3(6, 0, 0)

/** Side-on follow camera. One damped move for position AND a smoothed look-at,
 * so the intro → travel handoff is a single gentle ease (no snap/double-tween). */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const ctrl = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt) // frame-rate-independent damping
    if (ctrl.mode === 'intro') {
      desiredPos.copy(introPos)
      desiredLook.copy(introTarget)
    } else {
      pointAtT(ctrl.t, here)
      pointAtT(Math.min(1, ctrl.t + 0.04), ahead)
      desiredPos.set(here.x, here.y + 2.5, 18) // back on +Z, slightly above
      desiredLook.set(ahead.x, ahead.y, 0)
    }
    camera.position.lerp(desiredPos, k)
    lookTarget.lerp(desiredLook, k)
    camera.lookAt(lookTarget)
  })

  return null
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 3: Browser verify (manual)**

Reload and begin scrolling from the overview. Expected: the camera eases smoothly from the wide shot into following the path — no violent rotation, no two-stage snap. Scrolling on through Storyverse rewinds to the fork and continues down to Future Proof, the look-at always pointing in the direction of travel.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/CameraRig.tsx
git commit -m "fix(home): smoothed look-at + unified intro→travel camera handoff"
```

---

## Task 6: Play / stop toggle + future-proof waypoint (`Chrome.tsx`, `drivers.ts`)

`play` resets to the top and sweeps the whole (now longer) tour; the button toggles to `stop`, which kills the tween. A `future proof` button is added now that it is a real waypoint.

**Files:**
- Modify: `apps/web/src/home/drivers.ts`
- Modify: `apps/web/src/home/Chrome.tsx`

- [ ] **Step 1: Bump the autoplay default duration**

In `drivers.ts`, change the `autoplay` signature default (currently `export function autoplay(duration = 12)`) to:

```ts
export function autoplay(duration = 18): gsap.core.Tween {
```

(The longer retrace tour wants a slower sweep. Body unchanged.)

- [ ] **Step 2: Rewrite `Chrome.tsx` with play/stop state + future-proof button**

Replace the entire file with:

```tsx
import { useRef, useState } from 'react'
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
    ctrl.t = 0
    const tw = autoplay()
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
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToT(waypoints.fork) }}>fork</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToT(waypoints.storyverse) }}>storyverse</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToT(waypoints.futureProof) }}>future proof</button>
        <button style={btn} onClick={togglePlay}>{playing ? 'stop' : 'play'}</button>
        <Link to="/about" style={{ ...btn, display: 'inline-block' }}>about</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `cd apps/web && npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 4: Browser verify (manual)**

Scroll partway in, then click `play`. Expected: the view jumps to the top and sweeps the entire tour (history → bad → fork → good → Future Proof); the button now reads `stop`. Click `stop` mid-sweep — the camera halts where it is and the button returns to `play`. `fork` / `storyverse` / `future proof` each fly to their waypoint.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/drivers.ts apps/web/src/home/Chrome.tsx
git commit -m "feat(home): play/stop toggle + future-proof waypoint button"
```

---

## Task 7: Reliable 3D node clicks (`StoryNode.tsx`)

Add a concentric invisible hit-sphere (radius 1.2) carrying the hover/click handlers so small, far nodes are easy to target. The visible cyan sphere keeps its size.

**Files:**
- Modify: `apps/web/src/home/StoryNode.tsx`

- [ ] **Step 1: Move handlers onto a larger hit-sphere**

In `StoryNode.tsx`, replace the single interactive `<mesh>` (the one with `onPointerOver/onPointerOut/onClick` and the `sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]}`) with two stacked meshes — an invisible hit-sphere that carries the handlers, then the visible sphere with no handlers:

```tsx
      <mesh
        position={[cx, cy, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); enter() }}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[cx, cy, 0]}>
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={dim} toneMapped={false} />
      </mesh>
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && npx tsc --noEmit`
Expected: PASS (exit 0).

- [ ] **Step 3: Browser verify (manual)**

Hover and click each story node. Expected: all three bad-branch nodes (Camping, Karen, Emperor's Coin) hover (cursor → pointer, sphere grows, label brightens) and click through — Camping → the comic, Karen / Emperor's Coin → their `coming soon` stubs. The hit area is forgiving (you don't have to land dead-centre on the small sphere).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/StoryNode.tsx
git commit -m "fix(home): larger invisible hit-sphere for reliable node clicks"
```

---

## Final verification

- [ ] **Run the full unit suite from root**

Run: `npm test`
Expected: all workspaces green (graph + path suites updated; nothing else regressed).

- [ ] **Run typecheck from root**

Run: `npm run typecheck`
Expected: PASS for every workspace.

- [ ] **Full browser pass** (`npm run dev`, port 5173): staged opening draws with no snap; first-scroll handoff is one gentle ease; full scroll travels bad → fork → good → Future Proof; play restarts + stop halts; all nodes click; labels no longer collide; OS reduced-motion still serves the 2D fallback.
