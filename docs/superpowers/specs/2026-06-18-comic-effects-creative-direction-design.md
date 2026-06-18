# Comic effects — creative direction + roadmap

> Design spec. Status: approved direction + Phase 1 scope, 2026-06-18.
> This is a **direction + roadmap** doc, not a single build. Phase 1 (Tier A
> foundations) is specified for an implementation plan; later phases are the
> roadmap. Raw technique catalog:
> [`../../comics/effects-palette-research.md`](../../comics/effects-palette-research.md).
> Builds on the SP1 library ([`packages/comic/AUTHORING.md`](../../../packages/comic/AUTHORING.md)).

## Creative direction

The throughline, decided in brainstorming:

> **The reader is the projectionist of a film transmitted from a broken future.**

Four pillars:

1. **Cinematic spine, scripted touch-points.** Plays like a motion-comic/title
   sequence as you scroll, with ~2–3 deliberate "reach out and touch the machine"
   interactive beats per comic — not a toy poked continuously.
2. **Clean cinematic identity — restraint is the brand.** Depth, parallax, slow
   push-ins, elegant dissolves; effects are invisible servants of art and story.
   Distinctiveness comes from voice, story, and music — not visual gimmicks.
   Glitch/datamosh/RGB-split/halftone exist in the library only as **rare,
   deliberate exceptions**, never defaults.
3. **Everything is scrubbed by scroll.** Effects, transitions, and dialogue
   reveal are continuous functions of scroll position. Stop scrolling, it pauses.
4. **Sound serves the beats.** Optional drum & bass bed (reader hits play) plus
   scroll-triggered SFX stings. Music stays musical — never scrubbed.

This direction is the filter for every future effect: if it shouts, it's an
exception, not a default.

## Architecture: the two-tier split

The research's key finding, mapped to our hooks (`Effect.apply(el, scrollPercent)`
mutates one widget's inline style every frame; `Transition.run(out, inc, dir)`
animates two page layers via WAAPI):

- **Tier A — no new rendering primitive.** Everything expressible as CSS
  `transform`/`filter`/`clip-path`/`opacity` or DOM animation. Fits the existing
  hooks. The one enabling change is widening the **Effect context** from a bare
  `scrollPercent` to `{ scrollPercent, velocity, pointer, audio }` (added
  back-compatibly). Ships the entire clean-cinematic spine with zero WebGL,
  mobile-safe.
- **Tier B — one keystone primitive.** A `<canvas>`-backed WebGL widget (via
  **ogl**, ~5KB) that takes our existing image/video renditions as GL textures
  and exposes uniforms the `Effect` hook drives, and can transition between two
  textures behind the existing `Transition` interface. Built once, it unlocks
  depth-map parallax, restrained shader grades, and shader transitions
  incrementally. **Deferred — not Phase 1.**

## The palette (roadmap)

### Tier A — cheap, on-vision, no new primitive
| # | Addition | Kind | Phase |
| --- | --- | --- | --- |
| A1 | Extend Effect context with `{ velocity, pointer, audio }` (velocity populated now; pointer/audio shape reserved) | engine | **1** |
| A2 | Scroll-scrubbed bubble/text reveal — bring `SidePanelText`'s `reveal` segments to `SpeechBubble`, plus a scroll-scrubbed typewriter | effect | **1** |
| A3 | Cinematic transitions: slow push-in (CrossZoom-style), dip-to-black, light dissolve | transition | **1** |
| A4 | Film-grain + vignette global overlay — the "degraded transmission" coat (SVG/CSS) | effect | **1** |
| A5 | Pointer-parallax for the "touch the machine" moments (CSS layers; populates `pointer`) | effect | 2 |
| A6 | Audio layer: DnB bed (play button) + scroll-triggered SFX stings (populates `audio`) | new (light) | 2 |

### Tier B — keystone primitive + what it unlocks (deferred)
| # | Addition | Kind |
| --- | --- | --- |
| B1 | ogl `<canvas>` panel primitive (textures + uniforms, behind existing hook shapes) | new-primitive |
| B2 | Depth-map single-image parallax — signature 2.5D dolly; adds a depth-map pass to the asset pipeline | effect (on B1) |
| B3 | Restrained shader grade/transitions (subtle DOF, soft bloom, duotone, LinearBlur/Dreamy dissolves) | effect+transition (on B1) |

### Exceptions kept available, never default
RGB channel-split / chromatic aberration, SVG displacement-map dissolve, datamosh-fake, halftone/CRT — shipped as named effects/transitions for the rare "the machine intervenes" beat, documented in AUTHORING.md as loud-by-design.

## Phase 1 scope (Tier A foundations) — for the implementation plan

