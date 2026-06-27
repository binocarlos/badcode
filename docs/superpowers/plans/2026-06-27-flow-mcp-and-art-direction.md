# Flow MCP server + art-direction skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Flow image/video generation off step-by-step model puppeteering into a deterministic MCP server (`@badcode/flow-mcp`), and add a `frontend-design`-style `badcode-art-direction` skill that owns prompt craft and the critique loop.

**Architecture:** A new TypeScript workspace package exposes generic MCP tools (`flow_status`, `flow_generate_image`, `flow_refine`, `flow_generate_video`). The server attaches to the existing logged-in Chrome over CDP (`:9222`, launched by `scripts/flow-chrome.sh`), drives Flow with the Playwright library, harvests the signed CDN URL, and writes the file with `fs`. A new skill encodes the BadCode visual identity, a calibration section, and a plan→critique→generate→critique loop, and `make-comic` is rewired to reference it.

**Tech Stack:** TypeScript (ESM, Node ≥22), `@modelcontextprotocol/sdk`, `playwright`, `zod`, `vitest`.

**Spec:** `docs/superpowers/specs/2026-06-27-flow-mcp-and-art-direction-design.md`
**Contract doc (Flow UI recipe):** `docs/superpowers/flow-selectors.md` — the authoritative selector/harvest map; keep it in sync if selectors drift.

## Global Constraints

- TypeScript ESM, `"type": "module"`, Node `>=22`. Every package `tsconfig.json` extends `../../tsconfig.base.json`.
- Tests use `vitest` (`import { describe, it, expect } from 'vitest'`), one `*.test.ts` beside each source file. Mirror `packages/cli/src/bucket-path.test.ts` style.
- Validation schemas use `zod` (`^3.23.8`, already used by `@badcode/comic-meta`).
- CDP endpoint: `http://localhost:9222` (override via `FLOW_CDP_PORT`). Flow URL: `https://labs.google/fx/tools/flow`. Persistent profile: `.flow-profile/` (git-ignored).
- The server NEVER launches the browser or logs in. It only attaches. Login stays manual via `scripts/flow-chrome.sh`.
- Tools never decide comic asset locations: every generation tool takes an explicit absolute `outPath` and returns the saved path. Repo/comic layout knowledge lives only in the skill/orchestrator.
- Locate Flow DOM by ARIA role + accessible name/placeholder/text, never by per-snapshot refs (`e123`).
- Commit after every task with a Conventional-Commit message. Co-author trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## Phase 1 — `@badcode/flow-mcp` server

### Task 1: Scaffold the `@badcode/flow-mcp` package

**Files:**
- Create: `packages/flow-mcp/package.json`
- Create: `packages/flow-mcp/tsconfig.json`
- Create: `packages/flow-mcp/src/index.ts`
- Create: `packages/flow-mcp/src/version.ts`
- Create: `packages/flow-mcp/src/version.test.ts`

**Interfaces:**
- Produces: package `@badcode/flow-mcp`; `export const NAME = 'flow'` and `export const VERSION = '0.0.0'` from `src/version.ts`.

- [ ] **Step 1: Create `packages/flow-mcp/package.json`**

```json
{
  "name": "@badcode/flow-mcp",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "description": "badcode — MCP server that drives Google Flow over CDP to generate images/videos.",
  "main": "./src/index.ts",
  "module": "./src/index.ts",
  "types": "./src/index.ts",
  "bin": {
    "badcode-flow-mcp": "./src/server.ts"
  },
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "start": "tsx src/server.ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "playwright": "^1.49.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `packages/flow-mcp/tsconfig.json`**

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

- [ ] **Step 3: Create `packages/flow-mcp/src/version.ts`**

```ts
/** MCP server identity. Kept tiny so other modules can import it without pulling in the SDK. */
export const NAME = 'flow'
export const VERSION = '0.0.0'
```

- [ ] **Step 4: Create `packages/flow-mcp/src/index.ts`**

```ts
export { NAME, VERSION } from './version'
```

- [ ] **Step 5: Write `packages/flow-mcp/src/version.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { NAME, VERSION } from './version'

