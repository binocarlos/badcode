---
name: animate-slide
description: Use to turn a single comic slide into a scroll-scrubbed video clip via Google Flow (image→video / Veo), then weave it into the comic. Triggers on "turn this slide into a video", "animate panel N", "animate this slide", "add motion to <panel>". Points at an existing bucket-pipeline comic; reuses the Flow video recipe (docs/superpowers/flow-video.md) + assets-build + @badcode/comic AnimationWidget.
---

# Animate Slide (BadCode)

Take a static comic panel and turn it into a **scroll-scrubbed video clip**, run as a gated
loop: *discuss the motion prompt → approve → produce*. Nothing is generated before the prompt
is approved. This skill operates on a **finished comic** one panel at a time; it does not
rebuild the whole thing.

Worked path: `docs/<story>/storyboard/pNN.md` + `comics-v2/<comic>/anim/<key>/video.mp4` in
the bucket → `badcode assets-build` (renditions/poster/manifest) →
`<AnimationWidget animation={comic.resolveAnimation('anim/<key>')} />`.

## Read first

| File | Why |
|---|---|
| `CLAUDE.md` | What BadCode is; repo map |
| `docs/voice.md` | Load-bearing tone — applies to motion prompts too |
| `docs/superpowers/flow-video.md` | **The Flow video recipe** — the exact UI steps, selectors, completion signal, aspect-ratio pinning, and mp4 harvest. Read it before touching Flow. |
| `packages/comic/AUTHORING.md` | Mandatory before the `.tsx` widget swap |

## Scope guard — bucket pipeline only

**Before doing anything else**, open the target comic's manifest:

```
apps/web/src/comics/<comic>/assets.manifest.json
```

Check its `basePath`:

| `basePath` value | Status |
|---|---|
| `"comics-v2/<comic>"` | **In scope.** Continue. |
| `"comics/<slug>"` or `""` | **Out of scope. Stop.** |

If the manifest has `basePath: "comics/<slug>"` (or `baseUrl: ""`, images in `apps/web/public/`),
this is a **local/v1 comic**. Video requires the bucket pipeline — renditions, poster, and
`frameCount` come only from `assets-build`/`buildAnimation`. Explain to the user that the comic
must be migrated to the bucket pipeline first (a pre-existing make-comic follow-up) and stop.

**No `comic.meta.ts` is touched.** The source of truth for an animated panel is the storyboard
record (`docs/<story>/storyboard/pNN.md`) and the generated `assets.manifest.json`. The runtime
does not read `comic.meta.ts` for animations; Karen's 9 working animations aren't declared there.
(Decided: YAGNI.)

---

## Flow engine (required before generating)

Video generation requires Flow connected. Confirm before producing:

1. **CDP up?** `curl -s http://localhost:9222/json/version` returns JSON.
2. **Playwright MCP available?** a `browser_*` tool is present in this session.
3. **If not connected**, walk the user through setup:
   - `./scripts/flow-chrome.sh` — launches the logged-in Chromium (WSL: uses Playwright's
     bundled Chromium via WSLg). Log into Google **once**; the session persists in
     `.flow-profile/`. Launch detached so it survives a session resume.
   - If the Playwright MCP isn't loaded, `.mcp.json` only loads at startup — have the user
     restart / `claude --resume` this thread, approve the `playwright` server, and confirm
     via `/mcp`.
4. Confirm a signed-in screenshot of `https://labs.google/fx/tools/flow`.

For the full Flow video UI recipe — how a source image enters image→video mode, where the
motion prompt goes, the completion signal, aspect-ratio pinning, and the mp4 harvest — see
**`docs/superpowers/flow-video.md`**.

> If `docs/superpowers/flow-video.md` does not exist, the spike (Task 1 of the
> animate-slide plan) has not been run yet. Stop, explain this to the user, and point them to
> `docs/superpowers/plans/2026-06-25-animate-slide.md` Task 1.

---

## Writing motion prompts

The motion prompt is **BadCode copy** — it must match `docs/voice.md`. The narrator is a
superintelligence from the future. Restraint is authority. Spectacle is weakness.

**The rule:** a motion prompt describes one deliberate camera or element move that *serves the
beat of the panel*. If the panel beats on silence, the prompt should be near-still. If it
beats on dread, a slow push-in. If it beats on collapse, a drift downward.

