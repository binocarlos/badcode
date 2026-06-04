import { useEffect } from 'react'
import { useCameraController } from './cameraController'

/**
 * If re-emerging from a comic (ctrl.mode already 'travel'), ensure drawProgress
 * is at 1 so all nodes are visible. Scroll drives drawProgress in story mode;
 * menu mode sets it directly in Scene. Nothing else to do here.
 */
export function OpeningSequence() {
  const ctrl = useCameraController()
  useEffect(() => {
    if (ctrl.mode === 'travel') ctrl.drawProgress = 1
  }, [ctrl])
  return null
}
