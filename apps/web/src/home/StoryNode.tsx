import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line, Html } from '@react-three/drei'
import gsap from 'gsap'
import type { HomeStep as StoryNodeData } from './timeline'
import { flyToT } from './drivers'
import { useCameraController } from './cameraController'
import { COLORS } from './colors'

export function StoryNode({ node, onFlash }: { node: StoryNodeData; onFlash: () => void }) {
  const navigate = useNavigate()
  const ctrl = useCameraController()
  const [hovered, setHovered] = useState(false)
  const dim = node.status === 'live' ? 1 : 0.45
  const [cx, cy] = node.pos
  const [tx, ty] = node.clip

  const enter = () => {
    ctrl.mode = 'travel'
    flyToT(0, 1.1) // TODO Task 11: replace with timeline-derived scroll position
    gsap.delayedCall(1.0, () => {
      onFlash()
      gsap.delayedCall(0.35, () => navigate(node.route ?? '/', { state: { fromNode: node.id } }))
    })
  }

  return (
    <group>
      <Line points={[[tx, ty, 0], [cx, cy, 0]]} color={COLORS.tether} lineWidth={1} transparent opacity={0.7} />
      <mesh
        position={[cx, cy, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); enter() }}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[cx, cy, 0]}>
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={dim} toneMapped={false} />
      </mesh>
      <Html position={[cx + 1, cy + 0.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: COLORS.cyan, fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'nowrap',
          opacity: hovered || node.status === 'live' ? dim : 0.25, transition: 'opacity 120ms',
        }}>
          {node.title}{node.status === 'coming-soon' ? ' · soon' : ''}
        </div>
      </Html>
    </group>
  )
}
