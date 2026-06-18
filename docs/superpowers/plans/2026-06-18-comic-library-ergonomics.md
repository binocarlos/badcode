# Comic Library Ergonomics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make adding/editing a comic page a small, obvious edit — comic-level page defaults, a `hold` shorthand, a documented home for bespoke effects, and an authoring guide — then land camping, karen, and the generator on the new surface.

**Architecture:** Page-level defaulting is resolved by a pure helper (`resolvePage`) that merges a page's own props over `ScrollComic`'s `pageDefaults` over library defaults, with explicit `null` beating a default and any timing prop fully determining a page's timing. `ScrollComic` calls the helper, feeds resolved `phases`/`transition` to the engine, and clones each page with the resolved `effect`/`background`. `Page` itself is essentially unchanged. The generator emits the lean API; camping/karen migrate onto it.

**Tech Stack:** TypeScript, React 18, Vite, Vitest. Packages: `@badcode/comic` (library), `@badcode/cli` (generator), `@badcode/web` (comics). `Phases` is `{ enter: number; hold: number; exit: number }` from `@badcode/scroll-timeline`.

## Global Constraints

- Library default page values: `transition: crossfade()`, `hold: 1`, `background: undefined`. (`crossfade` imported from `../transitions`.)
- Precedence (highest wins): explicit `<Page>` prop → `<ScrollComic pageDefaults>` → library default.
- Timing props precedence within a level: `phases` > `hold` > `scrollDuration`. A page that sets **any** timing prop fully determines its own timing (does not mix with a default's timing).
- `transition={null}` is an explicit "no transition" and must NOT fall through to the default `crossfade()`. `undefined`/absent means inherit.
- `scrollDuration` stays as a `@deprecated` alias; nothing may break. New/generated code emits `hold`.
- A `hold` value `<= 0` is guarded to `1` (matches current `scrollDuration` guard in `ScrollComic.tsx:59`).
- No behavioral regression in existing comics: same pages, same `appearAt` timings, same transitions, opener keeps `zoom({ amount: 1.3 })`.
- Tests run with `npm run test --workspace @badcode/comic` and `npm run test --workspace @badcode/cli`. Whole-repo gates: `npm run typecheck` and `npm run build` from the repo root.

---

### Task 1: Pure `resolvePage` defaulting helper

**Files:**
- Create: `packages/comic/src/components/pageDefaults.ts`
- Test: `packages/comic/src/components/pageDefaults.test.ts`

**Interfaces:**
- Consumes: `Phases` from `@badcode/scroll-timeline`; `EffectInstance`, `TransitionInstance` from `../types`; `crossfade` from `../transitions`.
- Produces:
  - `interface PageDefaultableProps { scrollDuration?: number; hold?: number; phases?: Phases; transition?: TransitionInstance | null; effect?: EffectInstance | ((el: HTMLElement, scrollPercent: number) => void) | null; background?: string }`
  - `interface ResolvedPage { phases: Phases; transition: TransitionInstance | null; effect: PageDefaultableProps['effect']; background: string | undefined }`
  - `function resolvePage(page: PageDefaultableProps, defaults?: PageDefaultableProps): ResolvedPage`

- [ ] **Step 1: Write the failing test**

```ts
// packages/comic/src/components/pageDefaults.test.ts
import { describe, it, expect } from 'vitest'
import { resolvePage } from './pageDefaults'
import type { TransitionInstance, EffectInstance } from '../types'

const tx = (duration: number): TransitionInstance => ({ duration, run: async () => {} })
const fx = (): EffectInstance => ({ apply: () => {}, cleanup: () => {} })

describe('resolvePage timing', () => {
  it('defaults to library hold=1 when nothing is set', () => {
    expect(resolvePage({}).phases).toEqual({ enter: 0, hold: 1, exit: 0 })
  })
  it('uses page.hold as the hold phase', () => {
    expect(resolvePage({ hold: 2.8 }).phases).toEqual({ enter: 0, hold: 2.8, exit: 0 })
  })
  it('prefers phases over hold over scrollDuration within a level', () => {
    expect(resolvePage({ phases: { enter: 1, hold: 2, exit: 3 }, hold: 9, scrollDuration: 5 }).phases)
      .toEqual({ enter: 1, hold: 2, exit: 3 })
    expect(resolvePage({ hold: 4, scrollDuration: 5 }).phases).toEqual({ enter: 0, hold: 4, exit: 0 })
  })
  it('lets a page timing prop fully override a default timing prop', () => {
    expect(resolvePage({ hold: 2 }, { phases: { enter: 0, hold: 9, exit: 0 } }).phases)
      .toEqual({ enter: 0, hold: 2, exit: 0 })
  })
  it('falls back to default timing when the page sets none', () => {
    expect(resolvePage({}, { hold: 3 }).phases).toEqual({ enter: 0, hold: 3, exit: 0 })
  })
  it('guards a non-positive hold to 1', () => {
    expect(resolvePage({ hold: 0 }).phases).toEqual({ enter: 0, hold: 1, exit: 0 })
  })
})

describe('resolvePage transition', () => {
  it('defaults to a crossfade instance', () => {
    expect(resolvePage({}).transition).not.toBeNull()
    expect(resolvePage({}).transition?.duration).toBeGreaterThan(0)
  })
  it('explicit null means no transition (does NOT inherit the default)', () => {
    expect(resolvePage({ transition: null }).transition).toBeNull()
  })
  it('page transition beats defaults beats library', () => {
    const a = tx(100), b = tx(200)
    expect(resolvePage({ transition: a }, { transition: b }).transition).toBe(a)
    expect(resolvePage({}, { transition: b }).transition).toBe(b)
  })
})

describe('resolvePage effect + background', () => {
  it('defaults effect to null and background to undefined', () => {
    expect(resolvePage({}).effect).toBeNull()
    expect(resolvePage({}).background).toBeUndefined()
  })
  it('merges background page-over-defaults', () => {
    expect(resolvePage({}, { background: '#0a0f1c' }).background).toBe('#0a0f1c')
    expect(resolvePage({ background: '#fff' }, { background: '#000' }).background).toBe('#fff')
  })
  it('merges effect page-over-defaults; explicit null wins', () => {
    const e = fx()
    expect(resolvePage({ effect: e }).effect).toBe(e)
    expect(resolvePage({ effect: null }, { effect: e }).effect).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/comic -- pageDefaults`
Expected: FAIL — `Cannot find module './pageDefaults'` / `resolvePage is not a function`.

- [ ] **Step 3: Write the implementation**

```ts
// packages/comic/src/components/pageDefaults.ts
import type { Phases } from '@badcode/scroll-timeline'
import type { EffectInstance, TransitionInstance } from '../types'
import { crossfade } from '../transitions'

/** The subset of Page props that participate in comic-level defaulting. */
export interface PageDefaultableProps {
  scrollDuration?: number
  hold?: number
  phases?: Phases
  transition?: TransitionInstance | null
  effect?: EffectInstance | ((el: HTMLElement, scrollPercent: number) => void) | null
  background?: string
}

export interface ResolvedPage {
  phases: Phases
  transition: TransitionInstance | null
  effect: PageDefaultableProps['effect']
  background: string | undefined
}

/** Library default transition — a stateless instance shared across pages. */
const DEFAULT_TRANSITION: TransitionInstance = crossfade()
const LIBRARY_TIMING: Phases = { enter: 0, hold: 1, exit: 0 }

/** First argument that is not `undefined`, so an explicit `null` wins over a default. */
function pick<T>(...vals: (T | undefined)[]): T | undefined {
  for (const v of vals) if (v !== undefined) return v
  return undefined
}

/** Timing expressed by ONE level, or undefined if it sets no timing prop. phases > hold > scrollDuration. */
function levelTiming(p: PageDefaultableProps): Phases | undefined {
  if (p.phases) return p.phases
  const d = p.hold ?? p.scrollDuration
  if (d == null) return undefined
  return { enter: 0, hold: d > 0 ? d : 1, exit: 0 }
}

/** Merge a page's own props over comic-level defaults over library defaults. */
export function resolvePage(
  page: PageDefaultableProps,
  defaults: PageDefaultableProps = {},
): ResolvedPage {
  return {
    phases: levelTiming(page) ?? levelTiming(defaults) ?? LIBRARY_TIMING,
    transition: pick(page.transition, defaults.transition, DEFAULT_TRANSITION) ?? null,
    effect: pick(page.effect, defaults.effect, null) ?? null,
    background: pick(page.background, defaults.background),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/comic -- pageDefaults`
Expected: PASS (all cases green).

- [ ] **Step 5: Commit**

```bash
git add packages/comic/src/components/pageDefaults.ts packages/comic/src/components/pageDefaults.test.ts
git commit -m "feat(comic): pure resolvePage page-defaulting helper"
```

---

### Task 2: Wire defaults into `ScrollComic` + add `hold`/`pageDefaults` to the public API

**Files:**
- Modify: `packages/comic/src/components/Page.tsx` (PageProps: add `hold`, deprecate `scrollDuration`)
- Modify: `packages/comic/src/components/ScrollComic.tsx:1-66,93-110` (add `pageDefaults`, use `resolvePage`, clone pages)

**Interfaces:**
- Consumes: `resolvePage`, `ResolvedPage` from `./pageDefaults` (Task 1).
- Produces: `ScrollComicProps` gains `pageDefaults?: Partial<PageProps>`; `PageProps` gains `hold?: number`.

- [ ] **Step 1: Add `hold` to `PageProps` and deprecate `scrollDuration`**

In `packages/comic/src/components/Page.tsx`, replace the `scrollDuration` doc block (lines 9-13) and add `hold` right after it:

```ts
  /**
   * @deprecated Use `hold` instead. How many viewport-heights of scroll this
   * page occupies (default 1). Kept as an alias for back-compat.
   */
  scrollDuration?: number
  /**
   * How many viewport-heights of scroll this page holds (default 1). The
   * friendly scalar for page length; longer pages give effects/text more room.
   */
  hold?: number
```

(Leave the rest of `PageProps` and the `Page` component body unchanged — `Page` still consumes only `effect`/`background`/`children`.)

- [ ] **Step 2: Rewrite `ScrollComic`'s prop-reading to use `resolvePage` + clone**

In `packages/comic/src/components/ScrollComic.tsx`:

Add to imports (top of file):
```ts
import { Children, cloneElement, isValidElement, useCallback, useMemo, useRef, type ReactElement, type ReactNode } from 'react'
import { resolvePage } from './pageDefaults'
```
(Replace the existing `react` import line with the one above — it adds `cloneElement`.)

Add `pageDefaults` to `ScrollComicProps`:
```ts
  /** Page props every <Page> inherits unless it sets its own (explicit prop wins). */
  pageDefaults?: Partial<PageProps>
```

Add `pageDefaults` to the destructured params of `ScrollComic({ ... })`.

Replace the `phases`/`transitions` memos (current lines 54-66) with a single resolved-pages memo plus derived arrays:
```ts
  const resolved = useMemo<ReturnType<typeof resolvePage>[]>(
    () => pageElements.map((p) => resolvePage(p.props, pageDefaults)),
    [pageElements, pageDefaults],
  )
  const phases = useMemo<Phases[]>(() => resolved.map((r) => r.phases), [resolved])
  const transitions = useMemo<(TransitionInstance | null)[]>(
    () => resolved.map((r) => r.transition),
    [resolved],
  )
```

In the render map (current lines 97-109), clone the page element with the resolved `effect`/`background` so `Page` reflects the merge. Replace `{pageElements[i]}` with:
```ts
                {cloneElement(pageElements[i], {
                  effect: resolved[i].effect,
                  background: resolved[i].background,
                })}
```

- [ ] **Step 3: Verify the existing comic test suite still passes**

Run: `npm run test --workspace @badcode/comic`
Expected: PASS (Task 1 tests + existing `useTransitions`/`video`/`assets` tests all green).

- [ ] **Step 4: Verify types across the repo**

Run: `npm run typecheck`
Expected: PASS — no errors. (Confirms `pageDefaults`/`hold` typecheck against existing camping/karen usage, which still pass `phases`/`scrollDuration`/`transition` explicitly.)

- [ ] **Step 5: Commit**

```bash
git add packages/comic/src/components/Page.tsx packages/comic/src/components/ScrollComic.tsx
git commit -m "feat(comic): ScrollComic pageDefaults + Page hold shorthand"
```

---

### Task 3: Migrate `CampingComic.tsx` + seed `comics/camping/effects.ts`

**Files:**
- Create: `apps/web/src/comics/camping/effects.ts`
- Modify: `apps/web/src/comics/camping/CampingComic.tsx` (full rewrite onto new API)

**Interfaces:**
- Consumes: `pageDefaults` + `hold` (Task 2); `defineEffect` from `@badcode/comic/effects`.
- Produces: `export const trip` custom effect for reuse on camping's post-ayahuasca pages.

This migration is **structural parity plus one additive effect**. Apply these exact transformation rules to every `<Page>`:
1. Delete `phases={{ enter: 0, hold: N, exit: N }}` and `scrollDuration={N}`; replace with a single `hold={N}` (use the `hold` value from the old `scrollDuration`, e.g. `1.4` or `2.8`). If `hold` would be `1.4`, you may still write `hold={1.4}` for clarity.
2. Delete per-page `transition={crossfade()}` (now the library/comic default).
3. Delete per-page `background="#0a0f1c"` (moved to `pageDefaults`).
4. Delete the boilerplate `{/* TODO: pick an effect … */}`, `{/* TODO: pick background color */}`, and `{/* TODO: add SidePanelText … */}` comments. Keep genuine content comments (e.g. the "Merged: a02 played once …" notes).
5. Keep every `effect={...}`, every `<SpeechBubble>`/`<NarrationBox>` with its exact `x`/`y`/`appearAt`/`fade`/`type`/`tail`/`fontSize`, and every widget unchanged.

- [ ] **Step 1: Create the seeded custom effect**

```ts
// apps/web/src/comics/camping/effects.ts
import { defineEffect } from '@badcode/comic/effects'

/**
 * Woozy psychedelic warp for the post-ayahuasca pages — hue drift + a gentle
 * "breathing" scale that intensifies across the page's scroll. Worked example of
 * a comic-local custom effect (graduate to @badcode/comic/effects if a second
 * comic wants it).
 */
export const trip = (intensity = 1) =>
  defineEffect((el, p) => {
    const hue = p * 60 * intensity
    const scale = 1 + Math.sin(p * Math.PI * 4) * 0.02 * intensity
    el.style.filter = `hue-rotate(${hue}deg) saturate(${1 + p * 0.5 * intensity})`
    el.style.transform = `scale(${scale})`
  })
```

- [ ] **Step 2: Rewrite the file head (imports + ScrollComic open + opener)**

Replace lines 1-21 of `CampingComic.tsx` with:

```tsx
import { ScrollComic, Page, ImageWidget, AnimationWidget, SpeechBubble, NarrationBox, createComic } from '@badcode/comic'
import manifest from './assets.manifest.json'
import { zoom } from '@badcode/comic/effects'
import { trip } from './effects'
// Custom effects live in ./effects.ts. Built-ins: zoom, grayscale, pan, zoomInOut, scale |
// transitions crossfade, iris, fadeOutFadeIn, slideOver, blur, wipe | text scrollIn, fadeIn,
// fadeOut, pause. See packages/comic/AUTHORING.md.

const comic = createComic(manifest)

export function CampingComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint pageDefaults={{ background: '#0a0f1c' }}>
      {/* Opener: the building clip plays once. transition={null} keeps the prior
          no-transition cut into page 1 (library default is crossfade). */}
      <Page hold={2.8} effect={zoom({ amount: 1.3 })} transition={null}>
        <AnimationWidget animation={comic.resolveAnimation('anim/a01')} />
      </Page>
```

- [ ] **Step 3: Apply the transformation rules to the remaining pages**

Transform pages 2..end per rules 1-5 above. Worked example — the original page 2 (lines 23-36) becomes:

```tsx
      <Page hold={1.4}>
        <ImageWidget src={comic.resolve('img/i02.png')} />
        <SpeechBubble x={34.448160535117054} y={34.420205046580215} appearAt={[0, 1]} fade tail="none" fontSize={10}>
          {'Let\'s circle back to synergise our bandwidth…'}
        </SpeechBubble>
      </Page>
```

On the three post-ayahuasca pages that currently carry the `'Fuck me, that kicked in quick!'` thought bubble (originals at lines 308-321 with `anim/a07`, 335-348 with `anim/a08`, and 301-306 / 323-333 / 350-360 with `img/i13`), add `effect={trip()}` to the `<Page>` as the worked use of the seeded effect — keep their widgets and bubbles otherwise unchanged. Example for the `anim/a07` page:

```tsx
      <Page hold={1.4} effect={trip()}>
        <AnimationWidget animation={comic.resolveAnimation('anim/a07')} />
        <SpeechBubble x={15.466920986622073} y={75.01755535789523} fade type="thought" tail="none" fontSize={10}>
          {'Fuck me, that kicked in quick!'}
        </SpeechBubble>
      </Page>
```

Leave the final `NarrationBox` placeholder page as-is structurally (just drop its boilerplate TODO comments per rule 4; keep the `{/* TODO: this page had no image… */}` content note and the placeholder `<NarrationBox>`).

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Build the site**

Run: `npm run build`
Expected: PASS (Vite build completes, no errors).

- [ ] **Step 6: Manual parity check**

Run: `npm run dev`, open `http://localhost:5173/comics/camping`. Confirm: opener animation plays once with zoom; the two merged-animation beats (a02, a09) play once across their dialogue; all speech/thought bubbles appear at the same points; transitions between pages crossfade; the post-ayahuasca pages now show the `trip` warp. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/comics/camping/effects.ts apps/web/src/comics/camping/CampingComic.tsx
git commit -m "refactor(camping): migrate to pageDefaults + hold; seed trip effect"
```

---

### Task 4: Migrate `KarenComic.tsx`

**Files:**
- Modify: `apps/web/src/comics/karen/KarenComic.tsx` (full rewrite onto new API, structural parity only — no seeded effect)

**Interfaces:**
- Consumes: `pageDefaults` + `hold` (Task 2). No new exports.

- [ ] **Step 1: Inspect the current file**

Run: `sed -n '1,40p' apps/web/src/comics/karen/KarenComic.tsx`
Note its `<ScrollComic>` props, its repeated per-page `background` value (whatever it uses), and its `scrollDuration`/`phases` pattern.

- [ ] **Step 2: Apply the same transformation rules as Task 3**

Apply rules 1-5 from Task 3. Move karen's repeated per-page `background="…"` into `pageDefaults={{ background: '…' }}` on `<ScrollComic>` (use karen's actual color). Replace `scrollDuration`/`phases` with `hold`. Remove per-page `transition={crossfade()}` and boilerplate TODO comments. If page 1 currently has no transition, add `transition={null}` to preserve the cut. Keep all bubbles, effects, widgets, and timings identical. Do **not** add a custom effect (karen has no `effects.ts` until it needs one).

- [ ] **Step 3: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 4: Manual parity check**

Run: `npm run dev`, open karen's route, confirm parity (pages, bubbles, transitions, timings unchanged). Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/comics/karen/KarenComic.tsx
git commit -m "refactor(karen): migrate to pageDefaults + hold"
```

---

### Task 5: Generator emits the lean API + scaffolds `effects.ts`

**Files:**
- Modify: `packages/cli/src/generate.ts` (`Usage`, `renderPage`, `generateTsx`, `generate`)
- Modify: `packages/cli/src/generate.test.ts` (update the transition/background expectations)

**Interfaces:**
- Produces: generated `*.tsx` uses `<ScrollComic … pageDefaults={{ background: '#0a0f1c' }}>`, `<Page hold={1.4}>`, opener `<Page hold={1.4} effect={zoom({ amount: 1.3 })} transition={null}>`. `crossfade` is no longer emitted or imported (it's the library default). `generate()` also writes a starter `effects.ts`.

- [ ] **Step 1: Update the failing generator test first**

In `packages/cli/src/generate.test.ts`, replace the `applies crossfade transition to non-first pages` test (lines 155-158) with:

```ts
  it('relies on the library default transition — no per-page crossfade', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).not.toContain('crossfade')
    expect(output).toContain('pageDefaults={{ background: ')
  })

  it('emits hold and a null opener transition', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('hold={1.4}')
    expect(output).toContain('transition={null}')
  })
```

- [ ] **Step 2: Run the generator tests to verify failure**

Run: `npm run test --workspace @badcode/cli -- generate`
Expected: FAIL — output still contains `crossfade()`, no `pageDefaults`, no `hold={1.4}`.

- [ ] **Step 3: Update `renderPage`**

In `packages/cli/src/generate.ts`, replace the head of `renderPage` (current lines 105-122) with:

```ts
  const lines: string[] = []

  lines.push(`${indent}<Page hold={1.4}`)
  if (isFirst) {
    usage.zoom = true
    lines.push(`${indent}  effect={zoom({ amount: 1.3 })}`)
    lines.push(`${indent}  transition={null}`)
  }
  lines.push(`${indent}>`)
```

Delete the now-unused `{/* TODO: pick an effect … */}` and `{/* TODO: pick background color */}` pushes. Keep the empty-page placeholder logic (lines 164-170) and the content-less branch. Replace the side-panel placeholder push (line 173) — delete it (no more per-page side-panel TODO noise).

- [ ] **Step 4: Update `Usage` + `generateTsx` imports**

In the `Usage` interface (lines 64-71), remove the `crossfade: boolean` field. In `generateTsx` (lines 179-205): remove `crossfade: false` from the `usage` initializer; delete the `if (usage.crossfade) importLines.push(...crossfade...)` line; change the `<ScrollComic …>` open to include `pageDefaults`:

```ts
  return `${importLines.join('\n')}

export function ${name}Comic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint pageDefaults={{ background: '#0a0f1c' }}>
${pages}
    </ScrollComic>
  )
}
`
```

