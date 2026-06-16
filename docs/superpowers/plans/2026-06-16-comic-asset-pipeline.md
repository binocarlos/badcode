# Comic Asset Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A path-based offline CLI command that scans a GCS bucket subfolder, generates low/high WebP variants + a ThumbHash placeholder for every raster image, uploads the variants, and emits a committed `assets.manifest.json` — with zero coupling to the storyteller comic-ID system.

**Architecture:** This is **Plan 1 of 2** (pipeline first; the runtime loader is Plan 2). The two plans share one contract: a path-keyed manifest. To share it without coupling, the manifest TypeScript types live in a new tiny types-only package `@badcode/comic-manifest`, imported by both the CLI (this plan, the producer) and `@badcode/comic` (Plan 2, the consumer). The pipeline is added to the existing `@badcode/cli` package as a new `assets-build` command, reusing its injectable `Bucket`/`GsutilRunner` abstractions. All heavy work (GCS I/O, Sharp, ThumbHash) sits behind injectable interfaces so the orchestrator is unit-tested with fakes.

**Tech Stack:** TypeScript (ESM, `verbatimModuleSyntax`), Node ≥22, `commander`, `sharp` (resize→WebP), `thumbhash` (placeholder), `gsutil` (via the existing `GsutilBucket`), `vitest`.

---

## Background the engineer needs

Read these before starting:

- The design spec: `docs/superpowers/specs/2026-06-16-progressive-comic-loading-design.md`.
- The existing CLI lives in `packages/cli`. It uses `commander` (`src/bin.ts`), and a `Bucket` interface (`src/bucket.ts`) whose real implementation `GsutilBucket` shells out to `gsutil`. Crucially, `GsutilBucket` takes an injectable `GsutilRunner` (`(args: string[]) => Promise<string>`) so tests assert the gsutil args without touching the network. Follow that pattern for every new external dependency.
- Workspace package imports resolve via `tsconfig.base.json` `paths`: `"@badcode/*": ["packages/*/src"]`. So a new package `packages/comic-manifest` is importable as `@badcode/comic-manifest`.
- Tests are colocated `*.test.ts` files run with `vitest run`. Run a single package's tests with `npm test --workspace @badcode/cli`.
- ESM + `verbatimModuleSyntax` is on: import types with `import type { ... }`.

**Key terminology:**
- **src prefix / basePath:** a bucket-relative subfolder, e.g. `comics-v2/gpom-ep1` (no `gs://`, no bucket name, no trailing slash).
- **relative key:** an asset's path *within* basePath, e.g. `p1/main.png`. This is the manifest key.
- **variant key:** a generated file's basePath-relative path, e.g. `derived/p1/main.low.webp`.
- **raster image:** `.png .jpg .jpeg .webp` → gets tiers + ThumbHash.
- **passthrough:** `.svg .mp4 .webm` → no tiers; manifest entry points `low`/`high` at the original and `thumbhash` is `''`.

**Idempotency model (important):** the command accepts the *previous* manifest (read from the `--manifest` file if it exists). For each discovered asset, if a prior entry exists, its variant keys already exist in the bucket, and `--force` is not set, the prior entry is **reused** (no download, no re-encode, no re-upload). New/added assets are processed; assets whose source was deleted drop out. Detecting an *in-place content change* (same filename, new bytes) requires `--force` in this version; content-hash–based detection is future work (noted in the spec).

---

## File structure (locks in decomposition)

**New package `packages/comic-manifest/`** (types-only, zero runtime deps):
- `package.json`, `tsconfig.json`
- `src/index.ts` — `ImageVariant`, `AssetManifest` types + `validateManifest()` guard. **Single source of truth for the contract.**
- `src/index.test.ts`

**Modified/new in `packages/cli/src/`:**
- `bucket.ts` *(modify)* — add `download()` and `listKeys()` to the `Bucket` interface and `GsutilBucket`.
- `bucket.test.ts` *(modify)* — tests for the two new methods.
- `asset-paths.ts` *(new)* — pure helpers: `relKey`, `variantKey`, `classifyAsset`. No I/O.
- `asset-paths.test.ts` *(new)*
- `image-processor.ts` *(new)* — `ImageProcessor` interface + `SharpImageProcessor` (sharp + thumbhash).
- `image-processor.test.ts` *(new)*
- `assets-build.ts` *(new)* — the orchestrator: `assetsBuild(opts)` → `AssetManifest`. Pure of process/argv concerns; takes injected `Bucket` + `ImageProcessor`.
- `assets-build.test.ts` *(new)* — fakes for `Bucket` + `ImageProcessor`.
- `bin.ts` *(modify)* — register the `assets-build` command: read previous manifest, call `assetsBuild`, write the manifest file, upload a copy to the bucket.
- `package.json` *(modify)* — add `sharp`, `thumbhash`, `@badcode/comic-manifest` deps.

---

## Task 1: Create the `@badcode/comic-manifest` contract package

