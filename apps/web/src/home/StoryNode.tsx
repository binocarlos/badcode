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
  focus,
  layout,
  onFlash,
}: {
  step:    HomeStep
  focus:   number
  layout:  TimelineLayout
  onFlash: () => void
}) {
  const navigate   = useNavigate()
  const ctrl       = useCameraController()
  const [hovered, setHovered] = useState(false)
  const dim   = step.status === 'live' ? 1 : 0.45
  const [cx, cy] = step.pos
  const [tx, ty] = step.clip

  const enter = () => {
    ctrl.mode = 'travel'
    flyToStep(step.id, layout, 1.1)
    gsap.delayedCall(1.0, () => {
      onFlash()
      gsap.delayedCall(0.35, () =>
        navigate(step.route ?? '#', { state: { fromNode: step.id } }),
      )
    })
  }

  return (
    <group>
      <Line
        points={[[tx, ty, 0], [cx, cy, 0]]}
        color={COLORS.tether}
        lineWidth={1}
        transparent
        opacity={0.7 * focus}
      />
      {/* Invisible hit-sphere (radius 1.2) — carries hover/click handlers. */}
      <mesh
        position={[cx, cy, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); enter() }}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Visible sphere — size driven by hover; opacity driven by focus. */}
      <mesh position={[cx, cy, 0]}>
        <sphereGeometry args={[hovered ? 0.7 : 0.55, 24, 24]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={dim * Math.max(focus, 0.15)}
          toneMapped={false}
        />
      </mesh>
      <Html position={[cx + 1, cy + 0.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color:      COLORS.cyan,
          fontFamily: 'var(--mono)',
          fontSize:   12,
          whiteSpace: 'nowrap',
          opacity:    hovered || step.status === 'live' ? dim * Math.max(focus, 0.2) : 0.25 * focus,
          transition: 'opacity 120ms',
        }}>
          {step.title}{step.status === 'coming-soon' ? ' · soon' : ''}
        </div>
      </Html>
    </group>
  )
}
