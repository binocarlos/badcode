# SP1 — Comic library ergonomics + authoring doc

> Design spec. Status: approved 2026-06-18, pending implementation plan.
> Part of a 3-sub-project effort: **SP1 (this doc)** library authoring surface →
> SP2 comic-authoring skill → SP3 image-generation loop. SP1 is the foundation
> the skills depend on.

## Problem

`@badcode/comic` is already a real, well-bounded library — clean module split
(`components/`, `effects/`, `transitions/`, `engine/`, `text/`, `bubbles/`,
`assets/`), subpath exports, and the extension hooks `defineEffect` /
`defineTransition` already exist. The gaps are **ergonomics and documentation**,
not architecture:

1. **Page boilerplate.** `apps/web/src/comics/camping/CampingComic.tsx` is 752
   lines of near-identical `<Page>` blocks — every page restates
   `phases`, `scrollDuration`, `transition={crossfade()}`, `background="#0a0f1c"`
   plus a stack of `TODO` comments. There is no comic-level default.
2. **No home for bespoke effects.** The hooks exist, but there's no convention
   for *where a given comic's own effects live*, so Claude has nowhere obvious to
   add them.
3. **No authoritative guide.** Nothing tells Claude (or a human) how to add /
   edit / reorder a page or write a custom effect at the right hook level.

The generator (`packages/cli/src/generate.ts`) *emits* the boilerplate in (1), so
it must change too, or every future Storyteller import reintroduces the mess.

This sub-project does **not** touch canon↔comic sync, `comic.meta.ts` cleanup, the
authoring skill, or the image-generation loop — those are SP2/SP3.

## Goals

- A typical page is a small, obvious edit that declares only what's unique to it.
- Each comic has a clear, documented home for its own custom effects/transitions.
- One authoritative `AUTHORING.md` that Claude follows to manipulate a comic.
- The whole stack — camping, karen, and the generator — lands on the new surface,
  with camping as the worked reference.
- No behavioral regression in the existing comics.

## Design

### 1. Page-defaults — a 3-level merge resolved in `ScrollComic`

Precedence, highest wins:

```
explicit <Page> prop  →  <ScrollComic pageDefaults>  →  library default
```

- **Library defaults:** `transition: crossfade()`, `hold: 1`, `background: undefined`.
- `ScrollComic` gains `pageDefaults?: Partial<PageProps>`.

Implementation detail that makes this non-trivial: today **`Page` only consumes
`effect` and `background` itself** — `phases` / `scrollDuration` / `transition`
are read by `ScrollComic` off `p.props` (see `ScrollComic.tsx:54-66`). So the
merge happens entirely in `ScrollComic`:

1. For each page element, build
   `resolved = { ...libraryDefaults, ...definedProps(pageDefaults), ...definedProps(p.props) }`,
   where `definedProps` strips `undefined` keys so an absent explicit prop does
   not clobber a default.
2. Use `resolved.phases` / `resolved.transition` (and `resolved.hold`) for the
   engine, exactly where `p.props.*` is read today.
3. `cloneElement(pageElements[i], { effect: resolved.effect, background: resolved.background })`
   when rendering, so the two props `Page` consumes itself reflect the merge.

`Page` itself is essentially unchanged.

### 2. Page API tidy

- Add `hold?: number` — the friendly scalar for "how many viewport-heights this
  page holds." Equivalent to today's `scrollDuration`.
- Keep `phases?: Phases` for the rare enter/exit case; still highest-precedence
  for timing (`phases` > `hold` > `scrollDuration` > default).
- Keep `scrollDuration?: number` as a **deprecated alias** (JSDoc `@deprecated`)
  so nothing silently breaks. Generator and migrated comics emit `hold`.

### 3. Colocated `effects.ts` convention

- Each comic gets `apps/web/src/comics/<name>/effects.ts`, exporting named custom
  effects/transitions built with `defineEffect` / `defineTransition`. The comic
  `.tsx` imports them: `import { rainShudder } from './effects'`.
