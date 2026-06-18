import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import { buildAtlas, type AtlasNode } from './model'
import { INITIAL_NAV, focusNode, withLod, toGalaxy, type Lod, type NavState } from './navState'
import { poseForNode } from './deeplink'
import { StarChart } from './StarChart'
import { AtlasNode as NodeView } from './AtlasNode'
import { CameraControlsRig, type RigHandle } from './CameraControlsRig'
import { IntroRail } from './IntroRail'
import { Effects } from './Effects'
import { Hud } from './Hud'
import { Diorama } from './Diorama'
import { overviewDistance } from './viewport'
import { AdaptiveDpr } from '@react-three/drei'
import { DEEP } from '../colors'

export default function AtlasScene({ startFocus = null }: { startFocus?: AtlasNode | null }) {
  const { nodes } = useMemo(() => buildAtlas(), [])
  const rig = useRef<RigHandle>(null)
  const navigate = useNavigate()

  const [nav, setNav] = useState<NavState>(
    startFocus ? focusNode(INITIAL_NAV, startFocus.id) : INITIAL_NAV,
  )
  // No intro when arriving via deep-link return.
  const [introPlaying, setIntroPlaying] = useState(!startFocus)
  // 0→1 graph-draw progress, driven by the intro; full (1) when not playing.
  const [draw, setDraw] = useState(startFocus ? 1 : 0)

  // Aspect-aware overview: portrait zooms toward the fork (and re-centres) so it fills the screen.
  const [aspect, setAspect] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1.6,
  )
  useEffect(() => {
    const onResize = () => setAspect(window.innerWidth / window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const overviewZ = useMemo(() => overviewDistance(aspect), [aspect])
  const centerX = aspect < 1 ? 8 : 6
  const overviewPose = useMemo(
    () => ({
      position: [centerX, 0, overviewZ] as [number, number, number],
      target:   [centerX, 0, 0] as [number, number, number],
    }),
    [centerX, overviewZ],
  )
  // Cap device-pixel-ratio (touch devices lower still) so retina phones don't render 3× the pixels.
  const maxDpr = useMemo(
    () => (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches ? 1.5 : 2),
    [],
  )

  const onLod = (lod: Lod) => setNav((s) => withLod(s, lod))
  const select = (id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    rig.current?.flyTo(poseForNode(node))
    setNav((s) => focusNode(s, id))
  }
  const skip = () => {
    setIntroPlaying(false)
    setDraw(1)
    rig.current?.enable(true)
    if (startFocus) rig.current?.flyTo(poseForNode(startFocus), true)
  }

  // The dive: a focused node opens its Diorama; surfacing flies back to the map.
  const focusedNode = nodes.find((n) => n.id === nav.focusId) ?? null
  const [entering, setEntering] = useState(false)
  const enterTimer = useRef<number | null>(null)
  const surface = () => {
    rig.current?.flyTo(overviewPose)
    setNav((s) => toGalaxy(s))
  }
  // Enter = push the camera through the framed window, fade, then load the content.
  const enter = (route: string) => {
    if (!focusedNode) { navigate(route); return }
    const [x, y] = focusedNode.pos
    const py = y + 5.6 // the focused plate sits above the node
    rig.current?.flyTo({ position: [x, py, 5], target: [x, py, 0] })
    setEntering(true)
    enterTimer.current = window.setTimeout(() => navigate(route), 650)
  }
  useEffect(() => () => { if (enterTimer.current) clearTimeout(enterTimer.current) }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') surface() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Re-fit the overview when the aspect changes while idle on the map.
  useEffect(() => {
    if (!introPlaying && !nav.focusId) rig.current?.flyTo(overviewPose, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overviewPose])

  // Staged intro, driven by the draw clock (0→1):
  //   lines draw 0→0.55 · tips (Storyverse/Future Proof) fade 0.55→0.73 · stories fade 0.75→1
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
  const drawProgress = clamp01(draw / 0.55)
  const revealFor = (n: AtlasNode) =>
    n.branch === 'history' ? clamp01(draw / 0.3)           // history events appear with the trunk
      : n.ring             ? clamp01((draw - 0.55) / 0.18) // branch tips after the line reaches the end
      :                      clamp01((draw - 0.75) / 0.22) // the stories, last

  return (
    <>
      <div className="home-canvas">
        <Canvas
          dpr={[1, maxDpr]}
          camera={{ position: startFocus ? poseForNode(startFocus).position : [0, 0, 14], fov: 50 }}
          onPointerMissed={() => { if (nav.focusId) surface() }}
        >
          <color attach="background" args={[DEEP.void]} />
          <StarChart drawProgress={drawProgress} />
          {nodes.map((n) => (
            <NodeView key={n.id} node={n} lod={nav.lod} focused={nav.focusId === n.id} reveal={revealFor(n)} onSelect={select} />
          ))}
          <CameraControlsRig ref={rig} onLod={onLod} enabled={!introPlaying} maxDistance={overviewZ + 30} />
          {introPlaying && (
            <IntroRail
              rig={rig}
              play
              end={overviewPose}
              onProgress={setDraw}
              onDone={() => { setDraw(1); setIntroPlaying(false) }}
            />
          )}
          <Effects />
          <AdaptiveDpr pixelated />
        </Canvas>
      </div>
      <Hud nav={nav} nodes={nodes} introPlaying={introPlaying} onSkip={skip} />
      <Diorama node={focusedNode} onEnter={enter} onBack={surface} />
      {/* dive-through fade — covers the swap into the content */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none',
          background: DEEP.void,
          opacity: entering ? 1 : 0,
          transition: 'opacity 600ms ease-in',
        }}
      />
    </>
  )
}
