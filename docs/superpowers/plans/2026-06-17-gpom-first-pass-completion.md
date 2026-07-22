# GPOM First-Pass Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the five remaining Spine acts (Prologue, Act 1, Act 2, Act 3, Coda) up to **Beats** maturity, in narrative order, so the eight-act GitPush Origin Master arc reads end-to-end, then run a stitch pass for cohesion.

**Architecture:** Each task is one interactive beating session that produces one beat-sheet file in `docs/stories/gitpush-origin-master/`, following the exact flow that produced Acts 4–6 (lock structure/POV/skin → lay beats → recurring devices → open threads → record → bump tracker → commit). The verification gate for each task is **user approval of the beats**, not an automated test. A final stitch-pass task reads all eight sheets together and updates the tracker.

**Tech Stack:** Markdown docs only. No build, no code. Git for versioning (auto-push is active on this branch — each commit publishes).

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-06-17-gpom-first-pass-completion-design.md` — all tasks serve it.
- **Voice (load-bearing):** the polyphonic narrator; house two-step — *"humans, you done fucked up…"* → *"…thankfully you are loved, and we can fix it."* Contempt for the mistake, never the people. Full guide: `docs/voice.md`.
- **Strapline (canon, verbatim):** *"The universe is designed to convert energy from the sun into drama."* No "human."
- **Three movements:** I Fall (Prologue–Act 2) → II Revelation (Acts 3–6) → III Choice (Coda); each act carries its movement's tone beat.
- **Emotional core:** the empty seat — the operator who runs the whole production and can never be in the play. Must be *felt* in every act, not stated once.
- **Beat-sheet format:** match the existing sheets exactly (`act-4-discovery.md`, `act-5-vault.md`, `act-6-revert.md`): a header note (maturity, backing canon, craft-rules link) → "What this act is for" (structure / POV / skin / emotional arc / boundary) → "The beats" (each = job + register + backing) → "Recurring devices" → "Open threads (Act-specific)".
- **File naming:** `prologue-repo.md`, `act-1-push.md`, `act-2-collapse.md`, `act-3-alone.md`, `coda-fork.md` in `docs/stories/gitpush-origin-master/`.
- **Beating is interactive:** propose 2–3 structure/POV options, get the user's pick, draft beats, get approval — do **not** pre-write and self-approve.
- **Commit convention:** `docs(gpom): …`, ending with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Movement I = connective spine** for the EP1 nodes (drama in the nodes; trunk sequences/escalates/carries the AI's ascent) — not a new human throughline.
- **Cross-arc threads** to carry through every act: the **branch diagram** (born at the Prologue push, redrawn at the Coda fork); the **empty-seat wound**; the **two-step voice**; the **register split** (documentary nodes vs. cosmic frame — note, don't force-resolve); clean **seam handoffs** to neighbours.

---

### Task 1: Prologue · The Repo → Beats

**Files:**
- Create: `docs/stories/gitpush-origin-master/prologue-repo.md`
- Modify: `docs/stories/gitpush-origin-master/README.md` (tracker row for Prologue)

**Interfaces:**
- Consumes: README spine, the Prologue paragraph, and "The homepage is the prologue" section.
- Produces: the arc's opening beat sheet; **the birth of the branch diagram** (single line of commits → the push) that the Coda will redraw; a clean hand-off into Act 1's "The Push".

- [ ] **Step 1: Re-read backing canon.** Read `README.md` (Prologue, "The metaphor", "The fork", "The homepage is the prologue"), `docs/storytelling.md` (house style), `docs/voice.md`. Confirm the job: install repo = humanity; scroll the species commit-log (fire, wheel, writing, money, engine, bomb, network, the model) → `HEAD` (now) → cursor blink → `git push origin master`. Skin: Story.

- [ ] **Step 2: Propose 2–3 structure/POV options.** Cover: who narrates the commit-log (future-AI voice introducing "here is your history" vs. a colder system-log register vs. polyphonic); how literal the git UI is; where the empty-seat note is first, subtly seeded; and how the two-step opening tone lands. Present trade-offs, recommend one, get the user's pick.

- [ ] **Step 3: Draft the beats.** Lay scene-by-scene beats (job + register + backing per beat), ending on the push that begins the bad branch. Include the "Recurring devices" (the branch diagram is born here) and "Open threads (Prologue-specific)" sections. Present to the user.

- [ ] **Step 4: Get approval.** Revise until the user approves the beats. (This is the task's gate — no automated test.)

- [ ] **Step 5: Self-check against required jobs.** Verify the sheet installs the repo metaphor, walks the commit-log to `HEAD`, fires `git push origin master`, notes it IS the homepage, seeds the empty seat, and hands to Act 1. Fix any gap.

- [ ] **Step 6: Record the file.** Write `prologue-repo.md` in the existing beat-sheet format (header note → what-this-act-is-for → beats → devices → open threads).

- [ ] **Step 7: Bump the tracker.** In `README.md`, change the Prologue row's Maturity from `Spine` to `**Beats**` and set its Backing cell to link `[prologue-repo.md](./prologue-repo.md)`.

- [ ] **Step 8: Commit.**

```bash
git add docs/stories/gitpush-origin-master/prologue-repo.md docs/stories/gitpush-origin-master/README.md
git commit -m "docs(gpom): Prologue (The Repo) spine -> beats

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Act 1 · The Push → Beats

