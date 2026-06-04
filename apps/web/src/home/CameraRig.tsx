import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useCameraController } from './cameraController'

const here = new Vector3()
const ahead = new Vector3()
const desiredPos = new Vector3()
const desiredLook = new Vector3()
const lookTarget = new Vector3(6, 0, 0) // persistent, smoothed look-at
const introPos = new Vector3(6, 0, 76) // pulled-back overview that frames the whole fork
const introTarget = new Vector3(6, 0, 0)

/** Side-on follow camera. One damped move for position AND a smoothed look-at,
 * so the intro → travel handoff is a single gentle ease (no snap/double-tween). */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const ctrl = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt) // frame-rate-independent damping
    if (ctrl.mode === 'intro') {
      desiredPos.copy(introPos)
      desiredLook.copy(introTarget)
    } else {
      // Placeholder until Task 7 rewrites CameraRig with explicit pose interpolation.
      here.set(10, 9, 18)
      ahead.set(10, 6, 0)
      desiredPos.copy(here)
      desiredLook.copy(ahead)
    }
    camera.position.lerp(desiredPos, k)
    lookTarget.lerp(desiredLook, k)
    camera.lookAt(lookTarget)
  })

  return null
}
