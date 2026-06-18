import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import { altitudeToLod, type Lod } from './navState'
import type { Pose } from './deeplink'

export type RigHandle = {
  flyTo: (pose: Pose, immediate?: boolean) => void
  enable: (on: boolean) => void
}

export const CameraControlsRig = forwardRef<
  RigHandle,
  { onLod: (lod: Lod) => void; enabled: boolean }
>(function CameraControlsRig({ onLod, enabled }, ref) {
  const controls = useRef<CameraControlsImpl | null>(null)
  const camera = useThree((s) => s.camera)
  const lastLod = useRef<Lod | null>(null)

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
      maxDistance={90}
      dollyToCursor
    />
  )
})
