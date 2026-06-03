import type { CSSProperties } from 'react'
import type { BubbleRendererProps, TailDirection } from './types'

/**
 * Clean vector speech/thought/narration bubble built from plain CSS.
 * Speech bubbles get a triangular tail; thought bubbles a trail of dots;
 * narration is a plain caption box.
 */
function tailOffsets(tail: TailDirection): CSSProperties {
  switch (tail) {
    case 'bottom':
      return { left: '50%', bottom: -10, transform: 'translateX(-50%) rotate(45deg)' }
    case 'bottom-right':
      return { right: 24, bottom: -10, transform: 'rotate(45deg)' }
    case 'top-left':
      return { left: 24, top: -10, transform: 'rotate(45deg)' }
    case 'top':
      return { left: '50%', top: -10, transform: 'translateX(-50%) rotate(45deg)' }
    case 'top-right':
      return { right: 24, top: -10, transform: 'rotate(45deg)' }
    case 'bottom-left':
    default:
      return { left: 24, bottom: -10, transform: 'rotate(45deg)' }
  }
}

export function CleanBubble({
  type,
  children,
  tail = 'bottom-left',
  background = '#ffffff',
  color = '#111111',
  textColor = '#111111',
  fontSize = 18,
}: BubbleRendererProps) {
  const isNarration = type === 'narration'
  const showTail = !isNarration && tail !== 'none'

  const bodyStyle: CSSProperties = {
    position: 'relative',
    background,
    color: textColor,
    border: `2px solid ${color}`,
    borderRadius: isNarration ? 6 : 18,
    padding: isNarration ? '8px 12px' : '12px 16px',
    fontSize,
    lineHeight: 1.3,
    fontWeight: isNarration ? 600 : 500,
    fontStyle: type === 'thought' ? 'italic' : 'normal',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    textAlign: 'center',
  }

  const tailStyle: CSSProperties = {
    position: 'absolute',
    width: 16,
    height: 16,
    background,
    borderRight: `2px solid ${color}`,
    borderBottom: `2px solid ${color}`,
    ...tailOffsets(tail),
  }

  return (
    <div style={bodyStyle}>
      {children}
      {showTail && type === 'speech' && <span style={tailStyle} />}
      {showTail && type === 'thought' && <ThoughtTail tail={tail} background={background} color={color} />}
    </div>
  )
}

function ThoughtTail({
  tail,
  background,
  color,
}: {
  tail: TailDirection
  background: string
  color: string
}) {
  const bottom = tail.startsWith('bottom')
  const dotBase: CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    background,
    border: `2px solid ${color}`,
    left: 20,
  }
  return (
    <>
      <span style={{ ...dotBase, width: 12, height: 12, [bottom ? 'bottom' : 'top']: -8 }} />
      <span style={{ ...dotBase, width: 8, height: 8, left: 34, [bottom ? 'bottom' : 'top']: -18 }} />
    </>
  )
}
