# Flow Script Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Google Flow automation fast and trusted by hardening the `@badcode/flow-mcp` script layer against the live UI (camping-v2), then documenting a plan-prompts → batch-generate → iterate workflow.

**Architecture:** `@badcode/flow-mcp` already exists: a Playwright client (`flow-client.ts`) attached to a logged-in Chrome over CDP, exposing MCP tools. We finish and *validate* it action-by-action using **observe-then-codify**: drive each action once live, capture working selectors, bake them into a client method (+ tool), then prove it with a live re-run. Pure logic (project picking, batch path shaping) is extracted into small modules with real unit tests; UI-driving methods are validated by live smoke scripts.

**Tech Stack:** TypeScript (ESM, `tsx`), Playwright (CDP attach), `@modelcontextprotocol/sdk`, `zod`, Vitest. WSLg Chromium launched by `scripts/flow-chrome.sh` on CDP port 9222.

## Global Constraints

- **Node ESM**: all source is `type: module`; imports use no extension rewriting beyond existing convention (relative imports, no `.js` suffixes in source — match existing files like `flow-client.ts`).
- **Selectors located by ARIA role + accessible name/placeholder/text, never by snapshot ref** (`eNNN` refs go stale). Match the existing style in `flow-client.ts`.
- **Never ship a selector not watched succeed live.** Every UI-driving change ends in a green live smoke run, and the observed selectors are recorded in `docs/superpowers/flow-selectors.md`.
- **Live validation runs from the worktree**: `npx tsx packages/flow-mcp/src/<smoke>.ts` (executes worktree source). The live `mcp__flow__*` MCP tools reflect the **main** checkout until merge + session restart — do not use them to validate worktree edits.
- **Recon uses the raw `mcp__playwright__*` tools** attached to the same CDP Chrome; recon is browser-state, independent of worktree source.
- **Harvest stays the signed-URL trick**: `page.request.get(getMediaUrlRedirect?name=<id>)` → `resp.url()` signed CDN URL → write to disk (see `harvest.ts`). No UI download button, no image bytes through model context.
- **Flow is one agent/canvas per project** — generations within a project are sequential, not parallel.
- **Test subject is the existing `camping-v2` Flow project.** Do not create throwaway projects for acceptance runs.
- Unit tests live beside source as `<module>.test.ts`; manual smokes are `smoke*.ts` (NOT run in CI — `vitest` only picks up `*.test.ts`).

---

## Precondition (do once before Task 1): live browser up + logged in

This is an environment step, not a code task. Before any live-validation step:

1. Ensure no other process holds CDP port 9222 (user closes any stray Flow Chrome).
2. From the **main checkout** run `./scripts/flow-chrome.sh` (launches WSLg Chromium detached with `--remote-debugging-port=9222 --user-data-dir=.flow-profile`). Login persists in `.flow-profile/`.
3. If not logged in, the user logs into Flow manually in that window (their Google account — Claude cannot).
4. Confirm with `mcp__flow__flow_status` **or** a worktree `npx tsx packages/flow-mcp/src/smoke-status.ts` (Task 1 creates the latter) → expect `loggedIn: true`.

If `flow_status` returns `NOT_RUNNING`, the browser is not up / CDP not reachable — relaunch before proceeding.

---

## File Structure

- `packages/flow-mcp/src/project.ts` — **new.** Pure logic: scrape project tiles, pick by name. + `project.test.ts`.
- `packages/flow-mcp/src/batch.ts` — **new.** Pure logic: per-index out-path naming. + `batch.test.ts`.
- `packages/flow-mcp/src/flow-client.ts` — **modify.** Add `openProject`, `createCharacter`, `generateBatch`; extend `generateImage` with `{ character? }`; validate `refine` and `generateVideo` live.
- `packages/flow-mcp/src/server.ts` — **modify.** Register `flow_open_project`, `flow_create_character`, `flow_generate_batch`; add optional `character` to `flow_generate_image`.
- `packages/flow-mcp/src/smoke-status.ts`, `smoke-core.ts`, `smoke-batch.ts`, `smoke-character.ts`, `smoke-video.ts` — **new.** Per-action manual live smokes.
- `docs/superpowers/flow-selectors.md` — **modify.** Record observed selectors per action.
- `.claude/skills/make-comic/SKILL.md` — **modify.** Add the plan → batch → iterate workflow section.

---

### Task 1: Open an existing project by name (`openProject`)

Replaces "always create a blank New project" with "open camping-v2." Pure picking logic is unit-tested; the click+navigate is live-validated.

