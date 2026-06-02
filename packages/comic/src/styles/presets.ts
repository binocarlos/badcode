import type { CSSProperties } from 'react'

/**
 * Typed background presets for side-text panels. Authors pass a preset name
 * (`background="dark-glass"`) or their own CSSProperties object. This replaces
 * the storyteller engine's stringly CSS-preset parsing.
 */
export type PanelPreset =
  | 'dark-glass'
  | 'frosted'
  | 'solid-dark'
  | 'gradient-dark'
  | 'transparent'

export const panelPresets: Record<PanelPreset, CSSProperties> = {
  'dark-glass': {
    background: 'rgba(10, 10, 12, 0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#f5f5f5',
  },
  frosted: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#ffffff',
  },
  'solid-dark': {
    background: '#0a0a0c',
    color: '#f5f5f5',
  },
  'gradient-dark': {
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 60%)',
    color: '#f5f5f5',
  },
  transparent: {
    background: 'transparent',
    color: '#ffffff',
    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
  },
}

export function resolvePanelBackground(
  background: PanelPreset | CSSProperties | undefined,
): CSSProperties {
  if (!background) return panelPresets['dark-glass']
  if (typeof background === 'string') return panelPresets[background] ?? panelPresets['dark-glass']
  return background
}
