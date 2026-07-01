# `music-video-short` Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gated, human-in-the-loop skill that guides a BadCode short-form music video (10–20s) from spark to a cut-ready package — a Suno track, per-scene Flow clips, and an edit plan.

**Architecture:** The deliverable is authored content, not a code package: a new skill file `.claude/skills/music-video-short/SKILL.md` plus a `docs/shorts/` folder convention. The skill **composes** three existing pieces — `suno-prompt` (song, a manual gate), `badcode-art-direction` (stills), and the `@badcode/flow-mcp` MCP tools (clips, the one automated link) — and hands the human clean instructions at the two manual gates (Suno generation, final cut). It models the sibling `make-comic` skill's structure and voice.

**Tech Stack:** Markdown (skill + docs), the `flow` MCP tools (`flow_status`, `flow_open_project`, `flow_create_character`, `flow_generate_image`, `flow_generate_video`), and `ffprobe` (already present) for measuring the returned audio.

## Global Constraints

- **Spec is authority:** `docs/superpowers/specs/2026-07-01-music-video-short-skill-design.md`. Every task implements part of it.
- **Standalone lightweight only:** each short lives in `docs/shorts/<name>/`; no `new-story` canon required. Anchoring to an existing story is explicitly out of scope for v1.
- **Two manual gates, one automated link:** Suno = manual (skill hands prompt+lyrics, human returns the mp3). Final cut = manual (skill outputs `edit-plan.md`, NOT a rendered `.mp4`). Only Flow `image→video` clip generation is automated.
- **The song leads:** generated at Stage 2; all later stages cut to the track's `ffprobe`-measured duration, never a guessed one.
- **Gated stages:** every stage is *discuss → approve → produce*; never run a produce step before its stage is approved. Mirrors `make-comic` and `superpowers:brainstorming`.
- **Voice is load-bearing:** concept + lyrics follow `docs/voice.md`; every short carries one political/economic idea (`docs/storytelling.md`). Default genre drum & bass.
- **Single self-contained skill file** (repo convention — no separate references file), pointing at depth docs rather than duplicating them.
- **Exact Flow tool signatures** (from `packages/flow-mcp/src/server.ts`, do not paraphrase):
  - `flow_status()` → `{ loggedIn, projectOpen, url }`
  - `flow_open_project({ name })`
  - `flow_create_character({ name, refImages: string[] })` → `{ name }`
  - `flow_generate_image({ prompt, outPath, character? })` → `{ path, mediaId, width, height }` — the `character` param casts a project Character (the current, proven cross-scene consistency path).
  - `flow_generate_video({ imagePath, motion, model?, outPath })` → `{ path, mediaId }`
- **Verification for a skill is structural, not unit tests:** each task ends by confirming the file contains the required sections/templates, that cited tool signatures match `server.ts`, and that artifact paths are self-consistent — then commits.

---

### Task 1: The `docs/shorts/` folder convention + index

**Files:**
- Create: `docs/shorts/README.md`

**Interfaces:**
- Produces: the on-disk convention every later stage and the skill reference — the folder layout, the per-short artifact list, and an index table. The skill file (Tasks 2–5) points here for "what a short is."

- [ ] **Step 1: Write `docs/shorts/README.md`**

Content must include, in this order:

1. A one-paragraph definition of a BadCode **short** — a 10–20s music-video piece; its own lightweight medium (not a comic, not full story canon); the point still carries one political/economic idea in the BadCode voice.
2. The **folder layout** for a single short, verbatim:

```
docs/shorts/<name>/
  README.md        # backbone + tracker for this short
  concept.md       # hook, the one idea, vibe, genre, target length
  song.md          # style prompt, exclude-list, lyrics, measured duration
  audio/track.mp3  # human drops this back from Suno
  look.md          # visual world + cast (+ Flow Character ids if used)
  scenes/
    index.md
    sNN.md         # per-scene shot record (still prompt, motion note, chars)
    img/sNN.jpg    # the harvested still for each scene
  clips/           # generated .mp4s (sNN.mp4), one per scene
  edit-plan.md     # the hand-off for the human's final cut
```

