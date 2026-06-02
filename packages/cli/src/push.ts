import type { Comic } from '@badcode/comic-meta'
import type { Bucket } from './bucket'
import { IMMUTABLE_CC, LATEST_CC } from './bucket'
import { splitLatestPath, versionedPath, latestPath, nextVersion, parseVersion } from './bucket-path'
import { targetPath, type Target } from './target'

/**
 * Upload `localFile` as the next version of `target` and refresh its `.latest`
 * pointer. Returns the new version number. Never edits source files.
 */
export async function push(bucket: Bucket, comic: Comic, target: Target, localFile: string): Promise<number> {
  const path = targetPath(comic, target) // throws on unknown target
  const parts = splitLatestPath(path)
  const dirPrefix = `comics/${comic.id}/${parts.dir ? `${parts.dir}/` : ''}`

  const existing = await bucket.list(`${dirPrefix}${parts.base}.v*.${parts.ext}`)
  const versions = existing.map(parseVersion).filter((n): n is number => n !== null)
  const n = nextVersion(versions)

  const versionedKey = `${dirPrefix}${versionedPath(parts, n).split('/').pop()}`
  const latestKey = `${dirPrefix}${latestPath(parts).split('/').pop()}`

  await bucket.upload(localFile, versionedKey, IMMUTABLE_CC)
  await bucket.copy(versionedKey, latestKey, LATEST_CC)
  return n
}
