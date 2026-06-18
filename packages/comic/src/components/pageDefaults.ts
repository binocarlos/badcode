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
