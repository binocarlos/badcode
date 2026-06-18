# @badcode/comic — Authoring Guide

How to write and edit comics in code. Read this before touching any comic file.

---

## Mental model

```
<ScrollComic>          ← scroll-driven container; maps scroll → page progress
  <Page>               ← one page; owns timing, transition, effect, background
    <ImageWidget>      ┐ widget layer — fills the stage; effect applies here
    <AnimationWidget>  ┘
    <SpeechBubble>     ┐ bubble layer — overlaid absolutely; scroll-gated
    <NarrationBox>     ┘
    <SidePanelText>    ← side layer — a panel over the widget (left/right/bottom)
  </Page>
</ScrollComic>
```

**Effects** are scroll-linked: the engine calls `apply(el, scrollPercent)` every animation frame while the page is active. Effects run on the widget element.

**Transitions** fire once when the reader scrolls from one page to the next. They animate the outgoing and incoming page layers using the Web Animations API, then resolve.

---

## Minimal page

```tsx
import { ScrollComic, Page, ImageWidget, createComic } from '@badcode/comic'
import manifest from './assets.manifest.json'

const comic = createComic(manifest)

export function MyComic() {
  return (
    <ScrollComic>
      <Page>
        <ImageWidget src={comic.resolve('img/i01.png')} />
      </Page>
    </ScrollComic>
  )
}
```

Library defaults (no props needed):
- **transition** — `crossfade()` (300 ms cross-fade between pages)
- **hold** — `1` (one viewport-height of scroll per page)
- **background** — `undefined` (transparent; the page body background shows through)

---

## `pageDefaults` + precedence

`<ScrollComic pageDefaults={{ … }}>` sets comic-wide defaults that each `<Page>` inherits. A prop on a `<Page>` always wins.

**Full precedence (highest first):**

```
explicit <Page> prop  →  pageDefaults  →  library default
```

**Timing** (`hold`, `phases`, `scrollDuration`):
- `phases` > `hold` > `scrollDuration` within one level.
- Any timing prop on a page fully determines that page's timing — the timing levels do not mix (e.g. if a page sets `hold`, the `pageDefaults.phases` is ignored entirely for that page).
- A `hold` value ≤ 0 is clamped to 1.

**Transition** sentinel: `transition={null}` means "no transition — instant cut". It does **not** fall through to `pageDefaults` or the library default. Absent/omitted means "inherit".

**Typical setup:**

```tsx
<ScrollComic
  progressBar
  pageIndicator
  scrollHint
  pageDefaults={{ background: '#0a0f1c' }}
>
  {/* Opener: zoom in, hard cut (no crossfade). */}
  <Page hold={2.8} effect={zoom({ amount: 1.3 })} transition={null}>
    <AnimationWidget animation={comic.resolveAnimation('anim/a01')} />
  </Page>

  {/* Standard pages inherit background and the default crossfade. */}
  <Page hold={1.4}>
    <ImageWidget src={comic.resolve('img/i02.png')} />
  </Page>
</ScrollComic>
```

---

## `Page` / `ScrollComic` prop reference

### `<Page>` props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `hold` | `number` | `1` | Viewport-heights of scroll this page occupies. |
| `phases` | `{ enter, hold, exit }` | derived from `hold` | Full three-phase scroll budget. Overrides `hold`. |
| `scrollDuration` | `number` | — | **Deprecated.** Alias for `hold`; kept for back-compat. |
| `transition` | `TransitionInstance \| null` | `crossfade()` | Transition into this page. `null` = instant cut. |
| `effect` | `EffectInstance \| fn \| null` | `null` | Scroll-linked effect on the widget. |
| `background` | `string` | `undefined` | CSS color shown behind the widget. |
| `children` | `ReactNode` | required | `ImageWidget`/`AnimationWidget`, `SpeechBubble`/`NarrationBox`, `SidePanelText`. |

### `<ScrollComic>` props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `progressBar` | `boolean` | `false` | Thin progress bar at the top. |
| `pageIndicator` | `boolean` | `false` | "01 / 04" counter bottom-left. |
| `scrollHint` | `boolean` | `false` | "Scroll to explore" hint until the reader scrolls. |
| `hintText` | `string` | `'Scroll to explore ↓'` | Override the hint text. |
| `pageDefaults` | `Partial<PageProps>` | `{}` | Comic-wide defaults inherited by every `<Page>`. |
| `children` | `ReactNode` | required | A sequence of `<Page>` elements. |

---

## Add / insert / reorder a page

Pages are positional children — their order in JSX is their order in the comic. To insert a page, write a new `<Page>` in the right place. To reorder, move the `<Page>` element. There is no ID system; the index is the address.

```tsx
<ScrollComic pageDefaults={{ background: '#111' }}>
  <Page hold={1.4}>…page 1…</Page>
  {/* Insert a new page 2 here: */}
  <Page hold={1.4}>
    <ImageWidget src={comic.resolve('img/i_new.png')} />
  </Page>
  <Page hold={1.4}>…was page 2, now page 3…</Page>
</ScrollComic>
```

