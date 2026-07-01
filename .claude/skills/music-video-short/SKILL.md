---
name: music-video-short
description: Use to take a BadCode short-form music video (10–20s) from idea to a cut-ready package — a Suno track, Flow scene clips, and an edit plan — as a gated, human-in-the-loop workflow. Triggers on "make a short", "music video short", "turn this into a short video", "short-form video", or any request to build a 10–20s BadCode clip set to music. Composes suno-prompt (song) + badcode-art-direction (stills) + flow-mcp (clips).
---

# Music Video Short (BadCode)

Take a short-form music video (10–20s) from **spark → cut-ready package**, run
as a gated workflow: each stage is *discuss → approve → produce*. Nothing is
produced before its stage is approved. This skill **composes** existing
tools — it does not duplicate them, and it is **not autonomous**: Suno
generation and the final cut stay with the human.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — load-bearing tone (sarcastic, dark, total authority; politics
  & economics first; story over sermon). All copy and lyrics match it.
- `docs/storytelling.md` — the method: one load-bearing idea, real grounding.
- The **`suno-prompt`** skill — turns the song idea into a Style prompt,
  Exclude-Styles list, and lyrics. Drives Stage 2.
- The **`badcode-art-direction`** skill — prompt craft + critique loop for
  every still. Drives Stages 3 and 5.
- `packages/flow-mcp/README.md` — the `flow` MCP server (tools, prerequisites)
  used in Stages 3 and 5.
- `docs/shorts/README.md` — the on-disk folder convention every stage below
  writes into.

## The six stages (each: discuss → approve → produce)

| # | Stage | Mode | Produces |
|---|---|---|---|
| 1 | Concept | author | `docs/shorts/<name>/concept.md` + `README.md` |
| 2 | Song | ⏸ manual gate | `song.md` + `audio/track.mp3` (+ measured duration) |
| 3 | Look & cast | author | `look.md` (+ Flow Character ids) |
| 4 | Scene breakdown | author | `scenes/index.md` + `scenes/sNN.md` (planned) |
| 5 | Clips | ⚙ auto | `clips/sNN.mp4` + record per scene |
| 6 | Edit plan | ⏸ manual gate | `edit-plan.md` |

## Gating principle

Never run a *produce* step before the user approves that stage's *discuss*
output. After each stage, summarise what was produced and ask before
proceeding. This mirrors how `make-comic` and `superpowers:brainstorming` gate
their sections.

## Resume

Progress **is** the artifacts. On invocation, inspect `docs/shorts/<name>/`
and continue at the first incomplete stage:

- `concept.md` present → Stage 1 done.
- `audio/track.mp3` + a recorded measured duration in `song.md` → Stage 2 done.
- `look.md` present → Stage 3 done.
- `scenes/*` present → Stage 4 done.
- an `sNN.md` with `status: done` + its `clips/sNN.mp4` → that scene done.
- `edit-plan.md` present → Stage 6 done.

Resume at the first incomplete stage; don't restart.

---

## Stage 1 — Concept

Discuss the hook, the single load-bearing political/economic idea, the vibe,
the genre (default drum & bass), and the target length (10–20s), in the
BadCode voice. Take a fragment — a feeling, a reference, a half-formed joke —
**don't demand a brief.** Write `docs/shorts/<name>/concept.md` (hook, the
one idea, vibe, genre, target length) and `docs/shorts/<name>/README.md`
(the tracker for this short).

**Gate:** approve the spine before Stage 2.

## Stage 2 — Song (⏸ manual gate)

The song leads: everything downstream cuts to its measured duration, never a
guessed one.

1. Invoke the **`suno-prompt`** skill to produce the Style prompt, the
   Exclude-Styles list, and **short lyrics sized to ~15s**. Write
   `docs/shorts/<name>/song.md`, reusing `suno-prompt`'s save shape —
   frontmatter `title, status, suno: {style, exclude}, bpm, voices` + a
   `lyrics` block.
2. Print the hand-off block for the human, this exact template:

```markdown
### 🎧 Your turn — generate the track in Suno
1. Open Suno (Advanced mode). Paste **Style** and **Exclude Styles** below; paste the **Lyrics**.
2. Generate. **Roll it a few times** — pick the take that hits.
3. Download the MP3 to: `docs/shorts/<name>/audio/track.mp3`
4. Tell me the rough **section boundaries by ear** (where build / drop / outro land).

**Style:**
> <style prompt>

**Exclude Styles:**
> <exclude list>

**Lyrics:**
> <lyrics>
```

3. When the human returns `audio/track.mp3`, measure it — run verbatim:

```bash
ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 docs/shorts/<name>/audio/track.mp3
```

Record the printed seconds as the **measured duration** in `song.md`, plus
the human's section-boundary note. v1 does **not** auto-detect beats — the
human's ear is the source of truth for section boundaries.

4. **Gate:** the track is chosen and its measured duration + sections are
   recorded before Stage 3.
