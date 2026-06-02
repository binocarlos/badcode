import { comicSchema, type Comic } from './schema'

/**
 * Validate a comic's generation metadata and return it typed. Authors call this
 * in their `comic.meta.ts`; the CLI re-validates on load.
 */
export function defineComic(input: unknown): Comic {
  return comicSchema.parse(input)
}
