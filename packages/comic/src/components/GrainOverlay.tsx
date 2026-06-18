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