3. A **stage → artifact** table (Concept→`concept.md`; Song→`song.md`+`audio/track.mp3`; Look & cast→`look.md`; Scene breakdown→`scenes/`; Clips→`clips/`; Edit plan→`edit-plan.md`), noting which stages are manual gates (Song, Edit plan) and which is automated (Clips).
4. A pointer: "This medium is produced by the **`music-video-short`** skill (`.claude/skills/music-video-short/`)."
5. An **index** table with header row `| Short | Idea | Status |` and a `_(none yet)_` placeholder row.

- [ ] **Step 2: Verify structure**

Run: `test -f docs/shorts/README.md && grep -c 'edit-plan.md' docs/shorts/README.md`
Expected: prints a count ≥ 2 (layout block + stage table both mention it).

Run: `grep -q 'music-video-short' docs/shorts/README.md && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add docs/shorts/README.md
git commit -m "docs(shorts): folder convention + index for short-form music videos"
```

---

### Task 2: Skill scaffold + Stages 1–2 (Concept, Song manual gate)

**Files:**
- Create: `.claude/skills/music-video-short/SKILL.md`

**Interfaces:**
- Consumes: `docs/shorts/README.md` (Task 1) for the folder convention.
- Produces: the skill frontmatter (name/description/triggers — how the harness discovers it), the overview + read-first + six-stage table + gating + resume sections, and the full text of **Stage 1 (Concept)** and **Stage 2 (Song)** including the Suno hand-off block and the `ffprobe` ingest command. Later tasks (3–5) append Stages 3–6 to this same file.

- [ ] **Step 1: Write the frontmatter + top matter**

Frontmatter (YAML), verbatim shape:

```markdown
---
name: music-video-short
description: Use to take a BadCode short-form music video (10–20s) from idea to a cut-ready package — a Suno track, Flow scene clips, and an edit plan — as a gated, human-in-the-loop workflow. Triggers on "make a short", "music video short", "turn this into a short video", "short-form video", or any request to build a 10–20s BadCode clip set to music. Composes suno-prompt (song) + badcode-art-direction (stills) + flow-mcp (clips).
---
```

Then, mirroring `make-comic`'s top matter (same voice), write:

- **Title + one-paragraph overview:** spark → cut-ready package; gated *discuss → approve → produce*; composes existing tools; NOT autonomous — Suno and the final cut stay with the human.
- **Read first** list: `CLAUDE.md`; `docs/voice.md`; `docs/storytelling.md`; the **`suno-prompt`** skill (Stage 2); the **`badcode-art-direction`** skill (Stages 3, 5); `packages/flow-mcp/README.md` (Stage 5 tools + prerequisites); `docs/shorts/README.md` (the folder convention).
- **The six stages** table with columns `# | Stage | Mode | Produces`:

| # | Stage | Mode | Produces |
|---|---|---|---|
| 1 | Concept | author | `docs/shorts/<name>/concept.md` + `README.md` |
| 2 | Song | ⏸ manual gate | `song.md` + `audio/track.mp3` (+ measured duration) |
| 3 | Look & cast | author | `look.md` (+ Flow Character ids) |
| 4 | Scene breakdown | author | `scenes/index.md` + `scenes/sNN.md` (planned) |
| 5 | Clips | ⚙ auto | `clips/sNN.mp4` + record per scene |
| 6 | Edit plan | ⏸ manual gate | `edit-plan.md` |

- **Gating principle** paragraph (same as `make-comic`: never produce before the stage is approved; summarise + ask after each).
- **Resume** paragraph: progress *is* the artifacts — `concept.md` → Stage 1 done; `audio/track.mp3` + recorded duration → Stage 2; `look.md` → Stage 3; `scenes/*` → Stage 4; an `sNN.md` with `status: done` + `clips/sNN.mp4` → that scene done; `edit-plan.md` → Stage 6. Resume at the first incomplete stage; don't restart.

- [ ] **Step 2: Write Stage 1 — Concept**

Add a `## Stage 1 — Concept` section: discuss the hook, the single load-bearing political/economic idea, vibe, genre (default drum & bass), and target length (10–20s), in the BadCode voice — take a fragment, don't demand a brief. Produce `docs/shorts/<name>/concept.md` (hook, the one idea, vibe, genre, target length) and `docs/shorts/<name>/README.md` (the tracker for this short). **Gate:** approve the spine before Stage 2.

