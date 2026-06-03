import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { pointAtT } from './path'
import { useCameraController } from './cameraController'

const here = new Vector3()
const ahead = new Vector3()
const desired = new Vector3()
const introPos = new Vector3(6, 0, 76) // pulled-back overview that frames the whole fork
const introTarget = new Vector3(6, 0, 0)

/** Side-on follow camera: sits back on +Z above the local tour point, looks slightly ahead. */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const ctrl = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt) // frame-rate-independent damping
    if (ctrl.mode === 'intro') {
      camera.position.lerp(introPos, k)
      camera.lookAt(introTarget)
      return
    }
    pointAtT(ctrl.t, here)
    pointAtT(Math.min(1, ctrl.t + 0.05), ahead)
    desired.set(here.x, here.y + 3, 18) // back on +Z, slightly above
    camera.position.lerp(desired, k)
    camera.lookAt(ahead.x, ahead.y, 0)
  })

  return null
}
