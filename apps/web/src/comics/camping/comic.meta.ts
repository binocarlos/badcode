import { defineComic } from '@badcode/comic-meta'

/**
 * Generation metadata for "Camping" (EP1, track 1). Written once; the bucket
 * holds every version. See docs/superpowers/specs/2026-06-02-comic-asset-tooling-design.md.
 */
export default defineComic({
  id: 'camping',
  style:
    'Gritty graphic-novel ink, muted desaturated palette, heavy shadow, cinematic wide framing. ' +
    'Cold British dystopia. No text or speech bubbles in the image.',
  characters: {
    bob: {
      name: 'Bob',
      description: 'Weathered homeless man, ~50, charity-shop coat, kind tired eyes, grey stubble.',
      sheet: 'characters/bob/sheet.latest.png',
    },
    tarquin: {
      name: 'Tarquin',
      description: 'Sharp-suited financier, early 30s, smug, expensive overcoat, slicked hair.',
      sheet: 'characters/tarquin/sheet.latest.png',
    },
  },
  assets: {
    'p1-main': {
      kind: 'image',
      path: 'pages/p1/main.latest.svg',
      characters: ['tarquin'],
      scene: 'Tarquin celebrates closing the biggest deal of his career, a gold halo of city lights behind him.',
    },
    'p2-main': {
      kind: 'image',
      path: 'pages/p2/main.latest.svg',
      characters: ['bob', 'tarquin'],
      scene: 'A grey supermarket car park. Bob asks Tarquin for spare change; Tarquin judges him.',
    },
    'p3-main': {
      kind: 'image',
      path: 'pages/p3/main.latest.svg',
      characters: ['bob'],
      scene: 'A spectral Ghost of Economic Future looms over Bob, replaying how he ended up here.',
    },
    'p4-main': {
      kind: 'image',
      path: 'pages/p4/main.latest.svg',
      characters: ['bob', 'tarquin'],
      scene: 'Five years later. A boarded-up Waitrose; Bob, still homeless, shows Tarquin kindness.',
    },
  },
})
