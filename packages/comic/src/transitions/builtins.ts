import type { TransitionInstance } from '../types'
import { defineTransition, settle } from './types'

/** Options common to every built-in transition. */
export interface TransitionOptions {
  /** Duration in milliseconds. */
  duration?: number
}

const FILL = 'forwards' as const

/**
 * Instant cut — no animation. This is the default when no transition is set;
 * the incoming page simply appears.
 */
export function replace(): TransitionInstance {
  return defineTransition(0, async () => {})
}

/** Outgoing fades out while incoming fades in. */
export function crossfade(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  return defineTransition(duration, async (out, inc) => {
    const a = out?.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in-out', fill: FILL })
    const b = inc.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease-in-out', fill: FILL })
    await settle(a, b)
  })
}

/** Incoming slides over the top, in the scroll direction. */
export function slideOver(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  return defineTransition(duration, async (_out, inc, direction) => {
    const startY = direction === 'forward' ? '100%' : '-100%'
    const a = inc.animate(
      [{ transform: `translateY(${startY})` }, { transform: 'translateY(0)' }],
      { duration, easing: 'ease-out', fill: FILL },
    )
    await settle(a)
  })
}

/** Outgoing is pushed out as incoming slides in from the opposite side. */
export function slidePush(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  return defineTransition(duration, async (out, inc, direction) => {
    const dir = direction === 'forward' ? -1 : 1
    const a = out?.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${dir * 100}%)` }],
      { duration, easing: 'ease-in-out', fill: FILL },
    )
    const b = inc.animate(
      [{ transform: `translateX(${-dir * 100}%)` }, { transform: 'translateX(0)' }],
      { duration, easing: 'ease-in-out', fill: FILL },
    )
    await settle(a, b)
  })
}

/** Outgoing scales up and fades; incoming scales up from small. */
export function zoom(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  return defineTransition(duration, async (out, inc) => {
    const a = out?.animate(
      [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.2)', opacity: 0 }],
      { duration: duration / 2, easing: 'ease-in', fill: FILL },
    )
    const b = inc.animate(
      [{ transform: 'scale(0.5)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration, easing: 'ease-out', fill: FILL },
    )
    await settle(a, b)
  })
}

/** Outgoing spins away; incoming spins in. */
export function spin(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  return defineTransition(duration, async (out, inc) => {
    const a = out?.animate(
      [
        { transform: 'rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'rotate(360deg) scale(0)', opacity: 0 },
      ],
      { duration: duration / 2, easing: 'ease-in', fill: FILL },
    )
    const b = inc.animate(
      [
        { transform: 'rotate(-360deg) scale(0)', opacity: 0 },
        { transform: 'rotate(0deg) scale(1)', opacity: 1 },
      ],
      { duration, easing: 'ease-out', fill: FILL },
    )
    await settle(a, b)
  })
}

export interface BlurOptions extends TransitionOptions {
  /** Maximum blur radius in px (default 20). */
  amount?: number
}

/** Cross-blur: outgoing blurs out, incoming sharpens in. */
export function blur(options: BlurOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  const amount = options.amount ?? 20
  return defineTransition(duration, async (out, inc) => {
    const a = out?.animate(
      [{ filter: 'blur(0px)', opacity: 1 }, { filter: `blur(${amount}px)`, opacity: 0 }],
      { duration: duration / 2, easing: 'ease-in', fill: FILL },
    )
    const b = inc.animate(
      [{ filter: `blur(${amount}px)`, opacity: 0 }, { filter: 'blur(0px)', opacity: 1 }],
      { duration, easing: 'ease-out', fill: FILL },
    )
    await settle(a, b)
  })
}

export type WipeDirection = 'left' | 'right' | 'top' | 'bottom'

export interface WipeOptions extends TransitionOptions {
  /** Edge the wipe travels from (default 'left'). */
  direction?: WipeDirection
}

const WIPE_CLIPS: Record<WipeDirection, [string, string]> = {
  left: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
  right: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
  top: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
  bottom: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
}

/** Incoming is revealed by a directional wipe. */
export function wipe(options: WipeOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  const [from, to] = WIPE_CLIPS[options.direction ?? 'left']
  return defineTransition(duration, async (_out, inc) => {
    const a = inc.animate([{ clipPath: from }, { clipPath: to }], {
      duration,
      easing: 'ease-out',
      fill: FILL,
    })
    await settle(a)
  })
}

/** Incoming is revealed through an expanding circle (Looney-Tunes iris). */
export function iris(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  return defineTransition(duration, async (_out, inc) => {
    const a = inc.animate(
      [{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(150% at 50% 50%)' }],
      { duration, easing: 'ease-out', fill: FILL },
    )
    await settle(a)
  })
}

/** 3D card flip: outgoing turns away, incoming turns in. */
export function flip(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  const half = duration / 2
  return defineTransition(duration, async (out, inc) => {
    inc.style.opacity = '0'
    if (out) {
      await settle(
        out.animate(
          [
            { transform: 'perspective(1000px) rotateY(0deg)' },
            { transform: 'perspective(1000px) rotateY(90deg)' },
          ],
          { duration: half, easing: 'ease-in', fill: FILL },
        ),
      )
      out.style.opacity = '0'
    }
    inc.style.opacity = '1'
    await settle(
      inc.animate(
        [
          { transform: 'perspective(1000px) rotateY(-90deg)' },
          { transform: 'perspective(1000px) rotateY(0deg)' },
        ],
        { duration: half, easing: 'ease-out', fill: FILL },
      ),
    )
  })
}

/** Outgoing fully fades out, then incoming fades in (sequential, not cross). */
export function fadeOutFadeIn(options: TransitionOptions = {}): TransitionInstance {
  const duration = options.duration ?? 600
  const half = duration / 2
  return defineTransition(duration, async (out, inc) => {
    inc.style.opacity = '0'
    if (out) {
      await settle(out.animate([{ opacity: 1 }, { opacity: 0 }], { duration: half, easing: 'ease-in', fill: FILL }))
    }
    await settle(inc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: half, easing: 'ease-out', fill: FILL }))
  })
}
