import { storyNodes } from './graph'
import { StoryNode } from './StoryNode'

export function Constellation() {
  return (
    <group>
      {storyNodes.map((n) => <StoryNode key={n.id} node={n} />)}
    </group>
  )
}
