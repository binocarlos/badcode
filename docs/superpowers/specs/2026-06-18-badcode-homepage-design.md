# BadCode Homepage — "The Atlas"

**Status:** design approved · 2026-06-18
**Topic:** Rebuild the homepage as a semantic-zoom map of all BadCode content, presented as a cinematic star-chart of the GitPush Origin Master fork.

---

## Problem

The current homepage (`apps/web/src/home/`) renders the GPOM git-fork as a thin glowing
line in black space that the user scrolls along while a camera follows a fixed tour spline
(`graph.ts` + `CameraRig.tsx`). The **static overview reads beautifully** (every node and
relationship visible at once), but **travelling the line is boring**: the camera glides
along an empty line through black space, and the line itself is the only payoff. There is
nothing to *see* along the way, so the scroll-to-travel earns no reward.

The homepage must be the **map to all BadCode content** (stories + music) *and* be visually
unforgettable — "received wisdom from a future that already went wrong," shown as the
superintelligence's own star-chart of the timeline.

## Goal

A **cinematic guided fly-through that resolves into a freely explorable map**, with AI-generated
**video and image plates anchored in 3D space** so that moving through the fork means moving
through *scenes*. One spatial model at multiple altitudes (semantic zoom) — the overview map and
the deep dive are the same artifact, not two screens.

This is a **big-swing rebuild** of the home experience, built on the existing R3F foundation and
the existing asset pipeline.

---

## Core decisions (locked during brainstorming)

1. **Role:** guided cinematic intro → free-roam map. Narrative first, sandbox second.
2. **Mechanic — the zoom ladder.** Semantic zoom *is* the navigation. One scene, five depths:
   - **L0 · The Spark** *(intro only)* — tight on the fork commit, a single pulse. The push that split the timeline.
   - **L1 · The Cosmos / The Atlas** *(HOME)* — the full git-fork constellation; nodes are living thumbnails. Where you land and where everything is legible at once.
   - **L2 · The Branch Corridor** *(later phase)* — fly *into* a branch and it becomes a corridor of plates streaming that storyline's beats. "Play the whole branch."
   - **L3 · The Diorama** *(per story)* — zoom into one node → a staged 3D stop each story fully controls (hero video, synopsis, enter).
   - **L4 · The Content** *(exit)* — cross into the real comic viewer / track player / text page.
   - Zoom depth maps onto the content hierarchy: **map → branch → story → thing.**
3. **Content model — songs live in stories.** The map stays *pure story*. Each story's diorama
   bundles its comic **and** its track(s); a low-passed ambient bed makes each node feel like a room.
   Music is discovered *through* the story it scores — no separate music branch. Play = a portal
   node ("coming soon" doorway; the game is a separate parallel project, out of scope here).
   About = the origin spark.
4. **Art direction — Deep Field cosmos read through a Cold Archive HUD.** A star-chart world
   (nebula fog, gold/violet warmth against the cold cyan, celestial nodes, italic-serif cartography
   labels) seen through a terminal/surveillance interface (monospace readouts, `// BAD_BRANCH ▸
   STORYVERSE · REC ●` log-style metadata, scanline glow on UI chrome). The world supplies awe; the
   HUD supplies the voice.
5. **Intro:** auto-play on load, ~4–6s (spark → graph draws itself → lands on the map), **skippable**
   via a persistent "skip / explore" affordance; any click/scroll interrupts to free-roam. Returning
   visitors may be sent straight to the map. No scrolljacking.
6. **Navigation (free-roam):** drag to pan the starfield, scroll/pinch to change **altitude**
   (semantic zoom), click a node to fly into its diorama. Map/atlas feel, not a scroll path.

---

## Architecture

All work is in `apps/web/src/home/` unless noted. One `<Canvas>` / one WebGL context.

### Reworked
- **Scroll-tour driver** in `Scene.tsx` and the keyframed **`CameraRig.tsx`** → split into:
  - `IntroRail` — a `CatmullRomCurve3` auto fly-in (L0→L1), driven by a short timeline, skippable.
  - Free-roam camera via drei/yomotsu **`<CameraControls>`**.
  - **The handoff seam:** while on the rail, controls are `enabled=false` and pose is written from
    the curve; at rail end call `cameraControls.setLookAt(finalPos, finalTarget, true)` to seat the
    controls at the exact rail pose, then `enabled=true`. Rail writes only while `!enabled`; controls
    own the camera while `enabled` — never both.

### Kept (restyled to Deep Field)
- `graph.ts` (fork geometry), `Atmosphere`, `Constellation` / `StoryNode`, `colors.ts`.
- `Fallback2D.tsx` → promoted to the **reduced-motion / no-WebGL DOM baseline** (legible list/map of
  branches and nodes, keyboard- and screen-reader-navigable).

### New
- **`NavController`** — owns semantic-zoom state: current **altitude** and **focus target**.
  Altitude (camera dolly distance) drives **LOD**: *galaxy* = branch titles only; *mid* = node labels
  + living plates; *close* = the diorama.
- **`MediaPlate`** — a world-space plate. drei `<Image>` for stills / `useVideoTexture` for video,
  with a **ThumbHash** placeholder shown instantly and the poster→video swap on approach.
  `toneMapped={false}`. Optionally `<Billboard>`-wrapped so plates stay readable at fly-past angles.
- **`NodePortal`** — drei `<MeshPortalMaterial>` so a node is a *window* into a vignette; animate
  `blend→1` to fly **into** the story. This is the fix for "nothing to see along the line" — the line
  becomes lined with windows.
