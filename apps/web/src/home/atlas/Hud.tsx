import './hud.css'
import type { NavState } from './navState'
import type { AtlasNode } from './model'

const BRANCH_LABEL: Record<string, string> = {
  history: 'SHARED_HISTORY', bad: 'BAD_BRANCH ▸ STORYVERSE', good: 'GOOD_BRANCH ▸ FUTURE_PROOF',
}

export function Hud({
  nav,
  nodes,
  introPlaying,
  onSkip,
}: {
  nav: NavState
  nodes: AtlasNode[]
  introPlaying: boolean
  onSkip: () => void
}) {
  const focused = nodes.find((n) => n.id === nav.focusId)
  const where = focused
    ? `// ${BRANCH_LABEL[focused.branch]} ▸ ${focused.title.toUpperCase()} · REC ●`
    : `// THE ATLAS · ${nav.lod.toUpperCase()} · REC ●`

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-brand">BADCODE</div>
        <div className="hud-sub">git push origin master</div>
      </div>
      <div className="hud-where">{where}</div>
      <div className="hud-hint">drag · pan&nbsp;&nbsp;scroll · zoom&nbsp;&nbsp;click · enter</div>
      {introPlaying && (
        <button className="hud-skip" onClick={onSkip}>skip / explore</button>
      )}
    </div>
  )
}
