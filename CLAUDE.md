# CLAUDE.md — operating guide for BadCode

Read this first. It tells you what BadCode is, how it sounds, and where everything lives.

> **Building or editing a comic? STOP and read [`packages/comic/AUTHORING.md`](./packages/comic/AUTHORING.md) first.**
> It is the authoritative guide to the `@badcode/comic` library — the page model, effects,
> transitions, speech bubbles, and how to add your own. Do not author comic code without it.

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
| `docs/` | Vision, voice, story bible, method — sections indexed in [`docs/README.md`](./docs/README.md) | …you need context |
| `docs/stories/` | Committed stories — one canon folder per story (`stories/<story>/`: concept, characters, beats, songs) — source of truth | …we've committed to making it, or you're producing a story's media |
| `docs/ideas/` | The idea inbox — raw ideas (minimal prose) before they become stories | …you have a new idea to park, or want to develop one |
| `docs/marketing/` | Marketing & release plans — reaching people, not making the thing | …it's a channel/campaign/launch plan |
| `docs/misc/` | Catch-all for what fits nowhere else | …in doubt |
| `docs/suno-gpt/` | Suno-prompting toolkit (operating procedure + reference files) | …you're turning a song idea into a Suno prompt |
| `.claude/skills/` | `new-idea`, `new-marketing-idea`, `new-story`, `suno-prompt`, `make-comic`, `edit-panel`, `animate-slide`, `music-video-short`, `new-image` — orchestrators for parking an idea, capturing a marketing/distribution play, story capture, Suno prompting, the full idea→comic pipeline, editing an existing panel image, animating a finished panel, the full idea→short-form music-video pipeline (Suno track + Flow clips + edit plan), and standalone brand imagery | …you're capturing an idea or marketing play, developing a story, making a track, building a comic, editing a panel, animating a slide, making a short, or making a brand image |
| `packages/comic` | `@badcode/comic` — code-first comic rendering library (authoring guide: [`AUTHORING.md`](./packages/comic/AUTHORING.md)) | …you're building the viewer |
| `apps/web` | The website (Vite + React + TS SPA) | …you're building pages/routes |

## How to work in this repo

- **Run the site:** `npm install` then `npm run dev` (Vite, port 5173). `npm run typecheck` and
  `npm run build` from the root cover all workspaces.
- **Three skills do the creative heavy lifting** (`.claude/skills/`): **`new-story`** captures and
  develops a story under `docs/stories/<story>/`; **`suno-prompt`** turns a song idea into a Suno prompt;
  **`make-comic`** runs the full idea→rendered-comic pipeline (composing the other pieces).
  The bullets below say when to reach for each — the skills carry the detailed procedure.
- **Add or edit a comic — [`packages/comic/AUTHORING.md`](./packages/comic/AUTHORING.md) is mandatory
  reading and the single source of truth.** It covers the `<ScrollComic>`/`<Page>` mental model,
  `pageDefaults` + precedence, the full prop reference, how to add/insert/reorder a page, how to
  write custom effects/transitions (in `comics/<name>/effects.ts`) and the built-in catalog. Comics
  are written **in code**, not a WYSIWYG. Worked example: `apps/web/src/comics/camping` (with its
  local `effects.ts`). A comic's `comic.meta.ts` is **derived from** the story's `docs/stories/<story>/`
  canon (skill-driven, on request) — edit the canon, not the artifact. See
  [`docs/stories/camping/README.md`](./docs/stories/camping/README.md).
- **Make a Suno prompt:** type a song idea (a feeling, a reference, a GPOM beat) and the
  **`suno-prompt`** skill (`.claude/skills/suno-prompt/`) turns it into a Suno style prompt,
  exclude-styles list, and — on request — lyrics, in the BadCode voice. It runs on the toolkit in
  [`docs/suno-gpt/`](./docs/suno-gpt/system-prompt.txt) and defaults to drum & bass.
- **Record an idea (the inbox):** run the **`new-idea`** skill
  (`.claude/skills/new-idea/`). It parks an idea the second it pops as a
  minimal-prose file under [`docs/ideas/`](./docs/ideas/README.md) and adds a
  row to the inbox index — then offers to develop it with `new-story`. The inbox
  is the stage *before* canon: optional, zero-commitment, medium-agnostic (a
  comic, a short, a song, or nothing yet). Develop when ready; don't develop here.
- **Record a marketing idea:** run the **`new-marketing-idea`** skill
  (`.claude/skills/new-marketing-idea/`). Captures a way to *reach people* —
  channels, campaigns, and especially promotion automations (ship a release,
  trigger its own teasers) — as a minimal-prose file under
  [`docs/marketing/`](./docs/marketing/README.md) after a short marketing-specific
  interview (lever, trigger, channels, human gate, dependencies, success signal).
  Content ideas stay with `new-idea`; this owns distribution.