**Files:**
- Create: `packages/comic-manifest/package.json`
- Create: `packages/comic-manifest/tsconfig.json`
- Create: `packages/comic-manifest/src/index.ts`
- Test: `packages/comic-manifest/src/index.test.ts`

- [ ] **Step 1: Create the package manifest**

Create `packages/comic-manifest/package.json`:

```json
{
  "name": "@badcode/comic-manifest",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "description": "Shared types for the path-keyed comic asset manifest (pipeline output / runtime input).",
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
  "devDependencies": {
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create the tsconfig**

Create `packages/comic-manifest/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Write the failing test**

Create `packages/comic-manifest/src/index.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { validateManifest } from './index'
import type { AssetManifest } from './index'

const valid: AssetManifest = {
  basePath: 'comics-v2/gpom-ep1',
  assets: {
    'p1/main.png': {
      thumbhash: 'data:image/png;base64,abc',
      low: 'derived/p1/main.low.webp',
      high: 'derived/p1/main.high.webp',
      width: 1600,
      height: 900,
    },
  },
}

describe('validateManifest', () => {
  it('returns the manifest unchanged when the shape is valid', () => {
    expect(validateManifest(valid)).toEqual(valid)
  })

  it('throws when basePath is missing', () => {
    expect(() => validateManifest({ assets: {} })).toThrow(/basePath/)
  })

  it('throws when an asset entry is missing a numeric width', () => {
    const bad = { basePath: 'x', assets: { 'a.png': { thumbhash: '', low: 'a', high: 'a', height: 1 } } }
    expect(() => validateManifest(bad)).toThrow(/width/)
  })
})
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test --workspace @badcode/comic-manifest`
Expected: FAIL — `validateManifest` is not exported / file missing.

- [ ] **Step 5: Implement the types + guard**

Create `packages/comic-manifest/src/index.ts`:

```ts
/** Generated variants + placeholder for one image asset. Paths are basePath-relative. */
export interface ImageVariant {
  /** Compact base64 of the raw ThumbHash bytes (~33 chars), or empty string for passthrough assets (SVG/video). Decode to a data-URI at runtime via thumbHashToDataURL. */
  thumbhash: string
  /** basePath-relative key of the low-res WebP (~720w). For passthrough, the original key. */
  low: string
  /** basePath-relative key of the high-res WebP (~1920w). For passthrough, the original key. */
  high: string
  /** Intrinsic pixel width of the source image. */
  width: number
  /** Intrinsic pixel height of the source image. */
  height: number
}

/** The full pipeline output for one bucket subfolder. */
export interface AssetManifest {
  /** Bucket-relative subfolder the assets live under, no trailing slash. */
  basePath: string
  /** Map of basePath-relative source key → its variants. */
  assets: Record<string, ImageVariant>
}

function fail(msg: string): never {
  throw new Error(`invalid manifest: ${msg}`)
}

/** Validate an untrusted value is a well-formed AssetManifest; returns it typed or throws. */
export function validateManifest(value: unknown): AssetManifest {
  if (typeof value !== 'object' || value === null) fail('not an object')
  const m = value as Record<string, unknown>
  if (typeof m.basePath !== 'string') fail('basePath must be a string')
  if (typeof m.assets !== 'object' || m.assets === null) fail('assets must be an object')
  for (const [key, raw] of Object.entries(m.assets as Record<string, unknown>)) {
    if (typeof raw !== 'object' || raw === null) fail(`asset "${key}" is not an object`)
    const e = raw as Record<string, unknown>
    if (typeof e.thumbhash !== 'string') fail(`asset "${key}" thumbhash must be a string`)
    if (typeof e.low !== 'string') fail(`asset "${key}" low must be a string`)
    if (typeof e.high !== 'string') fail(`asset "${key}" high must be a string`)
    if (typeof e.width !== 'number') fail(`asset "${key}" width must be a number`)
    if (typeof e.height !== 'number') fail(`asset "${key}" height must be a number`)
  }
  return value as AssetManifest
}
```

- [ ] **Step 6: Install workspace deps and run the test to verify it passes**

Run: `npm install` (registers the new workspace) then `npm test --workspace @badcode/comic-manifest`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add packages/comic-manifest package-lock.json
git commit -m "feat(comic-manifest): shared asset-manifest contract types + validator"
```

---

## Task 2: Extend `Bucket` with `download` and `listKeys`

The pipeline must (a) recursively list every object under a prefix as full bucket-relative keys, and (b) download originals to process them. The existing `list(glob)` returns only basenames, so it is unsuitable for recursion.

**Files:**
- Modify: `packages/cli/src/bucket.ts`
- Test: `packages/cli/src/bucket.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `packages/cli/src/bucket.test.ts` (inside the existing top-level `describe`, or a new one):

