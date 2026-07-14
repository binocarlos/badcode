/** A generated <img> on the Flow canvas, reduced to what selection needs. */
export interface CanvasImg {
  /** Media UUID parsed from the img src; '' if absent. */
  name: string
  width: number
  height: number
}

/**
 * All media images whose UUID is not in `before`, deduped by name keeping the
 * largest on-screen instance (a media can render as both thumbnail and canvas).
 * Multi-output turns (x2/x4) surface one entry per fresh candidate.
 */
export function collectNewCanvases(imgs: CanvasImg[], before: Set<string>): CanvasImg[] {
  const byName = new Map<string, CanvasImg>()
  for (const im of imgs) {
    if (!im.name || before.has(im.name)) continue
    const prev = byName.get(im.name)
    if (!prev || im.width * im.height > prev.width * prev.height) byName.set(im.name, im)
  }
  return [...byName.values()]
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
