import { useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GRAPH } from './graph'
import { COLORS } from './colors'
import { useCameraController } from './cameraController'

const to3 = (ps: readonly (readonly [number, number])[]): [number, number, number][] =>
  ps.map(([x, y]) => [x, y, 0])

function drawnSlice(
  pts: [number, number, number][],
  progress: number,
): [number, number, number][] {
  const n = pts.length
  if (progress >= 1) return pts
  if (progress <= 0) return pts.map(() => pts[0])
  const segs = n - 1
  const head = progress * segs
  const idx = Math.floor(head)
  const frac = head - idx
  const a = pts[idx]
  const b = pts[Math.min(idx + 1, segs)]
  const hx = a[0] + (b[0] - a[0]) * frac
  const hy = a[1] + (b[1] - a[1]) * frac
  const out: [number, number, number][] = []
  for (let i = 0; i < n; i++) {
    if (i <= idx) out.push(pts[i])
    else out.push([hx, hy, 0])
  }
  return out
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const localHistory = (p: number) => clamp01(p / 0.4)
const localBad     = (p: number) => clamp01((p - 0.4)  / 0.32)
const localGood    = (p: number) => clamp01((p - 0.72) / 0.23) // completes at 0.95

// Lines start collapsed (all verts at first point = zero-length = invisible).
// useFrame grows them from there — no initial flash of the full graph.
const history3  = to3(GRAPH.branches.history)
const bad3      = to3(GRAPH.branches.bad)
const good3     = to3(GRAPH.branches.good)
const history3C = history3.map(() => history3[0]) as [number,number,number][]
const bad3C     = bad3.map(()     => bad3[0])     as [number,number,number][]
const good3C    = good3.map(()    => good3[0])    as [number,number,number][]

/* eslint-disable @typescript-eslint/no-explicit-any */
function setLine(ref: { current: any }, pts: [number,number,number][], progress: number) {
  const line = ref.current
  if (!line) return
  line.geometry.setPositions(drawnSlice(pts, progress).flat())
  // three-stdlib's setPositions creates new InstancedInterleavedBuffer objects but
  // doesn't mark them dirty for the GPU. Mark both interleaved buffers explicitly.
  const a = line.geometry.attributes
  if (a.instanceStart?.data) a.instanceStart.data.needsUpdate = true
  if (a.instanceEnd?.data)   a.instanceEnd.data.needsUpdate   = true
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function Spine() {
  const { historyCommits } = GRAPH
  const ctrl        = useCameraController()
  const historyRef  = useRef<any>(null)
  const badRef      = useRef<any>(null)
  const goodRef     = useRef<any>(null)
  const commitRefs  = useRef<any[]>([])
  const last        = useRef(-1)

  useFrame(() => {
    const p = ctrl.drawProgress
    if (p === last.current) return
    last.current = p

    setLine(historyRef, history3, localHistory(p))
    setLine(badRef,     bad3,     localBad(p))
    setLine(goodRef,    good3,    localGood(p))

    commitRefs.current.forEach((m, i) => {
      if (!m) return
      const x = historyCommits[i][0]
      m.visible = p >= ((x + 30) / 30) * 0.4
    })
  })

  return (
    <group>
      <Line ref={historyRef} points={history3C} color={COLORS.white} lineWidth={3} />
      <Line ref={badRef}     points={bad3C}     color="#dfe7ec"       lineWidth={3} />
      <Line ref={goodRef}    points={good3C}    color="#dfe7ec"       lineWidth={3} />
      {historyCommits.map(([x, y], i) => (
        <mesh
          key={i}
          position={[x, y, 0]}
          visible={false}
          ref={(el) => { commitRefs.current[i] = el }}
        >
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={COLORS.grey} />
        </mesh>
      ))}
    </group>
  )
}
