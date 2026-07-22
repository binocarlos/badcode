# `make-comic` Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This plan authors a **prose skill document**, not code — "verify" steps are concrete coverage/accuracy checks (grep / read-back / match against the source docs), not test runs. While authoring, consult **superpowers:writing-skills** for skill-quality conventions.

**Goal:** Author `.claude/skills/make-comic/SKILL.md` — a single self-contained skill that runs the proven idea→comic pipeline as a six-stage, gated workflow — and make it discoverable.

**Architecture:** One self-contained `SKILL.md` (repo convention: skills are single files pointing at `docs/` for depth). It orchestrates existing pieces: `new-story`'s method for canon (stages 1, 2, 4), a Flow generate→harvest→record engine for images (stages 3, 5), and `@badcode/comic` + `AUTHORING.md` for assembly (stage 6). Source of truth is `docs/stories/<story>/`; the comic is derived. Each generated image gets a markdown record (exact prompt + provenance + revision log) so iteration is first-class.

**Tech Stack:** Markdown (the skill + records); the `badcode` CLI conventions; Playwright MCP over CDP for Flow; `@badcode/comic` for assembly. No application code is written by this plan.

## Global Constraints

- Skill name is exactly **`make-comic`**; it lives at `.claude/skills/make-comic/SKILL.md` as **one self-contained file** (no separate references file).
- **Compose, don't duplicate:** reuse `new-story` for canon, the Flow recipe (`docs/superpowers/flow-selectors.md`) for images, `packages/comic/AUTHORING.md` for assembly. Point at these; don't restate their content.
- **Gated stages:** every stage is *discuss → approve → produce*; never generate an image before that stage's discussion is approved.
- **Source of truth is `docs/stories/<story>/`**; the comic in `apps/web` is derived (stage 6). For v1, derivation copies storyboard images into the web app `public/` with a local manifest via `createComic(manifest, { baseUrl: '' })`. Bucket/`assets-build` migration is an explicit follow-up, NOT in this skill.
- **A Flow Character for every named character.** Multi-character casting is verified (cast every relevant Character by name in a scene).
- **Voice is load-bearing:** all prose/captions follow `docs/voice.md`; one political/economic idea per story (`docs/storytelling.md`).
- **Image download mechanism (exact):** read the generated `<img>` `?name=<id>`; resolve via Playwright `page.request.get('https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=<id>')` → `resp.url()` gives a signed `flow-content.google` CDN URL → `curl` it to disk. Do NOT use `fs`/`require`/`import` inside `browser_run_code_unsafe` (sandbox has none — only `page`).
- **Spec:** `docs/superpowers/specs/2026-06-25-make-comic-skill-design.md`.

---

### Task 1: Scaffold the skill (frontmatter, overview, stage map, gating, resume)

**Files:**
- Create: `.claude/skills/make-comic/SKILL.md`

**Interfaces:**
- Produces: the skill file with valid frontmatter (`name`, `description`) and the top-level structure later tasks append sections into: "What it is", "Read first", "The six stages" (overview table), "Gating principle", "Resume".

- [ ] **Step 1: Write frontmatter + intro**

Create `.claude/skills/make-comic/SKILL.md` starting with frontmatter modelled on `new-story`/`suno-prompt` (a `name` and a trigger-rich `description`):

```markdown
---
name: make-comic
description: Use to take a BadCode comic from idea to a rendered comic in the browser as a gated, staged workflow — discuss & approve each stage, then produce. Triggers on "make a comic", "let's build the <x> comic", "turn this idea into a comic", "ideate a comic", "new comic from scratch", or any request to generate comic images/storyboard via Google Flow. Composes new-story (canon) + Google Flow (images) + @badcode/comic (assembly).
---

# Make Comic (BadCode)

Take a comic from **idea → rendered comic in the browser**, run as a gated
workflow: each stage is *discuss → approve → produce*. Nothing is produced
before its stage is approved. This skill **composes** existing tools — it does
not duplicate them.
```

