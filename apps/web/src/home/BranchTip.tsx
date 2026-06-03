import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html } from '@react-three/drei'
import { COLORS } from './colors'

export function BranchTip({ title, pos, route, up }: {
  title: string
  pos: readonly [number, number]
  route: string
  up: boolean
}) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [x, y] = pos
  return (
    <group position={[x, y, 0]}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); navigate(route) }}
      >
        <torusGeometry args={[1, 0.12, 16, 40]} />
        <meshBasicMaterial color={COLORS.white} toneMapped={false} />
      </mesh>
      <Html position={[0, up ? 2 : -2, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ color: COLORS.white, fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: 2, whiteSpace: 'nowrap', opacity: hovered ? 1 : 0.85 }}>
          {title.toUpperCase()}
        </div>
      </Html>
    </group>
  )
}
