---
name: comic-review
description: Use to visually review a rendered comic and propose changes — screenshots a scroll-driven comic from the running dev server, reads the frames, and suggests story/effect edits in the clean-cinematic BadCode direction. Triggers on "review the camping comic", "look at the comic", "screenshot the comic", "what should we change about <comic>", or closing the look→edit→re-capture loop.
---

# Comic Review (the look → decide → edit → re-capture loop)

Visually inspect a rendered comic and turn what you see into concrete edits. This
is the automatable loop: capture screenshots of the scroll-driven comic, look at
the frames, propose (and on request apply) changes, then re-capture to confirm.

## Prerequisites

- The dev server must be running: `npm run dev` (Vite, port 5173). Check with
  `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/` → `200`.
- Playwright + a Chromium build. The harness self-resolves Playwright from a
  local/global install or the npx cache. If it errors with "Playwright not
  found" or a missing-browser message, run `npx playwright install chromium`
  (and, if it names a headless shell revision, `npx playwright install
  chromium-headless-shell`).

## The loop

1. **Capture.** Run the harness against the comic's route:
   ```bash
   node scripts/capture-comic.mjs /comics/<slug> /tmp/comic-shots 14
   ```
   Args: `<route> <outDir> <shots>`. It scrolls the pinned scroll-comic in N
   evenly-spaced steps and writes `shot-NN-PPpct.png` (PP = scroll %).

2. **Look.** Read the PNGs with the Read tool (it views images). Read a spread
   across the comic first (0%, ~25/50/75%, 100%), then zoom into beats that look
   off. Note: a static frame can land *between* a bubble's scroll window or
   mid-transition — a blurry ThumbHash placeholder or an empty/half-typed
   bubble is often capture timing, not a bug. Re-capture with more shots or a
   different count to disambiguate before calling something broken.

3. **Decide + propose.** Judge against the creative direction (see
   `docs/superpowers/specs/2026-06-18-comic-effects-creative-direction-design.md`):
   **clean cinematic, restraint, scroll-scrubbed,
   the reader is the projectionist.** Effects serve the art; glitch only as a
   rare deliberate exception. Look for: broken/empty pages, plain bubbles that
   could be `reveal`/`typewriter`, default crossfades where a `pushIn` /
   `dipToBlack` / `lightDissolve` would serve the beat, missing grain/vignette
   coat, weak endings. Propose specific, page-anchored edits.

4. **Edit.** Apply changes in `apps/web/src/comics/<slug>/<Name>Comic.tsx` using
   the library per `packages/comic/AUTHORING.md`. Story/dialogue changes must
   also be reconciled into the `docs/<slug>/` canon (the source of truth) — do
   not let the artifact and canon drift. `npm run typecheck` after editing.

5. **Re-capture + compare.** Run the harness again into a *new* outDir
   (`/tmp/comic-shots-v2`) and read the same beats to confirm the before/after.

## Notes

- The harness drives a headless browser itself — no Browser MCP server required
  (none is registered with the CLI; the browser-extension MCP is not exposed to
  the session).
- Vite HMR means edits are picked up by the running dev server, so re-capture
  reflects changes without a restart.
- Keep the human in the loop for the creative call (what to change) and for true
  motion verification (typewriter/transition feel is best seen live, not in a
  static frame).
