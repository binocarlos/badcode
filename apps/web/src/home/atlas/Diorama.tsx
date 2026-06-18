import './diorama.css'
import type { AtlasNode } from './model'
import { enterTargetFor } from './diorama'

export function Diorama({
  node,
  onEnter,
  onBack,
}: {
  node: AtlasNode | null
  onEnter: (route: string) => void
  onBack: () => void
}) {
  if (!node) return null
  const target = enterTargetFor(node)
  return (
    <div className="diorama">
      <div className="diorama-tag">{node.branch === 'good' ? 'GOOD_BRANCH' : node.branch === 'bad' ? 'BAD_BRANCH' : 'SHARED_HISTORY'}</div>
      <h2 className="diorama-title">{node.title}</h2>
      {node.blurb && <p className="diorama-blurb">{node.blurb}</p>}
      <div className="diorama-actions">
        {target
          ? <button className="diorama-btn" onClick={() => onEnter(target)}>▶ enter</button>
          : <button className="diorama-btn" disabled>// transmission pending</button>}
        <button className="diorama-btn diorama-back" onClick={onBack}>← back</button>
      </div>
    </div>
  )
}
