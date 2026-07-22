# Design: `animate-slide` — weave Flow-generated video into comics

> Brainstormed with Kai, 2026-06-25. This is the **video** half of the Flow automation
> work that the [image loop spec](./2026-06-20-flow-automation-loop-design.md) explicitly
> deferred ("Video / frames→video generation. Same harness, added once images work").
> Images now work end-to-end (`docs/superpowers/flow-selectors.md` + the `make-comic`
> skill's Flow engine); this spec adds the video path.

## Goal

From an open Claude Code session: *"point at a comic, say turn this slide into a video,
here's the prompt to guide the animation."* The normal workflow is **generate an image
first, then animate that image down the road** — so the entry point is per-slide and
image-driven.

```
/animate-slide  comic=<id>  panel=<key>  prompt='<motion prompt>'  [to=<key>]
  → stage the slide's source image
  → drive Google Flow image→video (Veo), harvest the .mp4
  → upload the clip to the comic's bucket as anim/<key>/video.mp4
  → badcode assets-build → renditions/poster/manifest
  → swap the page from <ImageWidget> to <AnimationWidget resolveAnimation('anim/<key>')>
  → record the exact motion prompt in the storyboard
```

The human stays in the loop for authentication (the existing one-time Google login in the
persistent Chrome profile), for approving the motion prompt before generation, and for a
final spot-check of the clip.

## Background — almost all of this already exists

The only genuinely missing piece is **driving Flow's video UI** and a **skill** to run the
per-slide loop. Everything downstream of a harvested `.mp4` is built, tested, and **already
in production use by the Karen comic** (9 working animations):

- **Playback** — `@badcode/comic`'s `AnimationWidget` + `VideoSource` give scroll-scrubbed
  WebCodecs playback (the clip advances as the reader scrolls, matching the `ScrollComic`
  feel), with a plain `<video>` fallback. A page renders a clip via
  `<AnimationWidget animation={comic.resolveAnimation('<key>')} />`.
- **Asset processing** — `badcode assets-build -s comics-v2/<comic> -m <manifest>` scans the
  bucket subfolder, **groups any folder containing a file named `video.mp4` into an
  animation** (`groupAssets` in `packages/cli/src/animation-paths.ts`), and `buildAnimation`
  emits the rendition ladder (`derived/<key>.<h>.mp4`), a WebP poster, a ThumbHash, and
  `frameCount`/`fps` into `assets.manifest.json`, keyed by the **folder** (e.g. `anim/a01`).
- **The runtime wiring** — the comic `.tsx` does `createComic(manifest, {…})` →
  `comic.resolveAnimation('anim/a01')`. Karen already does exactly this; it is the proven path.
- **The Flow harvest trick** — a generated media's source is an authenticated same-origin
  redirect (`getMediaUrlRedirect?name=<uuid>`); `page.request.get(...)` follows it server-side
  with the browser's cookies and yields a **signed, publicly-fetchable CDN URL** that `curl`
  writes to disk. Documented in `docs/superpowers/flow-selectors.md`.

What is **not** built: the Flow **video** UI recipe (how a source image enters image→video
mode, where the motion prompt goes, the completion signal, aspect-ratio control) and a skill
to drive the per-slide loop.

### Two manifest conventions (scope note)

Comics wire assets two ways today:
- **Bucket pipeline (Karen):** `basePath: comics-v2/<comic>`, real renditions/poster/thumbhash
  built by `assets-build`, assets (and `anim/<key>/video.mp4`) live in the GCS bucket.
- **Local v1 (make-comic / Magic Money Tree):** `basePath: comics/<slug>`, `baseUrl: ''`,
  hand-written manifest, images in `apps/web/public/`, **no `assets-build`**.

Video **requires the bucket pipeline** — renditions/poster/frameCount come only from
`assets-build`/`buildAnimation`. So `animate-slide` targets a **bucket-pipeline comic**. A
local/v1 comic must be migrated to the bucket pipeline first (a pre-existing make-comic
follow-up, already noted there — out of scope here). The spike and the skill's worked example
therefore target **Karen**, which is already on the bucket pipeline and has a mix of static
image slides and animations.

## Decisions (from the brainstorm)

| Decision | Choice |
| --- | --- |
| Animation model | **Support both**: single source image + motion prompt (common path), *and* an optional `to` end-keyframe for a deliberate tween between two slides |
| Surface | **Standalone `animate-slide` skill** — points at any bucket-pipeline comic, reuses a shared Flow video recipe; separate from `make-comic` |
| Build approach | **Spike-first**, mirroring the image loop: Phase 1 records the Flow video recipe by animating one real slide; Phase 2 writes the skill |
| Storage / wiring | Follow **Karen's proven path**: clip → `anim/<key>/video.mp4` in the bucket → `assets-build` → `resolveAnimation`. **No `comic.meta.ts` change** and **no new CLI code** (gsutil + `assets-build` already cover it) |
| Source of truth | `docs/stories/<story>/storyboard/pNN.md` records the **exact motion prompt + Flow media id + status** (same revision-log discipline as `make-comic` images); the manifest carries the built renditions |

## The two new artifacts

### 1. Flow **video** recipe — `docs/superpowers/flow-video.md` (spike-first)

The Flow image→video UI is unobserved, so Phase 1 is a **Claude-in-the-loop spike** that
drives one real slide end-to-end and records the recipe, exactly as the image spike produced
`flow-selectors.md`. The recipe must capture:

- **How a source image enters image→video mode** — selecting an existing image / ingredient
  and invoking "animate"/video (Veo), and where the motion prompt is typed.
- **The completion signal** — video generation is slower than images; poll a DOM/network
  signal, **never a fixed sleep**.
- **Aspect-ratio control** — the clip must match the comic page's aspect; record how to pin
  the target ratio/size (the image spike flagged this as still-to-spike).
- **The harvest** — confirm the generated video resolves via the same `getMediaUrlRedirect`
  → `page.request` → signed CDN URL path, and `curl` the `.mp4` to disk.
- **A selector/step map** located by ARIA role + accessible name (refs from `browser_snapshot`
  go stale), kept in one place for the skill to lean on.

**Deliverable:** one real Karen slide animated and live in the comic, plus `flow-video.md` as
the input contract for the skill. This task **gates** the skill — we cannot write recipe steps
for a UI we have not observed.

### 2. `animate-slide` skill — `.claude/skills/animate-slide/SKILL.md`

Triggers: *"turn this slide into a video"*, *"animate panel N"*, *"animate this slide"*,
*"add motion to <panel>"*. Gated like `make-comic` (**discuss the motion prompt → approve →
produce**); never generates before the prompt is approved.

**Read-first** (the skill lists these): `CLAUDE.md`, `docs/voice.md` (the motion prompt is
BadCode voice), `docs/superpowers/flow-video.md` (the recipe), `packages/comic/AUTHORING.md`
(mandatory before the `.tsx` swap).

**Flow-connection preamble** — reused from `make-comic`'s "Flow engine" (CDP up? Playwright
MCP available? walk through `./scripts/flow-chrome.sh` + restart if not).