### A1 — Effect context extension (back-compatible)
- Today: `EffectInstance.apply(el: HTMLElement, scrollPercent: number)`.
- Change: pass an optional third arg — `apply(el, scrollPercent, ctx?)` — where
  `ctx: EffectContext = { scrollPercent: number; velocity: number; pointer: { x: number; y: number } | null; audio: { bass: number; mid: number; high: number; beat: boolean } | null }`.
  `scrollPercent` stays the 2nd positional arg so every existing effect and
  every `defineEffect((el, p) => …)` keeps working untouched; new effects opt in
  to the 3rd arg.
- The engine (`useScrollEngine`/`useScrollEffect`) computes **`velocity`** =
  smoothed `|Δscroll| / Δt` (a pure helper, unit-tested). `pointer` is `null`
  until A5; `audio` is `null` until A6 — the shape is fixed now so A5/A6 don't
  re-break the signature.
- `defineEffect`'s `apply` type widens to accept the optional `ctx`.

### A2 — Scroll-scrubbed bubble + text reveal
- `SpeechBubble` already reads page scroll (`useScrollProgress`) and gates via
  `computeBubbleVisibility({ appearAt, fade })`. `SidePanelText` already has the
  `reveal={[scrollIn(), pause(), fadeOut()]}` segment engine (`text/segments.ts`,
  `buildTextConfig`, `computeTextStyles`). A2 unifies them:
  - **A2a:** `SpeechBubble` gains `reveal?: RevealSegment[]`. When present, the
    bubble's motion/opacity is driven by the existing scroll-linked text-effect
    engine (scrollIn/scrollOut/fadeIn/fadeOut/pause/buffers) keyed to the
    bubble's window, instead of the simple `appearAt`+`fade` path. `appearAt`/
    `fade` remain as the legacy default (no breakage).
  - **A2b:** a scroll-scrubbed **typewriter** — a new `RevealSegment` (e.g.
    `typeIn()`) that reveals the bubble's text word-by-word as a function of
    local scroll progress across the bubble's window (the reader scrubs the line
    in). Requires splitting the bubble's text children into word spans.
- Keep the `RoughBubble`/`CleanBubble` renderers unchanged; A2 is a reveal/mount
  concern layered over them.

### A3 — Cinematic transitions
- Add to `transitions/builtins.ts`, all pure DOM/WAAPI behind the existing
  `defineTransition` shape (no new primitive):
  - `pushIn({ duration?, scale?, focal? })` — outgoing scales/translates toward a
    focal point as incoming emerges (CrossZoom-style slow dolly).
  - `dipToBlack({ duration? })` — outgoing fades to black, then incoming fades up
    from black (two-stage).
  - `lightDissolve({ duration? })` — a soft, slightly-overlapping cross-dissolve
    distinct from the existing hard `crossfade`.
- Export from `transitions/index.ts`; add to the AUTHORING.md catalog.

### A4 — Film-grain + vignette overlay
- A single global overlay layer in `ScrollComic` (above pages, below the
  progress/indicator UI), opt-in via props (e.g. `<ScrollComic grain vignette>`
  or a `grade` prop). Animated film grain via tiling noise / SVG `feTurbulence`
  with `mix-blend-mode: overlay` at low opacity, plus a radial vignette.
- Animate grain cheaply (shift noise position per frame, do **not** regenerate
  turbulence each frame). Honor `prefers-reduced-motion` (static grain or off).
  Optionally let grain intensity track `velocity` from A1 (tasteful, subtle).

### Phase 1 testing
- **Unit (pure helpers):** `computeVelocity(prevPercent, currPercent, dtMs)`
  smoothing/clamping; the A2b word-count-from-progress function; any A4
  intensity-mapping function. (vitest, alongside `bubbles/visibility.ts` tests.)
- **Type/compat:** existing effects and `defineEffect((el,p)=>…)` callers still
  typecheck and run (the 3rd ctx arg is optional). `npm run typecheck`.
- **Build + existing suites green:** `npm run build`, `npm run test --workspace @badcode/comic`.
- **Manual (human):** the scroll-scrubbed bubbles, push-in/dip-to-black, and the
  grain coat verified at a comic route — autonomous agents can't eyeball motion.

## Guardrails (how it stays "clean")
- Restrained defaults: new transitions are slow and soft; grain ships low-opacity.
- Everything new is opt-in per page/bubble/comic; nothing changes existing comics
  unless they adopt it.
- Performance budget: Tier A is transform/filter/opacity only (GPU-cheap); no
  per-frame pixel reads. `feDisplacementMap`/`feTurbulence` kept short and capped.
- Accessibility: honor `prefers-reduced-motion` for grain, typewriter, and any
  velocity-driven intensity.
- Mobile-safe: no WebGL in Phase 1; grain/vignette degrade gracefully.

## Out of scope (later phases / other efforts)
- A5 pointer-parallax, A6 audio layer (Phase 2).
- All of Tier B (the ogl primitive, depth-map parallax, shader grades) and the
  asset-pipeline depth-map pass.
- Scroll↔audio-timeline sync / auto-play "music video" mode.
- Adopting Lenis for smooth scroll (evaluate separately; not required for Tier A).
