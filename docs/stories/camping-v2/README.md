# Camping (v2)

> **Source of truth** for the reworked Camping story. The comic derives from this
> folder via the official pipeline. Faithful from-scratch rebuild of the imported
> [`../camping/`](../camping/README.md), which stays **frozen as reference**.
> Method: [`../../storytelling.md`](../../storytelling.md); tone:
> [`../../voice.md`](../../voice.md); house style: the `badcode-art-direction` skill.

EP1, track 1. A financier and the homeless man he judged both get automated away.

## Why v2 exists

The original `camping` was imported from Storyteller with no pipeline-owned
character sheets and no per-panel prompt provenance. `camping-v2` rebuilds it
faithfully through `make-comic` (canon) → `flow-mcp` + `badcode-art-direction`
(images, with full prompt records) → `@badcode/comic` (assembly), so every
character and panel has a prompt-record and "just like that, but change X" is one
cheap step. Spec:
[`../../superpowers/specs/2026-06-27-camping-karen-from-scratch-rework-design.md`](../../superpowers/specs/2026-06-27-camping-karen-from-scratch-rework-design.md).

## Canon

- [`story.md`](./story.md) — key concept, background, beats, device, twist, ending
- [`characters/tarquin.md`](./characters/tarquin.md) — Tarquin (posh London, sneering)
- [`characters/bob.md`](./characters/bob.md) — Bob (Scouse, weathered)
- [`characters/tent.md`](./characters/tent.md) · [`characters/wank-tank.md`](./characters/wank-tank.md) — object refs
- [`style.md`](./style.md) — thin per-comic style notes (the global house style lives in the skill)
- [`storyboard/`](./storyboard/) — `index.md` + per-panel `pNN.md` records

## Production tracker

| Medium | Where | Status |
| --- | --- | --- |
| Story spine | [`story.md`](./story.md) | reworked 2026-06-27 — ending decided (Bob's grace) |
| Characters | [`characters/`](./characters/) | Phase 1 — drafting canon + sheet descriptions |
| Storyboard | [`storyboard/`](./storyboard/) | Phase 1 — pending |
| Character images | `characters/img/` | Phase 2 — not started (flow-mcp) |
| Panel images | `storyboard/img/` | Phase 3 — not started (flow-mcp) |
| Comic | `apps/web/src/comics/camping-v2/` | Phase 4 — not started |
| Animations | — | Phase 5 — deferred (`animate-slide`) |
| Song — "Camping" | reuse [`../camping/songs/camping.md`](../camping/songs/camping.md) | unchanged; out of scope here |

## Tooling notes (Phase 2)

- **Flow project:** `camping-v2` (`9b729074-da88-4668-a442-458e9a0f15ac`).
- **Official Flow Characters created** from the harvested sheets: `@Tarquin`
  (`29e97ae3…`) and `@Bob` (`7566666e…`). Casting works by writing the `@tag` as
  plain text in the prompt — the likeness binds (validated on p03).
- **`flow_generate_image` was broken vs the live Flow UI — now FIXED** in
  `packages/flow-mcp/src/flow-client.ts` (this worktree): (1) prompt box located
  by placeholder text via `getByRole('textbox').filter({ hasText })` (it's an
  empty-named contenteditable); (2) submit targets `arrow_forward Create`
  specifically; (3) new `ensureImageMode()` forces single-image mode (the bar
  defaults to Video · 8s); (4) `SCRAPE_IMGS` is now invoked as an IIFE
  (`(${SCRAPE_IMGS})()`) — it was passed as a bare arrow string so the harvest
  never returned an array; (5) `connect()` prefers an open `/project/` page.
  Validated by a live generation (p02) + the 19 unit tests. **The running MCP
  server loads at session start, so the fixed tool needs a Claude restart to take
  effect** — until then, generate via `npx tsx` against the same client.

## Phase (per spec)

1. **Essence capture** (this phase) — canon only: story, characters + sheet
   descriptions, thin style, storyboard. No images.
2. Character images via `flow-mcp` + `badcode-art-direction`. **Note:** existing
   Tarquin/Bob sheets already live in Flow's *Images* (not the *Characters*
   feature). Phase 2 opens by harvesting those and **promoting them to official
   Flow Characters** — reuse the look, don't regenerate from a blank prompt —
   then refine only if needed.
3. Panel images via the art-direction loop; commit per locked image.
4. Assemble with `@badcode/comic`; verify it renders.
5. Animations later via `animate-slide` (after bucket-pipeline migration).
