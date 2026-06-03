import { usePageContext } from '../engine/PageContext'

/**
 * Read the current page's scroll progress (0..1) from inside a <Page>.
 * The composability primitive: any custom widget can drive its own animation
 * off this value.
 *
 * @example
 * function Parallax() {
 *   const p = useScrollProgress()
 *   return <div style={{ transform: `translateY(${p * -40}px)` }} />
 * }
 */
export function useScrollProgress(): number {
  return usePageContext().scrollPercent
}