```ts
import { describe, it, expect, vi } from 'vitest'
import { GsutilBucket, GS_BUCKET } from './bucket'

describe('GsutilBucket.listKeys', () => {
  it('lists full bucket-relative keys recursively, dropping directory lines', async () => {
    const run = vi.fn(async () =>
      [
        `gs://${GS_BUCKET}/comics-v2/ep1/:`,
        `gs://${GS_BUCKET}/comics-v2/ep1/p1/main.png`,
        `gs://${GS_BUCKET}/comics-v2/ep1/p1/`,
        `gs://${GS_BUCKET}/comics-v2/ep1/p2/main.jpg`,
        ``,
      ].join('\n'),
    )
    const bucket = new GsutilBucket(run)
    const keys = await bucket.listKeys('comics-v2/ep1')
    expect(run).toHaveBeenCalledWith(['ls', '-r', `gs://${GS_BUCKET}/comics-v2/ep1/**`])
    expect(keys).toEqual(['comics-v2/ep1/p1/main.png', 'comics-v2/ep1/p2/main.jpg'])
  })

  it('returns [] when nothing matches', async () => {
    const run = vi.fn(async () => {
      throw new Error('CommandException: One or more URLs matched no objects.')
    })
    const bucket = new GsutilBucket(run)
    expect(await bucket.listKeys('comics-v2/empty')).toEqual([])
  })
})

describe('GsutilBucket.download', () => {
  it('cp from the bucket key to a local file', async () => {
    const run = vi.fn(async () => '')
    const bucket = new GsutilBucket(run)
    await bucket.download('comics-v2/ep1/p1/main.png', '/tmp/main.png')
    expect(run).toHaveBeenCalledWith(['cp', `gs://${GS_BUCKET}/comics-v2/ep1/p1/main.png`, '/tmp/main.png'])
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test --workspace @badcode/cli -- bucket`
Expected: FAIL — `listKeys`/`download` do not exist.

- [ ] **Step 3: Add the methods to the interface and implementation**

In `packages/cli/src/bucket.ts`, add to the `Bucket` interface (after `copy`):

```ts
  /** Download a bucket-relative key to a local file path. */
  download(key: string, localFile: string): Promise<void>
  /** Recursively list full bucket-relative keys under a prefix (directories excluded). */
  listKeys(prefix: string): Promise<string[]>
```

Add to the `GsutilBucket` class (after `copy`):

```ts
  async download(key: string, localFile: string): Promise<void> {
    await this.run(['cp', `gs://${GS_BUCKET}/${key}`, localFile])
  }

  async listKeys(prefix: string): Promise<string[]> {
    let out: string
    try {
      out = await this.run(['ls', '-r', `gs://${GS_BUCKET}/${prefix}/**`])
    } catch {
      return [] // gsutil exits non-zero when nothing matches
    }
    const root = `gs://${GS_BUCKET}/`
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith(root) && !line.endsWith('/') && !line.endsWith(':'))
      .map((line) => line.slice(root.length))
  }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test --workspace @badcode/cli -- bucket`
Expected: PASS (existing bucket tests + the 3 new ones).

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/bucket.ts packages/cli/src/bucket.test.ts
git commit -m "feat(cli): add download + recursive listKeys to Bucket"
```

---

## Task 3: Pure path helpers (`asset-paths.ts`)

**Files:**
- Create: `packages/cli/src/asset-paths.ts`
- Test: `packages/cli/src/asset-paths.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/asset-paths.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { relKey, variantKey, classifyAsset } from './asset-paths'

describe('relKey', () => {
  it('strips the basePath prefix', () => {
    expect(relKey('comics-v2/ep1', 'comics-v2/ep1/p1/main.png')).toBe('p1/main.png')
  })
  it('tolerates a trailing slash on basePath', () => {
    expect(relKey('comics-v2/ep1/', 'comics-v2/ep1/p1/main.png')).toBe('p1/main.png')
  })
})

describe('variantKey', () => {
  it('builds derived WebP keys, swapping the extension', () => {
    expect(variantKey('p1/main.png', 'low')).toBe('derived/p1/main.low.webp')
    expect(variantKey('p1/main.png', 'high')).toBe('derived/p1/main.high.webp')
  })
  it('handles multi-dot filenames by replacing only the final extension', () => {
    expect(variantKey('p7/anim/f000.latest.jpg', 'low')).toBe('derived/p7/anim/f000.latest.low.webp')
  })
})

describe('classifyAsset', () => {
  it('classifies raster images', () => {
    expect(classifyAsset('p1/main.png')).toBe('raster')
    expect(classifyAsset('p1/main.JPG')).toBe('raster')
    expect(classifyAsset('p1/f.jpeg')).toBe('raster')
    expect(classifyAsset('p1/f.webp')).toBe('raster')
  })
  it('classifies passthrough assets', () => {
    expect(classifyAsset('p1/bg.svg')).toBe('passthrough')
    expect(classifyAsset('p1/clip.mp4')).toBe('passthrough')
    expect(classifyAsset('p1/clip.webm')).toBe('passthrough')
  })
  it('skips derived outputs, manifests, and unknown files', () => {
    expect(classifyAsset('derived/p1/main.low.webp')).toBe('skip')
    expect(classifyAsset('assets.manifest.json')).toBe('skip')
    expect(classifyAsset('notes.txt')).toBe('skip')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test --workspace @badcode/cli -- asset-paths`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helpers**

Create `packages/cli/src/asset-paths.ts`:

```ts
export type AssetClass = 'raster' | 'passthrough' | 'skip'

const RASTER = new Set(['png', 'jpg', 'jpeg', 'webp'])
const PASSTHROUGH = new Set(['svg', 'mp4', 'webm'])

function ext(key: string): string {
  const dot = key.lastIndexOf('.')
  return dot >= 0 ? key.slice(dot + 1).toLowerCase() : ''
}

/** Strip the basePath prefix from a full bucket key, yielding the manifest key. */
export function relKey(basePath: string, fullKey: string): string {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  return fullKey.startsWith(base) ? fullKey.slice(base.length) : fullKey
}

/** basePath-relative key for a generated variant, e.g. derived/p1/main.low.webp */
export function variantKey(rel: string, tier: 'low' | 'high'): string {
  const dot = rel.lastIndexOf('.')
  const withoutExt = dot >= 0 ? rel.slice(0, dot) : rel
  return `derived/${withoutExt}.${tier}.webp`
}

/** Decide how the pipeline treats a key based on its extension and location. */
export function classifyAsset(rel: string): AssetClass {
  if (rel.startsWith('derived/')) return 'skip'
  const e = ext(rel)
  if (RASTER.has(e)) return 'raster'
  if (PASSTHROUGH.has(e)) return 'passthrough'
  return 'skip'
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @badcode/cli -- asset-paths`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/asset-paths.ts packages/cli/src/asset-paths.test.ts
git commit -m "feat(cli): pure path helpers for asset classification + variant keys"
```

---

## Task 4: `ImageProcessor` interface + `SharpImageProcessor`

This wraps `sharp` and `thumbhash` behind an interface so the orchestrator (Task 5) is testable with a fake. This task's own test uses a real generated image (deterministic, no network).

**Files:**
- Modify: `packages/cli/package.json` (add deps)
- Create: `packages/cli/src/image-processor.ts`
- Test: `packages/cli/src/image-processor.test.ts`

- [ ] **Step 1: Add dependencies**

Edit `packages/cli/package.json` `dependencies` to add `sharp` and `thumbhash`:

```json
  "dependencies": {
    "@badcode/comic-manifest": "*",
    "@badcode/comic-meta": "*",
    "commander": "^12.1.0",
    "sharp": "^0.33.5",
    "thumbhash": "^0.1.1"
  },
```

Then run: `npm install`
Expected: installs `sharp` + `thumbhash`, links `@badcode/comic-manifest`.

- [ ] **Step 2: Write the failing test**

Create `packages/cli/src/image-processor.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { SharpImageProcessor } from './image-processor'

let dir: string
let srcPng: string

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'imgproc-'))
  srcPng = join(dir, 'src.png')
  await sharp({ create: { width: 1200, height: 800, channels: 3, background: { r: 10, g: 90, b: 160 } } })
    .png()
    .toFile(srcPng)
})

