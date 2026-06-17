# Progressive Comic Loading — Design Spec

**Date:** 2026-06-16 · **Revised:** 2026-06-17 (animations → video)
**Status:** Approved design. Static-image pipeline (Plan 1) shipped to `main`. Animation strategy revised — see below.
**Scope:** `@badcode/comic` runtime + a path-based offline asset pipeline

> **Revision note (2026-06-17).** A WebCodecs spike (`apps/web/public/spike/`) proved
> that scrubbing a single small **video** per animation — decoded to `<canvas>` via
> WebCodecs with windowed/on-demand GOP decode + LRU — is smooth and ~10× smaller than
> shipping hundreds of WebP frames (e.g. 732 KB video vs ~30 MB of frames for a 242-frame
> clip). **Animations are therefore now delivered as video, not frame sequences.** This
> document's animation sections (manifest `animations` map, pipeline video renditions,
> the `AnimationWidget`) reflect that change; the **static-image** half (ImageWidget,
> Sharp WebP tiers, ThumbHash) is unchanged and already shipped.

## Problem

The scroll-based comic viewer is sluggish. The comic at
`http://localhost:5173/comics/camping-jack-test` is the worst case: **56 pages,
3,540 full-resolution JPGs, 18 frame-sequence animations** (the source file alone
is 654 KB of inlined image URLs).

Page mounting is *already* windowed — `ScrollComic` only mounts `current ± 1`
pages and unmounts the rest (`packages/comic/src/components/ScrollComic.tsx`), so
the problem is **not** "every page in the DOM at once." The real costs are:

1. **Frame sequences** (`AnimationWidget`): up to ~100–200 full-res JPGs per page,
   swapped on `<img src>` during scroll with **no preloading, caching, or
   decoding**. Every scrub frame is a cold network + decode hit → jank.
2. **No resolution tiers**: every image is full-res, so a fast scroll always
   outruns the network and there is nothing on screen meanwhile.
3. **No placeholders**: pages are black until the full image lands.

