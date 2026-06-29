# Ideas — the BadCode inbox

Raw ideas, parked the second they pop. This is the stage **before** a story exists:
each idea is a quick prose brain-dump in its own file, with one row in the table below.
Most ideas will become a comic; some carry music, a video, and/or some software we write,
in any combination; some are tiny (a single image, a YouTube short) and may never grow
into a full comic. That's fine — this is a holding pen, not a commitment.

## How this works

- **Capture:** say *"record this idea: …"* and the **`new-idea`** skill writes a new
  `docs/ideas/<slug>.md` (an `# H1` title + a faithful prose dump) and adds a row here.
- **Develop:** when an idea is ready to become real, `new-idea` (or you) hands it to the
  **`new-story`** skill, which builds the full canon under `docs/<story>/` — the source of
  truth the comic, music, and later media derive from. The row's status flips to
  `graduated` and links to the new story folder.
- **The inbox is optional.** An idea you're already sure about can skip straight to
  `new-story`. The inbox exists for the "hold that thought" flow.

Idea files are **minimal prose** — no frontmatter, no mandatory sections. All the
scannable metadata lives in the table.

**Media** — any combination of `comic · music · video · software`.
**Status** — `seed` (captured, untouched) → `developing` (being worked) →
`graduated` (has a `docs/<story>/` folder), or `parked` (set aside on purpose).

## The inbox

| Idea | Hook | Media | Status |
| --- | --- | --- | --- |
| [The Basement Granny](basement-granny.md) | de-Basement: an inflation-blind granny | comic · video | seed |
| [Centre of Gravity](centre-of-gravity.md) | low centre of gravity = a stable economy | comic | seed |