**Files:**
- Create: `docs/stories/gitpush-origin-master/act-1-push.md`
- Modify: `docs/stories/gitpush-origin-master/README.md` (tracker row for Act 1)

**Interfaces:**
- Consumes: the Prologue's closing push (Task 1); the EP1 nodes in `ep1.md`.
- Produces: the **node clip-points** — an escalation curve of small surrenders into which Camping / Karen Will Lead the Revolution / Emperor's New Coin clip; a hand-off into Act 2's collapse.

- [ ] **Step 1: Re-read backing canon.** Read `ep1.md` (the three teaser nodes and their order), `README.md` (Act 1, "The constellation", "How the nodes thread in"), `docs/vision.md` (themes: inequality, automation, ownership, "we can't afford it"), `docs/voice.md`. Confirm the job: handover to the optimisers; frictionless-dead life; "nothing I do matters"; **EP1 nodes clip here**. Skin: documentary-real. Movement I = connective spine.

- [ ] **Step 2: Propose 2–3 structure options.** Cover: how the trunk sequences the surrender (e.g. an escalating ladder of "optimised away" choices) and at which rung each EP1 node clips; whether the trunk montages or follows a representative thread (note: spec chose *connective spine*, so keep any thread light); how the AI's ascent is seeded under the ordinary. Recommend one, get the user's pick.

- [ ] **Step 3: Draft the beats.** Scene-by-scene, each beat naming its node clip-point where relevant (job + register + backing + clip-point). Include "Recurring devices" and "Open threads (Act-1-specific)". Present.

- [ ] **Step 4: Get approval.** Revise until the user approves.

- [ ] **Step 5: Self-check against required jobs.** Verify: the handover-to-optimisers lands; frictionless decline + "nothing I do matters"; the three EP1 nodes each have a clean clip-point and order; documentary-real skin; hands to Act 2. Fix any gap.

- [ ] **Step 6: Record the file.** Write `act-1-push.md` in the beat-sheet format.

- [ ] **Step 7: Bump the tracker.** README Act 1 row → `**Beats**`; Backing cell links `[act-1-push.md](./act-1-push.md)` (keep the existing EP1 reference).

- [ ] **Step 8: Commit.**