**Files:**
- Create: `packages/flow-mcp/src/project.ts`
- Test: `packages/flow-mcp/src/project.test.ts`
- Modify: `packages/flow-mcp/src/flow-client.ts` (add `openProject`, keep `ensureProject` as fallback)
- Modify: `packages/flow-mcp/src/server.ts` (register `flow_open_project`)
- Create: `packages/flow-mcp/src/smoke-status.ts`, `packages/flow-mcp/src/smoke-core.ts`
- Modify: `docs/superpowers/flow-selectors.md`

**Interfaces:**
- Produces:
  - `project.ts`: `export interface ProjectTile { name: string; href: string }`
  - `project.ts`: `export function pickProject(tiles: ProjectTile[], name: string): string | null` — returns the matching `href`, or `null`. Case-insensitive, trimmed, exact-name match; if multiple match, returns the first (DOM order = most recent).
  - `project.ts`: `export const SCRAPE_PROJECTS: string` — a function-body string (same pattern as `SCRAPE_IMGS` in `dom.ts`) evaluated in-page, returning `ProjectTile[]`.
  - `flow-client.ts`: `openProject(name: string): Promise<void>` on `FlowClient` — navigates to the Flow projects list, picks by name, clicks, waits for `/project/` URL. Throws `new Error('PROJECT_NOT_FOUND')` if `pickProject` returns null.

- [ ] **Step 1: Write the failing test for `pickProject`**

```ts
// packages/flow-mcp/src/project.test.ts
import { describe, it, expect } from 'vitest'
import { pickProject, type ProjectTile } from './project'

const tiles: ProjectTile[] = [
  { name: 'camping-v2', href: '/fx/tools/flow/project/aaa' },
  { name: 'Magic Money Tree', href: '/fx/tools/flow/project/bbb' },
  { name: 'camping-v2', href: '/fx/tools/flow/project/ccc' }, // older dup
]

describe('pickProject', () => {
  it('returns the href of the first exact name match', () => {
    expect(pickProject(tiles, 'camping-v2')).toBe('/fx/tools/flow/project/aaa')
  })
  it('is case-insensitive and trims', () => {
    expect(pickProject(tiles, '  CAMPING-V2 ')).toBe('/fx/tools/flow/project/aaa')
  })
  it('returns null when no tile matches', () => {
    expect(pickProject(tiles, 'nope')).toBeNull()
  })
  it('returns null for an empty list', () => {
    expect(pickProject([], 'camping-v2')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run packages/flow-mcp/src/project.test.ts`
Expected: FAIL — `Cannot find module './project'`.

- [ ] **Step 3: Implement `project.ts`**

```ts
// packages/flow-mcp/src/project.ts
export interface ProjectTile { name: string; href: string }

/** Returns the href of the first tile whose name matches (case-insensitive, trimmed), else null. */
export function pickProject(tiles: ProjectTile[], name: string): string | null {
  const want = name.trim().toLowerCase()
  const hit = tiles.find((t) => t.name.trim().toLowerCase() === want)
  return hit ? hit.href : null
}

/**
 * In-page scraper (evaluated as `(${SCRAPE_PROJECTS})()`), mirroring dom.ts's SCRAPE_IMGS pattern.
 * Selector is provisional and MUST be confirmed during live recon (Step 6) before trusting.
 */
export const SCRAPE_PROJECTS = `() => {
  const out = []
  for (const a of document.querySelectorAll('a[href*="/fx/tools/flow/project/"]')) {
    const href = a.getAttribute('href') || ''
    const name = (a.textContent || '').trim()
    if (href && name) out.push({ name, href })
  }
  return out
}`
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run packages/flow-mcp/src/project.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit the pure logic**

```bash
git add packages/flow-mcp/src/project.ts packages/flow-mcp/src/project.test.ts
git commit -m "feat(flow-mcp): pickProject + SCRAPE_PROJECTS pure logic"
```

- [ ] **Step 6: Live recon — confirm the projects-list selectors**

Precondition met (browser up, logged in). Using the raw `mcp__playwright__*` tools:
1. `mcp__playwright__browser_navigate` to `https://labs.google/fx/tools/flow`.
2. `mcp__playwright__browser_evaluate` with the `SCRAPE_PROJECTS` body; confirm it returns tiles including `camping-v2` with a real `/project/<uuid>` href.
3. If the scraper returns `[]` or wrong shape, adjust the selector in `project.ts` (the projects list may render tiles as buttons/divs, not `<a>`) and re-run until it returns the real list. Record the confirmed selector.

