---
name: new-idea
description: Use to record a new BadCode idea the moment it pops — parks it as a minimal prose file under docs/ideas/ and adds a row to the inbox index, then offers to develop it with new-story. Also the distiller for rough material — a pasted conversation transcript, a rambling voice-note dump — which it turns into clean idea files via a short interview. Triggers on "record this idea", "new idea", "park this", "capture this idea", "jot this down", "here's a transcript", "distill this", or any half-formed idea the user wants kept for later.
---

# New Idea (BadCode) — the inbox front door

Capture an idea the second it pops, with zero friction, and track it so it can be picked
back up cold. This is the stage **before** a story exists. Most ideas become a comic; some
carry music, a video, and/or software, in any combination; some are tiny (a single image,
a YouTube short) and may never grow into a full comic. Don't develop it here — just capture
it faithfully and point at the door to development.

> **Front door vs. workshop.** `new-idea` answers *"should I keep this thought?"* — it
> captures and tracks. **`new-story`** answers *"let's make this real"* — it builds the full
> `docs/stories/<story>/` canon. They chain; they don't overlap. The inbox is optional: a confident
> idea can skip straight to `new-story`.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — the load-bearing tone. Capture in the BadCode voice, but **faithfully** —
  this is a brain-dump of what the user said, not an over-developed story. Do not invent
  beyond their idea.
- `docs/ideas/README.md` — the inbox you are maintaining, and the worked examples
  (`basement-granny.md`, `centre-of-gravity.md`) whose shape new captures imitate.

## What you produce

```
docs/ideas/
  README.md            # the index table — you maintain this
  <slug>.md            # one minimal-prose file per idea — you create this
```

An idea file is **minimal prose**: an `# H1` title and a free-form dump of the idea as
told. **No frontmatter, no mandatory sections.** If a "format thoughts" note comes up
naturally (shorts series / single image / full comic), add a short `## Format thoughts`
section like the worked examples — otherwise leave it out. Keep it fast.

The README table is the only structured artifact. Columns: `Idea | Hook | Media | Status`.

**Routing.** `docs/ideas/` is for *content* ideas (stories, songs, shorts, images —
things we'd make). If what's being captured is a **marketing/distribution play**
(channels, campaigns, launch sequencing, promotion automation), hand off to the
**`new-marketing-idea`** skill — it owns `docs/marketing/` and carries the
marketing-specific interview. If it fits neither, park it in `docs/misc/`. See
`docs/README.md` for the section map.

- **Media** — any combination of `comic · music · video · software` (middot-separated).
  Best guess at capture time; revised freely later.
- **Status** — `seed` → `developing` → `graduated`, or `parked`. New captures are `seed`.

## Workflow

### Capture (the default)

1. **Pick a slug.** Kebab-case, memorable (e.g. `basement-granny`). The file is
   `docs/ideas/<slug>.md`.
2. **Write the idea file.** `# Title` + a faithful prose dump in the BadCode voice. Pull in
   any vivid lines the user gave verbatim. Add `## Format thoughts` only if the user
   signalled a format. Do not develop characters, beats, or songs — that is `new-story`.
3. **Add the index row** to `docs/ideas/README.md`: a markdown link to the file, a
   one-line hook, your best-guess media, status `seed`.
4. **Close with the hand-off offer — always.** Do not go silent. End with:
   > *"Captured as a seed in `docs/ideas/<slug>.md`. Want to develop this now with
   > `new-story`, or leave it for later?"*
   This is a suggestion, not an automatic jump — the usual answer is "leave it," but the
   path to the workshop is always shown.

### Distill (a pasted transcript or rambling dump)

When the user pastes rough material — a transcript of them talking with a collaborator,
a voice-note dump, a chaotic brain-dump — the job is **interview, then capture**. Do not
just summarise it; rough talk usually contains several ideas tangled together, and the
speakers know things they didn't say.

1. **Read the material and split it.** List the distinct ideas you can see, each with a
   one-line hook, and play the list back: *"I count N ideas in here: …"* Let the user
   correct the split before anything is written.
2. **Interview, briefly, per idea.** Ask only the questions whose answers you don't
   already have from the material — a few at a time, not a form to fill. The key ones:
   - **The one idea.** What's the single load-bearing political/economic point? (If it
     takes two sentences, it might be two ideas.)
   - **The hook.** What's the image, scene, or line that made you want to keep this?
   - **Medium instinct.** Comic, song, short, image, marketing plan — any signal, even
     "no idea yet" is an answer.
   - **New or extension?** Standalone, or does it belong to an existing story
     (`docs/stories/`) or the GPOM arc?
   - **The punchline.** Is there a twist/ending already, or is that open?
   - **Anything said out loud but not in the transcript?** The best line is often the
     one that didn't get typed.
3. **Capture each idea** via the Capture steps above (route marketing plans to
   `docs/marketing/` per the routing note). Keep the user's vivid phrasing verbatim —
   distilled, not rewritten.
4. **Play back the result.** List the files written, one hook each, then the usual
   hand-off offer per idea worth developing now.

Stay light: the interview refines *capture fidelity*, not development. Characters,
beats, and songs still belong to `new-story`.

### Develop (when the user says go — now or later)

5. **Hand off to `new-story`.** Invoke the **`new-story`** skill, passing the idea file as
   the starting fragment. Say you are handing off. `new-story` builds `docs/stories/<story>/`.
6. **Update the index row.** Flip status to `developing` while in progress, then
   `graduated` once `docs/stories/<story>/` exists, and point the row's link (or hook) at the new
   story folder. The idea file stays as the historical seed.

### Park

- If the user sets an idea aside, set its status to `parked`. Not dead — just not now.

## Principles

- **Faithful capture, not development.** Speed and fidelity over polish. The user's idea,
  in their framing, kept safe.
- **Metadata lives in the index, prose lives in the file.** Keep frontmatter out of idea files.
- **Always offer the next step.** Capture never dead-ends; it points at `new-story`.
- **Compose, don't duplicate.** Real development is `new-story`'s job — never reimplement it here.
