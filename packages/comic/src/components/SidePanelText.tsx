import type { CSSProperties, ReactNode } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { computeTextEffectStyles } from '../text/computeTextStyles'
import { buildTextConfig, type RevealSegment } from '../text/segments'
import { resolvePanelBackground, type PanelPreset } from '../styles/presets'
import { markSlot } from './slots'

export type PanelPosition = 'right' | 'left' | 'bottom'

export interface SidePanelTextProps {
  /** Scroll-linked reveal, e.g. [scrollIn(), pause(0.2), fadeOut()]. Omit for always-on. */
  reveal?: RevealSegment[]
  /** Panel background: a preset name or a CSSProperties object. */
  background?: PanelPreset | CSSProperties
  /** Where the panel sits over the page (default 'right'). */
  position?: PanelPosition
  /** Panel width in px for left/right placement (default 420). */
  width?: number
  children: ReactNode
}

function containerStyle(position: PanelPosition, width: number): CSSProperties {
  const base: CSSProperties = { position: 'absolute', display: 'flex', pointerEvents: 'none' }
  switch (position) {
    case 'left':
      return { ...base, top: 0, left: 0, height: '100%', width, alignItems: 'center', justifyContent: 'center', padding: '0 24px' }
    case 'bottom':
      return { ...base, left: 0, right: 0, bottom: 0, justifyContent: 'center', padding: '0 24px 48px' }
    case 'right':
    default:
      return { ...base, top: 0, right: 0, height: '100%', width, alignItems: 'center', justifyContent: 'center', padding: '0 24px' }
  }
}

/**
 * A text panel overlaid on the page, with an optional scroll-linked reveal
 * (scroll/fade/pause). Uses the ported computeTextEffectStyles math.
 */
export const SidePanelText = markSlot(function SidePanelText({
  reveal,
  background,
  position = 'right',
  width = 420,
  children,
}: SidePanelTextProps) {
  const scrollPercent = useScrollProgress()
  const { opacity, transform } = computeTextEffectStyles(scrollPercent, buildTextConfig(reveal))
  const bg = resolvePanelBackground(background)

  return (
    <div style={containerStyle(position, width)}>
      <div
        style={{
          ...bg,
          opacity,
          transform,
          padding: '24px 28px',
          borderRadius: 12,
          maxWidth: '100%',
          pointerEvents: 'auto',
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  )
}, 'side')