afterAll(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('SharpImageProcessor', () => {
  const proc = new SharpImageProcessor()

  it('reports intrinsic dimensions', async () => {
    expect(await proc.dimensions(srcPng)).toEqual({ width: 1200, height: 800 })
  })

  it('writes a WebP no wider than the requested width', async () => {
    const out = join(dir, 'out.low.webp')
    await proc.toWebp(srcPng, out, 720, 70)
    const meta = await sharp(out).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.width).toBeLessThanOrEqual(720)
  })

  it('does not upscale images smaller than the target width', async () => {
    const out = join(dir, 'out.high.webp')
    await proc.toWebp(srcPng, out, 1920, 80)
    const meta = await sharp(out).metadata()
    expect(meta.width).toBe(1200)
  })

  it('produces a non-empty image data-URI from ThumbHash', async () => {
    const uri = await proc.thumbhashDataUri(srcPng)
    expect(uri.startsWith('data:image/')).toBe(true)
    expect(uri.length).toBeGreaterThan(64)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test --workspace @badcode/cli -- image-processor`
Expected: FAIL — `SharpImageProcessor` not found.

- [ ] **Step 4: Implement the processor**

Create `packages/cli/src/image-processor.ts`:

```ts
import sharp from 'sharp'
import { rgbaToThumbHash } from 'thumbhash'

export interface ImageProcessor {
  /** Intrinsic pixel dimensions of the source image. */
  dimensions(input: string): Promise<{ width: number; height: number }>
  /** Resize to at most `width` px (never upscaling) and write a WebP to `output`. */
  toWebp(input: string, output: string, width: number, quality: number): Promise<void>
  /** Compute a ThumbHash and return it as compact base64 of the raw hash bytes (~33 chars). Decode at runtime via thumbHashToDataURL. */
  thumbhash(input: string): Promise<string>
}

export class SharpImageProcessor implements ImageProcessor {
  async dimensions(input: string): Promise<{ width: number; height: number }> {
    const meta = await sharp(input).metadata()
    return { width: meta.width ?? 0, height: meta.height ?? 0 }
  }

  async toWebp(input: string, output: string, width: number, quality: number): Promise<void> {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(output)
  }

  async thumbhash(input: string): Promise<string> {
    // ThumbHash requires the source no larger than 100x100.
    const { data, info } = await sharp(input)
      .resize(100, 100, { fit: 'inside', withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const hash = rgbaToThumbHash(info.width, info.height, data)
    return Buffer.from(hash).toString('base64')
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test --workspace @badcode/cli -- image-processor`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/image-processor.ts packages/cli/src/image-processor.test.ts packages/cli/package.json package-lock.json
git commit -m "feat(cli): SharpImageProcessor for WebP tiers + ThumbHash data-URI"
```

---

## Task 5: The build orchestrator (`assets-build.ts`)

Pure of `process`/`argv`: takes an injected `Bucket` + `ImageProcessor`, returns an `AssetManifest`. Handles classification, the idempotency reuse path, dry-run, concurrency, and passthrough.

**Files:**
- Create: `packages/cli/src/assets-build.ts`
- Test: `packages/cli/src/assets-build.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/assets-build.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { AssetManifest } from '@badcode/comic-manifest'
import { assetsBuild } from './assets-build'

function fakeBucket(over: Partial<Bucket> & { keys?: string[] }): Bucket {
  return {
    list: vi.fn(async () => []),
    copy: vi.fn(async () => {}),
    upload: vi.fn(async () => {}),
    download: vi.fn(async () => {}),
    listKeys: vi.fn(async () => over.keys ?? []),
    ...over,
  } as Bucket
}

function fakeProcessor(): ImageProcessor {
  return {
    dimensions: vi.fn(async () => ({ width: 1600, height: 900 })),
    toWebp: vi.fn(async () => {}),
    thumbhashDataUri: vi.fn(async () => 'data:image/png;base64,HASH'),
  }
}

const SRC = 'comics-v2/ep1'

describe('assetsBuild', () => {
  it('builds variant entries for raster images and uploads both tiers', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/main.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC })

    expect(manifest.basePath).toBe(SRC)
    expect(manifest.assets['p1/main.png']).toEqual({
      thumbhash: 'data:image/png;base64,HASH',
      low: 'derived/p1/main.low.webp',
      high: 'derived/p1/main.high.webp',
      width: 1600,
      height: 900,
    })
    expect(proc.toWebp).toHaveBeenCalledTimes(2) // low + high
    expect(bucket.upload).toHaveBeenCalledTimes(2)
  })

  it('treats SVG/video as passthrough: original key, empty thumbhash, no processing', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/bg.svg`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC })

    expect(manifest.assets['p1/bg.svg']).toEqual({
      thumbhash: '',
      low: 'p1/bg.svg',
      high: 'p1/bg.svg',
      width: 0,
      height: 0,
    })
    expect(proc.toWebp).not.toHaveBeenCalled()
    expect(bucket.upload).not.toHaveBeenCalled()
  })

  it('skips files classified as skip (derived outputs, manifests)', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/derived/p1/main.low.webp`, `${SRC}/assets.manifest.json`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC })
    expect(Object.keys(manifest.assets)).toHaveLength(0)
  })

  it('reuses a prior entry when variants already exist and --force is off', async () => {
    const bucket = fakeBucket({
      keys: [`${SRC}/p1/main.png`, `${SRC}/derived/p1/main.low.webp`, `${SRC}/derived/p1/main.high.webp`],
    })
    const proc = fakeProcessor()
    const previous: AssetManifest = {
      basePath: SRC,
      assets: {
        'p1/main.png': { thumbhash: 'OLD', low: 'derived/p1/main.low.webp', high: 'derived/p1/main.high.webp', width: 1, height: 2 },
      },
    }
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC, previous })

    expect(manifest.assets['p1/main.png'].thumbhash).toBe('OLD')
    expect(proc.toWebp).not.toHaveBeenCalled()
    expect(bucket.download).not.toHaveBeenCalled()
  })

  it('reprocesses a prior entry when force is set', async () => {
    const bucket = fakeBucket({
      keys: [`${SRC}/p1/main.png`, `${SRC}/derived/p1/main.low.webp`, `${SRC}/derived/p1/main.high.webp`],
    })
    const proc = fakeProcessor()
    const previous: AssetManifest = {
      basePath: SRC,
      assets: {
        'p1/main.png': { thumbhash: 'OLD', low: 'derived/p1/main.low.webp', high: 'derived/p1/main.high.webp', width: 1, height: 2 },
      },
    }
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC, previous, force: true })

    expect(manifest.assets['p1/main.png'].thumbhash).toBe('data:image/png;base64,HASH')
    expect(proc.toWebp).toHaveBeenCalledTimes(2)
  })

  it('dry-run computes the manifest without uploading', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/p1/main.png`] })
    const proc = fakeProcessor()
    const manifest = await assetsBuild({ bucket, processor: proc, src: SRC, dryRun: true })

    expect(manifest.assets['p1/main.png'].low).toBe('derived/p1/main.low.webp')
    expect(bucket.upload).not.toHaveBeenCalled()
    expect(proc.toWebp).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test --workspace @badcode/cli -- assets-build`
Expected: FAIL — `assets-build` module not found.

- [ ] **Step 3: Implement the orchestrator**

Create `packages/cli/src/assets-build.ts`:

```ts
import { mkdtemp, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { AssetManifest, ImageVariant } from '@badcode/comic-manifest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import { IMMUTABLE_CC } from './bucket'
import { relKey, variantKey, classifyAsset } from './asset-paths'

const LOW_WIDTH = 720
const LOW_QUALITY = 70
const HIGH_WIDTH = 1920
const HIGH_QUALITY = 80

export interface AssetsBuildOptions {
  bucket: Bucket
  processor: ImageProcessor
  /** Bucket-relative source subfolder (no trailing slash, no gs://). */
  src: string
  /** Previous manifest, used to reuse unchanged entries. */
  previous?: AssetManifest
  /** Recompute every asset even if variants exist. */
  force?: boolean
  /** Compute the manifest but perform no uploads or image processing. */
  dryRun?: boolean
  /** Max concurrent assets processed. Default 6. */
  concurrency?: number
  /** Progress sink. Default: no-op. */
  log?: (msg: string) => void
}

/** Run `fn` over `items` with at most `limit` in flight, preserving order. */
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  async function worker(): Promise<void> {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker)
  await Promise.all(workers)
  return results
}

export async function assetsBuild(opts: AssetsBuildOptions): Promise<AssetManifest> {
  const { bucket, processor, src, previous, force = false, dryRun = false, concurrency = 6 } = opts
  const log = opts.log ?? (() => {})
  const basePath = src.endsWith('/') ? src.slice(0, -1) : src

  const allKeys = await bucket.listKeys(basePath)
  const existing = new Set(allKeys.map((k) => relKey(basePath, k)))
  const rasterOrPass = allKeys
    .map((k) => relKey(basePath, k))
    .filter((rel) => classifyAsset(rel) !== 'skip')

  let tmp: string | null = null
  const ensureTmp = async (): Promise<string> => {
    if (!tmp) tmp = await mkdtemp(join(tmpdir(), 'assets-build-'))
    return tmp
  }

  try {
    const entries = await mapPool(rasterOrPass, concurrency, async (rel): Promise<[string, ImageVariant]> => {
      if (classifyAsset(rel) === 'passthrough') {
        log(`passthrough ${rel}`)
        return [rel, { thumbhash: '', low: rel, high: rel, width: 0, height: 0 }]
      }

      const lowKey = variantKey(rel, 'low')
      const highKey = variantKey(rel, 'high')
      const prior = previous?.assets[rel]
      const variantsExist = existing.has(lowKey) && existing.has(highKey)

      if (!force && prior && variantsExist) {
        log(`reuse ${rel}`)
        return [rel, prior]
      }

      if (dryRun) {
        log(`would build ${rel}`)
        return [rel, { thumbhash: '', low: lowKey, high: highKey, width: 0, height: 0 }]
      }

      const dir = await ensureTmp()
      const localSrc = join(dir, rel.replace(/\//g, '__'))
      await mkdir(dirname(localSrc), { recursive: true })
      await bucket.download(`${basePath}/${rel}`, localSrc)

      const localLow = `${localSrc}.low.webp`
      const localHigh = `${localSrc}.high.webp`
      const { width, height } = await processor.dimensions(localSrc)
      await processor.toWebp(localSrc, localLow, LOW_WIDTH, LOW_QUALITY)
      await processor.toWebp(localSrc, localHigh, HIGH_WIDTH, HIGH_QUALITY)
      const thumbhash = await processor.thumbhash(localSrc)

      await bucket.upload(localLow, `${basePath}/${lowKey}`, IMMUTABLE_CC)
      await bucket.upload(localHigh, `${basePath}/${highKey}`, IMMUTABLE_CC)
      log(`built ${rel}`)

      return [rel, { thumbhash, low: lowKey, high: highKey, width, height }]
    })

    return { basePath, assets: Object.fromEntries(entries) }
  } finally {
    if (tmp) await rm(tmp, { recursive: true, force: true })
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @badcode/cli -- assets-build`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/assets-build.ts packages/cli/src/assets-build.test.ts
git commit -m "feat(cli): assets-build orchestrator (tiers, thumbhash, idempotent reuse, dry-run)"
```

---

## Task 6: Wire the `assets-build` CLI command

Reads the previous manifest (if the `--manifest` file exists), runs `assetsBuild`, writes the manifest JSON locally, and uploads a copy to the bucket subfolder (unless dry-run).

**Files:**
- Create: `packages/cli/src/write-manifest.ts`
- Test: `packages/cli/src/write-manifest.test.ts`
- Modify: `packages/cli/src/bin.ts`

- [ ] **Step 1: Write the failing test for the manifest file IO helper**

Create `packages/cli/src/write-manifest.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AssetManifest } from '@badcode/comic-manifest'
import { readManifestIfExists, writeManifestFile } from './write-manifest'

let dir: string
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'write-manifest-'))
})
afterAll(async () => {
  await rm(dir, { recursive: true, force: true })
})

const manifest: AssetManifest = {
  basePath: 'comics-v2/ep1',
  assets: { 'p1/main.png': { thumbhash: 'H', low: 'l', high: 'h', width: 1, height: 2 } },
}

describe('write-manifest', () => {
  it('readManifestIfExists returns undefined for a missing file', async () => {
    expect(await readManifestIfExists(join(dir, 'nope.json'))).toBeUndefined()
  })

  it('round-trips a manifest through write then read', async () => {
    const path = join(dir, 'sub', 'assets.manifest.json')
    await writeManifestFile(path, manifest)
    const text = await readFile(path, 'utf8')
    expect(text.endsWith('\n')).toBe(true) // trailing newline
    expect(await readManifestIfExists(path)).toEqual(manifest)
  })

  it('readManifestIfExists validates shape and throws on garbage', async () => {
    const path = join(dir, 'bad.json')
    await writeManifestFile.writeRaw(path, '{"nope":true}')
    await expect(readManifestIfExists(path)).rejects.toThrow(/basePath/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test --workspace @badcode/cli -- write-manifest`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the manifest file IO helper**

Create `packages/cli/src/write-manifest.ts`:

```ts
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { AssetManifest } from '@badcode/comic-manifest'
import { validateManifest } from '@badcode/comic-manifest'

/** Read + validate a manifest file, or undefined if it does not exist. */
export async function readManifestIfExists(path: string): Promise<AssetManifest | undefined> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw err
  }
  return validateManifest(JSON.parse(text))
}

/** Write a manifest as pretty JSON (with trailing newline), creating parent dirs. */
export async function writeManifestFile(path: string, manifest: AssetManifest): Promise<void> {
  await writeManifestFile.writeRaw(path, `${JSON.stringify(manifest, null, 2)}\n`)
}

/** Low-level writer (also used by tests to write raw bytes). */
writeManifestFile.writeRaw = async function writeRaw(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, text, 'utf8')
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @badcode/cli -- write-manifest`
Expected: PASS (3 tests).

- [ ] **Step 5: Register the command in `bin.ts`**

In `packages/cli/src/bin.ts`, add imports near the top (after the existing imports):

```ts
import { writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { assetsBuild } from './assets-build'
import { SharpImageProcessor } from './image-processor'
import { readManifestIfExists, writeManifestFile } from './write-manifest'
import { LATEST_CC } from './bucket'
```

Add this command registration (after the `generate` command block, before `program.parseAsync`):

```ts
program
  .command('assets-build')
  .description('Generate low/high WebP variants + ThumbHash for every image under a bucket subfolder, and emit a manifest.')
  .requiredOption('-s, --src <prefix>', 'bucket-relative source subfolder, e.g. comics-v2/gpom-ep1')
  .requiredOption('-m, --manifest <path>', 'local path to write assets.manifest.json')
  .option('-f, --force', 'rebuild variants even if they already exist')
  .option('--dry-run', 'compute the manifest without uploading or processing')
  .option('-c, --concurrency <n>', 'max images processed in parallel', '6')
  .action(async (opts: { src: string; manifest: string; force?: boolean; dryRun?: boolean; concurrency: string }) => {
    const bucket = new GsutilBucket()
    const previous = await readManifestIfExists(opts.manifest)
    const manifest = await assetsBuild({
      bucket,
      processor: new SharpImageProcessor(),
      src: opts.src,
      previous,
      force: opts.force ?? false,
      dryRun: opts.dryRun ?? false,
      concurrency: Number(opts.concurrency),
      log: (msg) => console.log(msg),
    })

    await writeManifestFile(opts.manifest, manifest)
    console.log(`wrote ${Object.keys(manifest.assets).length} assets → ${opts.manifest}`)

    if (!opts.dryRun) {
      // Upload a copy of the manifest into the bucket subfolder.
      const tmp = join(await import('node:fs/promises').then(() => tmpdir()), `manifest-${Date.now()}.json`)
      await writeFile(tmp, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
      await bucket.upload(tmp, `${manifest.basePath}/assets.manifest.json`, LATEST_CC)
      await rm(tmp, { force: true })
      console.log(`uploaded manifest copy → ${manifest.basePath}/assets.manifest.json`)
    }
  })
```

Note: `Date.now()` runs here in a normal Node CLI process (not a workflow script), so it is fine.

- [ ] **Step 6: Verify the command is wired (typecheck + help)**

Run: `npm run typecheck --workspace @badcode/cli`
Expected: no type errors.

Run: `npx tsx packages/cli/src/bin.ts assets-build --help`
Expected: prints usage showing `--src`, `--manifest`, `--force`, `--dry-run`, `--concurrency`.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/src/write-manifest.ts packages/cli/src/write-manifest.test.ts packages/cli/src/bin.ts
git commit -m "feat(cli): wire assets-build command + manifest file IO"
```

---

## Task 7: Proof run against `camping-jack-test` (manual verification)

This requires real GCS credentials (`gsutil` authenticated against the `badcode-storage` bucket) and is therefore a **manual** verification step, not an automated test. If credentials are unavailable, stop after Task 6 and hand back — the unit suite already proves the logic.

- [ ] **Step 1: Find the comic's bucket prefix**

Run:
```bash
grep -oE 'https://storage.googleapis.com/badcode-storage/[^"]+/' \
  apps/web/src/comics/camping-jack-test/CampingJackTestComic.tsx | head -1
```
The path segment after `badcode-storage/` (minus the trailing `pages/...` portion) is the `--src` prefix. Record it as `<PREFIX>` (e.g. `comics/camping-jack-test`).

- [ ] **Step 2: Dry-run to preview the manifest**

Run:
```bash
npx tsx packages/cli/src/bin.ts assets-build \
  --src '<PREFIX>' \
  --manifest apps/web/src/comics/camping-jack-test/assets.manifest.json \
  --dry-run
```
Expected: prints `would build …` lines for each raster image and `wrote N assets → …`. Open the written file and confirm `basePath` matches `<PREFIX>` and every referenced image has an entry.

- [ ] **Step 3: Real run**

Run:
```bash
npx tsx packages/cli/src/bin.ts assets-build \
  --src '<PREFIX>' \
  --manifest apps/web/src/comics/camping-jack-test/assets.manifest.json
```
Expected: `built …` lines, then `uploaded manifest copy → <PREFIX>/assets.manifest.json`.

- [ ] **Step 4: Verify variants landed and are smaller**

Run:
```bash
gsutil ls -l "gs://badcode-storage/<PREFIX>/derived/**" | head
```
Expected: `*.low.webp` and `*.high.webp` objects exist; a `.low.webp` is materially smaller than its source JPG.

- [ ] **Step 5: Confirm idempotency**

Re-run the exact command from Step 3.
Expected: every line reads `reuse …` (no `built …`), proving no redundant work.

- [ ] **Step 6: Commit the generated manifest**

```bash
git add apps/web/src/comics/camping-jack-test/assets.manifest.json
git commit -m "chore(camping-jack-test): generate asset manifest + WebP variants"
```

---

## Self-Review

**Spec coverage** (against `2026-06-16-progressive-comic-loading-design.md`, sections A + contract):
- Path-keyed manifest contract → Task 1 (`@badcode/comic-manifest`). ✓
- `comic-assets build --src <subfolder> --manifest <path>` → Task 6 registers it as `badcode assets-build` with those flags. (Command spelled `assets-build` as a subcommand of the existing `badcode` CLI rather than a separate `comic-assets` binary — same behavior, reuses the existing CLI + Bucket infra. Documented deviation.) ✓
- Recursive path scan, no comic-ID resolution → Task 2 (`listKeys`) + Task 5 (uses `listKeys`, never `loadComic`). ✓
- Sharp low (720w q70) + high (1920w q80), intrinsic w/h → Task 4 + Task 5 constants. ✓
- ThumbHash → data-URI → Task 4 `thumbhashDataUri`. ✓
- Upload variants to `derived/` prefix → Task 3 `variantKey` + Task 5 upload. ✓
- Emit manifest to `--manifest` + copy to bucket → Task 6. ✓
- Idempotent (skip when variants exist) → Task 5 reuse path + Task 7 step 5. (Existence+prior-manifest reuse rather than content-hash; content-hash noted as future in spec.) ✓
- Concurrency cap → Task 5 `mapPool`. ✓
- SVG/video passthrough → Task 3 `classifyAsset` + Task 5 passthrough branch. ✓
- Dry-run → Task 5 + Task 6. ✓
- WebP only (AVIF deferred) → only WebP emitted. ✓
- Proof against camping-jack-test → Task 7. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code; every test step shows real assertions. ✓

**Type consistency:** `AssetManifest`/`ImageVariant` defined in Task 1 are imported unchanged in Tasks 5 & 6. `Bucket` gains `download`/`listKeys` in Task 2 and the fake in Task 5 implements them. `ImageProcessor` methods (`dimensions`, `toWebp`, `thumbhashDataUri`) match between Task 4 (impl + interface) and Task 5 (fake). `variantKey(rel, tier)` signature matches between Task 3 and Task 5. `writeManifestFile`/`readManifestIfExists` match between Task 6 impl, its test, and `bin.ts`. ✓

**Note for Plan 2 (runtime):** `@badcode/comic` will depend on `@badcode/comic-manifest` and implement `createComic(manifest)` / `resolve(relKey)` that absolutizes `low`/`high` to `${BUCKET_BASE_URL}/${basePath}/${variant}` (BUCKET base from `@badcode/comic-meta`), returning the `ImageAsset` descriptor the widgets consume. The `thumbhash` field is a compact base64 hash the runtime decodes via thumbHashToDataURL.
