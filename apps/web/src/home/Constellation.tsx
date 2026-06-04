// apps/web/src/home/Constellation.tsx
import { homeSteps } from './timeline'
import { StoryNode } from './StoryNode'
import type { TimelineSample, TimelineLayout } from '@badcode/scroll-timeline'

export function Constellation({
  sample,
  layout,
  onFlash,
  revealedSteps,
  menuMode,
}: {
  sample:        TimelineSample
  layout:        TimelineLayout
  onFlash:       () => void
  revealedSteps: Set<string>
  menuMode:      boolean
}) {
  return (
    <group>
      {homeSteps.map((step, i) => (
        <StoryNode
          key={step.id}
          step={step}
          focus={sample.focus[i] ?? 0}
          layout={layout}
          onFlash={onFlash}
          revealed={revealedSteps.has(step.id)}
          menuMode={menuMode}
        />
      ))}
    </group>
  )
}
