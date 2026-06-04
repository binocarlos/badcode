import { homeSteps } from './timeline'
import { StoryNode } from './StoryNode'

export function Constellation({ onFlash }: { onFlash: () => void }) {
  return (
    <group>
      {homeSteps.map((n) => <StoryNode key={n.id} node={n} onFlash={onFlash} />)}
    </group>
  )
}
