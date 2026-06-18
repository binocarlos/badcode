import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import CameraControlsImpl from 'camera-controls'
import { altitudeToLod, type Lod } from './navState'
import type { Pose } from './deeplink'

export type RigHandle = {
  flyTo: (pose: Pose, immediate?: boolean) => void
  enable: (on: boolean) => void
}

export const CameraControlsRig = forwardRef<
  RigHandle,
  { onLod: (lod: Lod) => void; enabled: boolean; maxDistance?: number }
>(function CameraControlsRig({ onLod, enabled, maxDistance = 90 }, ref) {
  const controls = useRef<CameraControlsImpl | null>(null)
  const camera = useThree((s) => s.camera)
  const lastLod = useRef<Lod | null>(null)

  // Lock to a face-on star-chart: drag pans, wheel zooms, NO orbit.
  // (The map lives on the z=0 plane; orbiting just reveals it's flat.)
  useEffect(() => {
    const c = controls.current
    if (!c) return
    c.mouseButtons.left   = CameraControlsImpl.ACTION.TRUCK
    c.mouseButtons.right  = CameraControlsImpl.ACTION.TRUCK
    c.mouseButtons.wheel  = CameraControlsImpl.ACTION.DOLLY
    c.touches.one         = CameraControlsImpl.ACTION.TOUCH_TRUCK
    c.touches.two         = CameraControlsImpl.ACTION.TOUCH_DOLLY_TRUCK
    c.touches.three       = CameraControlsImpl.ACTION.TOUCH_TRUCK
  }, [])

  useImperativeHandle(ref, () => ({
    flyTo: (pose, immediate = false) => {
      controls.current?.setLookAt(
        pose.position[0], pose.position[1], pose.position[2],
        pose.target[0], pose.target[1], pose.target[2],
        !immediate,
      )
    },
    enable: (on) => { if (controls.current) controls.current.enabled = on },
  }))

  useFrame(() => {
    const d = camera.position.length()
    const lod = altitudeToLod(d)
    if (lod !== lastLod.current) {
      lastLod.current = lod
      onLod(lod)
    }
  })

  return (
    <CameraControls
      ref={controls}
      enabled={enabled}
      minDistance={8}
      maxDistance={maxDistance}
      polarRotateSpeed={0}
      azimuthRotateSpeed={0}
      dollyToCursor
    />
  )
})
