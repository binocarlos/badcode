import { describe, it, expect } from 'vitest'
import { defineComic } from './defineComic'
import { comicUrl, resolve, sheetUrl, BUCKET_BASE_URL } from './resolve'

const comic = defineComic({
  id: 'demo',
  style: 'ink',
  characters: { bob: { name: 'Bob', description: 'man', sheet: 'characters/bob/sheet.latest.png' } },
  assets: { 'p1-main': { kind: 'image', path: 'pages/p1/main.latest.png', characters: ['bob'], scene: 'rain' } },
})

describe('resolvers', () => {
  it('exposes the public bucket base url', () => {
    expect(BUCKET_BASE_URL).toBe('https://storage.googleapis.com/badcode-storage')
  })

  it('builds a comic-scoped url from a path', () => {
    expect(comicUrl('demo', 'pages/p1/main.latest.png')).toBe(
      'https://storage.googleapis.com/badcode-storage/comics/demo/pages/p1/main.latest.png',
    )
  })

  it('resolves an asset id to its url', () => {
    expect(resolve(comic, 'p1-main')).toBe(
      'https://storage.googleapis.com/badcode-storage/comics/demo/pages/p1/main.latest.png',
    )
  })

  it('resolves a character sheet url', () => {
    expect(sheetUrl(comic, 'bob')).toBe(
      'https://storage.googleapis.com/badcode-storage/comics/demo/characters/bob/sheet.latest.png',
    )
  })

  it('throws on an unknown asset id', () => {
    expect(() => resolve(comic, 'nope')).toThrow(/unknown asset/)
  })
})
