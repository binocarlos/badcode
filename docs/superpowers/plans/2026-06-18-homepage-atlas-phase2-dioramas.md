# Homepage "The Atlas" — Phase 2 (Dioramas / the dive) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn each story node from a clickable dot into a place you **dive into** — the camera flies in, the node's media opens into a framed "window," and a Cold-Archive panel shows its title, synopsis, and an **enter** into the real content; with video plates, a portal dive-in, and per-node sound.

**Architecture:** Build on the Phase-1 Atlas (`apps/web/src/home/atlas/`). The dive reuses the existing `CameraControlsRig.flyTo` + `navState` focus model; a new DOM `Diorama` panel renders for the focused node; `MediaPlate` grows a video path (manifest-driven, poster→video on approach, ThumbHash placeholder); the focused plate becomes a `<MeshPortalMaterial>` window you blend through on enter; a small WebAudio manager runs an ambient bed that ducks + low-passes when you enter a node and plays that node's song. Pure logic (enter-target resolution, plate-source selection, audio state) is TDD'd; 3D/visual/audio is built and verified in the browser (`npm run dev`).

**Tech Stack:** React 18 + TS, `@react-three/fiber` 8, `@react-three/drei` 9.122 (`useVideoTexture`, `MeshPortalMaterial`, `Image`, `Text`, `Billboard`, `CameraControls`), `@react-three/postprocessing`, `three` 0.169, `@badcode/comic-manifest` (asset manifest types), `thumbhash`, Web Audio API, Vitest.

## Global Constraints

- One `<Canvas>` / one WebGL context (unchanged from Phase 1).
- **Reuse the existing asset pipeline**: plates read `assets.manifest.json` (ThumbHash + `low`/`high` WebP + `poster` WebP + `480/720/1080` mp4) produced by `packages/cli`. Do not invent a parallel format. (spec: Media assets)
- **Video discipline**: poster (or ThumbHash) by default; instantiate the `<video>` only when the plate is focused/near; **keep concurrently playing videos in single digits**; `muted`+`playsInline`+`loop`; pause + dispose off-screen. (spec: Accessibility & performance)
- **Audio needs a user gesture**: never autoplay sound on load — start the ambient bed on the first click/keypress; provide a mute control. (browser autoplay policy)
- **`prefers-reduced-motion`**: the dive still works but without the long camera push-in — snap/short-fade instead; no audio auto-ducking surprises. The `Fallback2D` path (no WebGL) is unchanged. (spec: Accessibility)
- **Songs live in stories** — a node's audio is that story's track; there is no separate music UI. (spec: Content model)
- Voice: synopsis/blurbs and any copy follow `docs/voice.md` — sarcastic, authoritative, nurturing-underneath.

**Phase-1 anchors this plan extends (read first):**
- `apps/web/src/home/atlas/model.ts` — `AtlasNode { id,title,branch,pos,clip,route?,status,ring,plate? }`, `buildAtlas()`.
- `apps/web/src/home/atlas/navState.ts` — `NavState { focusId, lod }`, `focusNode`, `toGalaxy`, `withLod`, `altitudeToLod`.
- `apps/web/src/home/atlas/deeplink.ts` — `Pose`, `poseForNode`, `nodeForFromState`.
- `apps/web/src/home/atlas/CameraControlsRig.tsx` — `RigHandle { flyTo(pose, immediate?), enable(on) }`.
- `apps/web/src/home/atlas/MediaPlate.tsx` — image plate + `PlateBoundary` (graceful fail).
- `apps/web/src/home/atlas/AtlasNode.tsx` — `AtlasNode({ node, lod, focused, reveal, onSelect })`.
- `apps/web/src/home/atlas/AtlasScene.tsx` — composes the scene; owns `nav` + `select(id)` (already `flyTo(poseForNode)` + `focusNode`).
- `apps/web/src/home/atlas/Hud.tsx` / `hud.css` — Cold-Archive overlay.
- `apps/web/src/home/timeline.ts` — `homeSteps`, `HomeStep` (already has `plate?`).

---

