import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line } from '@react-three/drei'
import { GRAPH } from '../graph'
import { DEEP } from '../colors'

type V2 = readonly [number, number]
const to3 = (p: V2) => new Vector3(p[0], p[1], 0)

function branchPoints(pts: readonly V2[]): Vector3[] {
  const curve = new CatmullRomCurve3(pts.map(to3), false, 'catmullrom', 0.2)
  return curve.getPoints(60)
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const slice = (pts: Vector3[], frac: number) => pts.slice(0, Math.floor(clamp01(frac) * pts.length))

export function StarChart({ drawProgress = 1 }: { drawProgress?: number }) {
  const { history, bad, good } = GRAPH.branches
  const lines = useMemo(
    () => ({
      history: branchPoints(history),
      bad:     branchPoints(bad),
      good:    branchPoints(good),
    }),
    [history, bad, good],
  )

  // The graph draws itself: history first (0→0.5), then both branches grow
  // outward from the fork (0.5→1). At drawProgress=1 the full graph is shown.
  const hist  = slice(lines.history, drawProgress / 0.5)
  const bad2  = slice(lines.bad,  (drawProgress - 0.5) / 0.5)
  const good2 = slice(lines.good, (drawProgress - 0.5) / 0.5)

  return (
    <group>
      {/* far cool nebula wash — large + receded so it reads as backdrop, never a card */}
      <mesh position={[8, 0, -90]}>
        <planeGeometry args={[700, 460]} />
        <meshBasicMaterial color={DEEP.nebula1} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      {/* faint warm wash — full-bleed so it never reads as a panel edge */}
      <mesh position={[10, 2, -70]}>
        <planeGeometry args={[640, 420]} />
        <meshBasicMaterial color={DEEP.gold} transparent opacity={0.012} depthWrite={false} />
      </mesh>

      {/* the spark — the fork, the push that split the timeline */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color={DEEP.lineHot} />
      </mesh>

      {hist.length  >= 2 && <Line points={hist}  color={DEEP.lineHot} lineWidth={2} transparent opacity={0.9} />}
      {bad2.length  >= 2 && <Line points={bad2}  color={DEEP.lineHot} lineWidth={2} transparent opacity={0.9} />}
      {good2.length >= 2 && <Line points={good2} color={DEEP.lineHot} lineWidth={2} transparent opacity={0.9} />}

      {GRAPH.historyCommits.map((c, i) => (
        <mesh key={i} position={[c[0], c[1], 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshBasicMaterial color={DEEP.gold} />
        </mesh>
      ))}
    </group>
  )
}
