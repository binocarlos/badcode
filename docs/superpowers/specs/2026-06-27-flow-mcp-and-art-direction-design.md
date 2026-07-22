# Flow MCP server + art-direction skill — design

> Spec date: 2026-06-27
> Status: approved (brainstorming) → ready for implementation plan
> Branch: `worktree-feat+flow-mcp-and-art-direction`

## Problem

Google Flow image (and video) generation is currently driven by **prose instructions
inside skills** (`make-comic`, `animate-slide`) that puppeteer the generic **Playwright
MCP** step by step: navigate → new project → type prompt → click Create → wait → harvest
a signed CDN URL → write the file. This works (Camping and Karen shipped through it) but
has two structural problems:

1. **Mechanics are exposed to the model.** Every brittle detail — the signed-URL/CORS
   workaround, the `browser_run_code_unsafe` sandbox (no `fs`, forcing a `curl` handoff),
   completion polling with no real "done" signal, stale Playwright refs — is something
   the model has to reason through mid-loop. That costs tokens, latency, and reliability,
   and makes unattended batch runs impractical.
2. **Taste and mechanics are tangled.** The same skill files carry both "how to click
   Flow" and "what makes a good BadCode panel prompt." The judgment layer can't be reused
   or sharpened independently.

The project's own prior design already anticipated hardening the loop into a deterministic
command (`docs/superpowers/specs/2026-06-20-flow-automation-loop-design.md`), and
`docs/superpowers/flow-selectors.md` explicitly calls itself "the input contract for
hardening the loop into `badcode flow`."

## Goal

Split Flow generation along its natural seam:

- **Mechanics** → a deterministic **MCP server** (`@badcode/flow-mcp`) exposing generic
  generation tools. The model calls one tool and gets a saved file path back.
- **Taste** → a new **art-direction skill** (`badcode-art-direction`) modeled on the
  `frontend-design` plugin: encoded identity, a calibration section, and a
  plan→critique→generate→critique loop.

Both are **project-scoped and auto-activate** when working in the repo (skills via
`.claude/skills/`, the server via root `.mcp.json`). **No plugin** — see Non-goals.

## Non-goals

- **No plugin packaging.** Skills and MCP servers already auto-activate from the repo;
  a plugin only adds value for reuse across *other* repos or sharing with other people,
  which is not a current need. Packaging as a plugin is noted as a future option below and
  nothing in this design precludes it.
- **No change to the manual login model.** A human runs `scripts/flow-chrome.sh` once and
  logs into Google/Flow on the persistent profile. The server attaches to that browser; it
  does not automate login.
- **Reference/character consistency is out of scope for v1.** The spike
  (`flow-selectors.md`) flags this as the single biggest quality risk and as still needing
  its own investigation. v1 generates single images from a prompt; consistency is future
  work.
- **Flow's built-in "Make a Story" / "Develop a storyboard" agentic modes** are not used;
  we drive frame-by-frame.
- **Motion/Veo art direction** is not encoded in the new skill in v1 (images-first).

## Architecture

```
  you: ./scripts/flow-chrome.sh   (login once, persistent .flow-profile/)
            │  CDP :9222
            ▼
  ┌──────────────────────────────┐        ┌─────────────────────────────────┐
  │  @badcode/flow-mcp  (server)  │        │  badcode-art-direction (skill)  │
  │  MECHANICS — deterministic    │◀───────│  TASTE — identity + calibration │
  │  flow_status                  │ calls  │  + plan→critique→gen→critique   │
  │  flow_generate_image          │ tools  │                                 │
  │  flow_generate_video          │        │  records docs/stories/<story>/.../pNN.md│
  │  flow_refine                  │        └─────────────────────────────────┘
  └──────────────────────────────┘                       ▲
            │ playwright.connectOverCDP                   │ references
            ▼ drives Flow, harvests signed URL, fs-writes │
        saved file path  ──────────────────────────►  make-comic / animate-slide
```

Three layers, each with one job:

