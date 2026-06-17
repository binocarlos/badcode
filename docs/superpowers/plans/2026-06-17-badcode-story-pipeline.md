# BadCode Story Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a standard `docs/<story>/` canon structure and a `new-story` orchestrator skill, piloted by fully capturing the **camping** story.

**Architecture:** Each story is a folder of markdown under `docs/<story>/` (the single source of truth). One `new-story` skill walks idea → captured canon, reusing the existing `docs/storytelling.md` method and `suno-prompt` skill, and (on request) deriving `apps/web/src/comics/<story>/comic.meta.ts`. v1 ships the structure + skill + camping pilot; it does **not** rewrite camping's comic slides or build codegen/video/social tooling.

**Tech Stack:** Markdown + YAML frontmatter. Claude Code skills (`.claude/skills/<name>/SKILL.md`). No new runtime dependencies.

## Global Constraints

- Source of truth is `docs/<story>/`; `comic.meta.ts` is *derived*, never hand-authored as canon. (Derivation is skill-driven, deferred per story — not exercised in this plan.)
- Structure is **medium-agnostic**: nothing assumes a story becomes a slide-based comic. `story.md` holds high-level narrative beats, never a slide list.
- Voice is load-bearing: all prose/lyrics follow `docs/voice.md` (sarcastic, dark, total authority; politics & economics first; story over sermon).
- Do **not** rewrite camping's comic slides; the comic already exists in `apps/web/src/comics/camping/`.
- Skills live at `.claude/skills/<name>/SKILL.md` with `name` + `description` frontmatter (match `.claude/skills/suno-prompt/SKILL.md`).
- Commits on this repo auto-publish to origin; commit only the files named in each task's `git add`.

---

### Task 1: Migrate camping song into the new structure

**Files:**
- Create: `docs/camping/songs/camping.md`
- Delete: `docs/camping/suno.md`

**Interfaces:**
- Produces: `docs/camping/songs/camping.md` with frontmatter keys `title`, `status`, `suno.style`, `suno.exclude`, `bpm`, `voices` — Task 4 (README tracker) and Task 6 (skill) reference this path and shape.

- [ ] **Step 1: Create `docs/camping/songs/camping.md`**

Preserve the existing lyrics and style verbatim from `docs/camping/suno.md`; add frontmatter on top and an exclude-styles list. Content:

```markdown
---
title: Camping
status: drafting
suno:
  style: >-
    Dark drum and bass, heavy rolling bassline, dystopian atmosphere. Raw gritty
    male vocals, spoken word rap, weathered street poet voice, confrontational but
    weary. Northern UK English, thick Scouse Liverpool accent, adenoidal Merseyside
    delivery with softened "ck" sounds and rising sing-song intonation, working
    class Liverpool drawl. Lo-fi vocal texture like recorded through a cheap phone.
    Aggressive yet vulnerable delivery, sardonic Northern wit, working class
    defiance. Dark, industrial, social commentary.
  exclude: >-
    liquid dnb, jump up, happy hardcore, pop, autotune, clean sung melody, polished
    studio vocal, American accent, RP English, soft female vocal, warm acoustic
    guitar, jazz, chillhop, uplifting, major key, orchestral
bpm: 174
voices: [bob, tarquin]
---

# Camping (song)

Two voices: **Bob** (Scouse, weathered) and **Tarquin** (posh London, sneering).
See [`../characters/bob.md`](../characters/bob.md) and
[`../characters/tarquin.md`](../characters/tarquin.md).

```lyrics
[Verse]
Once again and you catching my eye,
and you looking to the side in shame, but why

now, let me explain, how I'm just poor
[angry]
you KEEP ON WALKING through that Wait trose door

[spoken]
presenting yourself with your shiny teeth
fucking sense of entitlement and self belief

I get that you think your deals are slick
[whisper]
but I bet that you paid for your wheels on tick!

[shouting]
cash from the bank for your wank tank
let me count up all the cans that I drank

[spoken]
I'm not alone and I'm sick of this crap
this widening gap, now let's go snap snap

crackle and pop, I want change,
not from your pocket but at the top

in the meantime though let me hold that door
[shouting, desperate]
please sir, can I FUCKIN, have some more?

[Instrumental]
[heavy bassline drop]
[32 bars no lyrics]

[Verse: Tarquin - posh London stock trader, sneering]
you are intent on living in a tent
get fucked all day and pay no rent

it's a lack of work ethic, quite pathetic
getting paralytic and you just don't get it

