import type { Comic } from '@badcode/comic-meta'
import type { Bucket } from './bucket'
import { IMMUTABLE_CC, LATEST_CC } from './bucket'
import { splitLatestPath, nextVersion, parseVersion, comicKeyPrefix } from './bucket-path'
import { targetPath, type Target } from './target'

/**
 * Upload `localFile` as the next version of `target` and refresh its `.latest`
 * pointer. Returns the new version number. Never edits source files.
 */
export async function push(bucket: Bucket, comic: Comic, target: Target, localFile: string): Promise<number> {
  const path = targetPath(comic, target) // throws on unknown target
  const parts = splitLatestPath(path)
  const dirPrefix = comicKeyPrefix(comic.id, parts)

  const existing = await bucket.list(`${dirPrefix}${parts.base}.v*.${parts.ext}`)
  const versions = existing.map(parseVersion).filter((n): n is number => n !== null)
  const n = nextVersion(versions)

  const versionedKey = `${dirPrefix}${parts.base}.v${n}.${parts.ext}`
  const latestKey = `${dirPrefix}${parts.base}.latest.${parts.ext}`

  await bucket.upload(localFile, versionedKey, IMMUTABLE_CC)
  await bucket.copy(versionedKey, latestKey, LATEST_CC)
  return n
}
