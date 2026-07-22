# Home Graph — How It Works & How to Reuse It

The homepage is a scroll-driven 3D animation: a git-graph fork diagram that draws itself as you scroll, with a camera that follows the story, and nodes that light up when the line reaches them.

---

## Architecture in one sentence

`scrollY → drawProgress → { Spine geometry, camera pose, node visibility }`

Everything derives from a single number (drawProgress 0→1). No modes, no timers, no GSAP.

---

## Key files

| File | Role |
|------|------|
| `apps/web/src/home/graph.ts` | World-space geometry: branch paths, commit dots, `drawThreshold()` |
| `apps/web/src/home/timeline.ts` | Story content: `homeSteps[]` — each node's position, label, route, camera pose |
| `apps/web/src/home/Scene.tsx` | Scroll → drawProgress, overview bands, reveals, re-emerge |
| `apps/web/src/home/CameraRig.tsx` | drawProgress → camera pose via keyframe lerp |
| `apps/web/src/home/Spine.tsx` | drawProgress → Three.js Line2 geometry update |
| `apps/web/src/home/Constellation.tsx` | Maps homeSteps → StoryNode components |
| `apps/web/src/home/StoryNode.tsx` | Renders one node (sphere, tether, label, ring) |

---

## The scroll-to-state mapping

```
raw = scrollY / (totalHeight - windowHeight)   // 0..1

Top overview band  (raw < 0.05):  drawProgress = 1  (full graph, all nodes)
Story zone  (0.05 < raw < 0.95):  drawProgress = (raw - 0.05) / 0.90
Bottom overview band (raw > 0.95): drawProgress = 1  (full graph, all nodes)
```

The **top and bottom 5%** show the complete diagram as an interactive menu.  
The **middle 90%** is the progressive story.

To change the band size, edit `OVERVIEW_BAND` in `Scene.tsx`.

---

## The graph geometry (`graph.ts`)

```
History branch: x ∈ [-30, 0], y = 0  (horizontal trunk)
Bad branch:     FORK(0,0) → ELBOW(6,6) → (18,6) → TIP(29,6)   ← draws at drawProgress 0.40→0.72
Good branch:    FORK(0,0) → ELBOW(6,-6) → (18,-6) → TIP(29,-6) ← draws at drawProgress 0.72→0.95
```

The Spine uses **equal segment weighting** (not physical distance), so the diagonal elbow segment and the flat segments each get 1/3 of the branch's draw budget.

`drawThreshold(step)` computes the exact drawProgress at which the Spine tip reaches a node's `clip` position using the same segment-index maths as `drawnSlice`.

---

## Adding a node

1. **Add to `homeSteps`** in `timeline.ts`:

```typescript
{
  id:     'my-story',
  branch: 'bad',               // 'bad' | 'good' | 'history'
  phases: { enter: 1, hold: 1, exit: 1 },  // scroll budget (1 = 1 viewport)
  camera: { position: [x, y, z], lookAt: [x, y, 0] },
  title:  'My Story',
  route:  '/comics/my-story',  // omit for non-navigable nodes
  status: 'live',              // or 'coming-soon'
  clip:   [cx, cy],            // where tether attaches to the branch
  pos:    [px, py],            // where the sphere floats
  // Optional:
  kind:   'event',             // 'event' renders a smaller node, no click
  ring:   true,                // adds a white torus ring (for branch endpoints)
}
```

2. **Placement rules**:
   - `clip` = point on the branch line (y = 6 for bad, y = -6 for good, y = 0 for history)
   - `pos` = where the sphere floats (offset above/below to avoid overlapping the line)
   - Bad branch nodes float above: `pos: [cx, 10]`; Good branch nodes float below: `pos: [cx, -10]`
   - History events alternate: above at y=+2.5, below at y=-2.5

3. **Camera pose**: tune in the browser — start with `position: [cx, cy+3, 18]`, `lookAt: [cx, cy, 0]`.

---

## Adding a camera dwell

The camera lerps between keyframes in `CameraRig.tsx`. To make it pause at a position, repeat the same pose at two consecutive `p` values:

```typescript
{ p: 0.72, pos: [30, 9, 25], look: [30, 6, 0] }, // arrives
{ p: 0.79, pos: [30, 9, 25], look: [30, 6, 0] }, // dwells (same pose)
{ p: 0.84, pos: [6, 0, 52],  look: [6, 0, 0]  }, // pulls back
```

Each 0.01 of story progress ≈ 222px of scroll at default settings.

---

## Making the graph reusable on another page

The system has three layers you can swap independently:

### Layer 1 — Geometry (`graph.ts`)
Define your own branches as `Vec2[]` arrays. Export a `GRAPH` object with the same shape. The Spine and drawThreshold will work with any graph topology.

### Layer 2 — Content (`timeline.ts`)  
Define `homeSteps` (or rename it) with your own steps. The `@badcode/scroll-timeline` package handles the scroll layout (`layoutTimeline`, `sampleTimeline`).

### Layer 3 — Camera (`CameraRig.tsx`)
Replace the `KF` keyframe array with poses suited to your graph. The lerp + `ctrl.drawProgress` wiring works unchanged.

### Minimal page setup

```tsx
// YourPage.tsx
import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { createCameraController, CameraControllerContext } from './home/cameraController'
import { CameraRig } from './home/CameraRig'   // or your custom version
import { Spine } from './home/Spine'
import { Constellation } from './home/Constellation'
import { useTimeline } from './home/useTimeline'
import { OVERVIEW_BAND } from './home/Scene'    // or define your own
import { drawThreshold } from './home/graph'
import { yourSteps, ALL_REVEALED, revealedAt } from './your-timeline'

export default function YourPage() {
  const ctrl = useRef(createCameraController()).current
  const [revealedSteps, setRevealedSteps] = useState(ALL_REVEALED)
  const { layout } = useTimeline(yourSteps)

  useEffect(() => {
    const onScroll = () => {
      const raw = window.scrollY / Math.max(1, layout.totalHeight - window.innerHeight)
      const inOverview = raw < OVERVIEW_BAND || raw > 1 - OVERVIEW_BAND
      ctrl.isOverview = inOverview
      ctrl.drawProgress = inOverview ? 1 : (raw - OVERVIEW_BAND) / (1 - 2 * OVERVIEW_BAND)
      setRevealedSteps(inOverview ? ALL_REVEALED : revealedAt(ctrl.drawProgress, yourSteps))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [layout, ctrl])

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Canvas camera={{ position: [6, 0, 76], fov: 50 }}>
          <CameraRig />
          <Spine />
          <Constellation layout={layout} revealedSteps={revealedSteps} menuMode={ctrl.isOverview} onFlash={() => {}} />
        </Canvas>
      </div>
      <div style={{ height: layout.totalHeight }} />
    </CameraControllerContext.Provider>
  )
}
```

---

## Tuning tips

- **Scroll speed**: `UNIT_VH` in `timeline.ts` — increase to slow the story down
- **Overview band size**: `OVERVIEW_BAND` in `Scene.tsx` — try 0.03–0.10
- **Node appears too early/late**: `drawThreshold` is automatic. If something looks wrong, check that `clip` is actually ON the branch at that x-coordinate
- **Camera too snappy**: increase the `Math.pow` base in CameraRig (`0.0001` → `0.001` for slower)
- **FutureProof / storyverse line through ring**: set `BAD_TIP`/`GOOD_TIP` to be 1 unit short of the ring centre (ring radius = 1.0 by default)