prospects exist and you just resist
and now I insist that you just stop the grift

[mocking]
What about if we taxed the rich?
Oh my, here's the sitch, speak to the hand bitch!

[spoken]
I work hard to pay for my yard
an I pay my tax on all my stacks

you want change but my pockets are empty
the only thing I'm changing is the lanes in my M3

if you worked hard then you could have plenty, fenty,
all you seem to now do, is resent me.

[dismissive]
wealth gap? fuckin what a load of crap
now please let me drink my Châteauneuf-du-Pap

[Instrumental]
[heavy bassline drop]
[32 bars no lyrics]

[Bridge]
[Bob - weary]
Oh shit, here we both are, living in a car
park, in the rain and the dark, fast start

[Tarquin - weary]
went down the wrong track, then I got the sack,
then I drank, broke my back, now I'm in a cast part

[Both]
the AI does the fast part, now, the real question is
will it allow, because it's in charge now, blough

[Tarquin]
you see as it turns out, there is very little clout,
in having the manager or any of the c-suite about

[Bob]
the speed the robots replaced us was quicker
and sicker than when the government debased us

[Tarquin - reflective]
back to that time when we very first met,
I do regret that I judged you, I was wrong,

[Bob - warm]
yet I don't begrudge you, let's get along
let's make a happy ending for this song

[Tarquin]
well we don't have long and it might go wrong
[fading out]
but by the time it hits, we'll be gone
```
```

- [ ] **Step 2: Delete the old file**

Run: `git rm docs/camping/suno.md`
Expected: `rm 'docs/camping/suno.md'`

- [ ] **Step 3: Verify frontmatter and lyrics survived**

Run: `grep -c "voices: \[bob, tarquin\]" docs/camping/songs/camping.md && grep -c "Châteauneuf-du-Pap" docs/camping/songs/camping.md`
Expected: each prints `1`

- [ ] **Step 4: Commit**

```bash
git add docs/camping/songs/camping.md docs/camping/suno.md
git commit -m "docs(camping): migrate song into songs/ with frontmatter

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Capture camping characters

**Files:**
- Create: `docs/camping/characters/bob.md`
- Create: `docs/camping/characters/tarquin.md`

**Interfaces:**
- Consumes: character blurbs + `sheet` paths from `apps/web/src/comics/camping/comic.meta.ts` (do not modify that file).
- Produces: `docs/camping/characters/{bob,tarquin}.md` with frontmatter keys `name`, `role`, `voice`, `sheet`, `signals`. Task 3, 4, and the skill (Task 6) rely on this shape.

- [ ] **Step 1: Create `docs/camping/characters/bob.md`**

```markdown
---
name: Bob
role: protagonist
voice: "Scouse, weathered street-poet — adenoidal Merseyside drawl, softened 'ck', rising sing-song intonation, lo-fi phone texture"
sheet: characters/bob/sheet.latest.png
signals: charity-shop coat, grey stubble, kind tired eyes, ~50
---

# Bob

A homeless man of about fifty. Charity-shop coat, grey stubble, eyes that are
tired but kind. He did not fall because he was lazy — he went down the wrong
track, got the sack, drank, broke his back. An ordinary slide anyone could take.

He is the story's moral centre. He asks not for charity but for *change* —
"not from your pocket but at the top." When the same automation that took his
work finally takes Tarquin's, Bob has every reason to gloat and instead shows
kindness. The audience's first judgement of him is exactly the judgement the
story dismantles.
```

- [ ] **Step 2: Create `docs/camping/characters/tarquin.md`**

```markdown
---
name: Tarquin
role: antagonist → fellow victim
voice: "Posh London stock-trader — sneering, clipped RP, mocking and dismissive"
sheet: characters/tarquin/sheet.latest.png
signals: expensive overcoat, slicked hair, smug, early 30s, M3, Châteauneuf-du-Pape
---

# Tarquin

A sharp-suited financier in his early thirties. Smug, slick, certain the system
is fair because it has rewarded him. He believes the wealth gap is a fiction and
poverty a character flaw — "if you worked hard then you could have plenty."

He is the just-world fallacy with a haircut. The story's engine is that the same
automation logic he profits from does not stop at the working class: it takes the
managers and the C-suite too. Five years on he is beside Bob in the car park,
and he is the one who says, "I do regret that I judged you, I was wrong." He is
not a villain to be punished — he is us, mistaken.
```

- [ ] **Step 3: Verify both files exist with frontmatter**

Run: `for f in bob tarquin; do grep -q "^name: " docs/camping/characters/$f.md && echo "$f ok"; done`
Expected:
```
bob ok
tarquin ok
```

- [ ] **Step 4: Commit**

```bash
git add docs/camping/characters/bob.md docs/camping/characters/tarquin.md
git commit -m "docs(camping): capture Bob and Tarquin character canon

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Capture the camping story spine

