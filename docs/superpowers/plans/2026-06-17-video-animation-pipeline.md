# Video Animation Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the shipped `badcode assets-build` pipeline so that, alongside the existing static-image WebP tiers, it detects **animation folders**, transcodes each into a **480/720/1080 H.264 rendition ladder** (+ poster + ThumbHash) with **ffmpeg**, and emits them as an `animations` map in the manifest.

**Architecture:** This is **Plan A of 2** (pipeline first; the runtime `AnimationWidget` is Plan B). It builds on the shipped pipeline in `packages/cli` and the `@badcode/comic-manifest` contract. New work sits behind injectable interfaces (a `VideoProcessor` wrapping ffmpeg/ffprobe via an injectable runner, mirroring the existing `GsutilRunner` and `ImageProcessor` patterns) so every unit is tested with fakes. The animation source is the folder's `video.mp4` when present, otherwise the numbered frames are re-encoded into a video.

**Tech Stack:** TypeScript (ESM, `verbatimModuleSyntax`), Node ≥22, `commander`, `sharp`+`thumbhash` (stills, shipped), **`ffmpeg`/`ffprobe`** (system binaries, video), `gsutil` (via `GsutilBucket`), `vitest`.

## Global Constraints

- ESM with `verbatimModuleSyntax` ON → type-only imports use `import type`.
- `noUnusedLocals` / `noUnusedParameters` ON → no stray imports/params.
- Tests are colocated `*.test.ts`, run with `npm test --workspace @badcode/<pkg>`.
- External binaries are wrapped behind an **injectable runner** (never call `execFile` directly in logic) so unit tests assert arguments without touching the network/FS — the established `GsutilRunner` pattern in `packages/cli/src/bucket.ts`.
- Commits **auto-push** to origin. Work on branch `feat/comic-asset-pipeline` (currently == `main`). Use **explicit paths** in every `git add` (the working tree may hold unrelated untracked files); verify each commit with `git show --stat HEAD`.
- Rendition ladder: `[480, 720, 1080]`. Encode settings (spike-proven): `-c:v libx264 -g 12 -keyint_min 12 -bf 0 -crf 26 -pix_fmt yuv420p -an`. **No upscaling past source** beyond a 10% tolerance.
- Manifest paths are **basePath-relative** (the runtime absolutizes them); derived outputs live under a `derived/` prefix.

---

## File structure

**`packages/comic-manifest/src/index.ts`** *(modify)* — add `Rendition` + `VideoAsset` types, an optional `animations` map on `AssetManifest`, and validation for them.

**`packages/cli/src/`:**
- `animation-paths.ts` *(new)* — pure helpers: frame-filename parsing, `groupAssets` (split keys into animation folders vs static images), `renditionKey`/`posterKey`, `rungsFor`. No I/O.
- `animation-paths.test.ts` *(new)*
- `video-processor.ts` *(new)* — `VideoProcessor` interface + `FfmpegVideoProcessor` (injectable `FfRunner`).
- `video-processor.test.ts` *(new)*
- `build-animation.ts` *(new)* — `buildAnimation(folder, deps)`: normalize a source video, encode the ladder, poster + ThumbHash, upload, return a `VideoAsset`. Injected deps; no globals.
- `build-animation.test.ts` *(new)*
- `assets-build.ts` *(modify)* — group assets, run the existing static path over static images + the new `buildAnimation` over animation folders, return `{ basePath, assets, animations }`.
- `assets-build.test.ts` *(modify)* — add a `fakeVideo()` to existing calls (no animations → never invoked) + new animation cases.
- `bin.ts` *(modify)* — construct `new FfmpegVideoProcessor()` and pass it into `assetsBuild`.

---

## Task 1: Manifest contract — `VideoAsset` + `animations` map

**Files:**
- Modify: `packages/comic-manifest/src/index.ts`
- Test: `packages/comic-manifest/src/index.test.ts`

**Interfaces:**
- Produces: `interface Rendition { height: number; width: number; proxy: string }`; `interface VideoAsset { thumbhash: string; poster: string; renditions: Rendition[]; width: number; height: number; frameCount: number; fps: number }`; `AssetManifest` gains `animations?: Record<string, VideoAsset>`. `validateManifest` validates `animations` when present.

- [ ] **Step 1: Write the failing tests**

Add to `packages/comic-manifest/src/index.test.ts` (keep the existing tests; add imports as needed):

```ts
import type { VideoAsset } from './index'

const withAnim = {
  basePath: 'comics-v2/ep1',
  assets: {},
  animations: {
    'p7/anim/x': {
      thumbhash: 'HASH', poster: 'derived/p7/anim/x.poster.webp',
      renditions: [{ height: 480, width: 854, proxy: 'derived/p7/anim/x.480.mp4' }],
      width: 1920, height: 1080, frameCount: 242, fps: 24,
    } satisfies VideoAsset,
  },
}

describe('validateManifest — animations', () => {
  it('accepts a manifest with a valid animations map', () => {
    expect(validateManifest(withAnim)).toEqual(withAnim)
  })

  it('accepts a manifest with no animations key (optional)', () => {
    expect(validateManifest({ basePath: 'x', assets: {} })).toEqual({ basePath: 'x', assets: {} })
  })

  it('throws when an animation rendition is missing a numeric height', () => {
    const bad = { basePath: 'x', assets: {}, animations: { a: {
      thumbhash: 'H', poster: 'p', renditions: [{ width: 854, proxy: 'q' }],
      width: 1, height: 2, frameCount: 3, fps: 4 } } }
    expect(() => validateManifest(bad)).toThrow(/height/)
  })

  it('throws when an animation is missing frameCount', () => {
    const bad = { basePath: 'x', assets: {}, animations: { a: {
      thumbhash: 'H', poster: 'p', renditions: [], width: 1, height: 2, fps: 4 } } }
    expect(() => validateManifest(bad)).toThrow(/frameCount/)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test --workspace @badcode/comic-manifest`
