# Progressive Comic Loading — Design Spec

**Date:** 2026-06-16
**Status:** Approved design, ready for implementation planning
**Scope:** `@badcode/comic` runtime + a new path-based offline asset pipeline

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

## Goals

- No black frames: something is always on screen (ThumbHash placeholder instantly).
- Smooth fast-scroll through frame sequences (a full low-res track is always
  preloaded to scrub against).
- Bounded memory: at no point is the entire image set decoded/mounted.
- Decouple the new BadCode comic system from the storyteller "comic ID" stack.

## Non-goals

- AVIF output (deferred; WebP only for now).
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
   comic-assets build --src <bucket subfolder>     createComic(manifest)
   - scan subfolder for raster images              - resolve(path) → descriptor
   - Sharp → low (720w) + high (1920w) WebP        - ImageWidget: thumb→low→high
   - ThumbHash → data-URI                          - AnimationWidget: canvas + bitmaps
   - upload variants to derived/ in subfolder      - shared priority scheduler
   - emit manifest.json                            - abort + LRU bitmap eviction
```

The pipeline is **path-based and storyteller-agnostic** — it knows nothing about
comic IDs, scenes, characters, or sequences. It resizes every image under a bucket
subfolder and emits a manifest. The *comic code* decides what is a page vs. a frame
sequence (it already does, by passing arrays).

## The contract — path-keyed manifest

A comic in the new system has a **base path**: an arbitrary GCS bucket subfolder
(e.g. `comics-v2/gpom-ep1/`). No comic ID, no `defineComic`, no storyteller schema.

The pipeline emits a manifest describing every image it found:

```jsonc
// assets.manifest.json — committed next to the comic's code; URLs point at the bucket
{
  "basePath": "comics-v2/gpom-ep1",
  "assets": {
    "p1/main.png":      { "thumbhash": "1QcSHQRnh493V4dIh4eXh1h4kJUI", // compact base64 of raw hash; decode client-side
                          "low":  "derived/p1/main.low.webp",
                          "high": "derived/p1/main.high.webp",
                          "width": 1600, "height": 900 },
    "p7/anim/f000.jpg": { "thumbhash": "…", "low": "…", "high": "…",
                          "width": 1920, "height": 1080 },
    "p7/anim/f001.jpg": { /* … */ }
    // …every image, keyed by its path within the subfolder
  }
}
```

Runtime resolver — **no runtime fetch, no comic ID**:

```ts
import manifest from './assets.manifest.json'
const comic = createComic(manifest)
comic.resolve('p1/main.png')   // → ImageAsset (absolute GCS URLs)
```

Descriptor types (live in `@badcode/comic`, not `comic-meta`):

```ts
type ImageAsset = {
  thumb:  string   // compact base64 ThumbHash, decoded to a data-URI at runtime ('' if not yet generated)
  low:    string   // absolute GCS URL (~720w WebP)
  high:   string   // absolute GCS URL (~1920w WebP)
  width:  number
  height: number
}
// Frame sequences are composed in comic code as ImageAsset[]; the page placeholder
// is frames[0].thumb, the low track is frames[].low, the high track is frames[].high.
```

**Graceful degradation:** a key missing from the manifest (or a bare string URL
passed directly) renders as high-only with no thumb/low. This keeps the existing
`camping` (SVG) comic and any hand-authored URLs working through migration. SVGs
and videos are passed through by the pipeline (no raster tiers).

The manifest is the **single source of truth** for variants — a generated file,
not codegen into hand-authored metadata.

## A. Offline pipeline

A standalone command:

```
comic-assets build --src comics-v2/gpom-ep1 \
                   --manifest apps/web/src/comics/gpom-ep1/assets.manifest.json