- [ ] **Step 7: Implement `openProject` on `FlowClient`**

Add to `flow-client.ts` (import `pickProject`, `SCRAPE_PROJECTS`, `type ProjectTile` from `./project`):

```ts
async openProject(name: string): Promise<void> {
  // Always start from the projects list so the name match is honoured even if a
  // different project is already open.
  if (/\/project\//.test(this.page.url()) || !this.page.url().includes('labs.google/fx/tools/flow')) {
    await this.page.goto(FLOW_URL, { waitUntil: 'domcontentloaded' })
  }
  const tiles = (await this.page.evaluate(`(${SCRAPE_PROJECTS})()`)) as ProjectTile[]
  const href = pickProject(tiles, name)
  if (!href) throw new Error('PROJECT_NOT_FOUND')
  await this.page.goto(new URL(href, 'https://labs.google').toString(), { waitUntil: 'domcontentloaded' })
  await this.page.waitForURL(/\/project\//, { timeout: TURN_TIMEOUT_MS })
}
```

(Use `this.page.goto(href)` rather than a click — robust to virtualised tile lists. Confirm in recon that navigating the href lands in the editor; if Flow requires a click to hydrate, switch to `getByRole('link', { name }).click()` using the confirmed accessible name.)

- [ ] **Step 8: Register the `flow_open_project` tool**

Add to `server.ts` after `flow_status`:

```ts
server.registerTool(
  'flow_open_project',
  {
    title: 'Open project',
    description: 'Open an existing Flow project by its exact name (e.g. "camping-v2"). Errors PROJECT_NOT_FOUND if absent.',
    inputSchema: { name: z.string().min(1) },
  },
  async ({ name }) => {
    try {
      return await withClient(async (c) => {
        await c.openProject(name)
        return ok(await c.status())
      })
    } catch (err) {
      return toToolError(err)
    }
  },
)
```

Also extend `toToolError` mapping in `server.ts`: add a branch so `msg === 'PROJECT_NOT_FOUND'` returns `fail('PROJECT_NOT_FOUND', 'No Flow project with that name.', 'Check the name in the Flow projects list.')`.

- [ ] **Step 9: Create the status + core smoke scripts**

```ts
// packages/flow-mcp/src/smoke-status.ts
// Usage: npx tsx packages/flow-mcp/src/smoke-status.ts
import { FlowClient } from './flow-client'
const c = await FlowClient.connect()
try { console.log('status:', await c.status()) } finally { await c.close() }
```

```ts
// packages/flow-mcp/src/smoke-core.ts
// Usage: npx tsx packages/flow-mcp/src/smoke-core.ts
// Opens camping-v2, generates one image, refines it once. Proves Tasks 1 + 2.
import { mkdtemp, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  console.log('opened:', await c.status())
  const dir = await mkdtemp(join(tmpdir(), 'flow-core-'))
  const a = await c.generateImage('A single landscape image: a quiet campsite at dawn, one empty tent, mist. Cinematic, grounded.', join(dir, 'a.jpg'))
  console.log('image:', a, 'bytes:', (await stat(a.path)).size)
  const b = await c.refine('Make it dusk instead of dawn; warmer light.', join(dir, 'b.jpg'))
  console.log('refined:', b, 'bytes:', (await stat(b.path)).size)
  console.log('CORE SMOKE OK')
} finally { await c.close() }
```

- [ ] **Step 10: Typecheck, then live-validate `openProject`**

Run: `npm run -w @badcode/flow-mcp typecheck`
Expected: PASS.

Run (browser up): `npx tsx packages/flow-mcp/src/smoke-status.ts`
Expected: `loggedIn: true`.

Then validate open specifically by adding a one-off log — run `smoke-core.ts` up to the `opened:` line (it continues into Task 2; for an isolated check you may Ctrl-C after `opened:` prints a `/project/` URL). Expected: `opened:` shows `projectOpen: true` with the camping-v2 project URL.

- [ ] **Step 11: Record selectors + commit**

Update `docs/superpowers/flow-selectors.md`: add an "Open existing project" row with the confirmed projects-list selector and the navigate-by-href finding.

```bash
git add packages/flow-mcp/src/flow-client.ts packages/flow-mcp/src/server.ts \
  packages/flow-mcp/src/smoke-status.ts packages/flow-mcp/src/smoke-core.ts \
  docs/superpowers/flow-selectors.md
git commit -m "feat(flow-mcp): openProject + flow_open_project, live-validated on camping-v2"
```

---

### Task 2: Live-validate the core loop (`generateImage` + `refine` + harvest)

