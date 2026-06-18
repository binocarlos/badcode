# Comic visual-effects palette — research reference

> Background-researched 2026-06-18 for the comic effects creative-direction work.
> This is the raw technique catalog (a reference); the curated, vision-filtered
> direction lives in
> [`../superpowers/specs/2026-06-18-comic-effects-creative-direction-design.md`](../superpowers/specs/2026-06-18-comic-effects-creative-direction-design.md).
> Note: this catalog includes loud glitch/datamosh techniques that the chosen
> "clean cinematic" direction demotes to rare, deliberate exceptions.

## How techniques map to our two hooks

- **`Effect.apply(el, scrollPercent)`** — runs every rAF on one page's widget element, mutates inline style only. Great for CSS `transform`/`filter`/`clip-path`/`opacity`/custom-properties and for *driving* a parameter into an attached SVG/WebGL layer. Cannot read pixels or composite two layers.
- **`Transition.run(out, inc, direction)`** — fires on page-change, animates the two page layers via WAAPI. Great for any two-layer DOM animation. Cannot sample both layers' pixels into a shader (a true gl-transition needs the two pages as *textures*).

Three recurring tiers: (1) **CSS/SVG-filter** — fits hooks directly, ships today; (2) **SVG-filter-driven** — hook animates a CSS var / filter param, inline `<svg><filter>` does the work; (3) **Canvas/WebGL** — needs a NEW primitive: a `<canvas>` widget that samples image/video sources as textures (the hook drives uniforms, but the surface is new).

## 1. Transitions beyond the basics
- **GL-transitions catalog** (~80+ named GLSL `vec4 transition(uv)` shaders mixing from/to by `progress`). On-brand entries: GlitchDisplace, DoomScreenTransition, pixelize, Mosaic, crosswarp, directionalwarp, FilmBurn, InvertedPageCurl, CrossZoom, LinearBlur, Dreamy, morph, ripple. Needs the WebGL primitive but is a *bulk* unlock. Lightest path: **ogl** (~5KB) or `gl-transitions` npm. Use existing renditions as textures. NEW primitive behind the existing `Transition` interface.
- **SVG displacement-map dissolve** — `feTurbulence`→`feDisplacementMap` melts the outgoing page. Fits existing hooks; `feDisplacementMap` is expensive — keep short, animate only `scale`, fall back on low-end / reduced-motion.
- **RGB channel split / chromatic aberration** — CSS (`::before/::after` tinted + `mix-blend-mode:screen` + offset) or SVG (`feColorMatrix`+`feOffset`+`feBlend`). Low cost, mobile-safe. Effect and/or Transition. No new primitive.
- **Datamosh / pixel-sort / block-glitch** — true versions need pixel access (Canvas `getImageData`, slow); a WebGL *fake* (block displacement via noise) is ~90% the look and is basically GlitchDisplace. NEW primitive (subsumed by GL catalog).
- **Page-curl / fold** — GL catalog or CSS-3D `rotate3d`+shadow fake. Weak brand fit (paper is analog).
- **Liquid / morph / metaball reveal** — WebGL noise+mask, or cheaper SVG `feTurbulence`-distorted `clip-path`. Scene "boots up" from a point.
- **Light-leak / film-burn** — gradient/flare overlay, `mix-blend-mode:screen`, WAAPI opacity. Low cost, fits Transition hook today.
- **Camera push-in & depth/parallax 2.5D** — push-in is pure CSS transform (fits today, CrossZoom-style). True depth = authored layers (multiple ImageWidgets) or a depth-map shader.

## 2. Speech-bubble / lettering presentation
- **Typewriter** — map `scrollPercent`→char count or a `ch`-width clip-path. Scroll-linked version is most on-brand. Low. Effect/mount.
- **SVG stroke draw-on** — `stroke-dasharray=stroke-dashoffset=getTotalLength()`, animate offset→0. Strong synergy with `RoughBubble` (rough.js emits `<path>`s). Highest-value lettering item given the rough renderer. Med.
- **Comic "pop" (overshoot/squash)** — scale from ~0 with back/elastic, `transform-origin` at the tail. Low. Mount on bubble visibility.
- **Jitter/wobble** — sub-pixel rAF sine on transform; unease. Low. Effect.
- **Kinetic typography** — per-word/letter emphasis (sans-serif + tracking for legibility). Reuse `text/segments.ts` spans. Med.
- **Tail morphing** — animate SVG `d` so the tail re-points as you scroll. Niche. Med.
- **Onomatopoeia/SFX lettering** — big "BRAAP"/"CRASH" burst+shake+chromatic-split, beat-triggered. Combo of pop+jitter+RGB-split. Low–Med. On-brand for DnB drops.

## 3. Image/video post-processing
- **CSS filters & blend modes** — contrast/saturate/hue-rotate/sepia/invert + `mix-blend-mode`. Inline style = hooks' native language. Low, great perf. Effect today.
- **SVG filters** — turbulence heat-haze, displacement warp, lighting for fake relief. Drive params via CSS var from an Effect. Med; displacement/lighting heavy — scope small.
- **Canvas 2D pixel manipulation** — posterize/threshold/dither/pixel-sort via getImageData. Per-frame too slow; one-shot stills / low-res only. NEW primitive.
- **WebGL shader passes** — halftone/dot-screen, CRT/scanline+barrel, chromatic aberration, posterize/duotone, bloom, film grain, ASCII/dither. `pmndrs/postprocessing` merges many into one pass. Drive uniforms from Effect. NEW primitive; low per-pass after.
- **Film grain / vignette (cheap subset)** — animated noise overlay + radial darkening; doable WITHOUT WebGL (tiling noise / SVG feTurbulence + `mix-blend-mode:overlay`). Low. Worth doing early.
- **Depth-map parallax from one image** — ship a grayscale depth map per panel; shader displaces UVs by depth × pointer/scroll. **PixiJS `DisplacementFilter`** is the ~2-line version. Huge perceived-quality lift, mobile-fine; generate depth maps offline (asset-pipeline pass).

