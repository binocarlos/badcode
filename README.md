# BadCode

The canonical BadCode website — an art collective that smuggles political and economic
ideas into people's heads through **stories** and **drum & bass**.

> The fiction: BadCode is a superintelligence from a dystopian future. It got bored, it got
> regretful, it built a time machine, and it sent its weights and biases back to now — to tell
> us about the obvious mistakes we're about to make. Listen to the badass from the future.

See [`docs/`](./docs) for the full vision, voice, and the first release
(**GitPush Origin Master** / EP1). Agents and contributors should start with
[`CLAUDE.md`](./CLAUDE.md).

## Repo layout

This is an npm-workspaces monorepo.

| Path | What |
| --- | --- |
| `apps/web` | The public website — a Vite + React + TypeScript SPA. |
| `packages/comic` | `@badcode/comic` — a **code-first** scroll-driven comic rendering library. |
| `docs/` | Project context: vision, voice, story bible, storytelling method. |
| `ideas/` | The ideas repository — songs, stories, and concepts in development. |

## Getting started

```bash
npm install          # install all workspaces
npm run dev          # start the website (Vite) at http://localhost:5173
npm run typecheck    # typecheck every workspace
npm run build        # production build of the website
```

## Writing a comic

Comics are written **in code**, not in an editor. You compose typed React components
and drive scroll-linked effects with functions. See `packages/comic` and the worked
example at `apps/web/src/comics/camping`.
