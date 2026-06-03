import { Line } from '@react-three/drei'
import { GRAPH } from './graph'
import { COLORS } from './colors'

const to3 = (ps: readonly (readonly [number, number])[]): [number, number, number][] =>
  ps.map(([x, y]) => [x, y, 0])

export function Spine() {
  const { branches, historyCommits } = GRAPH
  return (
    <group>
      <Line points={to3(branches.history)} color={COLORS.white} lineWidth={2} />
      <Line points={to3(branches.bad)} color="#bbbbbb" lineWidth={2} />
      <Line points={to3(branches.good)} color="#bbbbbb" lineWidth={2} />
      {historyCommits.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={COLORS.grey} />
        </mesh>
      ))}
    </group>
  )
}
