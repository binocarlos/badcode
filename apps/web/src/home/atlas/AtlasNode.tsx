import { Billboard, Text } from '@react-three/drei'
import type { AtlasNode as Node } from './model'
import type { Lod } from './navState'
import { MediaPlate } from './MediaPlate'
import { DEEP } from '../colors'

export function AtlasNode({
  node,
  lod,
  focused,
  onSelect,
}: {
  node: Node
  lod: Lod
  focused: boolean
  onSelect: (id: string) => void
}) {
  const enterable = node.status === 'live'
  const showLabel = lod !== 'galaxy' || node.ring
  const showPlate = !!node.plate && (lod === 'node' || focused)
  const color = enterable ? DEEP.cyan : DEEP.gold

  return (
    <group position={node.pos}>
      {/* celestial body — ring for branch tips, point otherwise */}
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(node.id) }}>
        {node.ring
          ? <torusGeometry args={[1, 0.08, 12, 48]} />
          : <sphereGeometry args={[0.4, 16, 16]} />}
        <meshBasicMaterial color={color} transparent opacity={enterable ? 1 : 0.55} />
      </mesh>

      {showLabel && (
        <Billboard position={[0, node.ring ? 1.8 : 1.1, 0]}>
          <Text
            fontSize={0.9}
            color={color}
            anchorX="center"
            anchorY="bottom"
            fillOpacity={enterable ? 1 : 0.6}
          >
            {node.status === 'live' ? node.title : `${node.title} · soon`}
          </Text>
        </Billboard>
      )}

      {showPlate && (
        <MediaPlate url={node.plate!} position={[0, 4.6, 0]} width={6} />
      )}
    </group>
  )
}
