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
| `ideas/` | Songs, stories, concepts in development (+ templates) | …you're capturing or developing an idea |
| `packages/comic` | `@badcode/comic` — code-first comic rendering library | …you're building the viewer |
| `apps/web` | The website (Vite + React + TS SPA) | …you're building pages/routes |

## How to work in this repo

- **Run the site:** `npm install` then `npm run dev` (Vite, port 5173). `npm run typecheck` and
  `npm run build` from the root cover all workspaces.
- **Add a comic:** comics are written **in code**, not a WYSIWYG. Compose `<ScrollComic>` /
  `<Page>` from `@badcode/comic`, attach scroll-linked effects with factory functions
  (`zoom(...)`, `crossfade(...)`, `scrollIn()`). Worked example: `apps/web/src/comics/camping`.
- **Add an idea:** copy a template from `ideas/templates/` into `ideas/songs|stories|concepts/`.
  See [`ideas/README.md`](./ideas/README.md). We develop ideas collaboratively before they become
  comics — don't bulk-import; curate so each one fits the GitPush Origin Master narrative.

## Deeper context

- [`docs/vision.md`](./docs/vision.md) — origin story, mission, themes
- [`docs/voice.md`](./docs/voice.md) — tone guide with do/don't
- [`docs/gitpush-origin-master.md`](./docs/gitpush-origin-master.md) — the overarching project / timeline (the **fork**: bad branch vs. good branch); start here for the arc
- [`docs/storyverse.md`](./docs/storyverse.md) — the bad-branch epic: the sci-fi physics the AI worked out (consciousness-first reality)
- [`docs/discovery-timeline.md`](./docs/discovery-timeline.md) — how the Storyverse got proven: the bad-branch fictional history 2026–2054 (the four beats, the vault, the revert)
- [`docs/gitpush-origin-master-story.md`](./docs/gitpush-origin-master-story.md) — the master story: the spine and scene sequence of the title comic (the eight acts, from the push to the time machine)
- [`docs/how-we-tell-it.md`](./docs/how-we-tell-it.md) — how to convey the three big ideas without losing people: the skeleton, the four skins (Story/Theatre/Myth/Game), the simplest framing per pillar
- [`docs/future-proof.md`](./docs/future-proof.md) — the good-branch epic: redesigning politics with software-engineering tenets
- [`docs/ep1.md`](./docs/ep1.md) — the three-track teaser release (comic + track each)
- [`docs/storytelling.md`](./docs/storytelling.md) — how we craft a story

## Out of scope here

The AI-agent framework (the per-story "BadCode government" agents) lives in a **separate parallel
project**. Don't build it here.