The methods exist but were never run live. Validate and fix selectors against the real UI.

**Files:**
- Modify: `packages/flow-mcp/src/flow-client.ts` (only if recon shows selector drift)
- Modify: `docs/superpowers/flow-selectors.md`
- (Uses `smoke-core.ts` from Task 1.)

**Interfaces:**
- Consumes: `FlowClient.openProject` (Task 1), existing `generateImage(prompt, outPath)`, `refine(prompt, outPath)`.
- Produces: no new signatures — a *validated* `generateImage`/`refine` and updated selector record.

- [ ] **Step 1: Live recon of the create bar**

With camping-v2 open (raw `mcp__playwright__*` tools), confirm each selector `generateImage` relies on, snapshotting only as needed:
- prompt textbox: `getByRole('textbox').filter({ hasText: /What do you want to create/i })`
- submit: `getByRole('button', { name: /arrow_forward Create/i })`
- image-mode menu: `getByRole('button', { name: /crop_/ }).first()` → tab `image Image` → tab `1x`
- completion: a media `<img>` whose `src` carries `getMediaUrlRedirect?name=<uuid>`

Note any mismatch (renamed buttons, missing `1x` tab, etc.).

- [ ] **Step 2: Apply selector fixes (only if recon found drift)**

Edit `flow-client.ts` `submitPrompt` / `ensureImageMode` / `SCRAPE_IMGS` usage to match observed reality. If no drift, make no change. (No code shown here because the fix is whatever recon dictates; the constraint is role/text locators only.)

- [ ] **Step 3: Run the full core smoke**

Run: `npx tsx packages/flow-mcp/src/smoke-core.ts`
Expected: prints `opened:`, `image:` (with width/height and bytes > 1000), `refined:` (bytes > 1000), then `CORE SMOKE OK`. Open the two JPEGs to eyeball they are real on-brief frames.

- [ ] **Step 4: Record + commit**

Update `flow-selectors.md` create-bar rows to observed truth (mark them "confirmed live 2026-06-30").

```bash
git add packages/flow-mcp/src/flow-client.ts docs/superpowers/flow-selectors.md
git commit -m "fix(flow-mcp): live-validate generateImage + refine on camping-v2"
```

(If Step 2 made no change, commit only the selectors doc.)

---

### Task 3: Batch generation (`flow_generate_batch`)

The speed tool: one attach, one project+mode setup, N sequential prompts, harvest each.

**Files:**
- Create: `packages/flow-mcp/src/batch.ts`
- Test: `packages/flow-mcp/src/batch.test.ts`
- Modify: `packages/flow-mcp/src/flow-client.ts` (add `generateBatch`)
- Modify: `packages/flow-mcp/src/server.ts` (register `flow_generate_batch`)
- Create: `packages/flow-mcp/src/smoke-batch.ts`

**Interfaces:**
- Produces:
  - `batch.ts`: `export function batchOutPath(outDir: string, index: number): string` — `<outDir>/<NN>.jpg`, `NN` = index zero-padded to 2 (e.g. `0` → `00.jpg`).
  - `flow-client.ts`: `export interface BatchItem { index: number; prompt: string; path: string; mediaId: string; width: number; height: number }`
  - `flow-client.ts`: `generateBatch(prompts: string[], outDir: string): Promise<BatchItem[]>` — ensures project + image mode ONCE, then for each prompt: submit, wait for active canvas, harvest to `batchOutPath(outDir, i)`. On any single-slide failure it throws (no partial-item padding) so the caller sees a clean error, matching the existing single-shot semantics.
- Consumes: `harvestToFile`, `waitForActiveCanvas`, `ensureProject`, `ensureImageMode`, `submitPrompt` (existing private members).

- [ ] **Step 1: Write the failing test for `batchOutPath`**

```ts
// packages/flow-mcp/src/batch.test.ts
import { describe, it, expect } from 'vitest'
import { batchOutPath } from './batch'

describe('batchOutPath', () => {
  it('zero-pads the index to 2 digits and uses .jpg', () => {
    expect(batchOutPath('/out', 0)).toBe('/out/00.jpg')
    expect(batchOutPath('/out', 7)).toBe('/out/07.jpg')
    expect(batchOutPath('/out', 12)).toBe('/out/12.jpg')
  })
  it('does not double a trailing slash', () => {
    expect(batchOutPath('/out/', 1)).toBe('/out/01.jpg')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run packages/flow-mcp/src/batch.test.ts`
Expected: FAIL — `Cannot find module './batch'`.

- [ ] **Step 3: Implement `batch.ts`**

