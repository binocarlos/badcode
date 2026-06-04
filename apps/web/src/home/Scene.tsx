// apps/web/src/home/Scene.tsx
import { useRef, useState, useEffect, useCallback } from 'react'
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
import { GRAPH, drawThreshold } from './graph'
import { homeSteps } from './timeline'
import { flyToStep } from './drivers'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useTimeline } from './useTimeline'

function initialMode(): 'story' | 'menu' {
  try { return localStorage.getItem('badcode-visited') ? 'menu' : 'story' } catch { return 'story' }
}

const ALL_REVEALED = new Set(homeSteps.map((s) => s.id))

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)
  const [mode, setMode] = useState<'story' | 'menu'>(initialMode)
  const [revealedSteps, setRevealedSteps] = useState<Set<string>>(() =>
    initialMode() === 'menu' ? ALL_REVEALED : new Set(),
  )

  const { sample, layout } = useTimeline()

  // On mount in menu mode, ensure drawProgress starts at 1.
  useEffect(() => {
    if (mode === 'menu') ctrl.drawProgress = 1
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const enterMenu = useCallback(() => {
    ctrl.drawProgress = 1
    try { localStorage.setItem('badcode-visited', '1') } catch { /* */ }
    setMode('menu')
    setRevealedSteps(ALL_REVEALED)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ctrl])

  const enterStory = useCallback(() => {
    try { localStorage.removeItem('badcode-visited') } catch { /* */ }
    ctrl.drawProgress = 0
    ctrl.mode = 'intro'
    setMode('story')
    setRevealedSteps(new Set())
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ctrl])

  // Drive drawProgress from scroll (high-water). Auto-enter menu at end.
  useEffect(() => {
    if (mode !== 'story') return
    const onScroll = () => {
      const scrollable = Math.max(1, layout.totalHeight - window.innerHeight)
      const raw        = window.scrollY / scrollable
      const next       = Math.min(1, Math.max(ctrl.drawProgress, raw))
      ctrl.drawProgress = next

      // Reveal newly crossed nodes.
      const revealed = new Set(
        homeSteps.filter((s) => next >= drawThreshold(s)).map((s) => s.id),
      )
      if (revealed.size !== revealedSteps.size) setRevealedSteps(revealed)

      if (raw >= 1) enterMenu()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mode, layout, ctrl, revealedSteps, enterMenu])

  // Transition from intro to travel when timeline leaves overview state.
  useEffect(() => {
    if (!sample.overview && ctrl.mode === 'intro') ctrl.mode = 'travel'
  }, [sample.overview, ctrl])

  // Any-interaction: clicking while at the overview triggers travel to step 0.
  const handleFirstClick = () => {
    if (ctrl.mode === 'intro') {
      ctrl.mode = 'travel'
      flyToStep(homeSteps.find((s) => s.kind !== 'event')?.id ?? homeSteps[0].id, layout, 0.8)
    }
  }

  // Re-emerge: returning from a comic scrolls to that step's hold position.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  useEffect(() => {
    if (!fromNode) return
    const step = layout.steps.find((s) => s.id === fromNode)
    if (step) {
      window.scrollTo({ top: step.holdStart, behavior: 'instant' })
      ctrl.mode = 'travel'
      ctrl.drawProgress = 1
      setRevealedSteps(ALL_REVEALED)
    }
  }, [fromNode, layout, ctrl])

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas" onPointerDown={handleFirstClick}>
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig sample={sample} mode={mode} />
          <Spine />
          <Constellation
            sample={sample}
            layout={layout}
            onFlash={() => setFlash(true)}
            revealedSteps={revealedSteps}
            menuMode={mode === 'menu'}
          />
          <BranchTip title={GRAPH.tips.storyverse.title} pos={GRAPH.tips.storyverse.pos} route={GRAPH.tips.storyverse.route} up />
          <BranchTip title={GRAPH.tips.futureProof.title} pos={GRAPH.tips.futureProof.pos} route={GRAPH.tips.futureProof.route} up={false} />
        </Canvas>
      </div>
      <Chrome layout={layout} mode={mode} onEnterMenu={enterMenu} onEnterStory={enterStory} />
      <OpeningSequence />
      <Narration />
      {flash && (
        <div
          style={{ position: 'fixed', inset: 0, background: COLORS.cyan, zIndex: 3, pointerEvents: 'none' }}
        />
      )}
      <div
        className="home-scroll-driver"
        style={{ height: layout.totalHeight }}
        aria-hidden
      />
    </CameraControllerContext.Provider>
  )
}