### Task 1: Diorama content — blurb + enter-target resolution

Give each node a one-line synopsis and a pure rule for where "enter" goes.

**Files:**
- Modify: `apps/web/src/home/timeline.ts` (add `blurb?: string` to `HomeStep`; set blurbs)
- Modify: `apps/web/src/home/atlas/model.ts` (carry `blurb` onto `AtlasNode`)
- Create: `apps/web/src/home/atlas/diorama.ts`
- Test: `apps/web/src/home/atlas/diorama.test.ts`

**Interfaces:**
- Produces: `function enterTargetFor(node: AtlasNode): string | null` — returns the route to enter for a live node (or a live tip with a route), `null` for coming-soon nodes.

- [ ] **Step 1: Add `blurb` to the step type and carry it through the model**

In `timeline.ts`, add to the `HomeStep` interface after `plate?`:

```ts
  blurb?:          string             // one-line synopsis shown in the diorama (BadCode voice)
```

Set blurbs on the live + tip steps (voice-matched), e.g. on `camping`:

```ts
    plate:  '/atlas/camping.webp',
    blurb:  'They told you to pack light. They meant your expectations.',
```

and on `karen`:

```ts
    plate:  '/atlas/karen.webp',
    blurb:  'Every revolution needs a manager. Hers just wants to speak to yours.',
```

In `model.ts`, add `blurb?: string` to the `AtlasNode` interface and `blurb: s.blurb,` to the `nodes` map.

- [ ] **Step 2: Write the failing test**

Create `apps/web/src/home/atlas/diorama.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { enterTargetFor } from './diorama'
import { buildAtlas } from './model'

const { nodes } = buildAtlas()
const byId = (id: string) => nodes.find((n) => n.id === id)!

describe('enterTargetFor', () => {
  it('returns the route for a live story node', () => {
    expect(enterTargetFor(byId('camping'))).toBe('/comics/camping')
  })
  it('returns the route for a live tip', () => {
    expect(enterTargetFor(byId('storyverse'))).toBe('/storyverse')
  })
  it('returns null for a coming-soon node', () => {
    expect(enterTargetFor(byId('emperors-coin'))).toBeNull()
  })
})
```

- [ ] **Step 2b: Run to verify it fails**

Run: `npm test --workspace @badcode/web -- diorama.test`
Expected: FAIL — `Cannot find module './diorama'`.

- [ ] **Step 3: Implement**

Create `apps/web/src/home/atlas/diorama.ts`:

```ts
import type { AtlasNode } from './model'

/** Where "enter" goes: a live node with a route → that route; otherwise null. */
export function enterTargetFor(node: AtlasNode): string | null {
  if (node.status !== 'live') return null
  return node.route ?? null
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test --workspace @badcode/web -- diorama.test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/timeline.ts apps/web/src/home/atlas/model.ts apps/web/src/home/atlas/diorama.ts apps/web/src/home/atlas/diorama.test.ts
git commit -m "feat(home): node blurbs + enter-target resolution for the diorama"
```

---

### Task 2: The Diorama panel (DOM)

A Cold-Archive overlay that appears for the focused node: title, synopsis, ENTER, BACK.

**Files:**
- Create: `apps/web/src/home/atlas/Diorama.tsx`
- Create: `apps/web/src/home/atlas/diorama.css`

**Interfaces:**
- Consumes: `AtlasNode` from `./model`; `enterTargetFor` from `./diorama`.
- Produces: `function Diorama(props: { node: AtlasNode | null; onEnter: (route: string) => void; onBack: () => void }): JSX.Element | null`

- [ ] **Step 1: Styles**

Create `apps/web/src/home/atlas/diorama.css`:

