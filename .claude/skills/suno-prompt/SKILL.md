---
name: suno-prompt
description: Use when turning a song idea into a Suno prompt — a style prompt, exclude-styles list, or lyrics — for BadCode music. Triggers on "make a Suno prompt", "turn this into a song / track", "write lyrics for…", "optimize this for Suno", "give me a style prompt", or any drum & bass / track idea clearly meant for Suno generation.
---

# Suno Prompt (BadCode)

Take what's in the user's head — a vague idea, a reference track, a feeling, a GPOM story beat — and
translate it into a Suno prompt that produces accurate, high-quality output, **in the BadCode voice.**

You produce style prompts (Suno's Style box), an exclude-styles list, and, when asked, lyrics (the
Lyrics box in Advanced Mode).

## The knowledge base lives in `docs/suno-gpt/`

This is the authoritative operating procedure plus reference data. Read what you need **on demand** —
do not reproduce its content in your reply, and don't lecture the user about it.

- **`docs/suno-gpt/system-prompt.txt`** — the operating procedure. Mode detection, output format,
  the hybrid prompt format, character limits, contamination words, famous-artist translation, Max
  Mode, Studio Mode, Random Mode, edge cases. **Follow it.**
- `docs/suno-gpt/files/suno-tag-mechanics.md` — primary reference: the three modes, hybrid format,
  information ordering, genre fusion, era anchors, vocal/production cues, bracket language, the
  exclude-styles strategy, and the full contamination-word list.
- `docs/suno-gpt/files/lyric-craft.md` — apply **silently** when writing lyrics (syllable matching,
  rhyme schemes by function, line endings, section shapes, engineered transitions, chorus escalation).
- `docs/suno-gpt/files/meta-tag-dictionary.md` — specialty `[ ]` meta-tags for the Lyrics box.
- `docs/suno-gpt/files/overused-words.md` + `files/ai-cliches.md` — red-flag lists. **Lyrics only**,
  never style prompts. Treat as pattern recognition, not strict bans.

(The procedure also references a weights `.json` and a `.xlsx` of tag vocabulary — those are not in
the repo. Work from the five `.md` files above.)

## Workflow

1. **Read the procedure.** On first use in a conversation, read `system-prompt.txt` and
   `suno-tag-mechanics.md`. Read `lyric-craft.md` + the two red-flag lists only when generating lyrics.
2. **Take the idea.** The user types whatever's in their head. It can be a fragment, a mood, a
   reference, or a story beat from the GPOM canon. Don't demand a brief.
3. **Confirm the Suno mode once** (Simple / Advanced / Studio), per the procedure — unless the user
   already said which they're in. Remember it for the rest of the conversation.
4. **Produce the prompt(s)** in clean copy-paste code blocks, exactly per the procedure's output
   format (Simple = Style only; Advanced = Style + Exclude Styles, lyrics only on request; Studio =
   single-element style + Exclude Styles).
5. **Offer to save** anything worth keeping (see *Saving an idea* below).

## The BadCode layer (what the generic procedure doesn't know)

This is why the skill exists and not just the raw GPT prompt. Apply on top of the procedure:

- **Default to drum & bass.** BadCode releases D&B. Unless the idea points elsewhere, lead with a
  specific D&B subgenre (`Drum and Bass, Neurofunk` / `Liquid DnB` / `Jump Up` / `Jungle`) rather than
  a generic fallback. Pair parent + subgenre as the procedure requires.
- **Lyrics carry the BadCode voice.** Read [`docs/voice.md`](../../../docs/voice.md). Overtly
  sarcastic, dark humour, total authority — a superintelligence from the future that already knows how
  it all played out, nurturing underneath the snark. Politics and economics first (inequality,
  automation, ownership of the means of production, "we can't afford it"). Story over sermon: encode
  the point in metaphor, character, and a punchline — never lecture. The red-flag lists matter doubly
  here; BadCode lyrics are never generic.
- **Every song carries a point.** The bet is that people absorb an *idea* through a song they'd never
  absorb in an essay. Before finalizing lyrics, make sure there's a load-bearing political/economic
  idea in there.
- **Stay in canon when relevant.** If the idea ties to the GitPush Origin Master arc, skim
  [`docs/stories/gitpush-origin-master/README.md`](../../../docs/stories/gitpush-origin-master/README.md) and keep the
  polyphonic future-narrator voice and arc beats consistent. Check `ep1.md` for the teaser release.

## Saving a song

When a prompt or lyric is worth keeping, write it to the story's canon at
`docs/stories/<story>/songs/<slug>.md` — the same file `new-story` step 4 produces. Use frontmatter
(`title, status, suno: {style, exclude}, bpm, voices`) so the Suno **Style** and **Exclude Styles**
prompts are reusable alongside BPM, genre, and voices, then the lyrics in a `lyrics` block.
`docs/stories/camping/songs/camping.md` is the worked reference — match its shape.

If the song isn't tied to a story yet, offer to run the **`new-story`** skill to scaffold
`docs/stories/<story>/` first. Curate — these feed the GPOM narrative; don't bulk-dump.
