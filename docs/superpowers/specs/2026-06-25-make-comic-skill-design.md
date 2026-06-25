# Design: `make-comic` — a staged BadCode comic-ideation skill

> Brainstormed with Kai, 2026-06-25. Packages the process proven end-to-end on
> branch `feat/flow-automation-spike` (the "Magic Money Tree" build) into a
> repeatable, gated skill — the way `superpowers:brainstorming` prescribes a
> workflow. See [[flow-automation-integration]] and
> `docs/superpowers/flow-selectors.md`.

## Goal

A multi-stage orchestrator skill that takes a comic from **idea → rendered comic
in the browser**, running as a gated workflow: each stage is *discuss → approve →
produce/record*, and nothing is produced before the discussion for that stage is
approved. It **composes** existing pieces rather than duplicating them.

## Principles

- **Gated stages, like brainstorming.** Never generate an image before the
  relevant discuss-stage is approved.
- **Compose, don't duplicate.** Reuse `new-story`'s method for canon, the Flow
  recipe for images, `@badcode/comic` + `AUTHORING.md` for assembly. `new-story`
  stays usable standalone for canon-only work; `make-comic` is the full-pipeline
  entry point.
- **Canon is the source of truth.** Everything the comic needs lives in
  `docs/<story>/`; the comic in `apps/web` is *derived*.
- **Every image is reproducible.** The exact prompt + provenance + revision log
  for each generated image is recorded in git, so iteration ("just like that, but
  change X") is a first-class operation.
- **Voice is load-bearing.** All prose/captions follow `docs/voice.md`; every
  story carries one political/economic idea (`docs/storytelling.md`).

## The six stages

Each stage gates on user approval before the next begins.

1. **Idea** — discuss the concept and the one load-bearing political/economic
   idea. Write `docs/<story>/story.md` (key concept, background, high-level beats,
   the twist) using `new-story`'s method. **Gate:** approve the spine.
2. **Characters** — discuss each character; write `characters/<name>.md`,
   including the visual **sheet** description in house style. **Gate:** approve
   descriptions.
3. **Character images** — ensure Flow connected (§ Flow connection); create a
   **Flow Character for every named character** from its sheet description (the
   cross-panel consistency anchor), harvest the portrait, record it (see § Record
   format, applied to characters). **Gate:** approve / reroll.

   > **Verified 2026-06-25:** a single Flow generation can cast **multiple Flow
   > Characters** and honours each one's likeness (tested with Dawn + Marcus in
   > one ward-corridor frame — both consistent with their Characters). So
   > multi-character panels reference every relevant Character by name; there is
   > no need to fall back to inline-describing the extras.
4. **Storyboard** — discuss the panel sequence; write a per-panel record
   `storyboard/pNN.md` (planned scene, narration, characters referenced) plus
   `storyboard/index.md`. **Gate:** approve the board.
5. **Storyboard images** — for each panel, generate in Flow referencing the
   relevant Flow Character(s), harvest, **judge against scene + house style**,
   record. Reroll weak panels. **Gate:** review the contact sheet.
6. **Assemble** — derive the comic from the storyboard: build the manifest, write
   / update the comic `.tsx` (pages, narration, effects per `AUTHORING.md`),
   register the route, and verify it renders.

## Record format (the iteration mechanism)

Each panel is one markdown file `docs/<story>/storyboard/pNN.md`, eyeball-able on
GitHub, pairing the image with the **exact prompt** and a **revision log**:

```markdown
---
panel: 3
characters: [dawn]
flow_media_id: db1ceac4-7aed-...
model: nano-banana-2
status: done            # planned | done
---
![panel 3](img/p03.jpg)

**Prompt (exact, sent to Flow):**
> Generate a single image featuring the character Dawn. …Care Home Fees letter…

**Narration:** "At home, the same maths. No money…"

**Revisions:**
- v1 (2026-06-25) — initial
- v2 (2026-06-26) — "just like v1 but move the lamp left, warmer"
```

