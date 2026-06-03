# Comic Asset Tooling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CLI-driven, manual-first toolchain that prepares Gemini prompts and manages comic image/video assets in a GCS bucket, with all generation metadata defined statically in typed code.

**Architecture:** Two new npm workspace packages. `@badcode/comic-meta` (isomorphic) holds a Zod-validated metadata schema, `defineComic()`, and URL resolvers — imported by both the web app and the CLI. `@badcode/cli` (Node-only) is the `badcode` bin with `prompt` / `push` / `status` commands; all bucket I/O is behind a `Bucket` interface so command logic is unit-tested against a fake, never live GCS. The web app's comic components keep their hand-written layout and only source image/video URLs through the resolver. Assets use `.latest` stable pointers: metadata is written once, all version churn lives in the bucket.

**Tech Stack:** TypeScript (ES2022, ESM, `verbatimModuleSyntax`), npm workspaces, Zod, Commander, Vitest, `tsx`, `gsutil`/`gcloud` (already installed and authenticated), React 18 + Vite (existing web app), bucket `badcode-storage`.

**Spec:** `docs/superpowers/specs/2026-06-02-comic-asset-tooling-design.md`

**Branch:** `comic-asset-tooling` (already checked out).

---

## Conventions in this repo (read before starting)

- Packages are `private`, `"type": "module"`, version `0.0.0`, and point `main`/`module`/`types` directly at `./src/index.ts`. **There is no build step** — packages are consumed as raw TS via Vite (web) and `tsx` (CLI).
- `tsconfig.base.json` sets `strict`, `noUnusedLocals`, `noUnusedParameters`, `moduleResolution: "bundler"`, and **`verbatimModuleSyntax: true`** — so type-only imports MUST use `import type { ... }`.
- `typecheck` script per package is `tsc --noEmit`. Run all: `npm run typecheck` from repo root.
- Commit after every task. Run commands from the repo root unless stated otherwise.
- Tests are colocated as `*.test.ts` next to the source.

## File structure (what gets created)

```
packages/comic-meta/
  package.json                 # @badcode/comic-meta — zod dep, vitest devdep
  tsconfig.json
  src/index.ts                 # re-exports the public API
  src/schema.ts                # Zod schema, defineComic input types, BUCKET const
  src/defineComic.ts           # defineComic() — validates + returns typed Comic
  src/resolve.ts               # comicUrl(), resolve(), sheetUrl(), BUCKET_BASE_URL
  src/schema.test.ts
  src/resolve.test.ts

packages/cli/
  package.json                 # @badcode/cli — commander dep, @badcode/comic-meta dep, tsx+vitest devdeps
  tsconfig.json
  src/bin.ts                   # #! shebang + Commander wiring (thin)
  src/bucket-path.ts           # pure path/version helpers
  src/target.ts                # CLI target -> metadata path resolution
  src/prompt.ts                # buildPrompt() — structured prompt + references
  src/loadComic.ts             # dynamic import + re-validate a comic.meta.ts
  src/bucket.ts                # Bucket interface + GsutilBucket impl + cache consts
  src/push.ts                  # push() command logic (uses Bucket)
  src/status.ts                # status() command logic (uses Bucket)
  src/__fixtures__/demo/comic.meta.ts   # fixture comic for loadComic test
  src/bucket-path.test.ts
  src/prompt.test.ts
  src/push.test.ts
  src/status.test.ts
  src/bucket.test.ts
  src/loadComic.test.ts

apps/web/src/comics/camping/
  comic.meta.ts                # NEW — camping generation metadata
  CampingComic.tsx             # MODIFIED — resolve() instead of hard-coded /comics/... paths
```

---

## Task 1: Scaffold `@badcode/comic-meta` package

**Files:**
- Create: `packages/comic-meta/package.json`
- Create: `packages/comic-meta/tsconfig.json`
- Create: `packages/comic-meta/src/index.ts`

- [ ] **Step 1: Create `packages/comic-meta/package.json`**

```json
{
  "name": "@badcode/comic-meta",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "description": "Typed, Zod-validated generation metadata + URL resolvers for BadCode comics.",
  "main": "./src/index.ts",
  "module": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `packages/comic-meta/tsconfig.json`**

(No `types` override — this package uses no Node APIs, so it must not require `@types/node`.)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create a placeholder `packages/comic-meta/src/index.ts`**

```ts
export {}
```

- [ ] **Step 4: Install dependencies from repo root**

Run: `npm install`
Expected: completes without error; `zod` and `vitest` resolved into the workspace.

- [ ] **Step 5: Verify the test runner works (no tests yet)**

Run: `npm run test --workspace @badcode/comic-meta`
Expected: Vitest reports "No test files found" (exit code may be non-zero; that is fine for now — the next task adds tests).

- [ ] **Step 6: Commit**

```bash
git add packages/comic-meta/package.json packages/comic-meta/tsconfig.json packages/comic-meta/src/index.ts package.json package-lock.json
git commit -m "feat(comic-meta): scaffold package"
```

---

## Task 2: Metadata schema + `defineComic`

**Files:**
- Create: `packages/comic-meta/src/schema.ts`
- Create: `packages/comic-meta/src/defineComic.ts`
- Test: `packages/comic-meta/src/schema.test.ts`
- Modify: `packages/comic-meta/src/index.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/comic-meta/src/schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { defineComic } from './defineComic'

const valid = {
  id: 'demo',
  style: 'Gritty ink, muted palette.',
  characters: {
    bob: { name: 'Bob', description: 'Weathered man, 50s.', sheet: 'characters/bob/sheet.latest.png' },
  },
  assets: {
    'p1-main': { kind: 'image', path: 'pages/p1/main.latest.png', characters: ['bob'], scene: 'Bob stands in the rain.' },
    'p1-anim': { kind: 'video', path: 'pages/p1/anim.latest.mp4', from: 'p1-main', to: 'p1-main', transition: 'Bob raises his head.' },
  },
} as const