```ts
// packages/flow-mcp/src/batch.ts
/** Deterministic per-index output path: <outDir>/<NN>.jpg (NN = 2-digit zero-padded index). */
export function batchOutPath(outDir: string, index: number): string {
  const dir = outDir.replace(/\/+$/, '')
  return `${dir}/${String(index).padStart(2, '0')}.jpg`
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run packages/flow-mcp/src/batch.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Implement `generateBatch` on `FlowClient`**

Add to `flow-client.ts` (import `batchOutPath` from `./batch`):

```ts
async generateBatch(prompts: string[], outDir: string): Promise<BatchItem[]> {
  await this.ensureProject()
  await this.ensureImageMode()
  const items: BatchItem[] = []
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i]!
    await this.submitPrompt(prompt)
    const { name, width, height } = await this.waitForActiveCanvas(TURN_TIMEOUT_MS)
    const path = batchOutPath(outDir, i)
    await harvestToFile(this.page.request, name, path)
    items.push({ index: i, prompt, path, mediaId: name, width, height })
  }
  return items
}
```

Add the `BatchItem` interface near the other result interfaces at the top of `flow-client.ts`.

- [ ] **Step 6: Register the `flow_generate_batch` tool**

Add to `server.ts`:

```ts
server.registerTool(
  'flow_generate_batch',
  {
    title: 'Generate image batch',
    description:
      'Generate N images sequentially in ONE Flow session from an ordered list of prompts. Saves <outDir>/<NN>.jpg per slide. Returns BatchItem[]. Use after planning all slide prompts up front.',
    inputSchema: {
      prompts: z.array(z.string().min(1)).min(1).max(8),
      outDir: z.string().min(1),
    },
  },
  async ({ prompts, outDir }) => {
    try {
      return await withClient(async (c) => ok(await c.generateBatch(prompts, outDir)))
    } catch (err) {
      return toToolError(err)
    }
  },
)
```

- [ ] **Step 7: Create the batch smoke**

```ts
// packages/flow-mcp/src/smoke-batch.ts
// Usage: npx tsx packages/flow-mcp/src/smoke-batch.ts
import { mkdtemp, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  const dir = await mkdtemp(join(tmpdir(), 'flow-batch-'))
  const items = await c.generateBatch(
    [
      'A single landscape image: a campsite firepit, cold ashes, morning light. Grounded, cinematic.',
      'A single landscape image: a folding camp chair knocked over on grass, dew. Grounded, cinematic.',
    ],
    dir,
  )
  for (const it of items) console.log(it.index, it.path, (await stat(it.path)).size, 'bytes')
  if (items.length !== 2) throw new Error('expected 2 items')
  console.log('BATCH SMOKE OK')
} finally { await c.close() }
```

- [ ] **Step 8: Typecheck + commit the logic**

Run: `npm run -w @badcode/flow-mcp typecheck`
Expected: PASS.

```bash
git add packages/flow-mcp/src/batch.ts packages/flow-mcp/src/batch.test.ts \
  packages/flow-mcp/src/flow-client.ts packages/flow-mcp/src/server.ts \
  packages/flow-mcp/src/smoke-batch.ts
git commit -m "feat(flow-mcp): generateBatch + flow_generate_batch (one session, N slides)"
```

- [ ] **Step 9: Live-validate the batch**

Run (browser up): `npx tsx packages/flow-mcp/src/smoke-batch.ts`
Expected: two lines `0 .../00.jpg <bytes>` and `1 .../01.jpg <bytes>` (bytes > 1000 each), then `BATCH SMOKE OK`. Eyeball both JPEGs. Confirm the second generation reused the session (no re-attach/re-mode flicker — only one `ensureImageMode`).

---

### Task 4: Document the plan → batch → iterate workflow

Make the fast loop the default rhythm in the comic skill.

**Files:**
- Modify: `.claude/skills/make-comic/SKILL.md`

**Interfaces:** none (docs).

- [ ] **Step 1: Confirm the target file and its structure**

Run: `sed -n '1,40p' .claude/skills/make-comic/SKILL.md`
Expected: see the storyboard/image-generation stage. (If the image step lives in `badcode-art-direction/SKILL.md` instead, add the section there — pick the file that already owns "generate the panel images".)

- [ ] **Step 2: Add the workflow section**

Insert a section titled `## Fast slide loop: plan → batch → iterate` containing:

