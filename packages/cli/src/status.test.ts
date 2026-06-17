import { describe, it, expect } from 'vitest'
import { defineComic } from '@badcode/comic-meta'
import { status } from './status'
import type { Bucket } from './bucket'

const comic = defineComic({
  id: 'demo',
  style: 'ink',
  characters: { bob: { name: 'Bob', description: 'man', sheet: 'characters/bob/sheet.latest.png' } },
  assets: {
    'p2-main': { kind: 'image', path: 'pages/p2/main.latest.png', characters: ['bob'], scene: 'rain' },
    'p2-anim': { kind: 'video', path: 'pages/p2/anim.latest.mp4', from: 'p2-main', to: 'p2-main', transition: 'x' },
  },
})

/** Fake that returns version files for some globs and nothing for others. */
function fakeBucket(map: Record<string, string[]>): Bucket {
  return {
    list: async (glob) => map[glob] ?? [],
    upload: async () => {},
    copy: async () => {},
    download: async () => {},
    downloadMany: async () => {},
    listKeys: async () => [],
  }
}

describe('status', () => {
  it('reports version counts and latest presence per character and asset', async () => {
    const bucket = fakeBucket({
      'comics/demo/characters/bob/sheet.v*.png': ['sheet.v1.png', 'sheet.v2.png'],
      'comics/demo/characters/bob/sheet.latest.png': ['sheet.latest.png'],
      'comics/demo/pages/p2/main.v*.png': ['main.v1.png'],
      'comics/demo/pages/p2/main.latest.png': ['main.latest.png'],
      'comics/demo/pages/p2/anim.v*.mp4': [],
      'comics/demo/pages/p2/anim.latest.mp4': [],
    })
    const rows = await status(bucket, comic)
    expect(rows).toEqual([
      { id: 'character:bob', kind: 'sheet', versions: 2, hasLatest: true },
      { id: 'p2-main', kind: 'image', versions: 1, hasLatest: true },
      { id: 'p2-anim', kind: 'video', versions: 0, hasLatest: false },
    ])
  })
})
