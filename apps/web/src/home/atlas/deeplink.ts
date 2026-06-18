import type { AtlasNode } from './model'

export type Pose = {
  position: [number, number, number]
  target:   [number, number, number]
}

/** Distance the camera sits back from a focused node (matches node-LOD threshold). */
const NODE_BACKOFF = 22

export function nodeForFromState(
  fromNode: string | undefined,
  nodes: AtlasNode[],
): AtlasNode | null {
  if (!fromNode) return null
  return (
    nodes.find((n) => n.id === fromNode) ??
    nodes.find((n) => n.route === `/comics/${fromNode}`) ??
    null
  )
}

export function poseForNode(node: AtlasNode): Pose {
  const [x, y, z] = node.pos
  return { position: [x, y, z + NODE_BACKOFF], target: [x, y, z] }
}
