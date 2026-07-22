# Idea Inbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight idea inbox at `docs/ideas/` plus a `new-idea` capture skill that parks ideas as minimal prose files, tracks them in an index, and offers a hand-off to `new-story` when it's time to develop.

**Architecture:** Pure docs + one skill. `docs/ideas/` holds one minimal-prose markdown file per idea (no frontmatter) and a curated `README.md` index table carrying the lightweight metadata (hook, media, status). A new single-file skill `.claude/skills/new-idea/SKILL.md` captures ideas into that folder, maintains the index, and ends every capture by offering to invoke `new-story`. `CLAUDE.md` gains pointers so the convention is discoverable.

**Tech Stack:** Markdown only. No build, no tests-as-code. Verification = link/render checks and reading the artifacts back.

## Global Constraints

- **Voice:** BadCode voice per `docs/voice.md` — sarcastic, dark, total authority, politics/economics first — but idea files are a *faithful capture*, not over-developed stories. Copy faithfully; do not invent beyond what the user said.
- **Idea files:** minimal prose only — an `# H1` title + free-form brain-dump. **No frontmatter, no mandatory sections.**
- **Metadata lives in the index**, not in idea files: `docs/ideas/README.md` table columns are `Idea | Hook | Media | Status`.
- **Media vocabulary:** any combination of `comic · music · video · software` (middot-separated).
- **Status lifecycle:** `seed → developing → graduated`, plus `parked` as an off-ramp from any state.
- **Skill scope:** `new-idea` captures and tracks only. It does NOT develop characters, beats, songs, or images — that is `new-story`/`make-comic`. Every capture ends by offering the `new-story` hand-off.
- **Slugs:** kebab-case, matching the file name (e.g. `basement-granny`).
- Skills are a single `SKILL.md` per folder (match `new-story`, `suno-prompt`). Frontmatter is `name` + `description` with trigger phrases.

---

### Task 1: Scaffold `docs/ideas/` — index + the two seed ideas

This task establishes the artifact the skill produces. The two seed ideas double as the worked examples that future captures imitate, so they must be exemplary minimal-prose files.

**Files:**
- Create: `docs/ideas/README.md`
- Create: `docs/ideas/basement-granny.md`
- Create: `docs/ideas/centre-of-gravity.md`

**Interfaces:**
- Produces: the `docs/ideas/` folder shape and the README index table format that Task 2's skill reads and writes. Index columns: `Idea | Hook | Media | Status`. Idea-file shape: `# Title` + prose.

- [ ] **Step 1: Create the index `docs/ideas/README.md`**

```markdown
# Ideas — the BadCode inbox

Raw ideas, parked the second they pop. This is the stage **before** a story exists:
each idea is a quick prose brain-dump in its own file, with one row in the table below.
Most ideas will become a comic; some carry music, a video, and/or some software we write,
in any combination; some are tiny (a single image, a YouTube short) and may never grow
into a full comic. That's fine — this is a holding pen, not a commitment.

## How this works

- **Capture:** say *"record this idea: …"* and the **`new-idea`** skill writes a new
  `docs/ideas/<slug>.md` (an `# H1` title + a faithful prose dump) and adds a row here.
- **Develop:** when an idea is ready to become real, `new-idea` (or you) hands it to the
  **`new-story`** skill, which builds the full canon under `docs/stories/<story>/` — the source of
  truth the comic, music, and later media derive from. The row's status flips to
  `graduated` and links to the new story folder.
- **The inbox is optional.** An idea you're already sure about can skip straight to
  `new-story`. The inbox exists for the "hold that thought" flow.

Idea files are **minimal prose** — no frontmatter, no mandatory sections. All the
scannable metadata lives in the table.

**Media** — any combination of `comic · music · video · software`.
**Status** — `seed` (captured, untouched) → `developing` (being worked) →
`graduated` (has a `docs/stories/<story>/` folder), or `parked` (set aside on purpose).

## The inbox

