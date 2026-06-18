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
  onSelect,
}: {
  node: Node
  lod: Lod
  focused: boolean
  reveal?: number
  onSelect: (id: string) => void
}) {
  const enterable = node.status === 'live'
  const showPlate = !!node.plate && (lod === 'node' || focused)
  const color = enterable ? DEEP.cyan : DEEP.gold
  const bodyOpacity = (enterable ? 1 : 0.55) * reveal
  const labelOpacity = (enterable ? 1 : 0.6) * reveal
  const scale = 0.85 + 0.15 * reveal // subtle pop as it fades in

  return (
    <group position={node.pos} scale={scale} visible={reveal > 0.001}>
      {/* celestial body — ring for branch tips, point otherwise */}
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(node.id) }}>
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

      {showPlate && (
        <MediaPlate url={node.plate!} position={[0, 4.6, 0]} width={6} />
      )}
    </group>
  )
}
