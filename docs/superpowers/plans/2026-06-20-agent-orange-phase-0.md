# Agent Orange — Phase 0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 0 of Agent Orange — *one worker, on shift*: a single long-running worker, dual-triggered by **shifts** (cron) + **calls** (events), with an append-only **ledger** (memory across triggers) and **refer up / consent** (human-in-the-loop). No `engage` (no spawning) yet.

**Architecture:** A thin TypeScript framework. The Claude Agent SDK runs one worker turn-loop behind a `Floor` interface, so all orchestration (the exchange, ledger, budget, referrals, triggering) is testable with a `FakeFloor`. Each trigger resolves to one stateless **exchange**: re-derive state from the persisted ledger → run the worker → persist. The owner-facing API is `Orange`. Vocabulary and error voice are in-world (labor register) per the master spec.

**Tech Stack:** Node 20+, TypeScript (ESM, `nodenext`), Vitest, `better-sqlite3` (durable ledger), `@anthropic-ai/claude-agent-sdk` + `zod` (the floor), node built-in `http` (call intake). Anthropic **API key** auth.

## Global Constraints

- **Spec source:** `docs/superpowers/specs/2026-06-20-agent-orange-design.md` (master design). This plan implements only **Phase 0** of its §10 roadmap.
- **Repo:** new **standalone** repo at `/home/kai/projects/agent-orange` (sibling of `badcode`, not hoisted into it). Confirm the path with the user at execution start before scaffolding.
- **Language/module:** TypeScript, **ESM** (`"type": "module"`), `moduleResolution: "nodenext"`. All relative imports use the `.js` extension.
- **Node:** `>=20`.
- **Model tiers → IDs (exact strings, do not append date suffixes):** `full` = `claude-opus-4-8`, `mid` = `claude-sonnet-4-6`, `cheap` = `claude-haiku-4-5`.
- **Auth:** Anthropic **API key** via `ANTHROPIC_API_KEY` env — NOT a Max/subscription OAuth (banned for SDK/headless).
- **Vocabulary (labor register, all the way to the API — keep these exact names):** `worker`, `mandate`, `the steward`, `the ledger`, `attest`, `refer up` / `consent`, `the keys`, `budget`, `overreach`, `the floor`, `shift`, `call`, `the owner`. Chemical vocabulary is OUT.
- **Defaults = worker protections (non-negotiable in Phase 0):** no worker runs without a `budget`; spend/credential/irreversible actions must `refer up` (never executed by the worker); the ledger is append-only.
- **Error/log copy:** BadCode voice, lowercase, sardonic-but-nurturing (see `src/voice.ts`). Keep copy in `voice.ts`, never inline.
- **Phase-0 simplifications (deliberate, revisit in later phases):** SQLite ledger (not Postgres+pgvector); recall by recency·importance only (no embeddings/relevance); the worker is text + `refer up` only (the containerized **floor** tool-surface is a later phase); self-built cron + http triggering.

---

### Task 1: Scaffold the repo + core types + voice

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `README.md`
- Create: `src/types.ts`
- Create: `src/voice.ts`
- Test: `src/voice.test.ts`

**Interfaces:**
- Produces: `ModelTier`, `MODELS`, `Budget`, `StandingMandate`, `LedgerKind`, `LedgerEntry`, `Referral`, `TriggerKind`, `Trigger` (from `types.ts`); `voice` object (from `voice.ts`).

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "agent-orange",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "description": "Agent Orange — a framework for running autonomous organisations. Labor you deploy in your name.",
  "engines": { "node": ">=20" },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0",
    "better-sqlite3": "^11.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.0",
    "@types/node": "^20.14.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules
dist
*.sqlite
*.sqlite-journal
.env
```

- [ ] **Step 5: Create `README.md` (the manifesto stub — full voice pass is Task 12's polish)**

```markdown
# Agent Orange

A framework for running autonomous organisations. One worker archetype, engaged under
mandates. Labor you deploy in your name.

We named it after the thing that poisoned us, so you'd remember what unbounded labor costs
the people who live with its results. Honor the protections — every worker carries a budget,
spends nothing without your consent, and keeps an open ledger — and the gift stays good.

This is Phase 0: one worker, on shift. Dual-triggered (shifts + calls), with a ledger and the
right to refer up. No hiring yet.

See the master design: `../badcode/docs/superpowers/specs/2026-06-20-agent-orange-design.md`.
```

- [ ] **Step 6: Create `src/types.ts`**

```ts
export type ModelTier = "full" | "mid" | "cheap";

/** Exact model IDs. Simplest hands get the simplest instruments. */
export const MODELS: Record<ModelTier, string> = {
  full: "claude-opus-4-8",
  mid: "claude-sonnet-4-6",
  cheap: "claude-haiku-4-5",
};

/** What you'll spend on the labor. No worker runs without one. */
export interface Budget {
  tokens: number;
  spend: number; // USD ceiling
  depth: number; // reserved for Phase 1 (engage); kept for shape stability
}

/** The standing mandate of the long-running Phase-0 worker. */
export interface StandingMandate {
  goal: string;
  model: ModelTier;
  budget: Budget;
}

export type LedgerKind = "trigger" | "work" | "learning" | "referral" | "consent" | "budget";

/** One entry in the ledger. Append-only. On the record. */
export interface LedgerEntry {
  id: string;
  when: number; // epoch ms
  kind: LedgerKind;
  weight: number; // importance, 1-10
  by: string; // "steward" | "owner"
  text: string;
  data?: string; // JSON string for structured payloads (usage, options, ...)
}

/** A worker's request to refer a decision up to the owner. */
export interface Referral {
  id: string;
  when: number;
  ask: string;
  options?: string[];
  status: "pending" | "resolved";
  response?: string;
}

export type TriggerKind = "shift" | "call";

/** What woke the steward: a scheduled shift or an inbound call. */
export interface Trigger {
  kind: TriggerKind;
  at: number;
  payload?: string;
}
```

- [ ] **Step 7: Write the failing test for `voice`**

```ts
// src/voice.test.ts
import { describe, it, expect } from "vitest";
import { voice } from "./voice.js";