- **Graduation rule:** when a *second* comic wants the same effect, promote it
  into `packages/comic/src/effects` (or `/transitions`) and re-export from the
  subpath. Documented in `AUTHORING.md`.
- Seed `comics/camping/effects.ts` with **one real, page-wired custom effect** so
  the doc points at a live example rather than dead code. (Exact effect chosen
  during implementation; must be genuinely used on a camping page.)

### 4. `packages/comic/AUTHORING.md` — the guide for Claude

Audience: Claude-first (SP2's skill will reference it), human-readable too.
In-code JSDoc remains the precise contract; this is the narrative guide. Covers:

- **Mental model:** `ScrollComic` › `Page` › three layers (widget / bubble /
  side-text). Effects are scroll-linked and per-page; transitions fire on
  page-change (not scroll-linked).
- **Minimal page recipe** + full `Page` / `ScrollComic` prop reference.
- **`pageDefaults` and the precedence rule.**
- **Add / insert / reorder a page** (pages are positional children).
- **Write a custom effect/transition:** `defineEffect` / `defineTransition`
  signatures, where they live (`effects.ts`), the graduation rule.
- **Catalog of every built-in** with one-line description + signature: effects
  (`zoom`, `grayscale`, `pan`, `zoomInOut`, `scale`), transitions (`crossfade`,
  `iris`, `fadeOutFadeIn`, `slideOver`, `blur`, `wipe`), text segments
  (`scrollIn`, `fadeIn`, `fadeOut`, `pause`).
- **Asset wiring:** `createComic(manifest)` → `comic.resolve(...)` /
  `comic.resolveAnimation(...)`.

Linked from `CLAUDE.md`'s repo map.

### 5. Generator (`packages/cli/src/generate.ts`)

- Emit `<ScrollComic progressBar pageIndicator scrollHint pageDefaults={{ background: '#0a0f1c' }}>`.
- Emit lean pages: `<Page hold={1.4}>` (opener `<Page hold={2.8} effect={zoom({ amount: 1.3 })}>`).
- Drop the repeated per-page `transition` / `background` and the wall of `TODO`
  comments (keep at most a single concise content TODO where genuinely useful).
- Scaffold a starter `effects.ts` (with a commented template) alongside the
  generated files.
- Update `generate.test.ts` snapshots/expectations accordingly.

### 6. Migrate camping + karen

Rewrite `CampingComic.tsx` and `KarenComic.tsx` onto `pageDefaults` + `hold` +
`effects.ts`, preserving exact behavior:

- merged-animation pages (a02, a09) keep their single-play timing,
- all `appearAt` bubble timings unchanged,
- opener keeps `zoom({ amount: 1.3 })` at `hold: 2.8`.

Camping's ~752 lines collapse to roughly a third.

**Behavior-parity note:** the library default `crossfade()` now applies to page 1.
Transitions only fire on page-change, so it's inert on initial load; but to
preserve the exact backward-scroll cut into the opener, set `transition={null}`
on the opener page explicitly.

## Testing

- **Unit:** test the merge/precedence logic in `ScrollComic` (vitest, alongside
  `engine/useTransitions.test.ts`): explicit beats `pageDefaults` beats library
  default, for each of `transition` / `hold` (timing) / `effect` / `background`;
  `undefined` explicit props don't clobber defaults.
- **Generator:** update and pass `generate.test.ts`.
- **Whole-repo:** `npm run typecheck` and `npm run build` across workspaces.
- **Manual parity:** load `/comics/camping`, confirm opener, the two merged
  animation beats, bubble timings, and transitions match current behavior.

## Out of scope (later sub-projects)

- Canon↔comic sync; `comic.meta.ts` cleanup (placeholder scenes, empty paths).
- SP2: the comic-authoring Claude skill.
- SP3: the ideate → Gemini/Flow prompt → page image-generation loop.
