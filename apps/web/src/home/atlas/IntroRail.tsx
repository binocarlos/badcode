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

const DURATION = 5 // seconds

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
  onDone,
}: {
  rig: React.RefObject<RigHandle>
  play: boolean
  onDone: () => void
}) {
  const camera = useThree((s) => s.camera)
  const elapsed = useRef(0)
  const done = useRef(false)

  useFrame((_, dt) => {
    if (!play || done.current) return
    elapsed.current += dt
    const t = easeOut(Math.min(1, elapsed.current / DURATION))
    PATH.getPoint(t, camera.position as Vector3)
    const look = LOOK_FROM.clone().lerp(LOOK_TO, t)
    camera.lookAt(look)
    if (t >= 1) {
      done.current = true
      // Seat the controls at the exact final pose, then release control.
      rig.current?.flyTo(INTRO_END, true)
      rig.current?.enable(true)
      onDone()
    }
  })

  return null
}