- [ ] **Step 2: Write "Read first" pointers**

Append a section pointing at (do not restate): `CLAUDE.md`; `docs/voice.md` (tone); `docs/storytelling.md` (method); the **`new-story`** skill (canon capture); `docs/superpowers/flow-selectors.md` (the Flow recipe); `packages/comic/AUTHORING.md` (assembly). One line each.

- [ ] **Step 3: Write the six-stage overview table + gating principle**

Append:

```markdown
## The six stages (each: discuss → approve → produce)

| # | Stage | Produces | Tool |
|---|---|---|---|
| 1 | Idea | docs/stories/<story>/story.md | new-story method |
| 2 | Characters | docs/stories/<story>/characters/<name>.md (+ sheet desc) | new-story method |
| 3 | Character images | a Flow Character + portrait + record per character | Flow engine |
| 4 | Storyboard | docs/stories/<story>/storyboard/index.md + pNN.md (planned) | new-story method |
| 5 | Storyboard images | one image + record per panel | Flow engine |
| 6 | Assemble | comic .tsx + manifest + route, verified rendering | @badcode/comic |

## Gating principle
Never run a *produce* step before the user approves that stage's *discuss*
output. After each stage, summarise what was produced and ask to proceed.
```

- [ ] **Step 4: Write "Resume"**

Append a "Resume" section: progress IS the artifacts — `story.md`/`characters/*` present → stages 1–2 done; a character with a recorded portrait → stage 3 done for it; `pNN.md` with `status: done` → that panel done. On invocation, inspect `docs/stories/<story>/` and continue at the first incomplete stage/panel.

- [ ] **Step 5: Verify**

Run: `grep -c "^## " .claude/skills/make-comic/SKILL.md` (expect ≥ 4 sections so far) and confirm the frontmatter has `name: make-comic`. Read the file back; confirm the stage table lists all six stages in order.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "feat(skill): scaffold make-comic — frontmatter, stage map, gating, resume"
```

---

### Task 2: Stages 1–2 (Idea, Characters) — compose new-story

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md`

**Interfaces:**
- Consumes: the structure from Task 1.
- Produces: a "## Stage 1 — Idea" and "## Stage 2 — Characters" section that delegate canon writing to `new-story`'s method.

- [ ] **Step 1: Write Stage 1 — Idea**

Append a section instructing: discuss the concept and the single load-bearing political/economic idea in BadCode voice; using `new-story`'s method, write `docs/stories/<story>/story.md` (key concept, background, high-level beats, the twist) and `docs/stories/<story>/README.md` (tracker). Explicitly **do not invent a brief** — take a fragment/reference. **Gate:** present the spine, ask to approve before Stage 2.

- [ ] **Step 2: Write Stage 2 — Characters**

Append a section: discuss each character; write `docs/stories/<story>/characters/<name>.md` per `new-story`, and require the **visual `sheet` description** in house style (specific, class-coded; see `docs/voice.md` image direction and the `camping`/`magic-money-tree` characters as worked examples). State that **every named character** gets a file (each becomes a Flow Character in Stage 3). **Gate:** approve character descriptions before Stage 3.

- [ ] **Step 3: Verify**

Read back; confirm both stages reference `new-story` (not restating it), require the `sheet` description, and end with an explicit gate. Run: `grep -n "new-story\|sheet\|Gate" .claude/skills/make-comic/SKILL.md`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "feat(skill): make-comic stages 1-2 (idea, characters) via new-story"
```

---

### Task 3: The Flow engine (connection check + generate→harvest→record routine)

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md`

**Interfaces:**
- Produces: a "## Flow engine (used by stages 3 & 5)" section with the connection check and the exact per-image routine. Stages 3 and 5 reference this section by name.

- [ ] **Step 1: Write the connection check**

Append:

