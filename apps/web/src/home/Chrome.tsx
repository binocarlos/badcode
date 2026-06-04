// apps/web/src/home/Chrome.tsx
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { flyToStep, autoplay } from './drivers'
import { useCameraController } from './cameraController'
import type { TimelineLayout } from '@badcode/scroll-timeline'

const btn: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
  font: 'inherit', fontSize: 12, padding: '6px 10px', cursor: 'pointer', letterSpacing: 1,
}

const skipBtn: React.CSSProperties = {
  ...btn,
  position: 'fixed', bottom: 24, right: 24,
  opacity: 0.55,
  fontSize: 11,
}

export function Chrome({
  layout,
  mode,
  onEnterMenu,
  onEnterStory,
}: {
  layout:       TimelineLayout
  mode:         'story' | 'menu'
  onEnterMenu:  () => void
  onEnterStory: () => void
}) {
  const ctrl = useCameraController()
  const [playing, setPlaying] = useState(false)
  const tween = useRef<ReturnType<typeof autoplay> | null>(null)

  const togglePlay = () => {
    if (playing) {
      tween.current?.kill()
      tween.current = null
      setPlaying(false)
      return
    }
    ctrl.mode = 'travel'
    window.scrollTo(0, 0)
    const tw = autoplay(layout)
    tw.eventCallback('onComplete', () => { setPlaying(false); tween.current = null })
    tween.current = tw
    setPlaying(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {/* Logo */}
      <div style={{ position: 'absolute', top: 20, left: 24, pointerEvents: 'auto' }}>
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700 }}>BADCODE</div>
        <div style={{ color: 'var(--grey)', fontSize: 11 }}>git push origin master</div>
      </div>

      {/* Top-right nav */}
      <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 10, pointerEvents: 'auto' }}>
        {mode === 'menu' && (
          <button style={btn} onClick={onEnterStory}>story</button>
        )}
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToStep('storyverse', layout) }}>storyverse</button>
        <button style={btn} onClick={() => { ctrl.mode = 'travel'; flyToStep('future-proof', layout) }}>future proof</button>
        {mode === 'story' && (
          <button style={btn} onClick={togglePlay}>{playing ? 'stop' : 'play'}</button>
        )}
        <Link to="/about" style={{ ...btn, display: 'inline-block' }}>about</Link>
      </div>

      {/* Skip button — only in story mode */}
      {mode === 'story' && (
        <button style={{ ...skipBtn, pointerEvents: 'auto' }} onClick={onEnterMenu}>
          skip →
        </button>
      )}
    </div>
  )
}
