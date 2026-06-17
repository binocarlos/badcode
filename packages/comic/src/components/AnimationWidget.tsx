import { useEffect, useRef, type CSSProperties } from 'react'
import { markSlot } from './slots'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { VideoSource } from '../video/VideoSource'
import { selectRendition, lowestRendition, type NetworkHint } from '../video/selectRendition'
import { supportsWebCodecs, frameIndexFor } from '../video/capabilities'
import type { ResolvedAnimation } from '../assets/types'

export interface AnimationWidgetProps {
  /** Preferred: a resolved animation descriptor (video, scroll-scrubbed). */
  animation?: ResolvedAnimation
  /** Legacy: ordered frame URLs (kept for migration; superseded by `animation`). */
  frames?: string[]
  alt?: string
  objectPosition?: string
  fit?: CSSProperties['objectFit']
}

function netHint(): NetworkHint | undefined {
  const c = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return c ? { saveData: c.saveData, effectiveType: c.effectiveType } : undefined
}

const fill: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }

/** Legacy frame-array path (unchanged behavior) — used until a comic migrates to `animation`. */
function LegacyFrames({ frames, alt, objectPosition, fit }: Required<Pick<AnimationWidgetProps, 'frames'>> & AnimationWidgetProps) {
  const progress = useScrollProgress()
  if (frames.length === 0) return null
  const index = frameIndexFor(progress, frames.length)
  return <img src={frames[index]} alt={alt ?? ''} draggable={false} style={{ ...fill, objectFit: fit ?? 'cover', objectPosition: objectPosition ?? 'center' }} />
}

function VideoScrub({ animation, fit, objectPosition }: { animation: ResolvedAnimation; fit?: CSSProperties['objectFit']; objectPosition?: string }) {
  const progress = useScrollProgress()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceRef = useRef<VideoSource | null>(null)

  // Bring up a VideoSource: low rung first (instant scrub), upgrade to the selected rung.
  useEffect(() => {
    let disposed = false
    const low = lowestRendition(animation.renditions)
    const chosen = selectRendition(animation.renditions, window.innerHeight, window.devicePixelRatio || 1, netHint())

    const start = async (url: string): Promise<VideoSource | null> => {
      const src = new VideoSource(url, animation.frameCount)
      await src.load()
      if (disposed) { src.close(); return null }
      return src
    }

    void (async () => {
      const lowSrc = await start(low.url)
      if (!lowSrc) return
      sourceRef.current = lowSrc
      if (chosen.url !== low.url) {
        const hiSrc = await start(chosen.url)
        if (!hiSrc) return
        const prev = sourceRef.current
        sourceRef.current = hiSrc
        if (prev && prev !== hiSrc) prev.close()
      }
    })()

    return () => {
      disposed = true
      sourceRef.current?.close()
      sourceRef.current = null
    }
  }, [animation])

  // Draw on every progress change.
  useEffect(() => {
    const canvas = canvasRef.current
    const src = sourceRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (canvas.width !== animation.width || canvas.height !== animation.height) {
      canvas.width = animation.width
      canvas.height = animation.height
    }
    src?.draw(ctx, frameIndexFor(progress, animation.frameCount), canvas.width, canvas.height)
  })

  return (
    <canvas
      ref={canvasRef}
      style={{ ...fill, objectFit: fit ?? 'cover', objectPosition: objectPosition ?? 'center', background: `center / cover no-repeat url(${animation.thumb || animation.poster})` }}
    />
  )
}

function VideoFallback({ animation, fit, objectPosition }: { animation: ResolvedAnimation; fit?: CSSProperties['objectFit']; objectPosition?: string }) {
  const chosen = selectRendition(animation.renditions, window.innerHeight, window.devicePixelRatio || 1, netHint())
  return (
    <video
      src={chosen.url} poster={animation.poster} muted loop playsInline autoPlay preload="auto"
      style={{ ...fill, objectFit: fit ?? 'cover', objectPosition: objectPosition ?? 'center' }}
    />
  )
}

export const AnimationWidget = markSlot(function AnimationWidget(props: AnimationWidgetProps) {
  const { animation, frames, fit, objectPosition } = props
  if (animation) {
    return supportsWebCodecs()
      ? <VideoScrub animation={animation} fit={fit} objectPosition={objectPosition} />
      : <VideoFallback animation={animation} fit={fit} objectPosition={objectPosition} />
  }
  if (frames) return <LegacyFrames frames={frames} {...props} />
  return null
}, 'widget')
