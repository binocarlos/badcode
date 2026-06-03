import { resolve as resolvePath } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineComic } from '@badcode/comic-meta'
import type { Comic } from '@badcode/comic-meta'

/** Default location of comic metadata, relative to the repo root. */
export const COMICS_DIR = 'apps/web/src/comics'

/**
 * Dynamically import a comic's `comic.meta.ts` and re-validate it. `baseDir`
 * defaults to the web app's comics directory (resolved against the cwd).
 */
export async function loadComic(
  comicId: string,
  baseDir: string = resolvePath(process.cwd(), COMICS_DIR),
): Promise<Comic> {
  const file = resolvePath(baseDir, comicId, 'comic.meta.ts')
  let mod: { default: unknown }
  try {
    mod = await import(pathToFileURL(file).href)
  } catch (cause) {
    throw new Error(`could not load comic "${comicId}" from ${file}`, { cause })
  }
  return defineComic(mod.default as Comic)
}