```css
.diorama { position: fixed; right: 0; top: 0; bottom: 0; width: min(420px, 40vw);
  display: flex; flex-direction: column; justify-content: center; gap: 14px;
  padding: 40px; z-index: 4; pointer-events: none;
  font-family: 'JetBrains Mono', ui-monospace, monospace; color: #cfe9f2;
  background: linear-gradient(90deg, transparent, #02030acc 35%); }
.diorama > * { pointer-events: auto; }
.diorama-tag { font-size: 11px; letter-spacing: .16em; color: #7be3ff; text-transform: uppercase; }
.diorama-title { font-size: 26px; line-height: 1.1; color: #eaffff; margin: 0; }
.diorama-blurb { font-size: 14px; line-height: 1.6; color: #9fb8c2; max-width: 34ch; }
.diorama-actions { display: flex; gap: 12px; margin-top: 8px; }
.diorama-btn { font: inherit; font-size: 13px; letter-spacing: .1em; padding: 9px 18px;
  background: #0a1a22; border: 1px solid #2bd4ff; color: #2bd4ff; cursor: pointer; }
.diorama-btn:hover { background: #123a4a; }
.diorama-btn[disabled] { opacity: .5; cursor: default; border-color: #5f7c88; color: #5f7c88; }
.diorama-back { background: transparent; border-color: #2a4a55; color: #9fb8c2; }
```

- [ ] **Step 2: Component**

Create `apps/web/src/home/atlas/Diorama.tsx`:

```tsx
import './diorama.css'
import type { AtlasNode } from './model'
import { enterTargetFor } from './diorama'

export function Diorama({
  node,
  onEnter,
  onBack,
}: {
  node: AtlasNode | null
  onEnter: (route: string) => void
  onBack: () => void
}) {
  if (!node) return null
  const target = enterTargetFor(node)
  return (
    <div className="diorama">
      <div className="diorama-tag">{node.branch === 'good' ? 'GOOD_BRANCH' : node.branch === 'bad' ? 'BAD_BRANCH' : 'SHARED_HISTORY'}</div>
      <h2 className="diorama-title">{node.title}</h2>
      {node.blurb && <p className="diorama-blurb">{node.blurb}</p>}
      <div className="diorama-actions">
        {target
          ? <button className="diorama-btn" onClick={() => onEnter(target)}>▶ enter</button>
          : <button className="diorama-btn" disabled>// transmission pending</button>}
        <button className="diorama-btn diorama-back" onClick={onBack}>← back</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/Diorama.tsx apps/web/src/home/atlas/diorama.css
git commit -m "feat(home): Diorama DOM panel (title/synopsis/enter/back)"
```

---

### Task 3: Frame + enlarge the plate when a node is focused

When focused, the node's plate becomes the hero "window": larger, with a glowing frame.

**Files:**
- Modify: `apps/web/src/home/atlas/MediaPlate.tsx` (add an optional `framed` prop drawing a frame ring)
- Modify: `apps/web/src/home/atlas/AtlasNode.tsx` (when `focused`, render the plate larger + framed, centered in view)

**Interfaces:**
- `MediaPlate` gains `framed?: boolean`.

- [ ] **Step 1: Add a frame to MediaPlate**

In `MediaPlate.tsx`, add `framed = false` to the props and, when true, render a thin emissive border behind the poster. Inside the returned `<group>`, before the `<PlateBoundary>`, add:

```tsx
      {framed && (
        <lineSegments position={[0, 0, 0.01]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(width, (width * 9) / 16)]} />
          <lineBasicMaterial color={DEEP.lineHot} transparent opacity={0.9} />
        </lineSegments>
      )}
```

Add `import * as THREE from 'three'` at the top, and add `framed?: boolean` to the prop type with default `false`.

- [ ] **Step 2: Render the focused plate big + framed in AtlasNode**

In `AtlasNode.tsx`, replace the existing plate block with a focus-aware version:

```tsx
      {!!node.plate && (lod === 'node' || focused) && (
        <MediaPlate
          url={node.plate}
          position={[0, focused ? 5.6 : 4.6, 0]}
          width={focused ? 11 : 6}
          framed={focused}
        />
      )}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors. (Visual size/frame verified in Task 4.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/MediaPlate.tsx apps/web/src/home/atlas/AtlasNode.tsx
git commit -m "feat(home): focused node renders a framed hero plate (the window)"
```

---

### Task 4: Wire the dive in AtlasScene (enter / back / Esc)

