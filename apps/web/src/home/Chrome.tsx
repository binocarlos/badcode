import { Link } from 'react-router-dom'
import { flyToT, autoplay } from './drivers'
import { waypoints } from './graph'
import { useCameraController } from './cameraController'

const btn: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
  font: 'inherit', fontSize: 12, padding: '6px 10px', cursor: 'pointer', letterSpacing: 1,
}

export function Chrome() {
  const ctrl = useCameraController()
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      <div style={{ position: 'absolute', top: 20, left: 24, pointerEvents: 'auto' }}>
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700 }}>BADCODE</div>
        <div style={{ color: 'var(--grey)', fontSize: 11 }}>git push origin master</div>
      </div>
      <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 10, pointerEvents: 'auto' }}>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToT(waypoints.fork) }}>fork</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToT(waypoints.storyverse) }}>storyverse</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; autoplay() }}>play</button>
        <Link to="/about" style={{ ...btn, display: 'inline-block' }}>about</Link>
      </div>
    </div>
  )
}
