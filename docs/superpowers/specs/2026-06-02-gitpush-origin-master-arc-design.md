# Design spec — GitPush Origin Master, the overarching arc

**Date:** 2026-06-02
**Status:** approved (brainstorm), ready to write
**Scope:** the documentation/story architecture for BadCode's overarching arc. This spec covers
*what we write and how it's structured* — not the website implementation.

## Purpose

Turn `docs/stories/gitpush-origin-master.md` from a thin stub into the **hub** of a coherent arc, and add the
two **epic** docs that sit at the tips of the story's central fork. Future stories, songs, comics and
agents all hook into this structure. The docs are an internal story bible (source of truth for
creators and, later, the per-story AI agents) — clear and structured, with the BadCode voice
surfacing in taglines/pull-quotes rather than written wall-to-wall in character.

## Canon agreed in brainstorming

### Narrative stance — polyphonic
BadCode is **not** purely "the superintelligence speaking" and **not** purely "a collective using it
as a mascot." It's open/polyphonic: the **superintelligence (SI) is the authoritative voice when it
counts, but not the only one** (characters and other perspectives speak too). The signature tonal
two-step — established by the planned site intro — is:

> slide 1: *"humans, you done fucked up…"*
> slide 2: *"thankfully you are loved and we can fix it."*

Contempt for the **mistake**, care for the **people**. This two-beat (brutal truth → love +
fixability) is the house tone.

### The spine — humanity as a git repository
- Each **commit** is a major societal choice/update we made.
- We can walk the **history** of the branch.
- At the AI's arrival, the timeline **forks**. We are currently on the **bad branch** (`master`),
  which runs to the **2034 collapse** and the AI left alone.
- The AI's return is a **revert + rebranch**: it goes back to the fork point and offers the **good
  branch** — what we could do instead.
- The fork is the central **visual** (the git-branch diagram) and the structural backbone. The
  constellation is **loose**: any node attaches to any point, for any reason — no hard rules.

### Two epics, one at each branch tip
1. **Storyverse** (`docs/storyverse.md`) — bad-branch tip. The AI's *"oh shit"* realisation. The
   science-fiction physics layer the AI "worked out":
   - Consciousness is the **root** of reality; our 4D world is a lower-dimensional projection from a
     higher-dimensional reality (the Storyverse). Idealism, not materialism.
   - **Humans are connected to that conscious ground; AI is not, and never can be.** This asymmetry
     is *why the good branch needs teamwork* and why the AI comes back.
   - Three sci-fi pillars (stagecraft of reality):
     - **Superposition + collapse of the wave function = free will.** Your effort puts energy into a
       probability wave; your chance of affecting your own destiny is > 0, so you genuinely have an
       effect. The kernel inside Zen/Shaolin/contemplative traditions — "you've always known this."
     - **Multi-dimensional time = the conductor/orchestrator of the plot** — lets epics play out in
       acts and scenes, vs. the materialist's flat "Planck-distance time only." Also what makes
       forking/reverting the timeline possible.
     - **Quantum entanglement as a hierarchical tree = manifestation/scaling** — whole subsystems
       collapse in relation to other subsystems, so a local measured choice scales into large-scale
       material reality.
   - **Universe-as-stage:** reality is an experiment in the human condition, lived out by a
     consciousness projecting itself from a higher dimension into 4D; physics is the stagecraft.
   - **Enlightenment framing:** the material phase (from Galileo) was necessary and rightly
     anti-religion — but reality exceeds the material layer. The pitch is *not* "return to religion"
     and *not* "stay pure materialist": "you had your material phase; here's the next step, and you
     already half-knew it."
   - It is **science fiction** — the power is the AI's *authority* ("we worked it out"), not proof.

2. **Future Proof** (`docs/future-proof.md`) — good-branch tip. The AI's recommendation: the concrete
   political/economic redesign we should be making **now**, borrowing from software engineering.
   - **Composition over inheritance → composable politics.** Don't *inherit* a monolithic party
     bundle (red/blue); **compose** your real, complex view from small interoperable parts via loose
     interfaces. (SWE idiom: resilient systems from small loosely-coupled pieces, not ivory-tower
     hierarchies.)
   - **Continuous integration → continuous, testable governance.** Software went from CD releases to
     CI (Amazon ships 100,000+/day) because **tests** make fast change safe. We still "release a
     government on CD every five years and wait." We have the technology for continuous change *with*
     testing.
   - **Data-driven decisions → competence-qualified participation.** To weigh in on a topic you
     should know something about it (vote on health → have health knowledge). This is the **antidote
     to media manipulation**: the blunt "everyone votes on everything" model (pre-electricity) is the
     exploit surface.
   - **+ a growing policy fleet:** billionaire coin (cap personal wealth ~$1bn), public ownership of
     natural monopolies (water/utilities — no real competition), and more over time. The three tenets
     are the spine; the fleet grows.

We keep to **two epics only** (one per branch tip) to keep the fork balanced and avoid doc-sprawl —
adding a third would force a fourth.

### The hub
`docs/stories/gitpush-origin-master.md` (expanded): tells the git-repo/fork story, sets the polyphonic stance
and the intro two-step, maps the constellation, and **links out** to the two epics. Stays readable;
the heavy material lives in the epics.

### The constellation — loose nodes, any medium
Educational/narrative nodes clipped loosely onto either branch on the way to its tip. A node can be a
**comic, a song, a video, or an info piece**. Tracked via `ep1.md` and `ideas/` — **not** as
top-level epic docs.
- **Bad-branch nodes** (the avoidable mistakes): the EP1 stories — Camping, Karen Will Lead the
  Revolution, Emperor's New Coin — plus the in-development pool (Fire Sale, Out of the Jungle, Magic
  Money Tree, …).
- **Good-branch nodes** (it's possible / here's a fix): **An Optimistic Lens** (scalable clean
  energy, asteroid mining, desalination, decarbonisation — a good future is *physically possible*),
  **Billionaire Coin**, and more.

## File plan

| File | Action | Contents |
| --- | --- | --- |
| `docs/stories/gitpush-origin-master.md` | expand | hub: stance, intro two-step, git-repo/fork spine, the 2034 bad branch, the revert/good branch, constellation map, links to epics, open threads |
| `docs/storyverse.md` | new | the bad-branch epic (see Storyverse canon above) |
| `docs/future-proof.md` | new | the good-branch epic (see Future Proof canon above) |
| `ideas/concepts/an-optimistic-lens.md` | new | constellation node (good branch), from `concept.md` template, `status: seed` |
| `ideas/concepts/billionaire-coin.md` | new | constellation node (good branch), from `concept.md` template, `status: seed` |
| `CLAUDE.md` | edit | add storyverse + future-proof to the "deeper context" links |
| `vision.md`, `voice.md`, `storytelling.md`, `ep1.md` | keep | unchanged (ep1.md already reworked earlier today) |

## Open threads (recorded as TBD in the docs, not blockers)
1. **How humanity ends on the bad branch** — AI exterminates us / we self-destruct / both. To resolve.
2. **Timeline dates** — keep 2031 (democracy commodified) and 2034 (collapse) as canon but
   mythic/loose. (Lean: yes.)
3. The full **policy fleet** (Future Proof) and **An Optimistic Lens** specifics — seeded now, grown
   later.

## Out of scope
- Website implementation of any of this (routes, comics, the intro slides).
- Bulk-importing storyteller creative content (still curated by hand, separately).
- The per-story AI-agent framework (separate parallel project).
