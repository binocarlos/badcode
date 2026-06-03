# Comic Asset Tooling — Design Spec

**Date:** 2026-06-02
**Status:** Approved design, ready for implementation planning
**Scope:** Manual-first toolchain for generating and managing comic image/video assets via AI models, driven by a CLI (agent-drivable), not a web UI.

## Problem & context

BadCode comics are written **in code** (`@badcode/comic` + a hand-written component per comic). Today a comic's image sources are hard-coded paths to placeholder SVGs in the app's `public/` folder. There is no layer for generating or managing the real AI-generated artwork.

The prior project (`storyteller`) solved generation with a heavy stack — a Go API, a job queue, Postgres, n8n, and a web UI that drove image/video models directly. That weight is exactly what we are shedding. The lesson: building a full UI and integrating the models into the product made it over-opinionated and slow.

This spec applies the same "just write code" philosophy that produced `@badcode/comic` to **asset generation**: a thin, CLI-driven layer that prepares prompts and manages assets, while the actual model invocation happens **outside this repo** (a human running Gemini AI Studio manually, for now).

### Why manual Gemini

We have a Google subscription with AI credits, but spending them requires driving **Gemini AI Studio in a browser** (not the metered API). We run our stack inside **WSL**, where Claude Code on the CLI cannot easily reach a browser. So the first version is deliberately **manual**: the tool prepares everything a human needs to run Gemini by hand and bring the result back. Browser automation is researched but not built (see Future Phases).

## Goals

1. Define all comic **generation metadata statically in code** — no database. Style, characters, scene prompts, and asset pointers live in a typed file next to the comic.
2. Store heavy assets (images, videos) in a **Google Cloud Storage bucket**, managed as a **separate control plane** from the deployed code.
3. Provide a **CLI** that, for any asset, assembles a ready-to-paste Gemini prompt plus the list of reference images to attach.
4. Provide a **CLI** that takes a downloaded Gemini result and pushes it into the bucket as a new version, **without editing any TypeScript**.
5. Keep the **display** of a comic as hand-written code; only the image/video *sources* are driven by metadata.

## Non-goals

- No web UI, no editor, no WYSIWYG.
- No integration of image/video models into this repo. Model invocation is external (manual Gemini now; automation later, out of core).
- No database. No runtime config-driven comic rendering — comics remain hand-written components.
- Browser automation is **not** built in this spec (researched only).

## Key decisions (resolved during brainstorming)

| Decision | Choice | Rationale |
| --- | --- | --- |
| Spec scope | Manual-first toolchain: metadata model + prompt CLI + GCS push/pull. Browser automation researched, not built. | Buildable now, clearly valuable; defers the fragile part. |
| Metadata format | Typed **TS module validated by a shared Zod schema**. | Single source of truth: types + runtime validation; importable by both web app and CLI. |
| Asset reference / hot-swap | **`.latest` stable pointer.** Metadata stores a version-free path written once; the bucket keeps numbered versions plus a `.latest` copy. | No TypeScript edits on re-gen; full version history in the bucket; restores no-redeploy hot-swap. |
| Scene prompts | **In metadata per asset**, with the CLI's `--add` text **appended** (additive, never replacing the metadata base). | Reproducible record in code; quick iteration without losing the canonical base. |
| Return leg (push) | **One automated command**, never edits TypeScript (enabled by `.latest`). | Fast round-trip; the `.ts` stays untouched. |
| Generation targets | **Character sheets, page images, and video** — all in this spec. | One coherent model designed at once. |
| Reference staging | **Print URLs only** (no local staging folder). | Minimal tooling; human clicks, downloads, attaches. |
| Packaging | Two new packages: `@badcode/comic-meta` (schema + resolver, isomorphic) and `@badcode/cli` (Node-only `badcode` bin). | Keeps the browser bundle free of node/gcloud code; separates display from generation. |
| Bucket | Reuse existing **`badcode-storage`** (public-read), namespaced per comic. | Already exists and is authenticated; no new infra. |

## Architecture

### Packages