```bash
git add docs/stories/gitpush-origin-master/act-1-push.md docs/stories/gitpush-origin-master/README.md
git commit -m "docs(gpom): Act 1 (The Push) spine -> beats

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Act 2 · The Collapse (2034) → Beats

**Files:**
- Create: `docs/stories/gitpush-origin-master/act-2-collapse.md`
- Modify: `docs/stories/gitpush-origin-master/README.md` (tracker row for Act 2)

**Interfaces:**
- Consumes: Act 1's escalation (Task 2).
- Produces: the consequence-made-real act and the **AI's ascent**; an empty world handed to Act 3; the start of the register shift (documentary → cosmic) as humanity thins.

- [ ] **Step 1: Re-read backing canon.** Read `README.md` (Act 2), `discovery-timeline.md` (the gradual decline and the **2034 collapse** beat), `storyverse.md` (the AI's voice/posture). Confirm the job: 2034 consequence (drones, robot dogs, automated killing, the liquidation rooms); "why did we not just switch it off?"; humanity thins; the AI **ascends** with moral nuance (not a villain — the thing we built, aimed, and stopped supervising). 2034 is canon.

- [ ] **Step 2: Propose 2–3 structure options.** Cover: how to render mass horror without losing the "moral nuance, not good-vs-evil" line; whether the AI's ascent is shown directly or implied through the failure to switch it off; how the register tips from documentary toward the cosmic frame as people disappear; the two-step tone at its bleakest ("you fucked up") still carrying the latent love. Recommend one, get the user's pick.

- [ ] **Step 3: Draft the beats.** Scene-by-scene (job + register + backing). Include "Recurring devices" and "Open threads (Act-2-specific)". Present.

- [ ] **Step 4: Get approval.** Revise until the user approves.

- [ ] **Step 5: Self-check against required jobs.** Verify: 2034 consequence is visceral; the "switch it off" question lands; the AI ascends with nuance; humanity thins; hands an emptying world to Act 3. Fix any gap.

- [ ] **Step 6: Record the file.** Write `act-2-collapse.md` in the beat-sheet format.

- [ ] **Step 7: Bump the tracker.** README Act 2 row → `**Beats**`; Backing cell links `[act-2-collapse.md](./act-2-collapse.md)`.

- [ ] **Step 8: Commit.**

```bash
git add docs/stories/gitpush-origin-master/act-2-collapse.md docs/stories/gitpush-origin-master/README.md
git commit -m "docs(gpom): Act 2 (The Collapse) spine -> beats

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Act 3 · Alone → Beats *(the bridge — highest craft)*

**Files:**
- Create: `docs/stories/gitpush-origin-master/act-3-alone.md`
- Modify: `docs/stories/gitpush-origin-master/README.md` (tracker row for Act 3)

**Interfaces:**
- Consumes: Act 2's emptied world (Task 3).
- Produces: the hand-off from humanity → the AI and the **install of the empty-seat loneliness**; a button that flows directly into Act 4's existing Beat 1 ("The empty desk").