| Layer | Unit | Responsibility | Depends on |
| --- | --- | --- | --- |
| Mechanics | `@badcode/flow-mcp` | Drive Flow, harvest, save file. Knows nothing about comics. | A logged-in Chrome on CDP `:9222`; `playwright`; MCP SDK |
| Taste | `badcode-art-direction` skill | Prompt craft + critique loop + recording. | The server's tools; `docs/voice.md`; existing comics |
| Orchestration | `make-comic`, `animate-slide` | Stage flow; call into the skill for image steps. | Both above |

## Component A — `@badcode/flow-mcp` (MCP server)

### Placement & stack
- New workspace package `packages/flow-mcp` (added to root `workspaces: ["packages/*"]`).
- TypeScript, ESM, `"type": "module"`, Node ≥22 — matches `@badcode/cli`.
- Dependencies: `@modelcontextprotocol/sdk` (MCP TypeScript SDK), `playwright`.
- May reuse `@badcode/cli` helpers where useful (e.g. `flow-prep` for staging reference
  images), but does not depend on comic/repo layout.

### Browser model
- Connects with `chromium.connectOverCDP('http://localhost:9222')` — the same endpoint
  `scripts/flow-chrome.sh` exposes. The server **owns automation, not the browser
  lifecycle**: it never launches or logs in, only attaches.
- Registered in root `.mcp.json` as a second server `flow`, alongside the existing
  `playwright` entry (the Playwright MCP stays available for ad-hoc browser work). Local
  stdio server launched via `tsx packages/flow-mcp/src/server.ts` (exact invocation
  finalized in the plan).

### Tools (generic primitives)

All generation tools take an explicit `outPath` (absolute) and return the saved path plus
identifying metadata. They never decide *where* a comic asset belongs — that is the
skill/orchestrator's job.

| Tool | Input | Returns | Notes |
| --- | --- | --- | --- |
| `flow_status` | — | `{ loggedIn, projectOpen, url }` | Preflight; cheap. |
| `flow_generate_image` | `{ prompt, outPath }` | `{ path, mediaId, width, height }` | Opens/ensures a project, generates one image, harvests, writes file. |
| `flow_generate_video` | `{ imagePath, motion, model?, outPath }` | `{ path, mediaId }` | Image→video (Veo). Uploads `imagePath`, applies motion prompt, polls to completion, harvests `.mp4`. |
| `flow_refine` | `{ prompt, outPath }` | `{ path, mediaId }` | Sends a follow-up correction in the **same** Flow session (matches the spike's "generate → judge → follow-up fix" reality), harvests the new active canvas. |

### Internals (moved off the model)
- **Generation step sequence** (from `flow-selectors.md`): navigate
  `https://labs.google/fx/tools/flow` → ensure project (`button "add_2 New project"`) →
  type into the agent textbox (placeholder *"What do you want to create?"*) → submit
  (`button "arrow_forward Create"`) → wait for the assistant turn.
- **Harvest**: read `name` from the active canvas `<img>` src, resolve the authenticated
  `media.getMediaUrlRedirect` URL via Playwright's `page.request` (follows the 302 to the
  signed CDN URL with cookies, server-side), then **write the bytes to disk with `fs`**.
  Because the server runs in full Node (not the `browser_run_code_unsafe` VM sandbox), the
  curl/sandbox handoff documented in `flow-selectors.md` is no longer needed.
- **Completion signals**: stills — new assistant paragraph + `button "Generated image"`
  present; video — poll the media URL's `content-type` until it is `video/*` (the spike's
  working signal; `videoWidth`/chat-text are unreliable). Never a fixed sleep.
- **Locators**: ARIA role + accessible name/placeholder/text, never per-snapshot refs
  (`e123`), which go stale.
