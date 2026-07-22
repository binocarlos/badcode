import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parsePanelRecord, resolvePanel } from './resolve-panel'

const RECORD = `---
panel: 4
characters: []
flow_media_id: db764c44-9368-40eb-8791-2e7b93d28b59
model: nano-banana-2
status: done
asset_key: img/i04.jpg
---
![panel 4](img/p04.jpg)

**Scene:** The handover.

**Prompt (exact, sent to Flow):**
> Hyper-realistic documentary photograph, shot on 35mm film.
> The interior of a UK municipal benefits office.

**Narration:** "You didn't lose your choices."

**Revisions:**
- v1 (2026-07-02) — initial; accepted first take.
- v2 (2026-07-14) — moved the older woman left.
`

describe('parsePanelRecord', () => {
  it('parses frontmatter, exact prompt blockquote, and revision count', () => {
    const r = parsePanelRecord(RECORD)
    expect(r.panel).toBe(4)
    expect(r.characters).toEqual([])
    expect(r.flowMediaId).toBe('db764c44-9368-40eb-8791-2e7b93d28b59')
    expect(r.assetKey).toBe('img/i04.jpg')
    expect(r.prompt).toBe(
      'Hyper-realistic documentary photograph, shot on 35mm film. The interior of a UK municipal benefits office.',
    )
    expect(r.revisionCount).toBe(2)
  })

  it('parses bracketed character lists', () => {
    const r = parsePanelRecord(RECORD.replace('characters: []', 'characters: [dawn, tarquin]'))
    expect(r.characters).toEqual(['dawn', 'tarquin'])
  })
})

describe('resolvePanel', () => {
  let root: string

  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'resolve-panel-'))
    // local-style comic: gpom-short lookalike
    await mkdir(join(root, 'apps/web/src/comics/gpom-short'), { recursive: true })
    await mkdir(join(root, 'apps/web/public/comics/gpom-short/img'), { recursive: true })
    await writeFile(join(root, 'apps/web/public/comics/gpom-short/img/i04.jpg'), 'x')
    await mkdir(join(root, 'docs/stories/gpom-short/storyboard/img'), { recursive: true })
    await writeFile(join(root, 'docs/stories/gpom-short/storyboard/p04.md'), RECORD)
    await writeFile(join(root, 'docs/stories/gpom-short/storyboard/img/p04.jpg'), 'x')
    // bucket-style comic dir with an anim page, reusing the same story records
    await mkdir(join(root, 'apps/web/src/comics/magic-money-tree'), { recursive: true })
    await writeFile(
      join(root, 'apps/web/src/comics/magic-money-tree/page-map.json'),
      JSON.stringify({ p01: { kind: 'anim', key: 'anim/a01' }, p02: { kind: 'image', key: 'img/i04.jpg' } }),
    )
    await mkdir(join(root, 'docs/stories/magic-money-tree/storyboard/img'), { recursive: true })
    await writeFile(join(root, 'docs/stories/magic-money-tree/storyboard/p04.md'), RECORD)
    await writeFile(join(root, 'docs/stories/magic-money-tree/storyboard/img/p04.jpg'), 'x')
  })

  afterAll(async () => {
    await rm(root, { recursive: true, force: true })
  })

  it('resolves a local-style page to record + golden + web image', async () => {
    const r = await resolvePanel(root, 'gpom-short', 4)
    expect(r.assetKey).toBe('img/i04.jpg')
    expect(r.record).toBe(join(root, 'docs/stories/gpom-short/storyboard/p04.md'))
    expect(r.golden).toBe(join(root, 'docs/stories/gpom-short/storyboard/img/p04.jpg'))
    expect(r.storage).toBe('local')
    expect(r.prompt).toContain('benefits office')
    expect(r.revisionCount).toBe(2)
  })

  it('resolves a page-map comic and rejects anim pages', async () => {
    const r = await resolvePanel(root, 'magic-money-tree', 2)
    expect(r.assetKey).toBe('img/i04.jpg')
    expect(r.storage).toBe('bucket')
    await expect(resolvePanel(root, 'magic-money-tree', 1)).rejects.toThrow(/PAGE_NOT_IMAGE/)
  })

  it('errors cleanly on record-less V1 comics and unknown comics', async () => {
    await expect(resolvePanel(root, 'camping', 1)).rejects.toThrow(/NO_RECORDS/)
    await expect(resolvePanel(root, 'nope', 1)).rejects.toThrow(/UNKNOWN_COMIC/)
  })
})
