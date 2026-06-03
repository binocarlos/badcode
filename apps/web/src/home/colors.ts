/** BadCode homepage palette. Black void, white spine, cyan = enterable, grey = history. */
export const COLORS = {
  black: '#000000',
  white: '#ffffff',
  /** Electric cyan — anything the user can enter glows this colour. */
  cyan: '#46d5ff',
  /** Faint grey — history commits / atmosphere. */
  grey: '#6a7480',
  /** Dim tether lines. */
  tether: '#244657',
} as const

export type ColorName = keyof typeof COLORS