Show the Diorama for the focused node; ENTER navigates to content; BACK / Esc / clicking empty space flies out to the map.

**Files:**
- Modify: `apps/web/src/home/atlas/AtlasScene.tsx`

**Interfaces:**
- Consumes: `Diorama`, `INTRO_END` (from `./IntroRail`), `toGalaxy`, `useNavigate`.

- [ ] **Step 1: Add navigation, a back handler, an Esc key listener, and the Diorama**

In `AtlasScene.tsx`:
- import `useEffect` (extend the React import), `useNavigate` from `react-router-dom`, `Diorama` from `./Diorama`, `INTRO_END` from `./IntroRail`, and add `toGalaxy` to the existing `./navState` import.
- inside the component:

```tsx
  const navigate = useNavigate()
  const focusedNode = nodes.find((n) => n.id === nav.focusId) ?? null

  const surface = () => {
    rig.current?.flyTo(INTRO_END)
    setNav((s) => toGalaxy(s))
  }
  const enter = (route: string) => navigate(route)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') surface() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
```

- on the `<Canvas>` element, add a background-click handler that surfaces when you click empty space:

```tsx
        <Canvas
          camera={{ position: startFocus ? poseForNode(startFocus).position : [0, 0, 14], fov: 50 }}
          onPointerMissed={() => { if (nav.focusId) surface() }}
        >
```

- after `<Hud .../>`, render the Diorama:

```tsx
      <Diorama node={focusedNode} onEnter={enter} onBack={surface} />
```

- [ ] **Step 2: Verify the dive in the browser**

Run: `npm run dev --workspace @badcode/web`, open the app.
Expected: clicking a node flies in, the plate enlarges + frames, the right-side Diorama shows title/blurb; **enter** on Camping/Karen navigates to the comic; **back**, **Esc**, or clicking empty space flies back to the overview and dismisses the panel. Coming-soon nodes show "// transmission pending".

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/home/atlas/AtlasScene.tsx
git commit -m "feat(home): wire the dive — focus shows Diorama; enter/back/Esc/click-away"
```

---

### Task 5: Manifest-driven plate source

A pure module that turns an `assets.manifest.json` entry into the URLs a plate needs (poster, video renditions, ThumbHash data-URI), so plates stop being hard-coded local paths.

**Files:**
- Modify: `apps/web/package.json` (add deps)
- Create: `apps/web/src/home/atlas/plateSource.ts`
- Test: `apps/web/src/home/atlas/plateSource.test.ts`
- Create: `apps/web/src/home/assets.manifest.json` (seed; can reference the existing camping assets)

**Interfaces:**
- Consumes: `AssetManifest`, `VideoAsset`, `ImageVariant` from `@badcode/comic-manifest`; `thumbHashToDataURL` from `thumbhash`.
- Produces:
  - `type PlateSource = { thumbDataUrl: string; posterUrl: string; videoUrl?: string; width: number; height: number }`
  - `function resolvePlate(manifest: AssetManifest, key: string, opts?: { maxHeight?: number }): PlateSource | null`
  - `function decodeThumb(base64: string): string` (ThumbHash base64 → data-URI; `''` → transparent 1×1)

- [ ] **Step 1: Add dependencies**

In `apps/web/package.json` add to `dependencies`: `"@badcode/comic-manifest": "*"` and `"thumbhash": "^0.1.1"`. Run `npm install`.

- [ ] **Step 2: Write the failing test**

Create `apps/web/src/home/atlas/plateSource.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { resolvePlate, decodeThumb } from './plateSource'
import type { AssetManifest } from '@badcode/comic-manifest'

const manifest = {
  basePath: 'comics-v2/camping-jack-test',
  assets: {
    'img/i01.jpg': { thumbhash: 'nOcRDIJ3d4d/h3eHd3Z5YI0Htw==', low: 'derived/img/i01.low.webp', high: 'derived/img/i01.high.webp', width: 1920, height: 1080 },
  },
  animations: {
    'anim/a01': { thumbhash: 'nOcRDIJ3d4d/h3eHd3Z4YI0Gtw==', poster: 'derived/anim/a01.poster.webp', renditions: [
      { height: 480, width: 854, proxy: 'derived/anim/a01.480.mp4' },
      { height: 1080, width: 1920, proxy: 'derived/anim/a01.1080.mp4' },
    ], width: 1920, height: 1080, frameCount: 96, fps: 24 },
  },
} as unknown as AssetManifest

