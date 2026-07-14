# @badcode/flow-mcp

MCP server that drives Google Flow over CDP to generate images/videos and harvest them to disk.

## Prerequisites
1. `./scripts/flow-chrome.sh` — launches Chrome on CDP `:9222` with the persistent
   `.flow-profile/`. Log into Google/Flow once in that window and leave it running.

## Tools
- `flow_status()` → `{ loggedIn, projectOpen, url }`
- `flow_open_project({ name })` → opens an existing project by exact name
- `flow_generate_image({ prompt, outPath, character?, numOutputs? })` → `{ path, mediaId, width, height, candidates? }`
- `flow_edit_image({ prompt, referenceImages, outPath, numOutputs?, character? })` →
  `{ candidates: [{ path, mediaId, width, height }], partial? }` — uploads the reference
  image(s) as prompt ingredients and applies a delta prompt; `numOutputs` defaults to 2
  (candidates saved with `-a`/`-b`… suffixes). Always reference the golden original, not a
  previous edit output.
- `flow_refine({ prompt, outPath })` → `{ path, mediaId }` (same session)
- `flow_generate_batch({ prompts, outDir })` → `BatchItem[]` (`<outDir>/NN.jpg`)
- `flow_generate_video({ imagePath, motion, model?, outPath })` → `{ path, mediaId }`
- `flow_create_character({ name, refImages })` → `{ name }`

All `outPath` values are absolute; the server never decides where comic assets live.
The CDP attachment is cached across calls (reconnects automatically if Chrome restarts).

## Smoke test
`npx tsx packages/flow-mcp/src/smoke.ts` (needs a logged-in Flow window).
`npx tsx packages/flow-mcp/src/smoke-edit.ts [referenceImage]` proves the edit/ingredients path
(needs a project named `edit-smoke`).

## Selector contract
`docs/superpowers/flow-selectors.md` (images) and `docs/superpowers/flow-video.md` (video).
If Flow's UI drifts, fix `src/flow-client.ts` and update those docs.
