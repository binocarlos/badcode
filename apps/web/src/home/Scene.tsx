// apps/web/src/home/Scene.tsx
import { useRef, useState, useEffect } from 'react'
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
import { GRAPH } from './graph'
import { homeSteps } from './timeline'
import { flyToStep } from './drivers'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useTimeline } from './useTimeline'

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)

  const { sample, layout } = useTimeline()

  // Transition from intro to travel when timeline leaves overview state.
  useEffect(() => {
    if (!sample.overview && ctrl.mode === 'intro') {
      ctrl.mode = 'travel'
    }
  }, [sample.overview, ctrl])

  // Any-interaction: clicking while at the overview triggers travel to step 0.
  const handleFirstClick = () => {
    if (ctrl.mode === 'intro') {
      ctrl.mode = 'travel'
      flyToStep(homeSteps[0].id, layout, 0.8)
    }
  }

  // Re-emerge: returning from a comic scrolls to that step's hold position.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  useEffect(() => {
    if (!fromNode) return
    const step = layout.steps.find((s) => s.id === fromNode)
    if (step) {
      window.scrollTo({ top: step.holdStart, behavior: 'instant' } as ScrollToOptions)
      ctrl.mode = 'travel'
      ctrl.drawProgress = 1
    }
  }, [fromNode, layout, ctrl])

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas" onPointerDown={handleFirstClick}>
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig sample={sample} />
          <Spine />
          <Constellation sample={sample} layout={layout} onFlash={() => setFlash(true)} />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <Chrome layout={layout} />
      <OpeningSequence />
      <Narration />
      {flash && (
        <div
          style={{ position: 'fixed', inset: 0, background: COLORS.cyan, zIndex: 3, pointerEvents: 'none' }}
        />
      )}
      {/* Scroll track height derived from phase budgets — not a hardcoded SCROLL_PAGES constant. */}
      <div
        className="home-scroll-driver"
        style={{ height: layout.totalHeight }}
        aria-hidden
      />
    </CameraControllerContext.Provider>
  )
}
