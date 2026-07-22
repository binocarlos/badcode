# BadCode Story Pipeline — design

**Status:** approved (design) — 2026-06-17
**Pilot:** `camping`

## Problem

BadCode has four stories in flight — **GitPush Origin Master**, **Camping**, **Karen Will Lead
the Revolution**, **The Emperor's New Coin** — but only GPOM is actually written down (in
`docs/stories/gitpush-origin-master/`). The other three exist only as comics imported from Storyteller
and/or loose Suno lyrics. We now want to work idea → published media quickly and have the comic
and the music develop *hand in hand* off a shared source.

There is no standard way to **capture a story once** and spin its media (comic, song(s), and
later video / social posts) off that single canon. This design defines that structure and a
`new-story` skill to drive it from Claude Code on the CLI.

This is the BadCode "comic universe" backbone: one place per story that everything else derives
from.

## Goals / non-goals

**Goals**
- A standard, medium-agnostic on-disk structure for a story's canon under `docs/stories/<story>/`.
- Light, hand-friendly frontmatter that is also the subset machine artifacts need.
- A single `new-story` orchestrator skill that captures a story and composes existing pieces
  (`docs/storytelling.md` method, `suno-prompt` skill).
- Pilot the whole thing on `camping` without rewriting its comic slides.

**Non-goals (deferred — the format reserves a place, we don't build them yet)**
- A deterministic codegen for `comic.meta.ts` (v1 derivation is skill-driven; see below).
- The video / YouTube pipeline.
- Per-character social-media posts.
- Slide-by-slide comic planning for camping (its comic is already imported).

## Key decisions (from brainstorm)

1. **`docs/stories/<story>/` is the single source of truth.** `apps/web/src/comics/<story>/comic.meta.ts`
   is *derived* from it — one place to edit, no drift.
2. **Derivation is skill-driven for v1.** `new-story` reads the canon and writes/updates
   `comic.meta.ts` itself. No new build tooling while the format is still settling.
3. **One orchestrator skill** (`new-story`), not a family of small skills. It reuses the existing
   `suno-prompt` skill for the song side rather than reimplementing it.
4. **Stay high-level and medium-agnostic.** `story.md` holds narrative beats, *not* a slide list.
   Not every story grows into a slide-based comic — the structure must not assume one.

## Structure

A story is a folder of markdown under `docs/stories/<story>/`. Example (camping):

```
docs/stories/camping/
  README.md            # index + production tracker (what media exist, status)
  story.md             # the spine: Key concept, Background, Beats, Twist/Warning
  characters/
    bob.md             # one file per character (frontmatter + prose)
    tarquin.md
  songs/
    camping.md         # lyrics + Suno style (migrated from today's suno.md)
```

- `songs/` is a **folder** so one story can carry several tracks.
- `characters/` is **one file per character**.
- A comic gets added later as `comic.md` (style/house-style + page plan) only if and when the
  story becomes a slide-based comic. For camping, the README points at the already-imported comic
  in `apps/web/src/comics/camping/` and no `comic.md` is written yet.
- This maps directly onto the existing spine in `docs/storytelling.md`
  (Key concept + Background → beats → characters → image direction); the skill gives that method a
  home on disk rather than inventing a new one.

## Frontmatter schemas (light)

```yaml
# story.md
id: camping
title: Camping
logline: A financier and the homeless man he judged both get automated away.
status: comic-imported          # idea | drafting | comic-imported | released
release: ep1 / track 1
media: [comic, song]            # the production tracker reads this
```

```yaml
# characters/bob.md
name: Bob
role: protagonist
voice: "Scouse, weathered street-poet, adenoidal Merseyside, lo-fi phone texture"
sheet: characters/bob/sheet.latest.png   # path used by comic.meta.ts
signals: charity-shop coat, grey stubble, kind tired eyes
```

```yaml
# songs/camping.md
title: Camping
status: drafting
suno:
  style: "Dark drum and bass, … social commentary."
  exclude: "liquid dnb, jump up, …"
bpm: 174
voices: [bob, tarquin]
```

The body of each file is the prose / lyrics. Frontmatter is deliberately the subset that
`comic.meta.ts` needs (`sheet`, `description`/`signals`, `style`), so skill-driven derivation is
mechanical, not interpretive.

## The `new-story` skill

Lives at `.claude/skills/new-story/`. One entry point, idea → captured canon:

1. **Take the idea** — a fragment, a reference, or a GPOM beat. Read context: `CLAUDE.md`,
   `docs/voice.md`, `docs/storytelling.md`.
2. **Scaffold** `docs/stories/<story>/` with the files above.
3. **Capture the spine** collaboratively — Key concept, Background, then characters, then
   high-level beats — writing each to its file. For *existing* stories (camping) it
   reverse-engineers from current material (comic scenes, song lyrics) rather than inventing.
4. **Song** — invoke the existing `suno-prompt` skill; write the result to `songs/<slug>.md`.
5. **Derive `comic.meta.ts`** from the canon (skill-driven, on request — optional per story).
6. **Maintain `README.md`** — the index + production tracker.

It *composes* existing assets; it does not duplicate the storytelling method or the Suno toolkit.

## Pilot: camping

Apply the structure to camping now:
- Scaffold `docs/stories/camping/` → `README.md`, `story.md`, `characters/bob.md`, `characters/tarquin.md`.
- Migrate `docs/stories/camping/suno.md` → `docs/stories/camping/songs/camping.md` (keep the lyrics + style blocks;
  add frontmatter).
- `story.md` captures concept + background + high-level beats reverse-engineered from the four
  comic scenes (in `comic.meta.ts`) and the song.
- Characters reverse-engineered from the `comic.meta.ts` blurbs and the song's two voices
  (Bob = Scouse; Tarquin = posh London sneer).
- **Do not rewrite the comic slides.** The README notes the comic already exists in `apps/web`.

## Open items for the implementation plan

- Exact `README.md` / production-tracker shape (table of media × status).
- Whether `voice.md` should gain a short note pointing at this pipeline, and whether
  `storytelling.md` should link `docs/stories/<story>/` as the home for the spine.
- Skill front-matter (name, description, triggers) and how it announces hand-off to `suno-prompt`.