const BASE = 'https://storage.googleapis.com/badcode-storage'

describe('resolvePlate', () => {
  it('resolves an image asset to poster + thumb, no video', () => {
    const p = resolvePlate(manifest, 'img/i01.jpg')!
    expect(p.posterUrl).toBe(`${BASE}/comics-v2/camping-jack-test/derived/img/i01.high.webp`)
    expect(p.videoUrl).toBeUndefined()
    expect(p.thumbDataUrl.startsWith('data:image/')).toBe(true)
    expect(p.width).toBe(1920)
  })
  it('resolves an animation to poster + the smallest rendition >= maxHeight', () => {
    const p = resolvePlate(manifest, 'anim/a01', { maxHeight: 720 })!
    expect(p.posterUrl).toContain('a01.poster.webp')
    expect(p.videoUrl).toContain('a01.1080.mp4') // 480 too small, 1080 is next up
  })
  it('returns null for an unknown key', () => {
    expect(resolvePlate(manifest, 'nope')).toBeNull()
  })
})

describe('decodeThumb', () => {
  it('returns a transparent pixel for empty hash', () => {
    expect(decodeThumb('')).toContain('data:image')
  })
})
```

- [ ] **Step 2b: Run to verify it fails**

Run: `npm test --workspace @badcode/web -- plateSource.test`
Expected: FAIL — `Cannot find module './plateSource'`.

- [ ] **Step 3: Implement**

Create `apps/web/src/home/atlas/plateSource.ts`:

```ts
import type { AssetManifest } from '@badcode/comic-manifest'
import { thumbHashToDataURL } from 'thumbhash'

const CDN_BASE = 'https://storage.googleapis.com/badcode-storage'
const TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export type PlateSource = {
  thumbDataUrl: string
  posterUrl:    string
  videoUrl?:    string
  width:        number
  height:       number
}

export function decodeThumb(base64: string): string {
  if (!base64) return TRANSPARENT
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return thumbHashToDataURL(bytes)
}

const url = (manifest: AssetManifest, path: string) => `${CDN_BASE}/${manifest.basePath}/${path}`

export function resolvePlate(
  manifest: AssetManifest,
  key: string,
  opts: { maxHeight?: number } = {},
): PlateSource | null {
  const img = manifest.assets?.[key]
  if (img) {
    return {
      thumbDataUrl: decodeThumb(img.thumbhash),
      posterUrl:    url(manifest, img.high),
      width:        img.width,
      height:       img.height,
    }
  }
  const vid = manifest.animations?.[key]
  if (vid) {
    const maxH = opts.maxHeight ?? 1080
    const sorted = [...vid.renditions].sort((a, b) => a.height - b.height)
    const pick = sorted.find((r) => r.height >= maxH) ?? sorted[sorted.length - 1]
    return {
      thumbDataUrl: decodeThumb(vid.thumbhash),
      posterUrl:    url(manifest, vid.poster),
      videoUrl:     url(manifest, pick.proxy),
      width:        vid.width,
      height:       vid.height,
    }
  }
  return null
}
```

> Note: confirm `CDN_BASE`/`basePath` joins to a real public URL against one known asset in the browser; adjust the base if the bucket layout differs. The session has a verified asset at `https://storage.googleapis.com/badcode-storage/comics/camping/...`.

- [ ] **Step 4: Seed the home manifest**

Create `apps/web/src/home/assets.manifest.json` with a minimal valid manifest (start by copying the relevant `basePath` + a couple of `assets`/`animations` entries from `apps/web/src/comics/camping/assets.manifest.json`). This is the source the home plates resolve against until dedicated AI plates are generated.

