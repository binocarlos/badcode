export interface EnvSignals {
  reducedMotion: boolean
  webglAvailable: boolean
}

/** Pure policy: use the static 2D fallback if motion is reduced or WebGL is missing. */
export function shouldUse2D({ reducedMotion, webglAvailable }: EnvSignals): boolean {
  return reducedMotion || !webglAvailable
}

/** Browser probe (not unit-tested; guarded for SSR/test envs). */
export function detectEnvironment(): EnvSignals {
  if (typeof window === 'undefined') {
    return { reducedMotion: true, webglAvailable: false }
  }
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  let webglAvailable = false
  try {
    const canvas = document.createElement('canvas')
    webglAvailable = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    webglAvailable = false
  }
  return { reducedMotion, webglAvailable }
}