```markdown
## Flow engine (used by stages 3 & 5)

Image stages REQUIRE Flow connected. Ensure it before producing:

1. Check CDP: `curl -s http://localhost:9222/json/version` returns JSON.
2. Check the Playwright MCP tools are available (a browser_* tool).
3. If not connected, walk the user through setup:
   - `./scripts/flow-chrome.sh` (launches the logged-in Chromium; WSL: uses the
     bundled Playwright Chromium via WSLg). Log into Google once; the session
     persists in `.flow-profile/`.
   - If the Playwright MCP isn't loaded, the `.mcp.json` server only loads at
     startup — have the user restart / `claude --resume` this thread, approve the
     `playwright` server, confirm via `/mcp`.
   - Launch Chrome detached so it survives a session resume.
4. Confirm a signed-in screenshot of https://labs.google/fx/tools/flow.
```

- [ ] **Step 2: Write the per-image routine**

Append the exact routine (Flow is agent-driven; one image per request; iterate to refine — see `docs/superpowers/flow-selectors.md`):

```markdown
### Per-image routine
1. Ensure a project is open (`add_2 New project` from the project list).
2. Fill the agent prompt textbox (placeholder "What do you want to create?") and
   click `arrow_forward Create`. Prompt shape: house style + scene + (for stages
   with characters) "featuring the character <Name>" — cast EVERY relevant Flow
   Character by name (multi-character casting is supported).
3. Wait ~25–30s for the assistant turn to finish.
4. Identify the new image and resolve its signed URL in one browser_run_code_unsafe
   call (sandbox has only `page` — no fs/require/import):

   async (page) => {
     const name = await page.evaluate(() => {
       const imgs = [...document.querySelectorAll('img')]
         .filter(im => (im.currentSrc||im.src||'').includes('getMediaUrlRedirect'));
       let best=null,a=0;
       for (const im of imgs){ const n=new URL(im.currentSrc||im.src).searchParams.get('name');
         const r=im.getBoundingClientRect(); const ar=r.width*r.height; if(ar>a){a=ar;best=n;} }
       return best;            // largest-rendered = the active canvas image
     });
     const resp = await page.request.get(
       'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=' + name);
     return { name, url: resp.url() };   // url = signed flow-content.google CDN URL
   }

5. Download with the shell: `curl -sS "<url>" -o <dest>.jpg` ; verify with `file`.
6. Judge the result against the scene + house style (read the downloaded file). If
   weak, refine in the SAME Flow session ("just like that but <change>") and re-harvest.
7. Write/update the record (see record formats below).
```

- [ ] **Step 3: Verify**

Confirm the section includes: the CDP/MCP check, the setup path (flow-chrome.sh + resume + detached), the `getMediaUrlRedirect`→`page.request`→`resp.url()`→`curl` chain, the sandbox caveat, and multi-character casting. Run: `grep -n "getMediaUrlRedirect\|page.request\|flow-chrome\|cast EVERY" .claude/skills/make-comic/SKILL.md`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "feat(skill): make-comic Flow engine (connection + harvest routine)"
```

---

### Task 4: Stage 3 (character images) + character record format

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md`

**Interfaces:**
- Consumes: the Flow engine (Task 3); the character files (Task 2).
- Produces: "## Stage 3 — Character images" with the per-character creation + record.

- [ ] **Step 1: Write Stage 3**

Append: for **every named character**, in Flow create a **Character** (Characters → "Describe your character…" → Create → name it → Done) from the character's `sheet` description; harvest the portrait via the Flow engine; save it to `docs/stories/<story>/characters/img/<name>.jpg`; set the character file's `sheet:` frontmatter to that path; append the character record (below). Note the verified fact that scenes can later cast multiple Characters. **Gate:** show portraits; reroll any the user rejects before Stage 4.

- [ ] **Step 2: Write the character record format**

Append the template (kept in the character's own `.md`):

```markdown
### Character record (appended to characters/<name>.md)
**Flow Character:** id `<flow-character-id>` · model `nano-banana-2`
**Portrait prompt (exact):**
> <the description sent to Flow>
**Revisions:**
- v1 (<date>) — initial
```

- [ ] **Step 3: Verify**

Confirm Stage 3 creates one Flow Character per named character, stores the portrait under `characters/img/`, sets `sheet:`, and records the Flow character id + exact prompt + revisions, and gates. Run: `grep -n "Flow Character\|characters/img\|sheet:\|Gate" .claude/skills/make-comic/SKILL.md`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "feat(skill): make-comic stage 3 (character images) + character record"
```

