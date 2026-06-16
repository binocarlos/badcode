import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { AssetManifest } from '@badcode/comic-manifest'
import { validateManifest } from '@badcode/comic-manifest'

/** Read + validate a manifest file, or undefined if it does not exist. */
export async function readManifestIfExists(path: string): Promise<AssetManifest | undefined> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw err
  }
  return validateManifest(JSON.parse(text))
}

/** Write a manifest as pretty JSON (with trailing newline), creating parent dirs. */
export async function writeManifestFile(path: string, manifest: AssetManifest): Promise<void> {
  await writeManifestFile.writeRaw(path, `${JSON.stringify(manifest, null, 2)}\n`)
}

/** Low-level writer (also used by tests to write raw bytes). */
writeManifestFile.writeRaw = async function writeRaw(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, text, 'utf8')
}
