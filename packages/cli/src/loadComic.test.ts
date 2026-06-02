import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadComic } from './loadComic'

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__')

describe('loadComic', () => {
  it('imports and validates a comic.meta.ts from a base directory', async () => {
    const comic = await loadComic('demo', fixturesDir)
    expect(comic.id).toBe('demo')
    expect(comic.characters.bob.name).toBe('Bob')
  })

  it('throws a clear error when the comic does not exist', async () => {
    await expect(loadComic('ghost', fixturesDir)).rejects.toThrow(/ghost/)
  })
})
