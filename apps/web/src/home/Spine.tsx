import { useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GRAPH } from './graph'
import { COLORS } from './colors'
import { useCameraController } from './cameraController'

const to3 = (ps: readonly (readonly [number, number])[]): [number, number, number][] =>
  ps.map(([x, y]) => [x, y, 0])

/**
 * Polyline drawn to local progress [0,1], returned as a **constant-length**
 * array (same point count as `pts`). Points past the moving head collapse onto
 * the head, so undrawn segments have zero length and stay invisible.
 *
 * Constant length is deliberate: three-stdlib's `Line2`/`LineGeometry` caches its
 * instanced draw-count, so a geometry that is shrunk via `setPositions` and later
 * grown again won't re-render the extra segments. Never changing the count avoids
 * that entirely — the head just slides along a fixed-size buffer.
 */
function drawnSlice(
  pts: [number, number, number][],
  progress: number,
): [number, number, number][] {
  const n = pts.length
  if (progress >= 1) return pts
  if (progress <= 0) return pts.map(() => pts[0]) // all collapsed at the start
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
    else out.push([hx, hy, 0]) // head, then zero-length tail
  }
  return out
}

// Global drawProgress → per-branch local progress (staged: history, then bad, then good).
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const localHistory = (p: number) => clamp01(p / 0.4)
const localBad = (p: number) => clamp01((p - 0.4) / 0.32)
const localGood = (p: number) => clamp01((p - 0.72) / 0.28)

export function Spine() {
  const { branches, historyCommits } = GRAPH
  const ctrl = useCameraController()
  // drei <Line> forwards a three-stdlib Line2; typed `any` to avoid a brittle deep import.
  // We only call geometry.setPositions(number[]) on it.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const historyRef = useRef<any>(null)
  const badRef = useRef<any>(null)
  const goodRef = useRef<any>(null)
  const commitRefs = useRef<any[]>([])
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const last = useRef(-1)

  const history3 = to3(branches.history)
  const bad3 = to3(branches.bad)
  const good3 = to3(branches.good)

  // drawProgress is mutated outside React (gsap), so drive the geometry from useFrame.
  useFrame(() => {
    const p = ctrl.drawProgress
    if (p === last.current) return
    last.current = p
    historyRef.current?.geometry.setPositions(drawnSlice(history3, localHistory(p)).flat())
    badRef.current?.geometry.setPositions(drawnSlice(bad3, localBad(p)).flat())
    goodRef.current?.geometry.setPositions(drawnSlice(good3, localGood(p)).flat())
    commitRefs.current.forEach((m, i) => {
      if (!m) return
      const x = historyCommits[i][0]
      const appearAt = ((x + 30) / 30) * 0.4 // history spans x −30..0 over draw [0,0.40]
      m.visible = p >= appearAt
    })
  })

  return (
    <group>
      <Line ref={historyRef} points={history3} color={COLORS.white} lineWidth={3} />
      <Line ref={badRef} points={bad3} color="#dfe7ec" lineWidth={3} />
      <Line ref={goodRef} points={good3} color="#dfe7ec" lineWidth={3} />
      {historyCommits.map(([x, y], i) => (
        <mesh
          key={i}
          position={[x, y, 0]}
          visible={false}
          ref={(el) => {
            commitRefs.current[i] = el
          }}
        >
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={COLORS.grey} />
        </mesh>
      ))}
    </group>
  )
}
