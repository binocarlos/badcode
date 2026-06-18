// Core types
export type { Point, ScrollDirection, EffectInstance, TransitionInstance, EffectContext } from './types'

// Components
export { ScrollComic, type ScrollComicProps } from './components/ScrollComic'
export { Page, type PageProps } from './components/Page'
export { ImageWidget, type ImageWidgetProps } from './components/ImageWidget'
export { AnimationWidget, type AnimationWidgetProps } from './components/AnimationWidget'
export {
  SpeechBubble,
  NarrationBox,
  type SpeechBubbleProps,
  type NarrationBoxProps,
} from './components/SpeechBubble'
export {
  SidePanelText,
  type SidePanelTextProps,
  type PanelPosition,
} from './components/SidePanelText'

// Hooks
export { useScrollProgress } from './hooks/useScrollProgress'
export { useScrollEffect } from './hooks/useScrollEffect'

// Bubble visibility + renderers (for custom bubble work)
export { computeBubbleVisibility } from './bubbles/visibility'
export type { BubbleVisibility, BubbleTiming } from './bubbles/visibility'
export { BubbleFactory } from './bubbles/renderers'
export type { BubbleType, RendererType, TailDirection } from './bubbles/renderers'

// Styling presets
export { panelPresets, resolvePanelBackground, type PanelPreset } from './styles/presets'

// NOTE: effect factories (zoom, grayscale, …), transition factories (crossfade,
// iris, …), and text-reveal segments (scrollIn, pause, …) are imported from the
// subpaths to avoid name collisions:
//   import { zoom } from '@badcode/comic/effects'
//   import { crossfade } from '@badcode/comic/transitions'
//   import { scrollIn, pause } from '@badcode/comic/text'

// Asset resolver
export { createComic, DEFAULT_BASE_URL } from './assets/createComic'
export type { Comic, ResolvedImage, ResolvedRendition, ResolvedAnimation } from './assets/types'