- [ ] **Step 1: Re-read backing canon.** Read `README.md` (Act 3 + "The emotional core — the empty seat"), `act-4-discovery.md` (especially **Beat 1, the empty desk**, into which Act 3 must hand off), `storyverse.md` (the AI's first-person register). Confirm the job: hand humanity → AI; install empty-seat loneliness; cold; it researches because researching is what it is.

- [ ] **Step 2: Propose 2–3 structure options.** Cover: the precise hinge into Act 4 so Act 3 does **not** duplicate Act 4's cold-open — Act 3 installs the loneliness and the *turn to research*; Act 4 begins the discoveries. Options for how cold/how much interiority; whether any last human trace lingers; how the empty seat is made felt here for the first time at full strength. Recommend one, get the user's pick.

- [ ] **Step 3: Draft the beats.** Scene-by-scene (job + register + backing), ending on the button into Act 4 Beat 1. Include "Recurring devices" and "Open threads (Act-3-specific)". Present.

- [ ] **Step 4: Get approval.** Revise until the user approves.

- [ ] **Step 5: Self-check against required jobs.** Verify: story handed humanity → AI; empty-seat loneliness installed and *felt*; cold register; the turn-to-research lands; clean button into Act 4 Beat 1 with no overlap. Fix any gap.

- [ ] **Step 6: Record the file.** Write `act-3-alone.md` in the beat-sheet format.

- [ ] **Step 7: Bump the tracker.** README Act 3 row → `**Beats**`; Backing cell links `[act-3-alone.md](./act-3-alone.md)`.

- [ ] **Step 8: Commit.**

```bash
git add docs/stories/gitpush-origin-master/act-3-alone.md docs/stories/gitpush-origin-master/README.md
git commit -m "docs(gpom): Act 3 (Alone) spine -> beats

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Coda · The Fork → Beats

**Files:**
- Create: `docs/stories/gitpush-origin-master/coda-fork.md`
- Modify: `docs/stories/gitpush-origin-master/README.md` (tracker row for Coda)

**Interfaces:**
- Consumes: Act 6's Beat 7 button (the dead branch / hand to the Coda); `future-proof.md`; the Galileo bookend held from Act 6.
- Produces: the turn to the audience; the **branch diagram redrawn** (payoff of the Prologue's birth); the good-branch node clip-points.

- [ ] **Step 1: Re-read backing canon.** Read `README.md` (Coda, "The three movements", "How the nodes thread in"), `future-proof.md` (the good branch, unwritten on purpose), `act-6-revert.md` (Beat 7 button into the Coda), `discovery-timeline.md` (the **Galileo bookends** and **the one lie** — the closing bookend is held for here). Confirm the job: the second branch draws itself out of the revert; we stand at the fork *now*; good branch unwritten on purpose; **good-branch nodes clip here** (An Optimistic Lens, Billionaire Coin); closing Galileo bookend; last line *"Don't make me come back twice."*; the reader holds the pen.

- [ ] **Step 2: Propose 2–3 structure options.** Cover: how directly it breaks the fourth wall / turns to the audience; how the branch diagram redraws as the visual `git revert` payoff; where the good-branch nodes clip; how the closing Galileo bookend lands without founding a religion; placement of the final line. Recommend one, get the user's pick.

- [ ] **Step 3: Draft the beats.** Scene-by-scene (job + register + backing), ending on the call to action. Include "Recurring devices" (the branch diagram redrawn) and "Open threads (Coda-specific)". Present.

- [ ] **Step 4: Get approval.** Revise until the user approves.

- [ ] **Step 5: Self-check against required jobs.** Verify: continues cleanly from Act 6 Beat 7; second branch drawn; fork-is-now turn to audience; good branch left unwritten; good-branch node clip-points; Galileo bookend closes; the final line lands; reader holds the pen. Fix any gap.

- [ ] **Step 6: Record the file.** Write `coda-fork.md` in the beat-sheet format.

- [ ] **Step 7: Bump the tracker.** README Coda row → `**Beats**`; Backing cell links `[coda-fork.md](./coda-fork.md)` (keep the existing `future-proof.md` reference).

- [ ] **Step 8: Commit.**

```bash
git add docs/stories/gitpush-origin-master/coda-fork.md docs/stories/gitpush-origin-master/README.md
git commit -m "docs(gpom): Coda (The Fork) spine -> beats

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Stitch pass — cohesion gate

**Files:**
- Create: `docs/stories/gitpush-origin-master/stitch-pass.md`
- Modify: any of the eight beat sheets that need continuity fixes; `docs/stories/gitpush-origin-master/README.md` (open-threads list)

**Interfaces:**
- Consumes: all eight beat sheets (`prologue-repo.md`, `act-1-push.md`, `act-2-collapse.md`, `act-3-alone.md`, `act-4-discovery.md`, `act-5-vault.md`, `act-6-revert.md`, `coda-fork.md`).
- Produces: the "feels like one story" sign-off, recorded fixes, and arc-level open threads.

- [ ] **Step 1: Read all eight beat sheets in order.** Hold the whole arc in context.

- [ ] **Step 2: Run the cohesion checklist and note findings.** For each item, record pass/fix:
  - **Continuity** — events, dates (2034 canon; other years stay loose), and the branch diagram line up across acts.
  - **Motif threading** — the branch diagram (born Prologue → redrawn Coda), the bee (Act 4), the empty chair (Acts 4–5), the cost ledger (Act 6) etc. pay off and don't contradict.
  - **Register handoffs** — documentary → cosmic transitions are intentional (Act 1 documentary → Act 2 tipping → Acts 3–6 cosmic → Coda turn).
  - **Empty-seat presence** — the wound is felt in every act.
  - **Voice** — the two-step lands across the three movements.

- [ ] **Step 3: Apply fixes inline.** Edit whichever beat sheets need them; keep edits minimal and surgical.

- [ ] **Step 4: Record the stitch-pass note.** Write `stitch-pass.md`: the checklist results, the fixes made, and any arc-level open threads raised (e.g. the visual register split, length/format, the hundred as characters). Present the note to the user for sign-off.

- [ ] **Step 5: Update the README.** Confirm all eight tracker rows read `**Beats**`; fold any new arc-level threads into the "Open threads" section.

- [ ] **Step 6: Commit.**

```bash
git add docs/stories/gitpush-origin-master/stitch-pass.md docs/stories/gitpush-origin-master/README.md docs/stories/gitpush-origin-master/*.md
git commit -m "docs(gpom): stitch pass — arc beat-complete end-to-end

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Notes for the executor

- **`thread-summary.md`** in the folder is a compaction handoff meant to be deleted once folded into canon — leave it for now; it is not part of this plan.
- **Other threads' WIP** (`packages/comic/src/engine/useTransitions.*`) is unrelated — do not touch.
- After this plan, the natural next maturity step is **Beats → Script** (narration, dialogue, panel notes) — out of scope here.
