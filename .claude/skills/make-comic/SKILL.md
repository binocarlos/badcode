---
name: make-comic
description: Use to take a BadCode comic from idea to a rendered comic in the browser as a gated, staged workflow — discuss & approve each stage, then produce. Triggers on "make a comic", "let's build the <x> comic", "turn this idea into a comic", "ideate a comic", "new comic from scratch", or any request to generate comic images / a storyboard via Google Flow. Composes new-story (canon) + Google Flow (images) + @badcode/comic (assembly).
---

# Make Comic (BadCode)

Take a comic from **idea → rendered comic in the browser**, run as a gated
workflow: each stage is *discuss → approve → produce*. Nothing is produced before
its stage is approved. This skill **composes** existing tools — it does not
duplicate them.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — load-bearing tone (sarcastic, dark, total authority; politics
  & economics first; story over sermon). All prose and captions match it.
- `docs/storytelling.md` — the method: one load-bearing idea, real grounding,
  beats. Don't reinvent it.
- The **`new-story`** skill — captures the `docs/stories/<story>/` canon. Stages 1, 2, 4
  delegate to its method.
- `packages/flow-mcp/README.md` — the `flow` MCP server (tools, prerequisites).
- `badcode-art-direction` skill — prompt craft + critique loop; invoked for every image.
- `packages/comic/AUTHORING.md` — **mandatory** before writing any comic `.tsx`
  in Stage 6.

## The six stages (each: discuss → approve → produce)

| # | Stage | Produces | Tool |
|---|---|---|---|
| 1 | Idea | `docs/stories/<story>/story.md` + `README.md` | new-story method |
| 2 | Characters | `docs/stories/<story>/characters/<name>.md` (+ visual `sheet` desc) | new-story method |
| 3 | Character images | a portrait + record per character | flow MCP + art-direction |
| 4 | Storyboard | `docs/stories/<story>/storyboard/index.md` + `pNN.md` (planned) | new-story method |
| 5 | Storyboard images | one image + record per panel | flow MCP + art-direction |
| 6 | Assemble | comic `.tsx` + manifest + route, verified rendering | @badcode/comic |

`docs/stories/<story>/` is the **source of truth**; the comic in `apps/web` is *derived*
(Stage 6). Worked reference: `docs/stories/magic-money-tree/` and
`apps/web/src/comics/magic-money-tree/`.

## Gating principle

Never run a *produce* step before the user approves that stage's *discuss*
output. After each stage, summarise what was produced and ask before proceeding.
This mirrors how `superpowers:brainstorming` gates its sections.

## Resume

Progress **is** the artifacts. On invocation, inspect `docs/stories/<story>/` and
continue at the first incomplete stage/panel:

- `story.md` / `characters/*` present → stages 1–2 done.
- a character whose `.md` has a recorded portrait → stage 3 done for it.
- `storyboard/pNN.md` with `status: done` → that panel done.

Resume; don't restart.

---

## Stage 1 — Idea

Discuss the concept and the single load-bearing political/economic idea, in the
BadCode voice. Take a fragment, reference, or existing material — **don't demand a
brief.** Using `new-story`'s method, write `docs/stories/<story>/story.md` (key concept,
background, high-level beats, the twist) and `docs/stories/<story>/README.md` (the
tracker).

**Gate:** present the spine; get approval before Stage 2.

## Stage 2 — Characters

Discuss each character. Using `new-story`, write `docs/stories/<story>/characters/<name>.md`
for **every named character** — each one becomes a Flow Character in Stage 3. Each
file must include a specific, class-coded **visual `sheet` description** in house
style (see `docs/voice.md` image direction; `docs/stories/camping/characters/` and
`docs/stories/magic-money-tree/characters/dawn.md` are worked examples).

**Gate:** approve the character descriptions before Stage 3.

---

## Stage 3 — Character images

Image generation is now deterministic via the `flow` MCP server, and prompt craft +
critique live in the **`badcode-art-direction`** skill — invoke it for every image.
Per image: the art-direction skill plans + critiques the prompt, calls
`flow_generate_image({ prompt, outPath })` (or `flow_refine` to correct in-session),
and records the prompt + revision in `docs/stories/<story>/storyboard/pNN.md`.

Prerequisite: `./scripts/flow-chrome.sh` running and logged in (see
`packages/flow-mcp/README.md`). Do NOT puppeteer Flow via the Playwright MCP by hand.

For **every named character**: invoke **`badcode-art-direction`** with the character's
`sheet` description; harvest the portrait to `docs/stories/<story>/characters/img/<name>.jpg`,
set the character file's `sheet:` frontmatter to that path, and append the **character
record** below.

**Gate:** show the portraits; reroll any the user rejects before Stage 4.

### Character record (appended to `characters/<name>.md`)

```markdown
**Flow Character:** id `<flow-character-id>` · model `nano-banana-2`

**Portrait prompt (exact):**
> <the description sent to Flow>

**Revisions:**
- v1 (<date>) — initial
```

---

## Stage 4 — Storyboard