---

### Task 5: Stage 4 (storyboard) + Stage 5 (storyboard images) + panel record

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md`

**Interfaces:**
- Consumes: the Flow engine (Task 3); the character records (Task 4).
- Produces: "## Stage 4 — Storyboard" and "## Stage 5 — Storyboard images" with the per-panel record format.

- [ ] **Step 1: Write Stage 4 — Storyboard**

Append: discuss the panel sequence (beats → panels); write `docs/stories/<story>/storyboard/index.md` (overview: a numbered list / grid of panels with one-line intents) and one `docs/stories/<story>/storyboard/pNN.md` per panel with `status: planned`, the planned scene, the narration/speech copy (BadCode voice), and which characters appear. **Gate:** approve the board before any image is generated.

- [ ] **Step 2: Write the per-panel record format**

Append the exact template:

```markdown
### Panel record — docs/stories/<story>/storyboard/pNN.md
---
panel: 3
characters: [dawn]
flow_media_id: <id>           # filled when generated
model: nano-banana-2
status: planned               # planned | done
---
![panel 3](img/p03.jpg)       # added when generated

**Prompt (exact, sent to Flow):**
> <exact prompt; house style + scene + cast every character by name>

**Narration:** "<caption / speech>"

**Revisions:**
- v1 (<date>) — initial
```

- [ ] **Step 3: Write Stage 5 — Storyboard images**

Append: for each `pNN.md` with `status: planned`, run the Flow engine — cast every character in `characters:` by name, generate, judge, harvest to `docs/stories/<story>/storyboard/img/pNN.jpg`; then fill `flow_media_id`, set `status: done`, embed the image, record the exact prompt, and add a revision line. **Gate:** present a contact sheet of all panels; reroll weak ones before Stage 6.

- [ ] **Step 4: Verify**

Confirm: the pNN.md template has frontmatter (`panel`, `characters`, `flow_media_id`, `status`), the embedded image, the **exact prompt** block, narration, and revisions; Stage 5 casts every listed character and flips `status` to `done`. Run: `grep -n "status: planned\|status: done\|Prompt (exact\|contact sheet" .claude/skills/make-comic/SKILL.md`.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "feat(skill): make-comic stages 4-5 (storyboard + panel images/records)"
```

---

### Task 6: Stage 6 (assemble) — derive comic, register route, verify

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md`

**Interfaces:**
- Consumes: the storyboard images/records (Task 5).
- Produces: "## Stage 6 — Assemble".

- [ ] **Step 1: Write Stage 6**

Append, referencing `packages/comic/AUTHORING.md` (do not restate it):

```markdown
## Stage 6 — Assemble
Derive the comic from the storyboard (docs/stories/<story>/ is the source):
1. Copy storyboard images to apps/web/public/comics/<slug>/img/iNN.jpg
   (source of truth stays in docs/stories/<story>/storyboard/img/). [v1 path; bucket
   pipeline via `badcode assets-build` is a later follow-up.]
2. Write apps/web/src/comics/<slug>/assets.manifest.json: basePath
   "comics/<slug>", one asset per frame ({thumbhash:"", low/high:"img/iNN.jpg",
   width, height}).
3. Write apps/web/src/comics/<slug>/<Name>Comic.tsx using @badcode/comic:
   `createComic(manifest, { baseUrl: '' })`, one <Page> per panel, narration via
   <NarrationBox> (speech via <SpeechBubble>), tasteful built-in effects/transitions.
