// apps/web/src/home/StoryNode.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line, Html } from '@react-three/drei'
import gsap from 'gsap'
import { flyToStep } from './drivers'
import type { HomeStep } from './timeline'
import type { TimelineLayout } from '@badcode/scroll-timeline'
import { useCameraController } from './cameraController'
import { COLORS } from './colors'

export function StoryNode({
  step,
  layout,
  onFlash,
  revealed,
  menuMode,
}: {
  step:     HomeStep
  layout:   TimelineLayout
  onFlash:  () => void
  revealed: boolean
  menuMode: boolean
}) {
  const navigate = useNavigate()
  const ctrl     = useCameraController()
  const [hovered, setHovered] = useState(false)
  const [cx, cy] = step.pos
  const [tx, ty] = step.clip

  const enter = () => {
    if (!step.route) return
    if (menuMode) {
      onFlash()
      gsap.delayedCall(0.35, () => navigate(step.route!, { state: { fromNode: step.id } }))
    } else {
      ctrl.mode = 'travel'
      flyToStep(step.id, layout, 1.1)
      gsap.delayedCall(1.0, () => {
        onFlash()
        gsap.delayedCall(0.35, () => navigate(step.route!, { state: { fromNode: step.id } }))
      })
    }
  }

  if (!revealed) return null

  const isEvent   = step.kind === 'event'
  const dim       = isEvent ? 0.7 : (step.status === 'live' ? 1 : 0.5)
  const sphereR   = isEvent ? 0.4 : (hovered ? 0.7 : 0.55)
  const nodeColor = isEvent ? COLORS.grey : COLORS.cyan

  return (
    <group>
      {/* Tether line: branch attachment → floating node position */}
      <Line
        points={[[tx, ty, 0], [cx, cy, 0]]}
        color={COLORS.tether}
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      {/* Hit sphere (invisible) — only for navigable content */}
      {step.route && (
        <mesh
          position={[cx, cy, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
          onClick={(e) => { e.stopPropagation(); enter() }}
        >
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* Visible sphere */}
      <mesh position={[cx, cy, 0]}>
        <sphereGeometry args={[sphereR, 24, 24]} />
        <meshBasicMaterial
          color={nodeColor}
          transparent
          opacity={hovered ? 1 : dim}
          toneMapped={false}
        />
      </mesh>

      {/* White torus ring for branch endpoints (Storyverse / Future Proof) */}
      {step.ring && (
        <mesh position={[cx, cy, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.08, 16, 48]} />
          <meshBasicMaterial color={COLORS.white} toneMapped={false} />
        </mesh>
      )}

      {/* Label */}
      <Html
        position={[cx + (isEvent ? 0.6 : 1), cy + (isEvent ? 0.6 : 0.8), 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          color:      isEvent ? COLORS.white : COLORS.cyan,
          fontFamily: 'var(--mono)',
          fontSize:   isEvent ? 10 : 12,
          whiteSpace: 'nowrap',
          opacity:    hovered ? 1 : dim,
          transition: 'opacity 120ms',
        }}>
          {step.title}{step.status === 'coming-soon' ? ' · soon' : ''}
        </div>
      </Html>
    </group>
  )
}