Keep the `zoom` import line and the "Other effects/transitions available" comment line.

- [ ] **Step 5: Scaffold a starter `effects.ts` in `generate()`**

In `generate()` (after `tsxPath` is computed, ~line 243), add an `effectsPath` and write a starter file when absent (respecting `force`):

```ts
  const effectsPath = join(comicDir, 'effects.ts')
  const effectsStarter = `import { defineEffect } from '@badcode/comic/effects'

// Comic-local custom effects live here. Build with defineEffect(apply, cleanup?)
// and import into the comic .tsx: import { myEffect } from './effects'
// Graduate an effect into @badcode/comic/effects once a second comic wants it.
// See packages/comic/AUTHORING.md.

// export const example = (amount = 1) =>
//   defineEffect((el, p) => { el.style.opacity = String(1 - p * amount) })
`
```

Add `effectsPath` to the overwrite-guard `existing[]` check (lines 245-254), and after writing meta + tsx (lines 259-260) write it only if missing or forced:

```ts
  if (force || !(await fileExists(effectsPath))) {
    await writeFile(effectsPath, effectsStarter)
  }
```

Add `effectsPath` to the `console.log` of generated files.

- [ ] **Step 6: Run the generator tests to verify they pass**

Run: `npm run test --workspace @badcode/cli`
Expected: PASS. (The "emits TSX that parses without diagnostics" and NarrationBox-import tests must still pass with the new output — `hold={1.4}` and `pageDefaults` are valid TSX.)

