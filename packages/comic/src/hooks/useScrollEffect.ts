import { useLayoutEffect, useMemo, type RefObject } from 'react'
import type { EffectInstance, EffectContext } from '../types'
import { defineEffect } from '../effects/types'
import { usePageContext, useMotionState } from '../engine/PageContext'

type EffectInput =
  | EffectInstance
  | ((el: HTMLElement, scrollPercent: number) => void)
  | null
  | undefined

function normalize(input: EffectInput): EffectInstance | null {
  if (!input) return null
  if (typeof input === 'function') return defineEffect(input)
  return input
}

/**
 * Apply a scroll-linked effect to an element, driven by the current page's
 * progress. Used internally by <Page effect={...}>, and available to custom
 * widgets. The effect's `apply` runs (synchronously, pre-paint) whenever the
 * scroll progress changes; its `cleanup` runs when the effect changes or the
 * element unmounts.
 *
 * Accepts either an EffectInstance (e.g. `zoom({...})`) or a bare apply
 * function `(el, percent) => void`.
 */
export function useScrollEffect(ref: RefObject<HTMLElement>, effectInput: EffectInput): void {
  const { scrollPercent } = usePageContext()
  const motion = useMotionState()
  const effect = useMemo(() => normalize(effectInput), [effectInput])

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

  useLayoutEffect(() => {
    return () => {
      const el = ref.current
      if (el && effect) effect.cleanup(el)
    }
  }, [ref, effect])
}
