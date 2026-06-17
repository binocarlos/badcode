import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { markSlot } from './slots'
import { usePageContext } from '../engine/PageContext'
import { pickImageSrc } from '../assets/pickImageSrc'
import type { ResolvedImage } from '../assets/types'

export interface ImageWidgetProps {
  /** A resolved descriptor (progressive) or a bare URL string (high-only, legacy). */
  src: ResolvedImage | string
  alt?: string
  objectPosition?: string
  fit?: CSSProperties['objectFit']
}

function toAsset(src: ResolvedImage | string): ResolvedImage {
  return typeof src === 'string' ? { thumb: '', low: src, high: src, width: 0, height: 0 } : src
}

export const ImageWidget = markSlot(function ImageWidget({
  src,
  alt = '',
  objectPosition = 'center',
  fit = 'cover',
}: ImageWidgetProps) {
  const asset = toAsset(src)
  const { isCurrent } = usePageContext()
  const [lowReady, setLowReady] = useState(false)
  const [highReady, setHighReady] = useState(false)
  const mounted = useRef(true)

  // Load low on mount.
  useEffect(() => {
    mounted.current = true
    if (!asset.low) return
    const img = new Image()
    img.src = asset.low
    img.decode().then(() => { if (mounted.current) setLowReady(true) }).catch(() => {})
    return () => { mounted.current = false }
  }, [asset.low])

  // Load high once the page is current.
  useEffect(() => {
    if (!isCurrent || !asset.high || asset.high === asset.low) return
    let live = true
    const img = new Image()
    img.src = asset.high
    img.decode().then(() => { if (live) setHighReady(true) }).catch(() => {})
    return () => { live = false }
  }, [isCurrent, asset.high, asset.low])

  const mainSrc = pickImageSrc(asset, lowReady, highReady)
  const fill: CSSProperties = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: fit, objectPosition, display: 'block', userSelect: 'none',
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {asset.thumb && (
        <img src={asset.thumb} alt="" draggable={false} aria-hidden style={{ ...fill, filter: 'blur(8px)', transform: 'scale(1.05)' }} />
      )}
      {mainSrc && <img src={mainSrc} alt={alt} draggable={false} style={fill} />}
    </div>
  )
}, 'widget')