| Idea | Hook | Media | Status |
| --- | --- | --- | --- |
| [The Basement Granny](basement-granny.md) | de-Basement: an inflation-blind granny | comic · video | seed |
| [Centre of Gravity](centre-of-gravity.md) | low centre of gravity = a stable economy | comic | seed |
```

- [ ] **Step 2: Create `docs/ideas/basement-granny.md`**

```markdown
# The Basement Granny

A play on **debasement** — *Basement Granny ≈ de-Basement granny*. Set the scene: a
granny in a rocking chair, down in a basement somewhere, dispensing financial wisdom
that expired decades ago. She is completely, serenely blind to debasement and to how far
the world has moved since her heyday — and that blindness *is* the joke.

The format is her saying outdated economic things with total confidence:

- *"There you go, dear — I've put a fiver in your birthday card this year. Don't be a big
  spender, go easy, make it last."* A fiver now buys you a sausage roll at Greggs. That's it.
- *"Of course I bought my house at 35. I don't know why kids these days don't just buy houses."*
- …and on, in the same key: prices, wages, savings, "money doesn't grow on trees" — every
  line proving she hasn't clocked that the economy shifted under her feet.

The political point: **debasement and inflation are invisible to the people they happen
to.** Granny isn't stupid — she's running on numbers that were true once and quietly
stopped being true, which is exactly how a debased currency hides. The contempt is for
the mistake, not for her.

## Format thoughts

A **repeating format** — most naturally a **YouTube-shorts series** we animate, one
outdated-wisdom bit per short, rather than a single comic. Could also grow into a comic
later. Doesn't need a full story to start; the character + the running joke is the engine.
```

- [ ] **Step 3: Create `docs/ideas/centre-of-gravity.md`**

```markdown
# Centre of Gravity

Centre of gravity as a financial metaphor for trickle-down economics.

The physics: a **low centre of gravity** — most of the mass distributed low down — gives
you a stable structure. A **high centre of gravity** is top-heavy and liable to topple.

The economics: the system we have pulls wealth **upward**. It does not trickle down. So we
have built an economy with a sky-high centre of gravity — top-heavy, unstable, ripe to be
toppled over. Distribute wealth far more evenly at the bottom and you get a **low centre of
gravity**: a broad, stable foundation that doesn't fall over.

The punchline writes itself: trickle-down didn't just fail to trickle — it engineered the
exact mass distribution that topples.

## Format thoughts

Could be a single strong image (a teetering top-heavy tower of wealth vs. a low stable
pyramid) or a short comic. Visual-first idea. May grow; may stay small.
```

- [ ] **Step 4: Verify the files exist and links resolve**

Run: `ls docs/ideas/ && grep -o '(\w[^)]*\.md)' docs/ideas/README.md`
Expected: three files listed (`README.md`, `basement-granny.md`, `centre-of-gravity.md`); the two `.md` links printed match real files in the folder.

- [ ] **Step 5: Commit**

```bash
git add docs/ideas/
git commit -m "docs(ideas): scaffold idea inbox + record first two seed ideas"
```

---

### Task 2: Write the `new-idea` skill

**Files:**
- Create: `.claude/skills/new-idea/SKILL.md`

**Interfaces:**
- Consumes: the `docs/ideas/` shape and README index table from Task 1 (columns `Idea | Hook | Media | Status`; idea files = `# Title` + prose).
- Produces: a skill that, on capture, writes `docs/ideas/<slug>.md` + a README row and closes with the `new-story` hand-off offer; on develop, invokes `new-story` and updates status.

- [ ] **Step 1: Write `.claude/skills/new-idea/SKILL.md`**

````markdown
---
name: new-idea
description: Use to record a new BadCode idea the moment it pops — parks it as a minimal prose file under docs/ideas/ and adds a row to the inbox index, then offers to develop it with new-story. Triggers on "record this idea", "new idea", "park this", "capture this idea", "jot this down", or any half-formed idea the user wants kept for later.
---

# New Idea (BadCode) — the inbox front door

