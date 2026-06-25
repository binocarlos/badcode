# Design: `animate-slide` — weave Flow-generated video into comics

> Brainstormed with Kai, 2026-06-25. This is the **video** half of the Flow automation
> work that the [image loop spec](./2026-06-20-flow-automation-loop-design.md) explicitly
> deferred ("Video / frames→video generation. Same harness, added once images work").
> Images now work end-to-end (see `docs/superpowers/flow-selectors.md` and the `make-comic`
> skill's Flow engine); this spec adds the video path.

## Goal

From an open Claude Code session: *"point at a comic, say turn this slide into a video,
here's the prompt to guide the animation."* The normal workflow is **generate an image
first, then animate that image down the road** — so the entry point is per-slide and
image-driven.

```
/animate-slide  comic=<id>  panel=<pNN>  prompt='<motion prompt>'  [to=<pNN>]
  → stage the slide's source image
  → drive Google Flow image→video (Veo), harvest the .mp4
  → push to the bucket, build renditions/poster, patch comic.meta.ts
  → swap the page from <ImageWidget> to <AnimationWidget>
```

The human stays in the loop for authentication (the existing one-time Google login in the
persistent Chrome profile), for approving the motion prompt before generation, and for a
final spot-check of the clip.

## Background — almost all of this already exists

The only genuinely missing piece is **driving Flow's video UI**. Everything downstream of a
harvested `.mp4` is built and tested:

- **Playback** — `@badcode/comic`'s `AnimationWidget` + `VideoSource` give scroll-scrubbed
  WebCodecs playback (the clip advances as the reader scrolls, matching the `ScrollComic`
  feel), with a plain `<video>` fallback when WebCodecs is unavailable. A page renders a clip
  via `comic.resolveAnimation('<key>')`.
- **Asset processing** — `badcode assets-build` → `buildAnimation` (`packages/cli/src/build-animation.ts`)
  → `FfmpegVideoProcessor` already ingest a **source `.mp4`** and emit the rendition ladder,
  a WebP poster, a ThumbHash, and `frameCount`/`fps` into the manifest. (It can also build
  from a numbered frame sequence; we use the source-video path.)
- **`badcode push`** — extension-agnostic: it versions `*.latest.mp4` and refreshes the
  `.latest` pointer with **no changes** (verified against `packages/cli/src/push.ts`).
- **The Flow harvest trick** — a generated media's `<img>`/source is an authenticated
  same-origin redirect (`getMediaUrlRedirect?name=<uuid>`); `page.request.get(...)` follows
  it server-side with the browser's cookies and yields a **signed, publicly-fetchable CDN
  URL** that `curl` writes to disk. Documented in `docs/superpowers/flow-selectors.md`. The
  spike confirms video media resolves the same way.

What is **not** built: the Flow **video** UI recipe (how a source image enters image→video
mode, where the motion prompt goes, the completion signal, aspect-ratio control) and a skill
+ small CLI glue to drive the per-slide loop.

## Decisions (from the brainstorm)

| Decision | Choice |
| --- | --- |
| Animation model | **Support both**: single source image + motion prompt (common path), *and* an optional `to` end-keyframe for a deliberate tween between two slides |
| Surface | **Standalone `animate-slide` skill** — points at any existing comic, reuses a shared Flow video recipe + CLI; separate from `make-comic` |
| Build approach | **Spike-first**, mirroring the image loop: Phase 1 records the Flow video recipe by animating one real slide; Phase 2 hardens into the skill + schema + glue |
| Source of truth | `docs/<story>/storyboard/pNN.md` records the **exact motion prompt + Flow media id + status**, same revision-log discipline as `make-comic` images |

## The four new pieces

### 1. Schema — reconcile the `video` asset (`packages/comic-meta/src/schema.ts`)

The schema already has a `video` asset kind, currently modelled as a strict `from`→`to`
keyframe tween (`{ kind, path, from, to, transition }`). Reshape it to the agreed model:

```ts
const videoAssetSchema = z.object({
  kind: z.literal('video'),
  path: z.string().regex(VIDEO_POINTER, 'video path must be a ".latest.<video ext>" pointer'),
  from: z.string(),                 // required — the slide's source image asset id
  to: z.string().optional(),        // optional — end keyframe for a deliberate tween
  prompt: z.string().min(1),        // required — the motion prompt (was `transition`)
})
```

`superRefine`: `from` must reference an existing **image** asset; if `to` is present it must
also reference an existing image asset. (Drop the assumption that `to` is required.)

This is a safe rename/relaxation: **no real comic uses a video asset yet** (verified by
grep across `apps/web/src/comics` and the CLI fixtures), so there is nothing to migrate.
Update `comic-meta`'s `resolve.ts`/manifest consumers and the colocated `*.test.ts` to match
the new shape (rename `transition`→`prompt`, make `to` optional).

### 2. Flow **video** recipe — `docs/superpowers/flow-video.md` (spike-first)

The Flow image→video UI is unobserved, so Phase 1 is a **Claude-in-the-loop spike** that
drives one real slide end-to-end and records the recipe, exactly as the image spike produced
`flow-selectors.md`. The recipe must capture:

- **How a source image enters image→video mode** — selecting an existing image / ingredient
  and invoking "animate"/video (Veo), where the motion prompt is typed.
- **The completion signal** — video generation is slower than images; poll a DOM/network
  signal, **never a fixed sleep**.
- **Aspect-ratio control** — the clip must match the comic page's aspect; record how to pin
  the target ratio/size (the image spike flagged this as still-to-spike).
- **The harvest** — confirm the generated video resolves via the same
  `getMediaUrlRedirect` → `page.request` → signed CDN URL path, and `curl` the `.mp4` to disk.
- **A selector/step map** located by ARIA role + accessible name (refs from `browser_snapshot`
  go stale), kept in one place for the skill to lean on.

**Deliverable:** one real slide animated and live in a comic, plus `flow-video.md` as the
input contract for the skill. This task **gates** the rest — we cannot write the skill's
recipe steps for a UI we have not observed.

### 3. `animate-slide` skill — `.claude/skills/animate-slide/SKILL.md`

Triggers: *"turn this slide into a video"*, *"animate panel N"*, *"animate this slide"*,
*"add motion to <panel>"*. Gated like `make-comic` (**discuss the motion prompt → approve →
produce**); never generates before the prompt is approved.

**Read-first** (the skill lists these): `CLAUDE.md`, `docs/voice.md` (the motion prompt is
BadCode voice), `docs/superpowers/flow-video.md` (the recipe), `packages/comic/AUTHORING.md`
(mandatory before the `.tsx` swap).

**Flow-connection preamble** — reused verbatim from `make-comic`'s "Flow engine" (CDP up?
Playwright MCP available? walk through `./scripts/flow-chrome.sh` + restart if not).

