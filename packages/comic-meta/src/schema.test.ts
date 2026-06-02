import { describe, it, expect } from 'vitest'
import { defineComic } from './defineComic'
import type { Comic } from './schema'

const valid: Comic = {
  id: 'demo',
  style: 'Gritty ink, muted palette.',
  characters: {
    bob: { name: 'Bob', description: 'Weathered man, 50s.', sheet: 'characters/bob/sheet.latest.png' },
  },
  assets: {
    'p1-main': { kind: 'image', path: 'pages/p1/main.latest.png', characters: ['bob'], scene: 'Bob stands in the rain.' },
    'p1-anim': { kind: 'video', path: 'pages/p1/anim.latest.mp4', from: 'p1-main', to: 'p1-main', transition: 'Bob raises his head.' },
  },
}

describe('defineComic', () => {
  it('accepts a valid comic and returns it', () => {
    const comic = defineComic(structuredClone(valid))
    expect(comic.id).toBe('demo')
    expect(comic.assets['p1-main'].kind).toBe('image')
  })

  it('rejects an image asset whose path is not a .latest image pointer', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-main'] as any).path = 'pages/p1/main.png'
    expect(() => defineComic(bad)).toThrow()
  })

  it('rejects a video asset with a non-video extension', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-anim'] as any).path = 'pages/p1/anim.latest.png'
    expect(() => defineComic(bad)).toThrow()
  })

  it('rejects an image asset referencing an unknown character', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-main'] as any).characters = ['nobody']
    expect(() => defineComic(bad)).toThrow(/unknown character/)
  })

  it('rejects a video referencing an unknown keyframe asset', () => {
    const bad = structuredClone(valid)
    ;(bad.assets['p1-anim'] as any).to = 'ghost'
    expect(() => defineComic(bad)).toThrow(/unknown asset/)
  })

  it('rejects a video whose keyframe points at another video', () => {
    const bad = structuredClone(valid)
    ;(bad.assets as any)['p1-anim2'] = { kind: 'video', path: 'pages/p1/anim2.latest.mp4', from: 'p1-anim', to: 'p1-main', transition: 'x' }
    expect(() => defineComic(bad)).toThrow(/must be an image/)
  })
})
