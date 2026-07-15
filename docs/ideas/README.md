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
| [The Inner Net](inner-net.md) | the connection that transcends the wire — why AI slop can't touch it | comic · music | seed |
| [Fire Sale](fire-sale.md) | democracy: everything must go — closing down for "Democracy as a Service" | comic · music | seed |
| [Out of the Jungle](out-of-the-jungle.md) | the only scarcity left is artificial — when will we press the button? | comic · music | seed |
| [The Bank Robbery](bank-robbery.md) | debasement heist — "the best robbery is one where the victims blame each other" | comic | seed |
| [We Can Afford What We Can Create](we-can-afford-what-we-can-create.md) | Keynes: anything we can actually do we can afford — Magic Money Tree's solution twin | comic | seed |
| [Billionaire Coin](billionaire-coin.md) | gamified "get the rich to pay tax" — a prestige coin for the egos | comic | seed |
| [Fork and Fold](fork-and-fold.md) | chemical evolution explodes, AI implodes — two engines, one future | comic · music | seed |
| [The Serial Port](serial-parallel-port.md) | humans: a serial port plugged into the parallel creative universe | comic | seed |
| [Bait and Switch](bait-and-switch.md) | AI harvests outrage into music; primitive instruments win *(Jack)* | comic · music | seed |
| [Fast Food](fast-food.md) | fast food is the new cigarettes — the warning bill dies in lobbying *(Jack)* | comic | seed |
| [Gimme the Link](gimme-the-link.md) | criminal brain = healthy brain; the treatment line makes "productive workers" *(Jack)* | comic | seed |
| [Movie Script](movie-script.md) | reality is badly written — a billionaire dies proving he's not the main character *(Jack)* | comic | seed |
| [Save the… Penguins](save-the-penguins.md) | £1.7bn more for cute things than for humans *(Jack)* | comic | seed |
| [Stock Market](stock-market.md) | rob the thieves back, short their stock — it's a sting *(Jack)* | comic | seed |
| [Thou Shall Be Calm](thou-shall-be-calm.md) | the meditation egregore is real; the guru is the problem *(Jack)* | comic | seed |
| [Dogma](dogma.md) | Galileo then, left-vs-right now — "we voted for him because we hate you" | comic | seed |
| [Political Social Network](political-social-network.md) | LLM-sorted "views" — a real cross-section of what everyone thinks | software | seed |
| [Influence](influence.md) | the influencer's desire to be human has faded; the charade persists | music | seed |
| [100 (The Hundred Dollar Bill)](hundred-dollar-bill.md) | one note's biography: velocity vs. the vault | comic · music | seed |
| [Far Wars](far-wars.md) | were there any Ewoks aboard when you dropped the bomb? | music | seed |
| [Look at the Hand](look-at-the-hand.md) | auction today's news lens on-chain to prove the news is for sale | software · music | seed |

## Graduated & canon (the rest of the map)

Ideas that already live beyond the inbox — listed here so this README doubles as the one
central map of BadCode content. The linked folders are the source of truth; don't develop
them from here.

- [Camping](../camping/README.md) — canon drafting; comic **built & live** (Storyteller
  import); from-scratch rebuild underway at [camping-v2](../camping-v2/README.md). EP1 track 1.
- [Karen Will Lead the Revolution](../karen/README.md) — canon drafting; comic shell
  registered. EP1 track 2.
- [The Emperor's New Coin](../emperors-coin/README.md) — canon developed, drafting. EP1 track 3.
- [Magic Money Tree](../magic-money-tree/README.md) — canon drafted; comic **built & live**
  (the reference Flow-pipeline comic). Solution twin: [We Can Afford What We Can Create](we-can-afford-what-we-can-create.md).
- [GPOM Short](../gpom-short/README.md) — 16-panel teaser of the master arc; in production.
- [GitPush Origin Master](../gitpush-origin-master/README.md) — the master universe,
  beat-complete: Prologue → 6 acts → Coda, plus the two branch-tip epics
  ([Storyverse](../gitpush-origin-master/storyverse.md),
  [Future Proof](../gitpush-origin-master/future-proof.md)) and named latent nodes
  (An Optimistic Lens, the Galileo piece, the Future Proof policy fleet — which claims
  [Billionaire Coin](billionaire-coin.md)).
- [Brand images](../images/README.md) — standalone imagery catalogue (server-hall-monolith, …).

## Not migrated from the old repo

The 2026-07-15 mining pass brought every *idea* over from the old Storyteller repo — both
`storyteller/badcode/` and `storyteller/kai/` — and was then curated down with Kai the same
day. Deliberately left behind:

- **Culled at triage (2026-07-15)** — captured, reviewed, and cut: ancestors,
  asylum-failure, background-spell-checks, biometric-steal, bully, cashflow-vs-budget,
  english-vs-maths, glacier-mint, goodies-and-baddies, infinite-loop, insurance-buffet,
  kaya, klf, lemmings, llm-h2o, louvre-laugh-love, love, luigi, money-remix,
  mountains-and-cells, my-mum-met-the-queen, posturing, potholing, revolving-door,
  schofield, the-bird, the-longest-journey, war-photographer, what-is-the-vibe. If one
  sparks again, re-mine it from the old repo.
- **Expanded per-story narratives** in `badcode/prompts/{camping,karen,magic-money-tree,fire-sale,jungle}` —
  divergent plots, casts, and shot lists for stories that already have canon folders here
  (e.g. Karen's SHAUN_AI plot, the GEOFF ghost, the Amazon jungle world). Mine these during
  each story's rework, not into the inbox.
- **Reusable production assets** — `badcode/prompts/system/` (brand canon + realistic-photo
  style), `badcode/prompts/camping/style.md` (Métal Hurlant house style),
  `badcode/songs/voice-instructions.md`, `badcode/notes/voice.md`, and `kai/notes/`
  (vocal personas, recording technique, Suno/Ableton logistics).
- **Already-graduated drafts** — old song/idea files for camping, GPOM, and
  emperors-new-coin (both folders), and `kai/ideas/badcode.md` (the founding
  anonymous-virtual-band concept, now [`docs/vision.md`](../vision.md)).
- **Named-but-empty pointers** — `badcode/songs/warehouse-rage.md` (title only) and
  `kai/notes/plan.md`'s concept names with no content behind them (overwhelm.tv, the forum,
  imp script, franchising for good, un-nuanced). If any of these still spark, capture them
  fresh.
- **`badcode/notes/ep1.md`'s per-story AI-agent concept** — lives in the separate
  agent-framework project, out of scope here.
