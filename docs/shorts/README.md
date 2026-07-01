# `docs/shorts/` — short-form music videos

A BadCode **short** is a 10–20s music-video piece: its own lightweight medium — not a
comic, not full story canon — built to land one political or economic idea, in the
BadCode voice, over a track. Small enough to spark, produce, and ship fast.

## Folder layout

Every short lives in its own folder, laid out like this:

```
docs/shorts/<name>/
  README.md        # backbone + tracker for this short
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

## Stage → artifact

| Stage | Artifact | Mode |
|---|---|---|
| Concept | `concept.md` | author |
| Song | `song.md` + `audio/track.mp3` | ⏸ manual gate |
| Look & cast | `look.md` | author |
| Scene breakdown | `scenes/` | author |
| Clips | `clips/` | ⚙ auto |
| Edit plan | `edit-plan.md` | ⏸ manual gate |

Song and Edit plan are manual gates — the human generates the track in Suno and cuts
the final video by hand. Clips is the one automated stage, driven over Flow.

This medium is produced by the **`music-video-short`** skill
(`.claude/skills/music-video-short/`).

## Index

| Short | Idea | Status |
|---|---|---|
| _(none yet)_ | | |