Discuss the panel sequence (beats → panels). Write `docs/stories/<story>/storyboard/index.md`
(an overview: numbered panels, each with a one-line intent and which characters
appear) and one `docs/stories/<story>/storyboard/pNN.md` per panel with `status: planned`,
the planned scene, the narration/speech copy (BadCode voice), and the characters
in it.

**Gate:** approve the board before any image is generated.

### Panel record — `docs/stories/<story>/storyboard/pNN.md`

```markdown
---
panel: 3
characters: [dawn]
flow_media_id:                 # filled when generated
model: nano-banana-2
status: planned                # planned | done
asset_key: img/i03.jpg         # comic asset this panel renders as (badcode panel resolves via it)
---
![panel 3](img/p03.jpg)        # added when generated

**Prompt (exact, sent to Flow):**
> <exact prompt: house style + scene + cast every character by name>

**Narration:** "<caption / speech>"

**Revisions:**
- v1 (<date>) — initial
```

## Stage 5 — Storyboard images

Image generation is now deterministic via the `flow` MCP server, and prompt craft +
critique live in the **`badcode-art-direction`** skill — invoke it for every image.
Per image: the art-direction skill plans + critiques the prompt, calls
`flow_generate_image({ prompt, outPath })` (or `flow_refine` to correct in-session),
and records the prompt + revision in `docs/stories/<story>/storyboard/pNN.md`.

Prerequisite: `./scripts/flow-chrome.sh` running and logged in (see
`packages/flow-mcp/README.md`). Do NOT puppeteer Flow via the Playwright MCP by hand.

For each `pNN.md` with `status: planned`: invoke **`badcode-art-direction`**, casting
**every** character listed in `characters:` by name; generate, judge, and harvest to
`docs/stories/<story>/storyboard/img/pNN.jpg`. Then fill `flow_media_id`, set
`status: done`, embed the image, record the **exact prompt** used, and add a
revision line.

**Gate:** present a contact sheet of all panels; reroll weak ones before Stage 6.

---

## Fast slide loop: plan → batch → iterate

Work in batches of 1–4 slides, not one at a time:

1. **Plan the prompts first.** Write the full prompt for every slide in the batch
   before generating anything. Get them agreed.
2. **Batch-generate unattended.** Call `flow_generate_batch` with the ordered
   prompt list and an `outDir`. It opens the project once and fires all N
   sequentially in one Flow session — no page-reading between slides.
3. **Review the batch together.** Look at all N harvested frames at once.
4. **Iterate only the weak ones.** A single slide is a cheap same-session
   follow-up: `flow_refine` with the correction. Don't regenerate the batch.

Precondition: the Flow browser is up and logged in (`./scripts/flow-chrome.sh`,
then `flow_status` → loggedIn: true) and the project is opened with
`flow_open_project` (e.g. "camping-v2").

---

## Stage 6 — Assemble

Derive the comic from the storyboard (`docs/stories/<story>/` stays the source). Read
`packages/comic/AUTHORING.md` first.

1. Copy storyboard images to `apps/web/public/comics/<slug>/img/iNN.jpg` (the
   source of truth stays in `docs/stories/<story>/storyboard/img/`). *[v1 path; migrating
   to the `badcode assets-build` bucket pipeline is a later follow-up.]*
2. Write `apps/web/src/comics/<slug>/assets.manifest.json`: `basePath`
   `"comics/<slug>"`, one asset per frame
   (`{ "thumbhash": "", "low": "img/iNN.jpg", "high": "img/iNN.jpg", "width", "height" }`).
3. Write `apps/web/src/comics/<slug>/<Name>Comic.tsx` with `@badcode/comic`:
   `createComic(manifest, { baseUrl: '' })`, one `<Page>` per panel, narration via
   `<NarrationBox>` (speech via `<SpeechBubble>`), and tasteful built-in
   effects/transitions (see `AUTHORING.md`).
4. Register in `apps/web/src/home/comics.ts`: import the component and add
   `'<slug>': <Name>Comic` to `liveComics` (route `/comics/<slug>`).
5. **Verify:** `npm run typecheck`; `npm run dev`; navigate the Flow browser to
   `http://localhost:5173/comics/<slug>` and screenshot the opener + one mid
   panel to confirm it renders.

**Gate:** show the rendered comic; the story is done when the user is happy.

---

## Iterating on an image

Editing an existing panel — *"take page 4 and change X"* — is the **`edit-panel`**
skill's job: it resolves the page to its record + golden image (`badcode panel`),
generates reference-anchored candidates with `flow_edit_image`, and maintains the
revision log. Invoke it instead of hand-rolling refine calls. (Character-sheet
records under `characters/` still iterate via `badcode-art-direction` + `flow_refine`.)

## Out of scope

- **Music.** Songs are the `suno-prompt` skill's job; only offer it as an optional
  follow-on after Stage 6.
- **Animating a panel.** make-comic produces static panels. Turning a finished
  panel into a Flow-generated scroll-scrubbed video is the **`animate-slide`**
  skill's job — reach for it after Stage 6, on a comic that has been migrated to
  the bucket pipeline (`basePath "comics-v2/<comic>"`).
- **Bucket-pipeline migration** for derived assets (a noted follow-up).
- **Fully-unattended runs.** The gates assume a human approving each stage.