---

## Custom effects and transitions

### Effects

Use `defineEffect` from `@badcode/comic/effects`:

```ts
import { defineEffect } from '@badcode/comic/effects'

export const slideUp = (px = 80) =>
  defineEffect((el, p) => {
    el.style.transform = `translateY(${(1 - p) * px}px)`
  })
```

`apply(el, scrollPercent)` runs every frame; `scrollPercent` is 0 at the start of the page's scroll and 1 at the end. An optional second argument is a `cleanup` function that resets whatever `apply` touched (the default cleanup clears `transform`, `transformOrigin`, `filter`, `opacity`, and `transition`).

**Worked example:** `apps/web/src/comics/camping/effects.ts` — the `trip` effect (hue drift + breathing scale) shows the full pattern.

### Transitions

Use `defineTransition` from `@badcode/comic/transitions`:

```ts
import { defineTransition } from '@badcode/comic/transitions'

export const flash = (duration = 200) =>
  defineTransition(duration, async (outgoing, incoming, direction) => {
    await incoming.animate([{ opacity: 0 }, { opacity: 1 }], { duration, fill: 'forwards' }).finished
  })
```

`run(outgoing, incoming, direction)` receives the outgoing page's DOM element (may be `null` on the first transition), the incoming page's element, and the scroll direction (`'forward'` or `'backward'`). Animate using the Web Animations API and return a Promise that resolves when the transition is done. The engine resets inline styles afterward.

### Where to put them

Custom effects and transitions live in `apps/web/src/comics/<comic-name>/effects.ts`, imported directly into the comic's `.tsx`:

```ts
import { trip } from './effects'
// ...
<Page effect={trip()}>…</Page>
```

**Graduation rule:** once a second comic wants the same effect or transition, move it into `packages/comic/src/effects/` or `packages/comic/src/transitions/` and export from the relevant `index.ts`. Until then, keep it local.

---

## Built-in catalog

### Effects — `import { … } from '@badcode/comic/effects'`

| Name | Signature | What it does |
| --- | --- | --- |
| `zoom` | `zoom({ amount?, focal?, range? })` | Scales the widget toward a focal point as the page scrolls. |
| `grayscale` | `grayscale({ amount? })` | Desaturates the widget; `amount` controls max desaturation (0..1). |
| `pan` | `pan({ x?, y?, range? })` | Translates the widget (parallax pan effect). |
| `zoomInOut` | `zoomInOut({ amount?, range? })` | Zooms in during the first half of scroll, out during the second. |
| `scale` | `scale({ from?, to?, range? })` | Linear scale from `from` to `to` over `range`. |
| `defineEffect` | `defineEffect(apply, cleanup?)` | Build a custom effect — see Custom effects above. |

### Transitions — `import { … } from '@badcode/comic/transitions'`

| Name | Signature | What it does |
| --- | --- | --- |
| `crossfade` | `crossfade({ duration? })` | Cross-dissolve between outgoing and incoming. **Library default.** |
| `iris` | `iris({ duration? })` | Circular iris wipe from center. |
| `fadeOutFadeIn` | `fadeOutFadeIn({ duration? })` | Fade out, then fade in (staged). |
| `slideOver` | `slideOver({ duration?, direction? })` | Incoming slides over the outgoing page. |
| `blur` | `blur({ duration?, amount? })` | Blur-out then blur-in. |
| `wipe` | `wipe({ duration?, direction? })` | Directional wipe. |
| `defineTransition` | `defineTransition(duration, run)` | Build a custom transition — see Custom transitions above. |

### Text segments — `import { … } from '@badcode/comic/text'`

Used in `<SidePanelText reveal={[…]}>` to build scroll-linked text reveals:

| Name | Signature | What it does |
| --- | --- | --- |
| `scrollIn` | `scrollIn(portion?)` | Text scrolls up into view over `portion` of the page scroll. |
| `fadeIn` | `fadeIn(portion?)` | Text fades in over `portion`. |
| `fadeOut` | `fadeOut(portion?)` | Text fades out over `portion`. |
| `pause` | `pause(portion?)` | Text stays fully visible for `portion` of the scroll budget. |

---

## Asset wiring

Comics load assets from a manifest generated by the CLI asset pipeline.

```ts
import { createComic } from '@badcode/comic'
import manifest from './assets.manifest.json'

const comic = createComic(manifest)

// Resolve a static image (returns { thumb, low, high, width, height })
comic.resolve('img/i01.png')

// Resolve an animation (returns { thumb, poster, renditions, width, height, frameCount, fps })
comic.resolveAnimation('anim/a01')
```

Pass the resolved objects directly to the widgets:

```tsx
<ImageWidget src={comic.resolve('img/i01.png')} />
<AnimationWidget animation={comic.resolveAnimation('anim/a01')} />
```

`createComic` handles thumb-hash placeholders, CDN base URLs, and multi-resolution renditions automatically. Do not hard-code asset URLs.
