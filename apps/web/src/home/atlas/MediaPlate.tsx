import { Suspense } from 'react'
import { Image } from '@react-three/drei'
import { DEEP } from '../colors'

function Poster({ url, width }: { url: string; width: number }) {
  // drei <Image> keeps aspect via the texture; height set to 9/16 of width.
  return <Image url={url} scale={[width, (width * 9) / 16]} toneMapped={false} transparent />
}

export function MediaPlate({
  url,
  position,
  width = 6,
  visible = true,
}: {
  url: string
  position: [number, number, number]
  width?: number
  visible?: boolean
}) {
  if (!visible) return null
  return (
    <group position={position}>
      {/* dim backing shown until the poster texture resolves */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width, (width * 9) / 16]} />
        <meshBasicMaterial color={DEEP.nebula1} transparent opacity={0.6} />
      </mesh>
      <Suspense fallback={null}>
        <Poster url={url} width={width} />
      </Suspense>
    </group>
  )
}