**Files:**
- Create: `docs/camping/story.md`

**Interfaces:**
- Consumes: the spine format from `docs/storytelling.md` (Key concept + Background → beats); scenes from `comic.meta.ts`; characters from Task 2.
- Produces: `docs/camping/story.md` with frontmatter keys `id`, `title`, `logline`, `status`, `release`, `media`. Task 4's README links it.

- [ ] **Step 1: Create `docs/camping/story.md`**

Beats stay **high-level** (narrative, not slides). Content:

```markdown
---
id: camping
title: Camping
logline: A financier and the homeless man he judged both get automated away — and the one with nothing left is the one who shows grace.
status: comic-imported
release: ep1 / track 1
media: [comic, song]
---

# Camping

> The spine, per [`../storytelling.md`](../storytelling.md): the single idea,
> the real-world grounding, then the beats. High-level only — camping is
> already a comic in `apps/web/src/comics/camping/`; this file is the canon, not
> a slide plan.

## Key concept

Automation does not stop at the bottom. The same logic that replaces the
warehouse and the call centre comes for the manager and the C-suite too. The
man who sneered at the poor for "not working hard enough" ends up beside them —
and "we can't afford to fix this" was always a choice, not a law of nature.

## Background

The real grounding: post-2008 finance culture and the just-world story it tells
about itself (you have money because you earned it; you have none because you
didn't). The signifiers are specific — the M3, the Châteauneuf-du-Pape, the
Waitrose. Against that, the mechanics of displacement: people fall for ordinary
reasons (a bad break, the sack, drink, injury), benefits and work get automated,
and currency gets quietly debased. The punchline is that white-collar work —
managers, the C-suite — has *no special immunity*; it goes faster and harder
once the AI is "in charge now."

## Beats

1. **Peak.** Tarquin closes the biggest deal of his career, haloed by city
   lights. The system is rewarding him, and he is sure it is just.
2. **The encounter.** A grey supermarket car park. Bob asks for change. Tarquin
   judges him — feckless, work-shy — and dismisses the very idea of taxing
   wealth. "Speak to the hand."
3. **The Ghost of Economic Future.** We see how Bob actually fell: wrong track,
   the sack, drink, a broken back. Not a moral failing — a slide anyone can take.
4. **The reckoning.** Five years on. A boarded-up Waitrose. Automation has taken
   the managers and the C-suite; Tarquin is now in the car park beside Bob.
5. **The turn.** Tarquin admits he was wrong to judge. Bob — who has every right
   to gloat — chooses grace: "let's make a happy ending for this song." The
   warning lands soft: by the time it hits, we'll be gone. Humans, don't make
   this obvious mistake.

## The twist (use sparingly, per storytelling.md)

The judgement the audience makes in beat 2 is the judgement the story spends the
rest of itself dismantling. The smug man and the broken man were never different
kinds of people — only different distances from the same cliff.
```

- [ ] **Step 2: Verify frontmatter media list and beats**

Run: `grep -q "media: \[comic, song\]" docs/camping/story.md && grep -c "^[0-9]\." docs/camping/story.md`
Expected: prints `5` (five beats)

- [ ] **Step 3: Commit**