Expected: FAIL — `VideoAsset` not exported / `animations` not validated.

- [ ] **Step 3: Implement the types + validation**

In `packages/comic-manifest/src/index.ts`, add after the `ImageVariant` interface:

```ts
/** One encoded video rendition of an animation. Paths are basePath-relative. */
export interface Rendition {
  /** Encoded height in px (a rung of the 480/720/1080 ladder). */
  height: number
  /** Encoded width in px (aspect-correct, even). */
  width: number
  /** basePath-relative key of the H.264 MP4 proxy. */
  proxy: string
}

/** One animation: a video scrubbed by the runtime. Replaces N per-frame entries. */
export interface VideoAsset {
  /** Compact base64 ThumbHash of the poster (decoded client-side). */
  thumbhash: string
  /** basePath-relative key of the WebP poster (first frame). */
  poster: string
  /** Renditions sorted ascending by height; only rungs ≤ source height (+tolerance). */
  renditions: Rendition[]
  /** Source pixel dimensions (defines aspect ratio). */
  width: number
  height: number
  /** Total frame count and frames-per-second of the source. */
  frameCount: number
  fps: number
}
```

Change the `AssetManifest` interface to add the optional map:

```ts
export interface AssetManifest {
  /** Bucket-relative subfolder the assets live under, no trailing slash. */
  basePath: string
  /** Map of basePath-relative source key → its image variants. */
  assets: Record<string, ImageVariant>
  /** Map of basePath-relative animation-folder key → its video asset. */
  animations?: Record<string, VideoAsset>
}
```

In `validateManifest`, after the `for...assets` loop and before `return`, add:

```ts
  if (m.animations !== undefined) {
    if (typeof m.animations !== 'object' || m.animations === null) fail('animations must be an object')
    for (const [key, raw] of Object.entries(m.animations as Record<string, unknown>)) {
      if (typeof raw !== 'object' || raw === null) fail(`animation "${key}" is not an object`)
      const a = raw as Record<string, unknown>
      if (typeof a.thumbhash !== 'string') fail(`animation "${key}" thumbhash must be a string`)
      if (typeof a.poster !== 'string') fail(`animation "${key}" poster must be a string`)
      if (!Array.isArray(a.renditions)) fail(`animation "${key}" renditions must be an array`)
      for (const r of a.renditions as unknown[]) {
        if (typeof r !== 'object' || r === null) fail(`animation "${key}" has a non-object rendition`)
        const rr = r as Record<string, unknown>
        if (typeof rr.height !== 'number') fail(`animation "${key}" rendition height must be a number`)
        if (typeof rr.width !== 'number') fail(`animation "${key}" rendition width must be a number`)
        if (typeof rr.proxy !== 'string') fail(`animation "${key}" rendition proxy must be a string`)
      }
      if (typeof a.width !== 'number') fail(`animation "${key}" width must be a number`)
      if (typeof a.height !== 'number') fail(`animation "${key}" height must be a number`)
      if (typeof a.frameCount !== 'number') fail(`animation "${key}" frameCount must be a number`)
      if (typeof a.fps !== 'number') fail(`animation "${key}" fps must be a number`)
    }
  }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test --workspace @badcode/comic-manifest`
Expected: PASS (the 3 original + 4 new).

- [ ] **Step 5: Commit**

```bash
git add packages/comic-manifest/src/index.ts packages/comic-manifest/src/index.test.ts
git commit -m "feat(comic-manifest): add VideoAsset + animations map to the contract"
```

---

## Task 2: Pure animation-path helpers

**Files:**
- Create: `packages/cli/src/animation-paths.ts`
- Test: `packages/cli/src/animation-paths.test.ts`

**Interfaces:**
- Consumes: `classifyAsset` from `./asset-paths` (existing).
- Produces:
  - `interface AnimationFolder { folder: string; sourceVideo: string | null; frames: string[] }`
  - `interface Grouped { animations: AnimationFolder[]; staticImages: string[] }`
  - `groupAssets(relKeys: string[]): Grouped`
  - `renditionKey(folder: string, height: number): string` → `derived/<folder>.<height>.mp4`
  - `posterKey(folder: string): string` → `derived/<folder>.poster.webp`
  - `rungsFor(sourceHeight: number): number[]`
  - `export const LADDER = [480, 720, 1080]`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/animation-paths.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { groupAssets, renditionKey, posterKey, rungsFor } from './animation-paths'

describe('groupAssets', () => {
  it('detects an animation folder by a video.mp4 and excludes its files from statics', () => {
    const g = groupAssets(['pages/p1/anim/x/video.mp4', 'pages/p1/anim/x/frame_000.jpg', 'pages/p2/main.png'])
    expect(g.animations).toEqual([
      { folder: 'pages/p1/anim/x', sourceVideo: 'pages/p1/anim/x/video.mp4', frames: ['pages/p1/anim/x/frame_000.jpg'] },
    ])
    expect(g.staticImages).toEqual(['pages/p2/main.png'])
  })

  it('detects a frames-only animation (≥2 numbered frames, no video)', () => {
    const g = groupAssets(['a/anim/frame_000.jpg', 'a/anim/frame_001.jpg', 'a/anim/frame_002.jpg'])
    expect(g.animations).toEqual([
      { folder: 'a/anim', sourceVideo: null, frames: ['a/anim/frame_000.jpg', 'a/anim/frame_001.jpg', 'a/anim/frame_002.jpg'] },
    ])
    expect(g.staticImages).toEqual([])
  })

  it('sorts frames numerically (not lexically)', () => {
    const g = groupAssets(['a/frame_2.jpg', 'a/frame_10.jpg', 'a/frame_1.jpg'])
    expect(g.animations[0].frames).toEqual(['a/frame_1.jpg', 'a/frame_2.jpg', 'a/frame_10.jpg'])
  })

  it('treats a lone single frame as a static image, not an animation', () => {
    const g = groupAssets(['a/frame_000.jpg'])
    expect(g.animations).toEqual([])
    expect(g.staticImages).toEqual(['a/frame_000.jpg'])
  })

  it('ignores derived outputs and keeps svg as a static image', () => {
    const g = groupAssets(['derived/x.low.webp', 'p/bg.svg'])
    expect(g.animations).toEqual([])
    expect(g.staticImages).toEqual(['p/bg.svg'])
  })
})

