# Flow Automation Loop — Phase 1 (Spike) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive one real Camping slide through Google Flow via Playwright attached over CDP to a logged-in Chrome, judge the candidates, and land the keeper in the `badcode-storage` bucket — while recording Flow's actual UI selectors for Phase 2.

**Architecture:** Stand up a persistent, Google-logged-in Chrome started with a remote-debugging port; point the official `@playwright/mcp` at it over CDP so Claude has both the authenticated session and programmatic control (including `setInputFiles`). Add one small, unit-tested CLI helper (`badcode flow-prep`) that stages everything a generation needs — the assembled prompt text plus the reference images downloaded from the bucket to a temp dir. Then Claude drives the live UI for one slide and writes down what it learned.

**Tech Stack:** TypeScript (ES2022, ESM, `verbatimModuleSyntax`) in `@badcode/cli`; Commander; Vitest with injected fakes; `@playwright/mcp` (MCP server, CDP mode); Google Chrome; `gsutil` (already authenticated); existing `badcode prompt`/`push`/`status` commands and the `Bucket` interface.

**Spec:** `docs/superpowers/specs/2026-06-20-flow-automation-loop-design.md`

## Global Constraints

- Packages are raw-TS ESM, `private`, version `0.0.0`, **no build step** (consumed via `tsx`/Vite). One line each below copied from repo conventions:
- `tsconfig.base.json` sets `strict`, `noUnusedLocals`, `noUnusedParameters`, `moduleResolution: "bundler"`, **`verbatimModuleSyntax: true`** — type-only imports MUST use `import type { ... }`.
- Tests are colocated as `*.test.ts` next to source; run with `npm run test --workspace @badcode/cli` (Vitest).
- Typecheck with `npm run typecheck` from repo root; must pass before any commit.
- All bucket I/O goes through the `Bucket` interface (`packages/cli/src/bucket.ts`) and is unit-tested against a **fake**, never live GCS.
- The bucket is `badcode-storage`; public asset URLs are `https://storage.googleapis.com/badcode-storage/comics/<comicId>/<path>`; the matching bucket-relative key is `comics/<comicId>/<path>`.
- Commit after every task. Run commands from the repo root unless stated otherwise.
- This is a **spike**: Tasks 1, 2, and 4 are interactive/exploratory (they touch a live browser, a one-time human login, and Flow's live UI), so they use explicit manual verification rather than automated tests. Task 3 is real shipping code and is fully TDD'd.

---

### Task 1: Logged-in Chrome with a remote-debugging port

**Files:**
- Modify: `.gitignore` (add the profile dir)
- Create: `scripts/flow-chrome.sh`

**Interfaces:**
- Produces: a CDP endpoint at `http://localhost:9222` backed by a persistent Chrome profile at `.flow-profile/` that is logged into Google/Flow. Tasks 2 and 4 attach to this endpoint.

- [ ] **Step 1: Ignore the persistent profile dir**

Add to `.gitignore` (under the existing ephemeral section):

```
# Flow automation: persistent, logged-in Chrome profile (never commit — holds Google session)
.flow-profile/
```

- [ ] **Step 2: Write the launcher script**

Create `scripts/flow-chrome.sh`:

```bash
#!/usr/bin/env bash
# Launch a persistent Chrome with a remote-debugging port for Flow automation.
# Log into Google/Flow ONCE in this window; the session persists in .flow-profile/.
set -euo pipefail

PORT="${FLOW_CDP_PORT:-9222}"
PROFILE="$(cd "$(dirname "$0")/.." && pwd)/.flow-profile"

# Resolve a Chrome binary across platforms.
CHROME="${CHROME_BIN:-}"
if [ -z "$CHROME" ]; then
  for c in \
    "google-chrome" "google-chrome-stable" "chromium" "chromium-browser" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME="$c"; break; fi
  done
fi
if [ -z "$CHROME" ]; then echo "No Chrome found. Set CHROME_BIN=/path/to/chrome" >&2; exit 1; fi

echo "Launching Chrome on CDP port $PORT with profile $PROFILE"
echo "→ Log into Google/Flow in the window that opens, then leave it running."
exec "$CHROME" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run --no-default-browser-check \
  "https://labs.google/fx/tools/flow"
```

- [ ] **Step 3: Make it executable**

Run: `chmod +x scripts/flow-chrome.sh`

- [ ] **Step 4: Launch and log in (manual)**

Run: `./scripts/flow-chrome.sh`
Then, in the Chrome window that opens, log into Google and confirm Flow loads. Leave it running.

- [ ] **Step 5: Verify the CDP endpoint responds**

Run: `curl -s http://localhost:9222/json/version`
Expected: a JSON blob containing `"Browser"` and `"webSocketDebuggerUrl"`. If it errors, Chrome did not start with the debug port.

- [ ] **Step 6: Commit**

```bash
git add .gitignore scripts/flow-chrome.sh
git commit -m "feat(flow): launcher for logged-in Chrome with CDP debug port"
```

---

### Task 2: Attach `@playwright/mcp` to the logged-in Chrome over CDP

**Files:**
- Create: `.mcp.json`

**Interfaces:**
- Consumes: the CDP endpoint from Task 1 (`http://localhost:9222`).
- Produces: Playwright MCP tools available in this session, driving the **logged-in** Flow tab (so navigation/screenshots show the authenticated UI). Task 4 uses these tools.

- [ ] **Step 1: Add a project MCP config**

Create `.mcp.json` at the repo root (project-scoped, committed so the setup is shared):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--cdp-endpoint", "http://localhost:9222"]
    }
  }
}
```

- [ ] **Step 2: Reload MCP servers**

In Claude Code, approve/enable the new `playwright` server when prompted (or run `/mcp` to confirm it is connected). Chrome from Task 1 must already be running.

- [ ] **Step 3: Verify the attach hits the logged-in session (manual)**

Using the Playwright MCP tools, navigate to `https://labs.google/fx/tools/flow` and take a screenshot.
Expected: the screenshot shows Flow in a **signed-in** state (your account/project visible), confirming the MCP is driving the persistent profile, not a fresh anonymous browser. If it shows a sign-in wall, the `--cdp-endpoint` is not attaching to the Task 1 Chrome — recheck the port and that Chrome is running.