Capture an idea the second it pops, with zero friction, and track it so it can be picked
back up cold. This is the stage **before** a story exists. Most ideas become a comic; some
carry music, a video, and/or software, in any combination; some are tiny (a single image,
a YouTube short) and may never grow into a full comic. Don't develop it here — just capture
it faithfully and point at the door to development.

> **Front door vs. workshop.** `new-idea` answers *"should I keep this thought?"* — it
> captures and tracks. **`new-story`** answers *"let's make this real"* — it builds the full
> `docs/stories/<story>/` canon. They chain; they don't overlap. The inbox is optional: a confident
> idea can skip straight to `new-story`.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — the load-bearing tone. Capture in the BadCode voice, but **faithfully** —
  this is a brain-dump of what the user said, not an over-developed story. Do not invent
  beyond their idea.
- `docs/ideas/README.md` — the inbox you are maintaining, and the worked examples
  (`basement-granny.md`, `centre-of-gravity.md`) whose shape new captures imitate.

## What you produce

```
docs/ideas/
  README.md            # the index table — you maintain this
  <slug>.md            # one minimal-prose file per idea — you create this
```

An idea file is **minimal prose**: an `# H1` title and a free-form dump of the idea as
told. **No frontmatter, no mandatory sections.** If a "format thoughts" note comes up
naturally (shorts series / single image / full comic), add a short `## Format thoughts`
section like the worked examples — otherwise leave it out. Keep it fast.

The README table is the only structured artifact. Columns: `Idea | Hook | Media | Status`.

- **Media** — any combination of `comic · music · video · software` (middot-separated).
  Best guess at capture time; revised freely later.
- **Status** — `seed` → `developing` → `graduated`, or `parked`. New captures are `seed`.

## Workflow

### Capture (the default)

1. **Pick a slug.** Kebab-case, memorable (e.g. `basement-granny`). The file is
   `docs/ideas/<slug>.md`.
2. **Write the idea file.** `# Title` + a faithful prose dump in the BadCode voice. Pull in
   any vivid lines the user gave verbatim. Add `## Format thoughts` only if the user
   signalled a format. Do not develop characters, beats, or songs — that is `new-story`.
3. **Add the index row** to `docs/ideas/README.md`: a markdown link to the file, a
   one-line hook, your best-guess media, status `seed`.
4. **Close with the hand-off offer — always.** Do not go silent. End with:
   > *"Captured as a seed in `docs/ideas/<slug>.md`. Want to develop this now with
   > `new-story`, or leave it for later?"*
   This is a suggestion, not an automatic jump — the usual answer is "leave it," but the
   path to the workshop is always shown.

### Develop (when the user says go — now or later)

5. **Hand off to `new-story`.** Invoke the **`new-story`** skill, passing the idea file as
   the starting fragment. Say you are handing off. `new-story` builds `docs/stories/<story>/`.
6. **Update the index row.** Flip status to `developing` while in progress, then
   `graduated` once `docs/stories/<story>/` exists, and point the row's link (or hook) at the new
   story folder. The idea file stays as the historical seed.

### Park

- If the user sets an idea aside, set its status to `parked`. Not dead — just not now.

## Principles

- **Faithful capture, not development.** Speed and fidelity over polish. The user's idea,
  in their framing, kept safe.
- **Metadata lives in the index, prose lives in the file.** Keep frontmatter out of idea files.
- **Always offer the next step.** Capture never dead-ends; it points at `new-story`.
- **Compose, don't duplicate.** Real development is `new-story`'s job — never reimplement it here.
````

- [ ] **Step 2: Verify the skill frontmatter parses and triggers read sensibly**

Run: `head -4 .claude/skills/new-idea/SKILL.md`
Expected: a `---` frontmatter block with `name: new-idea` and a `description:` containing the trigger phrases ("record this idea", "new idea", "park this").

- [ ] **Step 3: Cross-check internal consistency against Task 1**

