import { describe, it, expect } from 'vitest'
import { splitLatestPath, versionedPath, latestPath, nextVersion, parseVersion } from './bucket-path'

describe('bucket-path', () => {
  it('splits a .latest pointer into dir/base/ext', () => {
    expect(splitLatestPath('pages/p2/main.latest.png')).toEqual({ dir: 'pages/p2', base: 'main', ext: 'png' })
  })

  it('splits a pointer with no directory', () => {
    expect(splitLatestPath('cover.latest.webp')).toEqual({ dir: '', base: 'cover', ext: 'webp' })
  })

  it('throws on a non-.latest path', () => {
    expect(() => splitLatestPath('pages/p2/main.v3.png')).toThrow(/not a \.latest pointer/)
  })

  it('builds versioned and latest relative paths', () => {
    const parts = splitLatestPath('pages/p2/main.latest.png')
    expect(versionedPath(parts, 4)).toBe('pages/p2/main.v4.png')
    expect(latestPath(parts)).toBe('pages/p2/main.latest.png')
  })

  it('computes the next version', () => {
    expect(nextVersion([])).toBe(1)
    expect(nextVersion([1, 2, 3])).toBe(4)
    expect(nextVersion([2, 5, 1])).toBe(6)
  })

  it('parses a version number from a filename, or null', () => {
    expect(parseVersion('main.v7.png')).toBe(7)
    expect(parseVersion('main.latest.png')).toBeNull()
    expect(parseVersion('main.png')).toBeNull()
  })
})
