// apps/web/src/home/Scene.tsx
import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import { Spine } from './Spine'
import { Constellation } from './Constellation'
import { CameraRig } from './CameraRig'
import { Atmosphere } from './Atmosphere'
import { Chrome } from './Chrome'
import { Narration } from './Narration'
import { drawThreshold } from './graph'
import { homeSteps } from './timeline'
import { COLORS } from './colors'
import { createCameraController, CameraControllerContext } from './cameraController'
import { useTimeline } from './useTimeline'

// Top and bottom scroll bands that show the overview (full diagram, clickable).
// Everything in between is the storytelling zone.
const OVERVIEW_BAND = 0.05

const ALL_REVEALED = new Set(homeSteps.map((s) => s.id))

function revealedAt(storyProgress: number): Set<string> {
  return new Set(homeSteps.filter((s) => storyProgress >= drawThreshold(s)).map((s) => s.id))
}

export default function Scene() {
  const location = useLocation()
  const ctrl = useRef(createCameraController()).current
  const [flash, setFlash] = useState(false)
  // Start showing all nodes (overview mode at top).
  const [revealedSteps, setRevealedSteps] = useState<Set<string>>(ALL_REVEALED)
  const lastRevealedSize = useRef(ALL_REVEALED.size)

  const { layout } = useTimeline()

  // Pure scroll → state. No modes, no localStorage, just where are you scrolled.
  useEffect(() => {
    const onScroll = () => {
      const scrollable = Math.max(1, layout.totalHeight - window.innerHeight)
      const raw = Math.min(1, Math.max(0, window.scrollY / scrollable))

      const inOverview = raw < OVERVIEW_BAND || raw > (1 - OVERVIEW_BAND)
      ctrl.isOverview = inOverview

      // Spine and camera: 1 in overview bands, 0-1 story progress in the middle.
      const storyProgress = inOverview
        ? (raw >= 1 - OVERVIEW_BAND ? 1 : 0)
        : (raw - OVERVIEW_BAND) / (1 - 2 * OVERVIEW_BAND)
      ctrl.drawProgress = inOverview ? 1 : storyProgress

      // Node visibility: all in overview bands, progressive in story zone.
      const revealed = inOverview ? ALL_REVEALED : revealedAt(storyProgress)
      if (revealed.size !== lastRevealedSize.current) {
        lastRevealedSize.current = revealed.size
        setRevealedSteps(revealed)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Run once on mount to handle any non-zero initial scroll position.
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [layout, ctrl])

  // Re-emerge: returning from a comic restores position for that node.
  const fromNode = (location.state as { fromNode?: string } | null)?.fromNode
  useEffect(() => {
    if (!fromNode) return
    const step = layout.steps.find((s) => s.id === fromNode)
    if (step) {
      const scrollable = Math.max(1, layout.totalHeight - window.innerHeight)
      const rawProgress = Math.min(1, step.holdStart / scrollable)
      // Map back to a raw scroll position in the story zone.
      const targetRaw = OVERVIEW_BAND + rawProgress * (1 - 2 * OVERVIEW_BAND)
      const targetScrollY = targetRaw * scrollable
      window.scrollTo({ top: targetScrollY, behavior: 'instant' })
      ctrl.mode = 'travel'
      ctrl.drawProgress = rawProgress
      ctrl.isOverview = false
      setRevealedSteps(revealedAt(rawProgress))
      lastRevealedSize.current = revealedAt(rawProgress).size
    }
  }, [fromNode, layout, ctrl])

  return (
    <CameraControllerContext.Provider value={ctrl}>
      <div className="home-canvas">
        <Canvas camera={{ position: [2, 0, 60], fov: 50 }}>
          <color attach="background" args={[COLORS.black]} />
          <Atmosphere />
          <CameraRig />
          <Spine />
          <Constellation
            layout={layout}
            onFlash={() => setFlash(true)}
            revealedSteps={revealedSteps}
            menuMode={ctrl.isOverview}
          />
        </Canvas>
      </div>
      <Chrome layout={layout} />
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