```

Steps:

1. **List** every raster image under the `--src` bucket prefix (recursive). Pure
   path scan — no comic-ID resolution.
2. For each image: **Sharp** → `low` (720w WebP, q≈70) + `high` (1920w WebP, q≈80),
   capturing intrinsic width/height; **ThumbHash** computed from a ~100px downscale
   → stored as compact base64 of the raw hash bytes (~33 chars), decoded to a
   data-URI at runtime.
3. **Upload** variants back under the same subfolder in a `derived/` prefix (keeps
   originals clean).
4. **Emit** `manifest.json` to `--manifest` (committed to the repo) and a copy to
   the bucket subfolder.

Properties:

- **Idempotent:** skip regeneration when a variant exists and the source content
  hash is unchanged.
- **Concurrency-capped** parallelism.
- **Pass-through** for SVG and video (no raster tiers; optional thumb skipped).
- **Dry-run** mode.
- WebP only (AVIF deferred).

**On existing images:** because the pipeline is path-based, we can point `--src` at
the *current* `camping-jack-test` prefix today — no asset move required to demo.
Migrating assets into a dedicated `comics-v2/` home is a later, optional copy step,
not a blocker.

Dependencies: `sharp`, `thumbhash` (Node side for generation), GCS client for
list/upload.

## B. Runtime loader

New modules in `@badcode/comic`:
- `src/assets/` — `createComic`, manifest types, `resolve`.
- `src/loading/` — the shared scheduler, bitmap cache, abort/eviction.

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

### AnimationWidget — canvas + preloaded bitmaps

Replace per-frame `<img>` swapping with a single `<canvas>` and a two-tier cache:

- **Low track (smooth scrub):** on mount, decode the **entire** low-res track to
  `ImageBitmap`s in the background (low priority, off-thread via
  `createImageBitmap`). Small enough to hold all of them. Until a frame's bitmap
  exists, draw the nearest-available low frame; before any exist, draw the
  ThumbHash.
- **High track (sharpness):** decode only a sliding **±N window** of high-res
  frames around the current index, kept in an **LRU cache**; `.close()` evicted
  bitmaps to release memory.
- **Draw:** the scroll-progress hook computes the frame index each frame; we
  `drawImage` the best available bitmap (high → low → nearest low → thumb).
  `drawImage` is cheap; the expensive decode already happened off-thread.

Effect: fast scroll always has the full low track to scrub against (no jank), and
wherever the user settles upgrades to high within a frame or two.

### Loading orchestration — one scheduler

A shared loader so we never fire 3,540 requests at once:

- **Priority queue + concurrency cap** (~6 parallel). Tiers, high→low: current
  page's high / current animation frame's high → current-page low + full low track
  → current±1 low → idle prefetch of neighbors.
- **Wait for intent:** the first page loads eagerly (opening screen resolves
  fast); everything else is gated behind first scroll / `requestIdleCallback`.
  Nothing heavy happens if the user never scrolls.
- **Abort + evict:** leaving the window cancels in-flight loads (`AbortController`)
  and closes that page's bitmaps. A global decoded-bitmap budget triggers LRU
  eviction.

Dependency: `thumbhash` (client side, `thumbHashToDataURL` / decode to bitmap).

## Migration & proof

- New widgets are descriptor-first with a bare-string fallback, so nothing breaks
  mid-migration.
- **Proof case:** run the pipeline against `camping-jack-test`'s existing bucket
  prefix → manifest → switch its widgets to `comic.resolve(...)`. As the worst
  offender (3,540 images) it validates the design against the linked URL.
- The SVG `camping` comic keeps working via pass-through/degradation.

## Testing

- **Unit:** `createComic`/`resolve` manifest mapping + degradation; pipeline
  variant naming, idempotency, deterministic ThumbHash; scheduler
  priority/abort/eviction logic.
- **Component:** `ImageWidget` thumb→low→high progression; `AnimationWidget` draws
  the correct frame for a given progress (mocked loader/bitmaps).
- **Manual/perf on the linked comic:** assert no full-frame-set mounting, count DOM
  `<img>`s, measure bytes-on-wire and frame rate during a fast scroll. Success =
  smooth scrub + bounded memory.

## Open questions / future work

- AVIF output as a second format (WebP fallback) for further byte savings.
- Optional sharper placeholder (tiny real image variant) if ThumbHash proves too
  coarse for certain art.
- AI image generation feeding the same path-based pipeline.
- Tuning the high-res window size (`±N`) and the global bitmap memory budget
  against real device profiling.
