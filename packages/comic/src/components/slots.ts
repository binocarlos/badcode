import { Children, isValidElement, type ReactNode } from 'react'

/**
 * Page children are sorted into layers by a static `slot` marker on the
 * component. Anything unmarked falls into the widget layer, so authors can drop
 * custom content in as the main visual.
 */
export type Slot = 'widget' | 'bubble' | 'side'

interface Slotted {
  slot?: Slot
}

/** Tag a component with the layer it belongs to. */
export function markSlot<T>(component: T, slot: Slot): T {
  ;(component as unknown as Slotted).slot = slot
  return component
}

function slotOf(type: unknown): Slot | undefined {
  if (typeof type === 'function' || typeof type === 'object') {
    return (type as Slotted | null)?.slot
  }
  return undefined
}

export interface SortedChildren {
  widget: ReactNode[]
  bubble: ReactNode[]
  side: ReactNode[]
}

/** Split a page's children into widget / bubble / side-text layers. */
export function sortChildren(children: ReactNode): SortedChildren {
  const result: SortedChildren = { widget: [], bubble: [], side: [] }
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) result.widget.push(child)
      return
    }
    const slot = slotOf(child.type)
    if (slot === 'bubble') result.bubble.push(child)
    else if (slot === 'side') result.side.push(child)
    else result.widget.push(child)
  })
  return result
}