- [ ] **Step 4: Commit**

```bash
git add .mcp.json
git commit -m "feat(flow): attach Playwright MCP to logged-in Chrome over CDP"
```

---

### Task 3: `badcode flow-prep` — stage prompt text + reference files for a slide

**Files:**
- Create: `packages/cli/src/flow-prep.ts`
- Create: `packages/cli/src/flow-prep.test.ts`
- Modify: `packages/cli/src/bin.ts` (add the `flow-prep` command)

**Interfaces:**
- Consumes: `buildPrompt` (`./prompt` → `PromptResult { prompt, references: {label,url}[], refHeading }`), the `Bucket` interface (`./bucket`), `loadComic` (`./loadComic`), `toTarget` (already in `bin.ts`), `BUCKET_BASE_URL` (`@badcode/comic-meta`).
- Produces:
  - `refKey(url: string): string` — strips `${BUCKET_BASE_URL}/` from a public asset URL to yield the bucket-relative key.
  - `flowPrep(bucket: Bucket, comic: Comic, target: Target, destDir: string): Promise<FlowPrepResult>` where `FlowPrepResult = { prompt: string; refs: { label: string; file: string }[] }` — downloads each reference into `destDir` and returns its local path. Task 4 reads `prompt` and feeds each `refs[].file` to `setInputFiles`.

- [ ] **Step 1: Write the failing test**

