import { describe, it, expect } from 'vitest'
import { defineComic } from '@badcode/comic-meta'
import { buildPrompt } from './prompt'

const comic = defineComic({
  id: 'demo',
  style: 'Gritty ink, muted palette.',
  characters: {
    bob: { name: 'Bob', description: 'Weathered man, 50s.', sheet: 'characters/bob/sheet.latest.png', refs: [{ path: 'characters/bob/ref1.latest.png' }] },
    tarquin: { name: 'Tarquin', description: 'Smug suit, 30s.', sheet: 'characters/tarquin/sheet.latest.png' },
  },
  assets: {
    'p2-main': { kind: 'image', path: 'pages/p2/main.latest.png', characters: ['bob', 'tarquin'], scene: 'Bob offers a coin.' },
    'p3-main': { kind: 'image', path: 'pages/p3/main.latest.png', characters: ['bob'], scene: 'Bob alone.' },
    'p2-anim': { kind: 'video', path: 'pages/p2/anim.latest.mp4', from: 'p2-main', to: 'p3-main', transition: 'Bob extends his hand.' },
  },
})

const base = 'https://storage.googleapis.com/badcode-storage/comics/demo'

describe('buildPrompt: character sheet', () => {
  const r = buildPrompt(comic, { kind: 'character', id: 'bob' })
  it('leads with style, character line, and sheet guidance', () => {
    expect(r.prompt).toBe(
      [
        'Art style: Gritty ink, muted palette.',
        '',
        'Character [Bob]: Weathered man, 50s.',
        '',
        'Full-body character reference sheet, neutral pose, plain background, consistent design.',
      ].join('\n'),
    )
  })
  it('lists the character refs as references', () => {
    expect(r.references).toEqual([{ label: '[1]', url: `${base}/characters/bob/ref1.latest.png` }])
  })
})

describe('buildPrompt: page image', () => {
  const r = buildPrompt(comic, { kind: 'asset', id: 'p2-main' })
  it('includes style, both character lines, and the scene', () => {
    expect(r.prompt).toBe(
      [
        'Art style: Gritty ink, muted palette.',
        'Character [Bob]: Weathered man, 50s.',
        'Character [Tarquin]: Smug suit, 30s.',
        '',
        'Scene: Bob offers a coin.',
      ].join('\n'),
    )
  })
  it('references each character sheet, numbered', () => {
    expect(r.references).toEqual([
      { label: '[1]', url: `${base}/characters/bob/sheet.latest.png` },
      { label: '[2]', url: `${base}/characters/tarquin/sheet.latest.png` },
    ])
    expect(r.refHeading).toBe('REFERENCE IMAGES (download + attach):')
  })
})

describe('buildPrompt: video', () => {
  const r = buildPrompt(comic, { kind: 'asset', id: 'p2-anim' })
  it('includes style and the transition', () => {
    expect(r.prompt).toBe(['Art style: Gritty ink, muted palette.', '', 'Transition: Bob extends his hand.'].join('\n'))
  })
  it('references the start and end keyframes', () => {
    expect(r.references).toEqual([
      { label: '[start]', url: `${base}/pages/p2/main.latest.png` },
      { label: '[end]', url: `${base}/pages/p3/main.latest.png` },
    ])
    expect(r.refHeading).toBe('KEYFRAMES (download + attach):')
  })
})

describe('buildPrompt: --add text', () => {
  it('appends additive text after the metadata base', () => {
    const r = buildPrompt(comic, { kind: 'asset', id: 'p2-main' }, 'Make it golden hour.')
    expect(r.prompt.endsWith('Scene: Bob offers a coin.\nMake it golden hour.')).toBe(true)
  })
})
