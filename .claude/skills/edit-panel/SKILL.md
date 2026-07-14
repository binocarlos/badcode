---
name: edit-panel
description: >
  Use to edit an EXISTING comic panel image — "take page 4 of <comic> and shift the
  apple left", "edit panel N", "change page N of…". Resolves the page to its image
  file + exact recorded prompt + characters WITHOUT opening a browser (badcode panel),
  then runs a fast user↔agent loop over flow_edit_image: reference-anchored delta
  prompt, 2 candidates per round, user picks, record updated. De-novo panel generation
  stays with badcode-art-direction; animated pages with animate-slide.
---

# edit-panel — iterate on an existing comic panel image

The laser-focused loop: the user names a page and an alteration; you show them the
current image, generate **two reference-anchored candidates**, they pick or redirect,
you record and replace. Every round is one MCP call — never hand-puppeteer Flow via
the Playwright MCP.

## 1. Preflight (mechanical — delegable to the `flow-operator` agent)

1. `badcode panel <comic> <page>` (Bash, repo root: `npx tsx packages/cli/src/bin.ts panel <comic> <page>`)
   → JSON with `golden`, `prompt`, `characters`, `record`, `assetKey`, `webImage`, `storage`.
   - `NO_RECORDS` / `RECORD_NOT_FOUND` → tell the user that comic isn't on the record
     pipeline yet; stop.
   - `PAGE_NOT_IMAGE` → hand off to **animate-slide**.
2. If any flow call returns `NOT_RUNNING`: launch Chrome yourself —
   `Bash run_in_background: true` → `./scripts/flow-chrome.sh`, poll
   `curl -s -m 2 http://localhost:9222/json/version` until JSON, then `flow_status`.
   Only bounce to the user if `loggedIn: false` (expired session).
3. `flow_open_project` — use the comic's Flow project if one exists (e.g. `camping-v2`);
   otherwise any scratch project (e.g. `edit-smoke`). The edit is fully anchored by the
   uploaded reference, so project choice only affects where Flow files its media.

## 2. Show the current state

`Read` the `golden` image (that IS the panel as rendered, minus overlays/bubbles —
no dev server, no screenshots) and quote the recorded prompt + revision count.
Confirm with the user this is the image they mean.

## 3. Construct the delta prompt

Three parts, nothing else:

1. **Style anchor (1 line):** the comic's register line — take it from the recorded
   prompt's opening (e.g. gpom-short's "Hyper-realistic documentary photograph, shot
   on 35mm film…"). Keeps the edit inside the BadCode look.
2. **Google's edit template, verbatim structure:**
   > Using the provided image, change only **[the thing]** to **[the change]**.
   > Keep everything else in the image exactly the same, preserving the original
   > style, lighting, and composition.
3. **Batch, don't drip:** several requested changes go into ONE round ("change only
   X and Y"), not one round each — every round costs generation time and, on chained
   bases, quality.

## 4. Generate — always from the golden

```
flow_edit_image({
  prompt, referenceImages: [<golden>], numOutputs: 2,
  outPath: "<abs>/docs/<story>/storyboard/img/pNN-rev<K>.jpg",   // K = revisionCount + 1
})
```

- **The reference is ALWAYS the accepted golden original** — never a rejected
  candidate, never the chain tip. Exception: the user explicitly says "build on
  candidate B"; then B is that round's reference and you're on a chain (see §6).
- `characters` in the record need no re-casting for edits — the character is already
  IN the golden reference. Pass `character` only when the edit *introduces* a canon
  character (create/verify it in the Flow project first via `flow_create_character`).

## 5. Judge

`Read` both candidates. Present them labeled **A** and **B** with a one-line critique
each (against the requested change + the register — did anything else drift?). The
user picks, tweaks the ask, or calls another round. Don't pick for them.

## 6. Anti-degradation policy

- Golden-referencing (§4) means rounds don't stack loss — each candidate is one
  generation away from the original.
- **On a chain** (user chose "build on B"): after ~3 chained rounds, or when the edits
  feel settled, offer **lock-and-rebuild** — merge every accepted delta into one full
  structural prompt (start from the record's prompt, edit it to describe the final
  state) and regenerate clean from the golden. The winner becomes the new golden and
  the record's main prompt is REWRITTEN to the merged prompt.
- One conceptual edit per prompt sentence; never re-feed a visibly softened image.

## 7. On accept

1. Copy the winner over `docs/<story>/storyboard/img/pNN.<ext>` — the new golden.
2. Copy it to `apps/web/public/comics/<comic>/<assetKey>` (`storage: "local"`), or for
   bucket comics push + rebuild the manifest (`badcode push` / `badcode assets-build`
   — see the comic's pipeline).
3. Update the record `pNN.md`: set `flow_media_id` to the winner's `mediaId`, append a
   revision line — date, the **exact delta prompt**, which candidate won:
   `- v<K> (<date>) — <delta prompt>. Picked candidate <A|B>; referenced golden v<K-1>.`
   (If lock-and-rebuild ran, also replace the main prompt block.)
4. Delete the rejected candidate files (`pNN-rev<K>-a/b.jpg` leftovers).
5. Confirm in the running app only if asked — `npm run dev` +
   `/comics/<comic>` (the golden IS the frame; a browser check is optional polish).

## Speed rules

- Page → image + prompt via `badcode panel`, NOT via browser navigation or screenshots.
- One `flow_edit_image` call per round (two candidates in one turn); `flow_refine` is
  for same-session nudges only when the user builds on the immediately previous
  generation.
- The Flow MCP caches its CDP attachment — don't relaunch Chrome between rounds.
- Mechanical preflight (Chrome launch, project open, resolver call, retry-on-TIMEOUT)
  may be delegated to the **flow-operator** agent; prompt-craft and image judgment
  stay in the main conversation.
