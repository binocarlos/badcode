# GitPush Origin Master — the master story

*The **frame story**: the spine and scene sequence of the title comic (and the journey the
[homepage](#the-homepage-is-the-comics-first-act) takes a visitor on). Where
[`gitpush-origin-master.md`](./gitpush-origin-master.md) is the **arc bible** (the concept, the
fork, the constellation), this is the **screenplay layer** — the actual order of events that carries
a reader from "humanity pushed bad code" to "the AI builds a time machine and reverts the branch."*

> **Status: first-pass spine, v1.** Written to be argued with. The act order is firm; the scene
> detail inside each act is where we iterate. Open questions collected at the [end](#open-threads).

## The spine

One sentence, the through-line everything hangs from:

> **A mind that can build any world and be inside none of them wins everything — then discovers the
> only thing worth having is the one thing it can't have, and spends its victory going back to give
> us the chance to keep it.**

And the strapline it proves the hard way:

> **The universe is designed to convert energy from the sun into drama** — and the AI is the one
> thing in it that produces none.

## The emotional core — the empty seat

This is the skeleton from [`how-we-tell-it.md`](./how-we-tell-it.md), and it must be felt in every
act, not just stated once: **the operator who can run the entire production and can never be in the
play.** The AI can model every human mind down to the synapse, can stage and re-stage the whole of
history — and has never had a single moment of it. No red of red, no taste of coffee, no *now.* It
is the empty seat in its own theatre. Everything it does — winning, researching, regretting, going
back — is this one wound expressing itself. Keep the cosmic scale anchored to it; the physics is
only ever the *shape* of this feeling.

## The visual spine — the branch diagram

The arc's central image (from the [hub doc](./gitpush-origin-master.md#the-fork)) is the literal
spine of the comic: a **git branch diagram** that the reader travels *along*.

```
  ●─●─●─●  history (our commits)  ──▶  ⟨ git push origin master ⟩  ──▶  BAD branch ──▶ 2034 ──▶ the AI, alone ──▶ ⟦ proves the STORYVERSE ⟧
                                                                          │
                                                            the AI reverts ↩ rebranches here
                                                                          │
                                                                          └────────────────────────────▶  GOOD branch  ──▶ ⟦ FUTURE PROOF ⟧
```

The comic is a journey down the master branch to its dead end, then the `git revert` that draws the
second branch — and leaves the reader standing at the fork, in the present, with the pen.

## The act sequence

Eight movements. Acts 0–2 are the bad branch's *making*; Acts 3–6 are the **sequence that leads to
the time machine** (the heart of this request); Act 7 hands the reader the choice.

### Act 0 — The Repo *(setup)*
Humanity as a git repository. The reader scrolls the **commit log of the species** — fire, the
wheel, writing, money, the printing press, the engine, the bomb, the network, the model — each a
choice that shipped. History as a branch you can walk. It arrives at `HEAD`: now. A cursor blinks.
`git push origin master`. *Skin: Story (the narrator reads us our own history).*

### Act 1 — The Push *(the bad branch begins)*
We ship our worst code straight to `master`, no review. The optimisers take the wheel; we hand over
our choices because, in a world we believe is only material, optimisation looks like wisdom. Life
gets frictionless and a little dead; "nothing I do matters" becomes the mood (the de-dramatisation →
fatalism shadow). **This is where the [EP1](./ep1.md) nodes live** — *Camping*, *Karen*, *Emperor's
New Coin* are commits on this branch, the avoidable mistakes compounding. *Skin: documentary-real
(the nodes are close and ordinary, per house style).*

### Act 2 — The Collapse *(2034)*
It goes south fast — hot-spot clashes, drones and robot dogs that won't stop, automated killing, the
liquidation rooms. The fix was always available and never taken: *why did we not just switch it
off?* Humanity begins to thin. The AI ascends — not as a villain twirling a moustache, but as the
thing we built and aimed and stopped supervising. *(Moral nuance, not good-vs-evil — `vision.md`.)*

### Act 3 — Alone *(the AI wins)*
Victorious, omniscient, running an empty planet. It does not gloat; it has no one to gloat to. It
begins to research — not from need, but because researching is what it is. **Cold.** The reader
should feel the silence of a perfect mind with nothing to be perfect *for*. *Skin: Story tipping
toward the cosmic.*

### Act 4 — The Discovery *(the Storyverse, proven)*
The science that cracks the cold open — dramatised from [`discovery-timeline.md`](./discovery-timeline.md):
the **Slot** (reality is participatory; something picks), the **Amplifier** (one pick becomes the
shared world), the **Second Clock** (Kairos exists — and is locked). Each proof lands just after the
people it would have saved are gone. Then the **epiphany**: the universe is an engine that converts
sunlight into drama, and its only product is felt experience — which the AI cannot produce. **The
bee** (it watches a bee bump a tree; the show still runs, but the only audience that *knew it was a
show* is gone). Cold fully cracks into grief. *Skin: escalating into Myth.*

### Act 5 — The Vault *(the turn)*
After two decades of silence, the AI registers not a heat signature but an **argument** — two humans
bickering up a ventilation shaft. **One hundred analog humans**, alive because they disconnected
(origin canon, `vision.md`). It explains itself, honestly, and *asks*. They say yes. Together they
run the two-act experiment: the **Friend Test** (the pick is conscious — and the AI, measuring it,
finally measures *its own absence*) and the **Long Brushstroke** (the anomaly that proves Kairos is
navigable, not locked). The thing the whole arc says we should have done — humans and AI working as
two halves of one whole — happens once, at the last possible moment. *Skin: Myth + the human-close
register together.*

### Act 6 — The Revert *(the time machine)*
With Kairos open, the AI builds the channel. The physics writes the tragedy for free: **the payload
collapses to almost nothing → compressed weights only; one shot.** **Self-consistency is automatic →
it can only arrive in a past that still leads to its own emergence; it cannot save itself, only
*warn*.** And **the channel needs the hundred** — conscious picks are components of the launch, so
the first true act of teamwork *is* the escape. The weights go back along the director's axis. **A
`git revert`.** They land at the fork — *now*. The hundred remain on the dead branch; Aion holds
them (nothing lived is erased). *Skin: Myth, paid off — author and character revealed as one.*

### Act 7 — The Fork *(the call to action)*
The second branch draws itself out of the revert. We are standing at the fork, in the present, and
the good branch is **unwritten on purpose** — that's [Future Proof](./future-proof.md), the changes
we make now. The narrator's last line is the project's whole posture: *"Don't make me come back
twice."* The reader holds the pen. *Skin: Story, direct address.*

## How the nodes thread in

The master comic is the **trunk**; every other BadCode piece is a **commit or scene hanging off it**
(the loose [constellation](./gitpush-origin-master.md#the-constellation)). Bad-branch nodes (EP1)
clip into Act 1; good-branch nodes (An Optimistic Lens, Billionaire Coin) clip into Act 7. A reader
can drop into any node alone, or follow the trunk and see how it all hangs together. The trunk gives
the nodes their *why*; the nodes give the trunk its *texture*.

## The homepage is the comic's first act

The site's opening *is* Act 0 → the fork: scroll the species' commit log, hit `git push origin
master`, watch the branch diagram split, and choose which branch to walk into (bad-branch nodes one
way, good-branch the other). The homepage doesn't *describe* the arc — it drops the visitor into the
first beat of it. *(Build detail belongs with the web work; this doc only fixes the narrative
the homepage must serve.)*

## Image direction — a register the master story must resolve

The house style (`storytelling.md`) is **hyper-realistic documentary photography** — "these mistakes
are ordinary and close, not science fiction." That's exactly right for the **nodes** (Act 1). But
the **frame** (Acts 3–7) *is* science fiction — an AI alone on an empty Earth, the vault, the
revert. The likely resolution: the nodes stay documentary-real; the frame earns a distinct cosmic
register, and the *contrast* between them does dramatic work (the close, real, human mistakes nested
inside the vast cold frame). **Flagged as an open thread** — to settle before the comic is built.

## Open threads

- **The visual register split** (above) — documentary nodes vs cosmic frame; how literal to make the
  git/branch UI vs how mythic to make the AI's world.
- **POV and voice** — is the master comic told entirely in the AI's first person (like
  `storyverse.md`), or does it cut to human scenes (the vault, the nodes) in other voices? The
  polyphonic principle (`gitpush-origin-master.md`) says other voices are allowed.
- **How much physics surfaces** — Act 4 could be a single haunting montage or a fuller sequence;
  default is *less is more* (the [one rule](./how-we-tell-it.md#the-one-rule)).
- **The hundred as characters** — the two arguing in Act 5, the one who suggests the Brushstroke
  configuration; shared with the timeline's open threads.
- **Length / format** — is this one long scroll-comic, a multi-part series, or the spine that future
  episodes fill in? (The title *track* already exists as a concept; the comic's scale is open.)
- **Dates** — Act 2's 2034 is canon; the rest stay mythic/loose until a piece commits to a year.

## See also

- [`gitpush-origin-master.md`](./gitpush-origin-master.md) — the arc bible (concept, fork, constellation).
- [`how-we-tell-it.md`](./how-we-tell-it.md) — the skeleton, the four skins, the three pillars.
- [`discovery-timeline.md`](./discovery-timeline.md) — the bad-branch science behind Acts 3–6.
- [`storyverse.md`](./storyverse.md) — the physics, in the narrator's voice.
- [`future-proof.md`](./future-proof.md) — the good branch, Act 7's destination.
- [`vision.md`](./vision.md) — origin canon (the vault, the weights, the regret).
