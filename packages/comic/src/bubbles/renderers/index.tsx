import { CleanBubble } from './CleanBubble'
import { RoughBubble } from './RoughBubble'
import type { BubbleRendererProps, RendererType } from './types'

export { CleanBubble } from './CleanBubble'
export { RoughBubble } from './RoughBubble'
export type {
  BubbleRendererProps,
  BubbleType,
  RendererType,
  TailDirection,
} from './types'

export interface BubbleFactoryProps extends BubbleRendererProps {
  renderer?: RendererType
}

/** Renders the appropriate bubble for the requested renderer. */
export function BubbleFactory({ renderer = 'clean', ...props }: BubbleFactoryProps) {
  // Narration always uses the clean caption box.
  if (renderer === 'rough' && props.type !== 'narration') {
    return <RoughBubble {...props} />
  }
  return <CleanBubble {...props} />
}
