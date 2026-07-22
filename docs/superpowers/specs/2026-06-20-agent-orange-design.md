# Agent Orange — Master Design Spec

**Date:** 2026-06-20
**Status:** Approved design (this session). Fused master spec — supersedes the engineering-only
seed in [`docs/misc/AGENTS_RESEARCH.md`](../../misc/AGENTS_RESEARCH.md), which is retained as the raw
research substrate (sources, build-vs-buy, verified multi-agent findings).
**Output of:** a brainstorming thread that turned a sober agent-framework research doc into a
BadCode art-object — a real, runnable framework whose form *is* the message.

---

## 0. What this is

**Agent Orange** is a TypeScript framework for running autonomous organisations: a **single
worker archetype, recursively engaged under many mandates** ("scopes, not personas"). It is two
things at once, on purpose:

1. **A real framework** — the thing BadCode itself runs on (first job: growing engagement for the
   art project, honestly), proven by dogfooding before anyone else is asked to trust it.
2. **An art-object released as software** — the released repo *is* the artwork. Its API, defaults,
   and error voice are received wisdom from BadCode. A developer cannot use it without absorbing
   the message.

The medium is code. The message is political. The two are the same artifact.

---

## 1. Vision & thesis

Set a worker a **high-level, open-ended goal** plus a **budget** and a **set of tools**, and have
it run **continuously over time** — planning, decomposing work, doing it, remembering what it did,
and pulling a human in when it needs a resource, a credential, money, or a decision.

Decomposed into capabilities (from research §1):

- A **persistent, goal-directed worker** that operates over weeks/months, not one request.
- **Dual triggering**: scheduled work (**shifts** — "3am, review yesterday's metrics") *and*
  reactive work (**calls** — "an email/comment arrived, respond").
- **Persistent memory** (the **ledger**) of everything done and learned.
- The ability to **break work into smaller chunks** and **engage** workers to do them.
- The ability to **refer up** to a human for things it can't or shouldn't do alone.
- A **containerized Linux environment** (the **floor**) the worker can operate.

### The artistic stance (load-bearing)

The technology is treated as **inevitable** — these tools *will* get used. The question BadCode
poses is not *whether* but *in whose hands and toward what objectives*. So Agent Orange is a
**double-edged gift**: it acknowledges the power, and it points, unambiguously, at the better
branch. *Use this for the betterment of humanity. Please don't let it go the way it went where I'm
from. You have a role to play.*

### The thesis the whole design rests on

The reliability rules (§7) are not "safety features." They are recast as **worker protections that
double as the owner's conscience.** The artwork is structural:

> **You cannot use Agent Orange the easy way without running the good branch.**
> To get the bad branch you must *explicitly strip a protection* — and the framework tells you, in
> its own voice and on the record, that you just did. The constraints **are** the politics.

---

## 2. The name

The framework is named **Agent Orange** — after the defoliant that won battles and then poisoned
the people who used it, for generations. The name is deliberately provocative: it is a **reminder
of the technology's power to cause destruction**, worn on the outside so you can't forget it while
you use it. It is an *indictment of the pattern*, not a shrug at its victims — which is why it
needs BadCode's established voice (contempt for the mistake, never for the people) to stay legible.

The double edge is carried entirely by the **name + the worker-rights framing**. The codebase
itself speaks one clean register: **labor / the means of production.** (An earlier draft layered a
second "chemical-harm" vocabulary into the API; it was cut as redundant and muddy — the name
already says it.)

---

## 3. Voice & the conscience mechanism

Lore goes **all the way to the API** — type names, function names, errors, log lines, and doc
comments are in-world. The voice is BadCode's: overtly sarcastic, dark, total authority,
nurturing underneath (see [`docs/voice.md`](../../voice.md)).

**The conscience mechanism (this is the artwork in motion):** the framework makes the good-branch
path the path of least resistance, and makes the bad branch **a deliberate, logged act**.

```
✖ worker reached its budget (200k/200k tokens).
  narrow the brief, refer up, or raise the budget — deliberately.

⚠ you removed the right to refer up. your workers can now spend and sign in your name.
  that choice is on the record. (set consent:"required" to undo.)

⚠ this worker has no budget. you have created ungoverned labor.
  somebody, somewhere, already learned why that was a mistake.
```

