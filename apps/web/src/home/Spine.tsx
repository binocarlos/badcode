import { useRef, useState } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GRAPH } from './graph'
import { COLORS } from './colors'
import { useCameraController } from './cameraController'

const to3 = (ps: readonly (readonly [number, number])[]): [number, number, number][] =>
  ps.map(([x, y]) => [x, y, 0])

/** History polyline truncated at `progress` (0..1) along its points, with an interpolated head. */
function drawnHistory(progress: number): [number, number, number][] {
  const pts = to3(GRAPH.branches.history)
  if (progress >= 1) return pts
  const segs = pts.length - 1
  const head = Math.max(0, progress) * segs
  const idx = Math.floor(head)
  const frac = head - idx
  const out = pts.slice(0, idx + 1)
  if (idx < segs) {
    const a = pts[idx]
    const b = pts[idx + 1]
    out.push([a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac, 0])
  }
  return out.length >= 2 ? out : [pts[0], pts[0]]
}

export function Spine() {
  const { branches, historyCommits } = GRAPH
  const ctrl = useCameraController()
  // drei's <Line> forwards its ref to a three-stdlib Line2; typed `any` to avoid a brittle
  // deep import. We only call geometry.setPositions(number[]) on it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const historyRef = useRef<any>(null)
  const lastProgress = useRef(-1)
  // ctrl.drawProgress is mutated outside React (gsap), so it can't gate render directly.
  // Flip this reactive flag from inside useFrame when the draw-in completes.
  const [branchesVisible, setBranchesVisible] = useState(ctrl.drawProgress > 0.98)

  useFrame(() => {
    const line = historyRef.current
    if (line && ctrl.drawProgress !== lastProgress.current) {
      lastProgress.current = ctrl.drawProgress
      line.geometry.setPositions(drawnHistory(ctrl.drawProgress).flat())
    }
    if (!branchesVisible && ctrl.drawProgress > 0.98) setBranchesVisible(true)
  })
  return (
    <group>
      <Line ref={historyRef} points={to3(branches.history)} color={COLORS.white} lineWidth={3} />
      {branchesVisible && (
        <>
          <Line points={to3(branches.bad)} color="#dfe7ec" lineWidth={3} />
          <Line points={to3(branches.good)} color="#dfe7ec" lineWidth={3} />
        </>
      )}
      {historyCommits.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} visible={branchesVisible}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={COLORS.grey} />
        </mesh>
      ))}
    </group>
  )
}