- **Active-canvas selection**: when multiple images are present, pick the largest
  on-screen `<img>` whose src includes `getMediaUrlRedirect` (the spike's heuristic).
- **Retries**: transient failures (selector-not-ready, slow turn) retried internally with
  bounded backoff before surfacing an error.

### Errors
- If `flow_status` shows Chrome unreachable or logged out, generation tools return a
  **structured error** instructing the caller to run `scripts/flow-chrome.sh` and log in.
- Generation timeout → error carrying last-known state (project URL, whether a turn
  started); the skill decides whether to retry or refine.
- Selector drift / unexpected DOM → fail loudly naming the step that broke;
  `flow-selectors.md` remains the maintained input contract.

## Component B — `badcode-art-direction` skill

### Placement
- `.claude/skills/badcode-art-direction/SKILL.md`. Auto-discovered; structurally modeled
  on the `frontend-design` plugin's single-`SKILL.md` shape.

### Sections
1. **Identity** — the BadCode visual house style, derived from the existing comics
   (`camping`, `karen`, `magic-money-tree`) and `docs/voice.md`. What our panels look and
   feel like; the through-line a reader should recognize.
2. **Calibration** — the highest-leverage borrow from `frontend-design`. Names the
   **generic AI-comic look to avoid** (e.g. over-rendered Midjourney sheen, default
   "cinematic" lighting, glossy soulless render) and steers explicitly toward the BadCode
   identity. Where a brief pins a look, the brief wins; where it leaves an axis free, don't
   spend it on the generic default.
3. **The loop** — for each panel:
   - *Plan* the prompt from the panel beat + canon.
   - *Critique* the prompt against the beat and `docs/voice.md` before sending ("does this
     read like a generic comic panel, or like *this* beat?"); revise.
   - *Generate* via `flow_generate_image`.
   - *Look* at the returned image and critique it against the panel's intent.
   - *Refine* via `flow_refine` (same session) or accept.
4. **Recording** — write `docs/stories/<story>/storyboard/pNN.md` with the exact prompt sent and a
   revision log entry (existing format, unchanged), so "just like that but change X" stays
   one cheap step.

### Scope
- **Images-first.** Motion/Veo art direction is explicitly future work.
- `make-comic` is updated to **reference** this skill for its image stages (Stage 3
  characters, Stage 5 panels), deleting the now-duplicated inline prompt guidance.
- `animate-slide` is unchanged in v1.

## Data flow (end to end)

1. Human runs `scripts/flow-chrome.sh` once and logs in.
2. Inside `make-comic`, the art-direction skill plans and self-critiques a prompt.
3. Skill calls `flow_generate_image({ prompt, outPath: docs/stories/<story>/storyboard/img/pNN.png })`.
4. Server drives Flow, harvests the signed URL, writes the file, returns `{ path, mediaId, … }`.
5. Skill looks at the image, critiques vs the beat; calls `flow_refine` or accepts.
6. Skill records the exact prompt + revision in `docs/stories/<story>/storyboard/pNN.md`.
7. (Existing, unchanged) `badcode push` / `assets-build` for v2 bucket-pipeline comics.

## Testing

- **Server unit tests** (vitest, mirroring `@badcode/cli`): pure logic — mediaId/URL
  parsing, active-canvas selection given a mocked `page`, `outPath` handling, error
  shaping. Harvest is tested against a fake `page`/`request` object.
- **Live browser-driving**: not in CI. A small manual smoke script generates one image
  against a logged-in Flow and asserts a non-empty file of the right type; a known-good
  run is recorded.
- **Skill**: validated by generating a real panel and eyeballing it against the beat; no
  automated test (it is judgment guidance).

## Phasing

- **Phase 1 — MCP server.** `packages/flow-mcp` with `flow_status`,
  `flow_generate_image`, `flow_refine`, `flow_generate_video`; `.mcp.json` wiring; unit
  tests + smoke script. The foundation.
- **Phase 2 — art-direction skill.** Write `badcode-art-direction/SKILL.md` (identity +
  calibration mined from existing comics + the loop + recording); rewire `make-comic` to
  reference it and drop the inline prompt prose.
- **Future (noted, not built):** plugin packaging if sharing ever matters;
  reference/character consistency; motion/Veo art direction; aspect-ratio pinning.

## Open questions

None blocking. Server placement is settled (new `packages/flow-mcp` package, not a
`@badcode/cli` subcommand). The exact stdio launch invocation in `.mcp.json` and the MCP
SDK version are implementation details for the plan.
