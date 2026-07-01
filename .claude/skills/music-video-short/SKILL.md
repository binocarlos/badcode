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

## Stage 3 — Look & cast

Discuss the visual world and 1–3 characters using the **`badcode-art-direction`**
identity — 35mm documentary look, muted cool-neutral palette, observational
framing (point at the skill, don't restate it). Write
`docs/shorts/<name>/look.md` — the world, and the cast, each character with a
class-coded visual description in house style.

If a character recurs across scenes, set up a **Flow Character** once for
cross-scene consistency:

- Prerequisite: `./scripts/flow-chrome.sh` running and logged in; confirm with
  `flow_status()` → `loggedIn: true`, then `flow_open_project({ name })`.
- Generate a portrait via **`badcode-art-direction`** → `flow_generate_image`,
  harvest to `docs/shorts/<name>/scenes/img/<char>-ref.jpg` (the same
  `scenes/img/` directory the folder convention already defines for scene
  stills), then
  `flow_create_character({ name: "<Char>", refImages: ["<abs path to that jpg>"] })`.
  Record the returned character name in `look.md`.

**Gate:** approve the look + cast (and any Flow Characters) before Stage 4.

## Stage 4 — Scene breakdown

Map the **actual** song — its measured duration from Stage 2 plus the human's
section boundaries — to N scenes (~4–8 for 15s). Each scene is one shot
description plus a **motion note** (what moves — used verbatim as the Stage 5
motion prompt), which character(s) it references, and which song section it
lands on. Write `scenes/index.md` (numbered scenes, one-line intent + section
each) and one `scenes/sNN.md` per scene with `status: planned`.

**Gate:** approve the board before any clip is generated.

### Scene record — `docs/shorts/<name>/scenes/sNN.md`

```markdown
---
scene: 3
song_section: drop            # intro | build | drop | outro …
characters: [karen]           # names of Flow Characters to cast (may be empty)
still_media_id:               # filled when the still is generated
clip_media_id:                # filled when the clip is generated
status: planned               # planned | done
---
![scene 3 still](img/s03.jpg)  ·  clip: `../clips/s03.mp4`

**Still prompt (exact, sent to Flow):**
> <house-style preamble + scene; cast each character in `characters:` by name>

**Motion prompt (exact, sent to Flow):**
> <what moves — e.g. slow push-in, banners ripple, embers drift>

**Beat note:** <where it lands, e.g. "on the drop (~00:07)">

**Revisions:**
- v1 (<date>) — initial
```

## Stage 5 — Clips (⚙ auto)

Prerequisite: Flow connected — `flow_status()` → `loggedIn: true`, then
`flow_open_project({ name })`. Do **not** hand-puppeteer Flow via the
Playwright MCP.

For each `scenes/sNN.md` with `status: planned`, run this exact routine:

1. **Still** — invoke **`badcode-art-direction`** to plan/critique the still
   prompt, then generate it:
   `flow_generate_image({ prompt, outPath: "<abs>/docs/shorts/<name>/scenes/img/sNN.jpg", character: "<Char>" })`
   (pass `character` only if the scene lists one — the `character` param
   casts the Flow Character, the proven cross-scene consistency path). Judge
   the result against the scene + house style; use `flow_refine` to correct
   in-session if weak.
2. **Animate** —
   `flow_generate_video({ imagePath: "<abs>/…/scenes/img/sNN.jpg", motion: "<the scene's Motion prompt>", outPath: "<abs>/docs/shorts/<name>/clips/sNN.mp4" })`.
   (`flow_generate_video` may take minutes and can post a credit gate — the
   MCP tool already handles the gate + harvest.)
3. **Record** — in `sNN.md`: fill `still_media_id` and `clip_media_id`, embed
   the still, set `status: done`, write the **exact** still + motion prompts
   used, and add a `v1` revision line.

**Gate:** review the clips together; reroll weak ones (via the iteration
loop below) before Stage 6.

## Iterating on a scene

To change one scene: open its `sNN.md`, read the recorded prompts, re-run via
**`badcode-art-direction`** (`flow_refine` for the still) and/or re-run
`flow_generate_video`, harvest the new files, **append a revision line**
describing the change, and replace the still + clip. Touch only that one
record/scene — leave the rest untouched.

## Stage 6 — Edit plan (⏸ manual gate)

Given the measured audio duration, the section boundaries, and the generated
clips, emit `docs/shorts/<name>/edit-plan.md` — the hand-off for the human's
cut. The skill's contract **ends at the plan**; it does not mux the final
`.mp4`. Use this exact template:

```markdown
# Edit plan — <name>

**Track:** `audio/track.mp3` · measured <D>s · <BPM by ear>
**Sections:** intro 0.0–a · build a–b · drop b–c · outro c–<D>

## Timeline (cuts sum to the track length)

| t (s) | clip | in→out | scene / section | note |
|-------|------|--------|-----------------|------|
| 0.00 | clips/s01.mp4 | 0.0→a | intro | establishing hold |
| a    | clips/s02.mp4 | 0.0→… | build | cut on snare |
| b    | clips/s03.mp4 | 0.0→… | drop | HARD cut on the drop |
| …    | …             | …     | …    | … |

**Total:** <D>s — matches the track.

## Optional convenience (not the deliverable)
A ready-to-run `ffmpeg` concat+mux command MAY be appended here for the human, but
auto-rendering is out of scope — the plan is the contract.
```

**Gate:** the short is done for the skill's purposes when the human has the
plan; they cut it.

## Out of scope

- Rendering the final `.mp4` — the contract ends at the plan; an optional
  `ffmpeg` command is allowed, auto-mux is a later cycle.
- Automating Suno — a manual gate by design.
- Automatic beat/section detection — the human's ear is the source of truth
  in v1.
- Anchoring to existing story canon — standalone-lightweight only in v1.
- Publishing the short to the website — a separate concern.