describe('version', () => {
  it('exposes the server name', () => {
    expect(NAME).toBe('flow')
  })
  it('exposes a semver string', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
```

- [ ] **Step 6: Install and verify the workspace resolves**

Run: `npm install`
Expected: completes; `packages/flow-mcp` is picked up by the root `workspaces: ["packages/*"]` glob (no root edit needed). `playwright` is already present from earlier spikes.

- [ ] **Step 7: Run typecheck + tests**

Run: `npm run typecheck --workspace @badcode/flow-mcp && npm run test --workspace @badcode/flow-mcp`
Expected: typecheck passes; 2 tests pass.

- [ ] **Step 8: Commit**

```bash
git add packages/flow-mcp
git commit -m "feat(flow-mcp): scaffold @badcode/flow-mcp package

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Media-URL parsing helpers

**Files:**
- Create: `packages/flow-mcp/src/media-url.ts`
- Create: `packages/flow-mcp/src/media-url.test.ts`

**Interfaces:**
- Produces:
  - `isMediaSrc(src: string): boolean` — true if a URL/img-src is a Flow media redirect.
  - `parseMediaName(src: string): string | null` — extracts the `name` query param (the media UUID).
  - `mediaRedirectUrl(name: string): string` — builds the authenticated `getMediaUrlRedirect` URL.

- [ ] **Step 1: Write the failing test `packages/flow-mcp/src/media-url.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { isMediaSrc, parseMediaName, mediaRedirectUrl } from './media-url'

describe('media-url', () => {
  const redirect =
    'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=71ef7331-65aa-4e13-84cc-6e3a3e37fa45'

  it('recognises a media redirect URL', () => {
    expect(isMediaSrc(redirect)).toBe(true)
    expect(isMediaSrc('https://example.com/logo.png')).toBe(false)
  })

  it('extracts the media name (UUID)', () => {
    expect(parseMediaName(redirect)).toBe('71ef7331-65aa-4e13-84cc-6e3a3e37fa45')
  })

  it('extracts the name when other params precede it', () => {
    expect(parseMediaName('https://x/y?foo=1&name=abc-123&bar=2')).toBe('abc-123')
  })

  it('url-decodes the name', () => {
    expect(parseMediaName('https://x?name=a%2Fb')).toBe('a/b')
  })

  it('returns null when there is no name param', () => {
    expect(parseMediaName('https://example.com/logo.png')).toBeNull()
  })

  it('builds the redirect URL from a name', () => {
    expect(mediaRedirectUrl('abc-123')).toBe(
      'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=abc-123',
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/flow-mcp -- media-url`
Expected: FAIL — `Cannot find module './media-url'`.

- [ ] **Step 3: Write `packages/flow-mcp/src/media-url.ts`**

```ts
/** Flow serves generated media via an authenticated same-origin redirect endpoint. */
const REDIRECT_BASE = 'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect'

/** True if a URL or <img> src points at Flow's media redirect endpoint. */
export function isMediaSrc(src: string): boolean {
  return src.includes('getMediaUrlRedirect')
}

/** Pull the `name` query param (the media UUID) out of a redirect URL or img src. */
export function parseMediaName(src: string): string | null {
  const match = src.match(/[?&]name=([^&]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

/** Build the authenticated redirect URL for a media name. */
export function mediaRedirectUrl(name: string): string {
  return `${REDIRECT_BASE}?name=${name}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/flow-mcp -- media-url`
Expected: PASS (6 assertions).

- [ ] **Step 5: Commit**

```bash
git add packages/flow-mcp/src/media-url.ts packages/flow-mcp/src/media-url.test.ts
git commit -m "feat(flow-mcp): media-url parsing helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Active-canvas selection

**Files:**
- Create: `packages/flow-mcp/src/canvas.ts`
- Create: `packages/flow-mcp/src/canvas.test.ts`

**Interfaces:**
- Produces:
  - `interface CanvasImg { name: string; width: number; height: number }`
  - `pickActiveCanvas(imgs: CanvasImg[]): string | null` — returns the media name of the largest on-screen image (Flow's "active canvas" heuristic), or null if none qualify.

- [ ] **Step 1: Write the failing test `packages/flow-mcp/src/canvas.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { pickActiveCanvas, type CanvasImg } from './canvas'

describe('pickActiveCanvas', () => {
  it('returns the name of the largest image by area', () => {
    const imgs: CanvasImg[] = [
      { name: 'thumb', width: 80, height: 80 },
      { name: 'active', width: 1376, height: 768 },
      { name: 'medium', width: 400, height: 400 },
    ]
    expect(pickActiveCanvas(imgs)).toBe('active')
  })

  it('ignores entries with an empty name', () => {
    const imgs: CanvasImg[] = [
      { name: '', width: 9999, height: 9999 },
      { name: 'real', width: 100, height: 100 },
    ]
    expect(pickActiveCanvas(imgs)).toBe('real')
  })

  it('returns null when there are no candidates', () => {
    expect(pickActiveCanvas([])).toBeNull()
    expect(pickActiveCanvas([{ name: '', width: 10, height: 10 }])).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/flow-mcp -- canvas`
Expected: FAIL — `Cannot find module './canvas'`.

- [ ] **Step 3: Write `packages/flow-mcp/src/canvas.ts`**

```ts
/** A generated <img> on the Flow canvas, reduced to what selection needs. */
export interface CanvasImg {
  /** Media UUID parsed from the img src; '' if absent. */
  name: string
  width: number
  height: number
}

/**
 * Flow can show several generated images at once (thumbnails + the active one).
 * The active canvas is the largest on-screen image with a media name.
 */
export function pickActiveCanvas(imgs: CanvasImg[]): string | null {
  let best: CanvasImg | null = null
  for (const im of imgs) {
    if (!im.name) continue
    if (!best || im.width * im.height > best.width * best.height) best = im
  }
  return best ? best.name : null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/flow-mcp -- canvas`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add packages/flow-mcp/src/canvas.ts packages/flow-mcp/src/canvas.test.ts
git commit -m "feat(flow-mcp): active-canvas selection heuristic

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Harvest — resolve signed URL and write to disk

**Files:**
- Create: `packages/flow-mcp/src/harvest.ts`
- Create: `packages/flow-mcp/src/harvest.test.ts`

**Interfaces:**
- Consumes: `mediaRedirectUrl` (Task 2).
- Produces:
  - `interface RequestLike { get(url: string): Promise<ResponseLike> }`
  - `interface ResponseLike { url(): string; body(): Promise<Buffer>; headers(): Record<string, string> }`
  - `resolveSignedUrl(request: RequestLike, name: string): Promise<string>` — follows the redirect server-side, returns the signed CDN URL.
  - `harvestToFile(request: RequestLike, name: string, outPath: string): Promise<void>` — downloads the bytes and writes them.
  - `contentTypeOf(request: RequestLike, name: string): Promise<string>` — used for video completion polling.

These interfaces are structural subsets of Playwright's `APIRequestContext` / `APIResponse`, so the real `page.request` satisfies them and tests can pass fakes.

- [ ] **Step 1: Write the failing test `packages/flow-mcp/src/harvest.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { resolveSignedUrl, harvestToFile, contentTypeOf, type RequestLike } from './harvest'

function fakeRequest(opts: {
  finalUrl: string
  body?: Buffer
  contentType?: string
}): RequestLike {
  return {
    get: vi.fn(async (url: string) => ({
      url: () => opts.finalUrl,
      body: async () => opts.body ?? Buffer.from(''),
      headers: () => ({ 'content-type': opts.contentType ?? 'image/jpeg' }),
    })),
  }
}

describe('harvest', () => {
  const signed =
    'https://flow-content.google/image/uuid?Expires=1&KeyName=k&Signature=s'

  it('resolves the signed CDN URL via the redirect', async () => {
    const req = fakeRequest({ finalUrl: signed })
    expect(await resolveSignedUrl(req, 'uuid')).toBe(signed)
    expect(req.get).toHaveBeenCalledWith(
      'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=uuid',
    )
  })

  it('downloads the bytes and writes them to outPath', async () => {
    const bytes = Buffer.from('JPEGDATA')
    const req = fakeRequest({ finalUrl: signed, body: bytes })
    const dir = await mkdtemp(join(tmpdir(), 'flow-harvest-'))
    const out = join(dir, 'p05.jpg')
    await harvestToFile(req, 'uuid', out)
    expect(await readFile(out)).toEqual(bytes)
  })

  it('reads the content-type for completion polling', async () => {
    const req = fakeRequest({ finalUrl: signed, contentType: 'video/mp4' })
    expect(await contentTypeOf(req, 'uuid')).toBe('video/mp4')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/flow-mcp -- harvest`
Expected: FAIL — `Cannot find module './harvest'`.

- [ ] **Step 3: Write `packages/flow-mcp/src/harvest.ts`**

```ts
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { mediaRedirectUrl } from './media-url'

/** Structural subset of Playwright's APIResponse. */
export interface ResponseLike {
  url(): string
  body(): Promise<Buffer>
  headers(): Record<string, string>
}

/** Structural subset of Playwright's APIRequestContext (`page.request`). */
export interface RequestLike {
  get(url: string): Promise<ResponseLike>
}

/**
 * The generated <img> src is an authenticated same-origin redirect that an
 * in-page fetch() can't follow (CORS). Playwright's request context follows it
 * server-side with the browser's cookies and exposes the final signed CDN URL.
 */
export async function resolveSignedUrl(request: RequestLike, name: string): Promise<string> {
  const resp = await request.get(mediaRedirectUrl(name))
  return resp.url()
}

/** Download the media bytes (full Node fs — no curl/sandbox handoff) to outPath. */
export async function harvestToFile(
  request: RequestLike,
  name: string,
  outPath: string,
): Promise<void> {
  const resp = await request.get(mediaRedirectUrl(name))
  const bytes = await resp.body()
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, bytes)
}

/** Resolve the media's content-type (e.g. 'video/mp4') — the reliable video-ready signal. */
export async function contentTypeOf(request: RequestLike, name: string): Promise<string> {
  const resp = await request.get(mediaRedirectUrl(name))
  return resp.headers()['content-type'] ?? ''
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/flow-mcp -- harvest`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add packages/flow-mcp/src/harvest.ts packages/flow-mcp/src/harvest.test.ts
git commit -m "feat(flow-mcp): signed-URL harvest to disk

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Structured tool results & errors

**Files:**
- Create: `packages/flow-mcp/src/result.ts`
- Create: `packages/flow-mcp/src/result.test.ts`

**Interfaces:**
- Produces:
  - `interface ToolResult { content: { type: 'text'; text: string }[]; structuredContent?: unknown; isError?: boolean }`
  - `ok(data: unknown): ToolResult` — success, JSON-encodes `data` into both text and `structuredContent`.
  - `fail(code: string, message: string, hint?: string): ToolResult` — `isError: true`, JSON body `{ error: true, code, message, hint? }`.
  - `NOT_RUNNING_HINT: string` — reused hint pointing at `scripts/flow-chrome.sh`.

- [ ] **Step 1: Write the failing test `packages/flow-mcp/src/result.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { ok, fail, NOT_RUNNING_HINT } from './result'

describe('tool results', () => {
  it('wraps success data in text + structuredContent', () => {
    const r = ok({ path: '/tmp/p05.jpg', mediaId: 'uuid' })
    expect(r.isError).toBeUndefined()
    expect(r.structuredContent).toEqual({ path: '/tmp/p05.jpg', mediaId: 'uuid' })
    expect(JSON.parse(r.content[0].text)).toEqual({ path: '/tmp/p05.jpg', mediaId: 'uuid' })
  })

  it('marks failures and carries code/message/hint', () => {
    const r = fail('NOT_RUNNING', 'Chrome is not reachable on :9222', NOT_RUNNING_HINT)
    expect(r.isError).toBe(true)
    expect(JSON.parse(r.content[0].text)).toEqual({
      error: true,
      code: 'NOT_RUNNING',
      message: 'Chrome is not reachable on :9222',
      hint: NOT_RUNNING_HINT,
    })
  })

  it('omits hint when not provided', () => {
    const r = fail('TIMEOUT', 'generation timed out')
    expect(JSON.parse(r.content[0].text)).toEqual({
      error: true,
      code: 'TIMEOUT',
      message: 'generation timed out',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/flow-mcp -- result`
Expected: FAIL — `Cannot find module './result'`.

- [ ] **Step 3: Write `packages/flow-mcp/src/result.ts`**

```ts
/** MCP tool return shape (subset of the SDK's CallToolResult). */
export interface ToolResult {
  content: { type: 'text'; text: string }[]
  structuredContent?: unknown
  isError?: boolean
}

export const NOT_RUNNING_HINT =
  'Run `./scripts/flow-chrome.sh` and log into Google/Flow, then retry.'

/** Success: encode data as JSON text and as structuredContent. */
export function ok(data: unknown): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data) }],
    structuredContent: data,
  }
}

/** Failure: a structured error the caller (skill) can branch on. */
export function fail(code: string, message: string, hint?: string): ToolResult {
  const body = hint
    ? { error: true, code, message, hint }
    : { error: true, code, message }
  return { content: [{ type: 'text', text: JSON.stringify(body) }], isError: true }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/flow-mcp -- result`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add packages/flow-mcp/src/result.ts packages/flow-mcp/src/result.test.ts
git commit -m "feat(flow-mcp): structured tool result + error helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: The Flow client (Playwright driver)

This task wires the tested helpers to the real browser. The browser-driving methods can't be unit-tested without a live Flow session, so the gate is **typecheck + the page-evaluation helpers being pure**. The pure DOM-reading helper (`readCanvasImgs`'s parser) is unit-tested; the orchestration methods are validated by the smoke script in Task 8.

**Files:**
- Create: `packages/flow-mcp/src/dom.ts` (pure browser-context snippet builders + parsers)
- Create: `packages/flow-mcp/src/dom.test.ts`
- Create: `packages/flow-mcp/src/flow-client.ts`

**Interfaces:**
- Consumes: `isMediaSrc`, `parseMediaName` (Task 2); `pickActiveCanvas`, `CanvasImg` (Task 3); `resolveSignedUrl`, `harvestToFile`, `contentTypeOf` (Task 4).
- Produces:
  - `toCanvasImgs(raw: { src: string; width: number; height: number }[]): CanvasImg[]` — maps raw DOM-scraped img descriptors to `CanvasImg` (filters non-media, parses names). Pure, tested.
  - `class FlowClient` with:
    - `static connect(endpoint?: string): Promise<FlowClient>`
    - `status(): Promise<{ loggedIn: boolean; projectOpen: boolean; url: string }>`
    - `generateImage(prompt: string, outPath: string): Promise<{ path: string; mediaId: string; width: number; height: number }>`
    - `refine(prompt: string, outPath: string): Promise<{ path: string; mediaId: string }>`
    - `generateVideo(imagePath: string, motion: string, outPath: string, model?: string): Promise<{ path: string; mediaId: string }>`
    - `close(): Promise<void>`

- [ ] **Step 1: Write the failing test `packages/flow-mcp/src/dom.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { toCanvasImgs } from './dom'

describe('toCanvasImgs', () => {
  it('keeps only media imgs and parses their names', () => {
    const raw = [
      { src: 'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=aaa', width: 1376, height: 768 },
      { src: 'https://example.com/icon.svg', width: 24, height: 24 },
      { src: 'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=bbb', width: 80, height: 80 },
    ]
    expect(toCanvasImgs(raw)).toEqual([
      { name: 'aaa', width: 1376, height: 768 },
      { name: 'bbb', width: 80, height: 80 },
    ])
  })

  it('drops media imgs whose name fails to parse', () => {
    const raw = [{ src: 'getMediaUrlRedirect?notname=x', width: 10, height: 10 }]
    expect(toCanvasImgs(raw)).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/flow-mcp -- dom`
Expected: FAIL — `Cannot find module './dom'`.

- [ ] **Step 3: Write `packages/flow-mcp/src/dom.ts`**

```ts
import { isMediaSrc, parseMediaName } from './media-url'
import type { CanvasImg } from './canvas'

/** Raw <img> descriptor as scraped from the page in a browser-context eval. */
export interface RawImg {
  src: string
  width: number
  height: number
}

/** The function string evaluated inside the page to scrape generated <img>s. */
export const SCRAPE_IMGS = `() => [...document.querySelectorAll('img')].map(im => ({
  src: im.currentSrc || im.src || '',
  width: im.getBoundingClientRect().width,
  height: im.getBoundingClientRect().height,
}))`

/** Map raw scraped imgs to media CanvasImgs (filter non-media, parse names). */
export function toCanvasImgs(raw: RawImg[]): CanvasImg[] {
  const out: CanvasImg[] = []
  for (const im of raw) {
    if (!isMediaSrc(im.src)) continue
    const name = parseMediaName(im.src)
    if (!name) continue
    out.push({ name, width: im.width, height: im.height })
  }
  return out
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/flow-mcp -- dom`
Expected: PASS (2 assertions).

- [ ] **Step 5: Write `packages/flow-mcp/src/flow-client.ts`**

> Selectors come from `docs/superpowers/flow-selectors.md` and `docs/superpowers/flow-video.md`. If Flow's UI drifts, fix them here AND update those docs.

```ts
import { chromium, type Browser, type Page } from 'playwright'
import { pickActiveCanvas } from './canvas'
import { toCanvasImgs, SCRAPE_IMGS, type RawImg } from './dom'
import { resolveSignedUrl, harvestToFile, contentTypeOf } from './harvest'

const FLOW_URL = 'https://labs.google/fx/tools/flow'
const DEFAULT_ENDPOINT = `http://localhost:${process.env.FLOW_CDP_PORT ?? '9222'}`
const TURN_TIMEOUT_MS = 90_000
const VIDEO_TIMEOUT_MS = 8 * 60_000
const POLL_MS = 5_000

export interface ImageResult { path: string; mediaId: string; width: number; height: number }
export interface MediaResult { path: string; mediaId: string }
export interface FlowStatus { loggedIn: boolean; projectOpen: boolean; url: string }

export class FlowClient {
  private constructor(private browser: Browser, private page: Page) {}

  /** Attach to the already-logged-in Chrome launched by scripts/flow-chrome.sh. */
  static async connect(endpoint = DEFAULT_ENDPOINT): Promise<FlowClient> {
    const browser = await chromium.connectOverCDP(endpoint)
    const context = browser.contexts()[0]
    if (!context) throw new Error('NO_CONTEXT')
    const pages = context.pages()
    let page = pages.find((p) => p.url().includes('labs.google/fx/tools/flow'))
    if (!page) {
      page = pages[0] ?? (await context.newPage())
      await page.goto(FLOW_URL, { waitUntil: 'domcontentloaded' })
    }
    return new FlowClient(browser, page)
  }

  async status(): Promise<FlowStatus> {
    const url = this.page.url()
    // Logged out → Flow bounces to an accounts/sign-in URL.
    const loggedIn = !/accounts\.google\.com|signin/i.test(url) && url.includes('labs.google')
    const projectOpen = /\/project\//.test(url)
    return { loggedIn, projectOpen, url }
  }

  private async ensureProject(): Promise<void> {
    if (/\/project\//.test(this.page.url())) return
    const newProject = this.page.getByRole('button', { name: /New project/i })
    await newProject.click()
    await this.page.waitForURL(/\/project\//, { timeout: TURN_TIMEOUT_MS })
  }

  private async submitPrompt(prompt: string): Promise<void> {
    const box = this.page.getByRole('textbox', { name: /What do you want to create/i })
    await box.fill(prompt)
    await this.page.getByRole('button', { name: /Create/i }).click()
  }

  /** Poll the canvas until a media img is present, then return its name + size. */
  private async waitForActiveCanvas(timeoutMs: number): Promise<{ name: string; width: number; height: number }> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const raw = (await this.page.evaluate(SCRAPE_IMGS)) as RawImg[]
      const imgs = toCanvasImgs(raw)
      const name = pickActiveCanvas(imgs)
      if (name) {
        const hit = imgs.find((i) => i.name === name)!
        return { name, width: Math.round(hit.width), height: Math.round(hit.height) }
      }
      await this.page.waitForTimeout(POLL_MS)
    }
    throw new Error('TIMEOUT')
  }

  async generateImage(prompt: string, outPath: string): Promise<ImageResult> {
    await this.ensureProject()
    await this.submitPrompt(prompt)
    const { name, width, height } = await this.waitForActiveCanvas(TURN_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name, width, height }
  }

  /** Follow-up correction in the SAME session, then harvest the new active canvas. */
  async refine(prompt: string, outPath: string): Promise<MediaResult> {
    await this.submitPrompt(prompt)
    const { name } = await this.waitForActiveCanvas(TURN_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name }
  }

  async generateVideo(
    imagePath: string,
    motion: string,
    outPath: string,
    _model?: string,
  ): Promise<MediaResult> {
    await this.ensureProject()
    // Upload the source frame via Add Media → file chooser.
    const chooser = this.page.waitForEvent('filechooser')
    await this.page.getByRole('button', { name: /Add Media/i }).click()
    await (await chooser).setFiles(imagePath)
    // Attach as animation source, then prompt + create. (See flow-video.md.)
    await this.submitPrompt(motion)
    // Video is ready when the media's content-type is video/*.
    const name = await this.waitForVideo(VIDEO_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name }
  }

  private async waitForVideo(timeoutMs: number): Promise<string> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const raw = (await this.page.evaluate(SCRAPE_IMGS)) as RawImg[]
      const name = pickActiveCanvas(toCanvasImgs(raw))
      if (name) {
        const ct = await contentTypeOf(this.page.request, name)
        if (ct.startsWith('video/')) return name
      }
      await this.page.waitForTimeout(POLL_MS)
    }
    throw new Error('TIMEOUT')
  }

  async close(): Promise<void> {
    await this.browser.close()
  }
}
```

> NOTE for the implementer: `generateVideo` covers the documented happy path. The credit-approval gate, model pre-selection (Veo 3.1 — Quality), and `more_vert → Animate` attachment described in `flow-video.md` are refined against the live tool during the Task 8 smoke run; capture any selector corrections back into `flow-video.md`. Video is exercised by the smoke script only after images work end to end.

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck --workspace @badcode/flow-mcp`
Expected: passes.

- [ ] **Step 7: Run all package tests (helpers still green)**

Run: `npm run test --workspace @badcode/flow-mcp`
Expected: PASS (version, media-url, canvas, harvest, result, dom).

- [ ] **Step 8: Commit**

```bash
git add packages/flow-mcp/src/dom.ts packages/flow-mcp/src/dom.test.ts packages/flow-mcp/src/flow-client.ts
git commit -m "feat(flow-mcp): Playwright Flow client (connect, generate, refine, video)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: MCP server wiring

**Files:**
- Create: `packages/flow-mcp/src/server.ts`
- Modify: `.mcp.json` (add the `flow` server)

**Interfaces:**
- Consumes: `FlowClient` (Task 6); `ok`, `fail`, `NOT_RUNNING_HINT` (Task 5); `NAME`, `VERSION` (Task 1).
- Produces: a runnable stdio MCP server exposing `flow_status`, `flow_generate_image`, `flow_refine`, `flow_generate_video`.

- [ ] **Step 1: Write `packages/flow-mcp/src/server.ts`**

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { NAME, VERSION } from './version'
import { FlowClient } from './flow-client'
import { ok, fail, NOT_RUNNING_HINT, type ToolResult } from './result'

/** Connect per call: the browser is long-lived; the CDP attach is cheap and avoids stale handles. */
async function withClient<T>(fn: (c: FlowClient) => Promise<T>): Promise<T> {
  const client = await FlowClient.connect()
  try {
    return await fn(client)
  } finally {
    await client.close() // detaches the CDP connection; does NOT close the user's Chrome
  }
}

function toToolError(err: unknown): ToolResult {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('ECONNREFUSED') || msg === 'NO_CONTEXT') {
    return fail('NOT_RUNNING', 'Could not attach to Chrome on the CDP port.', NOT_RUNNING_HINT)
  }
  if (msg === 'TIMEOUT') return fail('TIMEOUT', 'Flow did not finish generating in time.')
  return fail('FLOW_ERROR', msg)
}

const server = new McpServer({ name: NAME, version: VERSION })

server.registerTool(
  'flow_status',
  {
    title: 'Flow status',
    description: 'Check whether the Flow browser is attached and logged in.',
    inputSchema: {},
  },
  async () => {
    try {
      return await withClient(async (c) => ok(await c.status()))
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_generate_image',
  {
    title: 'Generate image',
    description:
      'Generate ONE image in Flow from a prompt and save it to outPath (absolute). Returns { path, mediaId, width, height }.',
    inputSchema: {
      prompt: z.string().min(1),
      outPath: z.string().min(1),
    },
  },
  async ({ prompt, outPath }) => {
    try {
      return await withClient(async (c) => ok(await c.generateImage(prompt, outPath)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_refine',
  {
    title: 'Refine last image',
    description:
      'Send a follow-up correction in the SAME Flow session and save the new image to outPath. Returns { path, mediaId }.',
    inputSchema: {
      prompt: z.string().min(1),
      outPath: z.string().min(1),
    },
  },
  async ({ prompt, outPath }) => {
    try {
      return await withClient(async (c) => ok(await c.refine(prompt, outPath)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

server.registerTool(
  'flow_generate_video',
  {
    title: 'Generate video',
    description:
      'Animate an image (image→video / Veo). Uploads imagePath, applies the motion prompt, saves the .mp4 to outPath. Returns { path, mediaId }.',
    inputSchema: {
      imagePath: z.string().min(1),
      motion: z.string().min(1),
      model: z.string().optional(),
      outPath: z.string().min(1),
    },
  },
  async ({ imagePath, motion, model, outPath }) => {
    try {
      return await withClient(async (c) => ok(await c.generateVideo(imagePath, motion, outPath, model)))
    } catch (err) {
      return toToolError(err)
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
```

> If `registerTool` is unavailable in the installed SDK minor version, use `server.tool(name, inputSchemaShape, handler)` — same handler bodies. Confirm against `node_modules/@modelcontextprotocol/sdk` after install.

- [ ] **Step 2: Typecheck the server**

Run: `npm run typecheck --workspace @badcode/flow-mcp`
Expected: passes.

- [ ] **Step 3: Verify the server boots and lists tools**

Run:
```bash
printf '%s\n' \
'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}' \
'{"jsonrpc":"2.0","method":"notifications/initialized"}' \
'{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
| npx --workspace @badcode/flow-mcp tsx packages/flow-mcp/src/server.ts
```
Expected: JSON-RPC responses on stdout; the `tools/list` reply names `flow_status`, `flow_generate_image`, `flow_refine`, `flow_generate_video`. (No browser needed — tools aren't invoked.) Ctrl-C to exit.

- [ ] **Step 4: Register the server in `.mcp.json`**

Change `.mcp.json` to add the `flow` server alongside `playwright`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--cdp-endpoint", "http://localhost:9222"]
    },
    "flow": {
      "command": "npx",
      "args": ["tsx", "packages/flow-mcp/src/server.ts"]
    }
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add packages/flow-mcp/src/server.ts .mcp.json
git commit -m "feat(flow-mcp): MCP server wiring + .mcp.json registration

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: End-to-end smoke script + README

**Files:**
- Create: `packages/flow-mcp/src/smoke.ts`
- Create: `packages/flow-mcp/README.md`

**Interfaces:**
- Consumes: `FlowClient` (Task 6).
- Produces: a manual script that proves real generation works against a logged-in Flow.

- [ ] **Step 1: Write `packages/flow-mcp/src/smoke.ts`**

```ts
/**
 * Manual smoke test — NOT part of CI.
 * Pre-req: run `./scripts/flow-chrome.sh` and log into Flow first.
 * Usage: npx tsx packages/flow-mcp/src/smoke.ts
 */
import { mkdtemp } from 'node:fs/promises'
import { stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const client = await FlowClient.connect()
try {
  console.log('status:', await client.status())
  const dir = await mkdtemp(join(tmpdir(), 'flow-smoke-'))
  const out = join(dir, 'smoke.jpg')
  const res = await client.generateImage(
    'A single landscape image: an empty office at golden hour, one overturned chair. Cinematic but grounded.',
    out,
  )
  const { size } = await stat(res.path)
  console.log('generated:', res, 'bytes:', size)
  if (size < 1000) throw new Error('file suspiciously small')
  console.log('SMOKE OK')
} finally {
  await client.close()
}
```

- [ ] **Step 2: Run the smoke script against live Flow**

Pre-req: a separate terminal running `./scripts/flow-chrome.sh`, logged in.
Run: `npx tsx packages/flow-mcp/src/smoke.ts`
Expected: prints `status: { loggedIn: true, ... }`, then `generated: {...}` with a >1KB file, then `SMOKE OK`. If selectors have drifted, fix `flow-client.ts` + update `flow-selectors.md`, then re-run.

- [ ] **Step 3: Write `packages/flow-mcp/README.md`**

````markdown
# @badcode/flow-mcp

MCP server that drives Google Flow over CDP to generate images/videos and harvest them to disk.

## Prerequisites
1. `./scripts/flow-chrome.sh` — launches Chrome on CDP `:9222` with the persistent
   `.flow-profile/`. Log into Google/Flow once in that window and leave it running.

## Tools
- `flow_status()` → `{ loggedIn, projectOpen, url }`
- `flow_generate_image({ prompt, outPath })` → `{ path, mediaId, width, height }`
- `flow_refine({ prompt, outPath })` → `{ path, mediaId }` (same session)
- `flow_generate_video({ imagePath, motion, model?, outPath })` → `{ path, mediaId }`

All `outPath` values are absolute; the server never decides where comic assets live.

## Smoke test
`npx tsx packages/flow-mcp/src/smoke.ts` (needs a logged-in Flow window).

## Selector contract
`docs/superpowers/flow-selectors.md` (images) and `docs/superpowers/flow-video.md` (video).
If Flow's UI drifts, fix `src/flow-client.ts` and update those docs.
````

- [ ] **Step 4: Commit**

```bash
git add packages/flow-mcp/src/smoke.ts packages/flow-mcp/README.md
git commit -m "test(flow-mcp): manual e2e smoke script + README

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase 2 — `badcode-art-direction` skill

### Task 9: Write the art-direction skill

**Files:**
- Create: `.claude/skills/badcode-art-direction/SKILL.md`

**Interfaces:**
- Consumes: the `flow_generate_image` / `flow_refine` tools (Phase 1); `docs/voice.md`; existing comics under `apps/web/src/comics/` and storyboards under `docs/<story>/`.
- Produces: a skill that orchestrators reference for image prompt craft + critique.

- [ ] **Step 1: Study the existing comics for the calibration section**

Read, and take notes on the concrete visual identity (palette, framing, line/render quality, mood) of:
- `docs/camping/` storyboard records + `apps/web/src/comics/camping/`
- `docs/karen/` (or the Karen comic dir) storyboard + comic component
- `docs/magic-money-tree/`
Capture 4–6 concrete, BadCode-specific visual traits and 3–4 generic-AI-comic traits to avoid. These notes become the Identity + Calibration sections — they must be specific, not generic.

- [ ] **Step 2: Write `.claude/skills/badcode-art-direction/SKILL.md`**

Use this structure (fill Identity/Calibration from Step 1 notes — no placeholders in the final file):

```markdown
---
name: badcode-art-direction
description: Use when generating or refining a still image for a BadCode comic panel or character — encodes the BadCode visual identity, a calibration section against the generic AI-comic look, and a plan→critique→generate→critique loop over the Flow MCP tools. Triggers on "generate the panel image", "make the image for panel N", "art-direct this panel", or any image-generation step inside make-comic.
---

# BadCode Art Direction

You are the art director for BadCode. Every panel must look unmistakably like BadCode and never like a generic AI comic. Make deliberate, opinionated choices grounded in the story's world.

## Prerequisite
Image generation runs through the `flow` MCP server (`flow_generate_image`, `flow_refine`).
If a call returns `{ error: true, code: "NOT_RUNNING" }`, tell the user to run
`./scripts/flow-chrome.sh` and log in, then retry. (See `packages/flow-mcp/README.md`.)

## Identity — what a BadCode panel looks like
<4–6 concrete traits from Step 1: palette, framing, render/line quality, light, mood,
recurring motifs. Specific to BadCode, drawn from camping/karen/magic-money-tree.>

## Calibration — the generic AI-comic look to AVOID
Right now AI comic art clusters around: <3–4 concrete defaults from Step 1, e.g.
over-rendered Midjourney sheen, default "cinematic" rim-lighting, glossy plastic skin,
symmetrical hero framing>. These are defaults, not choices. Where the beat pins a look,
follow it; where it leaves an axis free, do NOT spend that freedom on these defaults.

## The loop (per panel)
1. **Plan** the prompt from the panel beat + canon (`docs/<story>/storyboard/`), in the
   BadCode house style. Shape: house-style preamble + scene; for character scenes name
   the character.
2. **Critique the prompt** before sending: does it read like a generic comic panel, or
   like THIS beat and our voice (`docs/voice.md`)? Revise; say what you changed.
3. **Generate** → `flow_generate_image({ prompt, outPath: "<abs>/docs/<story>/storyboard/img/pNN.png" })`.
4. **Look** at the returned file. Critique against the beat and the Calibration list.
5. **Refine or accept** → if weak, `flow_refine({ prompt: "<correction>", outPath })` in
   the same session; else accept.

## Record
Write `docs/<story>/storyboard/pNN.md` with the EXACT prompt sent and a revision-log
entry (matching the existing storyboard record format), so "just like that but change X"
is one cheap `flow_refine`.

## Scope
Stills only. Motion/Veo direction is future work; `animate-slide` is unchanged.
```

- [ ] **Step 3: Verify the skill is discoverable and has no placeholders**

Run: `grep -n "<.*from Step 1.*>\|<4–6\|<3–4\|TODO\|TBD" .claude/skills/badcode-art-direction/SKILL.md`
Expected: no matches (all bracketed guidance replaced with real content).
Then confirm frontmatter `name`/`description` are present:
Run: `head -4 .claude/skills/badcode-art-direction/SKILL.md`
Expected: valid frontmatter block.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/badcode-art-direction/SKILL.md
git commit -m "feat(skill): badcode-art-direction — identity, calibration, critique loop

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Rewire `make-comic` to reference the skill

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md` (the Flow-engine / image-generation sections of Stages 3 and 5)

**Interfaces:**
- Consumes: `badcode-art-direction` (Task 9); the `flow` MCP tools (Phase 1).

- [ ] **Step 1: Locate the inline image/prompt guidance in make-comic**

Run: `grep -n "Flow engine\|Generated image\|browser_run_code_unsafe\|getMediaUrlRedirect\|curl\|prompt shape\|house style" .claude/skills/make-comic/SKILL.md`
Expected: lists the Stage 3/5 mechanics + prompt-guidance lines to replace.

- [ ] **Step 2: Replace the mechanics with tool + skill references**

In Stage 3 (character images) and Stage 5 (storyboard images), remove the Playwright/CDP step-by-step (navigate / New project / type / Create / harvest / curl) and the inline prompt-shape prose. Replace each with:

```markdown
Image generation is now deterministic via the `flow` MCP server, and prompt craft +
critique live in the **`badcode-art-direction`** skill — invoke it for every image.
Per image: the art-direction skill plans + critiques the prompt, calls
`flow_generate_image({ prompt, outPath })` (or `flow_refine` to correct in-session),
and records the prompt + revision in `docs/<story>/storyboard/pNN.md`.

Prerequisite: `./scripts/flow-chrome.sh` running and logged in (see
`packages/flow-mcp/README.md`). Do NOT puppeteer Flow via the Playwright MCP by hand.
```

Keep everything non-image in those stages (casting, file layout, push/assets-build) intact.

- [ ] **Step 3: Verify the old mechanics are gone and references are present**

Run: `grep -n "browser_run_code_unsafe\|getMediaUrlRedirect\|curl .*signed" .claude/skills/make-comic/SKILL.md`
Expected: no matches (manual harvest prose removed).
Run: `grep -n "badcode-art-direction\|flow_generate_image" .claude/skills/make-comic/SKILL.md`
Expected: present in both Stage 3 and Stage 5.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "refactor(skill): make-comic delegates image gen to flow MCP + art-direction

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Final verification

- [ ] **Repo-wide typecheck + tests**

Run: `npm run typecheck && npm run test`
Expected: all workspaces pass (including the new `@badcode/flow-mcp` unit tests).

- [ ] **Manual end-to-end (optional, needs login)**

With `./scripts/flow-chrome.sh` logged in, run `npx tsx packages/flow-mcp/src/smoke.ts` → `SMOKE OK`.

---

## Notes on what is intentionally NOT here (future work)

- Plugin packaging (`.claude-plugin/plugin.json` + marketplace) — only if reuse across other repos / sharing becomes a real need.
- Reference/character consistency across frames — the spike's biggest open quality risk.
- Motion/Veo art direction encoded in a skill.
- Aspect-ratio pinning beyond "landscape".