- [ ] **Step 5: Run to verify it passes**

Run: `npm test --workspace @badcode/web -- plateSource.test`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/web/package.json package-lock.json apps/web/src/home/atlas/plateSource.ts apps/web/src/home/atlas/plateSource.test.ts apps/web/src/home/assets.manifest.json
git commit -m "feat(home): manifest-driven plate source (poster/video/thumbhash)"
```

---

### Task 6: Video plates — poster→video on approach

Extend the plate to play a looping video when the node is focused/near, with the ThumbHash as the instant placeholder and the poster as the still; pause + release the `<video>` when it leaves.

**Files:**
- Modify: `apps/web/src/home/atlas/MediaPlate.tsx`
- Modify: `apps/web/src/home/atlas/AtlasNode.tsx` (pass `active` = focused so video only plays for the dived node)

**Interfaces:**
- `MediaPlate` gains `{ poster?: string; video?: string; thumb?: string; active?: boolean }` (keeps `url` for the simple local-image path).

- [ ] **Step 1: Add a video path to MediaPlate**

In `MediaPlate.tsx`, add a `VideoPoster` subcomponent using drei `useVideoTexture`, gated on `active`:

```tsx
import { Image, useVideoTexture } from '@react-three/drei'

function VideoPlane({ src, width }: { src: string; width: number }) {
  const texture = useVideoTexture(src, { muted: true, loop: true, start: true, playsInline: true })
  return (
    <mesh>
      <planeGeometry args={[width, (width * 9) / 16]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}
```

Render priority inside `MediaPlate`: if `active && video` → `<Suspense fallback={<Poster .../>}><VideoPlane/></Suspense>`; else if `poster||url` → `<Poster/>`; the backing plane stays for the instant state. Keep `PlateBoundary` wrapping all of it. Only ONE `<video>` mounts at a time because only the focused node passes `active`.

- [ ] **Step 2: Pass `active` from the focused node**

In `AtlasNode.tsx`, pass `active={focused}` to the focused `<MediaPlate>` and (when the node has manifest media) `poster`/`video`/`thumb`. For nodes still using a local `plate` string, pass `url={node.plate}` as today.

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev --workspace @badcode/web`. Dive into a node whose manifest entry is a video.
Expected: ThumbHash blur → poster → on focus the video plays (muted/looped); backing out pauses/releases it. Only one video ever plays at once (check Network/Media tab).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/MediaPlate.tsx apps/web/src/home/atlas/AtlasNode.tsx
git commit -m "feat(home): video plates — poster→video on focus, single concurrent decode"
```

---

### Task 7: Portal dive-in (`MeshPortalMaterial`)

Make the focused plate a true window: it shows the media, and pressing **enter** blends the camera *through* it before navigating — the "fly into the story" beat.

**Files:**
- Create: `apps/web/src/home/atlas/NodePortal.tsx`
- Modify: `apps/web/src/home/atlas/AtlasNode.tsx` (use `NodePortal` for the focused hero instead of the flat plate)
- Modify: `apps/web/src/home/atlas/AtlasScene.tsx` (animate `blend→1` on enter, then navigate)

**Interfaces:**
- Produces: `function NodePortal(props: { poster?: string; video?: string; active: boolean; blend: number; width: number }): JSX.Element` — a `<MeshPortalMaterial>` plane whose child scene is the media; `blend` (0→1) drives the through-the-window transition.

- [ ] **Step 1: Build the portal**

Create `apps/web/src/home/atlas/NodePortal.tsx` using drei `<MeshPortalMaterial>`; the portal's nested scene renders the poster/video plane (reuse the plate's plane). Expose a `blend` prop wired to `MeshPortalMaterial`'s `blend`.

```tsx
import { MeshPortalMaterial } from '@react-three/drei'

export function NodePortal({ width, blend, children }: { width: number; blend: number; children: React.ReactNode }) {
  return (
    <mesh>
      <planeGeometry args={[width, (width * 9) / 16]} />
      <MeshPortalMaterial blend={blend} transparent>
        {children}
      </MeshPortalMaterial>
    </mesh>
  )
}
```

- [ ] **Step 2: Drive blend on enter**

In `AtlasScene.tsx`, add `const [blend, setBlend] = useState(0)`. The diorama `enter` now: animate `blend` 0→1 over ~600ms (a `requestAnimationFrame` tween or a `useFrame` lerp toward a target), then `navigate(route)`. Pass `blend` down to the focused node's portal. Reset `blend` to 0 on `surface()` and on route change.

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`. Dive into Camping → **enter** → the view should push *through* the framed window before the comic route loads.
Expected: the through-the-window transition reads as flying into the story; back-out resets cleanly.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/NodePortal.tsx apps/web/src/home/atlas/AtlasNode.tsx apps/web/src/home/atlas/AtlasScene.tsx
git commit -m "feat(home): portal dive-in — blend through the window on enter"
```

---

### Task 8: Audio — ambient bed + low-pass-on-enter

A small WebAudio manager: an ambient D&B bed (starts on first gesture), and when you dive into a node it ducks + low-passes the bed and plays that node's track; surfacing restores the bed.

**Files:**
- Modify: `apps/web/src/home/timeline.ts` (add `song?: string` to live nodes — a track URL/key)
- Modify: `apps/web/src/home/atlas/model.ts` (carry `song`)
- Create: `apps/web/src/home/atlas/audio.ts`
- Test: `apps/web/src/home/atlas/audio.test.ts`
- Modify: `apps/web/src/home/atlas/AtlasScene.tsx` (drive the manager on focus/surface) + `Hud.tsx` (mute toggle)

**Interfaces:**
- Produces (pure-ish, the state machine is unit-tested; the WebAudio nodes are mocked in tests):
  - `type AudioState = { started: boolean; muted: boolean; activeSong: string | null }`
  - `function nextAudio(state: AudioState, ev: { type: 'start' } | { type: 'focus'; song: string | null } | { type: 'surface' } | { type: 'toggleMute' }): AudioState`
  - a thin `createAudioEngine()` that applies an `AudioState` to real `GainNode`/`BiquadFilterNode`/`<audio>` elements (not unit-tested).

- [ ] **Step 1: Write the failing test for the state machine**

Create `apps/web/src/home/atlas/audio.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nextAudio, INITIAL_AUDIO } from './audio'

describe('nextAudio', () => {
  it('start marks the engine started', () => {
    expect(nextAudio(INITIAL_AUDIO, { type: 'start' }).started).toBe(true)
  })
  it('focus with a song sets it active', () => {
    const s = nextAudio({ ...INITIAL_AUDIO, started: true }, { type: 'focus', song: 'camping.mp3' })
    expect(s.activeSong).toBe('camping.mp3')
  })
  it('surface clears the active song', () => {
    const s = nextAudio({ started: true, muted: false, activeSong: 'x.mp3' }, { type: 'surface' })
    expect(s.activeSong).toBeNull()
  })
  it('toggleMute flips muted', () => {
    expect(nextAudio(INITIAL_AUDIO, { type: 'toggleMute' }).muted).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test --workspace @badcode/web -- audio.test`
Expected: FAIL — `Cannot find module './audio'`.

- [ ] **Step 3: Implement the state machine + engine**

Create `apps/web/src/home/atlas/audio.ts` with `INITIAL_AUDIO`, the pure `nextAudio` reducer (exact transitions the test asserts), and a `createAudioEngine()` that, given an `AudioState`, sets: ambient `GainNode.gain` (full when no `activeSong`, ducked ~0.25 when a song plays, 0 when muted), a `BiquadFilterNode` lowpass frequency (open ~20000 normally, ~600 when a song is active — "muffle, don't stop"), and plays/pauses the active song `<audio>`. Start the `AudioContext` only on the `start` event.

- [ ] **Step 4: Run to verify the reducer passes**

Run: `npm test --workspace @badcode/web -- audio.test`
Expected: PASS (4 tests).

- [ ] **Step 5: Wire into the scene + a mute control**

In `AtlasScene.tsx`: create the engine once (`useRef`); dispatch `start` on the first pointer/keydown; dispatch `focus`/`surface` alongside the existing dive handlers; pass `song` from the focused node. In `Hud.tsx`, add a mute toggle that dispatches `toggleMute`. Respect `prefers-reduced-motion`/no audio gesture: never start without a gesture.

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`. Click once (gesture) → ambient bed fades in. Dive into Camping → bed ducks + muffles, the track plays. Back out → bed restores. Mute toggles all.
Expected: as described; no audio before the first gesture.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/home/timeline.ts apps/web/src/home/atlas/model.ts apps/web/src/home/atlas/audio.ts apps/web/src/home/atlas/audio.test.ts apps/web/src/home/atlas/AtlasScene.tsx apps/web/src/home/atlas/Hud.tsx
git commit -m "feat(home): ambient bed + low-pass-on-enter, per-node song, mute"
```

---

### Task 9: Reduced-motion + keyboard access for the dive

Make the dive usable without big camera motion and from the keyboard.

**Files:**
- Modify: `apps/web/src/home/atlas/AtlasScene.tsx`

- [ ] **Step 1: Honor reduced motion in the dive**

Read `detectEnvironment().reducedMotion` (already imported pattern in `routes/Home.tsx`; pass it in as a prop or re-detect). When reduced: `flyTo(pose, /*immediate*/ true)` for dives and surfacing (no eased push-in); skip the portal blend tween (jump). Keep the Diorama panel identical.

- [ ] **Step 2: Keyboard selection**

Add arrow-key / Tab cycling through nodes that calls `select(id)` (focus next/prev node) and Enter to trigger the focused node's enter target. (Esc already surfaces.)

- [ ] **Step 3: Verify**

Run: `npm run dev`; emulate `prefers-reduced-motion: reduce`.
Expected: dives snap (no long push-in); Tab/arrows move focus between nodes; Enter enters; Esc backs out.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/atlas/AtlasScene.tsx
git commit -m "feat(home): reduced-motion dives + keyboard node navigation"
```

---

### Task 10: Phase 2 verification pass

- [ ] **Step 1: Full green**

Run: `npm run typecheck && npm test && npm run build --workspace @badcode/web`
Expected: typecheck clean; all suites (incl. new `diorama`, `plateSource`, `audio`) pass; build succeeds.

- [ ] **Step 2: Manual checklist in the browser**

Verify: dive in (camera + framed window + panel) · video plays only for the focused node · enter blends through then loads the comic · back/Esc/click-away surface · ambient audio ducks/muffles on enter and restores · reduced-motion snaps · coming-soon nodes show "transmission pending".

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "test(home): Phase 2 verification fixes"
```

---

## Self-Review

**Spec coverage (Phase 2 scope):** staged per-node theatre → Tasks 2–4; manifest-driven video plates (useVideoTexture, ThumbHash, poster→video on approach) → Tasks 5–6; `MeshPortalMaterial` dive-in → Task 7; per-story song + ambient bed + low-pass-on-enter → Task 8; reduced-motion/a11y → Task 9. ✓

**Placeholder scan:** none — pure tasks carry full tests + code; visual/audio tasks carry concrete component code + named browser checks. The two soft spots are flagged explicitly (CDN base-URL to confirm against a live asset in Task 5; portal child-scene wiring in Task 7) with how to resolve them, not left as "TBD".

**Type consistency:** `AtlasNode` extended with `blurb`/`song` (Tasks 1, 8) and consumed in Diorama/audio; `PlateSource`/`resolvePlate` (Task 5) feed `MediaPlate`'s `poster`/`video`/`thumb` (Task 6); `RigHandle.flyTo` reused for dive/surface (Tasks 4, 9); `enterTargetFor` (Task 1) used in Diorama (Task 2) and enter wiring (Task 4). ✓

---

## Out of scope (Phase 3)

The L2 branch "corridor" flythrough, full media coverage across all nodes, KTX2 textures, code-splitting the scene chunk, and mobile perf tuning — see `2026-06-18-homepage-atlas-phase3-corridor.md`.
