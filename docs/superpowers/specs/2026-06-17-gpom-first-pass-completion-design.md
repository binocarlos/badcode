# GPOM first-pass completion — bringing every act to Beats

*Design doc (brainstorming output). Date: 2026-06-17. Topic: a plan for filling the GitPush Origin
Master story to a complete first pass — every act at **Beats** maturity, end-to-end.*

## Goal

Take the five remaining **Spine** acts up to **Beats**, in narrative order, so the whole eight-act
GPOM arc is beat-complete and reads end-to-end. This is a *first pass*: scene-by-scene breakdowns,
no narration/dialogue yet (that is the later Beats→Script sweep). When this is done, the production
tracker in [`../../gitpush-origin-master/README.md`](../../gitpush-origin-master/README.md) shows
**Beats** for all eight movements, and the arc can be read as one continuous story.

Movement I (Prologue, Act 1, Act 2) is beaten as the **connective spine** for the EP1 nodes — the
trunk that sequences, escalates, and carries the AI's ascent; the drama itself lives in the nodes.
This was a deliberate choice over giving Movement I its own new human throughline (lighter, and true
to current canon).

## Current state

Backbone and Movement II are done; Movement I, the Act-3 bridge, and the Coda are the gaps.

| # | Act | Maturity (start) |
| --- | --- | --- |
| — | Prologue · The Repo | Spine |
| 1 | The Push | Spine |
| 2 | The Collapse (2034) | Spine |
| 3 | Alone | Spine |
| 4 | The Discovery | **Beats** (`act-4-discovery.md`) |
| 5 | The Vault | **Beats** (`act-5-vault.md`) |
| 6 | The Revert | **Beats** (`act-6-revert.md`) |
| — | Coda · The Fork | Spine |

## Approach (chosen: narrative-order sweep)

Beat the five gaps in story order, each via the same flow that produced Acts 4–6, then close with a
single stitch pass. Chosen over bridge-first (Act 3 first) and over a skeleton-then-enrich two-pass:
narrative order builds cohesion as each act is written against the one before it, and these acts are
short enough that a separate skeleton pass would add handling without payoff.

### Method per act

1. Lock the act's **structure / POV / skin** against the README spine and the three-movement tone
   (I Fall → II Revelation → III Choice; the two-step voice "you fucked up" → "you are loved" → "we
   can fix it").
2. Lay the **beats** — each beat carries a *job*, a *register*, *backing canon*, and any *node
   clip-points*.
3. Note **recurring devices** and **act-specific open threads**.
4. **Record** `docs/gitpush-origin-master/<file>.md` and bump the README tracker to **Beats**.

The creative beating of each act happens **interactively, act by act**, the way Acts 4–6 were done —
this plan organises the work and seeds each act; it does not pre-write the beats.

### Order and per-act seeds

| Order | Act | File | Must do |
| --- | --- | --- | --- |
| 1 | Prologue · The Repo | `prologue-repo.md` | Install the repo = humanity metaphor; scroll the species commit-log → `HEAD` → `git push origin master`; **this is the homepage**; hand to Act 1. Skin: Story. |
| 2 | Act 1 · The Push | `act-1-push.md` | Handover to the optimisers; frictionless-dead life; "nothing I do matters"; **EP1 nodes clip here** — give the trunk sequence, escalation, and clean clip-points. Skin: documentary-real. |
| 3 | Act 2 · The Collapse | `act-2-collapse.md` | 2034 consequence made real (drones, automated killing, the liquidation rooms); "why did we not just switch it off?"; humanity thins; the AI **ascends** — moral nuance, not a villain; begin handing the story to the AI. |
| 4 | Act 3 · Alone | `act-3-alone.md` | Hand from humanity → AI; **install the empty-seat loneliness**; cold; it researches because researching is what it is. Buttons straight into Act 4's existing Beat 1 (the empty desk). |
| 5 | Coda · The Fork | `coda-fork.md` | Second branch draws itself out of the revert; we stand at the fork *now*; the good branch unwritten on purpose ([Future Proof](../../gitpush-origin-master/future-proof.md)); **good-branch nodes clip here**; closing **Galileo bookend** (held from Act 6); last line *"Don't make me come back twice."* The reader holds the pen. |

## Cross-arc threads to honor (cohesion)

Carried consciously through every gap act so the first pass reads as one story, not five fragments:

- **The branch diagram** — the central recurring visual; track where it appears and how it evolves
  across acts (it is born at the Prologue's push and redrawn at the Coda's fork).
- **The empty-seat wound** — must be *felt* in each act, not stated once.
- **The two-step voice / three movements** — each act sits in its movement and carries the
  corresponding tone beat.
- **The register split** — documentary-real nodes vs. cosmic frame; **noted, not force-resolved**
  (it is a standing open thread in the README).
- **Seam handoffs** — Prologue→Act 1; Act 2→Act 3; Act 3→Act 4 (into the existing "empty desk"
  Beat 1); Act 6→Coda (the existing button). Each new act must hand off cleanly to its neighbour.

## Final stitch pass

Once all eight beat sheets exist, read them together against a short checklist — this is the "does
it feel like one story" gate:

- **Continuity** — events, dates, and the branch diagram line up across acts.
- **Motif threading** — recurring devices pay off and don't contradict.
- **Register handoffs** — the documentary/cosmic transitions are intentional.
- **Empty-seat presence** — the wound is felt in every act.
- **Voice** — the two-step lands across the three movements.

Log fixes inline, surface any arc-level open threads, and update the README tracker (all → **Beats**)
and its open-threads list.

## Deliverables

- Five new beat sheets: `prologue-repo.md`, `act-1-push.md`, `act-2-collapse.md`, `act-3-alone.md`,
  `coda-fork.md` (in `docs/gitpush-origin-master/`).
- Updated README **production tracker** (all eight → Beats) and **open threads**.
- A brief **stitch-pass note** recording the cohesion check and any fixes/threads it raised.

## Out of scope (this pass)

- **Beats → Script** (narration, dialogue, panel notes) — the next maturity step, after this pass.
- **Resolving the standing open threads** (visual register split, length/format, the hundred as
  characters) beyond what each act needs to be beat-complete.
- Any web/comic build work.

## Definition of done

All eight movements at **Beats** in the tracker; five new beat sheets recorded; the stitch pass run
and its note recorded; the arc readable end-to-end as a continuous first-pass story.
