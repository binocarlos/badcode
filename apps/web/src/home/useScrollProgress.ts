import { useEffect } from 'react'

/** Calls back with normalized page scroll [0,1] whenever it changes. */
export function useScrollProgress(onChange: (t: number) => void): void {
  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      onChange(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [onChange])
}