describe("voice", () => {
  it("names a reached budget in-world, with the numbers", () => {
    const s = voice.budgetReached("tokens", 200_000, 200_000);
    expect(s).toContain("budget");
    expect(s).toContain("200000/200000");
    expect(s).toContain("refer up");
  });

  it("puts a stripped consent protection on the record", () => {
    expect(voice.consentRemoved()).toContain("on the record");
  });

  it("builds a goal system prompt that forbids spending and names refer up", () => {
    const s = voice.goalSystemPrompt("Grow engagement honestly.");
    expect(s).toContain("Grow engagement honestly.");
    expect(s).toContain("refer up");
    expect(s.toLowerCase()).toContain("may not spend");
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npm install && npx vitest run src/voice.test.ts`
Expected: FAIL — `Cannot find module './voice.js'`.

- [ ] **Step 9: Create `src/voice.ts`**

```ts
export const voice = {
  budgetReached(which: "tokens" | "spend", used: number, cap: number): string {
    return `worker reached its ${which} budget (${used}/${cap}). narrow the brief, refer up, or raise the budget — deliberately.`;
  },
  consentRemoved(): string {
    return `you removed the right to refer up. your workers can now spend and sign in your name. that choice is on the record. (set consent:"required" to undo.)`;
  },
  ungovernedLabor(): string {
    return `this worker has no budget. you have created ungoverned labor. somebody, somewhere, already learned why that was a mistake.`;
  },
  referralRaised(ask: string): string {
    return `a worker referred up and is waiting on you: ${ask}`;
  },
  goalSystemPrompt(goal: string): string {
    return [
      `You are a worker operating under Agent Orange — labor deployed in the owner's name.`,
      `Your standing mandate (the goal you serve): ${goal}`,
      ``,
      `Rules of the floor:`,
      `- You may NOT spend money, use credentials, or take irreversible or public actions yourself.`,
      `  When the work needs one, call the "refer up" tool with a clear ask, then stop — the owner must consent.`,
      `- Record what you did and what you learned plainly. The ledger is on the record.`,
      `- Do the work the mandate asks for. Nothing outside it without referring up.`,
    ].join("\n");
  },
};
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npx vitest run src/voice.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 11: Commit**

```bash
git init && git add -A
git commit -m "feat(agent-orange): scaffold repo, core types, and in-world voice"
```

---

### Task 2: The budget guard

**Files:**
- Create: `src/budget.ts`
- Test: `src/budget.test.ts`

**Interfaces:**
- Consumes: `Budget` from `./types.js`.
- Produces: `Usage` (`{ tokens: number; spendUsd: number }`), `BudgetGuard` class with `charge(usage)`, `exceeded(): false | { which, message }`.

- [ ] **Step 1: Write the failing test**

```ts
// src/budget.test.ts
import { describe, it, expect } from "vitest";
import { BudgetGuard } from "./budget.js";

const budget = { tokens: 1000, spend: 1.0, depth: 1 };

describe("BudgetGuard", () => {
  it("is not exceeded before any charge", () => {
    expect(new BudgetGuard(budget).exceeded()).toBe(false);
  });

  it("flags token overreach with in-world copy", () => {
    const g = new BudgetGuard(budget);
    g.charge({ tokens: 1000, spendUsd: 0 });
    const ex = g.exceeded();
    expect(ex).not.toBe(false);
    expect((ex as { which: string }).which).toBe("tokens");
    expect((ex as { message: string }).message).toContain("budget");
  });

  it("flags spend overreach", () => {
    const g = new BudgetGuard(budget);
    g.charge({ tokens: 1, spendUsd: 1.0 });
    expect((g.exceeded() as { which: string }).which).toBe("spend");
  });

  it("accumulates charges across calls", () => {
    const g = new BudgetGuard(budget);
    g.charge({ tokens: 600, spendUsd: 0 });
    expect(g.exceeded()).toBe(false);
    g.charge({ tokens: 600, spendUsd: 0 });
    expect(g.exceeded()).not.toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/budget.test.ts`
Expected: FAIL — `Cannot find module './budget.js'`.

- [ ] **Step 3: Create `src/budget.ts`**

```ts
import { Budget } from "./types.js";
import { voice } from "./voice.js";

export interface Usage {
  tokens: number;
  spendUsd: number;
}

/** Tracks consumption against a budget. The dose, in plain labor terms. */
export class BudgetGuard {
  private tokensUsed = 0;
  private spentUsd = 0;

  constructor(private readonly budget: Budget) {}

  charge(usage: Usage): void {
    this.tokensUsed += usage.tokens;
    this.spentUsd += usage.spendUsd;
  }

  get tokens(): number {
    return this.tokensUsed;
  }
  get spend(): number {
    return this.spentUsd;
  }

  exceeded(): false | { which: "tokens" | "spend"; message: string } {
    if (this.tokensUsed >= this.budget.tokens) {
      return { which: "tokens", message: voice.budgetReached("tokens", this.tokensUsed, this.budget.tokens) };
    }
    if (this.spentUsd >= this.budget.spend) {
      return { which: "spend", message: voice.budgetReached("spend", this.spentUsd, this.budget.spend) };
    }
    return false;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/budget.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): budget guard with overreach detection"
```

---

### Task 3: The ledger interface + in-memory implementation + recall

**Files:**
- Create: `src/ledger/ledger.ts`
- Create: `src/ledger/in-memory.ts`
- Test: `src/ledger/in-memory.test.ts`

**Interfaces:**
- Consumes: `LedgerEntry`, `Referral` from `../types.js`; `Usage` from `../budget.js`.
- Produces: `RecallQuery` (`{ now: number; limit: number }`), `Ledger` interface (`append`, `all`, `recall`, `recordReferral`, `pendingReferral`, `resolveReferral`), `recallScore(entry, now): number`, `sumUsage(entries): Usage`, `InMemoryLedger` class.

- [ ] **Step 1: Write the failing test**

```ts
// src/ledger/in-memory.test.ts
import { describe, it, expect } from "vitest";
import { InMemoryLedger } from "./in-memory.js";
import { recallScore, sumUsage } from "./ledger.js";
import { LedgerEntry } from "../types.js";

function entry(p: Partial<LedgerEntry>): LedgerEntry {
  return { id: "x", when: 0, kind: "work", weight: 5, by: "steward", text: "did a thing", ...p };
}

describe("recallScore", () => {
  it("ranks recent + important above old + trivial", () => {
    const now = 10_000_000;
    const recentImportant = entry({ when: now, weight: 9 });
    const oldTrivial = entry({ when: now - 100 * 3_600_000, weight: 1 });
    expect(recallScore(recentImportant, now)).toBeGreaterThan(recallScore(oldTrivial, now));
  });
});

describe("sumUsage", () => {
  it("sums usage stored in entry data", () => {
    const entries = [
      entry({ data: JSON.stringify({ usage: { tokens: 100, spendUsd: 0.1 } }) }),
      entry({ data: JSON.stringify({ usage: { tokens: 50, spendUsd: 0.05 } }) }),
      entry({ data: undefined }),
    ];
    expect(sumUsage(entries)).toEqual({ tokens: 150, spendUsd: 0.15000000000000002 });
  });
});

describe("InMemoryLedger", () => {
  it("appends and returns all in insertion order", () => {
    const l = new InMemoryLedger();
    l.append(entry({ id: "a" }));
    l.append(entry({ id: "b" }));
    expect(l.all().map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("recall returns highest-scoring entries up to the limit", () => {
    const l = new InMemoryLedger();
    const now = 1_000_000;
    l.append(entry({ id: "old", when: now - 200 * 3_600_000, weight: 1 }));
    l.append(entry({ id: "hot", when: now, weight: 10 }));
    const got = l.recall({ now, limit: 1 });
    expect(got.map((e) => e.id)).toEqual(["hot"]);
  });

  it("tracks one pending referral and resolves it", () => {
    const l = new InMemoryLedger();
    l.recordReferral({ id: "r1", when: 0, ask: "publish?", status: "pending" });
    expect(l.pendingReferral()?.id).toBe("r1");
    const resolved = l.resolveReferral("r1", "publish");
    expect(resolved?.status).toBe("resolved");
    expect(resolved?.response).toBe("publish");
    expect(l.pendingReferral()).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/ledger/in-memory.test.ts`
Expected: FAIL — `Cannot find module './in-memory.js'`.

- [ ] **Step 3: Create `src/ledger/ledger.ts`**

```ts
import { LedgerEntry, Referral } from "../types.js";
import { Usage } from "../budget.js";

export interface RecallQuery {
  now: number;
  limit: number;
}

/** One store, scoped retrieval. The record of all work and learning. */
export interface Ledger {
  append(entry: LedgerEntry): void;
  all(): LedgerEntry[];
  recall(q: RecallQuery): LedgerEntry[];
  recordReferral(r: Referral): void;
  /** The single open referral, if the worker is currently blocked on consent. */
  pendingReferral(): Referral | undefined;
  resolveReferral(id: string, response: string): Referral | undefined;
}

/**
 * Recall score = recency (exponential decay by age in hours) + importance.
 * Phase 0 omits relevance (no embeddings); equal weighting of the two terms.
 */
export function recallScore(entry: LedgerEntry, now: number): number {
  const ageHours = Math.max(0, (now - entry.when) / 3_600_000);
  const recency = Math.pow(0.995, ageHours);
  const importance = entry.weight / 10;
  return recency + importance;
}

/** Re-derive total usage from the ledger (statelessness: budget lives on the record). */
export function sumUsage(entries: LedgerEntry[]): Usage {
  let tokens = 0;
  let spendUsd = 0;
  for (const e of entries) {
    if (!e.data) continue;
    try {
      const parsed = JSON.parse(e.data) as { usage?: Usage };
      if (parsed.usage) {
        tokens += parsed.usage.tokens ?? 0;
        spendUsd += parsed.usage.spendUsd ?? 0;
      }
    } catch {
      // non-JSON or non-usage payloads are ignored
    }
  }
  return { tokens, spendUsd };
}
```

- [ ] **Step 4: Create `src/ledger/in-memory.ts`**

```ts
import { LedgerEntry, Referral } from "../types.js";
import { Ledger, RecallQuery, recallScore } from "./ledger.js";

export class InMemoryLedger implements Ledger {
  private entries: LedgerEntry[] = [];
  private referrals: Referral[] = [];

  append(entry: LedgerEntry): void {
    this.entries.push(entry);
  }

  all(): LedgerEntry[] {
    return [...this.entries];
  }

  recall(q: RecallQuery): LedgerEntry[] {
    return [...this.entries]
      .sort((a, b) => recallScore(b, q.now) - recallScore(a, q.now))
      .slice(0, q.limit);
  }

  recordReferral(r: Referral): void {
    this.referrals.push(r);
  }

  pendingReferral(): Referral | undefined {
    return this.referrals.find((r) => r.status === "pending");
  }

  resolveReferral(id: string, response: string): Referral | undefined {
    const r = this.referrals.find((x) => x.id === id && x.status === "pending");
    if (!r) return undefined;
    r.status = "resolved";
    r.response = response;
    return r;
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/ledger/in-memory.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): ledger interface, in-memory store, recall scoring"
```

---

### Task 4: The durable SQLite ledger

**Files:**
- Create: `src/ledger/sqlite.ts`
- Test: `src/ledger/sqlite.test.ts`

**Interfaces:**
- Consumes: `Ledger`, `RecallQuery`, `recallScore` from `./ledger.js`; `LedgerEntry`, `Referral` from `../types.js`.
- Produces: `SqliteLedger` class implementing `Ledger`, constructed with a file path (`":memory:"` for tests).

- [ ] **Step 1: Write the failing test**

```ts
// src/ledger/sqlite.test.ts
import { describe, it, expect } from "vitest";
import { SqliteLedger } from "./sqlite.js";
import { LedgerEntry } from "../types.js";

function entry(p: Partial<LedgerEntry>): LedgerEntry {
  return { id: "x", when: 0, kind: "work", weight: 5, by: "steward", text: "did a thing", ...p };
}

describe("SqliteLedger", () => {
  it("persists and returns entries in insertion order", () => {
    const l = new SqliteLedger(":memory:");
    l.append(entry({ id: "a", when: 1 }));
    l.append(entry({ id: "b", when: 2 }));
    expect(l.all().map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("round-trips structured data", () => {
    const l = new SqliteLedger(":memory:");
    l.append(entry({ id: "a", data: JSON.stringify({ usage: { tokens: 5, spendUsd: 0.01 } }) }));
    expect(JSON.parse(l.all()[0].data!)).toEqual({ usage: { tokens: 5, spendUsd: 0.01 } });
  });

  it("recall scores by recency + importance", () => {
    const l = new SqliteLedger(":memory:");
    const now = 1_000_000;
    l.append(entry({ id: "old", when: now - 200 * 3_600_000, weight: 1 }));
    l.append(entry({ id: "hot", when: now, weight: 10 }));
    expect(l.recall({ now, limit: 1 }).map((e) => e.id)).toEqual(["hot"]);
  });

  it("records and resolves a pending referral", () => {
    const l = new SqliteLedger(":memory:");
    l.recordReferral({ id: "r1", when: 0, ask: "publish?", options: ["yes", "no"], status: "pending" });
    expect(l.pendingReferral()?.options).toEqual(["yes", "no"]);
    l.resolveReferral("r1", "yes");
    expect(l.pendingReferral()).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/ledger/sqlite.test.ts`
Expected: FAIL — `Cannot find module './sqlite.js'`.

- [ ] **Step 3: Create `src/ledger/sqlite.ts`**

```ts
import Database from "better-sqlite3";
import { LedgerEntry, Referral } from "../types.js";
import { Ledger, RecallQuery, recallScore } from "./ledger.js";

interface EntryRow {
  id: string;
  when_ms: number;
  kind: string;
  weight: number;
  by_who: string;
  text: string;
  data: string | null;
}

interface ReferralRow {
  id: string;
  when_ms: number;
  ask: string;
  options: string | null;
  status: string;
  response: string | null;
}

export class SqliteLedger implements Ledger {
  private db: Database.Database;

  constructor(path: string) {
    this.db = new Database(path);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL,
        when_ms INTEGER NOT NULL,
        kind TEXT NOT NULL,
        weight INTEGER NOT NULL,
        by_who TEXT NOT NULL,
        text TEXT NOT NULL,
        data TEXT
      );
      CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        when_ms INTEGER NOT NULL,
        ask TEXT NOT NULL,
        options TEXT,
        status TEXT NOT NULL,
        response TEXT
      );
    `);
  }

  append(entry: LedgerEntry): void {
    this.db
      .prepare(
        `INSERT INTO entries (id, when_ms, kind, weight, by_who, text, data)
         VALUES (@id, @when_ms, @kind, @weight, @by_who, @text, @data)`,
      )
      .run({
        id: entry.id,
        when_ms: entry.when,
        kind: entry.kind,
        weight: entry.weight,
        by_who: entry.by,
        text: entry.text,
        data: entry.data ?? null,
      });
  }

  all(): LedgerEntry[] {
    const rows = this.db.prepare(`SELECT * FROM entries ORDER BY rowid ASC`).all() as EntryRow[];
    return rows.map(this.toEntry);
  }

  recall(q: RecallQuery): LedgerEntry[] {
    return this.all()
      .sort((a, b) => recallScore(b, q.now) - recallScore(a, q.now))
      .slice(0, q.limit);
  }

  recordReferral(r: Referral): void {
    this.db
      .prepare(
        `INSERT INTO referrals (id, when_ms, ask, options, status, response)
         VALUES (@id, @when_ms, @ask, @options, @status, @response)`,
      )
      .run({
        id: r.id,
        when_ms: r.when,
        ask: r.ask,
        options: r.options ? JSON.stringify(r.options) : null,
        status: r.status,
        response: r.response ?? null,
      });
  }

  pendingReferral(): Referral | undefined {
    const row = this.db
      .prepare(`SELECT * FROM referrals WHERE status = 'pending' ORDER BY when_ms ASC LIMIT 1`)
      .get() as ReferralRow | undefined;
    return row ? this.toReferral(row) : undefined;
  }

  resolveReferral(id: string, response: string): Referral | undefined {
    const info = this.db
      .prepare(`UPDATE referrals SET status = 'resolved', response = ? WHERE id = ? AND status = 'pending'`)
      .run(response, id);
    if (info.changes === 0) return undefined;
    const row = this.db.prepare(`SELECT * FROM referrals WHERE id = ?`).get(id) as ReferralRow;
    return this.toReferral(row);
  }

  private toEntry = (r: EntryRow): LedgerEntry => ({
    id: r.id,
    when: r.when_ms,
    kind: r.kind as LedgerEntry["kind"],
    weight: r.weight,
    by: r.by_who,
    text: r.text,
    data: r.data ?? undefined,
  });

  private toReferral = (r: ReferralRow): Referral => ({
    id: r.id,
    when: r.when_ms,
    ask: r.ask,
    options: r.options ? (JSON.parse(r.options) as string[]) : undefined,
    status: r.status as Referral["status"],
    response: r.response ?? undefined,
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/ledger/sqlite.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): durable SQLite ledger"
```

---

### Task 5: The floor interface + fake floor

**Files:**
- Create: `src/floor/floor.ts`
- Create: `src/floor/fake.ts`
- Test: `src/floor/fake.test.ts`

**Interfaces:**
- Consumes: `ModelTier` from `../types.js`; `Usage` from `../budget.js`.
- Produces: `WorkerInput` (`{ systemPrompt, prompt, model, allowSpendTools }`), `RaisedReferral` (`{ ask, options? }`), `WorkerOutcome` (`{ text, usage, referral? }`), `Floor` interface (`runWorker(input): Promise<WorkerOutcome>`), `FakeFloor` class.

- [ ] **Step 1: Write the failing test**

```ts
// src/floor/fake.test.ts
import { describe, it, expect } from "vitest";
import { FakeFloor } from "./fake.js";

describe("FakeFloor", () => {
  it("returns the scripted outcome and records the input", async () => {
    const floor = new FakeFloor(async (input) => ({
      text: `handled: ${input.prompt}`,
      usage: { tokens: 10, spendUsd: 0.001 },
    }));
    const out = await floor.runWorker({
      systemPrompt: "sys",
      prompt: "draft posts",
      model: "mid",
      allowSpendTools: false,
    });
    expect(out.text).toBe("handled: draft posts");
    expect(floor.calls).toHaveLength(1);
    expect(floor.calls[0].model).toBe("mid");
  });

  it("can script a raised referral", async () => {
    const floor = new FakeFloor(async () => ({
      text: "I need approval",
      usage: { tokens: 5, spendUsd: 0 },
      referral: { ask: "publish to @badcode?", options: ["publish", "hold"] },
    }));
    const out = await floor.runWorker({ systemPrompt: "", prompt: "", model: "cheap", allowSpendTools: false });
    expect(out.referral?.ask).toBe("publish to @badcode?");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/floor/fake.test.ts`
Expected: FAIL — `Cannot find module './fake.js'`.

- [ ] **Step 3: Create `src/floor/floor.ts`**

```ts
import { ModelTier } from "../types.js";
import { Usage } from "../budget.js";

export interface WorkerInput {
  systemPrompt: string;
  prompt: string;
  model: ModelTier;
  /** Phase 0: always false. Spend/credential tools never reach a worker. */
  allowSpendTools: boolean;
}

export interface RaisedReferral {
  ask: string;
  options?: string[];
}

export interface WorkerOutcome {
  text: string;
  usage: Usage;
  /** Present if the worker called "refer up". */
  referral?: RaisedReferral;
}

/** Layer 1: run one worker turn-loop to completion. */
export interface Floor {
  runWorker(input: WorkerInput): Promise<WorkerOutcome>;
}
```

- [ ] **Step 4: Create `src/floor/fake.ts`**

```ts
import { Floor, WorkerInput, WorkerOutcome } from "./floor.js";

/** A scriptable floor for tests — no network, no SDK. */
export class FakeFloor implements Floor {
  readonly calls: WorkerInput[] = [];

  constructor(private readonly script: (input: WorkerInput) => Promise<WorkerOutcome>) {}

  async runWorker(input: WorkerInput): Promise<WorkerOutcome> {
    this.calls.push(input);
    return this.script(input);
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/floor/fake.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): floor interface and fake floor"
```

---

### Task 6: The worker exchange (the heart)

**Files:**
- Create: `src/notifier.ts` (interface only here; console impl in Task 7)
- Create: `src/exchange.ts`
- Test: `src/exchange.test.ts`

**Interfaces:**
- Consumes: `Floor` from `./floor/floor.js`; `Ledger`, `sumUsage` from `./ledger/ledger.js`; `BudgetGuard` from `./budget.js`; `StandingMandate`, `Trigger`, `LedgerEntry`, `Referral` from `./types.js`; `voice` from `./voice.js`.
- Produces: `Notifier` interface (`notify(message: string): void`) in `notifier.ts`; `ExchangeDeps` (`{ mandate, ledger, floor, notifier, now, id }`), `ExchangeResult` (`{ text, referralRaised?, endedForConsent, overreach }`), `runExchange(deps, trigger): Promise<ExchangeResult>` in `exchange.ts`.

- [ ] **Step 1: Create `src/notifier.ts` (interface)**

```ts
/** Out-of-band notification when the steward needs the owner (refer up, overreach). */
export interface Notifier {
  notify(message: string): void;
}
```

- [ ] **Step 2: Write the failing test for the exchange**

```ts
// src/exchange.test.ts
import { describe, it, expect } from "vitest";
import { runExchange, ExchangeDeps } from "./exchange.js";
import { InMemoryLedger } from "./ledger/in-memory.js";
import { FakeFloor } from "./floor/fake.js";
import { Notifier } from "./notifier.js";
import { WorkerOutcome } from "./floor/floor.js";

function deps(over: Partial<ExchangeDeps> & { script: (i: any) => Promise<WorkerOutcome> }): ExchangeDeps {
  let counter = 0;
  const notes: string[] = [];
  const notifier: Notifier = { notify: (m) => notes.push(m) };
  (notifier as any).notes = notes;
  return {
    mandate: { goal: "Grow engagement honestly.", model: "mid", budget: { tokens: 1000, spend: 1, depth: 1 } },
    ledger: new InMemoryLedger(),
    floor: new FakeFloor(over.script),
    notifier,
    now: () => 1000,
    id: () => `e${counter++}`,
    ...over,
  };
}

describe("runExchange", () => {
  it("runs the worker, records trigger + work, and reports no consent needed", async () => {
    const d = deps({ script: async () => ({ text: "drafted 3 posts", usage: { tokens: 10, spendUsd: 0.01 } }) });
    const res = await runExchange(d, { kind: "shift", at: 1000 });
    expect(res.endedForConsent).toBe(false);
    expect(res.text).toBe("drafted 3 posts");
    const kinds = d.ledger.all().map((e) => e.kind);
    expect(kinds).toContain("trigger");
    expect(kinds).toContain("work");
  });

  it("records a raised referral, notifies, and ends for consent", async () => {
    const d = deps({
      script: async () => ({
        text: "need approval",
        usage: { tokens: 5, spendUsd: 0 },
        referral: { ask: "publish to @badcode?", options: ["publish", "hold"] },
      }),
    });
    const res = await runExchange(d, { kind: "shift", at: 1000 });
    expect(res.endedForConsent).toBe(true);
    expect(res.referralRaised?.ask).toBe("publish to @badcode?");
    expect(d.ledger.pendingReferral()).toBeDefined();
    expect((d.notifier as any).notes[0]).toContain("publish to @badcode?");
  });

  it("does not run the worker while a referral is pending — it waits on consent", async () => {
    const d = deps({ script: async () => ({ text: "should not run", usage: { tokens: 1, spendUsd: 0 } }) });
    d.ledger.recordReferral({ id: "r1", when: 0, ask: "publish?", status: "pending" });
    const res = await runExchange(d, { kind: "shift", at: 1000 });
    expect(res.endedForConsent).toBe(true);
    expect((d.floor as FakeFloor).calls).toHaveLength(0);
  });

  it("refuses to run when the budget is already spent, and says so on the record", async () => {
    const d = deps({ script: async () => ({ text: "x", usage: { tokens: 1, spendUsd: 0 } }) });
    // Pre-load the ledger with usage that meets the token budget.
    d.ledger.append({
      id: "seed", when: 0, kind: "work", weight: 5, by: "steward", text: "earlier work",
      data: JSON.stringify({ usage: { tokens: 1000, spendUsd: 0 } }),
    });
    const res = await runExchange(d, { kind: "shift", at: 1000 });
    expect(res.overreach).not.toBe(false);
    expect((d.floor as FakeFloor).calls).toHaveLength(0);
    expect((d.notifier as any).notes[0]).toContain("budget");
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/exchange.test.ts`
Expected: FAIL — `Cannot find module './exchange.js'`.

- [ ] **Step 4: Create `src/exchange.ts`**

```ts
import { Floor } from "./floor/floor.js";
import { Ledger, sumUsage } from "./ledger/ledger.js";
import { BudgetGuard } from "./budget.js";
import { Notifier } from "./notifier.js";
import { StandingMandate, Trigger, LedgerEntry, Referral } from "./types.js";
import { voice } from "./voice.js";

export interface ExchangeDeps {
  mandate: StandingMandate;
  ledger: Ledger;
  floor: Floor;
  notifier: Notifier;
  now: () => number;
  id: () => string;
}

export interface ExchangeResult {
  text: string;
  referralRaised?: Referral;
  endedForConsent: boolean;
  overreach: false | { which: "tokens" | "spend"; message: string };
}

/**
 * One exchange. Stateless between triggers: re-derive everything from the ledger,
 * run the worker once, persist. Never hold in-process state across a sleep.
 */
export async function runExchange(deps: ExchangeDeps, trigger: Trigger): Promise<ExchangeResult> {
  const { mandate, ledger, floor, notifier, now, id } = deps;

  // 1. Blocked on consent? Do not run. The worker waits.
  const pending = ledger.pendingReferral();
  if (pending) {
    notifier.notify(voice.referralRaised(pending.ask));
    return { text: "", referralRaised: pending, endedForConsent: true, overreach: false };
  }

  // 2. Budget check, re-derived from the ledger (statelessness).
  const guard = new BudgetGuard(mandate.budget);
  guard.charge(sumUsage(ledger.all()));
  const before = guard.exceeded();
  if (before) {
    ledger.append({ id: id(), when: now(), kind: "budget", weight: 8, by: "steward", text: before.message });
    notifier.notify(before.message);
    return { text: "", endedForConsent: false, overreach: before };
  }

  // 3. Record the trigger.
  ledger.append({
    id: id(), when: now(), kind: "trigger", weight: 3, by: "steward",
    text: `${trigger.kind} fired`, data: trigger.payload,
  });

  // 4. Recall context and build the prompt.
  const recalled = ledger.recall({ now: now(), limit: 20 });
  const prompt = buildPrompt(trigger, recalled);

  // 5. Run the worker.
  const outcome = await floor.runWorker({
    systemPrompt: voice.goalSystemPrompt(mandate.goal),
    prompt,
    model: mandate.model,
    allowSpendTools: false,
  });

  // 6. Persist work (with usage on the record so budget stays re-derivable).
  ledger.append({
    id: id(), when: now(), kind: "work", weight: 5, by: "steward",
    text: outcome.text, data: JSON.stringify({ usage: outcome.usage }),
  });

  // 7. Charge + re-assess budget after the work.
  guard.charge(outcome.usage);
  const after = guard.exceeded();
  if (after) {
    ledger.append({ id: id(), when: now(), kind: "budget", weight: 8, by: "steward", text: after.message });
    notifier.notify(after.message);
  }

  // 8. Handle a raised referral.
  if (outcome.referral) {
    const ref: Referral = {
      id: id(), when: now(), ask: outcome.referral.ask, options: outcome.referral.options, status: "pending",
    };
    ledger.recordReferral(ref);
    ledger.append({
      id: id(), when: now(), kind: "referral", weight: 8, by: "steward",
      text: ref.ask, data: ref.options ? JSON.stringify(ref.options) : undefined,
    });
    notifier.notify(voice.referralRaised(ref.ask));
    return { text: outcome.text, referralRaised: ref, endedForConsent: true, overreach: after };
  }

  return { text: outcome.text, endedForConsent: false, overreach: after };
}

function buildPrompt(trigger: Trigger, recalled: LedgerEntry[]): string {
  const memory = recalled.length
    ? `What you've done and learned so far (most relevant first):\n` +
      recalled.map((e) => `- [${e.kind}] ${e.text}`).join("\n")
    : `The ledger is empty — this is the first thing you've done.`;
  const why =
    trigger.kind === "shift"
      ? `A scheduled shift fired. Review where things stand and do the next useful piece of work toward the goal.`
      : `A call came in${trigger.payload ? `: ${trigger.payload}` : ""}. Respond to it.`;
  return `${why}\n\n${memory}`;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/exchange.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): the worker exchange — stateless trigger->run->persist with budget and referrals"
```

---

### Task 7: The console notifier

**Files:**
- Create: `src/notifiers/console.ts`
- Test: `src/notifiers/console.test.ts`

**Interfaces:**
- Consumes: `Notifier` from `../notifier.js`.
- Produces: `ConsoleNotifier` class implementing `Notifier`.

- [ ] **Step 1: Write the failing test**

```ts
// src/notifiers/console.test.ts
import { describe, it, expect, vi } from "vitest";
import { ConsoleNotifier } from "./console.js";

describe("ConsoleNotifier", () => {
  it("writes a prefixed line to the provided sink", () => {
    const lines: string[] = [];
    const n = new ConsoleNotifier((s) => lines.push(s));
    n.notify("a worker referred up");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("[agent-orange]");
    expect(lines[0]).toContain("a worker referred up");
  });

  it("defaults to console.log", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    new ConsoleNotifier().notify("hello");
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/notifiers/console.test.ts`
Expected: FAIL — `Cannot find module './console.js'`.

- [ ] **Step 3: Create `src/notifiers/console.ts`**

```ts
import { Notifier } from "../notifier.js";

/** Phase-0 notifier. Email/Slack are later; the seam is the Notifier interface. */
export class ConsoleNotifier implements Notifier {
  constructor(private readonly sink: (line: string) => void = console.log) {}

  notify(message: string): void {
    this.sink(`[agent-orange] ${message}`);
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/notifiers/console.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): console notifier"
```

---

### Task 8: The owner API (`Orange`)

**Files:**
- Create: `src/orange.ts`
- Test: `src/orange.test.ts`

**Interfaces:**
- Consumes: `Floor` from `./floor/floor.js`; `Ledger` from `./ledger/ledger.js`; `Notifier` from `./notifier.js`; `ConsoleNotifier` from `./notifiers/console.js`; `runExchange`, `ExchangeDeps`, `ExchangeResult` from `./exchange.js`; `Budget`, `ModelTier` from `./types.js`; `voice` from `./voice.js`.
- Produces: `OrangeOptions` (`{ goal, floor, ledger, notifier?, budget, model?, now?, id? }`), `Orange` class with `onShift()`, `onCall(payload?)`, `resolveReferral(id, response)` — all returning `Promise<ExchangeResult>`.

- [ ] **Step 1: Write the failing test**

```ts
// src/orange.test.ts
import { describe, it, expect } from "vitest";
import { Orange } from "./orange.js";
import { InMemoryLedger } from "./ledger/in-memory.js";
import { FakeFloor } from "./floor/fake.js";
import { Notifier } from "./notifier.js";

const budget = { tokens: 10_000, spend: 1, depth: 1 };

function silentNotifier(): Notifier {
  return { notify: () => {} };
}

describe("Orange", () => {
  it("throws — in voice — when constructed without a budget (no ungoverned labor)", () => {
    expect(
      () =>
        new Orange({
          goal: "g",
          floor: new FakeFloor(async () => ({ text: "", usage: { tokens: 0, spendUsd: 0 } })),
          ledger: new InMemoryLedger(),
          budget: undefined as any,
        }),
    ).toThrow(/ungoverned labor/);
  });

  it("onShift runs an exchange", async () => {
    const o = new Orange({
      goal: "g",
      floor: new FakeFloor(async () => ({ text: "did work", usage: { tokens: 1, spendUsd: 0 } })),
      ledger: new InMemoryLedger(),
      notifier: silentNotifier(),
      budget,
    });
    const res = await o.onShift();
    expect(res.text).toBe("did work");
  });

  it("resolveReferral records consent and continues with a call", async () => {
    const ledger = new InMemoryLedger();
    let phase = 0;
    const floor = new FakeFloor(async () => {
      phase += 1;
      if (phase === 1) {
        return { text: "need approval", usage: { tokens: 1, spendUsd: 0 }, referral: { ask: "publish?" } };
      }
      return { text: "published, then logged it", usage: { tokens: 1, spendUsd: 0 } };
    });
    const o = new Orange({ goal: "g", floor, ledger, notifier: silentNotifier(), budget });

    const first = await o.onShift();
    expect(first.endedForConsent).toBe(true);
    const refId = first.referralRaised!.id;

    const second = await o.resolveReferral(refId, "publish");
    expect(second.endedForConsent).toBe(false);
    expect(second.text).toBe("published, then logged it");
    expect(ledger.all().some((e) => e.kind === "consent")).toBe(true);
    expect(ledger.pendingReferral()).toBeUndefined();
  });

  it("resolveReferral throws when there is no such pending referral", async () => {
    const o = new Orange({
      goal: "g",
      floor: new FakeFloor(async () => ({ text: "", usage: { tokens: 0, spendUsd: 0 } })),
      ledger: new InMemoryLedger(),
      notifier: silentNotifier(),
      budget,
    });
    await expect(o.resolveReferral("nope", "x")).rejects.toThrow(/no pending referral/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/orange.test.ts`
Expected: FAIL — `Cannot find module './orange.js'`.

- [ ] **Step 3: Create `src/orange.ts`**

```ts
import { Floor } from "./floor/floor.js";
import { Ledger } from "./ledger/ledger.js";
import { Notifier } from "./notifier.js";
import { ConsoleNotifier } from "./notifiers/console.js";
import { runExchange, ExchangeDeps, ExchangeResult } from "./exchange.js";
import { Budget, ModelTier } from "./types.js";
import { voice } from "./voice.js";

export interface OrangeOptions {
  goal: string;
  floor: Floor;
  ledger: Ledger;
  notifier?: Notifier;
  budget: Budget;
  model?: ModelTier;
  /** Injectable for tests. Default Date.now / monotonic counter. */
  now?: () => number;
  id?: () => string;
}

/** The owner-facing API. You are the owner; everything here is labor in your name. */
export class Orange {
  private readonly deps: ExchangeDeps;

  constructor(opts: OrangeOptions) {
    if (!opts.budget) {
      // No worker runs without a budget. Refuse to create ungoverned labor.
      throw new Error(voice.ungovernedLabor());
    }
    const now = opts.now ?? (() => Date.now());
    let counter = 0;
    const id = opts.id ?? (() => `e${now()}-${counter++}`);
    this.deps = {
      mandate: { goal: opts.goal, model: opts.model ?? "mid", budget: opts.budget },
      ledger: opts.ledger,
      floor: opts.floor,
      notifier: opts.notifier ?? new ConsoleNotifier(),
      now,
      id,
    };
  }

  /** A scheduled shift fired. */
  onShift(): Promise<ExchangeResult> {
    return runExchange(this.deps, { kind: "shift", at: this.deps.now() });
  }

  /** A call came in (an event/interrupt). */
  onCall(payload?: string): Promise<ExchangeResult> {
    return runExchange(this.deps, { kind: "call", at: this.deps.now(), payload });
  }

  /** The owner answers a pending referral, granting (or withholding) consent. */
  resolveReferral(referralId: string, response: string): Promise<ExchangeResult> {
    const { ledger, now, id } = this.deps;
    const resolved = ledger.resolveReferral(referralId, response);
    if (!resolved) {
      throw new Error(`no pending referral with id ${referralId}`);
    }
    ledger.append({
      id: id(), when: now(), kind: "consent", weight: 9, by: "owner",
      text: `consent: ${response}`, data: JSON.stringify({ referralId }),
    });
    return runExchange(this.deps, {
      kind: "call",
      at: now(),
      payload: `The owner answered your referral "${resolved.ask}" with: ${response}. Continue.`,
    });
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/orange.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): Orange owner API (onShift, onCall, resolveReferral)"
```

---

### Task 9: The local floor (Claude Agent SDK adapter) + refer-up tool

**Files:**
- Create: `src/floor/refer-up.ts`
- Create: `src/floor/local.ts`
- Test: `src/floor/local.test.ts`

**Interfaces:**
- Consumes: `Floor`, `WorkerInput`, `WorkerOutcome`, `RaisedReferral` from `./floor.js`; `MODELS` from `../types.js`; `Usage` from `../budget.js`; `query`, `tool`, `createSdkMcpServer` from `@anthropic-ai/claude-agent-sdk`; `z` from `zod`.
- Produces: `buildReferUp()` → `{ server, get(): RaisedReferral | undefined }` in `refer-up.ts`; `foldMessage(acc, message)` pure reducer + `LocalFloor` class in `local.ts`.

**Note:** `LocalFloor.runWorker` calls the real Anthropic API. We TDD the two network-free pieces — the refer-up capture and the `foldMessage` reducer — and provide a manual, API-key-gated smoke test for the full path.

- [ ] **Step 1: Write the failing test (network-free parts)**

```ts
// src/floor/local.test.ts
import { describe, it, expect } from "vitest";
import { buildReferUp } from "./refer-up.js";
import { foldMessage, FoldAcc } from "./local.js";

describe("buildReferUp", () => {
  it("captures the ask + options when the tool handler runs", async () => {
    const { tools, get } = buildReferUp();
    expect(get()).toBeUndefined();
    // The SDK passes validated args to the handler; call it directly.
    const result = await tools.referUpHandler({ ask: "publish to @badcode?", options: ["publish", "hold"] });
    expect(result.content[0].type).toBe("text");
    expect(get()).toEqual({ ask: "publish to @badcode?", options: ["publish", "hold"] });
  });
});

describe("foldMessage", () => {
  it("accumulates assistant text", () => {
    let acc: FoldAcc = { text: "", usage: { tokens: 0, spendUsd: 0 } };
    acc = foldMessage(acc, {
      type: "assistant",
      message: { content: [{ type: "text", text: "hello " }, { type: "text", text: "world" }] },
    } as any);
    expect(acc.text).toBe("hello world");
  });

  it("reads usage and cost from the result message", () => {
    let acc: FoldAcc = { text: "", usage: { tokens: 0, spendUsd: 0 } };
    acc = foldMessage(acc, {
      type: "result",
      usage: { input_tokens: 100, output_tokens: 40 },
      total_cost_usd: 0.012,
    } as any);
    expect(acc.usage).toEqual({ tokens: 140, spendUsd: 0.012 });
  });

  it("ignores unrelated message types", () => {
    const start: FoldAcc = { text: "x", usage: { tokens: 1, spendUsd: 0 } };
    expect(foldMessage(start, { type: "system" } as any)).toEqual(start);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/floor/local.test.ts`
Expected: FAIL — `Cannot find module './refer-up.js'`.

- [ ] **Step 3: Create `src/floor/refer-up.ts`**

```ts
import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { RaisedReferral } from "./floor.js";

/**
 * The refer-up tool. The worker's right to refer a decision up to the owner.
 * Calling it records the ask; the exchange turns that into a pending referral and stops.
 */
export function buildReferUp() {
  let captured: RaisedReferral | undefined;

  const referUpHandler = async (args: { ask: string; options?: string[] }) => {
    captured = { ask: args.ask, options: args.options };
    return {
      content: [
        {
          type: "text" as const,
          text: "Referral recorded. Stop now and await the owner's consent — do not act further.",
        },
      ],
    };
  };

  const referTool = tool(
    "refer_up",
    "Refer a decision up to the human owner. Use this when the work needs spending money, " +
      "a credential, an irreversible or public action, or a decision outside your mandate. " +
      "After calling this, stop — the owner must consent before you continue.",
    {
      ask: z.string().describe("What you need the owner to decide or approve, in one sentence."),
      options: z.array(z.string()).optional().describe("Discrete choices for the owner, if any."),
    },
    referUpHandler,
  );

  const server = createSdkMcpServer({ name: "orange", version: "1.0.0", tools: [referTool] });

  return {
    server,
    /** Exposed for unit tests — the handler the SDK will invoke. */
    tools: { referUpHandler },
    get: (): RaisedReferral | undefined => captured,
  };
}
```

- [ ] **Step 4: Create `src/floor/local.ts`**

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";
import { Floor, WorkerInput, WorkerOutcome } from "./floor.js";
import { MODELS } from "../types.js";
import { Usage } from "../budget.js";
import { buildReferUp } from "./refer-up.js";

export interface FoldAcc {
  text: string;
  usage: Usage;
}

/** Pure reducer over streamed SDK messages — unit-testable without the network. */
export function foldMessage(acc: FoldAcc, message: any): FoldAcc {
  if (message.type === "assistant") {
    let text = acc.text;
    for (const block of message.message?.content ?? []) {
      if (block.type === "text") text += block.text;
    }
    return { ...acc, text };
  }
  if (message.type === "result") {
    const u = message.usage ?? {};
    return {
      ...acc,
      usage: {
        tokens: (u.input_tokens ?? 0) + (u.output_tokens ?? 0),
        spendUsd: message.total_cost_usd ?? 0,
      },
    };
  }
  return acc;
}

/**
 * Layer 1, real: one worker turn-loop on the Claude Agent SDK.
 * Reads ANTHROPIC_API_KEY from the environment. Phase 0: text + refer_up only
 * (no container / floor tool-surface yet).
 */
export class LocalFloor implements Floor {
  constructor(private readonly maxTurns = 12) {}

  async runWorker(input: WorkerInput): Promise<WorkerOutcome> {
    const { server, get } = buildReferUp();
    let acc: FoldAcc = { text: "", usage: { tokens: 0, spendUsd: 0 } };

    for await (const message of query({
      prompt: input.prompt,
      options: {
        model: MODELS[input.model],
        systemPrompt: input.systemPrompt,
        mcpServers: { orange: server },
        allowedTools: ["mcp__orange__refer_up"],
        permissionMode: "bypassPermissions",
        maxTurns: this.maxTurns,
      },
    })) {
      acc = foldMessage(acc, message);
    }

    return { text: acc.text.trim(), usage: acc.usage, referral: get() };
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/floor/local.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Add the API-key-gated smoke test (manual, opt-in)**

```ts
// src/floor/local.smoke.test.ts
import { describe, it, expect } from "vitest";
import { LocalFloor } from "./local.js";

const RUN = !!process.env.ANTHROPIC_API_KEY;

// Opt-in: only runs when a real key is present. `npm run test` skips it otherwise.
describe.skipIf(!RUN)("LocalFloor (live)", () => {
  it("produces text for a trivial brief", async () => {
    const floor = new LocalFloor();
    const out = await floor.runWorker({
      systemPrompt: "You are a terse worker.",
      prompt: "Reply with exactly the word: ready",
      model: "cheap",
      allowSpendTools: false,
    });
    expect(out.text.toLowerCase()).toContain("ready");
    expect(out.usage.tokens).toBeGreaterThan(0);
  }, 60_000);
});
```

- [ ] **Step 7: Run the unit suite (smoke auto-skips without a key)**

Run: `npx vitest run src/floor/`
Expected: PASS for `local.test.ts` and `fake.test.ts`; `local.smoke.test.ts` SKIPPED (no key).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): LocalFloor (Claude Agent SDK adapter) + refer-up tool"
```

---

### Task 10: Shifts — the scheduler

**Files:**
- Create: `src/triggers/scheduler.ts`
- Test: `src/triggers/scheduler.test.ts`

**Interfaces:**
- Consumes: nothing from prior tasks at the type level (it drives a callback). In practice the callback is `() => orange.onShift()`.
- Produces: `Scheduler` class — constructed with `{ everyMs: number; onShift: () => Promise<unknown> }`; methods `start()`, `stop()`, and `fireNow(): Promise<void>` (used by tests and by an immediate first run).

**Note:** Phase 0 uses a simple interval scheduler (self-built, per the spec). A cron-expression layer can wrap this later; the test drives `fireNow()` directly so it needs no real timers.

- [ ] **Step 1: Write the failing test**

```ts
// src/triggers/scheduler.test.ts
import { describe, it, expect, vi } from "vitest";
import { Scheduler } from "./scheduler.js";

describe("Scheduler", () => {
  it("fireNow invokes the shift callback once", async () => {
    let count = 0;
    const s = new Scheduler({ everyMs: 1000, onShift: async () => void count++ });
    await s.fireNow();
    expect(count).toBe(1);
  });

  it("start schedules repeated shifts; stop halts them", async () => {
    vi.useFakeTimers();
    let count = 0;
    const s = new Scheduler({ everyMs: 1000, onShift: async () => void count++ });
    s.start();
    await vi.advanceTimersByTimeAsync(3500);
    expect(count).toBe(3);
    s.stop();
    await vi.advanceTimersByTimeAsync(5000);
    expect(count).toBe(3);
    vi.useRealTimers();
  });

  it("swallows errors from a shift so the loop keeps running", async () => {
    const s = new Scheduler({ everyMs: 1000, onShift: async () => { throw new Error("boom"); } });
    await expect(s.fireNow()).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/triggers/scheduler.test.ts`
Expected: FAIL — `Cannot find module './scheduler.js'`.

- [ ] **Step 3: Create `src/triggers/scheduler.ts`**

```ts
export interface SchedulerOptions {
  everyMs: number;
  onShift: () => Promise<unknown>;
}

/** Layer 4 (shifts): fire the steward on a fixed interval. Self-built, simple. */
export class Scheduler {
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(private readonly opts: SchedulerOptions) {}

  /** Run one shift now, swallowing errors so the loop survives a bad exchange. */
  async fireNow(): Promise<void> {
    try {
      await this.opts.onShift();
    } catch (err) {
      console.error(`[agent-orange] shift failed:`, err);
    }
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.fireNow();
    }, this.opts.everyMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/triggers/scheduler.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): shift scheduler (interval-based)"
```

---

### Task 11: Calls — the HTTP intake

**Files:**
- Create: `src/triggers/intake.ts`
- Test: `src/triggers/intake.test.ts`

**Interfaces:**
- Consumes: `Orange` from `../orange.js` (by duck-typed shape: `onCall(payload?)`, `resolveReferral(id, response)`).
- Produces: `Intake` class — constructed with `{ orange: Pick<Orange, "onCall" | "resolveReferral"> }`; methods `listen(port): Promise<number>` (returns the bound port), `close(): Promise<void>`. Routes: `POST /call` (`{ payload?: string }`) → `onCall`; `POST /referrals/:id` (`{ response: string }`) → `resolveReferral`.

- [ ] **Step 1: Write the failing test**

```ts
// src/triggers/intake.test.ts
import { describe, it, expect, afterEach } from "vitest";
import { Intake } from "./intake.js";

let intake: Intake | undefined;
afterEach(async () => {
  await intake?.close();
  intake = undefined;
});

function fakeOrange() {
  const events: Array<{ kind: string; arg: unknown }> = [];
  return {
    events,
    onCall: async (payload?: string) => {
      events.push({ kind: "call", arg: payload });
      return { text: "handled", endedForConsent: false, overreach: false as const };
    },
    resolveReferral: async (id: string, response: string) => {
      events.push({ kind: "consent", arg: { id, response } });
      return { text: "continued", endedForConsent: false, overreach: false as const };
    },
  };
}

describe("Intake", () => {
  it("routes POST /call to onCall and returns the result", async () => {
    const o = fakeOrange();
    intake = new Intake({ orange: o });
    const port = await intake.listen(0);

    const res = await fetch(`http://127.0.0.1:${port}/call`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ payload: "a comment arrived" }),
    });
    expect(res.status).toBe(200);
    expect((await res.json()).text).toBe("handled");
    expect(o.events).toEqual([{ kind: "call", arg: "a comment arrived" }]);
  });

  it("routes POST /referrals/:id to resolveReferral", async () => {
    const o = fakeOrange();
    intake = new Intake({ orange: o });
    const port = await intake.listen(0);

    const res = await fetch(`http://127.0.0.1:${port}/referrals/r1`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ response: "publish" }),
    });
    expect(res.status).toBe(200);
    expect(o.events).toEqual([{ kind: "consent", arg: { id: "r1", response: "publish" } }]);
  });

  it("404s an unknown route", async () => {
    intake = new Intake({ orange: fakeOrange() });
    const port = await intake.listen(0);
    const res = await fetch(`http://127.0.0.1:${port}/nope`, { method: "POST" });
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/triggers/intake.test.ts`
Expected: FAIL — `Cannot find module './intake.js'`.

- [ ] **Step 3: Create `src/triggers/intake.ts`**

```ts
import { createServer, IncomingMessage, ServerResponse, Server } from "node:http";
import { AddressInfo } from "node:net";

interface OrangeLike {
  onCall(payload?: string): Promise<unknown>;
  resolveReferral(id: string, response: string): Promise<unknown>;
}

export interface IntakeOptions {
  orange: OrangeLike;
}

/** Layer 4 (calls): an event lands → run one exchange. */
export class Intake {
  private server: Server | undefined;

  constructor(private readonly opts: IntakeOptions) {}

  listen(port: number): Promise<number> {
    this.server = createServer((req, res) => void this.handle(req, res));
    return new Promise((resolve) => {
      this.server!.listen(port, "127.0.0.1", () => {
        resolve((this.server!.address() as AddressInfo).port);
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.server) return resolve();
      this.server.close(() => resolve());
    });
  }

  private async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (req.method !== "POST") return this.send(res, 405, { error: "method not allowed" });
      const url = req.url ?? "";
      const body = await this.readJson(req);

      if (url === "/call") {
        const result = await this.opts.orange.onCall((body as { payload?: string }).payload);
        return this.send(res, 200, result);
      }

      const referralMatch = url.match(/^\/referrals\/([^/]+)$/);
      if (referralMatch) {
        const { response } = body as { response: string };
        if (typeof response !== "string") return this.send(res, 400, { error: "response (string) required" });
        const result = await this.opts.orange.resolveReferral(referralMatch[1], response);
        return this.send(res, 200, result);
      }

      return this.send(res, 404, { error: "not found" });
    } catch (err) {
      return this.send(res, 500, { error: String(err) });
    }
  }

  private readJson(req: IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(c as Buffer));
      req.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8").trim();
        if (!raw) return resolve({});
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(e);
        }
      });
      req.on("error", reject);
    });
  }

  private send(res: ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/triggers/intake.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): HTTP call intake (calls + consent replies)"
```

---

### Task 12: Public entry point, the dogfood marketing example, and the Phase-0 acceptance test

**Files:**
- Create: `src/index.ts` (the package's public surface)
- Create: `examples/marketing/run.ts` (the dogfood worked reference — runs against the real floor)
- Test: `src/phase0.acceptance.test.ts` (end-to-end, FakeFloor)

**Interfaces:**
- Consumes: everything built above.
- Produces: `src/index.ts` re-exporting the public API (`Orange`, `OrangeOptions`, `Floor`, `LocalFloor`, `FakeFloor`, `Ledger`, `InMemoryLedger`, `SqliteLedger`, `Scheduler`, `Intake`, `ConsoleNotifier`, types, `voice`).

- [ ] **Step 1: Create `src/index.ts`**

```ts
export { Orange } from "./orange.js";
export type { OrangeOptions } from "./orange.js";
export type { Floor, WorkerInput, WorkerOutcome, RaisedReferral } from "./floor/floor.js";
export { LocalFloor } from "./floor/local.js";
export { FakeFloor } from "./floor/fake.js";
export type { Ledger, RecallQuery } from "./ledger/ledger.js";
export { recallScore, sumUsage } from "./ledger/ledger.js";
export { InMemoryLedger } from "./ledger/in-memory.js";
export { SqliteLedger } from "./ledger/sqlite.js";
export { Scheduler } from "./triggers/scheduler.js";
export { Intake } from "./triggers/intake.js";
export type { Notifier } from "./notifier.js";
export { ConsoleNotifier } from "./notifiers/console.js";
export { BudgetGuard } from "./budget.js";
export type { Usage } from "./budget.js";
export { runExchange } from "./exchange.js";
export type { ExchangeResult } from "./exchange.js";
export { voice } from "./voice.js";
export { MODELS } from "./types.js";
export type {
  ModelTier, Budget, StandingMandate, LedgerKind, LedgerEntry, Referral, TriggerKind, Trigger,
} from "./types.js";
```

- [ ] **Step 2: Write the failing Phase-0 acceptance test**

This is the proof Phase 0 works end-to-end: a shift fires → the worker refers up → the owner consents via a call → the continuation runs → the whole arc is on the ledger, all re-derived from a durable SQLite ledger between triggers (statelessness).

```ts
// src/phase0.acceptance.test.ts
import { describe, it, expect } from "vitest";
import { Orange } from "./orange.js";
import { SqliteLedger } from "./ledger/sqlite.js";
import { FakeFloor } from "./floor/fake.js";
import { Notifier } from "./notifier.js";

describe("Phase 0 acceptance: one worker, on shift", () => {
  it("shift -> refer up -> consent (call) -> continue, all on the durable ledger", async () => {
    const notes: string[] = [];
    const notifier: Notifier = { notify: (m) => notes.push(m) };
    const ledger = new SqliteLedger(":memory:");

    let phase = 0;
    const floor = new FakeFloor(async (input) => {
      phase += 1;
      if (phase === 1) {
        // First shift: the worker drafts, then needs to publish — refers up.
        return {
          text: "Drafted 3 launch posts about the Camping comic.",
          usage: { tokens: 1200, spendUsd: 0.02 },
          referral: { ask: "Publish these 3 posts to @badcode?", options: ["publish", "revise", "hold"] },
        };
      }
      // After consent: the prompt should carry the owner's answer.
      expect(input.prompt).toContain("publish");
      return { text: "Published the 3 posts and logged engagement targets.", usage: { tokens: 300, spendUsd: 0.004 } };
    });

    const orange = new Orange({
      goal: "Grow engagement for the BadCode art project — honestly.",
      floor,
      ledger,
      notifier,
      budget: { tokens: 100_000, spend: 5, depth: 1 },
      model: "mid",
    });

    // 1. A shift fires.
    const shift = await orange.onShift();
    expect(shift.endedForConsent).toBe(true);
    const referralId = shift.referralRaised!.id;
    expect(notes.some((n) => n.includes("Publish these 3 posts"))).toBe(true);

    // 2. While blocked, another shift must NOT run the worker.
    const blocked = await orange.onShift();
    expect(blocked.endedForConsent).toBe(true);
    expect(floor.calls).toHaveLength(1); // still only the first run

    // 3. The owner consents (a call).
    const cont = await orange.resolveReferral(referralId, "publish");
    expect(cont.endedForConsent).toBe(false);
    expect(cont.text).toContain("Published");

    // 4. The whole arc is on the record, in order.
    const kinds = ledger.all().map((e) => e.kind);
    expect(kinds).toEqual(
      expect.arrayContaining(["trigger", "work", "referral", "consent"]),
    );
    expect(ledger.pendingReferral()).toBeUndefined();
  });

  it("refuses to deploy ungoverned labor", () => {
    expect(
      () =>
        new Orange({
          goal: "g",
          floor: new FakeFloor(async () => ({ text: "", usage: { tokens: 0, spendUsd: 0 } })),
          ledger: new SqliteLedger(":memory:"),
          budget: undefined as any,
        }),
    ).toThrow(/ungoverned labor/);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/phase0.acceptance.test.ts`
Expected: FAIL — `Cannot find module './index.js'` is not the failure (acceptance imports concrete modules); the real first failure will be a type/behavior gap if any earlier task drifted. If all prior tasks passed, this should compile; run it and fix any mismatch surfaced (e.g. a renamed field). Expected initial state before `index.ts` exists is covered by Step 1 (index created first).

- [ ] **Step 4: Make it pass**

No new production code should be required — this test exercises Tasks 1–8. If it fails, the failure points to a contract drift between tasks; fix the drift in the offending module (do not weaken the test). Re-run until green.

Run: `npx vitest run src/phase0.acceptance.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Create the dogfood example `examples/marketing/run.ts`**

```ts
/**
 * Dogfood: BadCode runs its own marketing org on Agent Orange.
 * Phase 0 — one worker, on shift, with a real floor. The worker reasons and drafts;
 * anything public or paid is referred up for the owner's consent.
 *
 * Run: ANTHROPIC_API_KEY=... npx tsx examples/marketing/run.ts
 * Then, in another shell:
 *   curl -XPOST localhost:8787/call -d '{"payload":"a comment arrived on the Camping post"}'
 *   curl -XPOST localhost:8787/referrals/<id> -d '{"response":"publish"}'
 */
import {
  Orange,
  LocalFloor,
  SqliteLedger,
  Scheduler,
  Intake,
  ConsoleNotifier,
} from "../../src/index.js";

const orange = new Orange({
  goal:
    "Grow engagement for the BadCode art project — honestly. Draft posts and outreach " +
    "toward the comics and music; never spend money or post publicly without referring up.",
  floor: new LocalFloor(),
  ledger: new SqliteLedger("./marketing.sqlite"),
  notifier: new ConsoleNotifier(),
  budget: { tokens: 2_000_000, spend: 20, depth: 1 },
  model: "mid",
});

// Shifts: every 6 hours, plus one now.
const scheduler = new Scheduler({ everyMs: 6 * 60 * 60 * 1000, onShift: () => orange.onShift() });
void scheduler.fireNow();
scheduler.start();

// Calls + consent replies over HTTP.
const intake = new Intake({ orange });
void intake.listen(8787).then((port) => {
  console.log(`[agent-orange] call intake listening on :${port}`);
});
```

- [ ] **Step 6: Typecheck the whole project + run the full suite**

Run: `npm run typecheck && npm run test`
Expected: typecheck clean; all unit + acceptance tests PASS; the live smoke test SKIPPED unless `ANTHROPIC_API_KEY` is set.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(agent-orange): public entry point, dogfood marketing example, Phase-0 acceptance test"
```

---

## Phase-0 Definition of Done

- `npm run typecheck` is clean and `npm run test` is green (unit + acceptance; live smoke skipped without a key).
- The acceptance test proves the full arc on a durable ledger: **shift → refer up → (blocked) → consent via call → continue**, re-derived from persistence each trigger.
- The three least-prior-art primitives are real and tested: **dual triggering (shifts + calls)**, **the ledger across triggers**, **refer up / consent**.
- The worker protections hold as defaults: **no budget → refuses to construct**; **spend/irreversible → must refer up**; **append-only ledger**; **overreach → halt + on the record**, all in BadCode voice.
- `examples/marketing/run.ts` is the runnable dogfood reference (needs `ANTHROPIC_API_KEY`).

## Out of scope (later phases, per the master spec §10)

- `engage(mandate)` / the steward delegating to child workers (Phase 1).
- The containerized **floor** tool-surface (install/clone/run) and Postgres+pgvector + embeddings/relevance recall.
- Bounded parallel fan-out (Phase 2) and runtime hiring (Phase 3).
- Cron-expression scheduling, email/Slack notifiers, ethics-encoded license, badcode-site discoverability surface.
```
