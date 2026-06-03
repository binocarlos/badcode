# GitPush Origin Master — homepage (3D git-history hub) — design

**Date:** 2026-06-03
**Status:** approved design, ready for implementation planning
**Branch context:** built on top of the comic / comic-meta / cli work; leaves `@badcode/comic` and the
existing `CampingComic` untouched.

## 1. Concept

The BadCode homepage **is** the site map. It renders the
[GitPush Origin Master](../../gitpush-origin-master.md) fork as a 3D git commit graph of humanity,
floating in black space, travelled like a camera on a dolly.

It opens by **drawing itself into existence** (a `git push` happening live), settles on the whole
**bent fork**, and lets you scroll forward through shared history to the fork point, then up the
**bad branch** (tip: Storyverse) or down the **good branch** (tip: Future Proof). Bright cyan **story
nodes** hang off the branches as a loose constellation; clicking one dives the camera in and hands off
to that story. **Camping** is the first fully-wired node.

The piece carries the project's voice: a signal from a machine intelligence — terminal/monospace,
cold black space, a single electric-cyan accent for the things you can reach.

## 2. The scene

### Geometry — the "bent fork"
Canonical **side-on** view (time runs left→right), though the camera is free to pivot/fly in 3D for
specific beats. Shape:

- flat **shared history** (the commits we all share)
- at `push origin master`, an **angular** (sharp-elbow) steep divergence — **bad branch up**,
  **good branch down**
- each branch then bends back to a **flat parallel run** out to its tip

This is authored as a path (a `THREE.CatmullRomCurve3` or polyline with sharp segments) that the
camera rides. Pulled back, the silhouette reads as a two-pronged trident; this is the canonical
overview / trailer framing.

### Two tiers of node
- **History commits** — small, **faint grey** points on the spine. Atmosphere and the passage of
  time (fire → industry → the internet → AGI …). Not individually clickable in this build.
- **Story nodes** — bright **cyan**, floating *off* the branch, each tethered by a thin line to its
  clip point on the timeline. These are the content (comics/songs). Hover reveals the title; click
  enters. Matches the "loose constellation" described in the hub doc.

### Palette & atmosphere
- **Black void · white spine · cyan glow = enterable · grey = history · monospace type.**
- **Fog** (depth-based) hides far branches until you approach — this makes arriving at the fork a
  reveal rather than a given.
- A **cyan accent light** pulls focus; selective **bloom** post-processing makes the cyan read as
  emissive/alive.
- Sparse **starfield** + subtle **grain** for the "floating in space" feel.
- Motion serves the narrative only — no gratuitous spins or particle bursts.

### Branch tips
The two epic tips (**Storyverse**, **Future Proof**) are larger destination markers at the end of
each parallel run, flyable-to and clickable through to their pages.

## 3. Navigation — one rig, three drivers

A single camera-position scalar **`t ∈ [0, 1]`** samples the path. All input writes to `t`; the
camera always stays on the path (no free-roam orbit). A look-at target follows a parallel target
track so each segment stays composed like a deliberate "shot".

| Driver | Mode | Mechanism |
| --- | --- | --- |
| **Scroll** | explore (default) | drei `ScrollControls` / `useScroll` sets `t` ~1:1, lightly damped |
| **Waypoint** | cinematic | GSAP tweens `t` to an authored stop (start · fork · bad tip · good tip · any node) |
| **Autoplay** | trailer / attract | GSAP runs `t` from 0→1 on a clock |

Authored **waypoints** (their `t` values) live in the graph data file (§6).

## 4. Opening sequence (D → B)

A single GSAP timeline, skippable, that respects reduced-motion (jumps straight to the static
overview):

1. Pure black → wordmark **BADCODE** + `git push origin master`.
2. The two-step narrator line **types on**:
   *"humans, you done fucked up… thankfully you are loved, and we can fix it."*
3. The commit line **draws itself** from the first commit toward the fork (the repo materialising).
4. Settles into the establishing **overview** (whole trident framed), then hands control to the user.

## 5. Entering a story & routing

### Transition (model A — fly-in to full page)
Click a node → camera **dives into** the cyan node → brief cyan **glow-out** → the story takes the
full screen at its route. A quiet `← timeline` affordance (and browser Back) **re-emerges** the
camera at that same node, preserving place. URLs are real and shareable.

For **Camping**, the route renders the existing self-contained `CampingComic` (`<ScrollComic>`)
untouched.

### Routes (`react-router-dom`)
| Path | Renders | This build |
| --- | --- | --- |
| `/` | 3D graph homepage (or 2D fallback) | real |
| `/comics/:slug` | comic page | `camping` → real `CampingComic`; others → in-aesthetic **stub** |
| `/storyverse` | Storyverse epic page | real (in-aesthetic landing/lore page) |
| `/future-proof` | Future Proof epic page | real (in-aesthetic landing/lore page) |
| `/about` | manifesto / about page | real (the fiction, the fork metaphor, the mission) |

Every node on the graph resolves to a real route. Unbuilt comics render a minimal in-aesthetic
placeholder (title + "coming soon"); the two epic tips and About are real pages.