describe('defineComic', () => {
  it('accepts a valid comic and returns it', () => {
    const comic = defineComic(structuredClone(valid))
    expect(comic.id).toBe('demo')
    expect(comic.assets['p1-main'].kind).toBe('image')
  })

  it('rejects an image asset whose path is not a .latest image pointer', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-main'] as any).path = 'pages/p1/main.png'
    expect(() => defineComic(bad)).toThrow()
  })

  it('rejects a video asset with a non-video extension', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-anim'] as any).path = 'pages/p1/anim.latest.png'
    expect(() => defineComic(bad)).toThrow()
  })

  it('rejects an image asset referencing an unknown character', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-main'] as any).characters = ['nobody']
    expect(() => defineComic(bad)).toThrow(/unknown character/)
  })

  it('rejects a video referencing an unknown keyframe asset', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-anim'] as any).to = 'ghost'
    expect(() => defineComic(bad)).toThrow(/unknown asset/)
  })

  it('rejects a video whose keyframe points at another video', () => {
    const bad = structuredClone(valid)
    ;(bad.assets as any)['p1-anim2'] = { kind: 'video', path: 'pages/p1/anim2.latest.mp4', from: 'p1-anim', to: 'p1-main', transition: 'x' }
    expect(() => defineComic(bad)).toThrow(/must be an image/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/comic-meta`
Expected: FAIL — cannot resolve `./defineComic`.

- [ ] **Step 3: Implement `packages/comic-meta/src/schema.ts`**

```ts
import { z } from 'zod'

/** GCS bucket that stores all comic assets. */
export const BUCKET = 'badcode-storage'

const IMAGE_POINTER = /\.latest\.(png|jpe?g|webp|svg)$/
const VIDEO_POINTER = /\.latest\.(mp4|webm)$/

const referenceImageSchema = z.object({
  path: z.string(),
  description: z.string().optional(),
})

const characterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  sheet: z.string().regex(IMAGE_POINTER, 'sheet must be a ".latest.<image ext>" pointer'),
  refs: z.array(referenceImageSchema).optional(),
})

const imageAssetSchema = z.object({
  kind: z.literal('image'),
  path: z.string().regex(IMAGE_POINTER, 'image path must be a ".latest.<image ext>" pointer'),
  characters: z.array(z.string()),
  scene: z.string().min(1),
})

const videoAssetSchema = z.object({
  kind: z.literal('video'),
  path: z.string().regex(VIDEO_POINTER, 'video path must be a ".latest.<video ext>" pointer'),
  from: z.string(),
  to: z.string(),
  transition: z.string().min(1),
})

const assetSchema = z.discriminatedUnion('kind', [imageAssetSchema, videoAssetSchema])

export const comicSchema = z
  .object({
    id: z.string().min(1),
    style: z.string().min(1),
    characters: z.record(z.string(), characterSchema),
    assets: z.record(z.string(), assetSchema),
  })
  .superRefine((comic, ctx) => {
    for (const [assetId, asset] of Object.entries(comic.assets)) {
      if (asset.kind === 'image') {
        for (const charId of asset.characters) {
          if (!comic.characters[charId]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `asset "${assetId}" references unknown character "${charId}"`,
              path: ['assets', assetId, 'characters'],
            })
          }
        }
      } else {
        for (const ref of [asset.from, asset.to]) {
          const target = comic.assets[ref]
          if (!target) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `video "${assetId}" references unknown asset "${ref}"`,
              path: ['assets', assetId],
            })
          } else if (target.kind !== 'image') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `video "${assetId}" keyframe "${ref}" must be an image asset`,
              path: ['assets', assetId],
            })
          }
        }
      }
    }
  })

export type Comic = z.infer<typeof comicSchema>
export type Character = z.infer<typeof characterSchema>
export type Asset = z.infer<typeof assetSchema>
export type ImageAsset = z.infer<typeof imageAssetSchema>
export type VideoAsset = z.infer<typeof videoAssetSchema>
```

- [ ] **Step 4: Implement `packages/comic-meta/src/defineComic.ts`**

```ts
import { comicSchema, type Comic } from './schema'

/**
 * Validate a comic's generation metadata and return it typed. Authors call this
 * in their `comic.meta.ts`; the CLI re-validates on load.
 */
export function defineComic(input: Comic): Comic {
  return comicSchema.parse(input)
}
```

- [ ] **Step 5: Update `packages/comic-meta/src/index.ts`**

```ts
export { defineComic } from './defineComic'
export { comicSchema, BUCKET } from './schema'
export type { Comic, Character, Asset, ImageAsset, VideoAsset } from './schema'
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/comic-meta`
Expected: PASS — all 6 tests green.

- [ ] **Step 7: Typecheck**

Run: `npm run typecheck --workspace @badcode/comic-meta`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add packages/comic-meta/src
git commit -m "feat(comic-meta): Zod schema + defineComic with referential validation"
```

---

## Task 3: URL resolvers

**Files:**
- Create: `packages/comic-meta/src/resolve.ts`
- Test: `packages/comic-meta/src/resolve.test.ts`
- Modify: `packages/comic-meta/src/index.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/comic-meta/src/resolve.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { defineComic } from './defineComic'
import { comicUrl, resolve, sheetUrl, BUCKET_BASE_URL } from './resolve'

const comic = defineComic({
  id: 'demo',
  style: 'ink',
  characters: { bob: { name: 'Bob', description: 'man', sheet: 'characters/bob/sheet.latest.png' } },
  assets: { 'p1-main': { kind: 'image', path: 'pages/p1/main.latest.png', characters: ['bob'], scene: 'rain' } },
})

describe('resolvers', () => {
  it('exposes the public bucket base url', () => {
    expect(BUCKET_BASE_URL).toBe('https://storage.googleapis.com/badcode-storage')
  })

  it('builds a comic-scoped url from a path', () => {
    expect(comicUrl('demo', 'pages/p1/main.latest.png')).toBe(
      'https://storage.googleapis.com/badcode-storage/comics/demo/pages/p1/main.latest.png',
    )
  })

  it('resolves an asset id to its url', () => {
    expect(resolve(comic, 'p1-main')).toBe(
      'https://storage.googleapis.com/badcode-storage/comics/demo/pages/p1/main.latest.png',
    )
  })

  it('resolves a character sheet url', () => {
    expect(sheetUrl(comic, 'bob')).toBe(
      'https://storage.googleapis.com/badcode-storage/comics/demo/characters/bob/sheet.latest.png',
    )
  })

  it('throws on an unknown asset id', () => {
    expect(() => resolve(comic, 'nope')).toThrow(/unknown asset/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/comic-meta`
Expected: FAIL — cannot resolve `./resolve`.

- [ ] **Step 3: Implement `packages/comic-meta/src/resolve.ts`**

```ts
import { BUCKET, type Comic } from './schema'

/** Public base URL for all assets in the bucket. */
export const BUCKET_BASE_URL = `https://storage.googleapis.com/${BUCKET}`

/** Build the public URL for a comic-relative asset path. */
export function comicUrl(comicId: string, path: string): string {
  return `${BUCKET_BASE_URL}/comics/${comicId}/${path}`
}

/** Resolve an asset id (image or video) to its public `.latest` URL. */
export function resolve(comic: Comic, assetId: string): string {
  const asset = comic.assets[assetId]
  if (!asset) throw new Error(`unknown asset "${assetId}" in comic "${comic.id}"`)
  return comicUrl(comic.id, asset.path)
}

