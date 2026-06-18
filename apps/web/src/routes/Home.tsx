import { Suspense, lazy, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { detectEnvironment, shouldUse2D } from '../home/environment'
import { Fallback2D } from '../home/Fallback2D'
import { buildAtlas } from '../home/atlas/model'
import { nodeForFromState } from '../home/atlas/deeplink'

const AtlasScene = lazy(() => import('../home/atlas/AtlasScene'))

export function Home() {
  const env = useMemo(() => detectEnvironment(), [])
  const location = useLocation()
  // The URL hash is the source of truth for "start zoomed into a node":
  //   /#camping → land focused on Camping (no intro) · / → zoomed-out intro.
  const hashId = location.hash.replace(/^#/, '') || undefined

  const startFocus = useMemo(() => {
    const { nodes } = buildAtlas()
    return nodeForFromState(hashId, nodes)
  }, [hashId])

  if (shouldUse2D(env)) return <Fallback2D />
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#04060b' }} />}>
      <AtlasScene startFocus={startFocus} />
    </Suspense>
  )
}
