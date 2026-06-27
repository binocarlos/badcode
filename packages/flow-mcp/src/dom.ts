import { isMediaSrc, parseMediaName } from './media-url'
import type { CanvasImg } from './canvas'

/** Raw <img> descriptor as scraped from the page in a browser-context eval. */
export interface RawImg {
  src: string
  width: number
  height: number
}

/** The function string evaluated inside the page to scrape generated <img>s. */
export const SCRAPE_IMGS = `() => [...document.querySelectorAll('img')].map(im => ({
  src: im.currentSrc || im.src || '',
  width: im.getBoundingClientRect().width,
  height: im.getBoundingClientRect().height,
}))`

/** Map raw scraped imgs to media CanvasImgs (filter non-media, parse names). */
export function toCanvasImgs(raw: RawImg[]): CanvasImg[] {
  const out: CanvasImg[] = []
  for (const im of raw) {
    if (!isMediaSrc(im.src)) continue
    const name = parseMediaName(im.src)
    if (!name) continue
    out.push({ name, width: im.width, height: im.height })
  }
  return out
}
