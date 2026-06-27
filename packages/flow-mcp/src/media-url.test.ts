import { describe, it, expect } from 'vitest'
import { isMediaSrc, parseMediaName, mediaRedirectUrl } from './media-url'

describe('media-url', () => {
  const redirect =
    'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=71ef7331-65aa-4e13-84cc-6e3a3e37fa45'

  it('recognises a media redirect URL', () => {
    expect(isMediaSrc(redirect)).toBe(true)
    expect(isMediaSrc('https://example.com/logo.png')).toBe(false)
  })

  it('extracts the media name (UUID)', () => {
    expect(parseMediaName(redirect)).toBe('71ef7331-65aa-4e13-84cc-6e3a3e37fa45')
  })

  it('extracts the name when other params precede it', () => {
    expect(parseMediaName('https://x/y?foo=1&name=abc-123&bar=2')).toBe('abc-123')
  })

  it('url-decodes the name', () => {
    expect(parseMediaName('https://x?name=a%2Fb')).toBe('a/b')
  })

  it('returns null when there is no name param', () => {
    expect(parseMediaName('https://example.com/logo.png')).toBeNull()
  })

  it('builds the redirect URL from a name', () => {
    expect(mediaRedirectUrl('abc-123')).toBe(
      'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=abc-123',
    )
  })
})