Where the beat allows, let the motion carry the **political/economic register** that drives
everything BadCode makes (`docs/voice.md`: inequality, automation, the machine's indifference,
the fiction of "we can't afford it"). The motion is an argument, not decoration — the slow
mechanical pan that doesn't care, the wealth piling while the room dims. Imply it; never
sermonise it.

| | Example | Why |
|---|---|---|
| **Good** | `"Slow push-in toward Karen's face; the fluorescent light flickers once, then holds. Everything else static."` | One move, serves the beat, restrained |
| **Good** | `"The screen text scrolls upward at a crawl; camera does not move."` | Zero camera spectacle; motion is in the world |
| **Good** | `"Embers drift upward from the left; the banner stirs once. Hold on the crowd."` | Atmosphere only; no hero moment |
| **Bad** | `"Dynamic zoom and spinning camera sweep across the office!"` | Spectacle for its own sake |
| **Bad** | `"Epic slow-mo explosion with lens flare and particle trails"` | Flashy; no political register |

A tween (`to` end-keyframe) is for a **deliberate visual argument** — the camera travels from
one position to another because the panel idea demands it. Not for motion variety.

Discuss the motion prompt with the user. Don't generate until it's approved.

---

## The gated per-slide loop

**Discuss → approve → produce.** Never generate before the motion prompt is confirmed.

### Step 1: Resolve the panel

Gather:

| Item | Where to find it |
|---|---|
| Comic id | given by the user (e.g. `karen`) |
| `basePath` | `assets.manifest.json` → `"basePath"` (must be `comics-v2/<comic>`) |
| Static image key | the `<ImageWidget src={comic.resolve('<imgKey>')} />` line for this page in `<Name>Comic.tsx` (e.g. `img/i05.png`) |
| Storyboard record | `docs/<story>/storyboard/pNN.md` (may not exist yet — create it at step 8) |
| New animation key | choose `anim/<key>` not already in the manifest (e.g. `anim/a10` or `anim/i05` — any folder not present) |

If the user passes a `to` panel (end-keyframe tween), note its image key too.

### Step 2: Stage the source image

Download the source image locally so it can be uploaded to Flow:

```bash
gsutil cp gs://badcode-storage/comics-v2/<comic>/<imgKey> /tmp/animate-slide/src.<ext>
```

Confirm with `file /tmp/animate-slide/src.<ext>`. For a `to` tween, stage both images.

### Step 3: Discuss and approve the motion prompt [GATE]

Draft the motion prompt (see "Writing motion prompts" above). Present it to the user.
**Do not proceed to step 4 until the prompt is explicitly approved.**

### Step 4: Drive Flow — image→video

Follow **`docs/superpowers/flow-video.md`** exactly:

- Provide the staged source image (and `to` image if tweening).
- Type the approved motion prompt.
- Pin the aspect ratio to match the comic page (the recipe records how).
- Poll the DOM/network completion signal — **never a fixed sleep**.

Do not invent UI steps. The recipe doc is the authority.

### Step 5: Judge the clip

Read the poster or a sampled frame. Evaluate against:
- Does the motion serve the panel's beat?
- Does it match the BadCode voice (restrained, not flashy)?
- Technical: acceptable quality, correct aspect, no artefacts?

