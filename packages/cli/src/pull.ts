// packages/cli/src/pull.ts
import { mkdir, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { login } from './storyteller-auth'
import type { StorytellerComic } from './storyteller-types'

const GCS_BASE = 'https://storage.googleapis.com/badcode-storage'
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export function extractComicId(urlOrId: string): string {
  const match = urlOrId.match(UUID_RE)
  if (!match) throw new Error(`Could not find a comic UUID in: ${urlOrId}`)
  return match[0]
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface AssetEntry {
  type: 'image' | 'frame'
  remotePath: string
  localPath: string
}

function safeExt(path: string): string {
  const ext = path.split('.').pop() ?? 'jpg'
  return /^[a-z0-9]+$/i.test(ext) ? ext : 'jpg'
}

export function buildAssetManifest(comic: StorytellerComic, slug: string): AssetEntry[] {
  const entries: AssetEntry[] = []
  const pages = comic.config?.pages ?? []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const pageNum = i + 1

    for (const [slotName, pageMedia] of Object.entries(page.images)) {
      if (!pageMedia?.media?.path) continue
      const safeSlot = slotName.replace(/[^a-z0-9_-]/gi, '')
      const ext = safeExt(pageMedia.media.path)
      entries.push({
        type: 'image',
        remotePath: pageMedia.media.path,
        localPath: `public/comics/${slug}/p${pageNum}-${safeSlot}.${ext}`,
      })
    }

    if (page.animation?.frames?.length) {
      for (const frame of page.animation.frames) {
        if (!frame.path) continue
        const ext = safeExt(frame.path)
        const frameNum = String(frame.index).padStart(3, '0')
        entries.push({
          type: 'frame',
          remotePath: frame.path,
          localPath: `public/comics/${slug}/p${pageNum}-animation/frame-${frameNum}.${ext}`,
        })
      }
    }
  }

  return entries
}

function loadEnv(rootDir: string): { username: string; password: string } {
  const envPath = join(rootDir, '.env')
  let content: string
  try {
    content = readFileSync(envPath, 'utf-8')
  } catch {
    throw new Error(`Missing .env file at ${envPath}`)
  }
  const vars: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.replace(/^export\s+/, '').trim()
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      let value = trimmed.slice(eqIdx + 1)
      if (
        value.length >= 2 &&
        (value[0] === '"' || value[0] === "'") &&
        value[value.length - 1] === value[0]
      ) {
        value = value.slice(1, -1)
      }
      vars[trimmed.slice(0, eqIdx)] = value
    }
  }
  const username = vars['STORYTELLER_USERNAME']
  const password = vars['STORYTELLER_PASSWORD']
  if (!username || !password) throw new Error('STORYTELLER_USERNAME and STORYTELLER_PASSWORD must be set in .env')
  return { username, password }
}

async function downloadFile(url: string, dest: string): Promise<void> {
  // Assets are fetched as public GCS objects — the Storyteller JWT is a badcode.tv credential and must not be sent here.
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, buffer)
}

export async function pull(urlOrId: string, rootDir: string, slugOverride?: string): Promise<string> {
  const comicId = extractComicId(urlOrId)
  const baseUrl = 'https://badcode.tv'
  const { username, password } = loadEnv(rootDir)

  console.log(`Logging in as ${username}...`)
  const token = await login(baseUrl, username, password)

  console.log(`Fetching comic ${comicId}...`)
  const comicRes = await fetch(`${baseUrl}/api/v1/comics/${comicId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!comicRes.ok) throw new Error(`Failed to fetch comic: ${comicRes.status}`)
  const comic = (await comicRes.json()) as StorytellerComic
  if (!comic.config) throw new Error(`Comic ${comicId} has no config yet`)

  const slug = (slugOverride ?? toSlug(comic.config.name ?? comicId)) || comicId
  console.log(`Comic: "${comic.config.name}" → slug: ${slug}`)

  const comicDir = join(rootDir, 'apps/web/src/comics', slug)
  await mkdir(comicDir, { recursive: true })
  await writeFile(join(comicDir, 'comic.json'), JSON.stringify(comic.config, null, 2))
  console.log(`Wrote comic.json to ${comicDir}/`)

  const manifest = buildAssetManifest(comic, slug)
  console.log(`Downloading ${manifest.length} assets...`)

  for (const entry of manifest) {
    const url = `${GCS_BASE}/${entry.remotePath}`
    const dest = join(rootDir, entry.localPath)
    process.stdout.write(`  ${entry.localPath}...`)
    await downloadFile(url, dest)
    console.log(' done')
  }

  const pages = comic.config.pages?.length ?? 0
  const images = manifest.filter(e => e.type === 'image').length
  const frames = manifest.filter(e => e.type === 'frame').length
  console.log(`\nPulled "${comic.config.name}": ${pages} pages, ${images} images, ${frames} animation frames`)

  return slug
}
