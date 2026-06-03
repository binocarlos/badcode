import { useEffect, useRef, useState, type CSSProperties } from 'react'
import rough from 'roughjs'
import type { BubbleRendererProps } from './types'

/**
 * Hand-drawn (sketchy) bubble. Uses roughjs to render a rough rectangle behind
 * the text, sized to the measured content via a ResizeObserver. Drawing happens
 * after mount only, so it is SSR-safe (the box just renders without the sketch
 * until hydration).
 */
export function RoughBubble({
  type,
  children,
  background = '#ffffff',
  color = '#111111',
  textColor = '#111111',
  fontSize = 18,
}: BubbleRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight })
    })
    ro.observe(el)
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || size.w === 0 || size.h === 0) return
    while (svg.firstChild) svg.removeChild(svg.firstChild)
    const rc = rough.svg(svg)
    const node = rc.rectangle(3, 3, size.w - 6, size.h - 6, {
      fill: background,
      fillStyle: 'solid',
      stroke: color,
      strokeWidth: 2,
      roughness: 1.6,
      bowing: 1.2,
    })
    svg.appendChild(node)
  }, [size, background, color])

  const wrapStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    padding: '14px 18px',
    fontSize,
    lineHeight: 1.3,
    color: textColor,
    fontWeight: 500,
    fontStyle: type === 'thought' ? 'italic' : 'normal',
    textAlign: 'center',
  }

  return (
    <div ref={ref} style={wrapStyle}>
      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }}
        aria-hidden
      />
      {children}
    </div>
  )
}
