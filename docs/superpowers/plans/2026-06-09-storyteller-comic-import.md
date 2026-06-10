# Storyteller Comic Import — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two CLI commands in `@badcode/cli` — `pull` fetches a comic's data and assets from the Storyteller API at badcode.tv, `generate` converts the pulled data into a badcode comic scaffold (TSX + meta).

**Architecture:** Phase 1 (`pull`) authenticates via JWT, fetches the comic JSON, and downloads all image/animation-frame assets to `public/comics/<slug>/`. Phase 2 (`generate`) reads the saved `comic.json` and emits a `<Slug>Comic.tsx` component + `comic.meta.ts` file. Both commands are added to the existing `commander`-based CLI in `packages/cli/src/bin.ts`.

**Tech Stack:** TypeScript, Node 22 native `fetch`, `commander` (already installed), `vitest` (already installed). No new dependencies.

---

## File Structure

| File | Responsibility |
|---|---|
| `packages/cli/src/storyteller-types.ts` | TypeScript types mirroring the Storyteller API response shape |
| `packages/cli/src/storyteller-auth.ts` | Login to badcode.tv, return JWT token |
| `packages/cli/src/pull.ts` | Fetch comic JSON + download assets |
| `packages/cli/src/tail-map.ts` | Map Storyteller bubble directions to BadCode TailDirection |
| `packages/cli/src/generate.ts` | Read comic.json, emit TSX + meta files |
| `packages/cli/src/bin.ts` | Wire up `pull` and `generate` commands (existing file) |
| `packages/cli/src/storyteller-auth.test.ts` | Tests for auth (mocked fetch) |
| `packages/cli/src/pull.test.ts` | Tests for pull logic (mocked fetch + fs) |
| `packages/cli/src/tail-map.test.ts` | Tests for direction mapping |
| `packages/cli/src/generate.test.ts` | Tests for code generation |
| `scripts/video-to-frames.md` | ffmpeg documentation for splitting video to frames |

---

### Task 1: Storyteller Types

**Files:**
- Create: `packages/cli/src/storyteller-types.ts`

These types mirror the Storyteller API response. Copied from the auto-generated `gotypes.ts` in the storyteller frontend, keeping only the fields we need for pull + generate.

- [ ] **Step 1: Create the types file**

```typescript
// packages/cli/src/storyteller-types.ts

export interface StorytellerMedia {
  id: string
  prompt: string
  media_type: string
  path: string
}

export interface StorytellerAnimationFrame {
  index: number
  path: string
  url: string
}

export interface StorytellerAnimationData {
  method: string
  frame_count: number
  transition_prompt: string
  frames: StorytellerAnimationFrame[]
  status: string
}

export interface StorytellerTextBubble {
  id: string
  type: string
  text: string
  x?: number
  y?: number
  width?: number
  font_size?: number
  direction?: string
  font_family?: string
  text_color?: string
  background_color?: string
  renderer?: string
  start_percent?: number
  end_percent?: number
  transition?: string
}

export interface StorytellerPageMedia {
  id: string
  media: StorytellerMedia
}

export interface StorytellerPage {
  id: string
  name?: string
  storage_folder?: string
  layout: string
  images: Record<string, StorytellerPageMedia>
  text_bubbles: StorytellerTextBubble[]
  animation?: StorytellerAnimationData
}

export interface StorytellerCharacter {
  id: string
  name: string
  description: string
}

export interface StorytellerComicConfig {
  name: string
  description: string
  style: string
  characters: StorytellerCharacter[]
  pages: StorytellerPage[]
}

export interface StorytellerComic {
  id: string
  config?: StorytellerComicConfig
}
```

- [ ] **Step 2: Run typecheck**

Run: `cd packages/cli && npx tsc --noEmit`
Expected: PASS — no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/cli/src/storyteller-types.ts
git commit -m "feat(cli): add storyteller API types for comic import"
```

---

### Task 2: Storyteller Auth

**Files:**
- Create: `packages/cli/src/storyteller-auth.ts`
- Create: `packages/cli/src/storyteller-auth.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/cli/src/storyteller-auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from './storyteller-auth'

