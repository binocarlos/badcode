import type { Comic } from '@badcode/comic-meta'

/** A CLI generation target: a character sheet or a named asset. */
export type Target = { kind: 'character'; id: string } | { kind: 'asset'; id: string }

/** Resolve a target to its comic-relative `.latest` path. */
export function targetPath(comic: Comic, target: Target): string {
  if (target.kind === 'character') {
    const character = comic.characters[target.id]
    if (!character) throw new Error(`unknown character "${target.id}" in comic "${comic.id}"`)
    return character.sheet
  }
  const asset = comic.assets[target.id]
  if (!asset) throw new Error(`unknown asset "${target.id}" in comic "${comic.id}"`)
  return asset.path
}
