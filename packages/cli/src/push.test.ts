import { describe, it, expect } from 'vitest'
import { defineComic } from '@badcode/comic-meta'
import { push } from './push'
import type { Bucket } from './bucket'
import { IMMUTABLE_CC, LATEST_CC } from './bucket'

const comic = defineComic({
  id: 'demo',
  style: 'ink',
  characters: { bob: { name: 'Bob', description: 'man', sheet: 'characters/bob/sheet.latest.png' } },
  assets: { 'p2-main': { kind: 'image', path: 'pages/p2/main.latest.png', characters: ['bob'], scene: 'rain' } },
})

function fakeBucket(existing: string[]) {
  const calls: { upload: string[][]; copy: string[][] } = { upload: [], copy: [] }
  const bucket: Bucket = {
    list: async () => existing,
    upload: async (file, key, cc) => {
      calls.upload.push([file, key, cc])
    },
    copy: async (src, dest, cc) => {
      calls.copy.push([src, dest, cc])
    },
    download: async () => {},
    listKeys: async () => [],
  }
  return { bucket, calls }
}

describe('push', () => {
  it('uploads v1 + latest for a first push (empty bucket)', async () => {
    const { bucket, calls } = fakeBucket([])
    const version = await push(bucket, comic, { kind: 'asset', id: 'p2-main' }, '/tmp/out.png')
    expect(version).toBe(1)
    expect(calls.upload).toEqual([['/tmp/out.png', 'comics/demo/pages/p2/main.v1.png', IMMUTABLE_CC]])
    expect(calls.copy).toEqual([['comics/demo/pages/p2/main.v1.png', 'comics/demo/pages/p2/main.latest.png', LATEST_CC]])
  })

  it('bumps to the next version when prior versions exist', async () => {
    const { bucket, calls } = fakeBucket(['main.v1.png', 'main.v2.png'])
    const version = await push(bucket, comic, { kind: 'asset', id: 'p2-main' }, '/tmp/out.png')
    expect(version).toBe(3)
    expect(calls.upload[0][1]).toBe('comics/demo/pages/p2/main.v3.png')
    expect(calls.copy[0][1]).toBe('comics/demo/pages/p2/main.latest.png')
  })

  it('pushes a character sheet to the characters path', async () => {
    const { bucket, calls } = fakeBucket([])
    const version = await push(bucket, comic, { kind: 'character', id: 'bob' }, '/tmp/bob.png')
    expect(version).toBe(1)
    expect(calls.upload[0][1]).toBe('comics/demo/characters/bob/sheet.v1.png')
    expect(calls.copy[0][1]).toBe('comics/demo/characters/bob/sheet.latest.png')
  })

  it('throws for an unknown target', async () => {
    const { bucket } = fakeBucket([])
    await expect(push(bucket, comic, { kind: 'asset', id: 'nope' }, '/tmp/x.png')).rejects.toThrow(/unknown asset/)
  })

  it('handles a root-level asset (empty dir) without a double slash', async () => {
    const rootComic = defineComic({
      id: 'demo',
      style: 'ink',
      characters: {},
      assets: { cover: { kind: 'image', path: 'cover.latest.png', characters: [], scene: 'x' } },
    })
    const { bucket, calls } = fakeBucket([])
    const version = await push(bucket, rootComic, { kind: 'asset', id: 'cover' }, '/tmp/cover.png')
    expect(version).toBe(1)
    expect(calls.upload[0][1]).toBe('comics/demo/cover.v1.png')
    expect(calls.copy[0][1]).toBe('comics/demo/cover.latest.png')
  })

  it('uses max+1 when version numbers have gaps', async () => {
    const { bucket, calls } = fakeBucket(['main.v1.png', 'main.v3.png'])
    const version = await push(bucket, comic, { kind: 'asset', id: 'p2-main' }, '/tmp/out.png')
    expect(version).toBe(4)
    expect(calls.upload[0][1]).toBe('comics/demo/pages/p2/main.v4.png')
  })
})
