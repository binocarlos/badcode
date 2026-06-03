import { useEffect } from 'react'
import gsap from 'gsap'
import { useCameraController } from './cameraController'

/** Drives drawProgress 0→1 on first load. Skipped when re-emerging from a node or reduced-motion. */
export function OpeningSequence() {
  const ctrl = useCameraController()
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // mode === 'travel' here means Scene re-emerged us at a node (Task 21) — don't replay the intro.
    if (reduced || ctrl.mode === 'travel') { ctrl.drawProgress = 1; return }
    ctrl.drawProgress = 0 // already the default; explicit for clarity
    const tween = gsap.to(ctrl, { drawProgress: 1, duration: 2.4, ease: 'power2.out', delay: 0.6 })
    return () => { tween.kill() }
  }, [ctrl])
  return null
}
