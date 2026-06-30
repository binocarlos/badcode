import { describe, it, expect } from 'vitest'
import { pickProject, type ProjectTile } from './project'

const tiles: ProjectTile[] = [
  { name: 'camping-v2', href: '/fx/tools/flow/project/aaa' },
  { name: 'Magic Money Tree', href: '/fx/tools/flow/project/bbb' },
  { name: 'camping-v2', href: '/fx/tools/flow/project/ccc' }, // older dup
]

describe('pickProject', () => {
  it('returns the href of the first exact name match', () => {
    expect(pickProject(tiles, 'camping-v2')).toBe('/fx/tools/flow/project/aaa')
  })
  it('is case-insensitive and trims', () => {
    expect(pickProject(tiles, '  CAMPING-V2 ')).toBe('/fx/tools/flow/project/aaa')
  })
  it('returns null when no tile matches', () => {
    expect(pickProject(tiles, 'nope')).toBeNull()
  })
  it('returns null for an empty list', () => {
    expect(pickProject([], 'camping-v2')).toBeNull()
  })
})
