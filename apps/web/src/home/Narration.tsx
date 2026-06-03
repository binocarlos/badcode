import { useEffect, useRef, useState } from 'react'

const LINE = 'humans, you done fucked up… thankfully you are loved, and we can fix it.'

export function Narration() {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  ).current

  useEffect(() => {
    if (reduced) { setShown(LINE); setDone(true); return }
    let i = 0
    const id = window.setInterval(() => {
      i++
      setShown(LINE.slice(0, i))
      if (i >= LINE.length) {
        window.clearInterval(id)
        window.setTimeout(() => setDone(true), 2600)
      }
    }, 38)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 48, textAlign: 'center',
      pointerEvents: 'none', zIndex: 2, padding: '0 24px',
      color: 'var(--cyan)', fontSize: 14, letterSpacing: 0.5,
      opacity: done ? 0 : 1, transition: 'opacity 1.2s ease',
    }}>
      {shown}
    </div>
  )
}
