# Camping

> ## 🖐 Visuals are developed externally — do not regenerate
>
> **As of 2026-08-08, Camping's imagery is Jack's, made by hand in Flow outside
> this repo.** Do not generate character sheets, panels or a cover for this
> story, and do not try to reconstruct or replicate what already exists. The
> prompt-ledger initiative
> ([`design/2026-08-08-story-covers-and-prompt-ledger.md`](../../../design/2026-08-08-story-covers-and-prompt-ledger.md))
> explicitly excludes Camping and Karen for this reason.
>
> The **written canon below is still ours and still authoritative** — story,
> beats, characters, songs. It is only the image pipeline that lives elsewhere.
> The two character sheets in `characters/img/` and the Flow Character IDs in
> `characters/{tarquin,bob}.md` are kept as a historical record, not as a
> pipeline to feed.

> **Source of truth** for the Camping story — the single canonical folder,
> consolidated 2026-08-05 from the Kai <-> Jack story conversation in
> [`./master-notes-2026-08-04.md`](./master-notes-2026-08-04.md) (2026-08-04). That
> transcript outranks everything that came before it; the previous `camping`
> and `camping-v2` folders are retired and live on in git history. Method:
> [`../../storytelling.md`](../../storytelling.md); tone:
> [`../../voice.md`](../../voice.md); house style: the `badcode-art-direction`
> skill.

EP1, track 1. The trader who caused 2008 and the man it ruined meet outside
Waitrose — and an ayahuasca trip drops the trader five years forward into the
tent, after the AI has taken even his job.

## Canon

- [`story.md`](./story.md) — the locked structure: concept, the twelve beats,
  devices, decisions log, salvage list — **plus the
  [scene-by-scene storyboard](./story.md#storyboard--scene-by-scene-video-guide)
  Jack records the story video from**: shots, draft narration/dialogue, asset
  checklist
- [`master-notes-2026-08-04.md`](./master-notes-2026-08-04.md) — the archived
  Kai <-> Jack session transcript this canon was distilled from
- [`characters/tarquin.md`](./characters/tarquin.md) — Tarquin (posh London,
  sneering; 2008 / 2026 / ruined variants) — Flow sheet + Character record
- [`characters/bob.md`](./characters/bob.md) — Bob (Scouse, weathered; 2008
  variant) — Flow sheet + Character record
- [`characters/tent.md`](./characters/tent.md) ·
  [`characters/wank-tank.md`](./characters/wank-tank.md) — load-bearing object refs
- [`style.md`](./style.md) — thin per-story style notes (locations, warmth
  rules, motifs)
- [`songs/camping-ukg.md`](./songs/camping-ukg.md) — **the active cut** of the
  "Camping" track: UK garage over D&B, round 10 recovered from Suno with the
  boxes, sliders and model, plus the round-11 experiment grid
- [`songs/camping.md`](./songs/camping.md) — the released v1 of the track
  (lyrics + Suno style/exclude; predates the restructure)

## What's committed vs open

The **scene structure is locked** — the twelve beats in `story.md` are the
agreement. The exact narrator words and per-scene details are deliberately
open ("there's a really funny way to say that thing" is allowed to arrive
later). Change the story here first, then the media.

## Production tracker

| Medium | Where | Status |
| --- | --- | --- |
| Story spine | [`story.md`](./story.md) | **locked structure** (2026-08-04 master notes) |
| Storyboard (video) | [`story.md`](./story.md#storyboard--scene-by-scene-video-guide) | drafted from the spine — Jack to shoot from |
| Song — "Camping" (v1) | [`songs/camping.md`](./songs/camping.md) | **released** — Jack's music video is cut to it; lyrics predate the restructure |
| Song — "Camping" (UKG cut) | [`songs/camping-ukg.md`](./songs/camping-ukg.md) | **active cut** — round 10 (2026-09-13) is the base; round 11 grid drafted |
| Video | Jack, from the storyboard section of `story.md` | next up |
| Comic | `apps/web/src/comics/camping/` | **tells the old spine** (v1 recut, 24 pages) — rebuild from this canon when the video has proven the telling |
| Social posts | — | not started |

## Notes on the retirement

- `camping-v2/` (the pipeline rework of the old spine) is deleted; its useful
  parts were carried in here: the character visual specs and Flow records, the
  object refs, the style notes, and the character sheets in
  [`characters/img/`](./characters/img/). Its storyboard told the old story and
  was not carried.
- The Flow cloud project is still named `camping-v2`
  (`9b729074-da88-4668-a442-458e9a0f15ac`) and holds the `@Tarquin` / `@Bob`
  Flow Characters — the name refers to the Flow project, not a docs folder.
- The choose-your-own-ending idea stays parked in
  [`docs/ideas/camping-bandersnatch.md`](../../ideas/camping-bandersnatch.md).
