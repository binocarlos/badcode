# Homepage tuning — iteration 1 (feedback pass) — design

**Date:** 2026-06-03
**Status:** approved design, ready for implementation planning
**Builds on:** [`2026-06-03-gitpush-homepage-design.md`](./2026-06-03-gitpush-homepage-design.md) and the
shipped 3D homepage. Tunes the existing scene; does not re-architect it. `@badcode/comic`,
`@badcode/comic-meta`, and `CampingComic` stay untouched.

## Context

The 3D homepage is live and merged. A human browser pass surfaced seven items — five clear
fixes and two design decisions, now decided:

- **Branch tour:** *Retrace to the fork.* One continuous scroll path threads both prongs: shared
  history → up the bad branch → Storyverse → **rewind back through the fork** → down the good branch
  → Future Proof. The fork (the decision point) is felt twice — the most on-theme reading of GitPush
  Origin Master.
- **Opening:** *Self-assembling fork.* The camera stays locked on the wide establishing shot; the
  history line draws, then the bad branch grows, then the good branch grows — the whole fork builds
  itself in front of the viewer. No camera move during the opening; travel begins when the user
  scrolls.

## Fixes (grouped by where they live)

### A. Data & geometry — `apps/web/src/home/graph.ts`, `path.ts`

**A1. The retrace tour.** `tour` becomes a single polyline that goes out the bad branch, doubles
back through the fork, and out the good branch:

```
history(-30..0) → BAD_ELBOW[6,6] → [18,6] → BAD_TIP[30,6]
              ↩ [18,6] → BAD_ELBOW[6,6] → FORK[0,0]
              → GOOD_ELBOW[6,-6] → [18,-6] → GOOD_TIP[30,-6]
```

**A2. Centripetal spline.** Switch the camera curve in `path.ts` from `CatmullRomCurve3` tension-0
to **centripetal** (`curveType: 'centripetal'`). A tension-0 curve cusps and overshoots on the sharp
Storyverse turnaround and the fork pass-through; centripetal stays inside its control points (no loop,
no overshoot beyond the tips).

**A3. Recompute node + waypoint `t`.** The path is now ~2.7× longer, so every normalized `t` shifts:
- Bad-branch story nodes (`camping`, `karen`, `emperors-coin`) land in the **first third**.
- `optimistic-lens` (good branch) gets a **real `t`** near the end (currently `0`).
- `waypoints.storyverse` ≈ the tour **midpoint**; `waypoints.futureProof` becomes a real tour
  **`t = 1`** (no more `'pose:good-tip'` sentinel). `waypoints.fork` = the rewind/decision crossing.
- All node `t` must stay in `[0,1]` and increase monotonically along the authored order.