Create `packages/cli/src/flow-prep.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { join } from 'node:path'
import { refKey, flowPrep } from './flow-prep'
import type { Bucket } from './bucket'
import type { Comic } from '@badcode/comic-meta'

const comic = {
  id: 'demo',
  style: 'documentary photo',
  characters: {
    bob: { name: 'bob', description: 'a homeless man', sheet: 'characters/bob.latest.png' },
  },
  assets: {
    'p1-main': {
      kind: 'image' as const,
      path: 'p1-main.latest.png',
      characters: ['bob'],
      scene: 'bob outside a shop',
    },
  },
} as unknown as Comic

/** Records every download so the test can assert keys + destinations. */
function fakeBucket(): { bucket: Bucket; downloads: { key: string; file: string }[] } {
  const downloads: { key: string; file: string }[] = []
  const bucket = {
    list: async () => [],
    upload: async () => {},
    copy: async () => {},
    download: async (key: string, file: string) => { downloads.push({ key, file }) },
    downloadMany: async () => {},
    listKeys: async () => [],
  }
  return { bucket, downloads }
}

describe('refKey', () => {
  it('strips the public bucket base URL to a bucket-relative key', () => {
    const url = 'https://storage.googleapis.com/badcode-storage/comics/demo/characters/bob.latest.png'
    expect(refKey(url)).toBe('comics/demo/characters/bob.latest.png')
  })
})

describe('flowPrep', () => {
  it('returns the assembled prompt and downloads each ref into destDir', async () => {
    const { bucket, downloads } = fakeBucket()
    const result = await flowPrep(bucket, comic, { kind: 'asset', id: 'p1-main' }, '/tmp/out')

    expect(result.prompt).toContain('Scene: bob outside a shop')
    expect(result.refs).toHaveLength(1)
    expect(result.refs[0].label).toBe('[1]')
    expect(result.refs[0].file).toBe(join('/tmp/out', 'ref-1-bob.latest.png'))

    expect(downloads).toEqual([
      { key: 'comics/demo/characters/bob.latest.png', file: join('/tmp/out', 'ref-1-bob.latest.png') },
    ])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace @badcode/cli -- flow-prep`
Expected: FAIL — `Cannot find module './flow-prep'` (or `refKey is not a function`).

- [ ] **Step 3: Write the minimal implementation**

Create `packages/cli/src/flow-prep.ts`:

```ts
import { join } from 'node:path'
import { BUCKET_BASE_URL, type Comic } from '@badcode/comic-meta'
import { buildPrompt } from './prompt'
import type { Bucket } from './bucket'
import type { Target } from './target'

export interface FlowPrepResult {
  /** Prompt text to paste into Flow. */
  prompt: string
  /** Reference images, downloaded locally, ready for setInputFiles. */
  refs: { label: string; file: string }[]
}

/** Strip the public bucket base URL to a bucket-relative key. */
export function refKey(url: string): string {
  const prefix = `${BUCKET_BASE_URL}/`
  if (!url.startsWith(prefix)) throw new Error(`url is not in the bucket: ${url}`)
  return url.slice(prefix.length)
}

/** Stage everything one generation needs: prompt text + downloaded reference files. */
export async function flowPrep(
  bucket: Bucket,
  comic: Comic,
  target: Target,
  destDir: string,
): Promise<FlowPrepResult> {
  const { prompt, references } = buildPrompt(comic, target)
  const refs: { label: string; file: string }[] = []
  for (let i = 0; i < references.length; i++) {
    const ref = references[i]
    const key = refKey(ref.url)
    const basename = key.split('/').pop()!
    const file = join(destDir, `ref-${i + 1}-${basename}`)
    await bucket.download(key, file)
    refs.push({ label: ref.label, file })
  }
  return { prompt, refs }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test --workspace @badcode/cli -- flow-prep`
Expected: PASS (both `refKey` and `flowPrep` tests green).

- [ ] **Step 5: Wire the `flow-prep` command into the CLI**

In `packages/cli/src/bin.ts`, add the imports near the other command imports:

```ts
import { mkdir } from 'node:fs/promises'
import { flowPrep } from './flow-prep'
```

and register the command (place it after the `prompt` command block):

```ts
program
  .command('flow-prep')
  .description('Stage a slide for Flow: print the prompt and download its reference images to a dir.')
  .argument('<comic>', 'comic id')
  .argument('[assetId]', 'asset id from the comic metadata')
  .option('-c, --character <id>', 'target a character sheet instead of an asset')
  .requiredOption('-d, --dest <dir>', 'local directory to write reference images into')
  .action(async (comicId: string, assetId: string | undefined, opts: { character?: string; dest: string }) => {
    const comic = await loadComic(comicId)
    await mkdir(opts.dest, { recursive: true })
    const result = await flowPrep(new GsutilBucket(), comic, toTarget(assetId, opts.character), opts.dest)
    console.log('\n--- PROMPT (paste into Flow) ---\n')
    console.log(result.prompt)
    console.log('\nREFERENCE FILES (attach in order):')
    for (const ref of result.refs) console.log(`  ${ref.label} ${ref.file}`)
    console.log('')
  })
```

