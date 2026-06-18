import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { OVERVIEW_POSE } from '../timeline'
import type { RigHandle } from './CameraControlsRig'
import type { Pose } from './deeplink'

export const INTRO_END: Pose = {
  position: OVERVIEW_POSE.position as [number, number, number],
  target:   OVERVIEW_POSE.lookAt as [number, number, number],
}

const DURATION = 6 // seconds

// Spark (tight on the fork) → pull back and drift to the overview.
const PATH = new CatmullRomCurve3(
  [new Vector3(0, 0, 14), new Vector3(2, 0, 34), new Vector3(6, 0, 76)],
  false, 'catmullrom', 0.5,
)
const LOOK_FROM = new Vector3(0, 0, 0)
const LOOK_TO   = new Vector3(6, 0, 0)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function IntroRail({
  rig,
  play,
  onProgress,
  onDone,
}: {
  rig: React.RefObject<RigHandle>
  play: boolean
  onProgress?: (t: number) => void
  onDone: () => void
}) {
  const camera = useThree((s) => s.camera)
  const elapsed = useRef(0)
  const done = useRef(false)

  useFrame((_, dt) => {
    if (!play || done.current) return
    elapsed.current += dt
    const p = Math.min(1, elapsed.current / DURATION)   // linear reveal clock
    const camT = easeOut(Math.min(1, p / 0.55))         // camera settles by p=0.55, then holds
    PATH.getPoint(camT, camera.position as Vector3)
    const look = LOOK_FROM.clone().lerp(LOOK_TO, camT)
    camera.lookAt(look)
    onProgress?.(p)
    if (p >= 1) {
      done.current = true
      // Seat the controls at the exact final pose, then release control.
      rig.current?.flyTo(INTRO_END, true)
      rig.current?.enable(true)
      onDone()
    }
  })

  return null
}
