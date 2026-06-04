// apps/web/src/home/cameraController.ts
import { createContext, useContext } from 'react'

export type CameraMode = 'intro' | 'travel'

/** Mutable ref-like controller shared by the rig, the opening sequence, and Chrome. */
export interface CameraController {
  mode:         CameraMode
  drawProgress: number
}

export function createCameraController(): CameraController {
  return { mode: 'intro', drawProgress: 0 }
}

export const CameraControllerContext = createContext<CameraController | null>(null)

export function useCameraController(): CameraController {
  const c = useContext(CameraControllerContext)
  if (!c) throw new Error('useCameraController must be inside CameraControllerContext')
  return c
}
