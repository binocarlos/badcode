import { describe, it, expect } from 'vitest'
import { nodeForFromState, poseForNode } from './deeplink'
import { buildAtlas } from './model'

const { nodes } = buildAtlas()

describe('nodeForFromState', () => {
  it('matches by comic slug carried in the route', () => {
    expect(nodeForFromState('camping', nodes)!.id).toBe('camping')
  })
  it('matches by node id directly', () => {
    expect(nodeForFromState('storyverse', nodes)!.id).toBe('storyverse')
  })
  it('returns null for unknown / undefined', () => {
    expect(nodeForFromState(undefined, nodes)).toBeNull()
    expect(nodeForFromState('nope', nodes)).toBeNull()
  })
})

describe('poseForNode', () => {
  it('pulls the camera back on z and looks at the node', () => {
    const karen = nodes.find((n) => n.id === 'karen')!
    const pose = poseForNode(karen)
    expect(pose.target).toEqual([18, 14, 0])
    expect(pose.position).toEqual([18, 14, 22])
  })
})