**Per-run loop:**
1. **Resolve the panel** → its `from` image asset in `comic.meta.ts` and the storyboard
   record `docs/<story>/storyboard/pNN.md`. (If `to` is given, resolve that panel's image too.)
2. **Stage the source image** — download the `from` asset's `.latest` from the bucket to a
   local file for upload to Flow (CLI glue below).
3. **Discuss & approve the motion prompt** — written in BadCode voice. A short *"writing
   motion prompts"* section in the skill, referencing `docs/voice.md`: restrained, deliberate
   camera moves (slow push-in, drift, parallax) that **serve the beat, not spectacle**;
   received-wisdom-from-the-future restraint over flashy motion.
4. **Drive Flow** per `flow-video.md`: provide the source image (and `to` image if tweening) +
   the motion prompt; generate; poll for completion.
5. **Judge** the clip (read the poster / sampled frame) against the panel intent + house
   style. If weak, refine in the **same Flow session** ("like that, but slower / less camera
   move") and re-harvest.
6. **Push & build** — `badcode push <comic> <videoAssetId> -f <clip>.mp4` (refreshes
   `.latest.mp4`); add/patch the `video` asset in `comic.meta.ts`; run `badcode assets-build`
   to produce renditions/poster/manifest.
7. **Assemble** — swap that page's `<ImageWidget src=.../>` for
   `<AnimationWidget animation={comic.resolveAnimation('<key>')} />` in the comic `.tsx`
   (per `AUTHORING.md`). Verify it renders (`npm run typecheck`; spot-check in `npm run dev`).
8. **Record** — write the **exact motion prompt**, Flow media id, and `status` into
   `docs/<story>/storyboard/pNN.md`, plus a revision log, so *"just like that, but change X"*
   is one cheap follow-up.

**Resume:** progress is the artifacts — a `pNN.md` whose video record is `status: done` and
whose page already renders an `AnimationWidget` is complete; otherwise continue from the first
incomplete step.

### 4. CLI glue (minimal, `@badcode/cli`)

- **Stage the source image** — a small helper to download a target asset's `.latest` from the
  bucket to disk for Flow upload. Prefer extending `flow-prep` (it already stages prompt +
  reference files via the `Bucket` interface) with a mode that resolves the `from` image of a
  video asset, rather than adding a parallel command.
- **No new processing code** — `push` (mp4-ready) and `assets-build`/`buildAnimation`
  (source-mp4-ready) already cover upload and rendition/poster generation.
- New/changed logic follows repo conventions: raw-TS ESM, `import type`, colocated `*.test.ts`,
  and the `Bucket` seam so bucket I/O is **faked in tests** (no network).

## Architecture — two phases (mirrors the image loop)

### Phase 1 — Spike (Claude-in-the-loop)
Drive Flow's image→video on one real slide via Playwright-over-CDP against the logged-in
session. Record `docs/superpowers/flow-video.md` (the recipe + selector/step map) and land one
animated slide live in a comic. **Gates Phase 2.**

### Phase 2 — Harden
Write the `animate-slide` skill, the `comic-meta` schema reshape, and the `flow-prep` glue
against the recorded recipe. Unit-test the CLI glue against the fake `Bucket`. The skill drives
the mechanical loop; Claude-in-the-loop is used only for prompt-writing and judging, not for
the deterministic steps.

## Out of scope

- **Re-recording all of `make-comic` for video.** `animate-slide` is a separate, ad-hoc,
  per-slide skill that operates on a *finished* comic; it does not change the image pipeline.
- **A deterministic `badcode flow-video` end-to-end command** that removes Claude from Flow
  driving entirely. The skill + recipe is the deliverable; a fully-deterministic command can
  follow once the recipe is proven, the same way the image loop is sequenced.
- **Frame-sequence (frames→video) generation** as a user-facing path. `buildAnimation` supports
  it internally, but the user-facing model is image→video via Flow.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Flow video UI unobserved / churns | **Spike-first**: record `flow-video.md`; locate by ARIA role + accessible name, not stale refs; keep the selector map in one place |
| Video generation latency (slower than images) | Poll a DOM/network **completion signal**, never a fixed sleep — same discipline as images |
| Clip aspect ≠ comic page aspect | The spike **pins the target ratio/size**; record how in `flow-video.md` |
| Heavier rate limits / session cost for video | Human-paced first runs on the persistent profile; per-slide (not batch) by design |
| mp4 harvest auth differs from images | Spike **confirms** video media resolves via the same signed-URL path before relying on it |

## Success criteria

- **Phase 1:** one real slide is animated in Flow via Playwright-over-CDP, the `.mp4` is
  harvested via the signed-URL path, pushed to the bucket, built into renditions/poster, and
  renders as an `AnimationWidget` in the comic. `docs/superpowers/flow-video.md` is recorded.
- **Phase 2:** `/animate-slide <comic> <panel> '<motion prompt>'` runs the loop — stage →
  generate → judge → push → build → swap the page → record — producing a scroll-scrubbed clip
  in place of the slide's static image, with the exact prompt logged in `pNN.md`. The CLI glue
  is unit-tested against the fake `Bucket`, and the `comic-meta` schema change keeps
  `npm run typecheck` + the comic-meta tests green.