```markdown
## Fast slide loop: plan → batch → iterate

Work in batches of 1–4 slides, not one at a time:

1. **Plan the prompts first.** Write the full prompt for every slide in the batch
   before generating anything. Get them agreed.
2. **Batch-generate unattended.** Call `flow_generate_batch` with the ordered
   prompt list and an `outDir`. It opens the project once and fires all N
   sequentially in one Flow session — no page-reading between slides.
3. **Review the batch together.** Look at all N harvested frames at once.
4. **Iterate only the weak ones.** A single slide is a cheap same-session
   follow-up: `flow_refine` with the correction. Don't regenerate the batch.

Precondition: the Flow browser is up and logged in (`./scripts/flow-chrome.sh`,
then `flow_status` → loggedIn: true) and the project is opened with
`flow_open_project` (e.g. "camping-v2").
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/make-comic/SKILL.md
git commit -m "docs(make-comic): plan -> batch -> iterate fast slide loop"
```

---

### Task 5: Create a character (`createCharacter`)

The consistency unknown. Recon-heavy — the character flow was never spiked. If recon reveals it needs its own sub-design, STOP and report (per spec risk note): land Tasks 1–4 and split this out.

**Files:**
- Modify: `packages/flow-mcp/src/flow-client.ts` (add `createCharacter`)
- Modify: `packages/flow-mcp/src/server.ts` (register `flow_create_character`)
- Create: `packages/flow-mcp/src/smoke-character.ts`
- Modify: `docs/superpowers/flow-selectors.md`

**Interfaces:**
- Produces:
  - `flow-client.ts`: `export interface CharacterRef { name: string }` (extend with an `id` field only if recon shows a stable identifier exists).
  - `flow-client.ts`: `createCharacter(name: string, refImages: string[]): Promise<CharacterRef>` — opens the Characters sidebar, creates a new character named `name`, uploads each path in `refImages` as a reference, saves. Returns `{ name }`.
- Consumes: `FlowClient.openProject`, the file-chooser upload pattern already used in `generateVideo` (`this.page.waitForEvent('filechooser')` → `setFiles`).

- [ ] **Step 1: Live recon of the Characters flow**

With camping-v2 open (raw `mcp__playwright__*` tools), drive it by hand once and capture each step:
1. Open `getByRole('button', { name: /accessibility_new Characters/i })` (sidebar).
2. Find the "create / add character" affordance — capture its accessible name.
3. Capture the name input and the reference-image upload control (is it a file chooser, drag-drop, or "Add Media" reuse?).
4. Capture the save/confirm control and how a finished character appears (so generation can reference it).

Record every captured selector in `flow-selectors.md` under a new "Characters" section as you go.

- [ ] **Step 2: Decision gate**

If the flow is a simple sidebar form (open → name → upload → save), continue. If it is a multi-step wizard / requires generating a character sheet first / has no deterministic anchors, STOP: write findings to `flow-selectors.md`, report to the user that characters need their own sub-design, and end this task. (Tasks 1–4 already delivered the fast loop.)

- [ ] **Step 3: Implement `createCharacter` from the captured selectors**

Add to `flow-client.ts`. Skeleton (fill the *captured* accessible names from Step 1 — do not invent them):

```ts
async createCharacter(name: string, refImages: string[]): Promise<CharacterRef> {
  await this.ensureProject()
  await this.page.getByRole('button', { name: /accessibility_new Characters/i }).click()
  // <CAPTURED: open the create-character affordance>
  // <CAPTURED: fill the name input with `name`>
  for (const img of refImages) {
    const chooser = this.page.waitForEvent('filechooser')
    // <CAPTURED: click the add-reference / upload control>
    await (await chooser).setFiles(img)
  }
  // <CAPTURED: click save/confirm; wait for the character to appear>
  return { name }
}
```

Add the `CharacterRef` interface near the other interfaces.

- [ ] **Step 4: Register `flow_create_character`**

```ts
server.registerTool(
  'flow_create_character',
  {
    title: 'Create character',
    description:
      'Create a reusable Flow Character from reference image paths, for cross-slide consistency. Returns { name }.',
    inputSchema: {
      name: z.string().min(1),
      refImages: z.array(z.string().min(1)).min(1),
    },
  },
  async ({ name, refImages }) => {
    try {
      return await withClient(async (c) => ok(await c.createCharacter(name, refImages)))
    } catch (err) {
      return toToolError(err)
    }
  },
)
```

- [ ] **Step 5: Create the character smoke**

```ts
// packages/flow-mcp/src/smoke-character.ts
// Usage: npx tsx packages/flow-mcp/src/smoke-character.ts <refImagePath>
import { FlowClient } from './flow-client'
const ref = process.argv[2]
if (!ref) throw new Error('pass a reference image path')
const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  const out = await c.createCharacter('SmokeKaren', [ref])
  console.log('character:', out)
  console.log('CHARACTER SMOKE OK')
} finally { await c.close() }
```

