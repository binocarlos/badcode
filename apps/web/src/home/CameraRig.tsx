// apps/web/src/home/CameraRig.tsx
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { OVERVIEW_POSE } from './timeline'
import { useCameraController } from './cameraController'

const desiredPos  = new Vector3()
const desiredLook = new Vector3()
const lookTarget  = new Vector3(6, 0, 0)

// Camera path: drawProgress (0-1) → camera pose.
// Keyframes are placed just after each node's drawThreshold so the camera
// arrives at a good vantage point when the node lights up.
const KF: Array<{
  p:    number
  pos:  [number, number, number]
  look: [number, number, number]
}> = [
  { p: 0.00, pos: [6,   0,  76], look: [6,   0,  0] }, // overview
  { p: 0.16, pos: [-18, 2,  36], look: [-18,  0,  0] }, // gold-standard
  { p: 0.27, pos: [-10, 2,  36], look: [-10,  0,  0] }, // git-born
  { p: 0.35, pos: [-4,  2,  36], look: [-4,   0,  0] }, // financial-crisis
  { p: 0.40, pos: [6,   0,  52], look: [6,    0,  0] }, // fork — zoom out to see split
  { p: 0.51, pos: [10,  9,  22], look: [10,   6,  0] }, // camping
  { p: 0.59, pos: [18,  12, 22], look: [18,   6,  0] }, // karen
  { p: 0.67, pos: [25,  10, 22], look: [25,   6,  0] }, // emperor's coin
  { p: 0.72, pos: [30,  9,  25], look: [30,   6,  0] }, // storyverse
  { p: 0.80, pos: [6,   0,  52], look: [6,    0,  0] }, // back to fork
  { p: 0.89, pos: [18, -9,  22], look: [18,  -6,  0] }, // optimistic lens
  { p: 1.00, pos: [30, -8,  25], look: [30,  -6,  0] }, // future proof
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function targetAt(p: number) {
  if (p <= KF[0].p) return KF[0]
  const last = KF[KF.length - 1]
  if (p >= last.p) return last
  for (let i = 0; i < KF.length - 1; i++) {
    const a = KF[i], b = KF[i + 1]
    if (p <= b.p) {
      const t = (p - a.p) / (b.p - a.p)
      return {
        pos:  [lerp(a.pos[0],  b.pos[0],  t), lerp(a.pos[1],  b.pos[1],  t), lerp(a.pos[2],  b.pos[2],  t)] as [number,number,number],
        look: [lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t)] as [number,number,number],
      }
    }
  }
  return last
}

export function CameraRig({ mode }: { mode: 'story' | 'menu' }) {
  const camera = useThree((s) => s.camera)
  const ctrl   = useCameraController()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt) // frame-rate-independent lerp

    const tgt = mode === 'menu'
      ? { pos: OVERVIEW_POSE.position, look: OVERVIEW_POSE.lookAt }
      : targetAt(ctrl.drawProgress)

    desiredPos.set(tgt.pos[0], tgt.pos[1], tgt.pos[2])
    desiredLook.set(tgt.look[0], tgt.look[1], tgt.look[2])
    camera.position.lerp(desiredPos, k)
    lookTarget.lerp(desiredLook, k)
    camera.lookAt(lookTarget)
  })

  return null
}
