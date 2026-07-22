---
name: new-story
description: Use when starting, capturing, or developing a BadCode story — scaffolds docs/stories/<story>/ (concept, characters, beats, song) as the single source of truth and drives idea → media. Triggers on "new story", "capture this story", "let's develop <story>", "write the canon for <story>", or working on camping / Karen Will Lead the Revolution / The Emperor's New Coin / GitPush Origin Master.
---

# New Story (BadCode)

Take a story idea — a fragment, a reference, an existing comic, a GPOM beat — and
capture it as canon under `docs/stories/<story>/`, the single source of truth that the
comic, the song(s), and any later media derive from. Drive it collaboratively
from the CLI; write the files as you go.

> For the **full idea → rendered-comic pipeline** — including generating the
> character and storyboard images in Google Flow and assembling the comic — use
> the **`make-comic`** skill, which composes this one for its canon stages.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — load-bearing tone (sarcastic, dark, total authority; politics
  & economics first; story over sermon). All prose and lyrics match this.
- `docs/storytelling.md` — the method: Key concept + Background → beats →
  characters → image direction. Do not reinvent it; follow it.
- For canon-linked stories, skim `docs/stories/gitpush-origin-master/README.md` to stay
  consistent with the arc.

## The structure you produce

A story is a folder of markdown. Source of truth. Medium-agnostic — never assume
a story becomes a slide-based comic.

```
docs/stories/<story>/
  README.md            # index + production tracker (table: medium / where / status)
  story.md             # spine: Key concept, Background, high-level Beats, the twist
  characters/<name>.md # one per character (frontmatter + prose)
  songs/<slug>.md      # lyrics + Suno style/exclude (one file per track)
```

Frontmatter is light and is the subset machine artifacts need:

- `story.md`: `id, title, logline, status, release, media`
- `characters/<name>.md`: `name, role, voice, sheet, signals`
- `songs/<slug>.md`: `title, status, suno: {style, exclude}, bpm, voices`

`docs/stories/camping/` is the worked reference — match its shape.

## Workflow

1. **Take the idea.** Fragment, reference, existing comic, or GPOM beat. Don't
   demand a brief.
2. **Scaffold** `docs/stories/<story>/` with the files above.
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
