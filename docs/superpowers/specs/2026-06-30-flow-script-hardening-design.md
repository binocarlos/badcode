# Flow Script Hardening — design

> 2026-06-30. Make Google Flow automation **fast and trusted** by hardening the
> `@badcode/flow-mcp` script layer against the live UI, then documenting a
> plan-prompts → batch-generate → iterate workflow. Test subject: **camping-v2**.

## Problem

`@badcode/flow-mcp` already exists (merged to main): a deterministic Playwright
client (`flow-client.ts`) that attaches to the logged-in Chrome over CDP and
exposes higher-order MCP tools (`flow_status`, `flow_generate_image`,
`flow_refine`, `flow_generate_video`). The architecture is correct — selectors
live in one place, located by ARIA role/text, swappable when the UI changes.

But it is **slow in practice** for two reasons:

1. **Never validated live.** `flow-client.ts` was written to the documented
   selector contract (`flow-selectors.md`) but never run against a logged-in
   Flow window. Because the scripts are untrusted, the working habit falls back
   to driving Flow with the raw Playwright MCP + `browser_snapshot` — reading the
   whole page every step. That page-reading is the slowness.
2. **The action set is incomplete.** Missing exactly the actions that matter for
   a multi-panel comic: open an *existing named* project, create a character,
   generate an image that *references* a character. Character/reference
   consistency was flagged from day one as the single biggest quality risk.

## Goal

Get into "running Flow scripts" mode: every Flow action is a single deterministic
tool call with no page-reading, fast enough to loop on 1–4 slides at a time. The
workflow — plan all prompts first, batch-generate, then refine only the weak
slides — becomes documented practice in the comic skills.

## Non-goals

- No rewrite of the MCP architecture; it is sound. We finish and validate it.
- No aspect-ratio pinning, rate-limit handling, or 50-frame unattended runs yet
  (future work; out of scope for this pass).
- Not building the agent framework (separate project).

## Core principle: observe-then-codify

We never ship a selector we have not watched succeed live. For each action:

1. Drive it **once** live via the raw Playwright MCP against camping-v2.
2. Capture the selectors / step sequence that actually work.
3. Bake them into a `flow-client` method (+ MCP tool if user-facing).
4. **Re-run the tool** to prove it round-trips.
5. Record the observed truth in `flow-selectors.md`.

`flow-selectors.md` becomes a log of observed reality, not a wish list. This
discipline is the actual fix — the existing scripts are untrusted precisely
because they were written blind to a contract.

## Layer 1 — the `flow-client.ts` script library

The full set of higher-order actions, hardened easiest → hardest:

| # | Action | State today | Work |
| - | --- | --- | --- |
| 1 | `status()` | exists | confirm live |
| 2 | `openProject(name)` — open existing **camping-v2** by name | only creates a blank "New project" | new |
| 3 | `generateImage(prompt)` → harvest | written, unvalidated | validate live |
| 4 | `refine(prompt)` — same-session correction | written, unvalidated | validate live |
| 5 | `createCharacter(name, refImages)` | missing | recon + new |
| 6 | `generateImage(prompt, { character })` — reference a character | missing | recon + new |
| 7 | `generateVideo(image, motion)` → harvest | written, unvalidated | validate live (heaviest) |

Downloads stay **baked into** generate/video via the existing signed-URL harvest
(`page.request.get` → signed CDN URL → write to disk). No standalone download
tool unless recon shows we need to re-fetch an already-generated media.

## Layer 2 — the new speed tool

**`flow_generate_batch({ prompts: string[], outDir })`** — the concrete answer to
"generate 4 slides as fast as possible":

- Connects **once**, ensures project + image-mode **once** (today every
  `flow_generate_image` re-attaches over CDP and re-runs `ensureImageMode`,
  opening menus each call — wasted overhead across a batch).
- Fires N prompts sequentially in the same Flow agent session (Flow is one
  agent/canvas per project — sequential, not parallel).
- Harvests each result to `outDir/<index>.jpg`, returns one record per slide
  (`{ index, prompt, path, mediaId, width, height }`).

The wall-clock floor is still Flow's ~28s/image generation time; the win is that
the model is **out of the loop** between slides — no page-reading, no per-call
re-config.

## Layer 3 — the documented workflow

Written into `make-comic` / `badcode-art-direction`:

> **Plan → batch → iterate.** Plan the prompts for the N slides (1–4) you want to
> work on *first*. Fire all N with `flow_generate_batch` (unattended). Review the
> batch together. Then `flow_refine` only the weak slides — changing one slide is
> a cheap same-session follow-up, not a fresh whole-page interaction.

This makes "focus on a couple of slides and keep looping" the default rhythm.

## Process / ordering

1. Open a fresh browser (`./scripts/flow-chrome.sh`), `status`,
   `openProject('camping-v2')`.
2. Validate `generateImage` + `refine` + harvest — the core loop.
3. Add `flow_generate_batch`; write the plan→batch→iterate workflow into the skill.
4. Recon + build `createCharacter` and generate-with-character — the consistency
   unknown.
5. Validate `generateVideo` — last, heaviest.

Each step is observe-then-codify, ending in a green re-run of the tool.

## Risks

- **Character/reference flow is unknown** — recon may reveal it needs its own
  sub-design (e.g. character sheets vs Add Media). If it balloons, we land
  steps 1–3 (the fast image loop the user wants most) and split characters/video
  into a follow-up.
- **Live selectors drift from the documented contract** — expected; that is why
  we observe-then-codify and update `flow-selectors.md` as we go.
- **Per-call CDP re-attach** is acceptable for single actions; the batch tool is
  where we eliminate it for throughput.

## Definition of done

- `status`, `openProject`, `generateImage`, `refine`, `createCharacter`,
  generate-with-character, and `generateVideo` each proven by a live re-run.
- `flow_generate_batch` generates + harvests a multi-slide batch in one call.
- `flow-selectors.md` updated to observed truth for every action.
- The plan→batch→iterate workflow documented in the comic skill.
- A real camping-v2 batch (1–4 slides) generated end-to-end as the acceptance run.
