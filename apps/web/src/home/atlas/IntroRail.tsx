import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import type { RigHandle } from './CameraControlsRig'
import type { Pose } from './deeplink'

const DURATION = 6 // seconds
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function IntroRail({
  rig,
  play,
  end,
  onProgress,
  onDone,
}: {
  rig: React.RefObject<RigHandle>
  play: boolean
  end: Pose // the overview pose to settle at (aspect-aware)
  onProgress?: (t: number) => void
  onDone: () => void
}) {
  const camera = useThree((s) => s.camera)
  const elapsed = useRef(0)
  const done = useRef(false)

  // Spark (tight on the fork) → pull back and drift to the overview.
  const path = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(0, 0, 14),
          new Vector3(end.position[0] * 0.3, 0, end.position[2] * 0.45),
          new Vector3(end.position[0], end.position[1], end.position[2]),
        ],
        false, 'catmullrom', 0.5,
      ),
    [end],
  )
  const lookTo = useMemo(() => new Vector3(end.target[0], end.target[1], end.target[2]), [end])

  useFrame((_, dt) => {
    if (!play || done.current) return
    elapsed.current += dt
    const p = Math.min(1, elapsed.current / DURATION)   // linear reveal clock
    const camT = easeOut(Math.min(1, p / 0.55))         // camera settles by p=0.55, then holds
    path.getPoint(camT, camera.position as Vector3)
    const look = new Vector3(0, 0, 0).lerp(lookTo, camT)
    camera.lookAt(look)
    onProgress?.(p)
    if (p >= 1) {
      done.current = true
      // Seat the controls at the exact final pose, then release control.
      rig.current?.flyTo(end, true)
      rig.current?.enable(true)
      onDone()
    }
  })

  return null
}
