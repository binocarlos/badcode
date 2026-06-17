# Comic Runtime Loader Implementation Plan (Plan B)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the runtime half of progressive comic loading in `@badcode/comic`: a manifest resolver (`createComic`/`resolve`/`resolveAnimation`), a progressive `ImageWidget` (thumb→low→high), and a video `AnimationWidget` that scrubs a single small video per animation via WebCodecs→canvas (windowed GOP decode + LRU, adaptive rendition selection, low→high upgrade, `<video>` fallback).

**Architecture:** This is **Plan B of 2** (Plan A — the video pipeline — is shipped and produces the manifest this consumes). The browser-only parts (canvas painting, WebCodecs decode) are kept as thin shells over **pure, unit-tested units** (resolver, rendition selection, GOP/LRU math, frame-index + capability predicates). Canvas/WebCodecs are unavailable in jsdom, so those shells are validated by the proven spike (`apps/web/public/spike/`) plus a manual browser pass — the pure logic carries the automated tests. Each widget mounts/unmounts with the rolling-window `<Page>`, so mount = start work, unmount = abort + free.

**Tech Stack:** TypeScript (ESM, `verbatimModuleSyntax`), React 18 (peer), `@badcode/comic-manifest` (contract), `thumbhash` (decode placeholder), `mp4box` (demux for WebCodecs), native `VideoDecoder`/`createImageBitmap`, `vitest` (node env — pure-logic tests).

## Global Constraints