- [ ] **Step 6: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/src/flow-prep.ts packages/cli/src/flow-prep.test.ts packages/cli/src/bin.ts
git commit -m "feat(cli): flow-prep — stage prompt + reference files for a slide"
```

---

### Task 4: Spike one Camping slide end-to-end + record the selector map

**Files:**
- Create: `docs/superpowers/flow-selectors.md`

**Interfaces:**
- Consumes: `badcode flow-prep` (Task 3), the Playwright MCP attach (Task 2), the logged-in Chrome (Task 1), and existing `badcode push` / `badcode status`.
- Produces: `docs/superpowers/flow-selectors.md` — the recorded selector/step map that Phase 2 (`badcode flow`) will be built from; and one real frame for `camping / p8-main` in the bucket.

This task is **exploratory**: it discovers Flow's live UI. Do the steps interactively via the Playwright MCP tools, writing down what works as you go.

- [ ] **Step 1: Stage the slide**

Run: `npx tsx packages/cli/src/bin.ts flow-prep camping p8-main -d .flow-profile/tmp`
(`p8-main` is chosen because it already has a full `scene` prompt in `comic.meta.ts`.)
Expected: prints the prompt text and the local paths of the downloaded reference files.

> If the references fail to download because the character sheets are not yet in the bucket (`camping` sheets are currently `''` in `comic.meta.ts`), fall back to a slide whose refs resolve, or temporarily prep with `--character` against an existing sheet to exercise the loop. Record which slide actually ran in the selector map.

- [ ] **Step 2: Drive Flow for the image (interactive, via Playwright MCP)**

Using the Playwright MCP tools against the logged-in Flow tab:
1. Navigate to the Flow image-generation surface.
2. Fill the prompt field with the staged prompt text.
3. Attach each reference file via `setInputFiles` on the upload `<input type="file">` (method **A** from the spec). If no file input is reachable, try drag/drop, then the Drive picker (method **B**), then the in-project ingredient gallery (method **C**) — record which one worked.
4. Trigger generate.
5. Wait on a **completion signal** (the candidate grid appearing / a spinner disappearing / a network response) — not a fixed sleep. Record the exact signal you keyed on.

- [ ] **Step 3: Judge the candidates and download the keeper**

Screenshot the N candidates. Score them against the slide's `scene` text and the house style (hyper-realistic documentary photography; see `docs/storytelling.md`). Pick the best; if none is convincing, note it as low-confidence. Download the keeper (record how download is triggered and where the file lands).

- [ ] **Step 4: Push the keeper to the bucket**

Run: `npx tsx packages/cli/src/bin.ts push camping p8-main -f <path-to-downloaded-file>`
Expected: prints `pushed v1` (or the next version number).

- [ ] **Step 5: Verify the frame landed**

Run: `npx tsx packages/cli/src/bin.ts status camping`
Expected: the `p8-main` row shows `latest✓`.

- [ ] **Step 6: Write the selector/step map**

Create `docs/superpowers/flow-selectors.md` capturing, for the image loop: the Flow URL(s); the selector/role for the prompt field; the working reference-attachment method (A/B/C) and its selector; the generate trigger; the **completion signal**; the candidate-grid structure; and the download trigger + where files land. This is the input contract for Phase 2.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/flow-selectors.md
git commit -m "docs(flow): record Flow UI selector/step map from the spike"
```

---

## Phase 1 Done When

- `badcode flow-prep camping <slide> -d <dir>` prints the prompt and downloads the reference files (Task 3, unit-tested).
- The Playwright MCP attaches to the logged-in Flow session over CDP (Task 2, verified by a signed-in screenshot).
- One real frame for a Camping slide was generated in Flow via that attach, judged, and pushed to the bucket (`badcode status camping` shows `latest✓`).
- `docs/superpowers/flow-selectors.md` records Flow's actual UI well enough to build the deterministic `badcode flow` command in Phase 2.

## Out of scope (Phase 2 / later cycles)

- The deterministic `badcode flow <slide>` command (Playwright library over CDP), unattended batch runs, and the end-of-run contact sheet for human spot-check.
- Video / frames→video generation.
- Populating `comic.meta.ts` scene prompts (step B) and the overall idea→design workflow (step A).
