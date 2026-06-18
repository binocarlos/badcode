import { Component, Suspense, type ReactNode } from 'react'
import * as THREE from 'three'
import { Image, useVideoTexture } from '@react-three/drei'
import { DEEP } from '../colors'

function Poster({ url, width }: { url: string; width: number }) {
  // drei <Image> keeps aspect via the texture; height set to 9/16 of width.
  return <Image url={url} scale={[width, (width * 9) / 16]} toneMapped={false} transparent />
}

function VideoPlane({ src, width }: { src: string; width: number }) {
  const texture = useVideoTexture(src, { muted: true, loop: true, start: true, playsInline: true })
  return (
    <mesh>
      <planeGeometry args={[width, (width * 9) / 16]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

/** If the media fails to load (missing/404), fall back silently to the backing panel. */
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
  video,
  position,
  width = 6,
  visible = true,
  framed = false,
  active = false,
}: {
  url?: string
  video?: string
  position: [number, number, number]
  width?: number
  visible?: boolean
  framed?: boolean
  active?: boolean // only the focused/active plate mounts a <video> (single concurrent decode)
}) {
  if (!visible) return null
  const height = (width * 9) / 16
  const playVideo = active && !!video
  return (
    <group position={position}>
      {/* dim backing shown until the media resolves — or permanently if it can't */}
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
        <Suspense fallback={url ? <Poster url={url} width={width} /> : null}>
          {playVideo
            ? <VideoPlane src={video!} width={width} />
            : url
              ? <Poster url={url} width={width} />
              : null}
        </Suspense>
      </PlateBoundary>
    </group>
  )
}