- ESM with `verbatimModuleSyntax` ON → type-only imports use `import type`.
- `noUnusedLocals` / `noUnusedParameters` ON.
- `@badcode/comic` is consumed from TypeScript source (no build step); add new public API to the barrel `packages/comic/src/index.ts`.
- Manifest paths are **basePath-relative**; the runtime absolutizes them against the GCS bucket base `https://storage.googleapis.com/badcode-storage` (this package owns that constant — do **not** import `@badcode/comic-meta`, which is the storyteller stack we're decoupling from).
- Runtime descriptor types are named `ResolvedImage` / `ResolvedAnimation` to avoid clashing with `@badcode/comic-manifest`'s `ImageVariant` / `VideoAsset` (manifest shapes, relative paths).
- Rendition selection caps: `Save-Data` or `effectiveType` 2g/slow-2g → 480; 3g → 720; else uncapped.
- Tests run in the existing vitest (node) setup — no jsdom. Browser-only behavior is covered by explicit manual steps, never by placeholder tests.
- Commits **auto-push**; work on branch `feat/comic-asset-pipeline`; **explicit paths** in every `git add`; verify with `git show --stat HEAD`.

---

## File structure

**`packages/comic/`:**
- `package.json` *(modify)* — add deps `@badcode/comic-manifest`, `thumbhash`, `mp4box`.
- `src/assets/types.ts` *(new)* — `ResolvedImage`, `ResolvedRendition`, `ResolvedAnimation`, `Comic`.
- `src/assets/createComic.ts` *(new)* — `createComic`, `resolve`, `resolveAnimation`, URL absolutization, ThumbHash decode.
- `src/assets/createComic.test.ts` *(new)*
- `src/assets/pickImageSrc.ts` *(new)* — pure progressive-stage selector for `ImageWidget`.
- `src/assets/pickImageSrc.test.ts` *(new)*
- `src/video/selectRendition.ts` *(new)* — pure rendition selection + `lowestRendition`.
- `src/video/selectRendition.test.ts` *(new)*
- `src/video/gop.ts` *(new)* — pure `gopBoundsFor` + `nearestCached` + `evictionList`.
- `src/video/gop.test.ts` *(new)*
- `src/video/VideoSource.ts` *(new)* — WebCodecs windowed-decode class (uses `gop.ts`); thin shell.
- `src/video/capabilities.ts` *(new)* — `supportsWebCodecs()`, `frameIndexFor()`.
- `src/video/capabilities.test.ts` *(new)*
- `src/components/ImageWidget.tsx` *(modify)* — accept `ResolvedImage | string`; thumb→low→high.
- `src/components/AnimationWidget.tsx` *(modify)* — accept `ResolvedAnimation` (legacy `frames` kept for migration); video scrub + fallback.
- `src/index.ts` *(modify)* — export `createComic` + descriptor types.
- `apps/web/src/comics/camping-jack-test/CampingJackTestComic.tsx` *(modify, Task 6)* — switch to `createComic` + the committed manifest.

---

## Task 1: Manifest resolver — `createComic` / `resolve` / `resolveAnimation`

**Files:**
- Modify: `packages/comic/package.json`
- Create: `packages/comic/src/assets/types.ts`, `packages/comic/src/assets/createComic.ts`
- Test: `packages/comic/src/assets/createComic.test.ts`

**Interfaces:**
- Consumes: `AssetManifest`, `ImageVariant`, `VideoAsset` from `@badcode/comic-manifest`; `thumbHashToDataURL` from `thumbhash`.
- Produces:
  - `ResolvedImage { thumb: string; low: string; high: string; width: number; height: number }`
  - `ResolvedRendition { height: number; width: number; url: string }`
  - `ResolvedAnimation { thumb: string; poster: string; renditions: ResolvedRendition[]; width: number; height: number; frameCount: number; fps: number }`
  - `interface Comic { resolve(key: string): ResolvedImage; resolveAnimation(key: string): ResolvedAnimation }`
  - `createComic(manifest: AssetManifest, opts?: { baseUrl?: string }): Comic`

- [ ] **Step 1: Add dependencies**

Edit `packages/comic/package.json` `dependencies` to add (keep existing `@badcode/scroll-timeline`, `roughjs`):

```json
  "dependencies": {
    "@badcode/comic-manifest": "*",
    "@badcode/scroll-timeline": "*",
    "mp4box": "^0.5.2",
    "roughjs": "^4.6.6",
    "thumbhash": "^0.1.1"
  },
```

Run `npm install` from the repo root.

- [ ] **Step 2: Write the failing test**

Create `packages/comic/src/assets/createComic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import type { AssetManifest } from '@badcode/comic-manifest'
import { createComic } from './createComic'

const BASE = 'https://storage.googleapis.com/badcode-storage'
const manifest: AssetManifest = {
  basePath: 'comics-v2/ep1',
  assets: {
    'p1/main.png': { thumbhash: '', low: 'derived/p1/main.low.webp', high: 'derived/p1/main.high.webp', width: 1600, height: 900 },
  },
  animations: {
    'p7/anim': {
      thumbhash: '', poster: 'derived/p7/anim.poster.webp',
      renditions: [
        { height: 480, width: 854, proxy: 'derived/p7/anim.480.mp4' },
        { height: 720, width: 1280, proxy: 'derived/p7/anim.720.mp4' },
      ],
      width: 1920, height: 1080, frameCount: 242, fps: 24,
    },
  },
}

describe('createComic.resolve', () => {
  const comic = createComic(manifest)
  it('absolutizes low/high to GCS URLs under basePath', () => {
    const a = comic.resolve('p1/main.png')
    expect(a.low).toBe(`${BASE}/comics-v2/ep1/derived/p1/main.low.webp`)
    expect(a.high).toBe(`${BASE}/comics-v2/ep1/derived/p1/main.high.webp`)
    expect(a.width).toBe(1600)
    expect(a.thumb).toBe('') // empty hash → empty data-uri
  })

  it('degrades a missing key to high-only using the key as a relative path', () => {
    const a = comic.resolve('p9/missing.png')
    expect(a.thumb).toBe('')
    expect(a.low).toBe(`${BASE}/comics-v2/ep1/p9/missing.png`)
    expect(a.high).toBe(a.low)
  })

  it('passes through an absolute URL key unchanged', () => {
    const a = comic.resolve('https://example.com/x.png')
    expect(a.high).toBe('https://example.com/x.png')
  })
})

describe('createComic.resolveAnimation', () => {
  const comic = createComic(manifest)
  it('absolutizes renditions + poster and carries metadata', () => {
    const v = comic.resolveAnimation('p7/anim')
    expect(v.renditions).toEqual([
      { height: 480, width: 854, url: `${BASE}/comics-v2/ep1/derived/p7/anim.480.mp4` },
      { height: 720, width: 1280, url: `${BASE}/comics-v2/ep1/derived/p7/anim.720.mp4` },
    ])
    expect(v.poster).toBe(`${BASE}/comics-v2/ep1/derived/p7/anim.poster.webp`)
    expect(v).toMatchObject({ width: 1920, height: 1080, frameCount: 242, fps: 24 })
  })

  it('throws for an unknown animation key', () => {
    expect(() => comic.resolveAnimation('nope')).toThrow(/unknown animation/)
  })
})

describe('createComic — custom baseUrl', () => {
  it('honors an overridden baseUrl', () => {
    const comic = createComic(manifest, { baseUrl: 'https://cdn.test' })
    expect(comic.resolve('p1/main.png').high).toBe('https://cdn.test/comics-v2/ep1/derived/p1/main.high.webp')
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test --workspace @badcode/comic -- createComic`
Expected: FAIL — module not found. (If the comic package has no test script yet, see Step 6.)

- [ ] **Step 4: Implement types + resolver**

Create `packages/comic/src/assets/types.ts`:

```ts
/** A static image resolved to absolute URLs, ready for the widget. */
export interface ResolvedImage {
  /** ThumbHash decoded to a data-URI ('' when not generated). */
  thumb: string
  /** Absolute URL of the low-res WebP. */
  low: string
  /** Absolute URL of the high-res WebP. */
  high: string
  width: number
  height: number
}

/** One video rendition resolved to an absolute URL. */
export interface ResolvedRendition {
  height: number
  width: number
  url: string
}

/** An animation resolved to absolute URLs, ready for the widget. */
export interface ResolvedAnimation {
  /** ThumbHash of the poster, decoded to a data-URI ('' when not generated). */
  thumb: string
  /** Absolute URL of the WebP poster. */
  poster: string
  /** Renditions sorted ascending by height. */
  renditions: ResolvedRendition[]
  width: number
  height: number
  frameCount: number
  fps: number
}

export interface Comic {
  resolve(key: string): ResolvedImage
  resolveAnimation(key: string): ResolvedAnimation
}
```

Create `packages/comic/src/assets/createComic.ts`:

```ts
import { thumbHashToDataURL } from 'thumbhash'
import type { AssetManifest } from '@badcode/comic-manifest'
import type { Comic, ResolvedImage, ResolvedAnimation } from './types'

/** GCS bucket root the manifest's basePath-relative keys live under. */
export const DEFAULT_BASE_URL = 'https://storage.googleapis.com/badcode-storage'

function decodeThumb(hashB64: string): string {
  if (!hashB64) return ''
  const bin = atob(hashB64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return thumbHashToDataURL(bytes)
}

export function createComic(manifest: AssetManifest, opts: { baseUrl?: string } = {}): Comic {
  const baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
  const prefix = `${baseUrl}/${manifest.basePath}`

  /** Absolutize a basePath-relative key (pass absolute URLs through unchanged). */
  const abs = (rel: string): string => (/^https?:\/\//.test(rel) ? rel : `${prefix}/${rel}`)

  return {
    resolve(key: string): ResolvedImage {
      const v = manifest.assets[key]
      if (!v) {
        // Graceful degradation: treat the key as a direct path, high-only.
        const url = abs(key)
        return { thumb: '', low: url, high: url, width: 0, height: 0 }
      }
      return { thumb: decodeThumb(v.thumbhash), low: abs(v.low), high: abs(v.high), width: v.width, height: v.height }
    },

    resolveAnimation(key: string): ResolvedAnimation {
      const a = manifest.animations?.[key]
      if (!a) throw new Error(`unknown animation "${key}" in manifest "${manifest.basePath}"`)
      return {
        thumb: decodeThumb(a.thumbhash),
        poster: abs(a.poster),
        renditions: a.renditions.map((r) => ({ height: r.height, width: r.width, url: abs(r.proxy) })),
        width: a.width, height: a.height, frameCount: a.frameCount, fps: a.fps,
      }
    },
  }
}
```

- [ ] **Step 5: Export from the barrel**

In `packages/comic/src/index.ts`, add:

```ts
export { createComic, DEFAULT_BASE_URL } from './assets/createComic'
export type { Comic, ResolvedImage, ResolvedRendition, ResolvedAnimation } from './assets/types'
```

- [ ] **Step 6: Ensure the package has a test script, then run**

Check `packages/comic/package.json` `scripts`. If there is no `test` script, add `"test": "vitest run"` and ensure `vitest` is in `devDependencies` (copy the version used by sibling packages, `^2.1.8`); run `npm install` if you added it.

Run: `npm test --workspace @badcode/comic -- createComic`
Expected: PASS (7 tests). Run `npm run typecheck --workspace @badcode/comic` — clean.

- [ ] **Step 7: Commit**

```bash
git add packages/comic/package.json packages/comic/src/assets/types.ts packages/comic/src/assets/createComic.ts packages/comic/src/assets/createComic.test.ts packages/comic/src/index.ts package-lock.json
git commit -m "feat(comic): createComic/resolve/resolveAnimation manifest resolver"
```

---

## Task 2: Pure rendition selection

**Files:**
- Create: `packages/comic/src/video/selectRendition.ts`
- Test: `packages/comic/src/video/selectRendition.test.ts`

**Interfaces:**
- Consumes: `ResolvedRendition` from `../assets/types`.
- Produces:
  - `interface NetworkHint { saveData?: boolean; effectiveType?: string }`
  - `selectRendition(renditions: ResolvedRendition[], viewportHeight: number, dpr: number, net?: NetworkHint): ResolvedRendition`
  - `lowestRendition(renditions: ResolvedRendition[]): ResolvedRendition`

- [ ] **Step 1: Write the failing test**

Create `packages/comic/src/video/selectRendition.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { selectRendition, lowestRendition } from './selectRendition'

const R = [
  { height: 480, width: 854, url: 'a' },
  { height: 720, width: 1280, url: 'b' },
  { height: 1080, width: 1920, url: 'c' },
]

describe('selectRendition', () => {
  it('picks the smallest rung >= viewport*dpr', () => {
    expect(selectRendition(R, 600, 1).height).toBe(720)   // need 600 → 720
    expect(selectRendition(R, 400, 1).height).toBe(480)   // need 400 → 480
    expect(selectRendition(R, 700, 1.5).height).toBe(1080) // need 1050 → 1080
  })
  it('uses the largest rung when none reach the target', () => {
    expect(selectRendition(R, 2000, 2).height).toBe(1080)
  })
  it('caps to 480 on Save-Data', () => {
    expect(selectRendition(R, 1080, 2, { saveData: true }).height).toBe(480)
  })
  it('caps to 480 on 2g and 720 on 3g', () => {
    expect(selectRendition(R, 1080, 2, { effectiveType: '2g' }).height).toBe(480)
    expect(selectRendition(R, 1080, 2, { effectiveType: 'slow-2g' }).height).toBe(480)
    expect(selectRendition(R, 1080, 2, { effectiveType: '3g' }).height).toBe(720)
  })
  it('does not exceed the cap even if pixels demand more, but still picks within cap', () => {
    expect(selectRendition(R, 1080, 2, { effectiveType: '3g' }).height).toBe(720)
  })
})

describe('lowestRendition', () => {
  it('returns the smallest rung', () => {
    expect(lowestRendition(R).height).toBe(480)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test --workspace @badcode/comic -- selectRendition`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `packages/comic/src/video/selectRendition.ts`:

```ts
import type { ResolvedRendition } from '../assets/types'

export interface NetworkHint {
  saveData?: boolean
  effectiveType?: string
}

function capFor(net?: NetworkHint): number {
  if (!net) return Infinity
  if (net.saveData) return 480
  if (net.effectiveType === '2g' || net.effectiveType === 'slow-2g') return 480
  if (net.effectiveType === '3g') return 720
  return Infinity
}

/** The smallest rung. Assumes `renditions` is sorted ascending by height. */
export function lowestRendition(renditions: ResolvedRendition[]): ResolvedRendition {
  return renditions[0]
}

/**
 * Pick a rendition: the smallest rung whose height ≥ viewportHeight×dpr, but never
 * above the network cap. Falls back to the largest rung within the cap, else the smallest.
 */
export function selectRendition(
  renditions: ResolvedRendition[],
  viewportHeight: number,
  dpr: number,
  net?: NetworkHint,
): ResolvedRendition {
  const cap = capFor(net)
  const target = viewportHeight * dpr
  const eligible = renditions.filter((r) => r.height <= cap)
  const pool = eligible.length > 0 ? eligible : [renditions[0]]
  return pool.find((r) => r.height >= target) ?? pool[pool.length - 1]
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test --workspace @badcode/comic -- selectRendition`
Expected: PASS. `npm run typecheck --workspace @badcode/comic` clean.

- [ ] **Step 5: Commit**

```bash
git add packages/comic/src/video/selectRendition.ts packages/comic/src/video/selectRendition.test.ts
git commit -m "feat(comic): pure adaptive rendition selection"
```

---

## Task 3: Pure GOP/window math + `VideoSource` shell

The pure helpers are unit-tested; the `VideoSource` class wires them to WebCodecs (validated by the spike + Task 6 manual pass — WebCodecs/canvas don't exist in node/jsdom).

**Files:**
- Create: `packages/comic/src/video/gop.ts`, `packages/comic/src/video/VideoSource.ts`
- Test: `packages/comic/src/video/gop.test.ts`

**Interfaces:**
- Produces (pure, `gop.ts`):
  - `gopBoundsFor(gopStarts: number[], target: number, frameCount: number): [number, number]`
  - `nearestCached(has: (i: number) => boolean, target: number, frameCount: number): number` (−1 if none)
  - `gopsToEvict(cachedGops: number[], maxResident: number): number[]`
- Produces (`VideoSource.ts`): `class VideoSource { constructor(url: string, frameCount: number); load(): Promise<void>; draw(ctx: CanvasRenderingContext2D, target: number, w: number, h: number): void; close(): void }`

- [ ] **Step 1: Write the failing test (pure helpers)**

Create `packages/comic/src/video/gop.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { gopBoundsFor, nearestCached, gopsToEvict } from './gop'

describe('gopBoundsFor', () => {
  const starts = [0, 12, 24, 36]
  it('returns [gopStart, gopEnd] for the GOP containing target', () => {
    expect(gopBoundsFor(starts, 5, 48)).toEqual([0, 11])
    expect(gopBoundsFor(starts, 12, 48)).toEqual([12, 23])
    expect(gopBoundsFor(starts, 40, 48)).toEqual([36, 47]) // last GOP → frameCount-1
  })
  it('clamps to the first GOP for a target before any keyframe', () => {
    expect(gopBoundsFor([3, 15], 1, 30)).toEqual([3, 14])
  })
})

describe('nearestCached', () => {
  const cache = new Set([10, 11, 20])
  const has = (i: number) => cache.has(i)
  it('prefers the nearest cached frame at or before target', () => {
    expect(nearestCached(has, 13, 30)).toBe(11)
  })
  it('falls forward when nothing is cached before target', () => {
    expect(nearestCached(has, 5, 30)).toBe(10)
  })
  it('returns -1 when nothing is cached', () => {
    expect(nearestCached(() => false, 5, 30)).toBe(-1)
  })
})

describe('gopsToEvict', () => {
  it('returns the oldest GOPs beyond the resident cap (FIFO)', () => {
    expect(gopsToEvict([0, 12, 24, 36], 2)).toEqual([0, 12])
  })
  it('returns [] when within cap', () => {
    expect(gopsToEvict([0, 12], 4)).toEqual([])
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test --workspace @badcode/comic -- gop`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the pure helpers**

Create `packages/comic/src/video/gop.ts`:

```ts
/** [gopStart, gopEnd] frame indices for the GOP containing `target`. */
export function gopBoundsFor(gopStarts: number[], target: number, frameCount: number): [number, number] {
  let gs = gopStarts[0] ?? 0
  let gi = 0
  for (let i = 0; i < gopStarts.length; i++) {
    if (gopStarts[i] <= target) { gs = gopStarts[i]; gi = i } else break
  }
  const ge = gi + 1 < gopStarts.length ? gopStarts[gi + 1] - 1 : frameCount - 1
  return [gs, ge]
}

/** Nearest cached frame index at/before target, else nearest after, else -1. */
export function nearestCached(has: (i: number) => boolean, target: number, frameCount: number): number {
  for (let i = target; i >= 0; i--) if (has(i)) return i
  for (let i = target + 1; i < frameCount; i++) if (has(i)) return i
  return -1
}

/** Oldest GOP starts to evict so that at most `maxResident` remain (FIFO order). */
export function gopsToEvict(cachedGops: number[], maxResident: number): number[] {
  const excess = cachedGops.length - maxResident
  return excess > 0 ? cachedGops.slice(0, excess) : []
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test --workspace @badcode/comic -- gop`
Expected: PASS (8 assertions across the describes).

- [ ] **Step 5: Implement the `VideoSource` shell (ported from the spike)**

Create `packages/comic/src/video/VideoSource.ts`:

```ts
import MP4Box from 'mp4box'
import { gopBoundsFor, nearestCached, gopsToEvict } from './gop'

const MAX_GOPS_RESIDENT = 12

interface Sample { type: 'key' | 'delta'; timestamp: number; duration: number; data: Uint8Array }

/**
 * Windowed WebCodecs decoder for one video rendition. Demuxes all samples up front
 * (compressed), decodes the GOP containing a requested frame on demand, caches decoded
 * frames as ImageBitmaps, and LRU-evicts whole GOPs. Browser-only; validated by the
 * spike at apps/web/public/spike/ and the Task 6 manual pass.
 */
export class VideoSource {
  private decoder: VideoDecoder | null = null
  private samples: Sample[] = []
  private gopStarts: number[] = []
  private cache = new Map<number, ImageBitmap>()
  private cachedGops: number[] = []
  private decodeCursor = 0
  private decodingGop: number | null = null
  private closed = false
  ready = false

  constructor(private readonly url: string, public readonly frameCount: number) {}

  async load(): Promise<void> {
    const mp4 = MP4Box.createFile()
    const description = (track: { id: number }): Uint8Array => {
      const trak = (mp4 as any).getTrackById(track.id)
      for (const entry of trak.mdia.minf.stbl.stsd.entries) {
        const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
        if (box) {
          const ds = new (MP4Box as any).DataStream(undefined, 0, (MP4Box as any).DataStream.BIG_ENDIAN)
          box.write(ds)
          return new Uint8Array(ds.buffer, 8)
        }
      }
      throw new Error('no codec description box')
    }

    await new Promise<void>((resolve, reject) => {
      ;(mp4 as any).onError = reject
      ;(mp4 as any).onReady = (info: any) => {
        const track = info.videoTracks[0]
        this.decoder = new VideoDecoder({
          output: (frame) => {
            const idx = this.decodeCursor++
            const w = frame.displayWidth, h = frame.displayHeight
            createImageBitmap(frame, { resizeWidth: w, resizeHeight: h }).then((bmp) => {
              frame.close()
              if (this.closed) { bmp.close(); return }
              this.cache.set(idx, bmp)
            }).catch(() => frame.close())
          },
          error: () => {},
        })
        this.decoder.configure({ codec: track.codec, codedWidth: track.video.width, codedHeight: track.video.height, description: description(track) })
        ;(mp4 as any).onSamples = (_id: number, _u: unknown, samples: any[]) => {
          for (const s of samples) {
            if (s.is_sync) this.gopStarts.push(s.number)
            this.samples[s.number] = {
              type: s.is_sync ? 'key' : 'delta',
              timestamp: (s.cts * 1e6) / s.timescale,
              duration: (s.duration * 1e6) / s.timescale,
              data: new Uint8Array(s.data),
            }
          }
        }
        ;(mp4 as any).setExtractionOptions(track.id, null, { nbSamples: Infinity })
        ;(mp4 as any).start()
        this.ready = true
        resolve()
      }
      fetch(this.url).then((r) => r.arrayBuffer()).then((buf) => {
        const ab = buf as ArrayBuffer & { fileStart?: number }
        ab.fileStart = 0
        ;(mp4 as any).appendBuffer(ab)
        ;(mp4 as any).flush()
      }).catch(reject)
    })
  }

  private evict(): void {
    for (const gs of gopsToEvict(this.cachedGops, MAX_GOPS_RESIDENT)) {
      const [a, b] = gopBoundsFor(this.gopStarts, gs, this.frameCount)
      for (let i = a; i <= b; i++) { const bmp = this.cache.get(i); if (bmp) { bmp.close(); this.cache.delete(i) } }
    }
    this.cachedGops = this.cachedGops.slice(Math.max(0, this.cachedGops.length - MAX_GOPS_RESIDENT))
  }

  private async decodeGop(gs: number, ge: number): Promise<void> {
    if (this.closed || !this.decoder) return
    if (this.cachedGops.includes(gs) || this.decodingGop !== null) return
    this.decodingGop = gs
    this.decodeCursor = gs
    try {
      for (let i = gs; i <= ge; i++) this.decoder.decode(new EncodedVideoChunk(this.samples[i]))
      await this.decoder.flush()
    } catch { /* decoder errors surface via the error callback */ }
    if (this.closed) return
    this.cachedGops.push(gs)
    this.evict()
    this.decodingGop = null
  }

  /** Draw the best available frame for `target` to the canvas, and ensure its GOP decodes. */
  draw(ctx: CanvasRenderingContext2D, target: number, w: number, h: number): void {
    if (!this.ready) return
    const pick = nearestCached((i) => this.cache.has(i), target, this.frameCount)
    if (pick >= 0) ctx.drawImage(this.cache.get(pick) as ImageBitmap, 0, 0, w, h)
    const [gs, ge] = gopBoundsFor(this.gopStarts, target, this.frameCount)
    if (!this.cachedGops.includes(gs)) void this.decodeGop(gs, ge)
  }

  close(): void {
    this.closed = true
    for (const bmp of this.cache.values()) bmp.close()
    this.cache.clear()
    try { this.decoder?.close() } catch { /* already closed */ }
    this.decoder = null
  }
}
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck --workspace @badcode/comic`
Expected: clean. (WebCodecs DOM types — `VideoDecoder`, `EncodedVideoChunk`, `ImageBitmap` — come from the `DOM` lib already in `tsconfig.base.json`. `mp4box` is loosely typed via `any` casts on purpose; do not add `@types` for it.)

- [ ] **Step 7: Commit**

```bash
git add packages/comic/src/video/gop.ts packages/comic/src/video/gop.test.ts packages/comic/src/video/VideoSource.ts
git commit -m "feat(comic): VideoSource — windowed WebCodecs decode + LRU (pure GOP math tested)"
```

---

## Task 4: Progressive `ImageWidget`

**Files:**
- Create: `packages/comic/src/assets/pickImageSrc.ts`, `packages/comic/src/assets/pickImageSrc.test.ts`
- Modify: `packages/comic/src/components/ImageWidget.tsx`

**Interfaces:**
- Consumes: `ResolvedImage` from `../assets/types`; `markSlot` from `./slots`; `usePageContext` from `../engine/PageContext`.
- Produces:
  - `pickImageSrc(asset: ResolvedImage, lowReady: boolean, highReady: boolean): string` (which URL to show as the main layer).
  - `ImageWidget` now accepts `src: ResolvedImage | string` (a bare string still renders high-only — backward compatible with the `camping` comic).

- [ ] **Step 1: Write the failing test (pure stage selector)**

Create `packages/comic/src/assets/pickImageSrc.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { pickImageSrc } from './pickImageSrc'

const asset = { thumb: 'data:thumb', low: 'LOW', high: 'HIGH', width: 1, height: 1 }

describe('pickImageSrc', () => {
  it('shows high when it is ready', () => {
    expect(pickImageSrc(asset, true, true)).toBe('HIGH')
    expect(pickImageSrc(asset, false, true)).toBe('HIGH')
  })
  it('shows low when low is ready but high is not', () => {
    expect(pickImageSrc(asset, true, false)).toBe('LOW')
  })
  it('shows nothing (empty) when neither tier is ready (thumb shows underneath)', () => {
    expect(pickImageSrc(asset, false, false)).toBe('')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test --workspace @badcode/comic -- pickImageSrc`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the selector**

Create `packages/comic/src/assets/pickImageSrc.ts`:

```ts
import type { ResolvedImage } from './types'

/** Which URL the main <img> layer should show given which tiers have decoded. */
export function pickImageSrc(asset: ResolvedImage, lowReady: boolean, highReady: boolean): string {
  if (highReady) return asset.high
  if (lowReady) return asset.low
  return ''
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test --workspace @badcode/comic -- pickImageSrc`
Expected: PASS.

- [ ] **Step 5: Rewrite `ImageWidget` to use the descriptor**

Replace `packages/comic/src/components/ImageWidget.tsx` with:

```tsx
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { markSlot } from './slots'
import { usePageContext } from '../engine/PageContext'
import { pickImageSrc } from '../assets/pickImageSrc'
import type { ResolvedImage } from '../assets/types'

export interface ImageWidgetProps {
  /** A resolved descriptor (progressive) or a bare URL string (high-only, legacy). */
  src: ResolvedImage | string
  alt?: string
  objectPosition?: string
  fit?: CSSProperties['objectFit']
}

function toAsset(src: ResolvedImage | string): ResolvedImage {
  return typeof src === 'string' ? { thumb: '', low: src, high: src, width: 0, height: 0 } : src
}

export const ImageWidget = markSlot(function ImageWidget({
  src,
  alt = '',
  objectPosition = 'center',
  fit = 'cover',
}: ImageWidgetProps) {
  const asset = toAsset(src)
  const { isCurrent } = usePageContext()
  const [lowReady, setLowReady] = useState(false)
  const [highReady, setHighReady] = useState(false)
  const mounted = useRef(true)

  // Load low on mount.
  useEffect(() => {
    mounted.current = true
    if (!asset.low) return
    const img = new Image()
    img.src = asset.low
    img.decode().then(() => { if (mounted.current) setLowReady(true) }).catch(() => {})
    return () => { mounted.current = false }
  }, [asset.low])

  // Load high once the page is current.
  useEffect(() => {
    if (!isCurrent || !asset.high || asset.high === asset.low) return
    let live = true
    const img = new Image()
    img.src = asset.high
    img.decode().then(() => { if (live) setHighReady(true) }).catch(() => {})
    return () => { live = false }
  }, [isCurrent, asset.high, asset.low])

  const mainSrc = pickImageSrc(asset, lowReady, highReady)
  const fill: CSSProperties = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: fit, objectPosition, display: 'block', userSelect: 'none',
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {asset.thumb && (
        <img src={asset.thumb} alt="" draggable={false} aria-hidden style={{ ...fill, filter: 'blur(8px)', transform: 'scale(1.05)' }} />
      )}
      {mainSrc && <img src={mainSrc} alt={alt} draggable={false} style={fill} />}
    </div>
  )
}, 'widget')
```

- [ ] **Step 6: Typecheck + run package tests**

Run: `npm run typecheck --workspace @badcode/comic` — clean.
Run: `npm test --workspace @badcode/comic` — all green (the `camping` comic passes a string `src`, still satisfied by the union type).

- [ ] **Step 7: Commit**

```bash
git add packages/comic/src/assets/pickImageSrc.ts packages/comic/src/assets/pickImageSrc.test.ts packages/comic/src/components/ImageWidget.tsx
git commit -m "feat(comic): progressive ImageWidget (thumb->low->high, string fallback)"
```

---

## Task 5: Video `AnimationWidget`

**Files:**
- Create: `packages/comic/src/video/capabilities.ts`, `packages/comic/src/video/capabilities.test.ts`
- Modify: `packages/comic/src/components/AnimationWidget.tsx`

**Interfaces:**
- Consumes: `selectRendition`/`lowestRendition`/`NetworkHint` from `../video/selectRendition`; `VideoSource` from `../video/VideoSource`; `ResolvedAnimation` from `../assets/types`; `useScrollProgress` from `../hooks/useScrollProgress`; `usePageContext`; `markSlot`.
- Produces:
  - `supportsWebCodecs(): boolean`
  - `frameIndexFor(progress: number, frameCount: number): number`
  - `AnimationWidget` accepts `animation: ResolvedAnimation` (preferred) or legacy `frames: string[]` (kept so `camping-jack-test` builds until Task 6 migrates it).

- [ ] **Step 1: Write the failing test (pure capabilities/index)**

Create `packages/comic/src/video/capabilities.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { frameIndexFor } from './capabilities'

describe('frameIndexFor', () => {
  it('maps progress 0..1 to a clamped frame index', () => {
    expect(frameIndexFor(0, 242)).toBe(0)
    expect(frameIndexFor(1, 242)).toBe(241)
    expect(frameIndexFor(0.5, 242)).toBe(Math.round(0.5 * 241))
  })
  it('clamps out-of-range progress', () => {
    expect(frameIndexFor(-0.2, 100)).toBe(0)
    expect(frameIndexFor(1.5, 100)).toBe(99)
  })
  it('returns 0 for an empty clip', () => {
    expect(frameIndexFor(0.5, 0)).toBe(0)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test --workspace @badcode/comic -- capabilities`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement capabilities**

Create `packages/comic/src/video/capabilities.ts`:

```ts
/** True when the browser can decode video frames via WebCodecs. */
export function supportsWebCodecs(): boolean {
  return typeof globalThis !== 'undefined' && typeof (globalThis as { VideoDecoder?: unknown }).VideoDecoder === 'function'
}

/** Map page scroll progress (0..1) to a clamped frame index. */
export function frameIndexFor(progress: number, frameCount: number): number {
  if (frameCount <= 0) return 0
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.round(clamped * (frameCount - 1))
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test --workspace @badcode/comic -- capabilities`
Expected: PASS.

- [ ] **Step 5: Rewrite `AnimationWidget`**

Replace `packages/comic/src/components/AnimationWidget.tsx` with:

```tsx
import { useEffect, useRef, type CSSProperties } from 'react'
import { markSlot } from './slots'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { VideoSource } from '../video/VideoSource'
import { selectRendition, lowestRendition, type NetworkHint } from '../video/selectRendition'
import { supportsWebCodecs, frameIndexFor } from '../video/capabilities'
import type { ResolvedAnimation } from '../assets/types'

export interface AnimationWidgetProps {
  /** Preferred: a resolved animation descriptor (video, scroll-scrubbed). */
  animation?: ResolvedAnimation
  /** Legacy: ordered frame URLs (kept for migration; superseded by `animation`). */
  frames?: string[]
  alt?: string
  objectPosition?: string
  fit?: CSSProperties['objectFit']
}

function netHint(): NetworkHint | undefined {
  const c = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return c ? { saveData: c.saveData, effectiveType: c.effectiveType } : undefined
}

const fill: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }

/** Legacy frame-array path (unchanged behavior) — used until a comic migrates to `animation`. */
function LegacyFrames({ frames, alt, objectPosition, fit }: Required<Pick<AnimationWidgetProps, 'frames'>> & AnimationWidgetProps) {
  const progress = useScrollProgress()
  if (frames.length === 0) return null
  const index = frameIndexFor(progress, frames.length)
  return <img src={frames[index]} alt={alt ?? ''} draggable={false} style={{ ...fill, objectFit: fit ?? 'cover', objectPosition: objectPosition ?? 'center' }} />
}

function VideoScrub({ animation, fit, objectPosition }: { animation: ResolvedAnimation; fit?: CSSProperties['objectFit']; objectPosition?: string }) {
  const progress = useScrollProgress()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceRef = useRef<VideoSource | null>(null)

  // Bring up a VideoSource: low rung first (instant scrub), upgrade to the selected rung.
  useEffect(() => {
    let disposed = false
    const low = lowestRendition(animation.renditions)
    const chosen = selectRendition(animation.renditions, window.innerHeight, window.devicePixelRatio || 1, netHint())

    const start = async (url: string): Promise<VideoSource | null> => {
      const src = new VideoSource(url, animation.frameCount)
      await src.load()
      if (disposed) { src.close(); return null }
      return src
    }

    void (async () => {
      const lowSrc = await start(low.url)
      if (!lowSrc) return
      sourceRef.current = lowSrc
      if (chosen.url !== low.url) {
        const hiSrc = await start(chosen.url)
        if (!hiSrc) return
        const prev = sourceRef.current
        sourceRef.current = hiSrc
        if (prev && prev !== hiSrc) prev.close()
      }
    })()

    return () => {
      disposed = true
      sourceRef.current?.close()
      sourceRef.current = null
    }
  }, [animation])

  // Draw on every progress change.
  useEffect(() => {
    const canvas = canvasRef.current
    const src = sourceRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (canvas.width !== animation.width || canvas.height !== animation.height) {
      canvas.width = animation.width
      canvas.height = animation.height
    }
    src?.draw(ctx, frameIndexFor(progress, animation.frameCount), canvas.width, canvas.height)
  })

  return (
    <canvas
      ref={canvasRef}
      style={{ ...fill, objectFit: fit ?? 'cover', objectPosition: objectPosition ?? 'center', background: `center / cover no-repeat url(${animation.thumb || animation.poster})` }}
    />
  )
}

function VideoFallback({ animation, fit, objectPosition }: { animation: ResolvedAnimation; fit?: CSSProperties['objectFit']; objectPosition?: string }) {
  const chosen = selectRendition(animation.renditions, window.innerHeight, window.devicePixelRatio || 1, netHint())
  return (
    <video
      src={chosen.url} poster={animation.poster} muted loop playsInline autoPlay preload="auto"
      style={{ ...fill, objectFit: fit ?? 'cover', objectPosition: objectPosition ?? 'center' }}
    />
  )
}

export const AnimationWidget = markSlot(function AnimationWidget(props: AnimationWidgetProps) {
  const { animation, frames, fit, objectPosition } = props
  if (animation) {
    return supportsWebCodecs()
      ? <VideoScrub animation={animation} fit={fit} objectPosition={objectPosition} />
      : <VideoFallback animation={animation} fit={fit} objectPosition={objectPosition} />
  }
  if (frames) return <LegacyFrames frames={frames} {...props} />
  return null
}, 'widget')
```

- [ ] **Step 6: Typecheck + tests**

Run: `npm run typecheck --workspace @badcode/comic` — clean.
Run: `npm test --workspace @badcode/comic` — all green. (Note: the canvas-painting and WebCodecs paths aren't exercised by node tests — `frameIndexFor` and `selectRendition` are the tested logic; the paint is validated in Task 6's manual pass and by the spike.)

- [ ] **Step 7: Commit**

```bash
git add packages/comic/src/video/capabilities.ts packages/comic/src/video/capabilities.test.ts packages/comic/src/components/AnimationWidget.tsx
git commit -m "feat(comic): video AnimationWidget (WebCodecs scrub + selection + low->high + fallback)"
```

---

## Task 6: Migrate `camping-jack-test` + manual browser verification

Switches the worst-offender comic to the manifest-driven widgets and verifies the whole runtime in a browser. **Requires** Plan A's pipeline to have produced a committed `assets.manifest.json` for this comic (run Plan A Task 6 first). If that manifest does not exist yet, stop and report — this task is gated on it.

**Files:**
- Modify: `apps/web/src/comics/camping-jack-test/CampingJackTestComic.tsx`
- Reference: `apps/web/src/comics/camping-jack-test/assets.manifest.json` (produced by Plan A)

- [ ] **Step 1: Confirm the manifest exists**

Run: `test -f apps/web/src/comics/camping-jack-test/assets.manifest.json && echo present || echo MISSING`
Expected: `present`. If `MISSING`, stop — run Plan A's pipeline (`badcode assets-build`) for this comic's prefix first, writing `--manifest` to that path.

- [ ] **Step 2: Wire `createComic` and switch the widgets**

At the top of `apps/web/src/comics/camping-jack-test/CampingJackTestComic.tsx`, add:

```tsx
import { createComic } from '@badcode/comic'
import manifest from './assets.manifest.json'

const comic = createComic(manifest)
```

Then replace the widget call sites:
- Static images: `<ImageWidget src="https://storage.googleapis.com/.../main/6.png" />` → `<ImageWidget src={comic.resolve('<that asset's basePath-relative key>')} />`.
- Frame-sequence animations: `<AnimationWidget frames={[...]} />` → `<AnimationWidget animation={comic.resolveAnimation('<that animation folder's key>')} />`.

The keys are the manifest's `assets` / `animations` keys (paths relative to `basePath`). Map each existing URL/animation folder to its key by stripping the `basePath` prefix. Work through the file methodically; every `ImageWidget`/`AnimationWidget` should end up descriptor-driven.

- [ ] **Step 3: Typecheck + build**

Run: `npm run typecheck --workspace @badcode/web` — clean (JSON import of the manifest typechecks against `AssetManifest`-shaped data; if TS complains about importing `.json`, confirm `resolveJsonModule` is set in the web tsconfig — it is via `tsconfig.base.json`'s defaults, otherwise add it).
Run: `npm run build` (root) — succeeds.

- [ ] **Step 4: Manual browser verification**

Run `npm run dev`, open `http://localhost:5173/comics/camping-jack-test`, and verify:
- Pages show the ThumbHash blur instantly, then sharpen (low→high) — no black frames.
- Animations **scrub smoothly** with scroll; memory stays bounded on a long page (DevTools → Performance/Memory).
- On a phone (or DevTools device emulation + network throttling to 3g/Save-Data), a **smaller rendition** is selected.
- DevTools Network: an animation pulls **one small video** (not hundreds of frame requests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/comics/camping-jack-test/CampingJackTestComic.tsx
git commit -m "feat(web): camping-jack-test uses manifest-driven progressive widgets"
```

---

## Self-Review

**Spec coverage** (against `2026-06-16-progressive-comic-loading-design.md`, section B + contract):
- `createComic`/`resolve`/`resolveAnimation`, absolute-URL mapping, ThumbHash decode, degradation → Task 1. ✓
- `ResolvedImage`/`ResolvedAnimation` descriptors (named to avoid the manifest-type clash) → Task 1. ✓
- Adaptive rendition selection (size + Save-Data/effectiveType caps) → Task 2. ✓
- Windowed GOP decode + LRU eviction + draw-nearest (the spike's mechanism) → Task 3 (`gop.ts` pure + `VideoSource`). ✓
- Progressive `ImageWidget` thumb→low→high, string fallback → Task 4. ✓
- Video `AnimationWidget`: instant poster/thumb, selection, **low→high upgrade**, WebCodecs scrub, `<video>` fallback → Task 5. ✓
- `useScrollProgress`-driven frame mapping → Task 5 `frameIndexFor`. ✓
- Lifecycle: mount starts work, unmount aborts/closes (rolling window) → Task 4 (`mounted` guard) + Task 5 (`disposed` guard, `VideoSource.close()`). ✓
- Migration proof on `camping-jack-test` (both source kinds via the manifest) → Task 6. ✓
- Testing approach: pure units fully tested in vitep node; canvas/WebCodecs validated by spike + manual → Tasks 1–3,5 tests + Task 6 manual. ✓

**Placeholder scan:** No TBD/TODO; pure-logic steps have complete test + impl code; browser-only behavior is a concrete manual step (Task 6), not a vague test.

**Type consistency:** `ResolvedImage`/`ResolvedRendition`/`ResolvedAnimation`/`Comic` (Task 1) are consumed unchanged by Tasks 2 (`ResolvedRendition`), 4 (`ResolvedImage`), 5 (`ResolvedAnimation`). `selectRendition`/`lowestRendition`/`NetworkHint` (Task 2) match Task 5's imports. `gopBoundsFor`/`nearestCached`/`gopsToEvict` (Task 3 `gop.ts`) match `VideoSource`'s use. `VideoSource` ctor `(url, frameCount)` + `load()`/`draw(ctx,target,w,h)`/`close()` match Task 5's usage. `supportsWebCodecs`/`frameIndexFor` (Task 5) match their tests. `ImageWidget` `src: ResolvedImage | string` keeps the `camping` comic (string) compiling.

**Dependency note:** `mp4box` is imported as a real dep here (the spike used the esm.sh CDN). It is loosely typed; the `VideoSource` uses `any` casts at the mp4box boundary deliberately (no `@types/mp4box`).
