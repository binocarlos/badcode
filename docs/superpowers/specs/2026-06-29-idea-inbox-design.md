# Design: the idea inbox — `docs/ideas/` + the `new-idea` skill

> Brainstormed with Kai, 2026-06-29. A lightweight place to record ideas the second
> they pop, sitting **upstream** of the existing `new-story` → `docs/<story>/` canon
> pipeline. Most ideas will become a comic; some carry music, video, and/or software,
> in any combination; some are tiny (a single image, a YouTube short) and may never be
> a full comic.

## Goal

From an open Claude Code session: *"record this idea: …"* and the idea is captured
instantly as a small prose file, with a one-row entry in a scannable index. No brief
demanded, no shape forced. Later, *"let's develop the Basement Granny"* hands the idea
off to `new-story`, which builds the real canon — and the inbox row flips to `graduated`.

The inbox **feeds** the existing pipeline; it does not replace or duplicate any of it.

## Where this sits relative to `new-story`

```
idea pops  ──/new-idea──▶  docs/ideas/<slug>.md   (seed)
                                  │
                          (develop it)
                                  │ /new-idea hand-off
                                  ▼
                          new-story skill ──▶ docs/<story>/   (full canon)
                                  │
                          inbox row ──▶ status: graduated, links to docs/<story>/
```

`new-story` already owns "develop an idea into full canon." The inbox is the stage
*before* that. The two never overlap: an idea file is a brain-dump; a `docs/<story>/`
folder is the source of truth.

## Structure

```
docs/ideas/
  README.md            # curated index + how-it-works blurb (the only structured artifact)
  basement-granny.md   # minimal prose, one file per idea
  centre-of-gravity.md
```

### Idea files — minimal prose

An `# H1` title and a free-form brain-dump of the idea as told. **No frontmatter, no
mandatory sections.** The whole point is zero-friction capture. Format thoughts ("this
is a shorts series, not a comic"; "could just be a single image") go in the prose if
they come up naturally — nothing is required. Written in the BadCode voice but as a
*faithful capture*, not an over-developed story.

### The index — `README.md`

The only structured artifact, and the home of all the lightweight metadata (so capture
stays frictionless and the files stay free). A short "how this works" blurb, then a table:

| Idea | Hook | Media | Status |
| --- | --- | --- | --- |
| [Basement Granny](basement-granny.md) | de-Basement / inflation-blind granny | comic · video | seed |
| [Centre of Gravity](centre-of-gravity.md) | low centre of gravity = stable economy | comic | seed |

- **Media** — any combination of `comic · music · video · software`. Captures the
  "might have music, might not; might have a video, might not; might have software,
  might not" nature. Best guess at capture time; revised freely.
- **Status** — the lifecycle below.

### Lifecycle

```
seed ──▶ developing ──▶ graduated
  └──────────▶ parked
```

- **seed** — captured, untouched since.
- **developing** — actively being worked (e.g. `new-story` in progress).
- **graduated** — has a real `docs/<story>/` folder; the README row links to it. The
  idea file stays as the historical seed.
- **parked** — set aside on purpose (not dead, just not now).

## The `new-idea` skill

A small skill in `.claude/skills/new-idea/`. Triggers: "record this idea", "new idea",
"park this", "capture this idea". Three jobs:

1. **Capture** — write `docs/ideas/<slug>.md` from what the user said: an `# H1` title
   and a faithful prose brain-dump in the BadCode voice. Pick a kebab-case `<slug>`.
2. **Index** — add or update the idea's row in `docs/ideas/README.md` (hook, best-guess
   media, status `seed`).
3. **Hand off** — when the user says an idea is ready to develop, invoke the `new-story`
   skill (passing the idea file as the starting fragment), then flip the README row to
   `developing`/`graduated` and link the resulting `docs/<story>/`.

The skill stays deliberately thin: it does not develop characters, beats, or songs —
that is `new-story`'s job. It captures and tracks.

## Discoverability

`CLAUDE.md` gets:
- a row in the **Repo map** table for `docs/ideas/` ("the idea inbox — raw ideas before
  they become stories");
- a bullet in **How to work in this repo** describing `new-idea` and when to reach for it
  (record an idea → develop later via `new-story`).

## Bootstrapping — the two seed ideas

The same change set records Kai's two starting ideas, in the skill's own format (so they
double as worked examples):

- **`docs/ideas/basement-granny.md`** — "The Basement Granny." A play on *debasement* /
  inflation: a granny in a rocking chair in a basement who keeps saying financially
  outdated things — "there you go dear, a fiver in your birthday card, don't be a big
  spender, make it last" (a fiver now = a Greggs sausage roll); "of course I bought my
  house at 35, don't know why kids these days don't." The joke: she's blind to debasement
  and how the economy shifted since her heyday. *Basement Granny ≈ debasement granny.*
  A **repeating format** — likely a YouTube-shorts series rather than one comic; could
  also grow into a comic. Media guess: `comic · video`.
- **`docs/ideas/centre-of-gravity.md`** — centre of gravity as a financial metaphor for
  trickle-down. A low centre of gravity (mass distributed low) is stable; a high one
  topples. Today's system pulls wealth *upward* → high centre of gravity → ripe to topple.
  Distribute wealth at the bottom → low centre of gravity → stable foundation. Media
  guess: `comic`.

## Scope / YAGNI

- No frontmatter on idea files. No per-idea folders. No automation beyond write-file +
  update-table. The README table is maintained by hand (by the skill).
- The skill does **not** generate images, songs, or canon — it strictly captures and
  hands off. All development happens in the existing skills.

## Success criteria

1. `docs/ideas/` exists with a README index and the two seed ideas.
2. Saying "record this idea: …" produces a new `docs/ideas/<slug>.md` + a README row,
   with no further prompting needed.
3. Saying "let's develop <idea>" hands off cleanly to `new-story` and updates the status.
4. `CLAUDE.md` points to the inbox so the convention is discoverable next session.
