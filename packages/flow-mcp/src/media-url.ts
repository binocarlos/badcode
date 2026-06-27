/** Flow serves generated media via an authenticated same-origin redirect endpoint. */
const REDIRECT_BASE = 'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect'

/** True if a URL or <img> src points at Flow's media redirect endpoint. */
export function isMediaSrc(src: string): boolean {
  return src.includes('getMediaUrlRedirect')
}

/** Pull the `name` query param (the media UUID) out of a redirect URL or img src. */
export function parseMediaName(src: string): string | null {
  const match = src.match(/[?&]name=([^&]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

/** Build the authenticated redirect URL for a media name. */
export function mediaRedirectUrl(name: string): string {
  return `${REDIRECT_BASE}?name=${name}`
}