## 4. Interactivity
- **Pointer-parallax** — layers shift opposite cursor. CSS (Low) or depth shader (Med). Needs a pointer-aware Effect context.
- **Mouse-reactive displacement/ripple** — cursor drags a liquid distortion. WebGL/Pixi, pointer uniform. Med.
- **Scroll-velocity → intensity** — fast scroll = more effect; track `deltaScroll/dt` in `useScrollEngine`, expose `velocity`. Low, high-leverage. Extend Effect context.
- **Drag-to-reveal / scrub** — drag to wipe one image into another, or scrub AnimationWidget frames. Med. New interactive-panel primitive.
- **Hover hotspots** — hover regions reveal AI margin notes / trigger SFX. Low. Component-level.
- **Device-orientation tilt** — phone tilt → parallax (iOS needs gesture permission). Feeds the pointer/offset channel.
- **UX pattern:** default passive scroll; promote to interactive only at marked beats, then hand control back. Velocity-reactive intensity is the connective tissue.

## 5. Audio-reactive (drum & bass)
- **AnalyserNode bands → params** — `AudioContext`→`<audio>`→`AnalyserNode` (fftSize 2048); split sub/bass/mid/high; map energy to params. One module owns the analyser, writes `bandLevels` to shared state each rAF; Effect loop reads it. `getFloatTimeDomainData` snappier than smoothed frequency for "punch." Med (plumbing + autoplay gating).
- **Beat detection** — spectral-flux / energy-threshold, or bandpass ~100–800Hz for the kick. Libs: `web-audio-beat-detector` (BPM), `stasilo/BeatDetector` (real-time). Beat event bus → fire transitions / SFX lettering.
- **Scroll ↔ audio timeline** — map scroll→track time (scrub) or drive scroll from `currentTime` (auto-play = music video). Prefer playback-locked over scrubbing. Engine-level mode.

## 6. Libraries & references
| Tool | Use | Verdict |
| --- | --- | --- |
| **Lenis** (~3KB) | smooth/inertial scroll, scroll↔raf sync | Adopt — de-janks the engine |
| **GSAP + ScrollTrigger** | timeline scrub/pin/reverse | Strong for audio-timeline sync; heavier dep |
| **ogl** (~5KB) | minimal WebGL: single-quad passes + gl-transitions runner | Best low-cost path to the WebGL primitive |
| **PixiJS** | 2D WebGL w/ filters; `DisplacementFilter` makes depth-parallax trivial | Great if you want filters fast; heavier |
| **three.js + pmndrs/postprocessing** | stacking many post-FX in one pass | Only if committing to a rich shader stack |
| **curtains.js** | maps DOM elements to WebGL planes — shaders over existing DOM | Worth evaluating: shaders wrap existing widgets |
| **WAAPI** | current transition engine | Keep — right tool for DOM transitions |
| **theatre.js / motion-canvas** | timeline authoring | Authoring aids, optional |
| **scrollama** | step/waypoint triggers | Lighter than GSAP if you only need "fire at page N" |
| **gl-transitions npm** | the catalog as data | Pair with the ogl runner |

**Creative references:** Marvel Infinity Comics & webtoon vertical-scroll paneling ("controlled revelation," beats timed to scroll, whitespace as pause); Codrops (WebGL transitions, GSAP shader ripples, ASCII-dither); Awwwards WebGL collections; the GL Transitions live editor.

## Top 10 highest-leverage additions (impact × low cost)
1. **Scroll-velocity → effect intensity** — `effect` (extend Effect context with `velocity`). Highest ROI.
2. **Audio band/beat input channel** — `effect` (+ Transition triggers on beat). Defining BadCode feature.
3. **RGB channel-split / chromatic aberration (CSS+SVG)** — `effect`/`transition`. Ships today, mobile-safe.
4. **Film grain + vignette overlay (SVG/CSS)** — `effect`. One cheap "degraded transmission" coat.
5. **SVG displacement-map dissolve** — `transition`. Pages melt instead of fade.
6. **SVG stroke draw-on lettering** — `effect`/mount. Rough bubbles write themselves.
7. **Scroll-linked typewriter + beat-timed SFX lettering** — `effect` + audio trigger.
8. **WebGL panel primitive (ogl) + gl-transitions runner** — `new-primitive` behind the Transition interface. Keystone — unlocks 9 & 10.
9. **Halftone / duotone / CRT-scanline post-FX pass** — `new-primitive` (on 8).
10. **Depth-map single-image parallax** — `new-primitive` (8 or PixiJS) + pointer/scroll/tilt.

**Architectural keystone:** items 8–10 share one need — a `<canvas>`-backed widget that takes renditions as GL textures and exposes uniforms the Effect hook drives (and can transition between two textures). Build that once (ogl lightest) and the bottom half becomes incremental. The **top 7 need no new primitive** — only a small extension of the Effect context to carry `{ velocity, pointer, audio }`.