- [ ] **Step 7: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add packages/cli/src/generate.ts packages/cli/src/generate.test.ts
git commit -m "feat(cli): generator emits lean Page API + scaffolds effects.ts"
```

---

### Task 6: Write `AUTHORING.md` + link from `CLAUDE.md`

**Files:**
- Create: `packages/comic/AUTHORING.md`
- Modify: `CLAUDE.md` (repo map row for `packages/comic`)

**Interfaces:** None (documentation).

- [ ] **Step 1: Write `packages/comic/AUTHORING.md`**

Cover, in this order, with real copy (not placeholders):
1. **Mental model** — `ScrollComic` › `Page` › three child layers (widget: `ImageWidget`/`AnimationWidget`; bubble: `SpeechBubble`/`NarrationBox`; side: `SidePanelText`). Effects are scroll-linked and run every frame on the page's widget; transitions fire once when the current page changes.
2. **Minimal page** — the smallest working `<ScrollComic><Page><ImageWidget …/></Page></ScrollComic>`, noting library defaults (crossfade, hold 1, transparent bg).
3. **`pageDefaults` + precedence** — explicit prop → `pageDefaults` → library default; `transition={null}` opts out; any timing prop fully sets a page's timing; `phases` > `hold` > `scrollDuration` (deprecated).
4. **`Page` / `ScrollComic` prop reference** — `hold`, `phases`, `transition`, `effect`, `background`, `children`; `progressBar`/`pageIndicator`/`scrollHint`/`hintText`/`pageDefaults`.
5. **Add / insert / reorder a page** — pages are positional children; insert a `<Page>` where you want it in source order.
6. **Custom effects/transitions** — `defineEffect((el, scrollPercent) => …, cleanup?)` and `defineTransition(durationMs, async (out, inc, dir) => …)`; live in `comics/<name>/effects.ts`; graduation rule (2nd consumer → `@badcode/comic/effects`). Reference `comics/camping/effects.ts` `trip` as the worked example.
7. **Built-in catalog** — one line + signature each: effects `zoom`, `grayscale`, `pan`, `zoomInOut`, `scale`; transitions `crossfade`, `iris`, `fadeOutFadeIn`, `slideOver`, `blur`, `wipe` (imported from `@badcode/comic/transitions`); text segments `scrollIn`, `fadeIn`, `fadeOut`, `pause` (from `@badcode/comic/text`).
8. **Asset wiring** — `createComic(manifest)` then `comic.resolve('img/iNN.png')` and `comic.resolveAnimation('anim/aNN')`.

- [ ] **Step 2: Link it from `CLAUDE.md`**

In the repo-map table row for `packages/comic`, append a pointer to the new doc, e.g. change the "What" cell to: ``@badcode/comic` — code-first comic rendering library (authoring guide: [`AUTHORING.md`](./packages/comic/AUTHORING.md))`.

- [ ] **Step 3: Verify links resolve**

Run: `test -f packages/comic/AUTHORING.md && grep -q 'AUTHORING.md' CLAUDE.md && echo OK`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add packages/comic/AUTHORING.md CLAUDE.md
git commit -m "docs(comic): AUTHORING.md authoring guide + link from CLAUDE.md"
```

