import type { Comic } from '@badcode/comic-meta'
import type { Bucket } from './bucket'
import { splitLatestPath, parseVersion, comicKeyPrefix } from './bucket-path'

export interface AssetStatus {
  id: string
  kind: string
  versions: number
  hasLatest: boolean
}

async function statusFor(bucket: Bucket, comicId: string, id: string, kind: string, path: string): Promise<AssetStatus> {
  const parts = splitLatestPath(path)
  const dirPrefix = comicKeyPrefix(comicId, parts)
  const versionFiles = await bucket.list(`${dirPrefix}${parts.base}.v*.${parts.ext}`)
  const latestFiles = await bucket.list(`${dirPrefix}${parts.base}.latest.${parts.ext}`)
  const versions = versionFiles.map(parseVersion).filter((n): n is number => n !== null).length
  return { id, kind, versions, hasLatest: latestFiles.length > 0 }
}

/** Report version counts + latest presence for every character sheet and asset. */
export async function status(bucket: Bucket, comic: Comic): Promise<AssetStatus[]> {
  const rows: AssetStatus[] = []
  for (const [charId, character] of Object.entries(comic.characters)) {
    rows.push(await statusFor(bucket, comic.id, `character:${charId}`, 'sheet', character.sheet))
  }
  for (const [assetId, asset] of Object.entries(comic.assets)) {
    rows.push(await statusFor(bucket, comic.id, assetId, asset.kind, asset.path))
  }
  return rows
}
