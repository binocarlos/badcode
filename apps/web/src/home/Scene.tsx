import { useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Spine } from './Spine'
import { Constellation } from './Constellation'
import { BranchTip } from './BranchTip'
import { CameraRig } from './CameraRig'
import { GRAPH } from './graph'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useScrollProgress } from './useScrollProgress'

/** Pages of scroll length that map to t = 0..1. */
const SCROLL_PAGES = 6

export default function Scene() {
  const ctrl = useRef(createCameraController()).current
  const onScroll = useCallback((t: number) => {
    if (t > 0 && ctrl.mode === 'intro') ctrl.mode = 'travel'
    ctrl.t = t
  }, [ctrl])
  useScrollProgress(onScroll)

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas">
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <CameraRig />
          <Spine />
          <Constellation />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <div className="home-scroll-driver" style={{ height: `${SCROLL_PAGES * 100}vh` }} aria-hidden />
    </CameraControllerContext.Provider>
  )
}