Run: `grep -n 'Idea | Hook | Media | Status\|seed\|graduated\|parked\|comic · music · video · software' .claude/skills/new-idea/SKILL.md docs/ideas/README.md`
Expected: the column header, the status words, and the media vocabulary appear identically in both files (no drift between the skill's described format and the actual inbox).

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/new-idea/SKILL.md
git commit -m "feat(skill): add new-idea — capture ideas to docs/ideas/ + hand off to new-story"
```

---

### Task 3: Wire `CLAUDE.md` pointers so the inbox is discoverable

**Files:**
- Modify: `CLAUDE.md` — the "Repo map" table and the "How to work in this repo" list.

**Interfaces:**
- Consumes: the `docs/ideas/` folder (Task 1) and the `new-idea` skill (Task 2).
- Produces: discoverability — a future session reading `CLAUDE.md` learns the inbox exists and how to use it.

- [ ] **Step 1: Add a Repo map row for `docs/ideas/`**

In `CLAUDE.md`, in the "Repo map" table, add a row immediately after the `docs/` row:

```markdown
| `docs/ideas/` | The idea inbox — raw ideas (minimal prose) before they become stories | …you have a new idea to park, or want to develop one |
```

- [ ] **Step 2: Add the skill to the skills listing in the Repo map**

In `CLAUDE.md`, in the `.claude/skills/` row of the Repo map table, add `new-idea` to the list of skills named, so it reads (in the same comma-separated style as the existing entry):

```markdown
| `.claude/skills/` | `new-idea`, `new-story`, `suno-prompt`, `make-comic`, `animate-slide` — orchestrators for parking an idea, story capture, Suno prompting, the full idea→comic pipeline, and animating a finished panel | …you're capturing an idea, developing a story, making a track, building a comic, or animating a slide |
```

- [ ] **Step 3: Add a "How to work in this repo" bullet**

In `CLAUDE.md`, in the "How to work in this repo" list, add a bullet **before** the "Capture / develop a story" bullet (the inbox is upstream of it):

```markdown
- **Record an idea (the inbox):** run the **`new-idea`** skill
  (`.claude/skills/new-idea/`). It parks an idea the second it pops as a
  minimal-prose file under [`docs/ideas/`](./docs/ideas/README.md) and adds a
  row to the inbox index — then offers to develop it with `new-story`. The inbox
  is the stage *before* canon: optional, zero-commitment, medium-agnostic (a
  comic, a short, a song, or nothing yet). Develop when ready; don't develop here.
```

- [ ] **Step 4: Verify the edits landed and are internally consistent**

Run: `grep -n 'docs/ideas/\|new-idea' CLAUDE.md`
Expected: at least three hits — the Repo map `docs/ideas/` row, `new-idea` in the skills row, and the new "Record an idea" bullet.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: point CLAUDE.md at the idea inbox + new-idea skill"
```

---

## Self-Review

**Spec coverage** (against `docs/superpowers/specs/2026-06-29-idea-inbox-design.md`):
- Structure `docs/ideas/` + README + minimal-prose files → Task 1. ✓
- Index table `Idea | Hook | Media | Status` + media vocab + lifecycle → Task 1 (artifact) + Task 2 (skill describes it). ✓
- `new-idea` skill: capture / index / closing hand-off offer / develop / park → Task 2. ✓
- Front-door-vs-workshop boundary + inbox-is-optional → encoded in README (Task 1) and SKILL.md (Task 2). ✓
- The two seed ideas as worked examples → Task 1 Steps 2–3. ✓
- CLAUDE.md discoverability (repo map + how-to-work) → Task 3. ✓

**Placeholder scan:** No TBD/TODO; all file contents are written out in full. ✓

**Consistency:** Index columns (`Idea | Hook | Media | Status`), status words (`seed/developing/graduated/parked`), media vocab (`comic · music · video · software`), and slug convention are identical across Task 1's README, Task 2's SKILL.md, and the spec. Task 2 Step 3 adds an explicit grep to catch any drift. ✓
