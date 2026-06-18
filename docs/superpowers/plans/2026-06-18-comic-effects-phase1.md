# Comic Effects — Phase 1 (Tier A Foundations) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the clean-cinematic spine — a reactive Effect context (scroll velocity), scroll-scrubbed speech bubbles, cinematic transitions, and a film-grain/vignette coat — with zero WebGL.

**Architecture:** Tier A needs no new rendering primitive. We widen the Effect callback from `(el, scrollPercent)` to an optional 3rd `EffectContext` arg (back-compatible), compute scroll `velocity` in the engine and deliver it via a new `MotionContext`, bring `SidePanelText`'s existing scroll-linked text-reveal engine (`computeTextEffectStyles`) to `SpeechBubble` plus a scroll-scrubbed typewriter, add three DOM/WAAPI transitions, and add an opt-in grain/vignette overlay to `ScrollComic`.

**Tech Stack:** TypeScript, React 18, Vitest (pure-function tests only — the `@badcode/comic` package has no React-render test setup), CSS/SVG (no WebGL), Web Animations API.

## Global Constraints

- **Back-compat is mandatory.** Existing effects `apply(el, scrollPercent)` and `defineEffect((el, p) => …)` callers must keep working untouched. `scrollPercent` stays the 2nd positional arg; the `EffectContext` is an optional 3rd arg.
- **Pure-function tests only.** Every automated test targets a pure helper (vitest, like `bubbles/visibility.ts` / `text/segments.ts` tests). React components are verified by `npm run typecheck`, `npm run build`, and human manual check — there is no component-render test harness in this package.
- **Restraint is the brand.** New transitions are slow/soft; grain ships low-opacity; everything new is opt-in per page/bubble/comic and changes no existing comic unless adopted.
- **Tier A is transform/filter/opacity only** — GPU-cheap, no per-frame pixel reads, mobile-safe. No WebGL in Phase 1.
- **Accessibility:** honor `prefers-reduced-motion` for grain animation, the typewriter, and any velocity-driven intensity.
- The real text-reveal function is **`computeTextEffectStyles(scrollPercent, config)`** (file `text/computeTextStyles.ts`); segment factories and `buildTextConfig` live in `text/segments.ts`; both re-exported from `@badcode/comic/text`.
- Tests run with `npm run test --workspace @badcode/comic`. Whole-repo gates: `npm run typecheck` and `npm run build` from the repo root.
- End every commit message with the trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: `EffectContext` type + back-compatible `apply` signature

