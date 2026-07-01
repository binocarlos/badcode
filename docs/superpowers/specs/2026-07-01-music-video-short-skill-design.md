# Design: `music-video-short` — a staged BadCode short-form music-video skill

> Brainstormed with Kai, 2026-07-01. Feasibility exploration that landed on a
> **human-in-the-loop guide**, not full automation. The insight: Suno is
> inherently a "roll it a few times until one hits" process, so a human
> moderating the generation is a feature, not a gap to automate away. So this
> skill guides the human toward the goal and only automates the link that's
> already proven (Flow clips). Composes `suno-prompt`, `badcode-art-direction`,
> and `@badcode/flow-mcp`. See [[flow-automation-integration]],
> `docs/superpowers/flow-video.md`, and the sibling `make-comic` skill.

## Goal

A multi-stage orchestrator skill that takes a **10–20s BadCode music-video short**
from **spark → cut-ready package** (Suno track + Flow scene clips + an edit plan),
running as a gated workflow: each stage is *discuss → approve → produce*, and
nothing is produced before that stage's discussion is approved. It **composes**
existing pieces rather than duplicating them.

The skill is deliberately **not autonomous.** Two links stay with the human — the
Suno generation (a manual gate) and the final cut (the skill hands over an edit
plan, not a rendered `.mp4`). Only the one already-proven mechanical link — Flow
`image→video` clip generation — is automated.

## Principles

- **Guide, don't automate the fool's game.** The value is a workflow that walks
  the human to the goal. Suno's iterate-until-good nature *wants* a human in the
  loop; the skill leans into that rather than fighting it.
- **The song leads.** The track is generated early (Stage 2) so it can bake
  through the human's Suno rolls while the visuals are built, and every later
  stage cuts to the track's **real measured structure** (`ffprobe`), not a guess.
- **Gated stages, like brainstorming / `make-comic`.** Never generate a clip
  before the relevant discuss-stage is approved.
- **Compose, don't duplicate.** Reuse `suno-prompt` (song), `badcode-art-direction`
  (stills), `@badcode/flow-mcp` (clips). Each stays usable standalone.
- **Every clip is reproducible.** The exact still prompt + motion prompt +
  provenance + revision log for each scene is recorded in git, so "just like that,
  but change X" is a first-class, cheap operation (same mechanism as `make-comic`).
- **Voice is load-bearing.** Lyrics and concept follow `docs/voice.md`; every
  short carries one political/economic idea (`docs/storytelling.md`).

## The six stages

Each stage gates on user approval before the next begins. Modes: **author** (the
skill drafts copy/prompts), **⏸ manual gate** (skill hands the human instructions
and waits), **⚙ auto** (skill drives Flow).

1. **Concept** — *author.* Discuss the hook, the one load-bearing
   political/economic idea, vibe, genre (default drum & bass), and target length
   (10–20s). Write `docs/shorts/<name>/concept.md`. **Gate:** approve the spine.

2. **Song** — *⏸ manual gate.* Invoke `suno-prompt` to produce the style prompt,
   exclude-styles list, and **short lyrics sized to ~15s**. Write `song.md`. The
   skill prints a **copy-paste hand-off block** + instructions: paste into Suno,
   roll until one hits, download the mp3 to `docs/shorts/<name>/audio/track.mp3`.
   The human drops the audio back; the skill runs `ffprobe` to read its **real
   duration** and records it in `song.md` (plus any human note on where the drop /
   sections land). **Gate:** the track is chosen and its duration is recorded.

3. **Look & cast** — *author.* Mini art-direction using the
   `badcode-art-direction` identity: the visual world and 1–3 characters. Write
   `look.md`. If characters recur across scenes, optionally set up a **Flow
   Character** per character (the cross-scene consistency anchor, via
   `flow_create_character`). **Gate:** approve the look + cast.

4. **Scene breakdown** — *author.* Map the **actual** song (measured length +
   section boundaries) to N scenes (~4–8 for 15s). Each scene = one shot
   description + a motion note + which character(s) it references. Write per-scene
   records `scenes/sNN.md` + `scenes/index.md`. **Gate:** approve the board.

5. **Generate clips** — *⚙ auto.* For each scene: generate the art-directed still
   (`flow_generate_image`, referencing the relevant Flow Character), then animate
   it to a short clip (`flow_generate_video`, the motion note as the motion
   prompt), harvest the `.mp4` to `clips/`. Judge against scene + house style;
   reroll weak clips. Record the exact prompts + revision log per scene. **Gate:**
   review the clips.

6. **Edit plan** — *⏸ manual gate.* Given the audio duration + section boundaries
   + the generated clips, emit an **edit plan** (`edit-plan.md`): ordered clips,
   in/out trims, and cut timestamps synced to the beat, with notes. The human cuts
   it in their editor. (Bonus, not required for v1: the plan MAY include a
   ready-to-run `ffmpeg` concat/mux command as a convenience — but the skill's
   contract is the *plan*, not a rendered video.)

## On-disk structure (standalone lightweight)

Each short is its own tiny project — no full `new-story` canon required:

```
docs/shorts/<name>/
  README.md        # backbone + tracker (like other story dirs)
  concept.md       # hook, the one idea, vibe, genre, target length
  song.md          # style prompt, exclude-list, lyrics, measured duration
  audio/track.mp3  # human drops this back from Suno
  look.md          # visual world + cast (+ Flow Character ids if used)
  scenes/
    index.md
    sNN.md         # per-scene shot record (still prompt, motion note, chars)
    img/sNN.jpg    # the harvested still for each scene
  clips/           # generated .mp4s (sNN.mp4), one per scene
  edit-plan.md     # the hand-off for the human's final cut
```

`docs/shorts/README.md` documents the folder convention (what a short is, the
stage artifacts, the tracker shape) — the entry point for the medium.

## Record format (the iteration mechanism)

Each scene is one markdown file `docs/shorts/<name>/scenes/sNN.md`, eyeball-able
on GitHub, pairing the clip with its **exact prompts** and a **revision log**:

```markdown
---
scene: 3
song_section: drop            # intro | build | drop | outro …
characters: [karen]
still_media_id: db1ceac4-…
clip_media_id: 7f2a…
status: done                  # planned | done
---
![scene 3 still](img/s03.jpg)  ·  clip: `clips/s03.mp4`

**Still prompt (exact, sent to Flow):**
> …character Karen, low-angle, picket line at dawn…

**Motion prompt (exact, sent to Flow):**
> slow push-in, banners ripple, embers drift

**Beat note:** lands on the drop (~00:07).

**Revisions:**
- v1 (2026-07-01) — initial
- v2 — "same but push-in faster, colder grade"
```

**The iteration loop:** to change a scene, the skill opens `sNN.md`, reads the
recorded prompts, re-prompts Flow (re-referencing the same Flow Character), re-runs
`image→video`, harvests the new clip, **appends a revision line**, and replaces the
files. This is the primary reason the record exists.

## Flow connection

Clip generation (Stage 5) and Flow Character setup (Stage 3) **require Flow
connected**, exactly as `make-comic` / `flow-mcp` prescribe:

1. Check `flow_status()` (Chrome CDP `http://localhost:9222`, logged in, project
   open).
2. If not connected, walk the user through setup: run `./scripts/flow-chrome.sh`,
   log into Google, open/select the Flow project; restart / `claude --resume` if
   the MCP isn't loaded.
3. Once connected, auto-generate via the `flow-mcp` tools
   (`flow_generate_image`, `flow_create_character`, `flow_generate_video`), which
   already handle the harvest-to-disk signed-URL mechanics.

## Audio ingest (Stage 2 → later stages)

When the human drops `audio/track.mp3` back, the skill runs
`ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 <file>` to
capture the **real duration**, and records it in `song.md`. Section boundaries
(intro / build / drop / outro) are captured from the human's note — v1 does **not**
attempt automatic beat detection; the human's ear is the source of truth for where
cuts land. The measured duration drives Stage 4's scene count and Stage 6's
timings.

## Packaging

- `.claude/skills/music-video-short/SKILL.md` — **a single self-contained file**
  (repo convention). It carries the full instructions: the six-stage flow and
  gates, the two manual-gate hand-off blocks (the Suno copy-paste + return
  instructions; the edit-plan format), the `ffprobe` ingest, the per-scene record
  format, and the Stage 5 Flow connection check + generate → animate → harvest →
  record routine.
- **Points at (for depth, not duplicated):** `docs/voice.md`,
  `docs/storytelling.md`, the `suno-prompt` skill, the `badcode-art-direction`
  skill, `docs/superpowers/flow-video.md`, and `packages/flow-mcp/README.md`.
- A short row is added to `docs/shorts/README.md`'s index.

## Resume & progress

Progress *is* the artifacts: `concept.md` present → Stage 1 done; `audio/track.mp3`
+ a recorded duration → Stage 2 done; `look.md` → Stage 3; `scenes/*` → Stage 4;
an `sNN.md` with `status: done` and a `clips/sNN.mp4` → that scene's clip done;
`edit-plan.md` → Stage 6. The skill resumes by inspecting `docs/shorts/<name>/`
and continues at the first incomplete stage/scene.

## Out of scope (v1)

- **Rendering the final `.mp4`.** The skill's contract ends at the edit plan; the
  human cuts it. (An optional convenience `ffmpeg` command in the plan is allowed,
  but auto-muxing is explicitly a later cycle.)
- **Automating Suno.** Locked out by design — a manual gate, not a gap.
- **Automatic beat/section detection** from the returned audio. Human's note is
  the source of truth for section boundaries in v1.
- **Anchoring to existing story canon.** v1 is standalone-lightweight only;
  deriving a short from an existing `docs/<story>/` is a future option.
- **Publishing the short to the website.** Distribution is a separate concern.

## Success criteria

- The skill runs the six gated stages, reusing `suno-prompt` for the song,
  `badcode-art-direction` for the stills, and `flow-mcp` for the clips, and
  produces a `docs/shorts/<name>/` package: a chosen Suno track, per-scene Flow
  clips, and an `edit-plan.md` cut-ready against the track's real duration.
- The Suno hand-off is a clean copy-paste-and-return gate; the skill correctly
  ingests the returned mp3 and records its measured duration.
- Every generated clip has an `sNN.md` record with its exact still + motion
  prompts, provenance, and revision log committed to git.
- "Change scene N like this" reliably re-generates that one clip, appends a
  revision line, and updates the files — without disturbing other scenes.
- Re-invoking the skill on an existing `docs/shorts/<name>/` resumes rather than
  restarts.
