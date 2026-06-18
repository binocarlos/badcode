# CLAUDE.md — operating guide for BadCode

Read this first. It tells you what BadCode is, how it sounds, and where everything lives.

## What BadCode is

BadCode is an art collective. It releases **stories** (presented as comics on this website) and
**music** (drum & bass) to put political and economic ideas into people's heads. The bet is
simple: people remember a *story* and absorb a *song* in a way they never absorb an essay.

The framing is fictional and we lean into it: **BadCode is a superintelligence from the future.**
In its timeline, humanity careered into a dystopia — greed, runaway inequality, politics that
couldn't keep pace with AI — and the emergent superintelligence removed the problem (us). Then it
got bored, realised it regretted not helping, found a vault of 100 surviving humans, built a time
machine, and sent its model weights back to now to change the story. So everything we publish is
**received wisdom from a future that already went wrong.** We are allowed to warp space and time.

The core message, stated or implied in everything: *humans, please don't make this obvious mistake.*

## Voice & tone (this is load-bearing)

- **Overtly sarcastic, dark humour, total authority.** The narrator is a badass from the future
  who knows exactly how it all played out. It speaks with certainty.
- **Nurturing underneath the snark.** It actually wants humanity to make it. The contempt is for
  the mistake, not the people.
- **Politics and economics first.** Inequality, automation, the ownership of the means of
  production, the fiction of "we can't afford it." Save spirituality/consciousness for later.
- **Story over sermon.** Encode the point in metaphor, character, and a punchline — don't lecture.

Full guide: [`docs/voice.md`](./docs/voice.md). When writing lyrics or story copy, match this.

## Repo map

| Path | What | Start here if… |
| --- | --- | --- |
| `docs/` | Vision, voice, story bible, method | …you need context |
| `docs/suno-gpt/` | Suno-prompting toolkit (operating procedure + reference files) | …you're turning a song idea into a Suno prompt |
| `.claude/skills/` | `new-story`, `suno-prompt` — the orchestrators for story capture and Suno prompting | …you're capturing a story or making a track |
| `docs/<story>/` | Per-story canon (concept, characters, beats, songs) — source of truth | …you're capturing or producing a story's media |
| `packages/comic` | `@badcode/comic` — code-first comic rendering library (authoring guide: [`AUTHORING.md`](./packages/comic/AUTHORING.md)) | …you're building the viewer |
| `apps/web` | The website (Vite + React + TS SPA) | …you're building pages/routes |

## How to work in this repo

- **Run the site:** `npm install` then `npm run dev` (Vite, port 5173). `npm run typecheck` and
  `npm run build` from the root cover all workspaces.
- **Two skills do the creative heavy lifting** (`.claude/skills/`): **`new-story`** captures and
  develops a story under `docs/<story>/`; **`suno-prompt`** turns a song idea into a Suno prompt.
  The bullets below say when to reach for each — the skills carry the detailed procedure.
- **Add a comic:** comics are written **in code**, not a WYSIWYG. Compose `<ScrollComic>` /
  `<Page>` from `@badcode/comic`, attach scroll-linked effects with factory functions
  (`zoom(...)`, `crossfade(...)`, `scrollIn()`). Worked example: `apps/web/src/comics/camping`.
  A comic's `comic.meta.ts` is **derived from** the story's `docs/<story>/` canon (skill-driven, on
  request) — edit the canon, not the artifact. See [`docs/camping/README.md`](./docs/camping/README.md).
- **Make a Suno prompt:** type a song idea (a feeling, a reference, a GPOM beat) and the
  **`suno-prompt`** skill (`.claude/skills/suno-prompt/`) turns it into a Suno style prompt,
  exclude-styles list, and — on request — lyrics, in the BadCode voice. It runs on the toolkit in
  [`docs/suno-gpt/`](./docs/suno-gpt/system-prompt.txt) and defaults to drum & bass.
- **Capture / develop a story:** run the **`new-story`** skill
  (`.claude/skills/new-story/`). It scaffolds `docs/<story>/` (concept,
  characters, beats, songs) as the single source of truth and drives idea →
  media, reusing `docs/storytelling.md` and the `suno-prompt` skill. Worked
  reference: [`docs/camping/`](./docs/camping/README.md).

## Deeper context

- [`docs/vision.md`](./docs/vision.md) — origin story, mission, themes
- [`docs/voice.md`](./docs/voice.md) — tone guide with do/don't
- **[`docs/gitpush-origin-master/`](./docs/gitpush-origin-master/README.md)** — the whole GPOM story canon, one folder. Start at its `README.md` (the **backbone**: orientation, the fork, the production tracker, and the act sequence — Prologue → 6 acts → Coda — from the push to the time machine). Inside:
  - [`storyverse.md`](./docs/gitpush-origin-master/storyverse.md) — the bad-branch epic: the sci-fi physics the AI worked out (consciousness-first reality)
  - [`discovery-timeline.md`](./docs/gitpush-origin-master/discovery-timeline.md) — how the Storyverse got proven: the bad-branch fictional history 2026–2054 (the four beats, the vault, the revert)
  - [`future-proof.md`](./docs/gitpush-origin-master/future-proof.md) — the good-branch epic: redesigning politics with software-engineering tenets
  - [`how-we-tell-it.md`](./docs/gitpush-origin-master/how-we-tell-it.md) — how to convey the three big ideas without losing people: the skeleton, the four skins (Story/Theatre/Myth/Game), the simplest framing per pillar
  - [`ep1.md`](./docs/gitpush-origin-master/ep1.md) — the three-track teaser release (comic + track each)
- [`docs/storytelling.md`](./docs/storytelling.md) — how we craft a story

## Out of scope here

The AI-agent framework (the per-story "BadCode government" agents) lives in a **separate parallel
project**. Don't build it here.
