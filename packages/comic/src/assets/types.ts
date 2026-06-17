/** A static image resolved to absolute URLs, ready for the widget. */
export interface ResolvedImage {
  /** ThumbHash decoded to a data-URI ('' when not generated). */
  thumb: string
  /** Absolute URL of the low-res WebP. */
  low: string
  /** Absolute URL of the high-res WebP. */
  high: string
  width: number
  height: number
}

/** One video rendition resolved to an absolute URL. */
export interface ResolvedRendition {
  height: number
  width: number
  url: string
}

/** An animation resolved to absolute URLs, ready for the widget. */
export interface ResolvedAnimation {
  /** ThumbHash of the poster, decoded to a data-URI ('' when not generated). */
  thumb: string
  /** Absolute URL of the WebP poster. */
  poster: string
  /** Renditions sorted ascending by height. */
  renditions: ResolvedRendition[]
  width: number
  height: number
  frameCount: number
  fps: number
}

export interface Comic {
  resolve(key: string): ResolvedImage
  resolveAnimation(key: string): ResolvedAnimation
}
