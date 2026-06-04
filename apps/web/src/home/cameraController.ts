// apps/web/src/home/cameraController.ts
import { createContext, useContext } from 'react'

export type CameraMode = 'intro' | 'travel'

export interface CameraController {
  mode:         CameraMode
  drawProgress: number
  isOverview:   boolean   // true when in the top/bottom overview bands
}

export function createCameraController(): CameraController {
  // Start in overview so the full diagram is visible on load.
  return { mode: 'intro', drawProgress: 1, isOverview: true }
}

export const CameraControllerContext = createContext<CameraController | null>(null)

export function useCameraController(): CameraController {
  const c = useContext(CameraControllerContext)
  if (!c) throw new Error('useCameraController must be inside CameraControllerContext')
  return c
}
