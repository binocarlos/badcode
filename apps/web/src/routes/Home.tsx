import { Suspense, lazy, useMemo } from 'react'
import { detectEnvironment, shouldUse2D } from '../home/environment'
import { Fallback2D } from '../home/Fallback2D'

const Scene = lazy(() => import('../home/Scene'))

export function Home() {
  const use2D = useMemo(() => shouldUse2D(detectEnvironment()), [])
  if (use2D) return <Fallback2D />
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#000' }} />}>
      <Scene />
    </Suspense>
  )
}
