# Design: Flow Image/Video Automation Loop (SP3, spike-first)

> Brainstormed with Kai, 2026-06-20. This is the spec for **SP3 — the image-generation
> loop** named in the comic-authoring roadmap. It is the first of three gaps in the
> story→media pipeline to be built; the other two (A: overall idea→design workflow,
> B: idea→comic storyboard) get their own spec→plan→build cycles later.

## Goal

Automate the per-slide generation loop in **Google Flow**, driven by Playwright attached
to the user's *logged-in* Chrome:

> `badcode prompt <slide>` → fetch refs → attach → fill prompt → generate → **judge the N
> candidates** → download best → `badcode push` → update `comic.meta.ts` path.

The human stays in the loop only for authentication (a one-time manual Google login in a
persistent browser profile) and a final spot-check; the mechanical loop runs unattended.

## Scope

**In scope**
- The **image** loop: text prompt + reference "ingredients" → generate → pick best of N →
  download → push to the `badcode-storage` GCS bucket.
- Attaching to the user's logged-in Chrome over CDP so Flow is authenticated.
- Claude judging candidates against the scene description + house style.

**Explicitly deferred (not this spec)**
- **Video / frames→video** generation. Same harness, added once images work.
- **Step B** — idea→comic storyboard (populating `comic.meta.ts` scenes). Its own cycle.
- **Step A** — the overall idea→discuss→design-phase (media checklist) workflow. Its own cycle.

## Background — what already exists

The pipeline is further along than "we only have the comics":

- **Story canon** under `docs/<story>/` (`story.md`, `characters/*.md`, `songs/*.md`) — the
  declared source of truth. The `new-story` skill captures it.
- **`comic.meta.ts`** per comic — the asset/scene layer: each slide is an `asset` with a
  `scene` prompt referencing `[character]`s and prior images. *Caveat:* Camping's scenes are
  mostly `'Uploaded image'` placeholders — the real prompts were never written back.
- **`@badcode/cli`** (`badcode` bin): `prompt` assembles a layered Gemini/Flow prompt (art
  style + character sheets + scene + reference image URLs to attach); `push`/`pull`/`status`
  manage rendered assets in the `badcode-storage` bucket. All bucket I/O is behind a `Bucket`
  interface and unit-tested against a fake.
- **`@browsermcp/mcp`** is configured in `~/.claude.json` — but it drives the real browser via
  an extension and (almost certainly) cannot set OS file pickers, which is why this design uses
  Playwright-over-CDP instead.

## Decisions (from the brainstorm)

| Decision | Choice |
| --- | --- |
| Which gap first | **C — Flow automation** (riskiest piece first) |
| Manual loop being replayed | text prompt **+ reference images** → generate → pick best of N → download |
| Autonomy | **Full-auto** via Playwright-over-CDP attached to the logged-in Chrome |
| Reference attachment | **Not hard-fixed to disk** — spike picks the most reliable of three methods |
| Architecture | **Spike (Claude-in-the-loop) first, then harden into a deterministic CLI command** |
| Candidate selection | **Claude picks best of N**, flags low-confidence, human reviews a final contact sheet |

## Architecture — two phases

### Phase 1 — Spike (Claude-in-the-loop)

1. Launch a Chrome instance with `--remote-debugging-port=9222` on a **persistent
   `--user-data-dir` profile**. Log into Google / Flow **once, manually**, in that profile;
   the session persists there for future runs.
2. Add the official **`@playwright/mcp`** configured to **connect over CDP** to that Chrome
   (not launch its own). This gives Claude both the logged-in session *and* programmatic
   control including `setInputFiles`.
3. Claude drives **one real slide** end-to-end via MCP tool calls — navigate, fill prompt,
   attach refs, generate, wait, **screenshot the N candidates and judge them**, download,
   `badcode push`.