This is the Apple-style scrollytelling image-sequence problem at ~50× the usual
scale (Apple's well-known AirPods animation is 65 frames; this comic has 3,540).

### Research basis

- Multi-resolution variants + WebP are the dominant lever: Apple's 65 PNGs at
  15.2 MB drop to ~1.7 MB as WebP (~90%). Decode cost (compressed → bitmap) is the
  true bottleneck for sequences, which is why canvas + pre-decoded bitmaps wins.
- **ThumbHash** (vs BlurHash) for instant placeholders: better quality at similar
  size, alpha support, and the manifest stores just the compact ~25-byte hash
  (base64, ~33 chars) which the runtime decodes to a data-URI client-side — zero
  extra network requests.
- **Sharp** is the standard offline/build-time resizer; it powers `vite-imagetools`
  et al. We use it directly because our assets live on GCS, not in the local build.
- **Video for animations (revised):** the animation frames were *extracted from video*
  (`video.mp4` still sits beside the frames in the bucket for some comics). Re-exploding
  temporally-compressed video into independent stills throws away the codec's biggest
  advantage. Scrubbing the video instead — via **WebCodecs → `<canvas>`** (decode frames
  in JS, draw the scroll-selected one) — is the robust modern technique; naïve
  `<video>.currentTime` scrubbing janks because seeking decodes from the nearest keyframe.
  Full HLS/DASH **adaptive bitrate was considered and rejected**: ABR targets linear
  playback and fights the decode-any-frame model for little gain on ~1–2 MB clips. We get
  the adaptivity that matters via **multiple renditions + client-side selection** instead.

## Goals

- No black frames: something is always on screen (ThumbHash placeholder instantly).
- Smooth scroll-scrubbing of animations from a single small video per animation,
  with bounded memory (windowed decode, never the whole clip resident).
- Adaptive quality: small phones pull a small rendition; big/hi-DPI screens with
  bandwidth get a crisp one — without slowing weak devices.
- Bounded memory for static images too: at no point is the entire image set decoded/mounted.
- Decouple the new BadCode comic system from the storyteller "comic ID" stack.

## Non-goals

- Extra formats (AVIF stills, AV1/VP9 video) — deferred; WebP for stills, H.264 for video for now.
- True adaptive-bitrate streaming (HLS/DASH) — rejected for the scrub model; we use multi-rendition selection.
- Rewriting the scroll engine, transitions, or effects — those stay as-is.
- The per-story AI-agent framework (separate project, per `CLAUDE.md`).
- Building the AI image-generation step (future; this design just makes the
  pipeline path-based so generated images drop into the same flow).

## Architecture overview

Two subsystems joined by **one contract: a path-keyed manifest**.

```
                 assets.manifest.json  (committed to repo, URLs → GCS)
                          │
   ┌──────────────────────┴───────────────────────┐
   │                                               │
A. OFFLINE PIPELINE                        B. RUNTIME LOADER
   badcode assets-build --src <subfolder>          createComic(manifest)
   STATIC IMAGES:                                  - resolve(path) → ImageAsset
   - Sharp → low (720w) + high (1920w) WebP        - resolveAnimation(path) → VideoAsset
   - ThumbHash → data-URI                          - ImageWidget: thumb→low→high
   ANIMATIONS (folders w/ video or frames):        - AnimationWidget: WebCodecs→canvas,
   - ffmpeg → 480/720/1080 H.264 renditions          windowed decode + LRU, rendition
   - poster WebP + ThumbHash                         select + low→high, <video> fallback
   - upload to derived/, emit manifest.json        - shared priority scheduler / eviction
```

The pipeline is **path-based and storyteller-agnostic** — it knows nothing about
comic IDs, scenes, or characters. It resizes static images and transcodes animation
folders into video renditions, then emits a manifest. The *comic code* references a
static image by its key, or an animation by its folder key.

## The contract — path-keyed manifest

A comic in the new system has a **base path**: an arbitrary GCS bucket subfolder
(e.g. `comics-v2/gpom-ep1/`). No comic ID, no `defineComic`, no storyteller schema.

The pipeline emits a manifest with two maps — `assets` (static images) and
`animations` (one entry per animation folder, replacing N per-frame entries):

```jsonc
// assets.manifest.json — committed next to the comic's code; URLs point at the bucket
{
  "basePath": "comics-v2/gpom-ep1",
  "assets": {
    "p1/main.png": { "thumbhash": "1QcSHQRnh493V4dIh4eXh1h4kJUI", // compact base64 raw hash; decoded client-side
                     "low":  "derived/p1/main.low.webp",
                     "high": "derived/p1/main.high.webp",
                     "width": 1600, "height": 900 }
  },
  "animations": {
    "p7/anim/<id>": {                                    // key = the animation folder
      "renditions": [
        { "height": 480,  "width": 854,  "proxy": "derived/p7/anim/<id>.480.mp4" },
        { "height": 720,  "width": 1280, "proxy": "derived/p7/anim/<id>.720.mp4" },
        { "height": 1080, "width": 1920, "proxy": "derived/p7/anim/<id>.1080.mp4" }
      ],
      "poster": "derived/p7/anim/<id>.poster.webp",      // first frame — instant paint + <video> poster + fallback still
      "thumbhash": "…",                                  // compact hash of the poster
      "width": 1920, "height": 1080,                     // SOURCE dimensions
      "frameCount": 242, "fps": 24
    }
  }
}
```

Runtime resolver — **no runtime fetch, no comic ID**:

```ts
import manifest from './assets.manifest.json'
const comic = createComic(manifest)
comic.resolve('p1/main.png')          // → ImageAsset (absolute GCS URLs)
comic.resolveAnimation('p7/anim/<id>') // → VideoAsset (absolute GCS URLs)
```

Descriptor types (live in `@badcode/comic`; manifest types in `@badcode/comic-manifest`):

```ts
type ImageAsset = {
  thumb:  string   // compact base64 ThumbHash, decoded to a data-URI at runtime ('' if not generated)
  low:    string   // absolute GCS URL (~720w WebP)
  high:   string   // absolute GCS URL (~1920w WebP)
  width:  number; height: number
}
type VideoAsset = {
  thumb:      string                                  // compact ThumbHash of the poster
  poster:     string                                  // absolute GCS URL (WebP)
  renditions: { height: number; width: number; url: string }[] // sorted asc; only rungs ≤ source height
  width:      number; height: number                  // source dimensions (aspect)
  frameCount: number; fps: number
}
```

**Graceful degradation:** a missing static key (or a bare string URL) renders as
high-only with no thumb/low; this keeps the SVG `camping` comic and hand-authored URLs
working through migration. SVGs are passed through (no raster tiers).

The manifest is the **single source of truth** for variants — a generated file,
not codegen into hand-authored metadata.

## A. Offline pipeline

The shipped command (extended for video):

```
badcode assets-build --src comics-v2/gpom-ep1 \
                     --manifest apps/web/src/comics/gpom-ep1/assets.manifest.json
```

**Scan + classify.** List everything under `--src` (recursive). Group into
**animation folders** (a folder containing a `video.mp4` *or* a numbered
`frame_NNN.*` run) and **static images** (everything else). Files inside an
animation folder are *not* processed as static images — the video covers them.

**Static images (shipped, unchanged):** **Sharp** → `low` (720w WebP, q≈70) +
`high` (1920w WebP, q≈80); **ThumbHash** from a ~100px downscale, stored as compact
base64 of the raw hash bytes (~33 chars), decoded to a data-URI at runtime.

**Animations (new):** for each animation folder, via **ffmpeg/ffprobe** (shelled
out, injectable for tests — same pattern as `gsutil`):

1. **Pick the source:** prefer the folder's `video.mp4` (original quality); if absent
   (frames-only comics), re-encode the numbered frames → video (`-i frame_%03d.jpg`).
2. **Encode the rendition ladder:** 480p / 720p / 1080p H.264, `-g 12 -keyint_min 12
   -bf 0 -crf 26 -an` (spike-proven: no B-frames ⇒ decode order = presentation order;
   keyframe every 12 ⇒ cheap windowed seeks). **Never upscale past the source** — a
   720p source yields only the 480p + 720p rungs.
3. **Poster + ThumbHash:** extract frame 0 → WebP poster; hash it.
4. **ffprobe** the source for `width`/`height`/`frameCount`/`fps`.
5. Emit one `animations` entry; no per-frame WebP.

**Upload** all derived variants under a `derived/` prefix; **emit** `manifest.json`
to `--manifest` (committed) and a copy to the bucket subfolder.

Properties: **idempotent** (skip when outputs + prior entry exist unless `--force`),
**concurrency-capped**, **dry-run**, SVG pass-through. WebP for stills, H.264 for
video (AV1/VP9 renditions deferred).

**On existing images:** the pipeline is path-based, so `--src` can point at a
`camping-jack-test` prefix today; migrating assets into a dedicated `comics-v2/` home
is a later, optional copy step.

Dependencies: `sharp`, `thumbhash` (Node, stills), `ffmpeg`/`ffprobe` (system
binaries, video — assumed present like `gsutil`), GCS client for list/upload.

## B. Runtime loader

New modules in `@badcode/comic`:
- `src/assets/` — `createComic`, `resolve`, `resolveAnimation` (manifest types from `@badcode/comic-manifest`).
- `src/loading/` — the shared image scheduler, bitmap cache, abort/eviction.
- `src/video/` — `VideoSource` (demux + windowed decode + LRU) and the rendition-selection helper.

### ImageWidget — progressive static images

Receives one `ImageAsset` and renders a three-stage stack inside its layer, each
stage fading in when ready:

1. **ThumbHash** (instant) — the compact hash is decoded client-side to a data-URI
   and painted as a blurred bitmap immediately. Never a black frame.
2. **Low** (~720w WebP) — fetched on mount; fades over the thumb once
   `img.decode()` resolves (decode off the display path).
3. **High** (~1920w WebP) — fetched when the page becomes *current*; swaps over low
   when decoded.

Existing `fit` / `objectPosition` props are preserved. Leaving the window aborts
in-flight low/high fetches.

### AnimationWidget — video scrubbed to canvas (WebCodecs)

Takes one `VideoAsset` (`comic.resolveAnimation(key)`) and renders to a single
`<canvas>`. Render model proven by the spike (`apps/web/public/spike/`):

1. **Instant paint:** ThumbHash → poster WebP, shown until the first decoded frame.
2. **Select a rendition** (pure helper): smallest rung whose `height ≥ viewportHeight
   × devicePixelRatio`, **capped** to 480p on `Save-Data`/slow `effectiveType`, 720p
   on `3g`. This is the "adaptive" lever — selection at load, not mid-stream ABR. It
   also bounds decode cost on weak phones.
3. **Low→high progressive upgrade:** immediately bring up a `VideoSource` on the
   **480p** rung for instant scrub; in the background fetch the *selected* higher rung
   and, once its `VideoSource` is ready, **swap the active source** and release the low
   one. (Skipped when the selected rung already is 480p.)
4. **Scrub:** `useScrollProgress()` → `frameIndex = round(progress × (frameCount−1))`
   → the active `VideoSource` draws that frame.
5. **Fallback (no `VideoDecoder`):** a plain `<video muted loop playsinline autoplay
   poster>` on the selected rendition — motion, not scrubbed.
6. **Lifecycle:** leaving the window aborts fetches and closes decoders + bitmaps.

**`VideoSource`** (one per rendition, the swappable unit): fetch the proxy → demux
with `mp4box` (extract codec description + the sample table) → on a scroll target,
**decode the target frame's GOP on demand** (feed its keyframe + deltas through a
`VideoDecoder`), cache decoded frames as `ImageBitmap`s, and **LRU-evict** GOPs beyond
a cap (resident frames stay bounded regardless of clip length). `drawFrame(i)` draws
the nearest available frame (progressive fill-in while a GOP decodes). The widget holds
just an *active* `VideoSource` and switches it on upgrade, staying thin.

