import { createContext, useContext } from 'react'

export type CameraMode = 'intro' | 'travel'

/** Mutable, ref-like controller shared by the rig and UI. Not React state — read in useFrame. */
export interface CameraController {
  /** Normalized tour position [0,1], the single source of truth for the camera. */
  t: number
  mode: CameraMode
  /** Spine draw progress [0,1] for the opening sequence. */
  drawProgress: number
}

export function createCameraController(): CameraController {
  // drawProgress starts at 0 so the opening sequence (Task 20) can draw the spine in.
  // The reduced-motion and re-emerge paths set it to 1 immediately.
  return { t: 0, mode: 'intro', drawProgress: 0 }
}

export const CameraControllerContext = createContext<CameraController | null>(null)

export function useCameraController(): CameraController {
  const c = useContext(CameraControllerContext)
  if (!c) throw new Error('useCameraController must be used within CameraControllerContext')
  return c
}
