// apps/web/src/home/Constellation.tsx
import { homeSteps } from './timeline'
import { StoryNode } from './StoryNode'
import type { TimelineLayout } from '@badcode/scroll-timeline'

export function Constellation({
  layout,
  onFlash,
  revealedSteps,
  menuMode,
}: {
  layout:        TimelineLayout
  onFlash:       () => void
  revealedSteps: Set<string>
  menuMode:      boolean
}) {
  return (
    <group>
      {homeSteps.map((step) => (
        <StoryNode
          key={step.id}
          step={step}
          layout={layout}
          onFlash={onFlash}
          revealed={revealedSteps.has(step.id)}
          menuMode={menuMode}
        />
      ))}
    </group>
  )
}