- **`Diorama`** *(Phase 2)* — the L3 staged per-node theatre (hero video, title, synopsis, enter CTA).
- **`BranchCorridor`** *(Phase 3)* — the L2 "play the branch" flythrough of plates.
- **`HUD`** — Cold Archive terminal chrome (replaces/extends `Chrome.tsx` + `Narration.tsx`):
  monospace readouts, node metadata in log style, scanline glow, the persistent "you are here"
  landmark and "skip / explore" control.
- **`audio`** *(Phase 2)* — ambient D&B bed + low-pass filter applied on entering a node ("sound
  signals place"); per-node track playback.

### Post-processing
`@react-three/postprocessing`: `<Bloom>` (push plate/line colors >1 to glow — pays off the BadCode
aesthetic), `<DepthOfField>` (rack-focus onto the plate being approached), `<Vignette>`.

---

## Data model

Evolve `homeSteps` (today a flat `HomeStep[]`) into a small **graph**: `branches` → `nodes`.
Each node gains:
- `plate?: string` — an asset key into the home manifest (the node's living thumbnail).
- `diorama?` — staged-stop config (Phase 2): hero asset, synopsis, the song(s), enter target.
- existing fields kept: `id`, `branch`, `clip`/`pos` geometry, `route`, `status`, `title`.

Content at **L4 reuses the existing route/comic components untouched** (`routes/`, `comics/`).
Deep-linking: each node maps to a URL; the current `fromNode` re-emerge logic in `Scene.tsx`
generalizes so back-from-content returns the camera to that node's pose.

### Media assets — reuse the existing pipeline, do not reinvent
A new **`home/assets.manifest.json`** in the **existing CLI manifest format** (see
`packages/cli`, `apps/web/src/comics/*/assets.manifest.json`):
- images → `thumbhash` + `low`/`high` WebP renditions + dims;
- video → `thumbhash` + `poster` WebP + `480/720/1080` mp4 renditions + `frameCount`/`fps`.

This already gives instant placeholder → progressive load → poster→video on approach. KTX2/Basis
for GPU-resident plate textures is a **Phase 3** optimization, not required for v1.

---

## Accessibility & performance

- **`prefers-reduced-motion`** → skip the fly-in, render a static Atlas (no camera push-ins; they are
  vestibular triggers). `Fallback2D` covers no-WebGL / keyboard / screen-reader.
- **Beat "illusion of completeness":** the map must obviously be full of explorable stories/music; the
  hero intro must not read as the whole page.
- **Sense of place:** persistent minimap/landmark in the HUD; the user always knows which branch/node
  they're on and how to get back.
- **Video discipline:** single `<Canvas>`; ThumbHash → WebP → (poster → video on approach); pause
  off-screen plates; keep concurrently *playing* videos in single digits; `.dispose()` textures/
  geometries on unload (Three.js does not GC GPU memory); cap texture size and DPR on mobile;
  `frameloop="demand"` where the scene is at rest.

---

## Phasing (YAGNI)

**Phase 1 — The Atlas spine (shippable homepage).**
Deep Field look + Cold Archive HUD; semantic-zoom map (L1) with drag/zoom/click-to-fly; auto
intro (L0→L1) with skip; nodes show **poster-image plates**; content via existing routes; real
media on 1–2 hero nodes; `prefers-reduced-motion` + `Fallback2D` baseline. Replaces the current
scroll-tour homepage.

**Phase 2 — Dioramas (L3).**
Staged per-node theatres; video plates; `NodePortal` dive-in; per-story song + ambient audio bed
with low-pass-on-enter.

**Phase 3 — Corridor & polish (L2 + perf).**
"Play the whole branch" corridor flythrough; full media coverage across all nodes; KTX2 textures;
mobile tuning.

---

## Testing

Pure modules stay unit-tested in the style of today's `graph.test.ts` / `timeline.test.ts` /
`path.test.ts`:
- altitude → LOD mapping (which labels/plates/diorama show at a given altitude);
- node deep-link resolution (URL ↔ node ↔ camera pose, incl. the `fromNode` re-emerge);
- intro→free-roam handoff state machine (rail owns camera until handoff; controls own it after; never both).

Visual fidelity, motion feel, and performance budgets are verified in-browser (and on a real mobile
device for the perf guardrails).

---

## References (from research)

- Semantic zoom as one-model-many-altitudes; **100,000 Stars** (tour that releases control in place);
  **Matterport** dollhouse↔walkthrough↔guided-tour; **The Pudding "Yard Sale"** (narrative-first then
  playable sandbox — thematically identical: inequality, "we can't afford it").
- drei `<MeshPortalMaterial>`, `<Image>`, `useVideoTexture`, `<Billboard>`, `<SpriteAnimator>`,
  `<CameraControls>`; yomotsu/camera-controls `setLookAt(pose, true)` handoff; Lenis smooth scroll;
  `CatmullRomCurve3.getPointAt` with a look-ahead target; `@react-three/postprocessing`.
- Perf: KTX2/Basis, poster→video-on-approach, dispose-on-unload, single-digit concurrent decodes.
- Pitfalls: NN/g scrolljacking & illusion-of-completeness; "Where am I?" sense of place;
  `prefers-reduced-motion`; the Marvel Guided-View critique (a free-roam release valve keeps the
  guided journey from feeling like an unskippable cutscene).
