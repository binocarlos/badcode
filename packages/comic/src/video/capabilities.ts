/** True when the browser can decode video frames via WebCodecs. */
export function supportsWebCodecs(): boolean {
  return typeof globalThis !== 'undefined' && typeof (globalThis as { VideoDecoder?: unknown }).VideoDecoder === 'function'
}

/** Map page scroll progress (0..1) to a clamped frame index. */
export function frameIndexFor(progress: number, frameCount: number): number {
  if (frameCount <= 0) return 0
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.round(clamped * (frameCount - 1))
}