- [ ] **Step 6: Typecheck, live-validate, record, commit**

Run: `npm run -w @badcode/flow-mcp typecheck` → PASS.
Run (browser up, with a real reference jpg path): `npx tsx packages/flow-mcp/src/smoke-character.ts <path-to-a-camping-frame.jpg>`
Expected: `character: { name: 'SmokeKaren' }`, `CHARACTER SMOKE OK`, and the character visibly present in the Flow Characters sidebar (verify via a `browser_snapshot`).

```bash
git add packages/flow-mcp/src/flow-client.ts packages/flow-mcp/src/server.ts \
  packages/flow-mcp/src/smoke-character.ts docs/superpowers/flow-selectors.md
git commit -m "feat(flow-mcp): createCharacter + flow_create_character, live-validated"
```

---

### Task 6: Generate an image that references a character

Extend `generateImage` so a slide can pin a character for consistency.

**Files:**
- Modify: `packages/flow-mcp/src/flow-client.ts` (extend `generateImage`)
- Modify: `packages/flow-mcp/src/server.ts` (add optional `character` to `flow_generate_image`)
- Modify: `docs/superpowers/flow-selectors.md`

**Interfaces:**
- Produces: `generateImage(prompt: string, outPath: string, opts?: { character?: string }): Promise<ImageResult>` — backward compatible (no opts = today's behaviour). When `opts.character` is set, the prompt is composed so Flow attaches the named character before generating.
- Consumes: Task 5's character existing in the project; existing harvest path.

- [ ] **Step 1: Live recon — how a character is attached to a generation**

With a character present (from Task 5), capture the mechanism: does Flow attach a character via an `@mention` in the prompt box, a sidebar "use in scene" toggle, or a chip added to the create bar? Capture the exact selector/affordance.

- [ ] **Step 2: Implement the `opts.character` branch**

Update `generateImage` signature and body. Example for the `@mention` case (use whatever Step 1 captured):

```ts
async generateImage(prompt: string, outPath: string, opts?: { character?: string }): Promise<ImageResult> {
  await this.ensureProject()
  await this.ensureImageMode()
  if (opts?.character) {
    // <CAPTURED: attach the named character — e.g. type "@<name> " into the box,
    // or click the sidebar "use" control — before the prompt text>
  }
  await this.submitPrompt(prompt)
  const { name, width, height } = await this.waitForActiveCanvas(TURN_TIMEOUT_MS)
  await harvestToFile(this.page.request, name, outPath)
  return { path: outPath, mediaId: name, width, height }
}
```

- [ ] **Step 3: Add the optional `character` param to `flow_generate_image`**

In `server.ts`, change the `flow_generate_image` `inputSchema` to add `character: z.string().min(1).optional()` and pass it through:

```ts
async ({ prompt, outPath, character }) => {
  try {
    return await withClient(async (c) => ok(await c.generateImage(prompt, outPath, character ? { character } : undefined)))
  } catch (err) {
    return toToolError(err)
  }
},
```

- [ ] **Step 4: Typecheck + live-validate via an extended smoke**

Add to the bottom of `smoke-character.ts` (after the character is created) a generation that uses it:

```ts
import { mkdtemp } from 'node:fs/promises'; import { tmpdir } from 'node:os'; import { join } from 'node:path'
const dir = await mkdtemp(join(tmpdir(), 'flow-charuse-'))
const img = await c.generateImage('A single landscape image: SmokeKaren standing by a campfire at dusk.', join(dir, 'use.jpg'), { character: 'SmokeKaren' })
console.log('char-image:', img)
```

Run: `npm run -w @badcode/flow-mcp typecheck` → PASS.
Run: `npx tsx packages/flow-mcp/src/smoke-character.ts <ref.jpg>` → prints `char-image:` with a real frame; eyeball that the character likeness carried over.

- [ ] **Step 5: Record + commit**

Update `flow-selectors.md` with the character-attach mechanism.

```bash
git add packages/flow-mcp/src/flow-client.ts packages/flow-mcp/src/server.ts \
  packages/flow-mcp/src/smoke-character.ts docs/superpowers/flow-selectors.md
git commit -m "feat(flow-mcp): generateImage with optional character reference"
```

---

### Task 7: Live-validate video generation (`generateVideo`)

Heaviest, last. The method exists but the spec flags its selectors (credit gate, Veo model pre-select, `more_vert → Animate` attach) as unverified.

**Files:**
- Modify: `packages/flow-mcp/src/flow-client.ts` (fix `generateVideo` selectors as recon dictates)
- Create: `packages/flow-mcp/src/smoke-video.ts`
- Modify: `docs/superpowers/flow-selectors.md`

**Interfaces:**
- Consumes: existing `generateVideo(imagePath, motion, outPath, model?)`, `waitForVideo`, `contentTypeOf`.
- Produces: a *validated* `generateVideo`. Cross-check against `docs/superpowers/flow-video.md` (the existing recipe contract) and reconcile any divergence.

- [ ] **Step 1: Live recon of image→video**

With camping-v2 open and a harvested frame on disk, drive Animate by hand (raw `mcp__playwright__*`): Add Media upload OR `more_vert → Animate` on an existing frame, the Veo model selector, the motion prompt box, submit, and the completion signal (media content-type becomes `video/*`). Capture each. Note the credit gate if present.

- [ ] **Step 2: Reconcile `generateVideo` with observed reality**

Edit `flow-client.ts` `generateVideo` to match (the current body uploads via Add Media then `submitPrompt` — recon may show Animate is attached differently). Keep harvest via `waitForVideo` + `contentTypeOf`. Update `docs/superpowers/flow-video.md` if the recipe changed.

- [ ] **Step 3: Create the video smoke**

```ts
// packages/flow-mcp/src/smoke-video.ts
// Usage: npx tsx packages/flow-mcp/src/smoke-video.ts <imagePath>
import { stat } from 'node:fs/promises'; import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'; import { join } from 'node:path'
import { FlowClient } from './flow-client'
const src = process.argv[2]; if (!src) throw new Error('pass an image path')
const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  const dir = await mkdtemp(join(tmpdir(), 'flow-vid-'))
  const out = join(dir, 'clip.mp4')
  const res = await c.generateVideo(src, 'Slow gentle push-in; embers drift; subtle wind in the grass.', out)
  console.log('video:', res, 'bytes:', (await stat(res.path)).size)
  if ((await stat(res.path)).size < 10000) throw new Error('clip suspiciously small')
  console.log('VIDEO SMOKE OK')
} finally { await c.close() }
```

- [ ] **Step 4: Typecheck, live-validate, record, commit**

Run: `npm run -w @badcode/flow-mcp typecheck` → PASS.
Run (browser up, real frame path; allow up to 8 min): `npx tsx packages/flow-mcp/src/smoke-video.ts <a-camping-frame.jpg>`
Expected: `video:` with an `.mp4` path, bytes > 10000, `VIDEO SMOKE OK`. Play the clip to confirm motion.

```bash
git add packages/flow-mcp/src/flow-client.ts packages/flow-mcp/src/smoke-video.ts \
  docs/superpowers/flow-selectors.md docs/superpowers/flow-video.md
git commit -m "fix(flow-mcp): live-validate generateVideo (image->video) on camping-v2"
```

---

### Task 8: Final acceptance + green tree

Prove the whole loop and leave the repo green.

**Files:** none (verification + optional doc note).

- [ ] **Step 1: Whole-package gate**

Run: `npm run -w @badcode/flow-mcp typecheck && npm run -w @badcode/flow-mcp test`
Expected: typecheck clean; all `*.test.ts` pass (existing + `project.test.ts` + `batch.test.ts`).

- [ ] **Step 2: Repo-wide gate**

Run: `npm run typecheck && npm test`
Expected: all workspaces green (baseline was 5 typecheck OK, 58 tests).

- [ ] **Step 3: Acceptance run — a real camping-v2 batch**

With the browser up, run a real 1–4 slide batch for camping-v2 via `smoke-batch.ts` (or `flow_generate_batch` once merged), using actual camping-v2 slide prompts. Confirm frames land and look on-brief. This is the spec's acceptance criterion.

- [ ] **Step 4: Update memory + finish**

Note in the `camping-karen-rework-initiative` / `flow-mcp-and-art-direction-initiative` memory that the script layer is now live-validated, with the per-action smokes and the plan→batch→iterate workflow. Then invoke `superpowers:finishing-a-development-branch` to decide merge/PR.

> **Merge note:** after merging to main, the primary checkout must `npm install` (it already has the deps) and **restart the Claude session** so `.mcp.json` relaunches the flow server from main with the new tools (`flow_open_project`, `flow_create_character`, `flow_generate_batch`, `character` param). Until then those tools exist only via worktree `tsx` smokes.
