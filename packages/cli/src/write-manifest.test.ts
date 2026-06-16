import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AssetManifest } from '@badcode/comic-manifest'
import { readManifestIfExists, writeManifestFile } from './write-manifest'

let dir: string
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'write-manifest-'))
})
afterAll(async () => {
  await rm(dir, { recursive: true, force: true })
})

const manifest: AssetManifest = {
  basePath: 'comics-v2/ep1',
  assets: { 'p1/main.png': { thumbhash: 'H', low: 'l', high: 'h', width: 1, height: 2 } },
}

describe('write-manifest', () => {
  it('readManifestIfExists returns undefined for a missing file', async () => {
    expect(await readManifestIfExists(join(dir, 'nope.json'))).toBeUndefined()
  })

  it('round-trips a manifest through write then read', async () => {
    const path = join(dir, 'sub', 'assets.manifest.json')
    await writeManifestFile(path, manifest)
    const text = await readFile(path, 'utf8')
    expect(text.endsWith('\n')).toBe(true) // trailing newline
    expect(await readManifestIfExists(path)).toEqual(manifest)
  })

  it('readManifestIfExists validates shape and throws on garbage', async () => {
    const path = join(dir, 'bad.json')
    await writeManifestFile.writeRaw(path, '{"nope":true}')
    await expect(readManifestIfExists(path)).rejects.toThrow(/basePath/)
  })
})