### Loading orchestration — one scheduler

A shared loader for **static images** so we never fire a flood of requests at once
(animations are a single video fetch each, managed by their `VideoSource`):

- **Priority queue + concurrency cap** (~6 parallel). Tiers, high→low: current
  page's high → current-page low → current±1 low → idle prefetch of neighbors.
- **Wait for intent:** the first page loads eagerly (opening screen resolves
  fast); everything else is gated behind first scroll / `requestIdleCallback`.
  Nothing heavy happens if the user never scrolls.
- **Abort + evict:** leaving the window cancels in-flight loads (`AbortController`)
  and closes that page's bitmaps. A global decoded-bitmap budget triggers LRU
  eviction. `VideoSource`s do their own per-source decode-window eviction.

Dependencies: `thumbhash` (client, `thumbHashToDataURL`), `mp4box` (client, demuxing
proxies for WebCodecs). WebCodecs (`VideoDecoder`) is native; the `<video>` fallback
covers browsers without it.

## Migration & proof

- New widgets are descriptor-first with a bare-string fallback, so nothing breaks
  mid-migration.
- **Proof case:** run the extended pipeline against `camping-jack-test`'s prefix →
  manifest (static `assets` + `animations`) → switch its `ImageWidget`s to
  `comic.resolve(...)` and `AnimationWidget`s to `comic.resolveAnimation(...)`. As the
  worst offender (18 animations, 3,540 frames) it validates the design end-to-end.