- **`@badcode/comic-meta`** (isomorphic, no node-only deps)
  - The Zod schema for a comic's generation metadata.
  - `defineComic(config)` — validates and returns a typed comic metadata object.
  - Types inferred from the schema (the public contract).
  - `resolve(meta, assetId)` — turns an asset id into a public GCS URL.
  - Constant for the bucket base URL.
  - May emit a JSON Schema for any future non-TS consumer.
- **`@badcode/cli`** (Node-only)
  - A `badcode` bin, TypeScript run via `tsx`, thin command parser (e.g. `commander`).
  - Depends on `@badcode/comic-meta` for the schema/resolver.
  - Uses `gcloud`/`gsutil` (already installed and authenticated as the user) for bucket operations.

These join the existing workspaces (`@badcode/comic`, `apps/web`). The display library `@badcode/comic` is untouched.

### Metadata model

A comic's generation metadata lives beside its component, e.g. `apps/web/src/comics/camping/comic.meta.ts`:

```ts
import { defineComic } from '@badcode/comic-meta'

export default defineComic({
  id: 'camping',
  style: 'Gritty graphic-novel ink, muted palette, heavy shadow…', // comic-wide system prompt
  characters: {
    bob:     { name: 'Bob',     description: 'Weathered, ~50, charity-shop coat…',
               sheet: 'characters/bob/sheet.latest.png' },
    tarquin: { name: 'Tarquin', description: 'Sharp-suited, 30s, smug…',
               sheet: 'characters/tarquin/sheet.latest.png' },
  },
  assets: {
    'p2-main': {
      kind: 'image',
      path: 'pages/p2/main.latest.png',
      characters: ['bob', 'tarquin'],
      scene: 'Bob holds out a coin to Tarquin outside a boarded-up Waitrose. Cold grey dawn, wide shot.',
    },
    'p2-anim': {
      kind: 'video',
      path: 'pages/p2/anim.latest.mp4',
      from: 'p2-main', to: 'p3-main',     // start/end keyframes reference other image assets
      transition: 'Bob slowly extends his hand; Tarquin hesitates.',
    },
  },
})
```

Schema rules (Zod):

- `id`: string, matches the comic folder name.
- `style`: string — the comic-wide system prompt prepended to every prompt.
- `characters`: record keyed by a stable character id. Each has `name`, `description`, `sheet` (a `.latest` pointer), and optional `refs` (array of manual reference image pointers with optional descriptions).
- `assets`: record keyed by a stable asset id. Each has:
  - `kind`: `'image' | 'video'`.
  - `path`: a version-free `.latest` pointer relative to the comic's bucket folder. Written once; never edited.
  - For `image`: `characters` (array of character ids appearing in the panel), `scene` (the panel prompt).
  - For `video`: `from` and `to` (asset ids of the start/end image keyframes), `transition` (the motion prompt).
- Validation enforces: `from`/`to` reference existing image assets; `characters` reference existing characters; `path` extension matches `kind` (`.png` for image, `.mp4` for video).

### Bucket layout (`badcode-storage`, public-read)

Namespaced per comic:

```
comics/<comicId>/characters/<charId>/sheet.v1.png … sheet.vN.png, sheet.latest.png
comics/<comicId>/pages/<pageId>/<slot>.v1.png … <slot>.vN.png, <slot>.latest.png
comics/<comicId>/pages/<pageId>/anim.v1.mp4 … anim.vN.mp4, anim.latest.mp4
```

- Numbered versions: `Cache-Control: public, max-age=31536000, immutable`.
- `.latest` copies: `Cache-Control: no-cache` (revalidate) → swaps go live without a redeploy.
- Public URL: `https://storage.googleapis.com/badcode-storage/comics/<comicId>/<path>`.
- **Collision check:** storyteller may already have objects under `comics/` in this bucket. During planning, confirm there is no path collision; if there is, add a prefix (e.g. `badcode/comics/…`).

## The `badcode` CLI

Two write verbs (`prompt`, `push`) plus a read-only `status`. All commands load and validate `comic.meta.ts` first.

### `badcode prompt <comic> <assetId | --character <charId>> [--add "extra text"]`

