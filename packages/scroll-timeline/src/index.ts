/** A step's scroll-budget in relative units (1 = one global standard unit). */
export interface Phases { enter: number; hold: number; exit: number }

/** Minimal step definition — consumers extend this with domain-specific fields. */
export interface StepDef { id: string; phases: Phases }

/** Computed scroll offsets for a single step — all values are absolute px. */
export interface StepLayout {
  id: string
  enterStart: number
  holdStart:  number
  exitStart:  number
  end:        number
}

/** Full timeline layout, stable across frames when inputs haven't changed. */
export interface TimelineLayout {
  steps:       StepLayout[]
  totalHeight: number
}

/** Per-frame sample — returned by sampleTimeline on every scroll event. */
export interface TimelineSample {
  /** focus[i] ∈ [0,1]: trapezoid — rises over enter, = 1 through hold, falls over exit. */
  focus:     number[]
  /** Index of the step with the highest focus (nearest step during overview). */
  current:   number
  /** True when scroll is before step 0's enter or after the last step's exit. */
  overview:  boolean
  /** 0..1 across the full scroll track (for progress indicators). */
  position:  number
  direction: 'fwd' | 'bwd' | 'none'
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/**
 * Convert phase budgets into absolute scroll offsets.
 *
 * unitPx = one relative unit in pixels (pass `window.innerHeight` for UNIT_VH = 1).
 * Adds 0.5 × unitPx bookend pads before step 0 and after the last step.
 */
export function layoutTimeline(
  steps: readonly StepDef[],
  unitPx: number,
): TimelineLayout {
  const pad = 0.5 * unitPx
  let offset = pad
  const layouts: StepLayout[] = []
  for (const step of steps) {
    const enterStart = offset
    const holdStart  = enterStart + step.phases.enter * unitPx
    const exitStart  = holdStart  + step.phases.hold  * unitPx
    const end        = exitStart  + step.phases.exit  * unitPx
    layouts.push({ id: step.id, enterStart, holdStart, exitStart, end })
    offset = end
  }
  return { steps: layouts, totalHeight: offset + pad }
}

/**
 * Sample the timeline at a given scroll position.
 *
 * scrollPx: raw scroll offset relative to the timeline start.
 * prevScrollPx: previous value, used to compute direction.
 */
export function sampleTimeline(
  layout: TimelineLayout,
  scrollPx: number,
  prevScrollPx?: number,
): TimelineSample {
  const { steps } = layout
  const focus: number[] = new Array(steps.length).fill(0)
  let current = 0
  let maxFocus = -1

  for (let i = 0; i < steps.length; i++) {
    const { enterStart, holdStart, exitStart, end } = steps[i]
    let f = 0
    if (scrollPx >= holdStart && scrollPx < exitStart) {
      f = 1
    } else if (scrollPx >= enterStart && scrollPx < holdStart) {
      const span = holdStart - enterStart
      f = span > 0 ? clamp01((scrollPx - enterStart) / span) : 1
    } else if (scrollPx >= exitStart && scrollPx < end) {
      const span = end - exitStart
      f = span > 0 ? clamp01((end - scrollPx) / span) : 1
    }
    focus[i] = f
    if (f > maxFocus) { maxFocus = f; current = i }
  }

  const first = steps[0]
  const last  = steps[steps.length - 1]
  const overview =
    steps.length === 0 ||
    scrollPx < first.enterStart ||
    scrollPx >= last.end

  if (overview) {
    current = scrollPx < (first?.enterStart ?? 0) ? 0 : steps.length - 1
  }

  const position = layout.totalHeight > 0 ? clamp01(scrollPx / layout.totalHeight) : 0

  let direction: 'fwd' | 'bwd' | 'none' = 'none'
  if (prevScrollPx !== undefined) {
    if (scrollPx > prevScrollPx)      direction = 'fwd'
    else if (scrollPx < prevScrollPx) direction = 'bwd'
  }

  return { focus, current, overview, position, direction }
}
