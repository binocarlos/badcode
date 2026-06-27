/** A generated <img> on the Flow canvas, reduced to what selection needs. */
export interface CanvasImg {
  /** Media UUID parsed from the img src; '' if absent. */
  name: string
  width: number
  height: number
}

/**
 * Flow can show several generated images at once (thumbnails + the active one).
 * The active canvas is the largest on-screen image with a media name.
 */
export function pickActiveCanvas(imgs: CanvasImg[]): string | null {
  let best: CanvasImg | null = null
  for (const im of imgs) {
    if (!im.name) continue
    if (!best || im.width * im.height > best.width * best.height) best = im
  }
  return best ? best.name : null
}