**Per-run loop:**
1. **Resolve the panel** → the comic's `assets.manifest.json` (confirm it is a bucket-pipeline
   manifest, `basePath: comics-v2/<comic>`) and the static image key it currently renders
   (e.g. `img/i07`), plus the storyboard record `docs/stories/<story>/storyboard/pNN.md`. Choose the
   new animation key (`anim/<key>`). If `to` is given, resolve that panel's image key too.
2. **Stage the source image** — `gsutil cp gs://badcode-storage/comics-v2/<comic>/<imgKey>
   <local>` so it can be uploaded to Flow. (For a `to` tween, stage both.)
3. **Discuss & approve the motion prompt** — written in BadCode voice. A short *"writing
   motion prompts"* section in the skill, referencing `docs/voice.md`: restrained, deliberate
   camera moves (slow push-in, drift, parallax) that **serve the beat, not spectacle**;
   received-wisdom-from-the-future restraint over flashy motion.
4. **Drive Flow** per `flow-video.md`: provide the source image (and `to` image if tweening) +
   the motion prompt; generate; poll for completion.
5. **Judge** the clip (read the poster / a sampled frame) against the panel intent + house
   style. If weak, refine in the **same Flow session** ("like that, but slower / less camera
   move") and re-harvest.
6. **Upload & build** —
   `gsutil cp <clip>.mp4 gs://badcode-storage/comics-v2/<comic>/anim/<key>/video.mp4`, then
   `badcode assets-build -s comics-v2/<comic> -m apps/web/src/comics/<comic>/assets.manifest.json`
   (re-scans the bucket; adds the `anim/<key>` entry alongside the existing images).
7. **Assemble** — swap that page's `<ImageWidget src={comic.resolve('<imgKey>')} />` for
   `<AnimationWidget animation={comic.resolveAnimation('anim/<key>')} />` in the comic `.tsx`
   (per `AUTHORING.md`). Verify (`npm run typecheck`; spot-check in `npm run dev`).
8. **Record** — write the **exact motion prompt**, Flow media id, `anim/<key>`, and `status`
   into `docs/stories/<story>/storyboard/pNN.md`, plus a revision log, so *"just like that, but change
   X"* is one cheap follow-up.

**Resume:** progress is the artifacts — a `pNN.md` whose video record is `status: done` and
whose page already renders an `AnimationWidget` is complete; otherwise continue from the first
incomplete step.

## Architecture — two phases (mirrors the image loop)

### Phase 1 — Spike (Claude-in-the-loop)
Drive Flow's image→video on one real Karen slide via Playwright-over-CDP against the
logged-in session. Record `docs/superpowers/flow-video.md` (recipe + selector/step map) and
land one animated slide live in Karen. **Gates Phase 2.**

### Phase 2 — Write the skill
Codify the proven recipe into `.claude/skills/animate-slide/SKILL.md` (the per-slide loop
above), with the BadCode-voice motion-prompt guidance, gating, storyboard recording, and
resume. Claude-in-the-loop is used only for prompt-writing and judging; the mechanical steps
are deterministic `gsutil`/`assets-build`/edit commands.

## Out of scope

- **Any `comic.meta.ts` / `@badcode/comic-meta` change.** The runtime ignores it; Karen's
  existing animations aren't declared there. Source of truth is the storyboard record + the
  manifest. (Decided in the brainstorm: drop it, YAGNI.)
- **New CLI code.** `gsutil` + the existing `badcode assets-build` cover upload and
  rendition/poster generation; nothing new to write or test in `@badcode/cli`.
- **Migrating local/v1 (`public/`) comics to the bucket pipeline.** A pre-existing make-comic
  follow-up; `animate-slide` requires a bucket-pipeline comic.
- **A fully-deterministic `badcode flow-video` end-to-end command** that removes Claude from
  Flow driving entirely. The skill + recipe is the deliverable; a deterministic command can
  follow once the recipe is proven, the same way the image loop is sequenced.
- **Re-recording `make-comic` for video.** `animate-slide` is a separate, ad-hoc, per-slide
  skill operating on a finished comic.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Flow video UI unobserved / churns | **Spike-first**: record `flow-video.md`; locate by ARIA role + accessible name, not stale refs; keep the selector map in one place |
| Video generation latency (slower than images) | Poll a DOM/network **completion signal**, never a fixed sleep — same discipline as images |
| Clip aspect ≠ comic page aspect | The spike **pins the target ratio/size**; record how in `flow-video.md` |
| Heavier rate limits / session cost for video | Human-paced first runs on the persistent profile; per-slide (not batch) by design |
| mp4 harvest auth differs from images | Spike **confirms** video media resolves via the same signed-URL path before relying on it |
| Target comic is on the local/v1 manifest (no bucket pipeline) | The skill checks `basePath`; if not `comics-v2/…`, it stops and explains the comic must be migrated to the bucket pipeline first |

## Success criteria

- **Phase 1:** one real Karen slide is animated in Flow via Playwright-over-CDP, the `.mp4` is
  harvested via the signed-URL path, uploaded to `comics-v2/karen/anim/<key>/video.mp4`, built
  by `assets-build` into renditions/poster, and renders as a scroll-scrubbed `AnimationWidget`
  in Karen (`npm run typecheck` + the comic renders in `npm run dev`).
  `docs/superpowers/flow-video.md` is recorded.
- **Phase 2:** `/animate-slide <comic> <panel> '<motion prompt>'` runs the loop — stage →
  generate → judge → upload → build → swap the page → record — producing a scroll-scrubbed clip
  in place of the slide's static image, with the exact prompt logged in `pNN.md`, and the skill
  is discoverable (CLAUDE.md repo map + a `make-comic` cross-link).
