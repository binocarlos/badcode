# GPOM Short — tracker

The condensed teaser of the [GitPush Origin Master master arc](../gitpush-origin-master/README.md):
the whole fork in sixteen panels. Source of truth for the derived comic at
`apps/web/src/comics/gpom-short/` (Stage 6, not yet built).

## Stage tracker (make-comic)

| # | Stage | Status | Artifact |
|---|---|---|---|
| 1 | Idea | **drafted — pending approval** | [`story.md`](./story.md) |
| 2 | Characters | **drafted — pending approval** | [`characters/carrier.md`](./characters/carrier.md) |
| 3 | Character images | blocked on Stage-2 approval + Flow session | `characters/img/` |
| 4 | Storyboard | **drafted — pending approval** | [`storyboard/index.md`](./storyboard/index.md) + `p01–p16.md` |
| 5 | Storyboard images | blocked on Stage-4 approval + Flow session | `storyboard/img/` |
| 6 | Assemble | not started | `apps/web/src/comics/gpom-short/` |

*(Stages 1, 2 and 4 were drafted in one pass with the user away — every gate
that generates images or code is still closed. Approve/adjust 1–2–4, then
Stage 3 needs `./scripts/flow-chrome.sh` up and logged in.)*

## Decisions taken (defaults, cheap to reverse)

- **Slug:** `gpom-short`.
- **AI presence:** never embodied — narration + cosmic frame + the empty chair.
- **Length:** 16 panels, six sections (push / fall / ghosts / discovery / vault / fork).
- **Carrier:** look pinned here, name left open (master-arc open thread).

## Open threads

- Feed the Carrier's design back to the master canon if it sticks
  ([master open thread: the hundred as characters](../gitpush-origin-master/README.md#open-threads)).
- The cosmic-register grammar used here (cold clean light, vast scale, no VFX)
  is this short's working answer to the master arc's unresolved
  [register split](../gitpush-origin-master/README.md#image-direction--the-register-to-resolve) —
  if it works, promote it.
- Song: optional follow-on via `suno-prompt` after Stage 6 (the GPOM title track
  already exists in the master folder's `songs/`).