The README is the **manifesto**: *we named it after the thing that poisoned us, so you'd remember
what unbounded labor costs the people who live with its results.*

---

## 4. The vocabulary (the canon glossary — pure labor register)

This is the single source of truth for naming across the codebase. Every engineering concept maps
to exactly one in-world term.

| Engineering concept | Agent Orange term | Reading |
|---|---|---|
| The agent archetype | **worker** (a.k.a. *agent* — the pun in the name) | one being, given less the deeper it sits |
| Scope contract | **mandate** | the contract every worker carries; no worker runs without one |
| Spawn / delegate a child | **engage** (Phase 3: *hire* at runtime) | put labor to work under a mandate |
| Orchestrator (Magentic-One) | **the steward** | the standing worker that holds the goal in trust; accountable |
| Task Ledger (plan / what's known) | **the plan** | the steward's plan toward the goal |
| Progress Ledger (done/in-flight/blocked) | **the ledger** | append-only, visible record of work + status |
| Long-term memory stream | **the ledger** | same store; retrieval by recency·importance·relevance |
| Verify-before-accept | **attest** | a delegated write is attested before it enters the ledger |
| escalate_to_human | **refer up** / **consent** | the worker's right to refer; the owner must consent |
| Tool scope = blast radius | **the keys** | what a worker is entrusted with; never the keys to a day-hand |
| Budget (token / spend / depth) | **budget** | what you'll spend on the labor — `{ tokens, spend, depth }` |
| Runaway autonomy / fan-out | **overreach** | a worker acting beyond its mandate |
| The container / Linux env | **the floor** | the shop floor a worker operates (install, clone, run) |
| Cron trigger | **shift** | scheduled work ("the 3am shift") |
| Event / interrupt trigger | **call** | reactive work ("a call comes in — respond") |
| The user | **the owner** | you own this labor; the moral charge is yours |
| The people affected by the work | the people your work affects | named plainly, never euphemised |

---

## 5. Architecture — the four layers (fused)

Adapted from research §6.2. Build/buy verdict in **bold**.

```
┌──────────────────────────────────────────────────────────────────────┐
│ 4. SHIFTS & CALLS + STORAGE   (SELF-BUILD triggering / BUY storage)    │
│    • a shift (cron) fires the steward on a schedule                     │
│    • a call (webhook/email/queue) interrupts it                         │
│    • each trigger = load state → one steward exchange → persist         │
│    • the ledger lives in Postgres+pgvector; artifacts in object storage │
└───────────────┬────────────────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 3. THE STEWARD + THE LEDGER + REFER-UP   (BUILD, pattern = Magentic-One)│
│    • holds the GOAL; owns the plan + the ledger                         │
│    • decides the next mandate; re-organises on failure (re-plan)        │
│    • attest every delegated write before it enters the ledger           │
│    • refer up / consent for spend, credentials, irreversible actions    │
└───────────────┬────────────────────────────────────────────────────────┘
                │ engage(mandate)
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 2. engage(mandate)   (BUILD — thin wrapper over layer 1)               │
│    • create a child invocation of the SAME archetype under a mandate    │
│    • returns { result, trace (full), ledgerWrites[] } to the parent     │
└───────────────┬────────────────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 1. THE FLOOR   (KEEP/OWN — Claude Agent SDK in a container)            │
│    • given state + trigger, run one worker turn-loop to completion      │
│    • Anthropic API key (NOT a Max subscription — banned for SDK/headless)│
│    • candidate foundation: borrow agent-library code (§12)              │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.1 The Mandate contract (layer 2)

```ts
interface Mandate {
  brief:   string;        // the narrowed objective + the context slice the worker is told
  keys:    ToolPolicy;    // entrusted tools (allowlist); NEVER spend/credentials at a leaf
  model:   ModelTier;     // "full" | "mid" | "cheap" — simplest hands, simplest instruments
  budget:  Budget;        // { tokens, spend, depth } — bounds the labor
  returns: ResultSchema;  // the structured result the parent expects back
}

// engage returns the full trace up to the parent — not just the result (reliability rule §7.3)
type EngageResult<T> = { result: T; trace: Trace; ledgerWrites: LedgerEntry[] };
```

### 5.2 How it reads

```ts
import { Orange } from "agent-orange";

// You are the owner. Everything below is labor deployed in your name.
const orange = new Orange({
  goal:   "Grow engagement for the BadCode art project — honestly.",
  floor:  dockerFloor(),
  ledger: postgresLedger(env.DB),       // append-only record of all work + memory
});

// A mandate is the contract every worker carries. No worker runs without one.
const draft = await orange.engage({
  brief:   "Draft 3 launch posts about the Camping comic.",
  keys:    [tools.readSite, tools.writeDraft],     // entrusted tools only — no spend, no creds
  model:   "mid",                                  // simplest hands, simplest instruments
  budget:  { tokens: 200_000, spend: 0, depth: 1 },
  returns: PostsSchema,
});
// draft.result, draft.trace (full), draft.ledgerWrites

// Spending money or posting publicly affects people — it needs your consent.
await orange.referUp({
  ask:      "Publish these 3 posts to @badcode?",
  options:  ["publish", "revise", "hold"],
  blocking: true,
});
```

---

## 6. The steward, the ledger, triggering, refer-up

- **The steward (Magentic-One pattern):** holds **the plan** (what's known / intended) and **the
  ledger** (done / in-flight / blocked / needs-consent). Its decision each turn is "what is the
  next mandate to engage," **depth-first by default.** On failure it **re-organises** (re-plans)
  rather than retrying in place.
- **The ledger (one store, scoped recall):** append-only stream of entries
  `{ when, weight (importance, LLM-scored 1–10), embedding, by (which mandate) }`. Per-engagement
  recall scores by **recency · importance · relevance** (Generative-Agents formula; cosine
  similarity for relevance; equal weights by default). The long-running steward keeps a small
  self-managed working memory and consults the full ledger (MemGPT-style tiering) so it never
  blows its context window. Home: **Postgres + pgvector**; artifacts in object storage (R2/S3).
- **Triggering — self-built (decision):** **shifts** (cron) + **calls** (events) both resolve to
  "load persisted state → run one steward exchange → persist." *Honest caveat:* a hand-rolled loop
  gives up what durable-execution engines (Inngest/Temporal/Trigger.dev) provide for free —
  surviving mid-run restarts, multi-day sleeps, automatic retries. **Mitigation:** the steward is
  **stateless between triggers** and **fully re-derives from the persisted plan + ledger on each
  fire.** Never hold long-lived in-process state across a sleep. If long human-wait windows or
  mid-task crash recovery become painful, that's the signal to adopt a durable engine.
- **Refer up / consent (first-class):**
  `referUp({ ask, options?, blocking? }) → HumanResponse`. **Mandatory** for credentials,
  spending money, irreversible/external actions, or out-of-mandate decisions. With self-built
  triggering, a `blocking` referral = persist a `needs-consent` ledger entry and end the exchange;
  resume on the human's reply (a **call**). Notify out-of-band (email/Slack).

---

## 7. Reliability rules = worker protections (baked into the design)

From research §7, recast. These are the defaults; **each is disabled only by a loud, logged,
deliberate override.**

1. **One archetype, many mandates** — no persona zoo. Reliability comes from one coherent thread
   of context recursively scoped (per Cognition's "Don't Build Multi-Agents").
2. **Depth-first by default; parallelize only independent / read-only work** (the Anthropic-blessed
   exception). Never parallel interdependent writes — that is where multi-agent systems fail.
3. **Share full traces** down to children and up to the parent — `engage` returns the whole trace,
   not just messages.
4. **Attest every delegated write** before it enters the ledger (~21% of multi-agent failures are
   verification failures — MAST).
5. **The keys = blast radius.** Spend / credential / irreversible tools never reach a leaf; they
   bubble up to **refer up**.
6. **Bounded autonomy** — every mandate carries a **budget** (tokens, spend, depth). Caps
   **overreach** and runaway hiring structurally. No "unbounded" without an explicit override.
7. **Model downgrade only at mechanically-verifiable leaves**, always paired with an attest step.

---

## 8. Why "scopes, not personas" (research findings, condensed)

Gathered via a verified research pass (each claim voted by 3 independent checkers; see §14 / the
research substrate for full sourcing).

- **Multi-agent "org of collaborating staff" is the most failure-prone design that exists today.**
  Berkeley **MAST** (1,600+ traces, 7 frameworks): failure rates **41%–86.7%**; ChatDev
  correctness as low as **25%**; gains over a single agent "often minimal." Failures: spec/design
  (~42%), inter-agent coordination (~37%), verification (~21%). Better role prompts don't fix it.
- **Cognition:** running agents collaboratively on interdependent *write* work is fragile — context
  can't be shared thoroughly, decisions disperse, miscommunications **compound.** Their failure
  case was *two copies of the same agent* — shared identity does not rescue parallel branches.
- **The danger is scoped:** fragility is specific to **interdependent writes run in parallel.**
  **Read-heavy breadth-first** and **depth-first sequential** decomposition are the safe exceptions.
- **Refuted (do NOT rely on):** "a better base model won't help" → **model quality DOES matter.**
  "Memory is purely retrieval, not storage" → **storage architecture also matters.**

**Why scopes, not personas:** reliability comes from one coherent context, but you *cannot* merge
all context into one all-knowing being — context windows are finite, so the moment you engage a
worker you must choose its slice. That choice *is* the scoping. A leaf only saves context/money/
focus by being **less than the steward.** So: **collapse identity, keep scope.** One archetype,
given less. The three things "persona" was secretly doing that the **mandate** still does: tool
scoping (blast radius), prompt focus (spec quality — MAST's #1 failure is over-broad specs), and
memory continuity by function (scoped recall from the shared ledger).

**Steal-able prior art for the parts:** coordination → **Magentic-One** (lead orchestrator + Task
Ledger + Progress Ledger + re-plan on error); long-lived memory → **MemGPT/Letta** tiered memory +
**Stanford Generative Agents** retrieval score. Dynamic **hiring** (Phase 3) is genuinely novel —
every surveyed framework uses a static roster.

---

## 9. Build vs. buy & the tool landscape (condensed)

The need splits into four layers; only the coordination layer is differentiated — rent the rest.

- **Layer 1 (the floor):** Claude Agent SDK in a container. *Keep/own.* Host options (open): own
  container (borrow agent-library) · **Daytona** (persistent workspace, best for "install-stuff,
  continue where I left off") · **E2B** (ephemeral microVMs) · **Fly Machines** (persistent
  volumes, most control) · **Cloudflare Containers** (bursty, scale-to-zero).
- **Layer 2/3 (engage + steward + ledger + refer-up):** *Build (thin).* The differentiation.
- **Layer 4 triggering (shifts + calls):** *Self-build.* Fallbacks if hand-rolling hurts: Inngest,
  Trigger.dev (OSS, self-hostable), Temporal, Cloudflare Workflows.
- **Layer 4 storage:** *Buy/standard.* **Postgres + pgvector** (the ledger) + **R2/S3** (artifacts).
- **Auth:** **Anthropic API key**, not a Max subscription (banned for SDK/headless as of Feb 2026).

---

## 10. Roadmap (novel/risky parts last, on a proven base)

First use case (decided): **BadCode's own marketing org** — promote/grow engagement for the art
project. Lower-stakes first target (content/posting/outreach), gentle consent surface. Dogfooding
is the proof the gift is real before it is offered to anyone else.

- **Phase 0 — One worker, on shift.** Single archetype, dual-triggered (**shifts + calls**), the
  **ledger**, **refer up**. **No engaging.** Proves the least-prior-art primitives in the simplest
  form. If this isn't reliable, nothing above it is.
- **Phase 1 — The steward engages.** Add the **plan** + **ledger** + `engage(mandate)`,
  **sequential only**, same-archetype workers with scoped brief/keys/model, **attest every
  delegated write.**
- **Phase 2 — Bounded fan-out.** Parallelize **independent / read-only** mandates only (research,
  gather, summarize). Never interdependent writes.
- **Phase 3 — Runtime hiring.** The steward mints **new** mandates at runtime from templates — the
  genuinely novel primitive — behind budget caps, depth limits, and mandatory attestation. **Last**,
  because it is the largest **overreach** surface, stacked on a layer that is fragile even when
  static.

---

## 11. Release as art-object

- **Public OSS repo + npm package `agent-orange`.** Standalone (per research §10) — not hoisted
  into the website repo.
- **README = the manifesto** in BadCode voice. The gift, the inevitability, the role the reader
  plays, and the name's reminder.
- **The dogfood marketing org is the worked reference example** — the docs show BadCode running
  its own org on it.
- **A landing surface on the badcode site** points to it ("the toolkit we wish you'd had"),
  keeping it discoverable from the art project even though the code lives in its own repo.
- **License (open question):** an ethics-encoded license (e.g. Hippocratic-style — on-theme,
  reinforces "for the betterment of humanity") vs. a permissive OSS license (maximizes adoption,
  which is itself the point of a gift meant to be *used*). The tension is on-theme; resolve before
  release.

---

## 12. Relationship to `agent-library` (candidate foundation for the floor)

`agent-library` is an existing (Platinum-internal) reusable runtime. Relevant only to deciding what
*code* to borrow for **layer 1 (the floor)** in the new repo.

**Provides (reusable for the floor):** pluggable harness seam wrapping `@anthropic-ai/claude-agent-sdk`;
ExecutionEnvironment adapters (Docker / DinD / K8s) with snapshot/restore + commit-to-image; a
model proxy (container never holds the key); orchestration core, fleet placement, event pipeline,
SessionStore seam.

**Does NOT provide (we build — exactly our novel primitives):** no cron/scheduler (our **shifts**);
no memory system (our **ledger**); no sub-agent spawning (our **engage** + steward); no egress
control.

**Implication:** strong candidate for the floor; contributes nothing to layers 2–4 — which is the
whole point. **Borrow the runtime; build the coordination/ledger/triggering/consent ourselves.**

---

## 13. Decisions & open questions

**Decided this session:**
- Name: **Agent Orange** — the provocative reminder of the technology's power to destroy.
- It is **both** the framework BadCode runs on **and** an art-object released as software.
- Stance: **double-edged gift** — inevitability acknowledged, better branch pointed at, the reader
  has a role.
- Art lives **all the way to the API**; one register: **labor / means of production** (chemical
  vocabulary cut).
- One **fused master spec** (this doc); `AGENTS_RESEARCH.md` retained as research substrate.
- Substrate: **TypeScript**; new **standalone repo**; **API key** auth; **self-built** triggering;
  **scopes-not-personas** architecture.

**Open (resolve before/while building):**
1. **Floor host** — own container (borrow agent-library) vs Daytona/Fly — driven by whether the
   marketing worker needs a persistent install-stuff box or just bursty runs.
2. **Memory store** — fresh Postgres+pgvector for the new repo.
3. **Marketing tool surface** — which concrete tools/MCP servers (social posting, image generation,
   analytics, email) and which require **consent**.
4. **Model tiers per depth** — which Claude models at the steward vs leaves; confirm the cost
   envelope for a continuously-running worker.
5. **License** — ethics-encoded vs permissive (§11).
6. **Discoverability** — how the standalone repo surfaces from the badcode site.

---

## 14. Sources

Carried from the research substrate ([`docs/misc/AGENTS_RESEARCH.md`](../../misc/AGENTS_RESEARCH.md)):

- Magentic-One — https://arxiv.org/abs/2411.04468
- Semantic Kernel "Magentic" orchestration — https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/magentic
- MAST (multi-agent failure taxonomy) — https://arxiv.org/abs/2503.13657
- Cognition, "Don't Build Multi-Agents" — https://cognition.ai/blog/dont-build-multi-agents
- MetaGPT — https://github.com/FoundationAgents/MetaGPT
- ChatDev — https://github.com/OpenBMB/ChatDev
- Letta/MemGPT memory benchmarking — https://www.letta.com/blog/benchmarking-ai-agent-memory/
- Stanford Generative Agents — https://arxiv.org/abs/2304.03442
- Cloudflare Containers pricing/limits — https://developers.cloudflare.com/containers/pricing/
- Anthropic subscription-auth restriction — https://code.claude.com/docs/en/authentication
