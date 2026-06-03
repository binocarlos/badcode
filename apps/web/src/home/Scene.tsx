import { Canvas } from '@react-three/fiber'
import { Spine } from './Spine'
import { COLORS } from './colors'

export default function Scene() {
  return (
    <div className="home-canvas">
      <Canvas camera={{ position: [0, 0, 45], fov: 50 }}>
        <color attach="background" args={[COLORS.black]} />
        <Spine />
      </Canvas>
    </div>
  )
}