describe('renditionKey / posterKey', () => {
  it('builds derived keys for a folder', () => {
    expect(renditionKey('pages/p1/anim/x', 720)).toBe('derived/pages/p1/anim/x.720.mp4')
    expect(posterKey('pages/p1/anim/x')).toBe('derived/pages/p1/anim/x.poster.webp')
  })
})

describe('rungsFor', () => {
  it('includes ladder rungs at or below source height', () => {
    expect(rungsFor(1080)).toEqual([480, 720, 1080])
    expect(rungsFor(720)).toEqual([480, 720])
  })
  it('allows a 10% tolerance so a near-1080 source still gets the 1080 rung', () => {
    expect(rungsFor(1072)).toEqual([480, 720, 1080])
  })
  it('falls back to a single source-height rung when below the smallest rung', () => {
    expect(rungsFor(360)).toEqual([360])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test --workspace @badcode/cli -- animation-paths`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helpers**

Create `packages/cli/src/animation-paths.ts`:

```ts
import { classifyAsset } from './asset-paths'

export const LADDER = [480, 720, 1080]

/** A folder treated as a single scroll-scrubbed animation. */
export interface AnimationFolder {
  /** basePath-relative folder key (the manifest key). */
  folder: string
  /** basePath-relative key of a source video.mp4, or null (frames-only). */
  sourceVideo: string | null
  /** basePath-relative frame keys, sorted by frame number. */
  frames: string[]
}

export interface Grouped {
  animations: AnimationFolder[]
  staticImages: string[]
}

const FRAME_RE = /(?:^|\/)frame_(\d+)\.(?:jpe?g|png|webp)$/i

function dirOf(rel: string): string {
  const i = rel.lastIndexOf('/')
  return i >= 0 ? rel.slice(0, i) : ''
}
function baseOf(rel: string): string {
  const i = rel.lastIndexOf('/')
  return i >= 0 ? rel.slice(i + 1) : rel
}
function frameNum(rel: string): number | null {
  const m = rel.match(FRAME_RE)
  return m ? Number(m[1]) : null
}

/** Split keys into animation folders vs static images. `skip` keys are dropped. */
export function groupAssets(relKeys: string[]): Grouped {
  const considered = relKeys.filter((k) => classifyAsset(k) !== 'skip')
  const byDir = new Map<string, string[]>()
  for (const k of considered) {
    const d = dirOf(k)
    const list = byDir.get(d)
    if (list) list.push(k)
    else byDir.set(d, [k])
  }

  const animations: AnimationFolder[] = []
  const staticImages: string[] = []
  for (const [dir, keys] of byDir) {
    const sourceVideo = keys.find((k) => baseOf(k) === 'video.mp4') ?? null
    const frames = keys
      .filter((k) => frameNum(k) !== null)
      .sort((a, b) => (frameNum(a) as number) - (frameNum(b) as number))
    const isAnimation = sourceVideo !== null || frames.length >= 2
    if (isAnimation) {
      animations.push({ folder: dir, sourceVideo, frames })
    } else {
      for (const k of keys) staticImages.push(k)
    }
  }
  return { animations, staticImages }
}

/** basePath-relative key for a rendition MP4, e.g. derived/<folder>.720.mp4 */
export function renditionKey(folder: string, height: number): string {
  return `derived/${folder}.${height}.mp4`
}

/** basePath-relative key for the WebP poster, e.g. derived/<folder>.poster.webp */
export function posterKey(folder: string): string {
  return `derived/${folder}.poster.webp`
}

/** Ladder rungs to encode for a source of the given height (no real upscaling; 10% tolerance). */
export function rungsFor(sourceHeight: number): number[] {
  const rungs = LADDER.filter((h) => h <= sourceHeight * 1.1)
  return rungs.length > 0 ? rungs : [sourceHeight]
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @badcode/cli -- animation-paths`
Expected: PASS. Also `npm run typecheck --workspace @badcode/cli` clean.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/animation-paths.ts packages/cli/src/animation-paths.test.ts
git commit -m "feat(cli): pure helpers to group animation folders + derive video keys"
```

---

## Task 3: `VideoProcessor` interface + `FfmpegVideoProcessor`

Wraps ffmpeg/ffprobe behind an injectable runner (the `GsutilRunner` pattern). Unit-tested with canned ffprobe output + argument assertions — no real ffmpeg needed.

**Files:**
- Create: `packages/cli/src/video-processor.ts`
- Test: `packages/cli/src/video-processor.test.ts`

**Interfaces:**
- Produces:
  - `interface VideoMeta { width: number; height: number; frameCount: number; fps: number }`
  - `type FfRunner = (bin: 'ffmpeg' | 'ffprobe', args: string[]) => Promise<string>`
  - `interface VideoProcessor { probe(input): Promise<VideoMeta>; encode(input, output, height): Promise<void>; extractPoster(input, outputPng): Promise<void>; framesToVideo(framePattern, fps, output): Promise<void> }`
  - `class FfmpegVideoProcessor implements VideoProcessor` (ctor takes an optional `FfRunner`).

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/video-processor.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { FfmpegVideoProcessor } from './video-processor'

const PROBE_JSON = JSON.stringify({
  streams: [{ width: 1920, height: 1080, r_frame_rate: '24/1', nb_frames: '242' }],
  format: { duration: '10.083' },
})

describe('FfmpegVideoProcessor.probe', () => {
  it('parses ffprobe JSON into VideoMeta', async () => {
    const run = vi.fn(async () => PROBE_JSON)
    const p = new FfmpegVideoProcessor(run)
    expect(await p.probe('/t/src.mp4')).toEqual({ width: 1920, height: 1080, frameCount: 242, fps: 24 })
    expect(run).toHaveBeenCalledWith('ffprobe', expect.arrayContaining(['-of', 'json', '/t/src.mp4']))
  })

  it('falls back to duration*fps when nb_frames is N/A', async () => {
    const run = vi.fn(async () => JSON.stringify({
      streams: [{ width: 640, height: 480, r_frame_rate: '30/1', nb_frames: 'N/A' }],
      format: { duration: '2.0' },
    }))
    const p = new FfmpegVideoProcessor(run)
    expect(await p.probe('/t/x.mp4')).toEqual({ width: 640, height: 480, frameCount: 60, fps: 30 })
  })
})

describe('FfmpegVideoProcessor.encode', () => {
  it('runs ffmpeg with the spike-proven settings, scaled to height', async () => {
    const run = vi.fn(async () => '')
    const p = new FfmpegVideoProcessor(run)
    await p.encode('/t/src.mp4', '/t/out.720.mp4', 720)
    const [bin, args] = run.mock.calls[0]
    expect(bin).toBe('ffmpeg')
    expect(args).toEqual(expect.arrayContaining(['-i', '/t/src.mp4', '-vf', 'scale=-2:720',
      '-c:v', 'libx264', '-g', '12', '-keyint_min', '12', '-bf', '0', '-crf', '26', '-an', '/t/out.720.mp4']))
  })
})

describe('FfmpegVideoProcessor.extractPoster', () => {
  it('extracts a single frame to the output path', async () => {
    const run = vi.fn(async () => '')
    const p = new FfmpegVideoProcessor(run)
    await p.extractPoster('/t/src.mp4', '/t/poster.png')
    const [bin, args] = run.mock.calls[0]
    expect(bin).toBe('ffmpeg')
    expect(args).toEqual(expect.arrayContaining(['-i', '/t/src.mp4', '-frames:v', '1', '/t/poster.png']))
  })
})

describe('FfmpegVideoProcessor.framesToVideo', () => {
  it('encodes a frame pattern into a video at the given fps', async () => {
    const run = vi.fn(async () => '')
    const p = new FfmpegVideoProcessor(run)
    await p.framesToVideo('/t/f/frame_%05d.jpg', 24, '/t/src.mp4')
    const [bin, args] = run.mock.calls[0]
    expect(bin).toBe('ffmpeg')
    expect(args).toEqual(expect.arrayContaining(['-framerate', '24', '-start_number', '1',
      '-i', '/t/f/frame_%05d.jpg', '-c:v', 'libx264', '/t/src.mp4']))
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test --workspace @badcode/cli -- video-processor`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the processor**

Create `packages/cli/src/video-processor.ts`:

```ts
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export interface VideoMeta {
  width: number
  height: number
  frameCount: number
  fps: number
}

/** Runs an ffmpeg/ffprobe invocation, returns stdout. Injectable for tests. */
export type FfRunner = (bin: 'ffmpeg' | 'ffprobe', args: string[]) => Promise<string>

export interface VideoProcessor {
  /** Read source width/height/frameCount/fps. */
  probe(input: string): Promise<VideoMeta>
  /** Encode `input` to an H.264 MP4 scaled to `height` (gop12, no B-frames). */
  encode(input: string, output: string, height: number): Promise<void>
  /** Extract the first frame of `input` to `outputPng`. */
  extractPoster(input: string, outputPng: string): Promise<void>
  /** Encode a numbered frame pattern (1-based) into a near-lossless source video. */
  framesToVideo(framePattern: string, fps: number, output: string): Promise<void>
}

const defaultRunner: FfRunner = async (bin, args) => {
  const { stdout } = await execFileAsync(bin, args)
  return stdout
}

const ENCODE_BASE = ['-c:v', 'libx264', '-g', '12', '-keyint_min', '12', '-bf', '0', '-pix_fmt', 'yuv420p', '-an']

export class FfmpegVideoProcessor implements VideoProcessor {
  constructor(private readonly run: FfRunner = defaultRunner) {}

  async probe(input: string): Promise<VideoMeta> {
    const out = await this.run('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,r_frame_rate,nb_frames:format=duration',
      '-of', 'json', input,
    ])
    const json = JSON.parse(out) as {
      streams?: { width?: number; height?: number; r_frame_rate?: string; nb_frames?: string }[]
      format?: { duration?: string }
    }
    const s = json.streams?.[0] ?? {}
    const [num, den] = (s.r_frame_rate ?? '0/1').split('/').map(Number)
    const fps = den ? num / den : 0
    const nb = Number(s.nb_frames)
    const duration = Number(json.format?.duration)
    const frameCount = Number.isFinite(nb) && nb > 0 ? nb : Math.round(duration * fps)
    return { width: s.width ?? 0, height: s.height ?? 0, frameCount, fps }
  }

  async encode(input: string, output: string, height: number): Promise<void> {
    await this.run('ffmpeg', ['-y', '-loglevel', 'error', '-i', input,
      '-vf', `scale=-2:${height}`, ...ENCODE_BASE, '-crf', '26', output])
  }

  async extractPoster(input: string, outputPng: string): Promise<void> {
    await this.run('ffmpeg', ['-y', '-loglevel', 'error', '-i', input, '-frames:v', '1', outputPng])
  }

  async framesToVideo(framePattern: string, fps: number, output: string): Promise<void> {
    await this.run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-start_number', '1',
      '-i', framePattern, ...ENCODE_BASE, '-crf', '12', output])
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @badcode/cli -- video-processor`
Expected: PASS (5 tests). `npm run typecheck --workspace @badcode/cli` clean.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/video-processor.ts packages/cli/src/video-processor.test.ts
git commit -m "feat(cli): FfmpegVideoProcessor (probe/encode/poster/framesToVideo)"
```

---

## Task 4: `buildAnimation` — one folder → `VideoAsset`

Normalizes a local source video (download `video.mp4`, or download frames + `framesToVideo`), probes it, encodes the ladder, makes a poster + ThumbHash, uploads everything, returns a `VideoAsset`. Pure of globals — all deps injected.

**Files:**
- Create: `packages/cli/src/build-animation.ts`
- Test: `packages/cli/src/build-animation.test.ts`

**Interfaces:**
- Consumes: `Bucket` (`download`, `upload`, `IMMUTABLE_CC`) from `./bucket`; `ImageProcessor` (`toWebp`, `thumbhash`) from `./image-processor`; `VideoProcessor` from `./video-processor`; `AnimationFolder`, `renditionKey`, `posterKey`, `rungsFor` from `./animation-paths`; `VideoAsset` from `@badcode/comic-manifest`.
- Produces:
  - `interface AnimationDeps { basePath: string; bucket: Bucket; image: ImageProcessor; video: VideoProcessor; tmpDir: string; index: number; log: (m: string) => void }`
  - `async function buildAnimation(anim: AnimationFolder, deps: AnimationDeps): Promise<VideoAsset>`

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/build-animation.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { VideoProcessor } from './video-processor'
import type { AnimationFolder } from './animation-paths'
import { buildAnimation } from './build-animation'

function fakeBucket(): Bucket {
  return {
    list: vi.fn(async () => []), copy: vi.fn(async () => {}), upload: vi.fn(async () => {}),
    download: vi.fn(async () => {}), listKeys: vi.fn(async () => []),
  } as Bucket
}
function fakeImage(): ImageProcessor {
  return {
    dimensions: vi.fn(async () => ({ width: 0, height: 0 })),
    toWebp: vi.fn(async () => {}),
    thumbhash: vi.fn(async () => 'POSTERHASH'),
  }
}
function fakeVideo(meta = { width: 1920, height: 1080, frameCount: 242, fps: 24 }): VideoProcessor {
  return {
    probe: vi.fn(async () => meta),
    encode: vi.fn(async () => {}),
    extractPoster: vi.fn(async () => {}),
    framesToVideo: vi.fn(async () => {}),
  }
}
const deps = (over: Partial<{ bucket: Bucket; image: ImageProcessor; video: VideoProcessor }> = {}) => ({
  basePath: 'comics-v2/ep1', tmpDir: '/tmp/x', index: 0, log: () => {},
  bucket: over.bucket ?? fakeBucket(), image: over.image ?? fakeImage(), video: over.video ?? fakeVideo(),
})

describe('buildAnimation — source video present', () => {
  it('downloads the video, encodes the ladder, posters, and returns a VideoAsset', async () => {
    const bucket = fakeBucket(); const video = fakeVideo(); const image = fakeImage()
    const anim: AnimationFolder = { folder: 'p7/anim/x', sourceVideo: 'p7/anim/x/video.mp4', frames: [] }
    const asset = await buildAnimation(anim, deps({ bucket, video, image }))

    expect(bucket.download).toHaveBeenCalledWith('comics-v2/ep1/p7/anim/x/video.mp4', expect.any(String))
    expect(video.framesToVideo).not.toHaveBeenCalled()
    // 1080 source → three rungs
    expect((video.encode as any).mock.calls.map((c: any[]) => c[2])).toEqual([480, 720, 1080])
    expect(asset.renditions.map((r) => r.height)).toEqual([480, 720, 1080])
    expect(asset.renditions[0]).toEqual({ height: 480, width: 854, proxy: 'derived/p7/anim/x.480.mp4' })
    expect(asset.poster).toBe('derived/p7/anim/x.poster.webp')
    expect(asset.thumbhash).toBe('POSTERHASH')
    expect(asset).toMatchObject({ width: 1920, height: 1080, frameCount: 242, fps: 24 })
    // uploads: 3 renditions + 1 poster
    expect((bucket.upload as any).mock.calls.length).toBe(4)
  })
})

describe('buildAnimation — frames only', () => {
  it('downloads frames, re-encodes to a source video, and uses frames.length as frameCount', async () => {
    const bucket = fakeBucket()
    const video = fakeVideo({ width: 1280, height: 720, frameCount: 0, fps: 24 })
    const anim: AnimationFolder = {
      folder: 'a/anim', sourceVideo: null,
      frames: ['a/anim/frame_0.jpg', 'a/anim/frame_1.jpg', 'a/anim/frame_2.jpg'],
    }
    const asset = await buildAnimation(anim, deps({ bucket, video }))

    expect(video.framesToVideo).toHaveBeenCalledTimes(1)
    expect((bucket.download as any).mock.calls.length).toBe(3) // one per frame
    expect(asset.frameCount).toBe(3)                            // from frames.length, not probe
    expect(asset.renditions.map((r) => r.height)).toEqual([480, 720]) // 720 source → two rungs
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test --workspace @badcode/cli -- build-animation`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `buildAnimation`**

Create `packages/cli/src/build-animation.ts`:

```ts
import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import type { VideoAsset, Rendition } from '@badcode/comic-manifest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { VideoProcessor } from './video-processor'
import type { AnimationFolder } from './animation-paths'
import { IMMUTABLE_CC } from './bucket'
import { renditionKey, posterKey, rungsFor } from './animation-paths'

const FRAMES_FPS = 24
const POSTER_WIDTH = 1280
const POSTER_QUALITY = 80

export interface AnimationDeps {
  basePath: string
  bucket: Bucket
  image: ImageProcessor
  video: VideoProcessor
  /** Working directory (already created) for temp files. */
  tmpDir: string
  /** Unique index for collision-free temp filenames. */
  index: number
  log: (m: string) => void
}

/** Even, aspect-correct width for a target height. */
function widthFor(srcW: number, srcH: number, h: number): number {
  return Math.round((srcW * h) / srcH / 2) * 2
}

export async function buildAnimation(anim: AnimationFolder, deps: AnimationDeps): Promise<VideoAsset> {
  const { basePath, bucket, image, video, tmpDir, index, log } = deps
  const stem = join(tmpDir, `anim-${index}`)
  const localSource = `${stem}.source.mp4`
  const cleanup: string[] = [localSource]

  // 1. Normalize a local source video.
  let frameCount: number
  if (anim.sourceVideo) {
    await bucket.download(`${basePath}/${anim.sourceVideo}`, localSource)
    frameCount = (await video.probe(localSource)).frameCount
  } else {
    const framesDir = `${stem}.frames`
    await mkdir(framesDir, { recursive: true })
    cleanup.push(framesDir)
    for (let i = 0; i < anim.frames.length; i++) {
      const n = String(i + 1).padStart(5, '0')
      await bucket.download(`${basePath}/${anim.frames[i]}`, join(framesDir, `frame_${n}.jpg`))
    }
    await video.framesToVideo(join(framesDir, 'frame_%05d.jpg'), FRAMES_FPS, localSource)
    frameCount = anim.frames.length
  }

  const meta = await video.probe(localSource)

  // 2. Encode the rendition ladder.
  const renditions: Rendition[] = []
  for (const h of rungsFor(meta.height)) {
    const out = `${stem}.${h}.mp4`
    await video.encode(localSource, out, h)
    const key = renditionKey(anim.folder, h)
    await bucket.upload(out, `${basePath}/${key}`, IMMUTABLE_CC)
    await rm(out, { force: true })
    renditions.push({ height: h, width: widthFor(meta.width, meta.height, h), proxy: key })
  }

  // 3. Poster (WebP) + ThumbHash, from the first frame.
  const posterPng = `${stem}.poster.png`
  const posterWebp = `${stem}.poster.webp`
  cleanup.push(posterPng, posterWebp)
  await video.extractPoster(localSource, posterPng)
  await image.toWebp(posterPng, posterWebp, POSTER_WIDTH, POSTER_QUALITY)
  const thumbhash = await image.thumbhash(posterPng)
  const pKey = posterKey(anim.folder)
  await bucket.upload(posterWebp, `${basePath}/${pKey}`, IMMUTABLE_CC)

  for (const f of cleanup) await rm(f, { recursive: true, force: true })
  log(`built animation ${anim.folder} (${renditions.length} renditions, ${frameCount} frames)`)

  return { thumbhash, poster: pKey, renditions, width: meta.width, height: meta.height, frameCount, fps: meta.fps }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @badcode/cli -- build-animation`
Expected: PASS (2 tests). `npm run typecheck --workspace @badcode/cli` clean.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/build-animation.ts packages/cli/src/build-animation.test.ts
git commit -m "feat(cli): buildAnimation — one folder to a VideoAsset (ladder + poster)"
```

---

## Task 5: Orchestrator integration + CLI wiring

Wire grouping + `buildAnimation` into `assetsBuild`, return the `animations` map, and pass a real `FfmpegVideoProcessor` from `bin.ts`. The existing static-image path is unchanged.

**Files:**
- Modify: `packages/cli/src/assets-build.ts`
- Modify: `packages/cli/src/assets-build.test.ts`
- Modify: `packages/cli/src/bin.ts`

**Interfaces:**
- Consumes: `groupAssets` from `./animation-paths`; `buildAnimation` + `AnimationDeps` from `./build-animation`; `VideoProcessor`/`FfmpegVideoProcessor` from `./video-processor`.
- Produces: `AssetsBuildOptions` gains a required `video: VideoProcessor`; `assetsBuild` returns `{ basePath, assets, animations }` with `animations` always present (may be empty).

- [ ] **Step 1: Update the existing tests + add animation cases (write them first)**

In `packages/cli/src/assets-build.test.ts`:

First add a fake-video helper near the top (after `fakeProcessor`):

```ts
import type { VideoProcessor } from './video-processor'

function fakeVideo(): VideoProcessor {
  return {
    probe: vi.fn(async () => ({ width: 1920, height: 1080, frameCount: 242, fps: 24 })),
    encode: vi.fn(async () => {}),
    extractPoster: vi.fn(async () => {}),
    framesToVideo: vi.fn(async () => {}),
  }
}
```

Then **add `video: fakeVideo()` to every existing `assetsBuild({ ... })` call** in the file (the 8 shipped cases). They have no animation folders, so the video processor is never invoked — this only satisfies the new required option.

Append these new cases:

```ts
describe('assetsBuild — animations', () => {
  it('builds an animations entry for a video.mp4 folder and excludes its frames from assets', async () => {
    const bucket = fakeBucket({ keys: [
      `${SRC}/p7/anim/x/video.mp4`, `${SRC}/p7/anim/x/frame_000.jpg`, `${SRC}/p2/main.png`,
    ] })
    const manifest = await assetsBuild({ bucket, processor: fakeProcessor(), video: fakeVideo(), src: SRC })

    expect(Object.keys(manifest.assets)).toEqual(['p2/main.png'])         // frame excluded
    expect(Object.keys(manifest.animations ?? {})).toEqual(['p7/anim/x']) // one animation
    expect(manifest.animations!['p7/anim/x'].renditions.map((r) => r.height)).toEqual([480, 720, 1080])
  })

  it('reuses a prior animation entry when its poster + renditions already exist and !force', async () => {
    const prior = {
      thumbhash: 'OLD', poster: 'derived/a/anim.poster.webp',
      renditions: [
        { height: 480, width: 854, proxy: 'derived/a/anim.480.mp4' },
        { height: 720, width: 1280, proxy: 'derived/a/anim.720.mp4' },
      ],
      width: 1280, height: 720, frameCount: 3, fps: 24,
    }
    const bucket = fakeBucket({ keys: [
      `${SRC}/a/anim/frame_0.jpg`, `${SRC}/a/anim/frame_1.jpg`, `${SRC}/a/anim/frame_2.jpg`,
      `${SRC}/derived/a/anim.poster.webp`,
      `${SRC}/derived/a/anim.480.mp4`, `${SRC}/derived/a/anim.720.mp4`,
    ] })
    const video = fakeVideo()
    const manifest = await assetsBuild({
      bucket, processor: fakeProcessor(), video, src: SRC,
      previous: { basePath: SRC, assets: {}, animations: { 'a/anim': prior } },
    })

    expect(manifest.animations!['a/anim']).toEqual(prior)
    expect(video.encode).not.toHaveBeenCalled()
    expect(bucket.download).not.toHaveBeenCalled()
  })

  it('dry-run lists animations but does not encode or upload', async () => {
    const bucket = fakeBucket({ keys: [`${SRC}/a/anim/frame_0.jpg`, `${SRC}/a/anim/frame_1.jpg`] })
    const video = fakeVideo()
    const manifest = await assetsBuild({ bucket, processor: fakeProcessor(), video, src: SRC, dryRun: true })

    expect(Object.keys(manifest.animations ?? {})).toEqual(['a/anim'])
    expect(video.encode).not.toHaveBeenCalled()
    expect(bucket.upload).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test --workspace @badcode/cli -- assets-build`
Expected: FAIL — `video` option/animation handling missing (and type errors for the new required option).

- [ ] **Step 3: Wire grouping + animations into `assets-build.ts`**

Edit `packages/cli/src/assets-build.ts`. Update imports at the top:

```ts
import type { AssetManifest, ImageVariant, VideoAsset } from '@badcode/comic-manifest'
import type { Bucket } from './bucket'
import type { ImageProcessor } from './image-processor'
import type { VideoProcessor } from './video-processor'
import { IMMUTABLE_CC } from './bucket'
import { variantKey, classifyAsset } from './asset-paths'
import { groupAssets, renditionKey, posterKey } from './animation-paths'
import { buildAnimation } from './build-animation'
```
(`relKey` is still used — keep it in the `./asset-paths` import: `import { relKey, variantKey, classifyAsset } from './asset-paths'`.)

Add `video` to the options interface (after `processor`):

```ts
  video: VideoProcessor
```

Replace the body's discovery + processing. The new `assetsBuild`:

```ts
export async function assetsBuild(opts: AssetsBuildOptions): Promise<AssetManifest> {
  const { bucket, processor, video, src, previous, force = false, dryRun = false, concurrency = 6 } = opts
  const log = opts.log ?? (() => {})
  const basePath = src.endsWith('/') ? src.slice(0, -1) : src

  const allKeys = await bucket.listKeys(basePath)
  const relAll = allKeys.map((k) => relKey(basePath, k))
  const existing = new Set(relAll)
  const { animations: animFolders, staticImages } = groupAssets(relAll)

  let tmpDir: Promise<string> | null = null
  const ensureTmp = (): Promise<string> => {
    if (!tmpDir) tmpDir = mkdtemp(join(tmpdir(), 'assets-build-'))
    return tmpDir
  }

  try {
    // --- static images (unchanged behavior) ---
    const staticEntries = await mapPool(staticImages, concurrency, async (rel, index): Promise<[string, ImageVariant]> => {
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
      const localSrc = join(dir, `src-${index}`)
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
      await rm(localSrc, { force: true })
      await rm(localLow, { force: true })
      await rm(localHigh, { force: true })
      return [rel, { thumbhash, low: lowKey, high: highKey, width, height }]
    })

    // --- animations (new) ---
    const animEntries = await mapPool(animFolders, concurrency, async (anim, index): Promise<[string, VideoAsset]> => {
      const prior = previous?.animations?.[anim.folder]
      const outputsExist = existing.has(posterKey(anim.folder)) &&
        (prior?.renditions ?? []).every((r) => existing.has(r.proxy)) && (prior?.renditions.length ?? 0) > 0
      if (!force && prior && outputsExist) {
        log(`reuse animation ${anim.folder}`)
        return [anim.folder, prior]
      }
      if (dryRun) {
        log(`would build animation ${anim.folder}`)
        return [anim.folder, { thumbhash: '', poster: posterKey(anim.folder), renditions: [], width: 0, height: 0, frameCount: anim.frames.length, fps: 0 }]
      }
      const dir = await ensureTmp()
      const asset = await buildAnimation(anim, { basePath, bucket, image: processor, video, tmpDir: dir, index, log })
      return [anim.folder, asset]
    })

    return {
      basePath,
      assets: Object.fromEntries(staticEntries),
      animations: Object.fromEntries(animEntries),
    }
  } finally {
    if (tmpDir) await rm(await tmpDir, { recursive: true, force: true })
  }
}
```

Note: the `renditionKey` import is used transitively by `build-animation`; the orchestrator itself uses `posterKey`. If `renditionKey` ends up unused in `assets-build.ts`, drop it from the import to satisfy `noUnusedLocals` (only `posterKey` is needed here).

- [ ] **Step 4: Wire the real processor in `bin.ts`**

In `packages/cli/src/bin.ts`, add to the imports:

```ts
import { FfmpegVideoProcessor } from './video-processor'
```

In the `assets-build` command action, add `video` to the `assetsBuild({ ... })` call:

```ts
    const manifest = await assetsBuild({
      bucket,
      processor: new SharpImageProcessor(),
      video: new FfmpegVideoProcessor(),
      src: opts.src,
      previous,
      force: opts.force ?? false,
      dryRun: opts.dryRun ?? false,
      concurrency: Number(opts.concurrency),
      log: (msg) => console.log(msg),
    })
```

- [ ] **Step 5: Run tests + typecheck to verify they pass**

Run: `npm test --workspace @badcode/cli` — expect all green (existing + 3 new animation cases).
Run: `npm run typecheck --workspace @badcode/cli` — clean (watch for an unused `renditionKey` import; remove if flagged).
Run: `npx tsx packages/cli/src/bin.ts assets-build --help` — still prints usage.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/assets-build.ts packages/cli/src/assets-build.test.ts packages/cli/src/bin.ts
git commit -m "feat(cli): assets-build emits animations (ladder) alongside image assets"
```

---

## Task 6: Live smoke run (manual verification)

Requires authenticated `gsutil` + `ffmpeg`/`ffprobe` on PATH. Validates the real pipeline against one folder of each animation source kind. Not an automated test — if the environment lacks credentials or ffmpeg, stop after Task 5 and hand back.

- [ ] **Step 1: Smoke a source-video animation (a17f2cc4 page_1)**

Run:
```bash
npx tsx packages/cli/src/bin.ts assets-build \
  --src 'comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4' \
  --manifest /tmp/anim-smoke.manifest.json
```
Expected: `built animation …`; the manifest's `animations` entry lists 480/720/1080 renditions, a poster, a non-empty `thumbhash`, and `frameCount`/`fps`.

- [ ] **Step 2: Verify the renditions exist and are small**

Run:
```bash
gsutil ls -l "gs://badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/derived/**"
```
Expected: `*.480.mp4`, `*.720.mp4`, `*.1080.mp4`, `*.poster.webp` — each MP4 materially smaller than the source `video.mp4`.

- [ ] **Step 3: Smoke a frames-only animation (bebf53aa page_53, ~316 frames, no source video)**

Run:
```bash
npx tsx packages/cli/src/bin.ts assets-build \
  --src 'comics/bebf53aa-05a0-400a-a189-058e190963ed/pages/page_53/animation/7c6320f6-78ee-49d4-bbda-65e426ed3d14' \
  --manifest /tmp/anim-smoke2.manifest.json
```
Expected: `built animation …` (the frames→video branch); `frameCount` ≈ the number of `frame_*.jpg` in that folder; renditions present.

- [ ] **Step 4: Confirm idempotency**

Re-run the Step 1 command.
Expected: `reuse animation …` (no `built`), proving the skip path.

This task has no commit (it writes throwaway manifests to `/tmp` and proxies to the bucket).

---

## Self-Review

**Spec coverage** (against `2026-06-16-progressive-comic-loading-design.md`, sections A + contract, animation parts):
- `animations` map + `VideoAsset`/`Rendition` types → Task 1. ✓
- Animation-folder detection (video.mp4 OR numbered frames) + statics excluded → Task 2 `groupAssets`, integrated Task 5. ✓
- ffmpeg/ffprobe behind an injectable runner → Task 3. ✓
- Source-video-preferred; frames→video fallback → Task 4 `buildAnimation`. ✓
- 480/720/1080 ladder, no-upscale (+10% tolerance) → Task 2 `rungsFor` + Task 4 encode loop. ✓
- gop12/no-B-frames/crf26 encode settings → Task 3 `ENCODE_BASE`. ✓
- Poster (WebP) + ThumbHash from frame 0 → Task 4 (reuses `ImageProcessor.toWebp`/`thumbhash`). ✓
- `frameCount`/`fps`/`width`/`height` (source) → Task 4 (probe + frames.length for frames-only). ✓
- Idempotency (reuse when outputs + prior entry exist unless `--force`), dry-run, concurrency → Task 5. ✓
- Derived `derived/` prefix + IMMUTABLE cache-control on uploads → Tasks 2/4. ✓
- Static-image path unchanged → Task 5 preserves it verbatim. ✓
- Live proof against both source kinds (a17f2cc4 video + bebf53aa frames-only) → Task 6. ✓

**Placeholder scan:** No TBD/TODO; every code step is complete; every test step has real assertions.

**Type consistency:** `VideoAsset`/`Rendition` (Task 1) are imported unchanged in Tasks 4 & 5. `AnimationFolder` (Task 2) is consumed by Tasks 4 & 5. `VideoProcessor`/`VideoMeta`/`FfRunner` (Task 3) match the fakes in Tasks 4 & 5 and the real wiring in Task 5. `AnimationDeps`/`buildAnimation` (Task 4) match the call in Task 5. `groupAssets`/`renditionKey`/`posterKey`/`rungsFor` signatures (Task 2) match their uses in Tasks 4 & 5. `assetsBuild` gains a required `video` option (Task 5) and every test call provides `fakeVideo()`.

**Note for Plan B (runtime):** consumes the manifest `animations` map via `comic.resolveAnimation(key)`, mapping each `Rendition.proxy` (basePath-relative) to an absolute GCS URL (same `BUCKET_BASE_URL`/basePath join as `resolve`), and `poster` likewise. `thumbhash` is the compact hash (decode client-side). The runtime `VideoAsset` descriptor uses `url` per rendition; the manifest stores `proxy` (relative).