describe('login', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a JWT token on successful login', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'jwt-abc-123' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const token = await login('https://badcode.tv', 'user@test.com', 'pass123')

    expect(token).toBe('jwt-abc-123')
    expect(mockFetch).toHaveBeenCalledWith('https://badcode.tv/api/v1/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com', password: 'pass123' }),
    })
  })

  it('throws on failed login', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'unauthorized',
    }))

    await expect(login('https://badcode.tv', 'bad@test.com', 'wrong'))
      .rejects.toThrow('Login failed (401)')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/cli && npx vitest run src/storyteller-auth.test.ts`
Expected: FAIL — `login` not found.

- [ ] **Step 3: Implement the login function**

```typescript
// packages/cli/src/storyteller-auth.ts

export async function login(baseUrl: string, email: string, password: string): Promise<string> {
  const res = await fetch(`${baseUrl}/api/v1/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  }
  const data = (await res.json()) as { token: string }
  return data.token
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/cli && npx vitest run src/storyteller-auth.test.ts`
Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/storyteller-auth.ts packages/cli/src/storyteller-auth.test.ts
git commit -m "feat(cli): storyteller login helper"
```

---

### Task 3: Tail Direction Mapping

**Files:**
- Create: `packages/cli/src/tail-map.ts`
- Create: `packages/cli/src/tail-map.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/cli/src/tail-map.test.ts
import { describe, it, expect } from 'vitest'
import { mapTailDirection } from './tail-map'

describe('mapTailDirection', () => {
  it('maps top-center to top', () => {
    expect(mapTailDirection('top-center')).toBe('top')
  })

  it('maps bottom-left-left to bottom-left', () => {
    expect(mapTailDirection('bottom-left-left')).toBe('bottom-left')
  })

  it('maps bottom-right-right to bottom-right', () => {
    expect(mapTailDirection('bottom-right-right')).toBe('bottom-right')
  })

  it('maps top-left to top-left', () => {
    expect(mapTailDirection('top-left')).toBe('top-left')
  })

  it('maps top-right-right to top-right', () => {
    expect(mapTailDirection('top-right-right')).toBe('top-right')
  })

  it('maps bottom-center to bottom', () => {
    expect(mapTailDirection('bottom-center')).toBe('bottom')
  })

  it('returns none for undefined', () => {
    expect(mapTailDirection(undefined)).toBe('none')
  })

  it('returns none for empty string', () => {
    expect(mapTailDirection('')).toBe('none')
  })

  it('returns none for unknown direction', () => {
    expect(mapTailDirection('something-weird')).toBe('none')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/cli && npx vitest run src/tail-map.test.ts`
Expected: FAIL — `mapTailDirection` not found.

- [ ] **Step 3: Implement the mapping**

```typescript
// packages/cli/src/tail-map.ts

type TailDirection = 'bottom-left' | 'bottom' | 'bottom-right' | 'top-left' | 'top' | 'top-right' | 'none'

const DIRECTION_MAP: Record<string, TailDirection> = {
  'top-center': 'top',
  'top-left': 'top-left',
  'top-left-left': 'top-left',
  'top-right': 'top-right',
  'top-right-right': 'top-right',
  'bottom-center': 'bottom',
  'bottom-left': 'bottom-left',
  'bottom-left-left': 'bottom-left',
  'bottom-right': 'bottom-right',
  'bottom-right-right': 'bottom-right',
}

export function mapTailDirection(direction: string | undefined): TailDirection {
  if (!direction) return 'none'
  return DIRECTION_MAP[direction] ?? 'none'
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/cli && npx vitest run src/tail-map.test.ts`
Expected: PASS — all 9 tests green.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/tail-map.ts packages/cli/src/tail-map.test.ts
git commit -m "feat(cli): tail direction mapping for storyteller→badcode bubbles"
```

---

### Task 4: Pull Command

**Files:**
- Create: `packages/cli/src/pull.ts`
- Create: `packages/cli/src/pull.test.ts`

The pull command: parses the comic URL to extract the UUID, fetches the comic JSON, downloads all image assets, and writes `comic.json`.

- [ ] **Step 1: Write the failing tests**

```typescript
// packages/cli/src/pull.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractComicId, toSlug, buildAssetManifest } from './pull'
import type { StorytellerComic } from './storyteller-types'

describe('extractComicId', () => {
  it('extracts UUID from a full storyteller URL', () => {
    const url = 'https://badcode.tv/admin/comic/97a4cb4c-0f22-424c-96dd-8f6b5becb2df?type=page&viewId=1e408cf1'
    expect(extractComicId(url)).toBe('97a4cb4c-0f22-424c-96dd-8f6b5becb2df')
  })

  it('accepts a bare UUID', () => {
    expect(extractComicId('97a4cb4c-0f22-424c-96dd-8f6b5becb2df')).toBe('97a4cb4c-0f22-424c-96dd-8f6b5becb2df')
  })

  it('throws for a URL with no UUID', () => {
    expect(() => extractComicId('https://badcode.tv/admin')).toThrow('Could not find a comic UUID')
  })
})

describe('toSlug', () => {
  it('converts a name to kebab-case', () => {
    expect(toSlug('My Cool Comic')).toBe('my-cool-comic')
  })

  it('strips non-alphanumeric characters', () => {
    expect(toSlug("Bob's Adventure!")).toBe('bobs-adventure')
  })

  it('collapses multiple dashes', () => {
    expect(toSlug('  hello   world  ')).toBe('hello-world')
  })
})

describe('buildAssetManifest', () => {
  const comic: StorytellerComic = {
    id: 'test-id',
    config: {
      name: 'Test Comic',
      description: 'A test',
      style: 'gritty',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {
            main: {
              id: 'img1',
              media: { id: 'm1', prompt: '', media_type: 'image', path: 'comics/test/page_1/main.jpg' },
            },
          },
          text_bubbles: [],
        },
        {
          id: 'p2',
          layout: 'full',
          images: {
            main: {
              id: 'img2',
              media: { id: 'm2', prompt: '', media_type: 'image', path: 'comics/test/page_2/main.jpg' },
            },
          },
          text_bubbles: [],
          animation: {
            method: 'image_quick',
            frame_count: 3,
            transition_prompt: 'pan left',
            status: 'completed',
            frames: [
              { index: 0, path: 'comics/test/page_2/frame_000.jpg', url: '' },
              { index: 1, path: 'comics/test/page_2/frame_001.jpg', url: '' },
              { index: 2, path: 'comics/test/page_2/frame_002.jpg', url: '' },
            ],
          },
        },
      ],
    },
  }

  it('lists image downloads', () => {
    const manifest = buildAssetManifest(comic, 'test-comic')
    const imageAssets = manifest.filter(a => a.type === 'image')
    expect(imageAssets).toHaveLength(2)
    expect(imageAssets[0]).toEqual({
      type: 'image',
      remotePath: 'comics/test/page_1/main.jpg',
      localPath: 'public/comics/test-comic/p1-main.jpg',
    })
  })

  it('lists animation frame downloads', () => {
    const manifest = buildAssetManifest(comic, 'test-comic')
    const frameAssets = manifest.filter(a => a.type === 'frame')
    expect(frameAssets).toHaveLength(3)
    expect(frameAssets[0]).toEqual({
      type: 'frame',
      remotePath: 'comics/test/page_2/frame_000.jpg',
      localPath: 'public/comics/test-comic/p2-animation/frame-000.jpg',
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/cli && npx vitest run src/pull.test.ts`
Expected: FAIL — functions not found.

- [ ] **Step 3: Implement pull.ts**

```typescript
// packages/cli/src/pull.ts
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { login } from './storyteller-auth'
import type { StorytellerComic } from './storyteller-types'

const GCS_BASE = 'https://storage.googleapis.com/badcode-storage'
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export function extractComicId(urlOrId: string): string {
  const match = urlOrId.match(UUID_RE)
  if (!match) throw new Error(`Could not find a comic UUID in: ${urlOrId}`)
  return match[0]
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface AssetEntry {
  type: 'image' | 'frame'
  remotePath: string
  localPath: string
}

export function buildAssetManifest(comic: StorytellerComic, slug: string): AssetEntry[] {
  const entries: AssetEntry[] = []
  const pages = comic.config?.pages ?? []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const pageNum = i + 1

    for (const [slotName, pageMedia] of Object.entries(page.images)) {
      if (!pageMedia?.media?.path) continue
      const ext = pageMedia.media.path.split('.').pop() ?? 'jpg'
      entries.push({
        type: 'image',
        remotePath: pageMedia.media.path,
        localPath: `public/comics/${slug}/p${pageNum}-${slotName}.${ext}`,
      })
    }

    if (page.animation?.frames?.length) {
      for (const frame of page.animation.frames) {
        if (!frame.path) continue
        const ext = frame.path.split('.').pop() ?? 'jpg'
        const frameNum = String(frame.index).padStart(3, '0')
        entries.push({
          type: 'frame',
          remotePath: frame.path,
          localPath: `public/comics/${slug}/p${pageNum}-animation/frame-${frameNum}.${ext}`,
        })
      }
    }
  }

  return entries
}

function loadEnv(rootDir: string): { username: string; password: string } {
  const envPath = join(rootDir, '.env')
  let content: string
  try {
    // readFileSync is fine here — runs once at CLI startup
    content = require('node:fs').readFileSync(envPath, 'utf-8')
  } catch {
    throw new Error(`Missing .env file at ${envPath}`)
  }
  const vars: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.replace(/^export\s+/, '').trim()
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      vars[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1)
    }
  }
  const username = vars['STORYTELLER_USERNAME']
  const password = vars['STORYTELLER_PASSWORD']
  if (!username || !password) throw new Error('STORYTELLER_USERNAME and STORYTELLER_PASSWORD must be set in .env')
  return { username, password }
}

async function downloadFile(url: string, dest: string, token: string): Promise<void> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, buffer)
}

export async function pull(urlOrId: string, rootDir: string, slugOverride?: string): Promise<string> {
  const comicId = extractComicId(urlOrId)
  const baseUrl = 'https://badcode.tv'
  const { username, password } = loadEnv(rootDir)

  console.log(`Logging in as ${username}...`)
  const token = await login(baseUrl, username, password)

  console.log(`Fetching comic ${comicId}...`)
  const comicRes = await fetch(`${baseUrl}/api/v1/comics/${comicId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!comicRes.ok) throw new Error(`Failed to fetch comic: ${comicRes.status}`)
  const comic = (await comicRes.json()) as StorytellerComic

  const slug = slugOverride ?? toSlug(comic.config?.name ?? comicId)
  console.log(`Comic: "${comic.config?.name}" → slug: ${slug}`)

  const comicDir = join(rootDir, 'apps/web/src/comics', slug)
  await mkdir(comicDir, { recursive: true })
  await writeFile(join(comicDir, 'comic.json'), JSON.stringify(comic.config, null, 2))
  console.log(`Wrote comic.json to ${comicDir}/`)

  const manifest = buildAssetManifest(comic, slug)
  console.log(`Downloading ${manifest.length} assets...`)

  for (const entry of manifest) {
    const url = `${GCS_BASE}/${entry.remotePath}`
    const dest = join(rootDir, entry.localPath)
    process.stdout.write(`  ${entry.localPath}...`)
    await downloadFile(url, dest, token)
    console.log(' done')
  }

  const pages = comic.config?.pages?.length ?? 0
  const images = manifest.filter(e => e.type === 'image').length
  const frames = manifest.filter(e => e.type === 'frame').length
  console.log(`\nPulled "${comic.config?.name}": ${pages} pages, ${images} images, ${frames} animation frames`)

  return slug
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/cli && npx vitest run src/pull.test.ts`
Expected: PASS — all tests green.

- [ ] **Step 5: Run typecheck**

Run: `cd packages/cli && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/pull.ts packages/cli/src/pull.test.ts
git commit -m "feat(cli): pull command — fetch comic data + assets from storyteller"
```

---

### Task 5: Generate Command

**Files:**
- Create: `packages/cli/src/generate.ts`
- Create: `packages/cli/src/generate.test.ts`

The generate command reads `comic.json` and emits TSX + meta files.

- [ ] **Step 1: Write the failing tests**

```typescript
// packages/cli/src/generate.test.ts
import { describe, it, expect } from 'vitest'
import { generateMeta, generateTsx, toPascalCase } from './generate'
import type { StorytellerComicConfig } from './storyteller-types'

const sampleConfig: StorytellerComicConfig = {
  name: 'Test Comic',
  description: 'A test comic',
  style: 'gritty ink',
  characters: [
    { id: 'char1', name: 'Alice', description: 'A brave hero' },
  ],
  pages: [
    {
      id: 'p1',
      layout: 'full',
      images: {
        main: {
          id: 'img1',
          media: { id: 'm1', prompt: 'a dark forest', media_type: 'image', path: 'comics/test/page_1/main.jpg' },
        },
      },
      text_bubbles: [
        {
          id: 'b1',
          type: 'speech',
          text: 'Hello world',
          x: 30,
          y: 60,
          start_percent: 0.1,
          end_percent: 0.8,
          direction: 'bottom-left-left',
          renderer: 'rough',
        },
      ],
    },
    {
      id: 'p2',
      layout: 'full',
      images: {
        main: {
          id: 'img2',
          media: { id: 'm2', prompt: 'a bright city', media_type: 'image', path: 'comics/test/page_2/main.jpg' },
        },
      },
      text_bubbles: [
        {
          id: 'b2',
          type: 'narration',
          text: 'Meanwhile...',
          x: 50,
          y: 20,
          start_percent: 0,
          end_percent: 0.5,
        },
      ],
    },
  ],
}

describe('toPascalCase', () => {
  it('converts kebab-case to PascalCase', () => {
    expect(toPascalCase('test-comic')).toBe('TestComic')
  })

  it('handles single word', () => {
    expect(toPascalCase('camping')).toBe('Camping')
  })
})

describe('generateMeta', () => {
  it('produces valid meta file content', () => {
    const output = generateMeta(sampleConfig, 'test-comic')
    expect(output).toContain("id: 'test-comic'")
    expect(output).toContain("alice:")
    expect(output).toContain("name: 'Alice'")
    expect(output).toContain("'p1-main':")
    expect(output).toContain("kind: 'image'")
    expect(output).toContain("scene: 'a dark forest'")
  })
})

describe('generateTsx', () => {
  it('produces a valid TSX component', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('export function TestComicComic()')
    expect(output).toContain('<ScrollComic')
    expect(output).toContain('<ImageWidget src="/comics/test-comic/p1-main.jpg"')
    expect(output).toContain('<SpeechBubble')
    expect(output).toContain('x={30}')
    expect(output).toContain('y={60}')
    expect(output).toContain('appearAt={[0.1, 0.8]}')
    expect(output).toContain('tail="bottom-left"')
    expect(output).toContain('renderer="rough"')
    expect(output).toContain('Hello world')
  })

  it('maps narration bubbles to NarrationBox', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('<NarrationBox')
    expect(output).toContain('Meanwhile...')
  })

  it('applies zoom effect to first page', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('zoom({ amount: 1.3 })')
  })

  it('applies crossfade transition to non-first pages', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('crossfade()')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/cli && npx vitest run src/generate.test.ts`
Expected: FAIL — functions not found.

- [ ] **Step 3: Implement generate.ts**

```typescript
// packages/cli/src/generate.ts
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { mapTailDirection } from './tail-map'
import type { StorytellerComicConfig, StorytellerPage, StorytellerTextBubble } from './storyteller-types'

export function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

export function generateMeta(config: StorytellerComicConfig, slug: string): string {
  const chars = config.characters.map(c => {
    const key = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '')
    return `    ${key}: {\n      name: '${esc(c.name)}',\n      description: '${esc(c.description)}',\n      sheet: '', // TODO: add character sheet path\n    },`
  }).join('\n')

  const assets: string[] = []
  for (let i = 0; i < config.pages.length; i++) {
    const page = config.pages[i]
    const pageNum = i + 1
    for (const [slotName, pageMedia] of Object.entries(page.images)) {
      if (!pageMedia?.media?.path) continue
      const ext = pageMedia.media.path.split('.').pop() ?? 'jpg'
      const assetId = `p${pageNum}-${slotName}`
      const charIds = config.characters.map(c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, ''))
      assets.push(`    '${assetId}': {\n      kind: 'image',\n      path: '', // TODO: add GCS path if using bucket, or remove if using public/\n      characters: [${charIds.map(id => `'${id}'`).join(', ')}], // TODO: filter to relevant characters\n      scene: '${esc(pageMedia.media.prompt)}',\n    },`)
    }
  }

  return `import { defineComic } from '@badcode/comic-meta'

export default defineComic({
  id: '${slug}',
  style: '${esc(config.style)}',
  characters: {
${chars}
  },
  assets: {
${assets.join('\n')}
  },
})
`
}

function renderBubble(bubble: StorytellerTextBubble, indent: string): string {
  if (bubble.type === 'narration') {
    const props: string[] = []
    if (bubble.x != null) props.push(`x={${bubble.x}}`)
    if (bubble.y != null) props.push(`y={${bubble.y}}`)
    if (bubble.start_percent != null && bubble.end_percent != null) {
      props.push(`appearAt={[${bubble.start_percent}, ${bubble.end_percent}]}`)
    }
    props.push('fade')
    return `${indent}<NarrationBox ${props.join(' ')}>\n${indent}  ${esc(bubble.text)}\n${indent}</NarrationBox>`
  }

  const props: string[] = []
  if (bubble.x != null) props.push(`x={${bubble.x}}`)
  if (bubble.y != null) props.push(`y={${bubble.y}}`)
  if (bubble.start_percent != null && bubble.end_percent != null) {
    props.push(`appearAt={[${bubble.start_percent}, ${bubble.end_percent}]}`)
  }
  props.push('fade')
  if (bubble.type === 'thought') props.push('type="thought"')
  if (bubble.renderer && bubble.renderer !== 'clean') props.push(`renderer="${bubble.renderer}"`)
  const tail = mapTailDirection(bubble.direction)
  if (tail !== 'none') props.push(`tail="${tail}"`)
  if (bubble.background_color) props.push(`background="${bubble.background_color}"`)
  if (bubble.text_color) props.push(`textColor="${bubble.text_color}"`)
  if (bubble.font_size) props.push(`fontSize={${bubble.font_size}}`)

  return `${indent}<SpeechBubble ${props.join(' ')}>\n${indent}  ${esc(bubble.text)}\n${indent}</SpeechBubble>`
}

function renderPage(page: StorytellerPage, pageNum: number, slug: string, isFirst: boolean, indent: string): string {
  const lines: string[] = []

  const pageProps: string[] = []
  pageProps.push(`phases={{ enter: 0, hold: 1.4, exit: 0 }}`)
  pageProps.push(`scrollDuration={1.4}`)
  if (isFirst) {
    pageProps.push(`effect={zoom({ amount: 1.3 })}`)
  } else {
    pageProps.push(`{/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}`)
    pageProps.push(`transition={crossfade()}`)
  }
  pageProps.push(`background="#0a0f1c" {/* TODO: pick background color */}`)

  lines.push(`${indent}<Page`)
  for (const prop of pageProps) {
    lines.push(`${indent}  ${prop}`)
  }
  lines.push(`${indent}>`)

  // Widget
  const hasFrames = page.animation?.frames?.length
  if (hasFrames) {
    const frameCount = page.animation!.frames.length
    const framePaths = Array.from({ length: frameCount }, (_, i) => {
      const num = String(i).padStart(3, '0')
      return `'/comics/${slug}/p${pageNum}-animation/frame-${num}.jpg'`
    })
    lines.push(`${indent}  <AnimationWidget`)
    lines.push(`${indent}    frames={[`)
    for (const fp of framePaths) {
      lines.push(`${indent}      ${fp},`)
    }
    lines.push(`${indent}    ]}`)
    lines.push(`${indent}  />`)
  } else {
    const mainSlot = Object.keys(page.images)[0]
    if (mainSlot) {
      const ext = page.images[mainSlot]?.media?.path?.split('.').pop() ?? 'jpg'
      lines.push(`${indent}  <ImageWidget src="/comics/${slug}/p${pageNum}-${mainSlot}.${ext}" />`)
    }
  }

  // Bubbles
  for (const bubble of page.text_bubbles) {
    lines.push(renderBubble(bubble, indent + '  '))
  }

  // Side panel placeholder
  lines.push(`${indent}  {/* TODO: add SidePanelText with narrative content */}`)

  lines.push(`${indent}</Page>`)
  return lines.join('\n')
}

export function generateTsx(config: StorytellerComicConfig, slug: string): string {
  const name = toPascalCase(slug)
  const pages = config.pages.map((page, i) =>
    renderPage(page, i + 1, slug, i === 0, '      ')
  ).join('\n\n')

  return `import { ScrollComic, Page, ImageWidget, AnimationWidget, SpeechBubble, NarrationBox, SidePanelText } from '@badcode/comic'
import { zoom, grayscale, zoomInOut, pan, scale } from '@badcode/comic/effects'
import { crossfade, iris, fadeOutFadeIn, slideOver, blur, wipe } from '@badcode/comic/transitions'
import { scrollIn, fadeIn, fadeOut, pause } from '@badcode/comic/text'

export function ${name}Comic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint>
${pages}
    </ScrollComic>
  )
}
`
}

export async function generate(slug: string, rootDir: string): Promise<void> {
  const comicDir = join(rootDir, 'apps/web/src/comics', slug)
  const jsonPath = join(comicDir, 'comic.json')

  let raw: string
  try {
    raw = await readFile(jsonPath, 'utf-8')
  } catch {
    throw new Error(`No comic.json found at ${jsonPath} — run "badcode pull" first`)
  }

  const config = JSON.parse(raw) as StorytellerComicConfig
  const name = toPascalCase(slug)

  const metaContent = generateMeta(config, slug)
  const tsxContent = generateTsx(config, slug)

  await writeFile(join(comicDir, 'comic.meta.ts'), metaContent)
  await writeFile(join(comicDir, `${name}Comic.tsx`), tsxContent)

  console.log(`Generated:`)
  console.log(`  ${comicDir}/comic.meta.ts`)
  console.log(`  ${comicDir}/${name}Comic.tsx`)
  console.log(`\nEdit these files to customize effects, transitions, side-panel text, and scroll durations.`)
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/cli && npx vitest run src/generate.test.ts`
Expected: PASS — all tests green.

- [ ] **Step 5: Run typecheck**

Run: `cd packages/cli && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/generate.ts packages/cli/src/generate.test.ts
git commit -m "feat(cli): generate command — emit TSX + meta from storyteller comic.json"
```

---

### Task 6: Wire Commands into CLI

**Files:**
- Modify: `packages/cli/src/bin.ts`

- [ ] **Step 1: Add pull and generate commands to bin.ts**

Add these two commands after the existing `status` command block (after line 69, before `program.parseAsync`):

```typescript
import { pull } from './pull'
import { generate } from './generate'

// Add after the existing status command:

program
  .command('pull')
  .description('Pull a comic from Storyteller (badcode.tv) — downloads data + assets locally.')
  .argument('<url>', 'Storyteller comic URL or comic UUID')
  .option('-s, --slug <name>', 'override the auto-derived slug')
  .action(async (url: string, opts: { slug?: string }) => {
    const rootDir = process.cwd()
    await pull(url, rootDir, opts.slug)
  })

program
  .command('generate')
  .description('Generate a badcode comic scaffold (TSX + meta) from a pulled comic.json.')
  .argument('<slug>', 'comic slug (folder name under apps/web/src/comics)')
  .action(async (slug: string) => {
    const rootDir = process.cwd()
    await generate(slug, rootDir)
  })
```

The full file should have `pull` and `generate` imports at the top alongside the existing imports, and the two new command blocks before `program.parseAsync(process.argv)`.

- [ ] **Step 2: Run typecheck**

Run: `cd packages/cli && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Verify CLI help**

Run: `cd /home/kai/projects/badcode/badcode && npx badcode --help`
Expected: Output should list `pull`, `generate`, `prompt`, `push`, and `status` commands.

- [ ] **Step 4: Commit**

```bash
git add packages/cli/src/bin.ts
git commit -m "feat(cli): wire pull and generate commands into CLI"
```

---

### Task 7: Video-to-Frames Documentation

**Files:**
- Create: `scripts/video-to-frames.md`

- [ ] **Step 1: Create the documentation file**

```markdown
# Video to Frames

Split a video file into individual JPEG frames for use with `AnimationWidget`.

## Prerequisites

- `ffmpeg` installed (`brew install ffmpeg` / `apt install ffmpeg`)

## Usage

```bash
# Split at 24 fps (smooth, more frames)
ffmpeg -i input.mp4 -vf "fps=24" public/comics/<slug>/p<N>-animation/frame-%03d.jpg

# Split at 12 fps (fewer frames, faster scroll-through)
ffmpeg -i input.mp4 -vf "fps=12" public/comics/<slug>/p<N>-animation/frame-%03d.jpg

# Split at 8 fps (minimal frames, quick flick effect)
ffmpeg -i input.mp4 -vf "fps=8" public/comics/<slug>/p<N>-animation/frame-%03d.jpg
```

## Notes

- Fewer frames = faster scroll-through, less disk space
- More frames = smoother animation but heavier page load
- The `AnimationWidget` scrubs through frames as the reader scrolls
- Frame numbering must be sequential (`frame-001.jpg`, `frame-002.jpg`, ...)
- Use `-q:v 2` for higher quality JPEGs: `ffmpeg -i input.mp4 -vf "fps=24" -q:v 2 frames/frame-%03d.jpg`
```

- [ ] **Step 2: Commit**

```bash
git add scripts/video-to-frames.md
git commit -m "docs: add ffmpeg video-to-frames guide for AnimationWidget"
```

---

### Task 8: End-to-End Verification

- [ ] **Step 1: Run all tests**

Run: `cd /home/kai/projects/badcode/badcode && npm run test -- --run`
Expected: All tests pass, including the new ones in `packages/cli`.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS across all workspaces.

- [ ] **Step 3: Test pull with real comic**

Run from repo root:
```bash
npx badcode pull "https://badcode.tv/admin/comic/97a4cb4c-0f22-424c-96dd-8f6b5becb2df?type=page&viewId=1e408cf1-e1fe-4412-b15c-a96961b8518d"
```
Expected: Login succeeds, comic.json written, assets downloaded. Note the slug that's printed.

- [ ] **Step 4: Test generate with pulled comic**

Run: `npx badcode generate <slug>` (use the slug from step 3)
Expected: TSX + meta files generated. Open them and verify they look reasonable — correct imports, pages with widgets, bubbles with positions, TODO markers.

- [ ] **Step 5: Visual check**

Import the generated comic into a test route in `apps/web`, run `npm run dev`, and load it in the browser. Verify:
- Images render on each page
- Speech bubbles appear at correct positions
- Scroll drives page progression
- Animation frames (if any) scrub on scroll

- [ ] **Step 6: Commit any fixes from verification**

```bash
git add -A
git commit -m "fix(cli): adjustments from end-to-end verification"
```
