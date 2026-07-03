import './hud.css'
import { Link } from 'react-router-dom'
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
  onPlayIntro,
}: {
  nav: NavState
  nodes: AtlasNode[]
  introPlaying: boolean
  onSkip: () => void
  onPlayIntro: () => void
}) {
  const focused = nodes.find((n) => n.id === nav.focusId)
  const where = focused
    ? `// ${BRANCH_LABEL[focused.branch]} ▸ ${focused.title.toUpperCase()} · REC ●`
    : `// THE ATLAS · ${nav.lod.toUpperCase()} · REC ●`

  return (
    <div className="hud">
      <div className="hud-top">
        <Link className="hud-home" to="/">← badcode index</Link>
        <div className="hud-brand">BADCODE</div>
        <div className="hud-sub">git push origin master</div>
      </div>
      <div className="hud-where">{where}</div>
      <div className="hud-hint">drag to pan&nbsp;&nbsp;·&nbsp;&nbsp;scroll to zoom&nbsp;&nbsp;·&nbsp;&nbsp;click a node to dive in</div>
      {introPlaying ? (
        <button className="hud-skip" onClick={onSkip}>skip / explore</button>
      ) : !nav.focusId ? (
        <button className="hud-skip" onClick={onPlayIntro}>▶ play the origin</button>
      ) : null}
    </div>
  )
}
