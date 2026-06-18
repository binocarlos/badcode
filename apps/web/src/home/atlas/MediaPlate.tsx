import { Component, Suspense, type ReactNode } from 'react'
import * as THREE from 'three'
import { Image } from '@react-three/drei'
import { DEEP } from '../colors'

function Poster({ url, width }: { url: string; width: number }) {
  // drei <Image> keeps aspect via the texture; height set to 9/16 of width.
  return <Image url={url} scale={[width, (width * 9) / 16]} toneMapped={false} transparent />
}

/** If the poster fails to load (missing/404), fall back silently to the backing panel. */
class PlateBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function MediaPlate({
  url,
  position,
  width = 6,
  visible = true,
  framed = false,
}: {
  url: string
  position: [number, number, number]
  width?: number
  visible?: boolean
  framed?: boolean
}) {
  if (!visible) return null
  const height = (width * 9) / 16
  return (
    <group position={position}>
      {/* dim backing shown until the poster resolves — or permanently if it can't */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={DEEP.nebula1} transparent opacity={0.6} />
      </mesh>
      {framed && (
        <lineSegments position={[0, 0, 0.01]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
          <lineBasicMaterial color={DEEP.lineHot} transparent opacity={0.9} />
        </lineSegments>
      )}
      <PlateBoundary>
        <Suspense fallback={null}>
          <Poster url={url} width={width} />
        </Suspense>
      </PlateBoundary>
    </group>
  )
}
