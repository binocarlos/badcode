import { describe, it, expect } from 'vitest'
import { join } from 'node:path'
import { refKey, flowPrep } from './flow-prep'
import type { Bucket } from './bucket'
import type { Comic } from '@badcode/comic-meta'

const comic = {
  id: 'demo',
  style: 'documentary photo',
  characters: {
    bob: { name: 'bob', description: 'a homeless man', sheet: 'characters/bob.latest.png' },
  },
  assets: {
    'p1-main': {
      kind: 'image' as const,
      path: 'p1-main.latest.png',
      characters: ['bob'],
      scene: 'bob outside a shop',
    },
  },
} as unknown as Comic

/** Records every download so the test can assert keys + destinations. */
function fakeBucket(): { bucket: Bucket; downloads: { key: string; file: string }[] } {
  const downloads: { key: string; file: string }[] = []
  const bucket = {
    list: async () => [],
    upload: async () => {},
    copy: async () => {},
    download: async (key: string, file: string) => { downloads.push({ key, file }) },
    downloadMany: async () => {},
    listKeys: async () => [],
  }
  return { bucket, downloads }
}

describe('refKey', () => {
  it('strips the public bucket base URL to a bucket-relative key', () => {
    const url = 'https://storage.googleapis.com/badcode-storage/comics/demo/characters/bob.latest.png'
    expect(refKey(url)).toBe('comics/demo/characters/bob.latest.png')
  })
})

describe('flowPrep', () => {
  it('returns the assembled prompt and downloads each ref into destDir', async () => {
    const { bucket, downloads } = fakeBucket()
    const result = await flowPrep(bucket, comic, { kind: 'asset', id: 'p1-main' }, '/tmp/out')

    expect(result.prompt).toContain('Scene: bob outside a shop')
    expect(result.refs).toHaveLength(1)
    expect(result.refs[0].label).toBe('[1]')
    expect(result.refs[0].file).toBe(join('/tmp/out', 'ref-1-bob.latest.png'))

    expect(downloads).toEqual([
      { key: 'comics/demo/characters/bob.latest.png', file: join('/tmp/out', 'ref-1-bob.latest.png') },
    ])
  })
})
