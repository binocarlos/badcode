import type { CSSProperties } from 'react'
import { markSlot } from './slots'

export interface ImageWidgetProps {
  src: string
  alt?: string
  /** CSS object-position (e.g. 'center', 'top', '30% 40%'). */
  objectPosition?: string
  /** object-fit mode (default 'cover'). */
  fit?: CSSProperties['objectFit']
}

/** Displays a single image, filling the page layer. The default page content. */
export const ImageWidget = markSlot(function ImageWidget({
  src,
  alt = '',
  objectPosition = 'center',
  fit = 'cover',
}: ImageWidgetProps) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: fit,
        objectPosition,
        display: 'block',
        userSelect: 'none',
      }}
    />
  )
}, 'widget')