/** Resolve a character's sheet to its public `.latest` URL. */
export function sheetUrl(comic: Comic, charId: string): string {
  const character = comic.characters[charId]
  if (!character) throw new Error(`unknown character "${charId}" in comic "${comic.id}"`)
  return comicUrl(comic.id, character.sheet)
}
```

- [ ] **Step 4: Update `packages/comic-meta/src/index.ts`**

```ts
export { defineComic } from './defineComic'
export { comicSchema, BUCKET } from './schema'
export { comicUrl, resolve, sheetUrl, BUCKET_BASE_URL } from './resolve'
export type { Comic, Character, Asset, ImageAsset, VideoAsset } from './schema'
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/comic-meta`
Expected: PASS — all resolver + schema tests green.

- [ ] **Step 6: Commit**

```bash
git add packages/comic-meta/src
git commit -m "feat(comic-meta): URL resolvers (comicUrl/resolve/sheetUrl)"
```

---

## Task 4: Scaffold `@badcode/cli` package

**Files:**
- Create: `packages/cli/package.json`
- Create: `packages/cli/tsconfig.json`
- Create: `packages/cli/src/bin.ts`

- [ ] **Step 1: Create `packages/cli/package.json`**

```json
{
  "name": "@badcode/cli",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "description": "badcode — CLI for preparing Gemini prompts and managing comic assets in GCS.",
  "bin": {
    "badcode": "./src/bin.ts"
  },
  "scripts": {
    "badcode": "tsx src/bin.ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@badcode/comic-meta": "*",
    "commander": "^12.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `packages/cli/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create a placeholder `packages/cli/src/bin.ts`**

```ts
#!/usr/bin/env -S npx tsx
// Commander wiring is added in Task 11.
console.log('badcode cli')
```

- [ ] **Step 4: Install dependencies from repo root**

Run: `npm install`
Expected: completes without error; `commander`, `tsx`, `@types/node` resolved.

- [ ] **Step 5: Smoke-test the bin runs under tsx**

Run: `npx tsx packages/cli/src/bin.ts`
Expected: prints `badcode cli`.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/package.json packages/cli/tsconfig.json packages/cli/src/bin.ts package.json package-lock.json
git commit -m "feat(cli): scaffold @badcode/cli package"
```

---

## Task 5: Pure path + version helpers

**Files:**
- Create: `packages/cli/src/bucket-path.ts`
- Test: `packages/cli/src/bucket-path.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/bucket-path.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { splitLatestPath, versionedPath, latestPath, nextVersion, parseVersion } from './bucket-path'

describe('bucket-path', () => {
  it('splits a .latest pointer into dir/base/ext', () => {
    expect(splitLatestPath('pages/p2/main.latest.png')).toEqual({ dir: 'pages/p2', base: 'main', ext: 'png' })
  })

  it('splits a pointer with no directory', () => {
    expect(splitLatestPath('cover.latest.webp')).toEqual({ dir: '', base: 'cover', ext: 'webp' })
  })

  it('throws on a non-.latest path', () => {
    expect(() => splitLatestPath('pages/p2/main.v3.png')).toThrow(/not a \.latest pointer/)
  })

  it('builds versioned and latest relative paths', () => {
    const parts = splitLatestPath('pages/p2/main.latest.png')
    expect(versionedPath(parts, 4)).toBe('pages/p2/main.v4.png')
    expect(latestPath(parts)).toBe('pages/p2/main.latest.png')
  })

  it('computes the next version', () => {
    expect(nextVersion([])).toBe(1)
    expect(nextVersion([1, 2, 3])).toBe(4)
    expect(nextVersion([2, 5, 1])).toBe(6)
  })

  it('parses a version number from a filename, or null', () => {
    expect(parseVersion('main.v7.png')).toBe(7)
    expect(parseVersion('main.latest.png')).toBeNull()
    expect(parseVersion('main.png')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/cli`
Expected: FAIL — cannot resolve `./bucket-path`.

- [ ] **Step 3: Implement `packages/cli/src/bucket-path.ts`**

```ts
export interface LatestParts {
  /** Directory portion relative to the comic root, no trailing slash (may be ''). */
  dir: string
  /** Base filename without the `.latest`/`.vN` suffix or extension. */
  base: string
  /** File extension without the dot. */
  ext: string
}

/** Decompose a `.latest` pointer like `pages/p2/main.latest.png`. */
export function splitLatestPath(path: string): LatestParts {
  const match = path.match(/^(.*)\.latest\.([^.]+)$/)
  if (!match) throw new Error(`path is not a .latest pointer: ${path}`)
  const full = match[1]
  const ext = match[2]
  const slash = full.lastIndexOf('/')
  return {
    dir: slash >= 0 ? full.slice(0, slash) : '',
    base: slash >= 0 ? full.slice(slash + 1) : full,
    ext,
  }
}

function prefix(parts: LatestParts): string {
  return parts.dir ? `${parts.dir}/` : ''
}

/** Comic-relative path for a numbered version, e.g. `pages/p2/main.v4.png`. */
export function versionedPath(parts: LatestParts, n: number): string {
  return `${prefix(parts)}${parts.base}.v${n}.${parts.ext}`
}

/** Comic-relative path for the `.latest` pointer. */
export function latestPath(parts: LatestParts): string {
  return `${prefix(parts)}${parts.base}.latest.${parts.ext}`
}

/** Next version number given the existing ones (1-based). */
export function nextVersion(existing: number[]): number {
  return (existing.length ? Math.max(...existing) : 0) + 1
}

/** Extract the version number from a filename like `main.v7.png`, or null. */
export function parseVersion(filename: string): number | null {
  const match = filename.match(/\.v(\d+)\.[^.]+$/)
  return match ? Number(match[1]) : null
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS — 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/bucket-path.ts packages/cli/src/bucket-path.test.ts
git commit -m "feat(cli): pure path + version helpers"
```

---

## Task 6: Prompt assembly

**Files:**
- Create: `packages/cli/src/target.ts`
- Create: `packages/cli/src/prompt.ts`
- Test: `packages/cli/src/prompt.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/prompt.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { defineComic } from '@badcode/comic-meta'
import { buildPrompt } from './prompt'

const comic = defineComic({
  id: 'demo',
  style: 'Gritty ink, muted palette.',
  characters: {
    bob: { name: 'Bob', description: 'Weathered man, 50s.', sheet: 'characters/bob/sheet.latest.png', refs: [{ path: 'characters/bob/ref1.latest.png' }] },
    tarquin: { name: 'Tarquin', description: 'Smug suit, 30s.', sheet: 'characters/tarquin/sheet.latest.png' },
  },
  assets: {
    'p2-main': { kind: 'image', path: 'pages/p2/main.latest.png', characters: ['bob', 'tarquin'], scene: 'Bob offers a coin.' },
    'p3-main': { kind: 'image', path: 'pages/p3/main.latest.png', characters: ['bob'], scene: 'Bob alone.' },
    'p2-anim': { kind: 'video', path: 'pages/p2/anim.latest.mp4', from: 'p2-main', to: 'p3-main', transition: 'Bob extends his hand.' },
  },
})

const base = 'https://storage.googleapis.com/badcode-storage/comics/demo'

describe('buildPrompt: character sheet', () => {
  const r = buildPrompt(comic, { kind: 'character', id: 'bob' })
  it('leads with style, character line, and sheet guidance', () => {
    expect(r.prompt).toBe(
      [
        'Art style: Gritty ink, muted palette.',
        '',
        'Character [Bob]: Weathered man, 50s.',
        '',
        'Full-body character reference sheet, neutral pose, plain background, consistent design.',
      ].join('\n'),
    )
  })
  it('lists the character refs as references', () => {
    expect(r.references).toEqual([{ label: '[1]', url: `${base}/characters/bob/ref1.latest.png` }])
  })
})

describe('buildPrompt: page image', () => {
  const r = buildPrompt(comic, { kind: 'asset', id: 'p2-main' })
  it('includes style, both character lines, and the scene', () => {
    expect(r.prompt).toBe(
      [
        'Art style: Gritty ink, muted palette.',
        'Character [Bob]: Weathered man, 50s.',
        'Character [Tarquin]: Smug suit, 30s.',
        '',
        'Scene: Bob offers a coin.',
      ].join('\n'),
    )
  })
  it('references each character sheet, numbered', () => {
    expect(r.references).toEqual([
      { label: '[1]', url: `${base}/characters/bob/sheet.latest.png` },
      { label: '[2]', url: `${base}/characters/tarquin/sheet.latest.png` },
    ])
    expect(r.refHeading).toBe('REFERENCE IMAGES (download + attach):')
  })
})

describe('buildPrompt: video', () => {
  const r = buildPrompt(comic, { kind: 'asset', id: 'p2-anim' })
  it('includes style and the transition', () => {
    expect(r.prompt).toBe(['Art style: Gritty ink, muted palette.', '', 'Transition: Bob extends his hand.'].join('\n'))
  })
  it('references the start and end keyframes', () => {
    expect(r.references).toEqual([
      { label: '[start]', url: `${base}/pages/p2/main.latest.png` },
      { label: '[end]', url: `${base}/pages/p3/main.latest.png` },
    ])
    expect(r.refHeading).toBe('KEYFRAMES (download + attach):')
  })
})

describe('buildPrompt: --add text', () => {
  it('appends additive text after the metadata base', () => {
    const r = buildPrompt(comic, { kind: 'asset', id: 'p2-main' }, 'Make it golden hour.')
    expect(r.prompt.endsWith('Scene: Bob offers a coin.\nMake it golden hour.')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/cli`
Expected: FAIL — cannot resolve `./prompt`.

- [ ] **Step 3: Implement `packages/cli/src/target.ts`**

```ts
import type { Comic } from '@badcode/comic-meta'

/** A CLI generation target: a character sheet or a named asset. */
export type Target = { kind: 'character'; id: string } | { kind: 'asset'; id: string }

/** Resolve a target to its comic-relative `.latest` path. */
export function targetPath(comic: Comic, target: Target): string {
  if (target.kind === 'character') {
    const character = comic.characters[target.id]
    if (!character) throw new Error(`unknown character "${target.id}" in comic "${comic.id}"`)
    return character.sheet
  }
  const asset = comic.assets[target.id]
  if (!asset) throw new Error(`unknown asset "${target.id}" in comic "${comic.id}"`)
  return asset.path
}
```

- [ ] **Step 4: Implement `packages/cli/src/prompt.ts`**

```ts
import { comicUrl, type Comic } from '@badcode/comic-meta'
import type { Target } from './target'

export interface Reference {
  label: string
  url: string
}

export interface PromptResult {
  /** The text to paste into Gemini. */
  prompt: string
  /** Reference images/keyframes to download and attach. */
  references: Reference[]
  /** Heading printed above the references. */
  refHeading: string
}

const REF_HEADING = 'REFERENCE IMAGES (download + attach):'
const KEYFRAME_HEADING = 'KEYFRAMES (download + attach):'

/** Assemble the layered Gemini prompt for a target. `add` is appended verbatim. */
export function buildPrompt(comic: Comic, target: Target, add?: string): PromptResult {
  if (target.kind === 'character') return characterPrompt(comic, target.id, add)

  const asset = comic.assets[target.id]
  if (!asset) throw new Error(`unknown asset "${target.id}" in comic "${comic.id}"`)
  return asset.kind === 'image'
    ? imagePrompt(comic, target.id, add)
    : videoPrompt(comic, target.id, add)
}

function characterPrompt(comic: Comic, id: string, add?: string): PromptResult {
  const character = comic.characters[id]
  if (!character) throw new Error(`unknown character "${id}" in comic "${comic.id}"`)
  const lines = [
    `Art style: ${comic.style}`,
    '',
    `Character [${character.name}]: ${character.description}`,
    '',
    'Full-body character reference sheet, neutral pose, plain background, consistent design.',
  ]
  if (add) lines.push(add)
  const references = (character.refs ?? []).map((ref, i) => ({
    label: `[${i + 1}]`,
    url: comicUrl(comic.id, ref.path),
  }))
  return { prompt: lines.join('\n'), references, refHeading: REF_HEADING }
}

function imagePrompt(comic: Comic, id: string, add?: string): PromptResult {
  const asset = comic.assets[id]
  if (!asset || asset.kind !== 'image') throw new Error(`asset "${id}" is not an image`)
  const lines = [`Art style: ${comic.style}`]
  for (const charId of asset.characters) {
    const character = comic.characters[charId]
    if (!character) throw new Error(`asset "${id}" references unknown character "${charId}"`)
    lines.push(`Character [${character.name}]: ${character.description}`)
  }
  lines.push('', `Scene: ${asset.scene}`)
  if (add) lines.push(add)
  const references = asset.characters.map((charId, i) => ({
    label: `[${i + 1}]`,
    url: comicUrl(comic.id, comic.characters[charId].sheet),
  }))
  return { prompt: lines.join('\n'), references, refHeading: REF_HEADING }
}

function videoPrompt(comic: Comic, id: string, add?: string): PromptResult {
  const asset = comic.assets[id]
  if (!asset || asset.kind !== 'video') throw new Error(`asset "${id}" is not a video`)
  const lines = [`Art style: ${comic.style}`, '', `Transition: ${asset.transition}`]
  if (add) lines.push(add)
  const start = comic.assets[asset.from]
  const end = comic.assets[asset.to]
  const references = [
    { label: '[start]', url: comicUrl(comic.id, start.path) },
    { label: '[end]', url: comicUrl(comic.id, end.path) },
  ]
  return { prompt: lines.join('\n'), references, refHeading: KEYFRAME_HEADING }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS — all prompt tests green.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/target.ts packages/cli/src/prompt.ts packages/cli/src/prompt.test.ts
git commit -m "feat(cli): layered prompt assembly for sheet/image/video targets"
```

---

## Task 7: Load + re-validate a `comic.meta.ts`

**Files:**
- Create: `packages/cli/src/loadComic.ts`
- Create: `packages/cli/src/__fixtures__/demo/comic.meta.ts`
- Test: `packages/cli/src/loadComic.test.ts`

- [ ] **Step 1: Create the fixture `packages/cli/src/__fixtures__/demo/comic.meta.ts`**

```ts
import { defineComic } from '@badcode/comic-meta'

export default defineComic({
  id: 'demo',
  style: 'Gritty ink.',
  characters: {
    bob: { name: 'Bob', description: 'Weathered man.', sheet: 'characters/bob/sheet.latest.png' },
  },
  assets: {
    'p1-main': { kind: 'image', path: 'pages/p1/main.latest.png', characters: ['bob'], scene: 'rain' },
  },
})
```

- [ ] **Step 2: Write the failing test**

Create `packages/cli/src/loadComic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadComic } from './loadComic'

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__')

describe('loadComic', () => {
  it('imports and validates a comic.meta.ts from a base directory', async () => {
    const comic = await loadComic('demo', fixturesDir)
    expect(comic.id).toBe('demo')
    expect(comic.characters.bob.name).toBe('Bob')
  })

  it('throws a clear error when the comic does not exist', async () => {
    await expect(loadComic('ghost', fixturesDir)).rejects.toThrow(/ghost/)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/cli`
Expected: FAIL — cannot resolve `./loadComic`.

- [ ] **Step 4: Implement `packages/cli/src/loadComic.ts`**

```ts
import { resolve as resolvePath } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineComic, type Comic } from '@badcode/comic-meta'

/** Default location of comic metadata, relative to the repo root. */
export const COMICS_DIR = 'apps/web/src/comics'

/**
 * Dynamically import a comic's `comic.meta.ts` and re-validate it. `baseDir`
 * defaults to the web app's comics directory (resolved against the cwd).
 */
export async function loadComic(comicId: string, baseDir: string = resolvePath(process.cwd(), COMICS_DIR)): Promise<Comic> {
  const file = resolvePath(baseDir, comicId, 'comic.meta.ts')
  let mod: { default: unknown }
  try {
    mod = await import(pathToFileURL(file).href)
  } catch (cause) {
    throw new Error(`could not load comic "${comicId}" from ${file}`, { cause })
  }
  return defineComic(mod.default as Comic)
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS — both loadComic tests green.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/loadComic.ts packages/cli/src/loadComic.test.ts "packages/cli/src/__fixtures__/demo/comic.meta.ts"
git commit -m "feat(cli): loadComic — dynamic import + re-validate comic.meta.ts"
```

---

## Task 8: Bucket interface + GsutilBucket

**Files:**
- Create: `packages/cli/src/bucket.ts`
- Test: `packages/cli/src/bucket.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/bucket.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { GsutilBucket, IMMUTABLE_CC, LATEST_CC, GS_BUCKET } from './bucket'

describe('GsutilBucket', () => {
  it('lists object basenames and ignores the no-match error', async () => {
    let calledWith: string[] = []
    const run = async (args: string[]) => {
      calledWith = args
      return [
        `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v1.png`,
        `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v2.png`,
        '',
      ].join('\n')
    }
    const bucket = new GsutilBucket(run)
    const names = await bucket.list('comics/demo/pages/p1/main.v*.png')
    expect(names).toEqual(['main.v1.png', 'main.v2.png'])
    expect(calledWith).toEqual(['ls', `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v*.png`])
  })

  it('returns [] when gsutil errors (no matching objects)', async () => {
    const run = async () => {
      throw new Error('CommandException: One or more URLs matched no objects.')
    }
    const bucket = new GsutilBucket(run)
    expect(await bucket.list('comics/demo/none.v*.png')).toEqual([])
  })

  it('uploads with immutable cache-control', async () => {
    const calls: string[][] = []
    const run = async (args: string[]) => {
      calls.push(args)
      return ''
    }
    const bucket = new GsutilBucket(run)
    await bucket.upload('/tmp/x.png', 'comics/demo/pages/p1/main.v3.png', IMMUTABLE_CC)
    expect(calls[0]).toEqual([
      '-h',
      `Cache-Control:${IMMUTABLE_CC}`,
      'cp',
      '/tmp/x.png',
      `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v3.png`,
    ])
  })

  it('copies within the bucket with no-cache for the latest pointer', async () => {
    const calls: string[][] = []
    const run = async (args: string[]) => {
      calls.push(args)
      return ''
    }
    const bucket = new GsutilBucket(run)
    await bucket.copy('comics/demo/pages/p1/main.v3.png', 'comics/demo/pages/p1/main.latest.png', LATEST_CC)
    expect(calls[0]).toEqual([
      '-h',
      `Cache-Control:${LATEST_CC}`,
      'cp',
      `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v3.png`,
      `gs://${GS_BUCKET}/comics/demo/pages/p1/main.latest.png`,
    ])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/cli`
Expected: FAIL — cannot resolve `./bucket`.

- [ ] **Step 3: Implement `packages/cli/src/bucket.ts`**

```ts
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export const GS_BUCKET = 'badcode-storage'
export const IMMUTABLE_CC = 'public, max-age=31536000, immutable'
export const LATEST_CC = 'no-cache'

/** Runs a gsutil invocation and returns stdout. Injectable for tests. */
export type GsutilRunner = (args: string[]) => Promise<string>

/** Bucket operations the commands depend on. Keys are bucket-relative (no `gs://`). */
export interface Bucket {
  /** List object basenames matching a bucket-relative glob (e.g. `comics/demo/p.v*.png`). */
  list(glob: string): Promise<string[]>
  /** Upload a local file to a bucket-relative key with the given Cache-Control. */
  upload(localFile: string, key: string, cacheControl: string): Promise<void>
  /** Copy one bucket-relative key to another with the given Cache-Control. */
  copy(srcKey: string, destKey: string, cacheControl: string): Promise<void>
}

const defaultRunner: GsutilRunner = async (args) => {
  const { stdout } = await execFileAsync('gsutil', args)
  return stdout
}

export class GsutilBucket implements Bucket {
  constructor(private readonly run: GsutilRunner = defaultRunner) {}

  async list(glob: string): Promise<string[]> {
    let out: string
    try {
      out = await this.run(['ls', `gs://${GS_BUCKET}/${glob}`])
    } catch {
      return [] // gsutil exits non-zero when nothing matches
    }
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split('/').pop()!)
  }

  async upload(localFile: string, key: string, cacheControl: string): Promise<void> {
    await this.run(['-h', `Cache-Control:${cacheControl}`, 'cp', localFile, `gs://${GS_BUCKET}/${key}`])
  }

  async copy(srcKey: string, destKey: string, cacheControl: string): Promise<void> {
    await this.run(['-h', `Cache-Control:${cacheControl}`, 'cp', `gs://${GS_BUCKET}/${srcKey}`, `gs://${GS_BUCKET}/${destKey}`])
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS — all GsutilBucket tests green.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/bucket.ts packages/cli/src/bucket.test.ts
git commit -m "feat(cli): Bucket interface + GsutilBucket with cache-control headers"
```

---

## Task 9: `push` command logic

**Files:**
- Create: `packages/cli/src/push.ts`
- Test: `packages/cli/src/push.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/push.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { defineComic } from '@badcode/comic-meta'
import { push } from './push'
import type { Bucket } from './bucket'
import { IMMUTABLE_CC, LATEST_CC } from './bucket'

const comic = defineComic({
  id: 'demo',
  style: 'ink',
  characters: { bob: { name: 'Bob', description: 'man', sheet: 'characters/bob/sheet.latest.png' } },
  assets: { 'p2-main': { kind: 'image', path: 'pages/p2/main.latest.png', characters: ['bob'], scene: 'rain' } },
})

function fakeBucket(existing: string[]) {
  const calls: { upload: string[][]; copy: string[][] } = { upload: [], copy: [] }
  const bucket: Bucket = {
    list: async () => existing,
    upload: async (file, key, cc) => {
      calls.upload.push([file, key, cc])
    },
    copy: async (src, dest, cc) => {
      calls.copy.push([src, dest, cc])
    },
  }
  return { bucket, calls }
}

describe('push', () => {
  it('uploads v1 + latest for a first push (empty bucket)', async () => {
    const { bucket, calls } = fakeBucket([])
    const version = await push(bucket, comic, { kind: 'asset', id: 'p2-main' }, '/tmp/out.png')
    expect(version).toBe(1)
    expect(calls.upload).toEqual([['/tmp/out.png', 'comics/demo/pages/p2/main.v1.png', IMMUTABLE_CC]])
    expect(calls.copy).toEqual([['comics/demo/pages/p2/main.v1.png', 'comics/demo/pages/p2/main.latest.png', LATEST_CC]])
  })

  it('bumps to the next version when prior versions exist', async () => {
    const { bucket, calls } = fakeBucket(['main.v1.png', 'main.v2.png'])
    const version = await push(bucket, comic, { kind: 'asset', id: 'p2-main' }, '/tmp/out.png')
    expect(version).toBe(3)
    expect(calls.upload[0][1]).toBe('comics/demo/pages/p2/main.v3.png')
    expect(calls.copy[0][1]).toBe('comics/demo/pages/p2/main.latest.png')
  })

  it('pushes a character sheet to the characters path', async () => {
    const { bucket, calls } = fakeBucket([])
    const version = await push(bucket, comic, { kind: 'character', id: 'bob' }, '/tmp/bob.png')
    expect(version).toBe(1)
    expect(calls.upload[0][1]).toBe('comics/demo/characters/bob/sheet.v1.png')
    expect(calls.copy[0][1]).toBe('comics/demo/characters/bob/sheet.latest.png')
  })

  it('throws for an unknown target', async () => {
    const { bucket } = fakeBucket([])
    await expect(push(bucket, comic, { kind: 'asset', id: 'nope' }, '/tmp/x.png')).rejects.toThrow(/unknown asset/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/cli`
Expected: FAIL — cannot resolve `./push`.

- [ ] **Step 3: Implement `packages/cli/src/push.ts`**

```ts
import type { Comic } from '@badcode/comic-meta'
import type { Bucket } from './bucket'
import { IMMUTABLE_CC, LATEST_CC } from './bucket'
import { splitLatestPath, versionedPath, latestPath, nextVersion, parseVersion } from './bucket-path'
import { targetPath, type Target } from './target'

/**
 * Upload `localFile` as the next version of `target` and refresh its `.latest`
 * pointer. Returns the new version number. Never edits source files.
 */
export async function push(bucket: Bucket, comic: Comic, target: Target, localFile: string): Promise<number> {
  const path = targetPath(comic, target) // throws on unknown target
  const parts = splitLatestPath(path)
  const dirPrefix = `comics/${comic.id}/${parts.dir ? `${parts.dir}/` : ''}`

  const existing = await bucket.list(`${dirPrefix}${parts.base}.v*.${parts.ext}`)
  const versions = existing.map(parseVersion).filter((n): n is number => n !== null)
  const n = nextVersion(versions)

  const versionedKey = `${dirPrefix}${versionedPath(parts, n).split('/').pop()}`
  const latestKey = `${dirPrefix}${latestPath(parts).split('/').pop()}`

  await bucket.upload(localFile, versionedKey, IMMUTABLE_CC)
  await bucket.copy(versionedKey, latestKey, LATEST_CC)
  return n
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS — all push tests green.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/push.ts packages/cli/src/push.test.ts
git commit -m "feat(cli): push command — versioned upload + latest refresh"
```

---

## Task 10: `status` command logic

**Files:**
- Create: `packages/cli/src/status.ts`
- Test: `packages/cli/src/status.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/status.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { defineComic } from '@badcode/comic-meta'
import { status } from './status'
import type { Bucket } from './bucket'

const comic = defineComic({
  id: 'demo',
  style: 'ink',
  characters: { bob: { name: 'Bob', description: 'man', sheet: 'characters/bob/sheet.latest.png' } },
  assets: {
    'p2-main': { kind: 'image', path: 'pages/p2/main.latest.png', characters: ['bob'], scene: 'rain' },
    'p2-anim': { kind: 'video', path: 'pages/p2/anim.latest.mp4', from: 'p2-main', to: 'p2-main', transition: 'x' },
  },
})

/** Fake that returns version files for some globs and nothing for others. */
function fakeBucket(map: Record<string, string[]>): Bucket {
  return {
    list: async (glob) => map[glob] ?? [],
    upload: async () => {},
    copy: async () => {},
  }
}

describe('status', () => {
  it('reports version counts and latest presence per character and asset', async () => {
    const bucket = fakeBucket({
      'comics/demo/characters/bob/sheet.v*.png': ['sheet.v1.png', 'sheet.v2.png'],
      'comics/demo/characters/bob/sheet.latest.png': ['sheet.latest.png'],
      'comics/demo/pages/p2/main.v*.png': ['main.v1.png'],
      'comics/demo/pages/p2/main.latest.png': ['main.latest.png'],
      'comics/demo/pages/p2/anim.v*.mp4': [],
      'comics/demo/pages/p2/anim.latest.mp4': [],
    })
    const rows = await status(bucket, comic)
    expect(rows).toEqual([
      { id: 'character:bob', kind: 'sheet', versions: 2, hasLatest: true },
      { id: 'p2-main', kind: 'image', versions: 1, hasLatest: true },
      { id: 'p2-anim', kind: 'video', versions: 0, hasLatest: false },
    ])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/cli`
Expected: FAIL — cannot resolve `./status`.

- [ ] **Step 3: Implement `packages/cli/src/status.ts`**

```ts
import type { Comic } from '@badcode/comic-meta'
import type { Bucket } from './bucket'
import { splitLatestPath, parseVersion } from './bucket-path'

export interface AssetStatus {
  id: string
  kind: string
  versions: number
  hasLatest: boolean
}

async function statusFor(bucket: Bucket, comicId: string, id: string, kind: string, path: string): Promise<AssetStatus> {
  const parts = splitLatestPath(path)
  const dirPrefix = `comics/${comicId}/${parts.dir ? `${parts.dir}/` : ''}`
  const versionFiles = await bucket.list(`${dirPrefix}${parts.base}.v*.${parts.ext}`)
  const latestFiles = await bucket.list(`${dirPrefix}${parts.base}.latest.${parts.ext}`)
  const versions = versionFiles.map(parseVersion).filter((n): n is number => n !== null).length
  return { id, kind, versions, hasLatest: latestFiles.length > 0 }
}

/** Report version counts + latest presence for every character sheet and asset. */
export async function status(bucket: Bucket, comic: Comic): Promise<AssetStatus[]> {
  const rows: AssetStatus[] = []
  for (const [charId, character] of Object.entries(comic.characters)) {
    rows.push(await statusFor(bucket, comic.id, `character:${charId}`, 'sheet', character.sheet))
  }
  for (const [assetId, asset] of Object.entries(comic.assets)) {
    rows.push(await statusFor(bucket, comic.id, assetId, asset.kind, asset.path))
  }
  return rows
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS — status test green.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/status.ts packages/cli/src/status.test.ts
git commit -m "feat(cli): status command — per-asset version + latest report"
```

---

## Task 11: Wire the `badcode` bin with Commander

**Files:**
- Modify: `packages/cli/src/bin.ts`

- [ ] **Step 1: Implement the full `packages/cli/src/bin.ts`**

```ts
#!/usr/bin/env -S npx tsx
import { Command } from 'commander'
import { loadComic } from './loadComic'
import { buildPrompt } from './prompt'
import { push } from './push'
import { status } from './status'
import { GsutilBucket } from './bucket'
import type { Target } from './target'

/** Resolve the CLI's (assetId | --character) into a Target. */
function toTarget(assetId: string | undefined, character: string | undefined): Target {
  if (character) return { kind: 'character', id: character }
  if (assetId) return { kind: 'asset', id: assetId }
  throw new Error('provide an <assetId> or --character <id>')
}

function printPrompt(result: { prompt: string; references: { label: string; url: string }[]; refHeading: string }): void {
  console.log('\n--- PROMPT (paste into Gemini) ---\n')
  console.log(result.prompt)
  if (result.references.length > 0) {
    console.log(`\n${result.refHeading}`)
    for (const ref of result.references) console.log(`  ${ref.label} ${ref.url}`)
  }
  console.log('')
}

const program = new Command()
program.name('badcode').description('Prepare Gemini prompts and manage comic assets in GCS.')

program
  .command('prompt')
  .description('Print the assembled Gemini prompt + reference URLs for an asset or character sheet.')
  .argument('<comic>', 'comic id (folder under apps/web/src/comics)')
  .argument('[assetId]', 'asset id from the comic metadata')
  .option('-c, --character <id>', 'target a character sheet instead of an asset')
  .option('-a, --add <text>', 'extra text appended to the prompt base')
  .action(async (comicId: string, assetId: string | undefined, opts: { character?: string; add?: string }) => {
    const comic = await loadComic(comicId)
    const result = buildPrompt(comic, toTarget(assetId, opts.character), opts.add)
    printPrompt(result)
  })

program
  .command('push')
  .description('Upload a generated file as the next version of an asset/sheet and refresh .latest.')
  .argument('<comic>', 'comic id')
  .argument('[assetId]', 'asset id from the comic metadata')
  .requiredOption('-f, --file <path>', 'local file to upload')
  .option('-c, --character <id>', 'target a character sheet instead of an asset')
  .action(async (comicId: string, assetId: string | undefined, opts: { file: string; character?: string }) => {
    const comic = await loadComic(comicId)
    const target = toTarget(assetId, opts.character)
    const version = await push(new GsutilBucket(), comic, target, opts.file)
    console.log(`pushed v${version}`)
  })

program
  .command('status')
  .description('Show which assets/sheets have been generated and how many versions exist.')
  .argument('<comic>', 'comic id')
  .action(async (comicId: string) => {
    const comic = await loadComic(comicId)
    const rows = await status(new GsutilBucket(), comic)
    for (const row of rows) {
      const latest = row.hasLatest ? 'latest✓' : 'latest✗'
      console.log(`${row.id.padEnd(18)} ${row.kind.padEnd(7)} v=${row.versions}  ${latest}`)
    }
  })

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exitCode = 1
})
```

> Note on `push` usage: the file is a required option (`--file`), not a positional, because Commander forbids a required positional after an optional one (`[assetId]`). So an asset push is `badcode push <comic> <assetId> --file <path>` and a character push is `badcode push <comic> --character <id> --file <path>` (the `[assetId]` positional simply stays undefined).

- [ ] **Step 2: Typecheck the CLI**

Run: `npm run typecheck --workspace @badcode/cli`
Expected: no errors.

- [ ] **Step 3: Smoke-test help output**

Run: `npx tsx packages/cli/src/bin.ts --help`
Expected: shows `prompt`, `push`, and `status` subcommands.

- [ ] **Step 4: Smoke-test the subcommand wiring**

A real `prompt`/`push`/`status` run needs a comic under `apps/web/src/comics/`, which Task 12 creates. For now just confirm each subcommand is wired and parses its options:

Run: `npx tsx packages/cli/src/bin.ts prompt --help`
Expected: shows `<comic>`, `[assetId]`, `-c, --character`, `-a, --add`.

Run: `npx tsx packages/cli/src/bin.ts push --help`
Expected: shows `<comic>`, `[assetId]`, required `-f, --file`, `-c, --character`.

- [ ] **Step 5: Run the full CLI test suite**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS — all CLI tests green.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/bin.ts
git commit -m "feat(cli): wire badcode bin (prompt/push/status) with commander"
```

---

## Task 12: Migrate the `camping` comic (worked example)

This task creates the camping metadata, uploads its existing placeholder SVGs to the bucket (dogfooding `push`), and switches the component to resolve URLs from metadata. **This task performs live writes to the `badcode-storage` bucket** using your authenticated `gsutil`.

**Files:**
- Create: `apps/web/src/comics/camping/comic.meta.ts`
- Modify: `apps/web/src/comics/camping/CampingComic.tsx`

- [ ] **Step 1: Verify bucket access and check for a path collision**

Run: `gsutil ls gs://badcode-storage/comics/camping/ 2>&1 || echo "NO EXISTING camping PREFIX (good)"`
Expected: either an error / "NO EXISTING camping PREFIX (good)" (the path is free), or a listing. **If objects already exist under `comics/camping/`,** stop and confirm with the user whether to reuse or to switch the bucket prefix (the spec flags this); do not overwrite unknown objects.

- [ ] **Step 2: Create `apps/web/src/comics/camping/comic.meta.ts`**

The camping comic has four pages (p1–p4) that currently use placeholder SVGs. Model each as an image asset. (No characters are required for placeholder art; `characters: []` is valid. Real character sheets for Bob/Tarquin can be added later.)

```ts
import { defineComic } from '@badcode/comic-meta'

/**
 * Generation metadata for "Camping" (EP1, track 1). Written once; the bucket
 * holds every version. See docs/superpowers/specs/2026-06-02-comic-asset-tooling-design.md.
 */
export default defineComic({
  id: 'camping',
  style:
    'Gritty graphic-novel ink, muted desaturated palette, heavy shadow, cinematic wide framing. ' +
    'Cold British dystopia. No text or speech bubbles in the image.',
  characters: {
    bob: {
      name: 'Bob',
      description: 'Weathered homeless man, ~50, charity-shop coat, kind tired eyes, grey stubble.',
      sheet: 'characters/bob/sheet.latest.png',
    },
    tarquin: {
      name: 'Tarquin',
      description: 'Sharp-suited financier, early 30s, smug, expensive overcoat, slicked hair.',
      sheet: 'characters/tarquin/sheet.latest.png',
    },
  },
  assets: {
    'p1-main': {
      kind: 'image',
      path: 'pages/p1/main.latest.svg',
      characters: ['tarquin'],
      scene: 'Tarquin celebrates closing the biggest deal of his career, a gold halo of city lights behind him.',
    },
    'p2-main': {
      kind: 'image',
      path: 'pages/p2/main.latest.svg',
      characters: ['bob', 'tarquin'],
      scene: 'A grey supermarket car park. Bob asks Tarquin for spare change; Tarquin judges him.',
    },
    'p3-main': {
      kind: 'image',
      path: 'pages/p3/main.latest.svg',
      characters: ['bob'],
      scene: 'A spectral Ghost of Economic Future looms over Bob, replaying how he ended up here.',
    },
    'p4-main': {
      kind: 'image',
      path: 'pages/p4/main.latest.svg',
      characters: ['bob', 'tarquin'],
      scene: 'Five years later. A boarded-up Waitrose; Bob, still homeless, shows Tarquin kindness.',
    },
  },
})
```

- [ ] **Step 3: Typecheck the new metadata**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors (the file is valid TS even before it is imported).

- [ ] **Step 4: Upload the existing placeholder SVGs as v1 via the `badcode` CLI**

The placeholders live at `apps/web/public/comics/camping/p1.svg`…`p4.svg`. Push each into the bucket (this creates `pages/pN/main.v1.svg` + `pages/pN/main.latest.svg`):

Run:
```bash
npx tsx packages/cli/src/bin.ts push camping p1-main --file apps/web/public/comics/camping/p1.svg
npx tsx packages/cli/src/bin.ts push camping p2-main --file apps/web/public/comics/camping/p2.svg
npx tsx packages/cli/src/bin.ts push camping p3-main --file apps/web/public/comics/camping/p3.svg
npx tsx packages/cli/src/bin.ts push camping p4-main --file apps/web/public/comics/camping/p4.svg
```
Expected: each prints `pushed v1`.

- [ ] **Step 5: Verify with `status` and a public URL fetch**

Run: `npx tsx packages/cli/src/bin.ts status camping`
Expected: rows for `p1-main`…`p4-main` show `v=1 latest✓`; character sheets show `v=0 latest✗` (not generated yet).

Run: `curl -sI https://storage.googleapis.com/badcode-storage/comics/camping/pages/p1/main.latest.svg | head -1`
Expected: `HTTP/2 200` (the object is public-readable). If `403`, the bucket/object is not public — stop and confirm the bucket's public-read posture with the user (spec open item).

- [ ] **Step 6: Switch `CampingComic.tsx` to resolve URLs from metadata**

Modify `apps/web/src/comics/camping/CampingComic.tsx`. Add imports at the top:

```tsx
import meta from './comic.meta'
import { resolve } from '@badcode/comic-meta'
```

Then replace each hard-coded `ImageWidget` src. The four current lines are:

```tsx
<ImageWidget src="/comics/camping/p1.svg" />
<ImageWidget src="/comics/camping/p2.svg" />
<ImageWidget src="/comics/camping/p3.svg" />
<ImageWidget src="/comics/camping/p4.svg" />
```

Replace them respectively with:

```tsx
<ImageWidget src={resolve(meta, 'p1-main')} />
<ImageWidget src={resolve(meta, 'p2-main')} />
<ImageWidget src={resolve(meta, 'p3-main')} />
<ImageWidget src={resolve(meta, 'p4-main')} />
```

Leave everything else (effects, transitions, bubbles, side text) exactly as-is.

- [ ] **Step 7: Typecheck and build the web app**

Run: `npm run typecheck --workspace @badcode/web`
Expected: no errors.

Run: `npm run build --workspace @badcode/web`
Expected: builds successfully.

- [ ] **Step 8: Visually verify in dev**

Run: `npm run dev` (then open http://localhost:5173)
Expected: the camping comic renders with all four page images loading from `storage.googleapis.com/badcode-storage/...` (check the Network tab). Stop the dev server when done.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/comics/camping/comic.meta.ts apps/web/src/comics/camping/CampingComic.tsx
git commit -m "feat(web): migrate camping comic to bucket-backed metadata assets"
```

---

## Task 13: Root test script + final verification

**Files:**
- Modify: `package.json` (root)

- [ ] **Step 1: Add a root `test` script**

In the root `package.json`, add `test` to the `scripts` block (alongside the existing `dev`/`build`/`preview`/`typecheck`):

```json
    "test": "npm run test --workspaces --if-present",
```

- [ ] **Step 2: Run the full test suite across workspaces**

Run: `npm test`
Expected: PASS — `@badcode/comic-meta` and `@badcode/cli` suites all green.

- [ ] **Step 3: Run the full typecheck across workspaces**

Run: `npm run typecheck`
Expected: no errors in any workspace.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: root test script across workspaces"
```

---

## Done — verification checklist

- [ ] `npm test` passes (comic-meta + cli suites).
- [ ] `npm run typecheck` passes across all workspaces.
- [ ] `npm run build --workspace @badcode/web` succeeds.
- [ ] `npx tsx packages/cli/src/bin.ts prompt camping p2-main` prints a layered prompt with two character-sheet reference URLs.
- [ ] `npx tsx packages/cli/src/bin.ts status camping` reports the four pages at `v=1 latest✓`.
- [ ] The camping comic renders in dev with images served from `badcode-storage`.

## Notes for the implementer

- **Never edit a `comic.meta.ts` from the CLI.** Re-generation only changes bucket objects; the `.latest` pointer is stable. This is the core design invariant.
- **`--add` is additive.** It is appended to the metadata-derived prompt, never a replacement. Keep it that way.
- If a Vitest version other than `^2` is already hoisted at the repo root, match that version in both new packages to avoid duplicate installs.
- Video generation (`badcode prompt <comic> <video-asset>`) is fully implemented here; producing an actual `.mp4` is a manual Gemini/Veo step the human runs, then `badcode push <comic> <video-asset> result.mp4`.
- Future phases (browser automation) are out of scope — see the spec's "Future phases" section.