---

## Self-Review

**Spec coverage:**
- Page-defaults 3-level merge → Tasks 1-2. ✓
- Page API tidy (`hold`, `phases`, deprecated `scrollDuration`) → Task 2. ✓
- Colocated `effects.ts` + graduation rule → Task 3 (camping seed), Task 5 (scaffold), Task 6 (doc). ✓
- `AUTHORING.md` for Claude + CLAUDE.md link → Task 6. ✓
- Generator emits lean API + scaffolds effects.ts → Task 5. ✓
- Migrate camping + karen, behavior parity, opener `transition={null}` → Tasks 3-4. ✓
- Testing: pure-merge unit tests (Task 1), generator tests (Task 5), typecheck/build/manual parity (Tasks 2-5). ✓
- Out-of-scope items (canon sync, meta cleanup, SP2/SP3) → not in any task, by design. ✓

**Placeholder scan:** No "TBD"/"implement later"/"add error handling" steps; the camping/karen migrations use explicit transformation rules + worked exemplars rather than reproducing ~750 lines, and every code step shows real code.

**Type consistency:** `resolvePage(page, defaults?)`, `PageDefaultableProps`, `ResolvedPage` are named identically in Tasks 1-2; `pageDefaults`/`hold` names match across Tasks 2-6; `Usage.crossfade` removal in Task 5 is consistent with dropping the crossfade import.
