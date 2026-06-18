import { useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { buildAtlas, type AtlasNode } from './model'
import { INITIAL_NAV, focusNode, withLod, type Lod, type NavState } from './navState'
import { poseForNode } from './deeplink'
import { StarChart } from './StarChart'
import { AtlasNode as NodeView } from './AtlasNode'
import { CameraControlsRig, type RigHandle } from './CameraControlsRig'
import { IntroRail } from './IntroRail'
import { Effects } from './Effects'
import { Hud } from './Hud'
import { DEEP } from '../colors'

export default function AtlasScene({ startFocus = null }: { startFocus?: AtlasNode | null }) {
  const { nodes } = useMemo(() => buildAtlas(), [])
  const rig = useRef<RigHandle>(null)

  const [nav, setNav] = useState<NavState>(
    startFocus ? focusNode(INITIAL_NAV, startFocus.id) : INITIAL_NAV,
  )
  // No intro when arriving via deep-link return.
  const [introPlaying, setIntroPlaying] = useState(!startFocus)

  const onLod = (lod: Lod) => setNav((s) => withLod(s, lod))
  const select = (id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    rig.current?.flyTo(poseForNode(node))
    setNav((s) => focusNode(s, id))
  }
  const skip = () => {
    setIntroPlaying(false)
    rig.current?.enable(true)
    if (startFocus) rig.current?.flyTo(poseForNode(startFocus), true)
  }

  return (
    <>
      <div className="home-canvas">
        <Canvas camera={{ position: startFocus ? poseForNode(startFocus).position : [0, 0, 14], fov: 50 }}>
          <color attach="background" args={[DEEP.void]} />
          <StarChart />
          {nodes.map((n) => (
            <NodeView key={n.id} node={n} lod={nav.lod} focused={nav.focusId === n.id} onSelect={select} />
          ))}
          <CameraControlsRig ref={rig} onLod={onLod} enabled={!introPlaying} />
          {introPlaying && (
            <IntroRail rig={rig} play onDone={() => setIntroPlaying(false)} />
          )}
          <Effects />
        </Canvas>
      </div>
      <Hud nav={nav} nodes={nodes} introPlaying={introPlaying} onSkip={skip} />
    </>
  )
}
