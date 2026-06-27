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
