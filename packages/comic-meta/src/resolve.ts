import { BUCKET, type Comic } from './schema'

/** Public base URL for all assets in the bucket. */
export const BUCKET_BASE_URL = `https://storage.googleapis.com/${BUCKET}`

/** Build the public URL for a comic-relative asset path. */
export function comicUrl(comicId: string, path: string): string {
  return `${BUCKET_BASE_URL}/comics/${comicId}/${path}`
}

/** Resolve an asset id (image or video) to its public `.latest` URL. */
export function resolve(comic: Comic, assetId: string): string {
  const asset = comic.assets[assetId]
  if (!asset) throw new Error(`unknown asset "${assetId}" in comic "${comic.id}"`)
  return comicUrl(comic.id, asset.path)
}

/** Resolve a character's sheet to its public `.latest` URL. */
export function sheetUrl(comic: Comic, charId: string): string {
  const character = comic.characters[charId]
  if (!character) throw new Error(`unknown character "${charId}" in comic "${comic.id}"`)
  return comicUrl(comic.id, character.sheet)
}