- [ ] **Step 3: Write Stage 2 — Song (manual Suno gate)**

Add a `## Stage 2 — Song (⏸ manual gate)` section stating the song leads, and containing exactly these parts:

1. Invoke the **`suno-prompt`** skill to produce the Style prompt, Exclude-Styles list, and **short lyrics sized to ~15s**. Write `docs/shorts/<name>/song.md` (reuse `suno-prompt`'s save shape — frontmatter `title, status, suno: {style, exclude}, bpm, voices` + a `lyrics` block).
2. Print the **hand-off block** for the human, this exact template:

```markdown
### 🎧 Your turn — generate the track in Suno
1. Open Suno (Advanced mode). Paste **Style** and **Exclude Styles** below; paste the **Lyrics**.
2. Generate. **Roll it a few times** — pick the take that hits.
3. Download the MP3 to: `docs/shorts/<name>/audio/track.mp3`
4. Tell me the rough **section boundaries by ear** (where build / drop / outro land).

**Style:**
> <style prompt>

**Exclude Styles:**
> <exclude list>

**Lyrics:**
> <lyrics>
```

3. When the human returns `audio/track.mp3`, measure it — run verbatim:

```bash
ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 docs/shorts/<name>/audio/track.mp3
```

Record the printed seconds as the **measured duration** in `song.md`, plus the human's section-boundary note. v1 does **not** auto-detect beats — the human's ear is the source of truth for section boundaries.
4. **Gate:** the track is chosen and its measured duration + sections are recorded before Stage 3.

- [ ] **Step 4: Verify structure**

Run: `grep -Eq '^name: music-video-short' .claude/skills/music-video-short/SKILL.md && echo FM_OK`
Expected: `FM_OK`

Run: `grep -c '## Stage' .claude/skills/music-video-short/SKILL.md`
Expected: `2` (Stages 1 and 2 present so far).

Run: `grep -q 'ffprobe -v error -show_entries format=duration' .claude/skills/music-video-short/SKILL.md && echo FFPROBE_OK`
Expected: `FFPROBE_OK`

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/music-video-short/SKILL.md
git commit -m "feat(skill): music-video-short scaffold + Stages 1-2 (concept, Suno gate)"
```

---

### Task 3: Stages 3–4 (Look & cast, Scene breakdown)

**Files:**
- Modify: `.claude/skills/music-video-short/SKILL.md` (append Stages 3 and 4)

**Interfaces:**
- Consumes: the file from Task 2; `flow_create_character({ name, refImages })` and the `badcode-art-direction` skill.
- Produces: Stage 3 (Look & cast) and Stage 4 (Scene breakdown), and the **`scenes/sNN.md` record template** that Task 4's clip routine fills in.

- [ ] **Step 1: Write Stage 3 — Look & cast**

Add `## Stage 3 — Look & cast`: discuss the visual world and 1–3 characters using the **`badcode-art-direction`** identity (35mm documentary look, muted cool-neutral palette, observational framing — point at the skill, don't restate it). Write `docs/shorts/<name>/look.md` (the world + the cast, each character with a class-coded visual description in house style). If a character recurs across scenes, set up a **Flow Character** once for cross-scene consistency:

- Prerequisite: `./scripts/flow-chrome.sh` running and logged in; confirm with `flow_status()` → `loggedIn: true`, then `flow_open_project({ name })`.
- Generate a portrait via **`badcode-art-direction`** → `flow_generate_image`, harvest to `docs/shorts/<name>/look/img/<char>.jpg`, then `flow_create_character({ name: "<Char>", refImages: ["<abs path to that jpg>"] })`. Record the returned character name in `look.md`.

**Gate:** approve the look + cast (and any Flow Characters) before Stage 4.

- [ ] **Step 2: Write Stage 4 — Scene breakdown**

Add `## Stage 4 — Scene breakdown`: map the **actual** song (its measured duration from Stage 2 + the human's section boundaries) to N scenes (~4–8 for 15s). Each scene = one shot description + a **motion note** (what moves — used verbatim as the Stage 5 motion prompt) + which character(s) it references + which song section it lands on. Write `scenes/index.md` (numbered scenes, one-line intent + section each) and one `scenes/sNN.md` per scene with `status: planned`. **Gate:** approve the board before any clip is generated.

- [ ] **Step 3: Write the scene record template**

Under Stage 4, include this verbatim template (`docs/shorts/<name>/scenes/sNN.md`):

```markdown
---
scene: 3
song_section: drop            # intro | build | drop | outro …
characters: [karen]           # names of Flow Characters to cast (may be empty)
still_media_id:               # filled when the still is generated
clip_media_id:                # filled when the clip is generated
status: planned               # planned | done
---
![scene 3 still](img/s03.jpg)  ·  clip: `../clips/s03.mp4`

**Still prompt (exact, sent to Flow):**
> <house-style preamble + scene; cast each character in `characters:` by name>

**Motion prompt (exact, sent to Flow):**
> <what moves — e.g. slow push-in, banners ripple, embers drift>

**Beat note:** <where it lands, e.g. "on the drop (~00:07)">

**Revisions:**
- v1 (<date>) — initial
```

- [ ] **Step 4: Verify structure**

Run: `grep -c '## Stage' .claude/skills/music-video-short/SKILL.md`
Expected: `4`

Run: `grep -q 'flow_create_character' .claude/skills/music-video-short/SKILL.md && grep -q 'Motion prompt (exact' .claude/skills/music-video-short/SKILL.md && echo OK`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/music-video-short/SKILL.md
git commit -m "feat(skill): music-video-short Stages 3-4 (look/cast, scene breakdown)"
```

---

### Task 4: Stage 5 (auto clip generation) + iteration loop

**Files:**
- Modify: `.claude/skills/music-video-short/SKILL.md` (append Stage 5 + iteration loop)

**Interfaces:**
- Consumes: the `scenes/sNN.md` records (Task 3); `flow_generate_image({ prompt, outPath, character? })`, `flow_generate_video({ imagePath, motion, model?, outPath })`; the `badcode-art-direction` skill.
- Produces: Stage 5 (the only automated stage) and the per-scene iteration loop.

- [ ] **Step 1: Write Stage 5 — Clips (⚙ auto)**

Add `## Stage 5 — Clips (⚙ auto)`. Prerequisite line: Flow connected (`flow_status()` → `loggedIn: true`; `flow_open_project({ name })`); do NOT hand-puppeteer Flow via the Playwright MCP. Then, for each `scenes/sNN.md` with `status: planned`, this exact routine:

1. **Still** — invoke **`badcode-art-direction`** to plan/critique the still prompt, then generate it: `flow_generate_image({ prompt, outPath: "<abs>/docs/shorts/<name>/scenes/img/sNN.jpg", character: "<Char>" })` (pass `character` only if the scene lists one; the `character` param casts the Flow Character — the proven consistency path). Judge against scene + house style; `flow_refine` to correct in-session if weak.
2. **Animate** — `flow_generate_video({ imagePath: "<abs>/…/scenes/img/sNN.jpg", motion: "<the scene's Motion prompt>", outPath: "<abs>/docs/shorts/<name>/clips/sNN.mp4" })`. (Note: `flow_generate_video` may take minutes and can post a credit gate; the MCP tool already handles the gate + harvest.)
3. **Record** — in `sNN.md`: fill `still_media_id` and `clip_media_id`, embed the still, set `status: done`, write the **exact** still + motion prompts used, and add a `v1` revision line.

**Gate:** review the clips together; reroll weak ones (via the iteration loop) before Stage 6.

- [ ] **Step 2: Write the iteration loop**

Add `## Iterating on a scene`: to change one scene — open `sNN.md`, read the recorded prompts, re-run via **`badcode-art-direction`** (`flow_refine` for the still) and/or re-`flow_generate_video`, harvest the new files, **append a revision line** describing the change, replace the still + clip. Touch only that one record/scene — leave the rest untouched.

- [ ] **Step 3: Verify structure**

Run: `grep -q 'flow_generate_video({ imagePath' .claude/skills/music-video-short/SKILL.md && grep -q 'flow_generate_image({ prompt, outPath' .claude/skills/music-video-short/SKILL.md && echo TOOLS_OK`
Expected: `TOOLS_OK`

Run: `grep -c '## Stage' .claude/skills/music-video-short/SKILL.md`
Expected: `5`

- [ ] **Step 4: Cross-check tool signatures against the server**

Run: `grep -oE "flow_generate_(image|video)\\(\\{[^}]*\\}" .claude/skills/music-video-short/SKILL.md`
Confirm by eye against `packages/flow-mcp/src/server.ts` (lines ~65–128): `flow_generate_image` params are `prompt, outPath, character?`; `flow_generate_video` params are `imagePath, motion, model?, outPath`. No invented params.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/music-video-short/SKILL.md
git commit -m "feat(skill): music-video-short Stage 5 (auto clip gen) + iteration loop"
```

---

### Task 5: Stage 6 (edit plan) + out-of-scope, and register the skill

**Files:**
- Modify: `.claude/skills/music-video-short/SKILL.md` (append Stage 6 + out of scope)
- Modify: `CLAUDE.md` (add the skill to the skills mentions)
- Modify: `docs/shorts/README.md` (only if the pointer/text needs a tweak after the skill exists)

**Interfaces:**
- Consumes: the measured duration + sections (Stage 2), the `clips/sNN.mp4` files (Stage 5).
- Produces: Stage 6 (the second manual gate) with the `edit-plan.md` template, the out-of-scope list, and the repo-level registration so the skill is discoverable/documented.

- [ ] **Step 1: Write Stage 6 — Edit plan (⏸ manual gate)**

Add `## Stage 6 — Edit plan (⏸ manual gate)`: given the measured audio duration + section boundaries + the generated clips, emit `docs/shorts/<name>/edit-plan.md` — the hand-off for the human's cut. The skill's contract **ends at the plan**; it does not mux the final `.mp4`. Include this verbatim template:

```markdown
# Edit plan — <name>

**Track:** `audio/track.mp3` · measured <D>s · <BPM by ear>
**Sections:** intro 0.0–a · build a–b · drop b–c · outro c–<D>

## Timeline (cuts sum to the track length)

| t (s) | clip | in→out | scene / section | note |
|-------|------|--------|-----------------|------|
| 0.00 | clips/s01.mp4 | 0.0→a | intro | establishing hold |
| a    | clips/s02.mp4 | 0.0→… | build | cut on snare |
| b    | clips/s03.mp4 | 0.0→… | drop | HARD cut on the drop |
| …    | …             | …     | …    | … |

**Total:** <D>s — matches the track.

## Optional convenience (not the deliverable)
A ready-to-run `ffmpeg` concat+mux command MAY be appended here for the human, but
auto-rendering is out of scope — the plan is the contract.
```

**Gate:** the short is done for the skill's purposes when the human has the plan; they cut it.

- [ ] **Step 2: Write Out of scope**

Add `## Out of scope` listing, one line each: rendering the final `.mp4` (contract ends at the plan; an optional `ffmpeg` command is allowed, auto-mux is a later cycle); automating Suno (a manual gate by design); automatic beat/section detection (human's ear is source of truth in v1); anchoring to existing story canon (standalone-lightweight only in v1); publishing the short to the website (separate concern).

- [ ] **Step 3: Register the skill in `CLAUDE.md`**

In `CLAUDE.md`, find the `.claude/skills/` row of the repo-map table (currently lists `new-idea`, `new-story`, `suno-prompt`, `make-comic`, `animate-slide`) and add `music-video-short` to that list with a short gloss: "the full idea→short-form music-video pipeline (Suno track + Flow clips + edit plan)". If there is a prose bullet list of skills further down, add a matching one-line bullet: pointer to `.claude/skills/music-video-short/`, one sentence on what it does, note it composes `suno-prompt` + `badcode-art-direction` + `flow-mcp`.

- [ ] **Step 4: Verify structure**

Run: `grep -c '## Stage' .claude/skills/music-video-short/SKILL.md`
Expected: `6`

Run: `grep -q 'edit-plan.md' .claude/skills/music-video-short/SKILL.md && grep -q '## Out of scope' .claude/skills/music-video-short/SKILL.md && echo OK`
Expected: `OK`

Run: `grep -q 'music-video-short' CLAUDE.md && echo CLAUDE_OK`
Expected: `CLAUDE_OK`

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/music-video-short/SKILL.md CLAUDE.md docs/shorts/README.md
git commit -m "feat(skill): music-video-short Stage 6 (edit plan) + register skill"
```

---

### Task 6: Dry-run trace against the spec's success criteria

**Files:**
- Modify (only if the trace surfaces gaps): `.claude/skills/music-video-short/SKILL.md`

**Interfaces:**
- Consumes: the finished skill; the spec's Success Criteria.
- Produces: a verified, self-consistent skill — no code, just a validation pass and any fixes.

- [ ] **Step 1: Trace an imaginary short end-to-end**

On paper, walk a fictional short (`docs/shorts/example/`) through Stages 1→6 and confirm every artifact path the skill writes matches the folder convention in `docs/shorts/README.md` exactly — `concept.md`, `song.md`, `audio/track.mp3`, `look.md`, `scenes/sNN.md`, `scenes/img/sNN.jpg`, `clips/sNN.mp4`, `edit-plan.md`. Note any mismatch (e.g. a stage writing `scene/` vs `scenes/`).

- [ ] **Step 2: Check each spec Success Criterion has a home in the skill**

For each bullet in the spec's `## Success criteria`, point to the stage that satisfies it: six gated stages reusing the three tools ✔; clean Suno hand-off + `ffprobe` ingest (Stage 2) ✔; per-scene record with exact prompts + revisions (Stages 4–5) ✔; "change scene N" one-scene reroll (iteration loop) ✔; resume-not-restart (Resume section) ✔. List any unsatisfied criterion.

- [ ] **Step 3: Fix any gaps found inline**

If Step 1 or 2 surfaced a mismatch or missing element, edit `SKILL.md` to fix it. If none, no change.

- [ ] **Step 4: Final consistency check**

Run: `grep -c '## Stage' .claude/skills/music-video-short/SKILL.md`
Expected: `6`

Run: `grep -Eq '^name: music-video-short' .claude/skills/music-video-short/SKILL.md && echo READY`
Expected: `READY`

- [ ] **Step 5: Commit (only if Step 3 changed anything)**

```bash
git add .claude/skills/music-video-short/SKILL.md
git commit -m "fix(skill): music-video-short — align paths/criteria after dry-run trace"
```

---

## Self-Review

**Spec coverage** — every spec section maps to a task:
- Goal / Principles → Task 2 top matter + Global Constraints. ✔
- Six stages (1 Concept, 2 Song, 3 Look & cast, 4 Scene breakdown, 5 Clips, 6 Edit plan) → Tasks 2 (1–2), 3 (3–4), 4 (5), 5 (6). ✔
- On-disk structure (standalone lightweight) → Task 1 (`docs/shorts/README.md`) + used throughout. ✔
- Record format → Task 3 Step 3 (verbatim `sNN.md` template). ✔
- Flow connection → Tasks 3 & 4 (prerequisite lines + `flow_status`/`flow_open_project`). ✔
- Audio ingest (`ffprobe`) → Task 2 Step 3. ✔
- Packaging (single self-contained file, points-at list) → Task 2 Step 1; registration → Task 5 Step 3. ✔
- Resume & progress → Task 2 Step 1 (Resume section). ✔
- Out of scope → Task 5 Step 2. ✔
- Success criteria → Task 6 validates each. ✔

**Placeholder scan:** the `<name>`, `<D>`, `<Char>` tokens are intentional skill-template variables (the skill fills them per-run), not plan placeholders — every task step shows the actual content/command to write. No "TBD"/"handle edge cases"/"write tests for the above". ✔

**Type/signature consistency:** the Flow tool signatures cited in Tasks 3–4 (`flow_create_character({ name, refImages })`, `flow_generate_image({ prompt, outPath, character? })`, `flow_generate_video({ imagePath, motion, model?, outPath })`) match Global Constraints and `packages/flow-mcp/src/server.ts` verbatim; Task 4 Step 4 explicitly re-checks them against the server. Artifact paths (`scenes/sNN.md`, `scenes/img/sNN.jpg`, `clips/sNN.mp4`) are identical across Tasks 1, 3, 4, 6. ✔
