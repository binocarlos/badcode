// apps/web/src/home/CameraRig.tsx
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { homeSteps, OVERVIEW_POSE } from './timeline'
import { bespokePose, interpolatePoses } from './behaviors'
import { useCameraController } from './cameraController'
import type { TimelineSample } from '@badcode/scroll-timeline'

const desiredPos  = new Vector3()
const desiredLook = new Vector3()
const lookTarget  = new Vector3(6, 0, 0)
const tmpPos      = new Vector3()
const tmpLook     = new Vector3()

const overviewPos  = new Vector3(...OVERVIEW_POSE.position)
const overviewLook = new Vector3(...OVERVIEW_POSE.lookAt)

export function CameraRig({
  sample,
  mode,
}: {
  sample: TimelineSample
  mode:   'story' | 'menu'
}) {
  const camera = useThree((s) => s.camera)
  const ctrl   = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt)

    if (mode === 'menu' || ctrl.mode === 'intro' || sample.overview) {
      desiredPos.copy(overviewPos)
      desiredLook.copy(overviewLook)
    } else {
      desiredPos.set(0, 0, 0)
      desiredLook.set(0, 0, 0)
      let totalFocus = 0

      for (let i = 0; i < homeSteps.length; i++) {
        const f = sample.focus[i]
        if (f <= 0) continue

        const step     = homeSteps[i]
        const behavior = step.cameraBehavior
          ?? (step.kind === 'event' ? interpolatePoses : bespokePose)
        const prev = homeSteps[Math.max(0, i - 1)].camera
        const next = homeSteps[Math.min(homeSteps.length - 1, i + 1)].camera
        const pose = behavior({ focus: f, prev, self: step.camera, next })

        tmpPos.set(...pose.position)
        tmpLook.set(...pose.lookAt)
        desiredPos.addScaledVector(tmpPos, f)
        desiredLook.addScaledVector(tmpLook, f)
        totalFocus += f
      }

      if (totalFocus > 0) {
        desiredPos.divideScalar(totalFocus)
        desiredLook.divideScalar(totalFocus)
      } else {
        const pose = homeSteps[sample.current].camera
        desiredPos.set(...pose.position)
        desiredLook.set(...pose.lookAt)
      }
    }

    camera.position.lerp(desiredPos, k)
    lookTarget.lerp(desiredLook, k)
    camera.lookAt(lookTarget)
  })

  return null
}
