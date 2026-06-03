import { Canvas } from '@react-three/fiber'
import { Spine } from './Spine'
import { Constellation } from './Constellation'
import { BranchTip } from './BranchTip'
import { COLORS } from './colors'
import { GRAPH } from './graph'

export default function Scene() {
  return (
    <div className="home-canvas">
      <Canvas camera={{ position: [0, 0, 45], fov: 50 }}>
        <color attach="background" args={[COLORS.black]} />
        <Spine />
        <Constellation />
        <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
        <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
      </Canvas>
    </div>
  )
}
