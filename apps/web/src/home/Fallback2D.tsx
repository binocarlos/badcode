import { Link } from 'react-router-dom'
import { GRAPH, storyNodes } from './graph'
import { COLORS } from './colors'

// Plane (x:-32..32, y:-14..14) → SVG (0..1280, 0..560). y is flipped (up = -screen).
const SX = (x: number) => ((x + 32) / 64) * 1280
const SY = (y: number) => ((14 - y) / 28) * 560
const pts = (ps: readonly (readonly [number, number])[]) =>
  ps.map(([x, y]) => `${SX(x)},${SY(y)}`).join(' ')

export function Fallback2D() {
  const { branches, historyCommits, tips } = GRAPH
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: 'min(1100px, 96vw)' }}>
        <h1 style={{ letterSpacing: 6, textAlign: 'center', margin: '0 0 4px' }}>BADCODE</h1>
        <p style={{ textAlign: 'center', color: COLORS.grey, marginTop: 0 }}>
          humans, you done fucked up… thankfully you are loved, and we can fix it.
        </p>
        <svg viewBox="0 0 1400 560" role="img" aria-label="The BadCode timeline: shared history forking into a bad branch and a good branch" style={{ width: '100%', height: 'auto' }}>
          <polyline points={pts(branches.history)} fill="none" stroke={COLORS.white} strokeWidth={2.5} />
          <polyline points={pts(branches.bad)} fill="none" stroke="#bbb" strokeWidth={2.5} />
          <polyline points={pts(branches.good)} fill="none" stroke="#bbb" strokeWidth={2.5} />
          {historyCommits.map(([x, y], i) => (
            <circle key={i} cx={SX(x)} cy={SY(y)} r={3} fill={COLORS.grey} />
          ))}
          {/* tips */}
          {(['storyverse', 'futureProof'] as const).map((k) => (
            <Link key={k} to={tips[k].route}>
              <rect x={SX(tips[k].pos[0]) - 16} y={SY(tips[k].pos[1]) - 20} width={150} height={48} fill="transparent" />
              <circle cx={SX(tips[k].pos[0])} cy={SY(tips[k].pos[1])} r={9} fill="none" stroke={COLORS.white} strokeWidth={2.5} />
              <text x={SX(tips[k].pos[0]) - 10} y={SY(tips[k].pos[1]) + (tips[k].branch === 'bad' ? -16 : 26)} fill={COLORS.white} fontSize={14}>
                {tips[k].title.toUpperCase()}
              </text>
            </Link>
          ))}
          {/* story nodes */}
          {storyNodes.map((n) => (
            <Link key={n.id} to={n.route} aria-label={`${n.title}${n.status === 'live' ? '' : ' (coming soon)'}`}>
              <rect x={SX(n.pos[0]) - 14} y={SY(n.pos[1]) - 14} width={240} height={28} fill="transparent" />
              <line x1={SX(n.clip[0])} y1={SY(n.clip[1])} x2={SX(n.pos[0])} y2={SY(n.pos[1])} stroke={COLORS.tether} strokeWidth={1} />
              <circle cx={SX(n.pos[0])} cy={SY(n.pos[1])} r={8} fill="none" stroke={COLORS.cyan} strokeWidth={2} opacity={n.status === 'live' ? 1 : 0.5} />
              <text x={SX(n.pos[0]) + 12} y={SY(n.pos[1]) + 4} fill={COLORS.cyan} fontSize={12} opacity={n.status === 'live' ? 1 : 0.6}>
                {n.title}
              </text>
            </Link>
          ))}
        </svg>
        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/about">about</Link>
        </p>
      </div>
    </main>
  )
}
