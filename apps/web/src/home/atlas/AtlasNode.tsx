import { useState } from 'react'
import { Billboard, Text } from '@react-three/drei'
import type { AtlasNode as Node } from './model'
import type { Lod } from './navState'
import { MediaPlate } from './MediaPlate'
import { DEEP } from '../colors'

export function AtlasNode({
  node,
  lod,
  focused,
  reveal = 1,
  dim = false,
  onSelect,
}: {
  node: Node
  lod: Lod
  focused: boolean
  reveal?: number
  dim?: boolean // another node is focused — recede into the background
  onSelect: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const enterable = node.status === 'live'
  const color = enterable ? DEEP.cyan : DEEP.gold
  const dimFactor = dim && !hovered ? 0.1 : 1
  const bodyOpacity = (enterable ? 1 : 0.55) * reveal * dimFactor
  const labelOpacity = (enterable ? 1 : 0.6) * reveal * dimFactor
  const scale = 0.85 + 0.15 * reveal // subtle pop as it fades in
  const hit = node.ring ? 2.6 : 1.5 // generous invisible click/tap target
  const bodyScale = hovered ? 1.35 : 1

  return (
    <group position={node.pos} scale={scale} visible={reveal > 0.001}>
      {/* invisible hit target — makes thin rings and small dots easy to click/tap */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onSelect(node.id) }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <circleGeometry args={[hit, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* faint halo — signals the node is interactive (brightens on hover) */}
      <mesh scale={bodyScale}>
        <ringGeometry args={[node.ring ? 1.25 : 0.72, node.ring ? 1.5 : 0.98, 40]} />
        <meshBasicMaterial color={color} transparent opacity={(hovered ? 0.55 : 0.16) * reveal * dimFactor} depthWrite={false} />
      </mesh>

      {/* celestial body — ring for branch tips, point otherwise */}
      <mesh scale={bodyScale}>
        {node.ring
          ? <torusGeometry args={[1, 0.08, 12, 48]} />
          : <sphereGeometry args={[0.4, 16, 16]} />}
        <meshBasicMaterial color={color} transparent opacity={bodyOpacity} />
      </mesh>

      {/* label — stays legible at every altitude once revealed */}
      <Billboard position={[0, node.ring ? 1.8 : 1.1, 0]}>
        <Text
          fontSize={0.9}
          color={color}
          anchorX="center"
          anchorY="bottom"
          fillOpacity={labelOpacity}
        >
          {node.status === 'live' ? node.title : `${node.title} · soon`}
        </Text>
      </Billboard>

      {(!!node.plate || !!node.video) && (lod === 'node' || focused) && (
        <MediaPlate
          url={node.plate}
          video={node.video}
          active={focused}
          position={[0, focused ? 5.6 : 4.6, 0]}
          width={focused ? 11 : 6}
          framed={focused}
        />
      )}
    </group>
  )
}