**Files:**
- Modify: `packages/comic/src/types.ts` (add `EffectContext`, widen `EffectInstance.apply`)
- Modify: `packages/comic/src/effects/types.ts` (widen `defineEffect`'s `apply` param type)
- Modify: `packages/comic/src/index.ts` (export `EffectContext`)
- Test: `packages/comic/src/effects/types.test.ts` (new)

**Interfaces:**
- Produces:
  - `interface EffectContext { scrollPercent: number; velocity: number; pointer: { x: number; y: number } | null; audio: { bass: number; mid: number; high: number; beat: boolean } | null }`
  - `EffectInstance.apply: (el: HTMLElement, scrollPercent: number, ctx?: EffectContext) => void`
  - `defineEffect(apply: (el, scrollPercent, ctx?) => void, cleanup?)` — unchanged behavior, widened type.

- [ ] **Step 1: Write the failing test**

```ts
// packages/comic/src/effects/types.test.ts
import { describe, it, expect } from 'vitest'
import { defineEffect } from './types'
import type { EffectContext } from '../types'

describe('defineEffect context arg', () => {
  it('forwards the optional EffectContext to apply', () => {
    let seen: EffectContext | undefined
    const e = defineEffect((_el, _p, ctx) => { seen = ctx })
    const ctx: EffectContext = { scrollPercent: 0.5, velocity: 2, pointer: null, audio: null }
    e.apply({} as HTMLElement, 0.5, ctx)
    expect(seen).toEqual(ctx)
  })

  it('still works for a legacy two-arg apply (no context)', () => {
    let pct = -1
    const e = defineEffect((_el, p) => { pct = p })
    e.apply({} as HTMLElement, 0.42)
    expect(pct).toBe(0.42)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/comic -- types`
Expected: FAIL — `EffectContext` is not exported from `../types` (type import error / test won't compile).

- [ ] **Step 3: Add `EffectContext` and widen `EffectInstance.apply` in `types.ts`**

In `packages/comic/src/types.ts`, add after the `EffectInstance` interface's doc block, and widen its `apply`:

```ts
/**
 * Live, per-frame context passed to an effect's `apply` as an optional 3rd arg.
 * `scrollPercent` duplicates the 2nd positional arg (kept for back-compat).
 * `velocity` is smoothed scroll speed (overall-fraction per second). `pointer`
 * and `audio` are reserved for later phases and are `null` until then.
 */
export interface EffectContext {
  scrollPercent: number
  velocity: number
  pointer: { x: number; y: number } | null
  audio: { bass: number; mid: number; high: number; beat: boolean } | null
}
```

Change the `EffectInstance.apply` line from:
```ts
  apply: (el: HTMLElement, scrollPercent: number) => void
```
to:
```ts
  apply: (el: HTMLElement, scrollPercent: number, ctx?: EffectContext) => void
```

- [ ] **Step 4: Widen `defineEffect` in `effects/types.ts`**

In `packages/comic/src/effects/types.ts`, change the `apply` parameter type of `defineEffect` from:
```ts
  apply: (el: HTMLElement, scrollPercent: number) => void,
```
to:
```ts
  apply: (el: HTMLElement, scrollPercent: number, ctx?: import('../types').EffectContext) => void,
```
(No body change — `defineEffect` already stores `apply` as-is and the engine calls it with whatever args.)

- [ ] **Step 5: Export `EffectContext` from the package index**

In `packages/comic/src/index.ts`, add `EffectContext` to the core types export line:
```ts
export type { Point, ScrollDirection, EffectInstance, TransitionInstance, EffectContext } from './types'
```

- [ ] **Step 6: Run test + typecheck**

Run: `npm run test --workspace @badcode/comic -- types && npm run typecheck`
Expected: PASS (both new tests green; whole repo typechecks — existing effects still compile because `ctx` is optional).

- [ ] **Step 7: Commit**

```bash
git add packages/comic/src/types.ts packages/comic/src/effects/types.ts packages/comic/src/index.ts packages/comic/src/effects/types.test.ts
git commit -m "feat(comic): EffectContext arg on effects (back-compatible)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Scroll velocity → `MotionContext` → effect context

**Files:**
- Create: `packages/comic/src/engine/velocity.ts`
- Test: `packages/comic/src/engine/velocity.test.ts`
- Modify: `packages/comic/src/engine/PageContext.tsx` (add `MotionContext`/`useMotionState`)
- Modify: `packages/comic/src/engine/useScrollEngine.ts` (compute + return `velocity`)
- Modify: `packages/comic/src/components/ScrollComic.tsx` (provide `MotionContext`)
- Modify: `packages/comic/src/hooks/useScrollEffect.ts` (build + pass `EffectContext`)

**Interfaces:**
- Consumes: `EffectContext` (Task 1).
- Produces:
  - `function nextVelocity(prev: number, prevOverall: number, currOverall: number, dtMs: number, smoothing?: number): number`
  - `interface MotionState { velocity: number; pointer: { x: number; y: number } | null; audio: EffectContext['audio'] }`
  - `function useMotionState(): MotionState` (non-throwing; defaults `{ velocity: 0, pointer: null, audio: null }`)
  - `useScrollEngine(...)` return gains `velocity: number`.

- [ ] **Step 1: Write the failing test for `nextVelocity`**

```ts
// packages/comic/src/engine/velocity.test.ts
import { describe, it, expect } from 'vitest'
import { nextVelocity } from './velocity'

describe('nextVelocity', () => {
  it('is 0 when dt is 0 (guards divide-by-zero)', () => {
    expect(nextVelocity(0, 0, 0.5, 0)).toBe(0)
  })
  it('decays toward 0 when there is no scroll delta', () => {
    const v = nextVelocity(4, 0.5, 0.5, 16)
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(4)
  })
  it('rises toward the instantaneous speed on a constant delta', () => {
    // 0.1 overall-fraction in 100ms = 1.0 /s instantaneous; EMA from 0 moves toward it
    const v = nextVelocity(0, 0.0, 0.1, 100)
    expect(v).toBeGreaterThan(0)
    expect(v).toBeLessThanOrEqual(1)
  })
  it('clamps to a sane ceiling', () => {
    expect(nextVelocity(0, 0, 1, 1)).toBeLessThanOrEqual(10)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/comic -- velocity`
Expected: FAIL — `Cannot find module './velocity'`.

- [ ] **Step 3: Implement `nextVelocity`**

```ts
// packages/comic/src/engine/velocity.ts
/**
 * Smoothed scroll velocity in "overall-fraction per second". EMA toward the
 * instantaneous speed so it rises while scrolling and decays when scrolling
 * slows or stops. Pure + clamped so it is unit-testable and bounded.
 */
export function nextVelocity(
  prev: number,
  prevOverall: number,
  currOverall: number,
  dtMs: number,
  smoothing = 0.2,
): number {
  const instantaneous = dtMs > 0 ? Math.abs(currOverall - prevOverall) / (dtMs / 1000) : 0
  const next = prev + smoothing * (instantaneous - prev)
  return Math.max(0, Math.min(10, next))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/comic -- velocity`
Expected: PASS.

- [ ] **Step 5: Add `MotionContext` + `useMotionState` to `PageContext.tsx`**

Append to `packages/comic/src/engine/PageContext.tsx`:

```ts
/**
 * Global motion state for effects: scroll velocity now, pointer/audio later.
 * Provided once by <ScrollComic>. Non-throwing — defaults to a still state so
 * useScrollEffect works even outside a provider.
 */
export interface MotionState {
  velocity: number
  pointer: { x: number; y: number } | null
  audio: { bass: number; mid: number; high: number; beat: boolean } | null
}

const STILL: MotionState = { velocity: 0, pointer: null, audio: null }

export const MotionContext = createContext<MotionState>(STILL)

export function useMotionState(): MotionState {
  return useContext(MotionContext)
}
```

- [ ] **Step 6: Compute + return `velocity` in `useScrollEngine.ts`**

In `packages/comic/src/engine/useScrollEngine.ts`:

Add the import at the top:
```ts
import { nextVelocity } from './velocity'
```

Change the `state` shape (line ~52) to include `velocity`:
```ts
  const [state, setState] = useState<{
    percents:    number[]
    currentPage: number
    overall:     number
    velocity:    number
  }>(() => ({ percents: phases.map(() => 0), currentPage: 0, overall: 0, velocity: 0 }))
```

Add refs alongside `ticking` (line ~58):
```ts
  const lastTs = useRef(0)
  const lastOverall = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
```

Change `update` to accept the rAF timestamp and compute velocity. Replace the `const update = () => {` signature with `const update = (ts?: number) => {`, and just before the `setState(...)` call, insert:
```ts
      const now = ts ?? (typeof performance !== 'undefined' ? performance.now() : 0)
      const dt = lastTs.current ? now - lastTs.current : 0
      const velocity = nextVelocity(state.velocity, lastOverall.current, overall, dt)
      lastTs.current = now
      lastOverall.current = overall
```
Replace the `setState((prev) => { … })` body with:
```ts
      setState((prev) => {
        if (
          prev.currentPage === sample.current &&
          Math.abs(prev.overall - overall) < 0.0005 &&
          arraysClose(prev.percents, percents) &&
          Math.abs(prev.velocity - velocity) < 0.01
        ) {
          return prev
        }
        return { percents, currentPage: sample.current, overall, velocity }
      })

      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setState((prev) => (prev.velocity === 0 ? prev : { ...prev, velocity: 0 }))
      }, 120)
```
In the scroll-effect cleanup (the `return () => window.removeEventListener('scroll', onScroll)`), also clear the timer:
```ts
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
```
Add `velocity` to the returned object:
```ts
  return {
    percents:    state.percents,
    currentPage: state.currentPage,
    overall:     state.overall,
    velocity:    state.velocity,
    totalHeight: layout.totalHeight,
  }
```
And add `velocity: number` to the `ScrollEngineState` interface (line ~5).

- [ ] **Step 7: Provide `MotionContext` in `ScrollComic.tsx`**

In `packages/comic/src/components/ScrollComic.tsx`:
- Add `MotionContext` to the PageContext import line: `import { EngineContext, PageContext, MotionContext } from '../engine/PageContext'`.
- Destructure `velocity` from the engine: change `const { percents, currentPage, overall, totalHeight } = useScrollEngine(containerRef, phases)` to include `velocity`.
- Build a memoized motion value near `engineValue`:
```ts
  const motionValue = useMemo(
    () => ({ velocity, pointer: null, audio: null }),
    [velocity],
  )
```
- Wrap the existing tree: change `<EngineContext.Provider value={engineValue}>` to nest a motion provider directly inside it:
```tsx
    <EngineContext.Provider value={engineValue}>
      <MotionContext.Provider value={motionValue}>
        {/* …existing container/stage/overlays… */}
      </MotionContext.Provider>
    </EngineContext.Provider>
```
(Move the existing children inside the new `MotionContext.Provider`; closing tags adjusted accordingly.)

- [ ] **Step 8: Pass `EffectContext` from `useScrollEffect.ts`**

In `packages/comic/src/hooks/useScrollEffect.ts`:
- Add imports: `import { usePageContext } from '../engine/PageContext'` already exists; add `import { useMotionState } from '../engine/PageContext'` (or extend the existing import).
- Add `import type { EffectContext } from '../types'`.
- In the hook body, after `const { scrollPercent } = usePageContext()`, add `const motion = useMotionState()`.
- Replace the apply `useLayoutEffect` with:
```ts
  useLayoutEffect(() => {
    const el = ref.current
    if (el && effect) {
      const ctx: EffectContext = {
        scrollPercent,
        velocity: motion.velocity,
        pointer: motion.pointer,
        audio: motion.audio,
      }
      effect.apply(el, scrollPercent, ctx)
    }
  }, [ref, effect, scrollPercent, motion.velocity, motion.pointer, motion.audio])
```

- [ ] **Step 9: Typecheck, test, build**

Run: `npm run typecheck && npm run test --workspace @badcode/comic && npm run build`
Expected: PASS — velocity tests green, all existing comic tests green, repo typechecks and builds.

- [ ] **Step 10: Commit**

```bash
git add packages/comic/src/engine/velocity.ts packages/comic/src/engine/velocity.test.ts packages/comic/src/engine/PageContext.tsx packages/comic/src/engine/useScrollEngine.ts packages/comic/src/components/ScrollComic.tsx packages/comic/src/hooks/useScrollEffect.ts
git commit -m "feat(comic): scroll velocity in MotionContext, fed to effect context

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Scroll-scrubbed `reveal` on `SpeechBubble` (A2a)

**Files:**
- Create: `packages/comic/src/bubbles/reveal.ts`
- Test: `packages/comic/src/bubbles/reveal.test.ts`
- Modify: `packages/comic/src/components/SpeechBubble.tsx` (accept `reveal`, drive motion/opacity)

**Interfaces:**
- Consumes: `computeTextEffectStyles` (`../text/computeTextStyles`), `buildTextConfig` + `RevealSegment` (`../text/segments`).
- Produces:
  - `function bubbleLocalProgress(scrollPercent: number, appearAt?: readonly [number, number]): number`
  - `interface BubbleReveal { visible: boolean; opacity: number; transform: string }`
  - `function computeBubbleReveal(scrollPercent: number, appearAt: readonly [number, number] | undefined, reveal: RevealSegment[]): BubbleReveal`
  - `SpeechBubbleProps` gains `reveal?: RevealSegment[]`.

- [ ] **Step 1: Write the failing test**

```ts
// packages/comic/src/bubbles/reveal.test.ts
import { describe, it, expect } from 'vitest'
import { bubbleLocalProgress, computeBubbleReveal } from './reveal'
import { fadeIn, scrollIn } from '../text/segments'

describe('bubbleLocalProgress', () => {
  it('maps the appearAt window to 0..1', () => {
    expect(bubbleLocalProgress(0.5, [0.4, 0.6])).toBeCloseTo(0.5)
    expect(bubbleLocalProgress(0.4, [0.4, 0.6])).toBeCloseTo(0)
    expect(bubbleLocalProgress(0.6, [0.4, 0.6])).toBeCloseTo(1)
  })
  it('returns scrollPercent unchanged with no window', () => {
    expect(bubbleLocalProgress(0.3, undefined)).toBeCloseTo(0.3)
  })
})

describe('computeBubbleReveal', () => {
  it('is invisible outside the appearAt window', () => {
    expect(computeBubbleReveal(0.1, [0.4, 0.6], [fadeIn()]).visible).toBe(false)
  })
  it('fades in across the early part of the window', () => {
    const early = computeBubbleReveal(0.41, [0.4, 0.6], [fadeIn()])
    const mid = computeBubbleReveal(0.5, [0.4, 0.6], [fadeIn()])
    expect(early.visible).toBe(true)
    expect(early.opacity).toBeLessThan(mid.opacity)
  })
  it('produces a translate transform early when scrollIn is set', () => {
    const early = computeBubbleReveal(0.41, [0.4, 0.6], [scrollIn()])
    expect(early.transform).toContain('translateY')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/comic -- reveal`
Expected: FAIL — `Cannot find module './reveal'`.

- [ ] **Step 3: Implement `bubbles/reveal.ts`**

```ts
// packages/comic/src/bubbles/reveal.ts
import { computeTextEffectStyles } from '../text/computeTextStyles'
import { buildTextConfig, type RevealSegment } from '../text/segments'

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/** Map page scroll into 0..1 progress within a bubble's appearAt window. */
export function bubbleLocalProgress(
  scrollPercent: number,
  appearAt?: readonly [number, number],
): number {
  if (!appearAt) return scrollPercent
  const [start, end] = appearAt
  const span = end - start
  return span > 0 ? clamp01((scrollPercent - start) / span) : 0
}

export interface BubbleReveal {
  visible: boolean
  opacity: number
  transform: string
}

/**
 * Scroll-scrubbed bubble reveal: drives opacity + transform through the same
 * scroll-linked text-effect engine SidePanelText uses, keyed to the bubble's
 * appearAt window. The reader scrubs the bubble in as they scroll.
 */
export function computeBubbleReveal(
  scrollPercent: number,
  appearAt: readonly [number, number] | undefined,
  reveal: RevealSegment[],
): BubbleReveal {
  const visible = appearAt ? scrollPercent >= appearAt[0] && scrollPercent <= appearAt[1] : true
  const local = bubbleLocalProgress(scrollPercent, appearAt)
  const styles = computeTextEffectStyles(local, buildTextConfig(reveal))
  return { visible, opacity: styles.opacity, transform: styles.transform }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/comic -- reveal`
Expected: PASS.

- [ ] **Step 5: Wire `reveal` into `SpeechBubble.tsx`**

In `packages/comic/src/components/SpeechBubble.tsx`:
- Add imports:
```ts
import { computeBubbleReveal } from '../bubbles/reveal'
import type { RevealSegment } from '../text/segments'
```
- Add to `SpeechBubbleProps`:
```ts
  /** Scroll-scrubbed reveal segments, e.g. [scrollIn(), pause(0.2), fadeOut()].
   *  When set, overrides the simple appearAt+fade visibility. */
  reveal?: RevealSegment[]
```
- Add `reveal` to the destructured props.
- Replace the visibility computation + container style. Replace:
```ts
  const scrollPercent = useScrollProgress()
  const { opacity, isVisible } = computeBubbleVisibility({ appearAt, fade }, scrollPercent)
  if (!isVisible) return null
```
with:
```ts
  const scrollPercent = useScrollProgress()
  const r = reveal
    ? computeBubbleReveal(scrollPercent, appearAt, reveal)
    : (() => {
        const v = computeBubbleVisibility({ appearAt, fade }, scrollPercent)
        return { visible: v.isVisible, opacity: v.opacity, transform: 'none' }
      })()
  if (!r.visible) return null
  const revealTransform = r.transform === 'none' ? '' : ` ${r.transform}`
```
- In the container `style`, change `transform: 'translate(-50%, -50%)'` to `transform: \`translate(-50%, -50%)${revealTransform}\``, and `opacity` to `r.opacity`.

- [ ] **Step 6: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/comic/src/bubbles/reveal.ts packages/comic/src/bubbles/reveal.test.ts packages/comic/src/components/SpeechBubble.tsx
git commit -m "feat(comic): scroll-scrubbed reveal segments on SpeechBubble

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Scroll-scrubbed typewriter on `SpeechBubble` (A2b)

**Files:**
- Modify: `packages/comic/src/bubbles/reveal.ts` (add `visibleWordCount`)
- Modify: `packages/comic/src/bubbles/reveal.test.ts` (add tests)
- Modify: `packages/comic/src/components/SpeechBubble.tsx` (accept `typewriter`, reveal words by scroll)

**Interfaces:**
- Consumes: `bubbleLocalProgress` (Task 3).
- Produces:
  - `function visibleWordCount(totalWords: number, localProgress: number): number`
  - `SpeechBubbleProps` gains `typewriter?: boolean`.

- [ ] **Step 1: Add the failing test**

Append to `packages/comic/src/bubbles/reveal.test.ts`:

```ts
import { visibleWordCount } from './reveal'

describe('visibleWordCount', () => {
  it('reveals no words at progress 0', () => {
    expect(visibleWordCount(5, 0)).toBe(0)
  })
  it('reveals all words at progress 1', () => {
    expect(visibleWordCount(5, 1)).toBe(5)
  })
  it('reveals a proportional prefix mid-scroll', () => {
    expect(visibleWordCount(6, 0.5)).toBe(3)
  })
  it('clamps out-of-range progress', () => {
    expect(visibleWordCount(4, -1)).toBe(0)
    expect(visibleWordCount(4, 2)).toBe(4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/comic -- reveal`
Expected: FAIL — `visibleWordCount` is not exported.

- [ ] **Step 3: Implement `visibleWordCount`**

Append to `packages/comic/src/bubbles/reveal.ts`:

```ts
/** How many leading words of a typewriter line are visible at a given local progress. */
export function visibleWordCount(totalWords: number, localProgress: number): number {
  const p = localProgress < 0 ? 0 : localProgress > 1 ? 1 : localProgress
  return Math.max(0, Math.min(totalWords, Math.ceil(p * totalWords)))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/comic -- reveal`
Expected: PASS.

- [ ] **Step 5: Wire `typewriter` into `SpeechBubble.tsx`**

In `packages/comic/src/components/SpeechBubble.tsx`:
- Add imports: `import { bubbleLocalProgress, visibleWordCount } from '../bubbles/reveal'` (extend the existing reveal import).
- Add to `SpeechBubbleProps`:
```ts
  /** Scroll-scrubbed typewriter: reveals the line word-by-word across the
   *  appearAt window. Only applies when children is a plain string. */
  typewriter?: boolean
```
- Add `typewriter` to the destructured props.
- Compute the typewritten content just before the `return`:
```ts
  let content = children
  if (typewriter && typeof children === 'string') {
    const words = children.split(' ')
    const shown = visibleWordCount(words.length, bubbleLocalProgress(scrollPercent, appearAt))
    content = words.slice(0, shown).join(' ')
  }
```
- Change `{children}` inside `<BubbleFactory>` to `{content}`.

- [ ] **Step 6: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/comic/src/bubbles/reveal.ts packages/comic/src/bubbles/reveal.test.ts packages/comic/src/components/SpeechBubble.tsx
git commit -m "feat(comic): scroll-scrubbed typewriter reveal on SpeechBubble

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Cinematic transitions — `pushIn`, `dipToBlack`, `lightDissolve` (A3)

**Files:**
- Modify: `packages/comic/src/transitions/builtins.ts` (add 3 transitions)
- Modify: `packages/comic/src/transitions/index.ts` (export them)
- Test: `packages/comic/src/transitions/builtins.test.ts` (new)

**Interfaces:**
- Consumes: `defineTransition`, `settle` (`./types`), `TransitionOptions`/`TransitionInstance`.
- Produces: `pushIn(options?)`, `dipToBlack(options?)`, `lightDissolve(options?)` → `TransitionInstance`.

- [ ] **Step 1: Write the failing test**

```ts
// packages/comic/src/transitions/builtins.test.ts
import { describe, it, expect } from 'vitest'
import { pushIn, dipToBlack, lightDissolve } from './builtins'

describe('cinematic transitions', () => {
  it('pushIn defaults to a slow 900ms and exposes a run fn', () => {
    const t = pushIn()
    expect(t.duration).toBe(900)
    expect(typeof t.run).toBe('function')
  })
  it('dipToBlack honors a custom duration', () => {
    expect(dipToBlack({ duration: 1200 }).duration).toBe(1200)
  })
  it('lightDissolve defaults to 800ms', () => {
    expect(lightDissolve().duration).toBe(800)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/comic -- builtins`
Expected: FAIL — `pushIn`/`dipToBlack`/`lightDissolve` are not exported.

- [ ] **Step 3: Implement the three transitions**

Append to `packages/comic/src/transitions/builtins.ts` (the file already has `defineTransition`, `settle`, `FILL`, and `TransitionOptions`):

```ts
/** Slow cinematic dolly: incoming scales up from slightly small while the
 *  outgoing eases back and fades. Restrained CrossZoom. */
export function pushIn(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 900
  return defineTransition(duration, async (out, inc) => {
    const a = out?.animate(
      [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.06)', opacity: 0 }],
      { duration, easing: 'ease-in-out', fill: FILL },
    )
    const b = inc.animate(
      [{ transform: 'scale(1.04)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration, easing: 'ease-in-out', fill: FILL },
    )
    await settle(a, b)
  })
}

/** Outgoing fades to black, then incoming fades up from black (two stages). */
export function dipToBlack(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 1000
  return defineTransition(duration, async (out, inc) => {
    const half = duration / 2
    if (out) {
      await settle(out.animate([{ opacity: 1 }, { opacity: 0 }], { duration: half, easing: 'ease-in', fill: FILL }))
    }
    await settle(inc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: half, easing: 'ease-out', fill: FILL }))
  })
}

/** A soft, slightly-overlapping cross-dissolve — gentler than crossfade. */
export function lightDissolve(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 800
  return defineTransition(duration, async (out, inc) => {
    const a = out?.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-out', fill: FILL })
    const b = inc.animate(
      [{ opacity: 0, offset: 0 }, { opacity: 0.15, offset: 0.4 }, { opacity: 1, offset: 1 }],
      { duration, easing: 'ease-in-out', fill: FILL },
    )
    await settle(a, b)
  })
}
```

- [ ] **Step 4: Export from `transitions/index.ts`**

In `packages/comic/src/transitions/index.ts`, add `pushIn`, `dipToBlack`, `lightDissolve` to the names imported/re-exported from `./builtins`.

- [ ] **Step 5: Run test to verify it passes + typecheck**

Run: `npm run test --workspace @badcode/comic -- builtins && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/comic/src/transitions/builtins.ts packages/comic/src/transitions/index.ts packages/comic/src/transitions/builtins.test.ts
git commit -m "feat(comic): pushIn, dipToBlack, lightDissolve cinematic transitions

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Film-grain + vignette overlay (A4)

**Files:**
- Create: `packages/comic/src/components/GrainOverlay.tsx`
- Create: `packages/comic/src/components/grain.ts` (pure intensity helper)
- Test: `packages/comic/src/components/grain.test.ts`
- Modify: `packages/comic/src/styles/comic.css` (grain/vignette classes + reduced-motion)
- Modify: `packages/comic/src/components/ScrollComic.tsx` (`grain`/`vignette` props + render overlay)

**Interfaces:**
- Consumes: `useMotionState` (Task 2) for optional velocity-linked intensity.
- Produces:
  - `function grainIntensity(velocity: number, base?: number, max?: number): number`
  - `ScrollComicProps` gains `grain?: boolean` and `vignette?: boolean`.

- [ ] **Step 1: Write the failing test**

```ts
// packages/comic/src/components/grain.test.ts
import { describe, it, expect } from 'vitest'
import { grainIntensity } from './grain'

describe('grainIntensity', () => {
  it('returns the base opacity at rest', () => {
    expect(grainIntensity(0)).toBeCloseTo(0.06)
  })
  it('rises with velocity but never exceeds the cap', () => {
    expect(grainIntensity(100)).toBeCloseTo(0.14)
    expect(grainIntensity(1)).toBeGreaterThan(0.06)
  })
  it('honors custom base/max', () => {
    expect(grainIntensity(0, 0.02, 0.2)).toBeCloseTo(0.02)
    expect(grainIntensity(100, 0.02, 0.2)).toBeCloseTo(0.2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace @badcode/comic -- grain`
Expected: FAIL — `Cannot find module './grain'`.

- [ ] **Step 3: Implement the pure helper**

```ts
// packages/comic/src/components/grain.ts
/** Grain overlay opacity: a low base that drifts up with scroll velocity,
 *  capped so it never overwhelms the art. */
export function grainIntensity(velocity: number, base = 0.06, max = 0.14): number {
  const v = Math.max(0, base + velocity * 0.02)
  return Math.min(max, v)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace @badcode/comic -- grain`
Expected: PASS.

- [ ] **Step 5: Add the overlay component**

```tsx
// packages/comic/src/components/GrainOverlay.tsx
import { useMotionState } from '../engine/PageContext'
import { grainIntensity } from './grain'

export interface GrainOverlayProps {
  grain?: boolean
  vignette?: boolean
}

/**
 * A fixed, non-interactive "degraded transmission" coat over the whole comic:
 * an animated film-grain layer (opacity drifts with scroll velocity) and a
 * static radial vignette. Both opt-in. Grain animation is disabled under
 * prefers-reduced-motion (see comic.css).
 */
export function GrainOverlay({ grain = false, vignette = false }: GrainOverlayProps) {
  const { velocity } = useMotionState()
  if (!grain && !vignette) return null
  return (
    <>
      {grain && (
        <div
          className="badcode-comic__grain"
          style={{ opacity: grainIntensity(velocity) }}
          aria-hidden
        />
      )}
      {vignette && <div className="badcode-comic__vignette" aria-hidden />}
    </>
  )
}
```

- [ ] **Step 6: Add the CSS**

Append to `packages/comic/src/styles/comic.css`:

```css
/* Film-grain + vignette overlay (opt-in via <ScrollComic grain vignette>). */
.badcode-comic__grain,
.badcode-comic__vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}
.badcode-comic__grain {
  /* Tiled SVG turbulence as a data-URI; animated cheaply via background-position. */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>");
  background-repeat: repeat;
  mix-blend-mode: overlay;
  animation: badcode-grain-shift 0.6s steps(4) infinite;
}
.badcode-comic__vignette {
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.55) 100%);
}
@keyframes badcode-grain-shift {
  0% { background-position: 0 0; }
  25% { background-position: -40px 20px; }
  50% { background-position: 30px -30px; }
  75% { background-position: -20px -40px; }
  100% { background-position: 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .badcode-comic__grain { animation: none; }
}
```

- [ ] **Step 7: Wire `grain`/`vignette` into `ScrollComic.tsx`**

In `packages/comic/src/components/ScrollComic.tsx`:
- Import: `import { GrainOverlay } from './GrainOverlay'`.
- Add to `ScrollComicProps`:
```ts
  /** Animated film-grain coat over the whole comic (opt-in). */
  grain?: boolean
  /** Radial vignette over the whole comic (opt-in). */
  vignette?: boolean
```
- Add `grain = false, vignette = false` to the destructured params.
- Render the overlay inside the `MotionContext.Provider` (so it reads velocity), as a sibling after the progress/indicator/hint UI:
```tsx
        <GrainOverlay grain={grain} vignette={vignette} />
```

- [ ] **Step 8: Typecheck, test, build**

Run: `npm run typecheck && npm run test --workspace @badcode/comic && npm run build`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add packages/comic/src/components/GrainOverlay.tsx packages/comic/src/components/grain.ts packages/comic/src/components/grain.test.ts packages/comic/src/styles/comic.css packages/comic/src/components/ScrollComic.tsx
git commit -m "feat(comic): opt-in film-grain + vignette overlay on ScrollComic

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Document Phase 1 in `AUTHORING.md`

**Files:**
- Modify: `packages/comic/AUTHORING.md`

**Interfaces:** None (documentation).

- [ ] **Step 1: Document the new capabilities**

Add to `packages/comic/AUTHORING.md`:
1. **Effect context** — under the custom-effects section, note `apply(el, scrollPercent, ctx?)` where `ctx: EffectContext = { scrollPercent, velocity, pointer, audio }`; `velocity` is smoothed scroll speed (overall-fraction/sec); `pointer`/`audio` are `null` until later phases. Show a velocity-reactive effect example.
2. **Scroll-scrubbed bubbles** — under a "Speech bubble reveal" subsection: `reveal={[scrollIn(), pause(0.2), fadeOut()]}` (same segments as `SidePanelText`, imported from `@badcode/comic/text`) and `typewriter` (string children, word-by-word by scroll). Note `reveal` overrides the legacy `appearAt`+`fade`.
3. **Cinematic transitions** — add `pushIn`, `dipToBlack`, `lightDissolve` to the transitions catalog table with signatures and one-line descriptions.
4. **Grain/vignette** — add `grain` and `vignette` to the `<ScrollComic>` prop table; note they're opt-in, honor `prefers-reduced-motion`, and grain intensity drifts with scroll velocity.

- [ ] **Step 2: Verify the doc references resolve**

Run: `grep -qE 'EffectContext|typewriter|pushIn|dipToBlack|lightDissolve|grain' packages/comic/AUTHORING.md && echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add packages/comic/AUTHORING.md
git commit -m "docs(comic): document Phase 1 effects (context, reveal, transitions, grain)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage (Phase 1 scope = A1–A4):**
- A1 Effect context `{ velocity, pointer, audio }`, back-compat → Tasks 1 + 2. ✓
- A2a scroll-scrubbed bubble reveal (reuse `computeTextEffectStyles`) → Task 3. ✓
- A2b scroll-scrubbed typewriter → Task 4. ✓
- A3 pushIn / dipToBlack / lightDissolve → Task 5. ✓
- A4 grain + vignette overlay, reduced-motion, velocity-linked intensity → Task 6. ✓
- Guardrails (opt-in, transform/filter/opacity only, reduced-motion, mobile-safe) honored across Tasks 2/6. ✓
- Docs → Task 7. ✓
- Out-of-scope (A5 pointer, A6 audio, all Tier B) → `pointer`/`audio` left `null` by design; no task touches them. ✓

**Placeholder scan:** No "TBD"/"add error handling"/"similar to". Every code step shows real code; every test step shows real assertions; component-only changes are explicitly verified by typecheck/build/manual per the Global Constraints (pure-function test rule).

**Type consistency:** `EffectContext` shape identical in Tasks 1/2/7. `MotionState`/`useMotionState` consistent across Tasks 2/6. `bubbleLocalProgress`/`computeBubbleReveal`/`visibleWordCount` names match between `reveal.ts` (Tasks 3/4) and `SpeechBubble.tsx`. `computeTextEffectStyles` (not `computeTextStyles`) used correctly. Transition factory names (`pushIn`/`dipToBlack`/`lightDissolve`) consistent across Tasks 5/7.