Assembles the layered prompt and prints it, plus the reference URLs to download and attach. The `--add` text is **always appended** to the metadata base, never replacing it.

**Character sheet** — `badcode prompt camping --character bob`:

```
Art style: {style}

Character [Bob]: {bob.description}

Full-body character reference sheet, neutral pose, plain background, consistent design.
{--add text, if any}
```

References: the character's manual `refs` (if any). Result is pushed to `characters/bob/sheet…`.

**Page image** — `badcode prompt camping p2-main`:

```
Art style: {style}
Character [Bob]: {bob.description}
Character [Tarquin]: {tarquin.description}

Scene: {asset.scene}
{--add text, if any}

REFERENCE IMAGES (download + attach):
  [1] https://storage.googleapis.com/badcode-storage/comics/camping/characters/bob/sheet.latest.png
  [2] …/characters/tarquin/sheet.latest.png
```

**Video** — `badcode prompt camping p2-anim`:

```
Art style: {style}

Transition: {asset.transition}
{--add text, if any}

KEYFRAMES (download + attach):
  [start] …/pages/p2/main.latest.png   (from: p2-main)
  [end]   …/pages/p3/main.latest.png   (to:   p3-main)
```

Prompt assembly is shared logic: `style` first, then per-character `Character [Name]: description` lines for the characters involved, then the target-specific body (sheet guidance / `Scene:` / `Transition:`), then any `--add` text, then the reference/keyframe URL list.

### `badcode push <comic> <assetId> <file>`

The return leg. Steps:

1. Validate that `<assetId>` exists in `comic.meta.ts`; derive its bucket folder and base name from `path`.
2. List the bucket to find the highest existing `vN` for that asset.
3. Upload `<file>` as `v{N+1}` with immutable cache headers.
4. Copy it over `…latest.<ext>` with `Cache-Control: no-cache`.
5. Print the new version number and the live URL.

Never edits TypeScript (the `.latest` pointer in metadata already covers it).

### `badcode status <comic>`

Read-only. Lists each character and asset, how many versions exist in the bucket, and whether a `.latest` exists — i.e. what has been generated vs. still pending.

## Front-end integration

Display stays hand-written; only the image/video `src` values come from metadata. The comic component imports its own metadata and resolves asset ids to URLs:

```tsx
import meta from './comic.meta'
import { resolve } from '@badcode/comic-meta'

<ImageWidget src={resolve(meta, 'p2-main')} />   // was "/comics/camping/p2.svg"
```

This seam is what makes a bucket swap change the displayed image with no code change. Layout, scroll effects, transitions, and bubbles remain exactly as authored today.

**Worked example:** migrate the existing `camping` comic from its placeholder `public/comics/camping/*.svg` files to a `comic.meta.ts` + bucket-backed assets, proving the round-trip end to end.

## Future phases (researched, NOT built)

The manual flow needs a clear upgrade path. Captured here for a later session; none of this is in scope now, and image-model integration stays out of this repo's core.

- **Manual (this spec):** human runs `badcode prompt`, pastes into Gemini, attaches refs, downloads the result, runs `badcode push`.
- **WSL ↔ Chrome bridge:** drive a logged-in Gemini tab over the Chrome DevTools Protocol from WSL — paste the prompt, upload references, pull the result. Highest payoff, highest fragility (UI selectors, session/auth drift).
- **Claude Desktop on Windows + browser tool:** orchestrate the Gemini tab from the Windows side while the repo stays in WSL; bytes move via a shared folder or the bucket.

A later spec will weigh these and pick one. The metadata model and CLI are designed so an automated runner can call the same prompt-assembly and push logic the human uses.

## Open items to resolve in planning

- Confirm no path collision with existing storyteller objects under `comics/` in `badcode-storage` (prefix if needed).
- Pick the CLI argument parser (`commander` vs alternative) and the `tsx` run setup / `badcode` bin wiring in the workspace.
- Decide where `comic.meta.ts` is imported from by the CLI (path convention `apps/web/src/comics/<id>/comic.meta.ts`).
- Confirm the public-read / CORS posture of `badcode-storage` is adequate for serving images and video to the site.
