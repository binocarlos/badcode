// apps/web/src/home/CameraRig.tsx
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { homeSteps, OVERVIEW_POSE, type CameraPose } from './timeline'
import { useCameraController } from './cameraController'
import type { TimelineSample } from '@badcode/scroll-timeline'

const desiredPos  = new Vector3()
const desiredLook = new Vector3()
const lookTarget  = new Vector3(6, 0, 0)

function poseToVectors(pose: CameraPose): [Vector3, Vector3] {
  return [
    new Vector3(...pose.position),
    new Vector3(...pose.lookAt),
  ]
}

const [overviewPos, overviewLook] = poseToVectors(OVERVIEW_POSE)

/**
 * Drives the camera from the timeline sample each frame.
 * overview=true → ease to OVERVIEW_POSE (the zoomed-out bookend).
 * overview=false → blend between neighbouring step poses weighted by focus[].
 *
 * Because the hand-off is sequential, at most one focus[i] > 0 at a time, so the
 * blend is simply: desiredPos = homeSteps[current].camera.position (during hold).
 * During enter/exit, focus[prev] falls while focus[next] rises — they interpolate
 * naturally without extra code.
 */
export function CameraRig({ sample }: { sample: TimelineSample }) {
  const camera = useThree((s) => s.camera)
  const ctrl   = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt) // frame-rate-independent lerp factor

    if (ctrl.mode === 'intro' || sample.overview) {
      desiredPos.copy(overviewPos)
      desiredLook.copy(overviewLook)
    } else {
      // Weighted blend of all step poses by focus.
      desiredPos.set(0, 0, 0)
      desiredLook.set(0, 0, 0)
      let totalFocus = 0
      for (let i = 0; i < homeSteps.length; i++) {
        const f = sample.focus[i]
        if (f <= 0) continue
        const [p, l] = poseToVectors(homeSteps[i].camera)
        desiredPos.addScaledVector(p, f)
        desiredLook.addScaledVector(l, f)
        totalFocus += f
      }
      if (totalFocus > 0) {
        desiredPos.divideScalar(totalFocus)
        desiredLook.divideScalar(totalFocus)
      } else {
        // Between steps (both focus = 0) — hold nearest step's pose.
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