**Deliverables:** one frame generated and pushed to the bucket; a recorded **selector + step
map** of Flow's actual UI (navigation, prompt field, ingredient/upload control, generate
button, candidate grid, download control, the signals that mark "generation complete").

### Phase 2 — Harden (deterministic `badcode flow`)

Fold the proven steps into a real CLI command using the Playwright **library** over the same
CDP attach. Fast, cheap, repeatable, **unit-tested against a fake browser** like the rest of
`@badcode/cli`. Runs 50+ slides unattended. Candidate judging stays a vision step (Claude via
API, or a review gate) — the mechanical driving does not need the LLM in the loop.

## The loop (per slide)

Input: a `comic.meta.ts` asset with a real `scene`.

1. `badcode prompt <slide>` → layered prompt text + the list of reference image URLs.
2. Fetch each reference from `badcode-storage` to a temp file.
3. Attach references (method per "Reference attachment" below).
4. Fill the prompt text into Flow.
5. Trigger generate; **wait on a DOM/network completion signal, not a fixed sleep.**
6. Screenshot the N candidates; **Claude scores them against the scene + house style; keep the
   best; flag if low-confidence.**
7. Download the keeper.
8. `badcode push` the file to the bucket and update the asset's `path` in `comic.meta.ts`.

The **spike targets an asset that already has a real scene** (e.g. `p8-main` or `p17-main` in
Camping), so it does **not** depend on step B being done first.

## Reference attachment — decided by the spike

All three start from assets already in `badcode-storage`. Try in order; keep the most reliable:

- **A. `setInputFiles` from a bucket-fetched temp file** — Playwright sets the file input
  directly, bypassing the OS dialog. No Drive needed. Expected first choice.
- **B. Drive-synced folder + Flow's Drive picker** — `gsutil`/rclone the refs into a Drive
  folder, select them in-UI. Viable because everything is already in GCS and gsutil is scriptable.
- **C. In-project ingredient gallery** — if Flow persists generated/added assets as reusable
  ingredients, select from that gallery.

## Candidate selection & human gate

- Per slide: Claude scores the N candidates, **auto-keeps the best**, and **flags
  low-confidence slides**.
- No per-slide human gate during the run.
- **At the end:** the human reviews a **contact sheet of all keepers** and regenerates rejects.

## Integration & a known dependency

- Builds directly on existing `prompt` / `push` / `status` and the `Bucket` interface.
- New code (Phase 2) lives in `@badcode/cli` as a `flow` command, following repo conventions
  (raw-TS ESM, `import type`, colocated `*.test.ts`, `Bucket`-style seams so browser I/O is
  faked in tests).
- **Dependency to flag, not solve here:** running a *whole comic* needs `comic.meta.ts` scenes
  populated; Camping's are mostly `'Uploaded image'` placeholders. The spike sidesteps this by
  targeting a real-scene asset. Populating scenes is **step B**, a separate cycle.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Google bot-detection on a CDP-controlled session | Real **persistent profile** + the user's **manual login**; human-paced first runs |
| Flow UI churn breaking selectors | The recorded **selector map**; Phase 1 before Phase 2; keep selectors in one module |
| Async generation timing | Poll on **DOM/network completion signals**, never fixed sleeps |
| File upload blocked | Three fallback attachment methods (A/B/C); not hard-fixed to disk |
| Token cost of Claude-in-the-loop at scale | That mode is the **spike only**; Phase 2 deterministic driving removes the LLM from the mechanical loop |

## Success criteria

- **Phase 1:** Claude generates one real Camping frame in Flow via Playwright-over-CDP against
  the logged-in session, judges the candidates, and the keeper lands in `badcode-storage` via
  `badcode push`. A selector/step map of Flow's UI is recorded.
- **Phase 2:** `badcode flow <slide>` runs the loop unattended for a slide; the run scales to a
  batch; a final contact sheet is produced for human spot-check. Command logic is unit-tested
  against a fake browser.