- Note: `camping-jack-test`'s animations split — `a17f2cc4` folders have a source
  `video.mp4`; `bebf53aa` folders are **frames-only**, exercising the re-encode path.
- The SVG `camping` comic keeps working via pass-through/degradation.

## Testing

- **Unit (pipeline):** `createComic`/`resolve`/`resolveAnimation` mapping +
  degradation; static variant naming, idempotency, deterministic ThumbHash;
  **animation detection**, source-preference, ladder generation incl. **no-upscale**
  capping, and the **frames→video** branch — all with a fake `Bucket` + fake
  ffmpeg/ffprobe runner.
- **Unit (runtime):** the **rendition-selection** helper is pure → exhaustive across
  viewport / DPR / connection combos; `VideoSource`'s pure parts (GOP-boundary math,
  LRU eviction policy) in isolation; the image scheduler's priority/abort/eviction.
- **Component:** `ImageWidget` thumb→low→high progression; `AnimationWidget` with a
  mocked `VideoSource` (frame for a given progress; the no-WebCodecs `<video>` fallback).
- **Live smoke + manual:** run the pipeline on one real animation folder (each source
  kind); scrub real animations on **desktop + a phone** — correct rendition per device,
  visible low→high upgrade, bounded memory. Decode/scrub *feel* is already de-risked by
  the spike.

## Open questions / future work

- AVIF (stills) and AV1/VP9 (video) renditions for further byte savings.
- Optional sharper placeholder (tiny real image variant) if ThumbHash proves too
  coarse for certain art.
- AI image generation feeding the same path-based pipeline.
- Tuning the `VideoSource` GOP-window/LRU cap, the rendition-selection thresholds,
  and the low→high upgrade heuristics against real device profiling.
- Content-hash idempotency (current model keys on output presence; in-place source
  edits need `--force`).
