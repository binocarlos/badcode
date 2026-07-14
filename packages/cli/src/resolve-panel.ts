import { readFile, readdir, access } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Resolve "page N of comic C" to everything an image-edit loop needs — the rendered
 * asset key, the panel record (exact Flow prompt, characters, media id) and the local
 * golden image — WITHOUT opening a browser. The link between the two worlds is the
 * `asset_key` frontmatter field on docs/<story>/storyboard/pNN.md records.
 */

export interface PanelRecord {
  panel: number
  characters: string[]
  flowMediaId: string
  model: string
  status: string
  assetKey: string
  prompt: string
  revisionCount: number
}

export interface ResolvedPanel {
  comic: string
  page: number
  assetKey: string
  record: string
  golden: string
  webImage: string | null
  storage: 'local' | 'bucket'
  flowMediaId: string
  characters: string[]
  model: string
  status: string
  prompt: string
  revisionCount: number
}

/** Comic id → story docs dir (repo-relative). Null = no per-panel records exist (yet). */
const STORY_DIRS: Record<string, string | null> = {
  'gpom-short': 'docs/gpom-short',
  'magic-money-tree': 'docs/magic-money-tree',
  // V1 storyteller imports with no panel records; camping-v2 is a from-scratch rework
  // still in canon phase — its records link up when its comic ships.
  camping: null,
  karen: null,
}

/** Parse a pNN.md record body: frontmatter + exact-prompt blockquote + revision count. */
export function parsePanelRecord(text: string): PanelRecord {
  const fm = /^---\n([\s\S]*?)\n---/.exec(text)
  if (!fm) throw new Error('RECORD_NO_FRONTMATTER')
  const fields: Record<string, string> = {}
  for (const line of fm[1]!.split('\n')) {
    const m = /^(\w[\w-]*):\s*(.*)$/.exec(line)
    if (m) fields[m[1]!] = m[2]!.trim()
  }
  const characters = (fields.characters ?? '[]')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  // The exact prompt is the blockquote under "**Prompt (exact, sent to Flow):**".
  let prompt = ''
  const promptHeading = /\*\*Prompt \(exact[^*]*\*\*\s*\n((?:>.*\n?)+)/.exec(text)
  if (promptHeading) {
    prompt = promptHeading[1]!
      .split('\n')
      .map((l) => l.replace(/^>\s?/, '').trim())
      .filter(Boolean)
      .join(' ')
  }
  const revisions = /\*\*Revisions:\*\*\s*\n((?:- .*\n?)+)/.exec(text)
  const revisionCount = revisions ? revisions[1]!.split('\n').filter((l) => l.startsWith('- ')).length : 0
  return {
    panel: Number(fields.panel ?? 0),
    characters,
    flowMediaId: fields.flow_media_id ?? '',
    model: fields.model ?? '',
    status: fields.status ?? '',
    assetKey: fields.asset_key ?? '',
    prompt,
    revisionCount,
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/** Page → asset key. Bucket-style comics carry a page-map.json; local-style are 1:1 iNN. */
async function pageToAssetKey(rootDir: string, comic: string, page: number): Promise<string> {
  const nn = String(page).padStart(2, '0')
  const pageMapPath = join(rootDir, 'apps/web/src/comics', comic, 'page-map.json')
  if (await exists(pageMapPath)) {
    const pageMap = JSON.parse(await readFile(pageMapPath, 'utf8')) as Record<string, { kind: string; key: string }>
    const entry = pageMap[`p${nn}`]
    if (!entry) throw new Error(`PAGE_NOT_FOUND: p${nn} is not in ${comic}/page-map.json`)
    if (entry.kind !== 'image') throw new Error(`PAGE_NOT_IMAGE: p${nn} is ${entry.kind} (${entry.key}) — use animate-slide for animated pages`)
    return entry.key
  }
  // Local-style: page N renders img/iNN.<ext>; find the extension on disk.
  const imgDir = join(rootDir, 'apps/web/public/comics', comic, 'img')
  const files = await readdir(imgDir).catch(() => {
    throw new Error(`COMIC_NOT_FOUND: no page-map.json and no ${imgDir}`)
  })
  const hit = files.find((f) => f.startsWith(`i${nn}.`))
  if (!hit) throw new Error(`PAGE_NOT_FOUND: no i${nn}.* under ${imgDir}`)
  return `img/${hit}`
}

/** Find the storyboard record whose asset_key matches, and parse it. */
async function findRecord(
  rootDir: string,
  storyDir: string,
  assetKey: string,
): Promise<{ path: string; record: PanelRecord }> {
  const boardDir = join(rootDir, storyDir, 'storyboard')
  const files = (await readdir(boardDir).catch(() => [] as string[])).filter((f) => /^p\d+\.md$/.test(f)).sort()
  if (!files.length) throw new Error(`NO_RECORDS: no per-panel records under ${boardDir}`)
  for (const f of files) {
    const path = join(boardDir, f)
    const record = parsePanelRecord(await readFile(path, 'utf8'))
    if (record.assetKey === assetKey) return { path, record }
  }
  throw new Error(`RECORD_NOT_FOUND: no record with asset_key ${assetKey} under ${boardDir} — backfill asset_key frontmatter`)
}

export async function resolvePanel(rootDir: string, comic: string, page: number): Promise<ResolvedPanel> {
  const storyDir = STORY_DIRS[comic]
  if (storyDir === undefined) throw new Error(`UNKNOWN_COMIC: ${comic} — add it to STORY_DIRS in resolve-panel.ts`)
  if (storyDir === null)
    throw new Error(`NO_RECORDS: ${comic} has no per-panel prompt records (V1 import) — nothing to resolve an edit against`)
  const assetKey = await pageToAssetKey(rootDir, comic, page)
  const { path: recordPath, record } = await findRecord(rootDir, storyDir, assetKey)
  const nn = String(record.panel).padStart(2, '0')
  const boardImgDir = join(rootDir, storyDir, 'storyboard/img')
  const goldenName = (await readdir(boardImgDir).catch(() => [] as string[])).find((f) => f.startsWith(`p${nn}.`))
  if (!goldenName)
    throw new Error(`GOLDEN_MISSING: no ${storyDir}/storyboard/img/p${nn}.* — the edit loop needs the local golden image`)
  const golden = join(boardImgDir, goldenName)
  const webImagePath = join(rootDir, 'apps/web/public/comics', comic, assetKey)
  const webImage = (await exists(webImagePath)) ? webImagePath : null
  return {
    comic,
    page,
    assetKey,
    record: recordPath,
    golden,
    webImage,
    storage: webImage ? 'local' : 'bucket',
    flowMediaId: record.flowMediaId,
    characters: record.characters,
    model: record.model,
    status: record.status,
    prompt: record.prompt,
    revisionCount: record.revisionCount,
  }
}
