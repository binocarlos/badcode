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

/** Deep Field cosmos tokens: warm gold/violet against the cold cyan, nebula fog. */
export const DEEP = {
  void:    '#02030a',
  cyan:    '#46d5ff',
  gold:    '#e8c98a',
  violet:  '#8a6cff',
  nebula1: '#231a3a',
  nebula2: '#0a0813',
  line:    '#3a6a7e',
  lineHot: '#7be3ff',
} as const

export type ColorName = keyof typeof COLORS
