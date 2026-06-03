import { defineComic } from '@badcode/comic-meta'

export default defineComic({
  id: 'demo',
  style: 'Gritty ink.',
  characters: {
    bob: { name: 'Bob', description: 'Weathered man.', sheet: 'characters/bob/sheet.latest.png' },
  },
  assets: {
    'p1-main': { kind: 'image', path: 'pages/p1/main.latest.png', characters: ['bob'], scene: 'rain' },
  },
})
