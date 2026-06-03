import { useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import { Spine } from './Spine'
import { Constellation } from './Constellation'
import { BranchTip } from './BranchTip'
import { CameraRig } from './CameraRig'
import { Atmosphere } from './Atmosphere'
import { Chrome } from './Chrome'
import { Narration } from './Narration'
import { OpeningSequence } from './OpeningSequence'
import { GRAPH, storyNodes } from './graph'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useScrollProgress } from './useScrollProgress'

/** Pages of scroll length that map to t = 0..1. */
const SCROLL_PAGES = 6

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)

  // Re-emerge: if we returned to "/" from a node, start the camera already at that node.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  if (fromNode && ctrl.mode === 'intro') {
    const node = storyNodes.find((n) => n.id === fromNode)
    if (node) {
      ctrl.mode = 'travel'
      ctrl.t = node.t
      ctrl.drawProgress = 1
    }
  }

  const onScroll = useCallback(
    (t: number) => {
      if (t > 0 && ctrl.mode === 'intro') ctrl.mode = 'travel'
      ctrl.t = t
    },
    [ctrl],
  )
  useScrollProgress(onScroll)

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas">
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig />
          <Spine />
          <Constellation onFlash={() => setFlash(true)} />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <Chrome />
      <OpeningSequence />
      <Narration />
      {flash && (
        <div style={{ position: 'fixed', inset: 0, background: COLORS.cyan, zIndex: 3, pointerEvents: 'none' }} />
      )}
      <div className="home-scroll-driver" style={{ height: `${SCROLL_PAGES * 100}vh` }} aria-hidden />
    </CameraControllerContext.Provider>
  )
}
