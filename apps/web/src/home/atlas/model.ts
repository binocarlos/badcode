import { homeSteps } from '../timeline'
import { GRAPH } from '../graph'

export type Branch = 'history' | 'bad' | 'good'

export interface AtlasNode {
  id:     string
  title:  string
  branch: Branch
  pos:    [number, number, number]
  clip:   [number, number]
  route?: string
  status: 'live' | 'coming-soon'
  ring:   boolean
  plate?: string
  video?: string
  blurb?: string
}

export interface AtlasTip {
  id:     string
  title:  string
  pos:    [number, number, number]
  route:  string
  branch: 'bad' | 'good'
}

/** Flatten homeSteps + GRAPH tips into render-ready 3D nodes on the z=0 plane. */
export function buildAtlas(): { nodes: AtlasNode[]; tips: AtlasTip[] } {
  const nodes: AtlasNode[] = homeSteps.map((s) => ({
    id:     s.id,
    title:  s.title,
    branch: s.branch,
    pos:    [s.pos[0], s.pos[1], 0],
    clip:   s.clip,
    route:  s.route,
    status: s.status ?? 'live',
    ring:   s.ring ?? false,
    plate:  s.plate,
    video:  s.video,
    blurb:  s.blurb,
  }))

  const tips: AtlasTip[] = (['storyverse', 'futureProof'] as const).map((k) => {
    const t = GRAPH.tips[k]
    const node = nodes.find((n) => n.id === (k === 'storyverse' ? 'storyverse' : 'future-proof'))!
    return { id: node.id, title: t.title, pos: node.pos, route: t.route, branch: t.branch }
  })

  return { nodes, tips }
}
