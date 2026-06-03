# Ideas repository

This is where BadCode's raw material lives — songs, stories, and standalone concepts — as it moves
from a scribble to something we can actually ship as a comic or a track.

> **Status:** this is a deliberately empty **holding place**. We are migrating and curating content
> from older brainstorm material *together, by hand*, so that every item earns its place in the
> [GitPush Origin Master](../docs/gitpush-origin-master.md) narrative. Don't bulk-import.

## Layout

```
ideas/
  songs/        # lyrics + production notes, one file per song
  stories/      # one folder per story (concept, beats, characters, image direction)
  concepts/     # standalone ideas / themes not yet attached to a story
  templates/    # copy these when starting something new
```

## Status tags

Every item carries a `status` in its frontmatter so we know how cooked it is:

- **`seed`** — a spark. A title, a line, a "what if". Might go nowhere.
- **`developing`** — actively being worked: beats, characters, draft lyrics.
- **`canon`** — locked into the BadCode narrative; ready to become (or already is) a comic/track.

## Workflow

1. **Capture** — copy the matching template from `templates/` into `songs/`, `stories/`, or
   `concepts/`. Start at `status: seed`.
2. **Develop** — flesh out concept → background → beats → characters → image/style. Move to
   `status: developing`. (See [docs/storytelling.md](../docs/storytelling.md) for the method.)
3. **Link** — connect it into the meta-arc: which EP, which themes, which other stories it touches
   (`linkedStories` in frontmatter). When it fits the narrative, mark `status: canon`.
4. **Ship** — promote a `canon` story to a coded comic under `apps/web/src/comics/…` using
   `@badcode/comic`.

Frontmatter is YAML (`title`, `status`, `themes`, `ep`, `linkedStories`) so items can be
cross-referenced and, later, surfaced on the site or fed to the story agents.