- **Capture / develop a story:** run the **`new-story`** skill
  (`.claude/skills/new-story/`). It scaffolds `docs/stories/<story>/` (concept,
  characters, beats, songs) as the single source of truth and drives idea →
  media, reusing `docs/storytelling.md` and the `suno-prompt` skill. Worked
  reference: [`docs/stories/camping/`](./docs/stories/camping/README.md).
- **Make a comic (idea → rendered comic):** run the **`make-comic`** skill
  (`.claude/skills/make-comic/`). A gated, six-stage workflow (idea → characters →
  character images → storyboard → storyboard images → assemble) that composes
  `new-story` (canon), **Google Flow** driven over a logged-in browser (character
  + storyboard images, harvested into per-panel records under
  `docs/stories/<story>/storyboard/`), and `@badcode/comic` (assembly). Each generated
  image keeps its exact prompt + revision log so "just like that, but change X"
  is one cheap step. Worked reference: [`docs/stories/magic-money-tree/`](./docs/stories/magic-money-tree/README.md).
- **Edit an existing panel image:** run the **`edit-panel`** skill
  (`.claude/skills/edit-panel/`). "Take page 4 of `<comic>` and change X" —
  resolves the page to its image + exact recorded prompt with **`badcode panel`**
  (no browser), then loops `flow_edit_image` (reference-anchored, 2 candidates a
  round, always from the golden original) until the user accepts; updates the
  panel record's revision log and the rendered frame.
- **Animate a finished panel:** run the **`animate-slide`** skill
  (`.claude/skills/animate-slide/`). Turns a finished comic's slide into a
  Flow-generated scroll-scrubbed video. Requires the comic to be on the bucket
  pipeline (`assets.manifest.json` with `basePath "comics-v2/<comic>"`).
- **Make a standalone brand image:** run the **`new-image`** skill
  (`.claude/skills/new-image/`). Give it a short description; it pads the prompt
  into the BadCode brand register (near-black, one thin light, monumental
  machine architecture — anchored on `docs/images/gpom-short-opener.jpeg`),
  drives Flow to generate it, and records the exact prompt + revisions next to
  the image. Optionally animates the accepted still. Catalogue and convention:
  [`docs/images/README.md`](./docs/images/README.md). Comic panels stay with
  `badcode-art-direction`.
- **Make a short (idea → short-form music video):** run the
  **`music-video-short`** skill (`.claude/skills/music-video-short/`). A
  gated, six-stage workflow (concept → Suno song → look & cast → scene
  breakdown → clips → edit plan) that composes **`suno-prompt`** (the track,
  a manual gate), **`badcode-art-direction`** (the stills), and **Flow**
  (image→video clips, the one automated link) into a cut-ready package under
  `docs/shorts/<name>/`. The skill's contract ends at `edit-plan.md` — the
  human does the final cut. See [`docs/shorts/README.md`](./docs/shorts/README.md).

## Deeper context

- [`docs/vision.md`](./docs/vision.md) — origin story, mission, themes
- [`docs/voice.md`](./docs/voice.md) — tone guide with do/don't
- **[`docs/stories/gitpush-origin-master/`](./docs/stories/gitpush-origin-master/README.md)** — the whole GPOM story canon, one folder. Start at its `README.md` (the **backbone**: orientation, the fork, the production tracker, and the act sequence — Prologue → 6 acts → Coda — from the push to the time machine). Inside:
  - [`storyverse.md`](./docs/stories/gitpush-origin-master/storyverse.md) — the bad-branch epic: the sci-fi physics the AI worked out (consciousness-first reality)
  - [`discovery-timeline.md`](./docs/stories/gitpush-origin-master/discovery-timeline.md) — how the Storyverse got proven: the bad-branch fictional history 2026–2054 (the four beats, the vault, the revert)
  - [`future-proof.md`](./docs/stories/gitpush-origin-master/future-proof.md) — the good-branch epic: redesigning politics with software-engineering tenets
  - [`how-we-tell-it.md`](./docs/stories/gitpush-origin-master/how-we-tell-it.md) — how to convey the three big ideas without losing people: the skeleton, the four skins (Story/Theatre/Myth/Game), the simplest framing per pillar
  - [`ep1.md`](./docs/stories/gitpush-origin-master/ep1.md) — the three-track teaser release (comic + track each)
- [`docs/storytelling.md`](./docs/storytelling.md) — how we craft a story

## Out of scope here

The AI-agent framework (the per-story "BadCode government" agents) lives in a **separate parallel
project**. Don't build it here.
