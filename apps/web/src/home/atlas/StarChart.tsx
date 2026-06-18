import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line } from '@react-three/drei'
import { GRAPH } from '../graph'
import { DEEP } from '../colors'

type V2 = readonly [number, number]
const to3 = (p: V2) => new Vector3(p[0], p[1], 0)

function branchPoints(pts: readonly V2[]): Vector3[] {
  const curve = new CatmullRomCurve3(pts.map(to3), false, 'catmullrom', 0.2)
  return curve.getPoints(60)
}

export function StarChart() {
  const { history, bad, good } = GRAPH.branches
  const lines = useMemo(
    () => ({
      history: branchPoints(history),
      bad:     branchPoints(bad),
      good:    branchPoints(good),
    }),
    [history, bad, good],
  )

  return (
    <group>
      {/* nebula backdrop: two large additive sprites of warm/cool fog */}
      <mesh position={[10, 4, -30]}>
        <planeGeometry args={[120, 80]} />
        <meshBasicMaterial color={DEEP.nebula1} transparent opacity={0.18} depthWrite={false} />
      </mesh>

      <Line points={lines.history} color={DEEP.line} lineWidth={1.5} transparent opacity={0.85} />
      <Line points={lines.bad}     color={DEEP.lineHot} lineWidth={2} transparent opacity={0.9} />
      <Line points={lines.good}    color={DEEP.lineHot} lineWidth={2} transparent opacity={0.9} />

      {GRAPH.historyCommits.map((c, i) => (
        <mesh key={i} position={[c[0], c[1], 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshBasicMaterial color={DEEP.gold} />
        </mesh>
      ))}
    </group>
  )
}