4. Register in apps/web/src/home/comics.ts: import the component and add
   `'<slug>': <Name>Comic` to liveComics (route /comics/<slug>).
5. Verify: `npm run typecheck`; `npm run dev`; navigate the Flow browser to
   http://localhost:5173/comics/<slug> and screenshot the opener + one mid panel.
```

- [ ] **Step 2: Verify**

Confirm Stage 6 covers manifest (`baseUrl: ''`), the `.tsx` with `NarrationBox`/effects, the `comics.ts` registration, and the typecheck + dev-server + screenshot render check, and references `AUTHORING.md`. Run: `grep -n "createComic\|baseUrl\|comics.ts\|typecheck\|AUTHORING" .claude/skills/make-comic/SKILL.md`.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "feat(skill): make-comic stage 6 (assemble + verify render)"
```

---

### Task 7: Iteration loop, out-of-scope, and discoverability

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md`
- Modify: `.claude/skills/new-story/SKILL.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: all prior sections.
- Produces: the "## Iterating on an image" and "## Out of scope" sections; cross-links so `make-comic` is discoverable.

- [ ] **Step 1: Write "Iterating on an image"**

Append to `make-comic/SKILL.md`: to change a panel/character image — open its record (`pNN.md` or `characters/<name>.md`), read the recorded prompt, re-prompt Flow ("just like that but <change>", re-casting the same Flow Character(s) and optionally re-referencing the prior image), harvest the new version via the Flow engine, **append a revision line** describing the change, and replace the image. Touch only that one record/image. This is the primary reason records exist.

- [ ] **Step 2: Write "Out of scope"**

Append: music (hand to the `suno-prompt` skill; offer it only as an optional follow-on after Stage 6); the bucket-pipeline migration for derived assets; fully-unattended runs (the gates assume a human approver).

- [ ] **Step 3: Cross-link from new-story**

In `.claude/skills/new-story/SKILL.md`, add one line (near the top or workflow) noting: for the **full idea→rendered-comic pipeline with image generation**, use the **`make-comic`** skill, which composes this one. Do not otherwise change new-story.

- [ ] **Step 4: Document in CLAUDE.md**

In `CLAUDE.md`, add `make-comic` to the skills guidance (the "How to work in this repo" bullets and/or the `.claude/skills/` repo-map row) as the staged idea→comic orchestrator that composes `new-story` + Google Flow + `@badcode/comic`.

- [ ] **Step 5: Verify**

Confirm: the iteration loop is documented (open record → re-prompt → append revision → replace image); `new-story/SKILL.md` and `CLAUDE.md` both mention `make-comic`. Run: `grep -rn "make-comic" .claude/skills/new-story/SKILL.md CLAUDE.md` and `grep -n "Iterating\|Out of scope" .claude/skills/make-comic/SKILL.md`.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md .claude/skills/new-story/SKILL.md CLAUDE.md
git commit -m "feat(skill): make-comic iteration loop + discoverability (new-story, CLAUDE.md)"
```

---

## Plan Done When

- `.claude/skills/make-comic/SKILL.md` exists as one self-contained file covering all six gated stages, the Flow engine (connection + harvest routine), the character and per-panel record formats, the iteration loop, resume, and out-of-scope.
- The exact Flow download mechanism (`getMediaUrlRedirect` → `page.request` → signed URL → `curl`) and the run_code sandbox caveat are captured verbatim.
- `new-story/SKILL.md` and `CLAUDE.md` point at `make-comic`, so it's discoverable.

## Out of scope (this plan)

- A live end-to-end run of the skill (that's using it, not building it).
- Any change to the `@badcode/comic` library, the `badcode` CLI, or the Flow automation infra (already built on `feat/flow-automation-spike`).
- The bucket/`assets-build` migration for derived comic assets.