## 6. Architecture & data

### Single source of truth
One declarative **`graph` data file** is the spine of both the 3D scene and the 2D fallback:

```ts
// shape, illustrative
type Branch = 'history' | 'bad' | 'good'
type NodeStatus = 'live' | 'coming-soon'

interface StoryNode {
  id: string            // e.g. 'camping'
  title: string         // e.g. 'Camping'
  branch: Branch        // which branch it clips to
  t: number             // position along the path [0,1]
  route: string         // e.g. '/comics/camping'
  status: NodeStatus
}
```

Plus the branch path definitions, the history-commit positions, and the named waypoints. Story nodes
can borrow `id`/title from each comic's existing `comic.meta.ts` (e.g. Camping's `id: 'camping'`) so
metadata is not duplicated.

### File layout (new `apps/web/src/home/`)
- `graph.ts` — the data model above (branches, commits, nodes, waypoints).
- `Scene.tsx` — the r3f `<Canvas>` and scene assembly.
- `CameraRig.tsx` — the `t` scalar, path sampling, look-at, and the three drivers.
- `Spine.tsx` — branch lines + faint history commits.
- `Constellation.tsx` / `Node.tsx` — story nodes, tethers, hover labels, click → navigate.
- `BranchTip.tsx` — the Storyverse / Future Proof destination markers.
- `Narration.tsx` — the type-on narrator line(s) overlay.
- `Chrome.tsx` — persistent UI: wordmark, `← timeline`, overview/skip control, About link.
- `OpeningSequence.tsx` — the GSAP draw-in timeline.
- `Fallback2D.tsx` — the static SVG/DOM fork (§7).

### Route pages (new `apps/web/src/routes/`)
`Home.tsx` (chooses 3D scene vs `Fallback2D`), `ComicPage.tsx` (resolves `:slug` → real comic or
stub), `Storyverse.tsx`, `FutureProof.tsx`, `About.tsx`, plus a `ComicStub.tsx` placeholder.

### App shell
`apps/web/src/App.tsx` becomes a `react-router` router. `/` renders the home scene; other paths render
their pages. `@badcode/comic`, `@badcode/comic-meta`, and `CampingComic` are **not modified**. The 3D
bundle is **lazy-loaded** so comic/stub/text pages stay light.

## 7. 2D fallback & accessibility

A static, fully navigable **SVG/DOM** rendering of the bent fork — the same visual language as the
3D scene — driven by the **same `graph` data**. Served when any of: `prefers-reduced-motion`,
WebGL unavailable, or a low-power/mobile-lite path.

- Story nodes are real links → the same routes.
- The narrator two-step line is shown statically.
- Keyboard-navigable nodes with visible focus states; no motion traps (WCAG 2.3.3 /
  `prefers-reduced-motion`).
- The opening sequence is skipped; the overview is shown immediately.

## 8. Tech stack

| Layer | Choice |
| --- | --- |
| 3D | `@react-three/fiber` + `@react-three/drei` |
| Glow | `@react-three/postprocessing` (selective **bloom** on emissive cyan) |
| Camera path | `three` `CatmullRomCurve3` + single `t` scalar; three drivers write to `t` |
| Sequencing | **GSAP** (timelines for waypoint tweens, autoplay, opening draw-in, fly-in) |
| Scroll | drei `ScrollControls` / `useScroll` |
| Routing | `react-router-dom` |

Fits the existing Vite + React 18 + TS workspace. New deps are confined to `@badcode/web`.

## 9. Scope

**In scope (this build):**
- 3D graph homepage with the bent-fork geometry, two-tier nodes, palette/atmosphere.
- Opening sequence (D → B).
- Navigation: scroll / waypoint / autoplay over one camera rig.
- Camping wired **end-to-end** (node → fly-in → existing comic → back).
- Storyverse + Future Proof pages (in-aesthetic).
- About page.
- Stub routes for every other node.
- 2D fallback + accessibility.

**Out of scope (explicit):**
- Building the Karen / Emperor's Coin / good-branch comics themselves.
- The seamless-zoom transition (model C) — a possible future evolution.
- Music/audio.
- The per-story AI agents (separate parallel project).

## 10. Testing

- **Unit (vitest, matching the repo pattern):** path/`t` math (sampling, waypoint lookup), `graph`
  integrity (every node has a resolvable route; branch/`t` in range), route resolution
  (slug → comic vs stub).
- **Manual / smoke:** a smoke render of the scene; visual check of the opening, transition, and
  branch travel.
- **Fallback:** verified under forced `prefers-reduced-motion` and a no-WebGL path.

## 11. Risks & open items

- **Camera framing through the angular elbows** at travel speed — mitigate with per-segment look-at
  tuning (each segment is a composed shot).
- **Bloom + fog perf budget** on mid-range mobile — mitigate with the 2D fallback and (if needed)
  quality tiers.
- **Node `t`-positions are hand-authored** in `graph.ts` — acceptable at this scale; revisit if the
  constellation grows large.
- **History-commit content** (which moments, how many, whether ever labelled) is left deliberately
  sparse and is a content decision, not a blocker for the skeleton.