If weak, **refine in the same Flow session** ("like that, but slower / less camera / hold
longer on the face") and re-harvest. Do not start a new session — Flow's context is in the
session; a new one loses the reference image.

### Step 6: Upload and build

Upload the clip into the comic's bucket as an animation folder. `assets-build` groups any
folder containing a file named exactly `video.mp4` into an animation keyed by that folder:

```bash
gsutil cp /tmp/animate-slide/clip.mp4 \
  gs://badcode-storage/comics-v2/<comic>/anim/<key>/video.mp4
```

Then rebuild renditions, poster, and manifest. **⚠️ Use an ABSOLUTE `-m` path.**
`npm run --workspace @badcode/cli` runs with its CWD set to `packages/cli/`, so a *relative*
`-m apps/web/...` silently writes the manifest to `packages/cli/apps/web/...` (the wrong
place). Anchor it to the repo root:

```bash
npm run badcode --workspace @badcode/cli -- \
  assets-build -s comics-v2/<comic> \
  -m "$(pwd)/apps/web/src/comics/<comic>/assets.manifest.json"
```

(Run from the repo root so `$(pwd)` resolves correctly.) Confirm the new entry landed — note
the manifest keeps animations under a top-level **`animations`** map (images are under
`assets`):

```bash
node -e "const m=require('./apps/web/src/comics/<comic>/assets.manifest.json'); const a=m.animations['anim/<key>']; console.log(a ? {renditions:a.renditions.length, frameCount:a.frameCount, fps:a.fps, poster:a.poster} : 'MISSING')"
```

Expected: renditions/poster/frameCount/fps present (not `MISSING`). If a stray
`packages/cli/apps/` tree appeared, you used a relative path — move the manifest to the real
location and `rm -rf packages/cli/apps`.

### Step 7: Assemble — swap the page

Read `packages/comic/AUTHORING.md` before editing. In `apps/web/src/comics/<comic>/<Name>Comic.tsx`,
replace the static line for this page:

```tsx
<ImageWidget src={comic.resolve('<imgKey>')} />
```

with:

```tsx
<AnimationWidget animation={comic.resolveAnimation('anim/<key>')} />
```

Ensure `AnimationWidget` is in the `@badcode/comic` import (Karen already imports it — copy
that pattern). Follow `AUTHORING.md` for any page-level `hold` / `effect` / `transition`
props; keep the rest of the page unchanged.

Verify:

```bash
npm run typecheck
```

Expected: passes. Then `npm run dev`, navigate to the comic, scroll to the swapped page, and
screenshot. Expected: the slide plays as a scroll-scrubbed clip.

### Step 8: Record

Write (or update) `docs/<story>/storyboard/pNN.md`. Create `docs/<story>/storyboard/` if it
doesn't exist. See the record format below.

---

## Record format — `docs/<story>/storyboard/pNN.md`

```markdown
---
panel: <N>
image_key: img/<iNN>.<ext>         # the static source image in the bucket
anim_key: anim/<key>               # e.g. anim/a10
flow_media_id: <uuid>              # the Flow media name from getMediaUrlRedirect
model: <as Flow reports it>        # the model name from flow-video.md / the Flow UI
status: done                       # planned | done
---

**Motion prompt (exact, sent to Flow):**
> <the full approved prompt>

**Tween to:** img/<iMM>.<ext>      # only if a 'to' end-keyframe was used; omit otherwise

**Revisions:**
- v1 (<date>) — initial
```

This loop writes the record at **step 8 — after step 7 has confirmed the clip renders** — so
it lands as `status: done`. Only use `status: planned` if you are recording a panel you intend
to animate later (e.g. pre-planning alongside `make-comic`); flip it to `done` once it renders.

For panels that already existed as storyboard image records (from `make-comic`), add the
video block below the existing image record — do not erase prior history.

---

## Resume

Progress is the artifacts. On invocation for an existing panel:

| Artifact | Meaning |
|---|---|
| `pNN.md` has `status: done` AND the page renders `AnimationWidget` | Complete. Nothing to do. |
| `pNN.md` has `status: planned` OR `anim/<key>` absent from manifest | Incomplete — continue from the first missing step. |
| No `pNN.md` yet | Start from step 1. |

Do not restart completed work. Do not re-generate a clip that already renders correctly.

---

## Iterating — "just like that but change X"

1. Open `docs/<story>/storyboard/pNN.md` and read the recorded motion prompt.
2. Re-prompt Flow in the **same session** if it is still open — "just like that but
   `<change>`". If the session is closed, start fresh from **step 2 of the loop** (re-stage
   the source image and re-upload it to Flow per `flow-video.md`) before re-prompting — a new
   Flow session has no reference image until you re-stage it.
3. Re-harvest the clip (follow `flow-video.md`).
4. Re-upload and re-run `assets-build` (step 6 above) — the manifest entry updates in place.
5. **Append a revision line** to the `pNN.md` Revisions log:
   ```
   - v2 (<date>) — <change description>
   ```
6. No `.tsx` edit needed unless the `anim/<key>` itself changed.

Touch only that one panel's record/clip. Leave the rest of the comic untouched.

---

## Out of scope

- **Local/v1 (`public/`) comics.** Must be migrated to the bucket pipeline first; this skill stops if `basePath` is not `comics-v2/<comic>`.
- **New `@badcode/cli` code.** `gsutil` + existing `assets-build` cover upload and rendition/poster generation.
- **`comic.meta.ts` / `@badcode/comic-meta` changes.** Not needed; Karen's existing animations work without it.
- **Batch animating an entire comic.** This skill is per-slide and human-paced by design.
- **Music.** Songs are the `suno-prompt` skill's job.
- **Building a comic from scratch.** That is `make-comic`'s job. Once `make-comic` has produced a comic and it is on the bucket pipeline, `animate-slide` can add motion to individual panels.
