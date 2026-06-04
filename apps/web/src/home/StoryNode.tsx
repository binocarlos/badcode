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

  // Historical event: tick mark + label on the trunk line.
  if (step.kind === 'event') {
    return (
      <group>
        <Line
          points={[[cx, cy - 0.35, 0], [cx, cy + 0.35, 0]]}
          color={COLORS.white}
          lineWidth={2}
          transparent
          opacity={0.5}
        />
        <Html position={[cx + 0.3, cy + 0.6, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            color:      COLORS.white,
            fontFamily: 'var(--mono)',
            fontSize:   10,
            whiteSpace: 'nowrap',
            opacity:    0.55,
          }}>
            {step.title}
          </div>
        </Html>
      </group>
    )
  }

  // Content node: sphere + tether + label. Opacity is full once revealed — no focus fade.
  const dim = step.status === 'live' ? 1 : 0.5

  return (
    <group>
      <Line
        points={[[tx, ty, 0], [cx, cy, 0]]}
        color={COLORS.tether}
        lineWidth={1}
        transparent
        opacity={0.6}
      />
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
      <mesh position={[cx, cy, 0]}>
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={hovered ? 1 : dim}
          toneMapped={false}
        />
      </mesh>
      <Html position={[cx + 1, cy + 0.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color:      COLORS.cyan,
          fontFamily: 'var(--mono)',
          fontSize:   12,
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
