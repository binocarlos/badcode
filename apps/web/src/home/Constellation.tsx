import { storyNodes } from './graph'
import { StoryNode } from './StoryNode'

export function Constellation({ onFlash }: { onFlash: () => void }) {
  return (
    <group>
      {storyNodes.map((n) => <StoryNode key={n.id} node={n} onFlash={onFlash} />)}
    </group>
  )
}
