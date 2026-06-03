export interface LatestParts {
  /** Directory portion relative to the comic root, no trailing slash (may be ''). */
  dir: string
  /** Base filename without the `.latest`/`.vN` suffix or extension. */
  base: string
  /** File extension without the dot. */
  ext: string
}

/** Decompose a `.latest` pointer like `pages/p2/main.latest.png`. */
export function splitLatestPath(path: string): LatestParts {
  const match = path.match(/^(.*)\.latest\.([^.]+)$/)
  if (!match) throw new Error(`path is not a .latest pointer: ${path}`)
  const full = match[1]
  const ext = match[2]
  const slash = full.lastIndexOf('/')
  return {
    dir: slash >= 0 ? full.slice(0, slash) : '',
    base: slash >= 0 ? full.slice(slash + 1) : full,
    ext,
  }
}

function prefix(parts: LatestParts): string {
  return parts.dir ? `${parts.dir}/` : ''
}

/** Comic-relative path for a numbered version, e.g. `pages/p2/main.v4.png`. */
export function versionedPath(parts: LatestParts, n: number): string {
  return `${prefix(parts)}${parts.base}.v${n}.${parts.ext}`
}

/** Comic-relative path for the `.latest` pointer. */
export function latestPath(parts: LatestParts): string {
  return `${prefix(parts)}${parts.base}.latest.${parts.ext}`
}

/** Next version number given the existing ones (1-based). */
export function nextVersion(existing: number[]): number {
  return (existing.length ? Math.max(...existing) : 0) + 1
}

/** Extract the version number from a filename like `main.v7.png`, or null. */
export function parseVersion(filename: string): number | null {
  const match = filename.match(/\.v(\d+)\.[^.]+$/)
  return match ? Number(match[1]) : null
}

/** Bucket key prefix for an asset's directory, e.g. `comics/demo/pages/p2/`. */
export function comicKeyPrefix(comicId: string, parts: LatestParts): string {
  return `comics/${comicId}/${parts.dir ? `${parts.dir}/` : ''}`
}