```bash
git add docs/camping/story.md
git commit -m "docs(camping): capture story spine (concept, background, beats)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Write the camping README (index + production tracker)

**Files:**
- Create: `docs/camping/README.md`

**Interfaces:**
- Consumes: `story.md`, `characters/*.md`, `songs/camping.md` from Tasks 1-3.
- Produces: the canonical README/tracker shape the `new-story` skill (Task 6) will scaffold for every future story.

- [ ] **Step 1: Create `docs/camping/README.md`**

```markdown
# Camping

> **Source of truth** for the Camping story. The comic and the song derive from
> this folder. See [`../storytelling.md`](../storytelling.md) for the method and
> [`../voice.md`](../voice.md) for tone.

EP1, track 1. A financier and the homeless man he judged both get automated away.

## Canon

- [`story.md`](./story.md) — key concept, background, high-level beats, the twist
- [`characters/bob.md`](./characters/bob.md) — Bob (Scouse, weathered)
- [`characters/tarquin.md`](./characters/tarquin.md) — Tarquin (posh London, sneering)
- [`songs/camping.md`](./songs/camping.md) — lyrics + Suno style/exclude

## Production tracker

| Medium | Where | Status |
| --- | --- | --- |
| Comic | `apps/web/src/comics/camping/` (already imported from Storyteller) | imported, not re-planned here |
| Song — "Camping" | [`songs/camping.md`](./songs/camping.md) | drafting (Suno) |
| Video | — | not started |
| Social posts | — | not started |

`comic.meta.ts` in `apps/web/src/comics/camping/` is **derived** from this canon
(skill-driven, on request); it is not hand-authored as the source.
```

- [ ] **Step 2: Verify links resolve**

Run: `cd docs/camping && for f in story.md characters/bob.md characters/tarquin.md songs/camping.md; do test -f "$f" && echo "$f ok" || echo "$f MISSING"; done; cd - >/dev/null`
Expected: all four print `ok`

- [ ] **Step 3: Commit**

```bash
git add docs/camping/README.md
git commit -m "docs(camping): add README index + production tracker

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Link the structure from storytelling.md

**Files:**
- Modify: `docs/storytelling.md` (the "Working process" section, step 4)

**Interfaces:**
- Consumes: the folder convention established in Tasks 1-4.
- Produces: a documented pointer so authors know `docs/<story>/` is the home for the spine.

- [ ] **Step 1: Update the working-process step that currently points only at `ideas/`**

In `docs/storytelling.md`, the "Working process" list ends with a step referencing
`ideas/` and templates. Replace that final list item with:

```markdown
4. Capture the story in its own folder, **`docs/<story>/`** — `story.md` (concept,
   background, high-level beats), `characters/<name>.md`, and `songs/<slug>.md`.
   This folder is the single source of truth; the comic's `comic.meta.ts` and any
   other media derive from it. Use the **`new-story`** skill to scaffold and drive
   the capture. Promote to a coded comic in `apps/web` when (and if) the story
   grows into a slide-based comic — not every story does.
```

- [ ] **Step 2: Verify the edit landed and the old `ideas/`-only wording is gone**

Run: `grep -q "docs/<story>/" docs/storytelling.md && grep -q "new-story" docs/storytelling.md && echo ok`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add docs/storytelling.md
git commit -m "docs: point storytelling working-process at docs/<story>/ canon

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Write the `new-story` orchestrator skill

**Files:**
- Create: `.claude/skills/new-story/SKILL.md`

**Interfaces:**
- Consumes: `docs/storytelling.md` (method), `docs/voice.md` (tone), the `suno-prompt` skill (song), the file shapes from Tasks 1-4.
- Produces: a skill that scaffolds `docs/<story>/` and walks idea → captured canon.

- [ ] **Step 1: Create `.claude/skills/new-story/SKILL.md`**

```markdown
---
name: new-story
description: Use when starting, capturing, or developing a BadCode story — scaffolds docs/<story>/ (concept, characters, beats, song) as the single source of truth and drives idea → media. Triggers on "new story", "capture this story", "let's develop <story>", "write the canon for <story>", or working on camping / Karen Will Lead the Revolution / The Emperor's New Coin / GitPush Origin Master.
---

# New Story (BadCode)

Take a story idea — a fragment, a reference, an existing comic, a GPOM beat — and
capture it as canon under `docs/<story>/`, the single source of truth that the
comic, the song(s), and any later media derive from. Drive it collaboratively
from the CLI; write the files as you go.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — load-bearing tone (sarcastic, dark, total authority; politics
  & economics first; story over sermon). All prose and lyrics match this.
- `docs/storytelling.md` — the method: Key concept + Background → beats →
  characters → image direction. Do not reinvent it; follow it.
- For canon-linked stories, skim `docs/gitpush-origin-master/README.md` to stay
  consistent with the arc.

## The structure you produce

A story is a folder of markdown. Source of truth. Medium-agnostic — never assume
a story becomes a slide-based comic.

```
docs/<story>/
  README.md            # index + production tracker (table: medium / where / status)
  story.md             # spine: Key concept, Background, high-level Beats, the twist
  characters/<name>.md # one per character (frontmatter + prose)
  songs/<slug>.md      # lyrics + Suno style/exclude (one file per track)
```

Frontmatter is light and is the subset machine artifacts need:

- `story.md`: `id, title, logline, status, release, media`
- `characters/<name>.md`: `name, role, voice, sheet, signals`
- `songs/<slug>.md`: `title, status, suno: {style, exclude}, bpm, voices`

`docs/camping/` is the worked reference — match its shape.

## Workflow

1. **Take the idea.** Fragment, reference, existing comic, or GPOM beat. Don't
   demand a brief.
2. **Scaffold** `docs/<story>/` with the files above.
3. **Capture the spine** collaboratively, writing each file as it firms up:
   **Key concept** (the one idea), **Background** (real-world grounding), then
   **characters**, then **high-level beats**. For an *existing* story, reverse-
   engineer from current material (comic scenes in `comic.meta.ts`, existing
   lyrics) rather than inventing.
4. **Song.** Invoke the **`suno-prompt`** skill to produce the style prompt,
   exclude list, and (on request) lyrics; write the result to `songs/<slug>.md`
   with frontmatter. Say you are handing off to `suno-prompt`.
5. **Derive `comic.meta.ts`** from the canon **only on request** — read the story
   + character files and write/update `apps/web/src/comics/<story>/comic.meta.ts`
   (style, characters with `sheet`/`description`, per-asset scenes). The canon is
   the source; `comic.meta.ts` is the artifact. Keep slide work out of scope
   unless asked.
6. **Maintain `README.md`** — the index and the production tracker (medium ×
   status), so the folder stays self-describing.

## Principles

- The canon is the source of truth; everything else derives from it. Edit canon,
  not the artifacts.
- Compose, don't duplicate: lean on `storytelling.md` and `suno-prompt`.
- Every story carries one load-bearing political/economic idea (see `voice.md`).
- Stay high-level in `story.md`; only plan slides when the user wants a comic.
```

- [ ] **Step 2: Verify the skill is discoverable**

Run: `grep -q "^name: new-story" .claude/skills/new-story/SKILL.md && grep -q "docs/<story>/" .claude/skills/new-story/SKILL.md && echo ok`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/new-story/SKILL.md
git commit -m "feat(skill): add new-story orchestrator for the story pipeline

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Register the skill and folder convention in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (the "Repo map" table and the "How to work in this repo" list)

**Interfaces:**
- Consumes: the skill and structure from Tasks 1-6.
- Produces: top-level discoverability so future sessions know the pipeline exists.

- [ ] **Step 1: Add a repo-map row for story canon**

In `CLAUDE.md`, add a row to the Repo map table (after the `ideas/` row):

```markdown
| `docs/<story>/` | Per-story canon (concept, characters, beats, songs) — source of truth | …you're capturing or producing a story's media |
```

- [ ] **Step 2: Add a "How to work" bullet for the skill**

In the "How to work in this repo" section, add:

```markdown
- **Capture / develop a story:** run the **`new-story`** skill
  (`.claude/skills/new-story/`). It scaffolds `docs/<story>/` (concept,
  characters, beats, songs) as the single source of truth and drives idea →
  media, reusing `docs/storytelling.md` and the `suno-prompt` skill. Worked
  reference: [`docs/camping/`](./docs/camping/README.md).
```

- [ ] **Step 3: Verify both edits landed**

Run: `grep -q "docs/<story>/" CLAUDE.md && grep -q "new-story" CLAUDE.md && echo ok`
Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: register new-story skill + docs/<story>/ convention in CLAUDE.md

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-review

**Spec coverage:**
- Structure (`docs/<story>/`, songs/ folder, characters/ per-file) → Tasks 1-4 (camping pilot), Task 6 (skill documents it).
- Light frontmatter schemas → Tasks 1-3 (camping), Task 6 (skill spec).
- `new-story` orchestrator skill → Task 6; registered → Tasks 5 & 7.
- Skill-driven `comic.meta.ts` derivation → documented as on-request in Task 6 step 1; correctly **not** exercised (deferred per spec).
- Pilot on camping without rewriting slides → Tasks 1-4; README explicitly states comic already imported.
- Deferred (codegen/video/social) → represented only as tracker rows / "not started"; no build tasks. ✓

**Placeholder scan:** No TBD/TODO; every create step contains full file content; every verify step has an exact command + expected output. ✓

**Type/shape consistency:** Frontmatter keys are consistent across Task 1 (`title/status/suno/bpm/voices`), Task 2 (`name/role/voice/sheet/signals`), Task 3 (`id/title/logline/status/release/media`), and the skill's documented schema in Task 6. Character `sheet` paths match `comic.meta.ts` (`characters/bob/sheet.latest.png`, `characters/tarquin/sheet.latest.png`). `voices: [bob, tarquin]` matches the two character filenames. ✓