Character images use the same record shape under `characters/` (e.g. the
`characters/<name>.md` records its portrait image, exact creation prompt, Flow
character id, and revisions; the `sheet` frontmatter points at the image).

**The iteration loop:** to change a panel, the skill opens `pNN.md`, reads the
recorded prompt, re-prompts Flow (re-referencing the same Flow Character, and
optionally the prior image), harvests the new version, **appends a revision line**
describing the change, and replaces the image. Same mechanism for character
images. This is the primary reason the record exists.

## Source of truth vs derived

- **Source of truth:** `docs/<story>/` — `story.md`, `characters/<name>.md`
  (+ portrait + record), `storyboard/index.md`, `storyboard/pNN.md`, and the
  canonical images in `storyboard/img/` (committed; render on GitHub).
- **Derived (Stage 6):** the comic component + manifest in
  `apps/web/src/comics/<slug>/` and the route registration in
  `apps/web/src/home/comics.ts`. For v1, derivation copies the storyboard images
  into the web app's `public/` with a local manifest (`createComic(manifest,
  { baseUrl: '' })`), matching the Magic Money Tree build. **Follow-up (not v1):**
  migrate derivation to the real `assets-build` GCS bucket pipeline.

## Flow connection

Per the locked decision, image stages **require Flow connected** and ensure it:

1. Check Chrome's CDP endpoint (`http://localhost:9222`) and that the Playwright
   MCP tools are available.
2. If not connected, walk the user through setup: run `./scripts/flow-chrome.sh`,
   log into Google, and (if the Playwright MCP isn't loaded) restart / `claude
   --resume` so `.mcp.json` loads; confirm a signed-in screenshot.
3. Once connected, always auto-generate.

Generation/harvest mechanics follow `docs/superpowers/flow-selectors.md` — the
agent-driven prompt, the per-panel routine (fill prompt → submit → wait on
completion → identify newest `getMediaUrlRedirect` image → resolve the signed CDN
URL via `page.request` → `curl` to disk), and the Flow **Character** workflow.

## Packaging

- `.claude/skills/make-comic/SKILL.md` — **a single self-contained file** (repo
  convention; per Kai, no separate references file). It carries the full
  instructions: the stage flow and gates, what each stage reads/writes, the
  per-panel record format, and the Flow connection check + the generate → harvest
  → record routine (prompt → submit → wait → identify newest
  `getMediaUrlRedirect` image → resolve signed URL via `page.request` → `curl` to
  disk → write record), including multi-character casting.
- **Points at (for depth, not duplicated):** `docs/storytelling.md`,
  `docs/voice.md`, the `new-story` skill, `docs/superpowers/flow-selectors.md`,
  and `packages/comic/AUTHORING.md`.

## Resume & progress

Progress *is* the artifacts: `story.md`/`characters/*` present → stages 1–2 done;
a character with a recorded portrait → stage 3 done for it; `pNN.md` with
`status: done` → that panel done. The skill resumes by inspecting `docs/<story>/`
and continues at the first incomplete stage/panel.

## Out of scope

- **Music.** Songs are handled by the `suno-prompt` skill; `make-comic` only
  offers it as an optional follow-on after Stage 6.
- **Bucket-pipeline migration** for derived assets (noted follow-up).
- **Headless / fully unattended runs.** The gates assume a human approving each
  stage; an unattended "seed → comic" mode is a separate future cycle.

## Success criteria

- The skill runs the six gated stages, reusing `new-story` for canon and the Flow
  recipe for images, and produces a rendered comic at `/comics/<slug>`.
- Every generated image has a `pNN.md` (or character) record with its exact
  prompt, provenance, and revision log committed to git.
- "Change panel N like this" reliably re-generates that one image, appends a
  revision line, and updates the file — without disturbing other panels.
- Re-invoking the skill on an existing `docs/<story>/` resumes rather than
  restarts.
