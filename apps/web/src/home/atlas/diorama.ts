import type { AtlasNode } from './model'

/** Where "enter" goes: a live node with a route → that route; otherwise null. */
export function enterTargetFor(node: AtlasNode): string | null {
  if (node.status !== 'live') return null
  return node.route ?? null
}
