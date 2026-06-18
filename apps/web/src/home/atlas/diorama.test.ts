import { describe, it, expect } from 'vitest'
import { enterTargetFor } from './diorama'
import { buildAtlas } from './model'

const { nodes } = buildAtlas()
const byId = (id: string) => nodes.find((n) => n.id === id)!

describe('enterTargetFor', () => {
  it('returns the route for a live story node', () => {
    expect(enterTargetFor(byId('camping'))).toBe('/comics/camping')
  })
  it('returns the route for a live tip', () => {
    expect(enterTargetFor(byId('storyverse'))).toBe('/storyverse')
  })
  it('returns null for a coming-soon node', () => {
    expect(enterTargetFor(byId('emperors-coin'))).toBeNull()
  })
})
