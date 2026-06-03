import { Canvas } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { GRAPH } from './graph'
import { COLORS } from './colors'

function historyLine(): [number, number, number][] {
  return GRAPH.branches.history.map(([x, y]) => [x, y, 0])
}

export default function Scene() {
  return (
    <div className="home-canvas">
      <Canvas camera={{ position: [0, 0, 40], fov: 50 }}>
        <color attach="background" args={[COLORS.black]} />
        <Line points={historyLine()} color={COLORS.white} lineWidth={1.5} />
      </Canvas>
    </div>
  )
}
