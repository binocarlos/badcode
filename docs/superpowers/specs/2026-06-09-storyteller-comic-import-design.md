# Storyteller Comic Import

## Context

BadCode comics are authored code-first using `@badcode/comic` (React components with scroll-linked effects). The creative content — stories, characters, images — currently lives in the Storyteller app at badcode.tv, a WYSIWYG platform with AI image generation, video animation, and a comic editor.

We're moving away from the WYSIWYG as the delivery format. Storyteller stays useful as a quick prototyping tool, but the published comics should be hand-tuned code. This spec describes two CLI commands that bridge the gap: pull a comic's data and assets from Storyteller, then generate a badcode comic scaffold from that data.

No AI generation happens locally. Images and videos are created in external tools or in Storyteller itself; this pipeline only extracts and converts.

## Design

### Two commands in `@badcode/cli`

#### `npx badcode pull <url> [--slug <name>]`

Fetches a comic from the Storyteller API and saves its data + assets locally.

**Steps:**

1. Read `STORYTELLER_USERNAME` and `STORYTELLER_PASSWORD` from `.env` (dotenv-style, already gitignored)
2. POST `https://badcode.tv/api/v1/user/login` with `{ email, password }` → JWT token
3. Extract comic ID from the URL (the UUID path segment)
4. GET `https://badcode.tv/api/v1/comics/:id` with `Authorization: Bearer <token>` → full comic JSON
5. Derive slug from `config.name` (kebab-case) or use `--slug` override
6. For each page, download image assets:
   - Each image slot (`page.images[slotName].media.path`) → `public/comics/<slug>/p<N>-<slot>.jpg`
   - Animation frames (`page.animation.frames[].media.path`) → `public/comics/<slug>/p<N>-animation/frame-NNN.jpg`
7. Write the raw comic config to `apps/web/src/comics/<slug>/comic.json`
8. Print summary: pages downloaded, assets count, slug

**Output structure:**

```
public/comics/<slug>/
  p1-main.jpg
  p2-main.jpg
  p2-animation/
    frame-000.jpg
    frame-001.jpg
    ...

apps/web/src/comics/<slug>/
  comic.json          # raw storyteller config for reference / re-generation
```

#### `npx badcode generate <slug>`

Reads the pulled `comic.json` and generates a badcode comic component scaffold.

**Steps:**

1. Read `apps/web/src/comics/<slug>/comic.json`
2. For each page, map to `<Page>` component:
   - If animation frames exist → `<AnimationWidget frames={[...framePaths]} />`
   - Otherwise → `<ImageWidget src="..." />`
3. Map text bubbles:
   - `type: "speech"` → `<SpeechBubble>`
   - `type: "thought"` → `<SpeechBubble type="thought">`
   - `type: "narration"` → `<NarrationBox>`
   - Position: `x, y` (both use 0-100 percentage — direct mapping)
   - Timing: `start_percent, end_percent` → `appearAt={[start, end]}`
   - Renderer: `renderer` → `renderer` (clean/rough — direct match)
   - Tail direction: map storyteller's detailed directions (e.g. "bottom-left-left") to badcode's simplified set ("bottom-left")
   - Style props: `font_family`, `font_size`, `text_color`, `background_color` → corresponding props
4. Apply sensible default effects with TODO comments:
   - Page 1: `zoom({ amount: 1.3 })`
   - Other pages: no effect (TODO: pick one)
   - All transitions: `crossfade()` (TODO: customize)
   - Scroll duration: `1.4` viewport-heights per page
5. Generate `comic.meta.ts`:
   - Character array with names and descriptions
   - Asset map pointing to `public/comics/<slug>/` paths
6. Generate `<Slug>Comic.tsx`:
   - Imports from `@badcode/comic`, `@badcode/comic/effects`, `@badcode/comic/transitions`, `@badcode/comic/text`
   - Full `<ScrollComic>` with all pages, bubbles, and default effects
   - TODO comments at each creative decision point

**Generated code is a starting point.** Effects, scroll durations, side-panel text, and layout choices are meant to be hand-tuned after generation.

### Property mapping reference

| Storyteller | BadCode | Notes |
|---|---|---|
| `page.images[slot].media.path` | `<ImageWidget src=...>` | Downloaded to public/ |
| `page.animation.frames[]` | `<AnimationWidget frames=...>` | Frame URLs in order |
| `textBubble.type` | `SpeechBubble type=` | Direct: speech/thought/narration |
| `textBubble.x, y` | `SpeechBubble x, y` | Both 0-100 percentage |
| `textBubble.start_percent` | `appearAt[0]` | Both 0-1 |
| `textBubble.end_percent` | `appearAt[1]` | Both 0-1 |
| `textBubble.renderer` | `renderer` | clean/rough direct match |
| `textBubble.direction` | `tail` | Simplify detailed → basic |
| `textBubble.transition: "fade"` | `fade={true}` | Direct |
| `textBubble.font_family` | `fontFamily` (style) | Pass through |
| `textBubble.text_color` | `textColor` | Direct |
| `textBubble.background_color` | `background` | Direct |
| `config.characters[]` | `comic.meta.ts` | Name + description |
| `page.config` | TODO comments | Layout decisions made in code |

### Tail direction mapping

| Storyteller direction | BadCode tail |
|---|---|
| `top-center` | `top` |
| `top-left`, `top-left-left` | `top-left` |
| `top-right`, `top-right-right` | `top-right` |
| `bottom-center` | `bottom` |
| `bottom-left`, `bottom-left-left` | `bottom-left` |
| `bottom-right`, `bottom-right-right` | `bottom-right` |
| (none / empty) | `none` |

### Video-to-frames workflow

For videos generated in Storyteller or external tools, split to frames with ffmpeg:

```bash
ffmpeg -i input.mp4 -vf "fps=24" public/comics/<slug>/p<N>-animation/frame-%03d.jpg
```

Adjust `fps=24` to control frame density (fewer frames = faster scroll-through, less disk).

### What this does NOT include

- **No AI image/video generation** — done manually in external tools
- **No automatic effect selection** — defaults with TODOs
- **No storyteller write-back** — one-way pull only
- **No automatic routing** — manually add comic route to `apps/web` after generation
- **No video playback** — videos are split to frames and played via AnimationWidget scroll

### Files to modify / create

| File | Action |
|---|---|
| `packages/cli/src/bin.ts` | Add `pull` and `generate` commands |
| `packages/cli/src/pull.ts` | New: login, fetch comic, download assets |
| `packages/cli/src/generate.ts` | New: read comic.json, emit TSX + meta |
| `packages/cli/src/storyteller-auth.ts` | New: login helper (POST /user/login → JWT) |
| `packages/cli/src/storyteller-types.ts` | New: TypeScript types for storyteller comic config |
| `packages/cli/src/tail-map.ts` | New: direction → tail mapping |
| `scripts/video-to-frames.md` | New: ffmpeg documentation |

### Verification

1. Run `npx badcode pull <comic-url>` with the test comic URL
2. Confirm `comic.json` is written and assets are downloaded to `public/comics/<slug>/`
3. Run `npx badcode generate <slug>`
4. Confirm TSX + meta files are generated in `src/comics/<slug>/`
5. Import the generated comic component into a test route
6. Run `npm run dev` and verify the comic renders with images and bubbles
7. Run `npm run typecheck` to confirm generated code compiles
