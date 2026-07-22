# The Magic Money Tree

> **Source of truth** for this story. The comic derives from this folder.
> See [`../../storytelling.md`](../../storytelling.md) for the method and
> [`../../voice.md`](../../voice.md) for tone.

The first story taken end-to-end through the **Flow automation pipeline**: idea →
canon → storyboard → frames generated in Google Flow (driven by Claude over a
browser) → assembled comic in the browser.

A nurse is told there's no money for her ward — then watches the same system
conjure billions overnight for everyone but her. Load-bearing idea: scarcity is
manufactured; "we can't afford it" is a choice about who counts, not a fact.

## Canon

- [`story.md`](./story.md) — key concept, background, beats, the twist
- [`characters/dawn.md`](./characters/dawn.md) — Dawn (NHS nurse; the visual anchor)
- [`storyboard.md`](./storyboard.md) — the 10-panel plan: Flow prompts + narration

## Production tracker

| Medium | Where | Status |
| --- | --- | --- |
| Story spine | [`story.md`](./story.md) | drafted Jun 2026 |
| Storyboard | [`storyboard.md`](./storyboard.md) | 10 panels drafted |
| Comic | `apps/web/src/comics/magic-money-tree/` | **built** — live at `/comics/magic-money-tree`; 10 Flow-generated frames (Dawn as a Flow Character), assembled scroll comic, verified rendering. Frames served from `public/` (bucket migration is a follow-up). Panel 9 (money tree) leaned illustrative — candidate for a photoreal reroll. |
| Song | — | not started |
| Video | — | not started |
