---
name: new-marketing-idea
description: Use to record a BadCode marketing idea — a way to reach people, grow the audience, or automate distribution/promotion of releases. Parks it as a minimal prose file under docs/marketing/ with an index row, after a short marketing-specific interview. Triggers on "marketing idea", "record this marketing idea", "how do we promote…", "automate posting/publishing", "growth idea", "distribution idea", "get this in front of people".
---

# New Marketing Idea (BadCode) — the distribution inbox

Capture a marketing idea fast and keep it actionable. Marketing here means *reaching
people* — channels, campaigns, launch sequencing, and especially **automation**: pipelines
where shipping a release triggers its own promotion. Making the thing stays in
`docs/ideas/` (content seeds) and `docs/stories/` (canon); this skill owns the other half.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — marketing copy is still BadCode copy. A caption, a teaser, a post:
  same sarcastic-authority-from-the-future voice. Never generic growth-speak.
- `docs/marketing/README.md` — the index you are maintaining.

## What you produce

```
docs/marketing/
  README.md            # the index table — you maintain this
  <slug>.md            # one minimal-prose file per plan — you create this
```

A plan file is minimal prose: `# H1` title + a faithful dump of the idea. If the idea is
an **automation**, add an `## Automation shape` section — three lines, not a spec:

- **Trigger** — what event starts it (a comic ships, a track drops, a weekly tick)
- **Steps** — the raw pipeline as told
- **Human gate** — where a person approves. BadCode pipelines are gated by default;
  "fully unattended" is a deliberate decision the user must state, never an assumption.

Close with `## Open questions` for whatever the interview left unresolved.

Index columns: `Plan | Hook | Channels | Status` (status: `seed` → `developing` →
`live`, or `parked`).

## The interview

Ask only what the telling didn't answer, a few at a time:

1. **The lever.** What does this actually move — reach, conversion to the site,
   retention, credibility?
2. **Trigger & cadence.** One-off campaign, recurring, or fired by releases?
3. **Channels.** Where does it land (TikTok, Shorts, Reels, X, mailing list…)? Which
   are deliberately excluded?
4. **Human gate.** Drafts-for-approval or unattended? (Default: gated.)
5. **Dependencies.** Accounts that must exist, credentials, APIs/schedulers, and which
   existing repo skills it would reuse (`animate-slide`, `music-video-short`, …).
6. **Success signal.** How would we know it worked?

## Workflow

1. Interview (above), briefly.
2. Write `docs/marketing/<slug>.md` — the user's framing, vivid lines verbatim.
3. Add the index row to `docs/marketing/README.md`, status `seed`.
4. Close with the hand-off offer: *"Captured in `docs/marketing/<slug>.md`. Want to
   develop this into a real pipeline/spec now, or leave it parked?"*

## Principles

- **Capture, don't build.** Even for automations: record the shape, don't write the
  script. Building is its own later task with its own plan.
- **Content ideas don't belong here.** A story/song/short idea goes to `docs/ideas/`
  via `new-idea` — if the idea is both (a piece of content *and* a distribution play),
  split it: seed in `ideas/`, plan in `marketing/`, cross-link the two files.
- **Voice survives marketing.** If the plan implies copy, note that it must pass
  `docs/voice.md`.