**A4. Constellation spacing (fix #7).** Stagger node `pos.y` and label anchors so titles stop
colliding: e.g. `camping y≈10`, `karen y≈14`, `emperors-coin y≈10.5` (their `x` is already spread);
`optimistic-lens y≈-11`. Varied tether lengths also read more like a loose constellation.

### B. Opening — `apps/web/src/home/OpeningSequence.tsx`, `Spine.tsx`

**B1. Staged self-draw, no snap (fix #2).** Replace the history-only `drawProgress` plus the
`drawProgress > 0.98` branch **pop** with a single staged draw over one `drawProgress 0→1` (~3s,
eased):
- history draws in `[0, 0.40]`
- bad branch grows in `[0.40, 0.72]`
- good branch grows in `[0.72, 1.0]`

Each `Line` is truncated by its own normalized slice using the existing `setPositions`
point-slicing technique already in `Spine.drawnHistory`. History commit spheres fade/appear as the
draw front passes their `x`. No `branchesVisible` boolean gate — the branches are always mounted and
simply drawn from a single head point upward. Camera holds the wide overview the whole time.

### C. Camera — `apps/web/src/home/CameraRig.tsx`

**C1. One eased handoff, gentler rotation (fix #3).** Add a **persistent smoothed look-at target**
(a module `Vector3` lerped toward the desired look point each frame, never snapped to `ahead`).
Unify the intro→travel handoff so both camera position and the smoothed look-at target are damped
with the same frame-rate-independent factor — leaving the overview and starting to travel becomes
one continuous ease rather than the current "two tweens" (intro framing tween, then travel tween).
Soften the push-in / height offset so the angle swing on the first scroll is gentle.

### D. Chrome & interaction — `Chrome.tsx`, `StoryNode.tsx`, `drivers.ts`

**D1. Play / stop (fix #5).** `play` first resets to the very start (`t → 0` / scroll to top), then
sweeps the **whole** tour (both branches), duration scaled to the longer path (~18s). The button is a
**toggle**: `play` ↔ `stop`. `stop` kills the active tween and leaves the camera where it is
(`mode = 'travel'`). Track the active tween + a `playing` React state in `Chrome`.
Optionally add a `future proof` chrome button now that it is a real tour waypoint.

**D2. Reliable 3D clicks (fix #6).** Every story node already navigates (`enter()` runs for live and
coming-soon alike — coming-soon → its stub route). Add an **invisible larger hit-sphere** (~radius
1.2, `meshBasicMaterial` transparent with `opacity 0`, `depthWrite={false}`) concentric with each
node's visible sphere so small/far targets are easy to click and hover. Keep the visible sphere
sizes. Hover/click handlers move to the hit-sphere.

### E. Tooling — `tsconfig.base.json`

**E1. Deterministic editor resolution.** The Zed `ts2307 Cannot find module '@badcode/comic-meta'`
is **editor-only** — `tsc --noEmit` in `apps/web` is already clean (the package resolves via the
workspace symlink under `moduleResolution: bundler`). Add an explicit mapping so resolution does not
depend on symlink timing in any editor's TS server:

```jsonc
"baseUrl": ".",
"paths": { "@badcode/*": ["packages/*/src"] }
```

(`@badcode/comic` → `packages/comic/src`, `@badcode/comic-meta` → `packages/comic-meta/src`,
`@badcode/cli` → `packages/cli/src`.) Must keep `npm run typecheck` clean across all workspaces.

## Testing

- **Unit (vitest, node env — matches repo pattern):**
  - `graph.test.ts`: the retrace `tour` has the expected point sequence (out-and-back through the
    fork); every story-node `t ∈ [0,1]`; node `t`s increase monotonically in authored order;
    `optimistic-lens.t > 0`; `waypoints.futureProof` is a number `≈1`.
  - `path.test.ts`: centripetal sampling stays within the geometry bounds — no sampled point's `|x|`
    or `|y|` exceeds the tip extents (catches overshoot/loop on the turnaround).
- **Manual / browser visual pass** (the motion items have no pure surface): staged opening self-draw
  (history → bad → good, no snap); first-scroll handoff is one gentle ease (no violent rotation);
  full scroll travels out the bad branch, back through the fork, down the good branch to Future
  Proof; `play` restarts from the top and `stop` halts it; all three bad-branch nodes click through;
  labels no longer collide; reduced-motion still serves the 2D fallback.

## Scope

**In scope:** the seven fixes above (A1–E1).
**Out of scope:** building the Karen / Emperor's Coin / good-branch comics; the seamless-zoom
transition (model C); audio; the per-story AI agents (separate project); any change to
`@badcode/comic`, `@badcode/comic-meta`, or `CampingComic`.

## Risks

- **Spline behaviour on the retrace** is the main risk — the out-and-back through the fork must not
  loop or overshoot the tips. Centripetal Catmull-Rom (A2) is the mitigation; the `path.test.ts`
  bounds check (above) is the guard. If centripetal still cusps unacceptably, fall back to an
  explicit per-segment polyline with arc-length parameterisation.
- **Re-derived `t` values are hand-tuned** against the new path length; the monotonicity + range
  tests catch gross errors, but the exact fly-to framing is confirmed in the browser pass.
