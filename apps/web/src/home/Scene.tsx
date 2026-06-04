// apps/web/src/home/Scene.tsx
import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import { Spine } from './Spine'
import { Constellation } from './Constellation'
import { CameraRig } from './CameraRig'
import { Atmosphere } from './Atmosphere'
import { Chrome } from './Chrome'
import { Narration } from './Narration'
import { OpeningSequence } from './OpeningSequence'
import { drawThreshold } from './graph'
import { homeSteps } from './timeline'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useTimeline } from './useTimeline'

function initialMode(): 'story' | 'menu' {
  try { return localStorage.getItem('badcode-visited') ? 'menu' : 'story' } catch { return 'story' }
}

const ALL_REVEALED = new Set(homeSteps.map((s) => s.id))

function revealedAt(progress: number): Set<string> {
  return new Set(homeSteps.filter((s) => progress >= drawThreshold(s)).map((s) => s.id))
}

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)
  const [mode, setMode] = useState<'story' | 'menu'>(initialMode)
  const [revealedSteps, setRevealedSteps] = useState<Set<string>>(() =>
    initialMode() === 'menu' ? ALL_REVEALED : new Set(),
  )
  const lastRevealedSize = useRef(0)

  const { layout } = useTimeline()

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
    lastRevealedSize.current = ALL_REVEALED.size
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ctrl])

  const enterStory = useCallback(() => {
    try { localStorage.removeItem('badcode-visited') } catch { /* */ }
    ctrl.drawProgress = 0
    ctrl.mode = 'intro'
    setMode('story')
    setRevealedSteps(new Set())
    lastRevealedSize.current = 0
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [ctrl])

  // Scroll drives drawProgress directly (bidirectional) — camera and reveals both follow scroll.
  useEffect(() => {
    if (mode !== 'story') return
    const onScroll = () => {
      const scrollable = Math.max(1, layout.totalHeight - window.innerHeight)
      const raw        = Math.min(1, Math.max(0, window.scrollY / scrollable))
      ctrl.drawProgress = raw

      const revealed = revealedAt(raw)
      if (revealed.size !== lastRevealedSize.current) {
        lastRevealedSize.current = revealed.size
        setRevealedSteps(revealed)
      }

      if (raw >= 1) enterMenu()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mode, layout, ctrl, enterMenu])

  // Re-emerge: returning from a comic restores scroll/draw state for that node.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  useEffect(() => {
    if (!fromNode) return
    const step = layout.steps.find((s) => s.id === fromNode)
    if (step) {
      const scrollable = Math.max(1, layout.totalHeight - window.innerHeight)
      const progress = Math.min(1, step.holdStart / scrollable)
      window.scrollTo({ top: step.holdStart, behavior: 'instant' })
      ctrl.mode = 'travel'
      ctrl.drawProgress = progress
      const revealed = revealedAt(progress)
      lastRevealedSize.current = revealed.size
      setRevealedSteps(revealed)
    }
  }, [fromNode, layout, ctrl])

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas">
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig mode={mode} />
          <Spine />
          <Constellation
            layout={layout}
            onFlash={() => setFlash(true)}
            revealedSteps={revealedSteps}
            menuMode={mode === 'menu'}
          />
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
