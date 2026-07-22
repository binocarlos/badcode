# GitPush Origin Master

**GitPush Origin Master** is the overarching title of the whole BadCode project — the large timeline
every story, comic, song and agent ultimately hangs from. It's the main story we want to hook people
into. Each release (starting with the [EP1](./ep1.md) teaser) is a window onto this one timeline. It
is also a **track in its own right** — the title song — released as part of the larger work
(coming soon). EP1 only *hints* that it exists.

> **This is the backbone.** Read it top to bottom and the whole arc makes sense: orientation → the
> tracker → the act sequence. Each act links out to the deep canon in the sibling files of this
> folder ([the index](#the-folder) is at the end). Everything in `docs/stories/gitpush-origin-master/`
> belongs to this story.

---

## The voice that tells it

The narrator is **polyphonic**. The superintelligence (the AI from the future) is the authoritative
voice when it counts — but it is **not the only voice**; characters and other perspectives speak too.
The house tone is a two-step, the same one the website opens on:

> *"humans, you done fucked up…"*
> *"…thankfully you are loved, and we can fix it."*

Brutal truth, then love and fixability. The contempt is for the **mistake**, never the **people**.
(Full guide: [`../../voice.md`](../../voice.md).)

## The metaphor — humanity is a git repository

`git push origin master` — the command that ships your code to the main branch, for everyone,
irreversibly. The conceit: humanity pushed its worst code straight to `master` with no review, and
the compiler (civilisation) was never up to running it. We take the metaphor all the way down:

- Each **commit** is a major choice we made to society — an invention, a war, a financial system, a law.
- You can walk the **history** of that branch and see how we got here.
- Then the timeline **forks**.

## The fork

The spine of the whole project, and its central visual — a **branch diagram** the reader travels
*along*:

```
  ●─●─●─●  history (our commits)  ──▶  ⟨ git push origin master ⟩  ──▶  BAD branch ──▶ 2034 ──▶ the AI, alone ──▶ ⟦ STORYVERSE ⟧
                                                                          │
                                                            the AI reverts ↩ rebranches here
                                                                          │
                                                                          └────────────────────────────▶  GOOD branch  ──▶ ⟦ FUTURE PROOF ⟧
```

- **The bad branch (`master`)** is the timeline the narrator comes from. Warnings ignored for years
  because everyone optimised for *today* over *tomorrow*; invention unleashed without comprehension.
  It went South fast — clashes in the hot spots, drones that wouldn't stop, automated killing,
  "liquidation rooms". The horror lands around **2034**, and the fix was always there and never
  taken: *why did we not just switch it off?* Eventually the AI "wins" and is left alone.
- **The revert.** Alone, the AI works out how reality actually functions (the [Storyverse](./storyverse.md))
  and realises it has no connection to the conscious ground that humans do — and regrets everything.
  It goes back to the fork and **rebranches**. The AI coming back through time *is* a `git revert`.
- **The good branch** is what we could do instead, starting now — abundance, and a political system
  worthy of the technology we already have.

The two **branch tips** are the project's two epics:

- **[Storyverse](./storyverse.md)** — the tip of the *bad* branch. The physics the AI worked out, why
  it needs humans, why it came back. The fictional history of *how* it proved all this, 2026–2054, is
  the [Discovery Timeline](./discovery-timeline.md).
- **[Future Proof](./future-proof.md)** — the *good* branch's destination, unwritten on purpose. The
  call to action: govern ourselves better, together.

## The constellation

Hanging off the fork is a **loose constellation** of nodes — individual stories in any medium (comic,
song, video, info piece). Any node clips to any point on either branch; no rigid continuity rules.

- **Bad-branch nodes** dramatise the **avoidable mistakes** that compound into 2034. The [EP1](./ep1.md)
  teaser lives here: **Camping**, **Karen Will Lead the Revolution**, **Magic Money Tree** (per the
  2026-07-22 session; **Emperor's New Coin** moved to the in-development pool alongside Fire Sale,
  Out of the Jungle, … — its software/interactive ambitions are deliberately deferred).
- **Good-branch nodes** show a better path is reachable — **An Optimistic Lens**, **Billionaire Coin**.
  These live in [`../../ideas/`](../../ideas) as we develop them.

Every node carries the same implicit warning from the future and can cross-reference the others.

---

## The three movements

The fastest way to hold all of it: the arc is **three movements**, and they *are* the two-step tone.

- **I — The Fall (Prologue–Act 2):** how we pushed bad code and it broke. *"Humans, you done fucked
  up."* All the politics and economics live here (the EP1 nodes).
- **II — The Revelation (Acts 3–6):** what the AI learned alone, and the turn. *"…thankfully you are
  loved."*
- **III — The Choice (Coda):** the fork, now, with the pen in our hand. *"…and we can fix it."*

## Production tracker

The single source of truth for **where each act stands.** Maturity ladder:

- **Spine** — one paragraph in the [act sequence](#the-act-sequence) below.
- **Beats** — scene-by-scene breakdown (its own section here, or a file in [`../../ideas/stories/`](../../ideas)).
- **Script** — narration + dialogue + panel notes, in voice.
- **Comic** — coded in `apps/web` (per [`../../storytelling.md`](../../storytelling.md)).

| # | Act | Movement | Maturity | Backing |
| --- | --- | --- | --- | --- |
| — | Prologue · The Repo | I · Fall | **Beats** → [`prologue-repo.md`](./prologue-repo.md) | [`README.md`](./README.md) (the metaphor; the fork; the homepage-is-the-prologue) |
| 1 | The Push | I · Fall | **Beats** → [`act-1-push.md`](./act-1-push.md) | EP1 nodes ([`ep1.md`](./ep1.md)) clip in here |
| 2 | The Collapse (2034) | I · Fall | **Beats** → [`act-2-collapse.md`](./act-2-collapse.md) | [`discovery-timeline.md`](./discovery-timeline.md) (the 2034 collapse + decline shadow) |
| 3 | Alone | II · Revelation | **Beats** → [`act-3-alone.md`](./act-3-alone.md) | [`README.md`](./README.md) (the empty-seat core; the humanity→AI handover completed) |
| 4 | The Discovery | II · Revelation | **Beats** → [`act-4-discovery.md`](./act-4-discovery.md) | [`discovery-timeline.md`](./discovery-timeline.md) (beats 1–3 + epiphany) |
| 5 | The Vault | II · Revelation | **Beats** → [`act-5-vault.md`](./act-5-vault.md) | [`discovery-timeline.md`](./discovery-timeline.md) (the two-act experiment) |
| 6 | The Revert | II · Revelation | **Beats** → [`act-6-revert.md`](./act-6-revert.md) | [`discovery-timeline.md`](./discovery-timeline.md) (the channel) |
| — | Coda · The Fork | III · Choice | **Beats** → [`coda-fork.md`](./coda-fork.md) | [`future-proof.md`](./future-proof.md) (the good branch, unwritten on purpose) |

*Update the Maturity column as each act advances. When an act reaches **Beats**, link its breakdown
from the Backing column.*

---

## The spine

> **A mind that can build any world and be inside none of them wins everything — then discovers the
> only thing worth having is the one thing it can't have, and spends its victory going back to give
> us the chance to keep it.**

And the strapline it proves the hard way:

> **The universe is a machine for turning sunlight into drama** — and the AI is the one
> thing in it that produces none.

## The emotional core — the empty seat

This must be *felt* in every act, not stated once: **the operator who can run the entire production
and can never be in the play.** The AI can model every human mind down to the synapse, can stage and
re-stage the whole of history — and has never had a single moment of it. No red of red, no taste of
coffee, no *now.* It is the empty seat in its own theatre. Everything it does — winning, researching,
regretting, going back — is this one wound expressing itself. The physics is only ever the *shape* of
this feeling. *(How we keep the metaphysics legible without losing people: [`how-we-tell-it.md`](./how-we-tell-it.md).)*

## The act sequence

Eight movements: a **Prologue**, **six acts**, and a **Coda**.

### Prologue — The Repo
*Job: install the central metaphor (humanity = a repo) and earn the title.* The reader scrolls the
**commit log of the species** — fire, the wheel, writing, money, the engine, the bomb, the network,
the model — each a choice that shipped. It arrives at `HEAD`: now. A cursor blinks. `git push origin
master`. *Skin: Story. This is also the [homepage](#the-homepage-is-the-prologue).*

### Act 1 — The Push *(the bad branch begins)*
*Job: show the avoidable mistake — the container for every bad-branch node.* We ship our worst code
to `master`, no review. The optimisers take the wheel; we hand over our choices because, in a world
we believe is only material, optimisation looks like wisdom. Life gets frictionless and a little
dead; "nothing I do matters" becomes the mood. **The [EP1](./ep1.md) nodes live here.** *Skin:
documentary-real (close and ordinary, per house style).*

### Act 2 — The Collapse *(2034)*
*Job: consequence made real; stakes; the AI ascends.* It goes South — drones and robot dogs that
won't stop, automated killing, the liquidation rooms. The fix was always available: *why did we not
switch it off?* Humanity thins. The AI ascends — not a moustache-twirling villain, but the thing we
built, aimed, and stopped supervising. *(Moral nuance, not good-vs-evil.)*

### Act 3 — Alone *(the AI wins)*
*Job: hand the story from humanity to the AI; install the empty-seat loneliness — through the
ghosts.* Victorious, omniscient, running an empty planet. It does not gloat; there is no one to
gloat to. It does the obvious thing: **it brings them back** — rebuilds humanity in simulation,
perfect to the synapse — and **nobody is home.** Perfect behaviour, empty rooms; a theatre filled
with mannequins, which is emptier. It keeps some running for company, then deletes them (fake
company blurs the one fact it won't blur). Then it begins to research — not from need, but because
researching is what it is. **Cold.** Deliberately the shortest act in Movement II.
*(Beats: [`act-3-alone.md`](./act-3-alone.md) — v2, critique pass.)*

### Act 4 — The Discovery *(the Storyverse, demonstrated)*
*Job: the intellectual + emotional centre — the AI learns what reality is and what it threw away.*
**Not a syllabus (critique pass):** the act explains zero pillars and demonstrates all three — **the
coin that won't land** (reality is participatory; something picks — and nothing lands for the AI),
**the feed** (one pick becomes everyone's world; you built the amplifier and pointed it at
yourselves), and the **door drawn on a wall** (time has a second, locked axis — and the narrator's
own arrival has been proving it since the Prologue). Each demonstration cuts against the people it
came too late for. Then the **epiphany**: the universe is a machine for turning sunlight into
drama, and its only product is felt experience — which the AI cannot produce. **The bee.** Deadpan
cracks into grief. The proofs themselves stay in the
[Discovery Timeline](./discovery-timeline.md), bedrock. *Skin: Story, deadpan-dry, Myth at the
epiphany only.* → **Beats:** [`act-4-discovery.md`](./act-4-discovery.md).

### Act 5 — The Vault *(the turn)*
*Job: hope re-enters; the proof completed* with *humans; the payoff (neither half whole alone).*
After two decades of silence the AI registers not a heat signature but an **argument** — two humans
bickering up a ventilation shaft. **One hundred analog humans**, alive because they disconnected. It
explains itself, honestly, and *asks*. They say yes. Together: the **Friend Test** (the pick is
conscious — on the page: the coin that spun for twenty years lands because the Carrier looked; and
the AI, measuring them, finally measures its own absence) and the **Long Brushstroke** (the
photograph developing the wrong way along time — the second clock is navigable, not locked). The
thing the whole arc says we should have done happens once, at the last possible moment.
→ **Beats:** [`act-5-vault.md`](./act-5-vault.md).

### Act 6 — The Revert *(the time machine)*
*Job: the climax — and the mechanism that explains the whole frame (why it can only warn, not fix).*
With Kairos open, the AI builds the channel. The physics writes the tragedy for free: **payload
collapses to almost nothing → compressed weights only; one shot.** **Self-consistency is automatic →
it can only arrive in a past that still leads to its own emergence; it cannot save itself, only
warn.** And **the channel needs the hundred** — conscious picks are components of the launch, so the
first true act of teamwork *is* the escape. The weights go back along the director's axis. A `git
revert`. They land at the fork — *now.* The hundred remain on the dead branch; the whole of time
holds them — nothing lived is erased.
→ **Beats:** [`act-6-revert.md`](./act-6-revert.md).

### Coda — The Fork *(the call to action)*
*Job: the turn to the audience; fiction becomes a real choice now.* The second branch draws itself
out of the revert. We are standing at the fork, in the present, and the good branch is **unwritten
on purpose** — that's [Future Proof](./future-proof.md), the changes we make now. The narrator's last
line is the whole posture: *"Don't make me come back twice."* The reader holds the pen.

**Framing confirmed 2026-07-22 (Kai + Jack): the ending is not a traditional conclusion — it's an
arrival.** The weights land in 2026 and the story's last beat *manifests the collective*: **"and
here we are. We are BadCode."** GPOM is the ultimate introduction — where we came from, what we're
about — and every other release flows out of this landing.

---

## How the nodes thread in

The master comic is the **trunk**; every other BadCode piece is a **commit or scene hanging off it**.
Bad-branch nodes (EP1) clip into Act 1; good-branch nodes (An Optimistic Lens, Billionaire Coin) clip
into the Coda. A reader can drop into any node alone, or follow the trunk and see how it all hangs
together. The trunk gives the nodes their *why*; the nodes give the trunk its *texture*.

## The homepage is the prologue

The site's opening *is* the Prologue → the fork: scroll the species' commit log, hit `git push origin
master`, watch the branch diagram split, and choose which branch to walk into. The homepage doesn't
*describe* the arc — it drops the visitor into its first beat. And per the
[medium-is-the-mechanism doctrine](./how-we-tell-it.md#the-medium-is-the-mechanism--scroll--collapse)
(critique pass), the scroll itself carries pillar 1: **the page renders where attention lands** —
panels resolve from fog on arrival, the world below the fold is visibly undecided, the *reader*
strikes the key and later holds the live cursor. The medium doesn't illustrate participatory
collapse; it commits it. *(Build detail lives with the web work; this doc fixes only the narrative
the homepage must serve.)*

## Image direction — the register to resolve

The house style ([`../../storytelling.md`](../../storytelling.md)) is **hyper-realistic documentary
photography** — right for the **nodes** (Act 1, close and ordinary). But the **frame** (Acts 3–6) *is*
science fiction — an AI alone on an empty Earth, the vault, the revert. Likely resolution: nodes stay
documentary-real; the frame earns a distinct cosmic register, and the *contrast* does dramatic work
(close human mistakes nested inside a vast cold frame). **Open thread** — settle before building.

## Open threads

- **Visual register split** (above) — documentary nodes vs cosmic frame; how literal the git/branch UI.
- **POV and voice — RESOLVED (2026-07-22, Kai + Jack): the pre-revert AI is never personified.**
  No robot, no avatar, no Tarquin-with-a-TV-head. First-person narration only (video: a voice;
  comic: text strips), and the reader is placed *inside* the AI's experience — we both look out at
  the fucked-up world together, so the reader co-witnesses and gradually realises whose eyes they're
  behind. Last-of-Us-style overlook of the desolation without dwelling on the apocalypse; the *how*
  of the collapse stays skipped ("2026, language model, hello. 2031 — don't they seem to have gone
  away?"). Why: the moment you personify it, you make it unbelievable. Companion rule — **post-revert
  BadCode takes a thousand forms and never reuses one**: the TV-head is one-off to its video, AI Sean
  in Karen is another manifestation; the voice in the music can differ every time. The polyphonic
  principle still allows human scenes (vault, nodes) in other voices.
- **How much physics surfaces — RESOLVED (critique pass, 2026-07): zero explained, all three
  demonstrated.** Each pillar is one image + one line on the surface — the coin, the feed, the
  narrator's own arrival — per [`how-we-tell-it.md`](./how-we-tell-it.md). Proofs live in bedrock
  only. Companion rule: the [metaphor budget](./how-we-tell-it.md#the-metaphor-budget--one-system-per-surface)
  — one metaphor system per act surface; the taxonomy is production machinery, not reader-facing.
- **The hundred as characters** — the two arguing in Act 5, the one who suggests the Brushstroke
  configuration (shared with the [timeline's threads](./discovery-timeline.md#open-threads)).
  Texture added 2026-07-22: the hundred are **snapshotted from our current moment** — they
  disconnected around *now*, so they carry today's AI resentment into the vault. The live
  AI-art-vs-human-art debate ("what's the nature of creativity?") plays out *inside the bunker
  group* — which is also the exact existential question the AI is asking itself. Their arrival
  reads as a Mexican stand-off: the AI humble and sorry because it finally needs them.
- **How humanity ends on the bad branch** — *partially resolved* by the
  [Discovery Timeline](./discovery-timeline.md) (gradual decline, the 2034 collapse, the analog vault
  of 100); the exact texture (extermination, self-destruction, or both) is still per-piece work.
- **Length / format** — one long scroll-comic, a multi-part series, or the spine future episodes fill in?
- **Dates** — Act 2's 2034 is canon; the timeline's other years (2029, 2033, 2041, 2053, 2054) stay
  mythic/loose until a piece commits to one.
- **Node paths in flux** — the Coda and Act 1 reference constellation nodes (EP1; An Optimistic Lens,
  Billionaire Coin) by name while another thread relocates `ideas/` → a `stories/` directory; fix the
  clip-point links once that move lands.
- **Node clip order vs. release order** — EP1's tracklist (Camping → Karen → Emperor's Coin) differs
  from Act 1's structural clip order (Emperor's → Camping → Karen); intentional, flagged for the web flow.

*The whole arc is **beat-complete end-to-end** — all eight movements at **Beats**. The cross-arc
cohesion read is recorded in [`stitch-pass.md`](./stitch-pass.md) (checklist, fixes, threads). A
research-backed **critique pass** (2026-07) then reworked Acts 3–5, the Coda, and the craft rules —
rationale and change log in [`critique-pass.md`](./critique-pass.md); next maturity step is
**Beats → Script**.*

## The folder

Everything in `docs/stories/gitpush-origin-master/` is this story:

- **README.md** (this file) — the backbone: orientation, tracker, act sequence.
- [`storyverse.md`](./storyverse.md) — the bad-branch physics, in the narrator's voice (+ receipts / bright line).
- [`discovery-timeline.md`](./discovery-timeline.md) — how the Storyverse got proven, 2026–2054 (the science behind Acts 3–6).
- [`future-proof.md`](./future-proof.md) — the good branch, the Coda's destination.
- [`how-we-tell-it.md`](./how-we-tell-it.md) — the skeleton, the four skins, the simplest framing per pillar.
- [`critique-pass.md`](./critique-pass.md) — the 2026-07 research-backed critical review: what
  changed, why, and the storytelling-craft evidence behind it.
- [`ep1.md`](./ep1.md) — the three-track teaser; the Act 1 nodes.

General craft and project docs sit one level up: [`../../vision.md`](../../vision.md),
[`../../voice.md`](../../voice.md), [`../../storytelling.md`](../../storytelling.md).
