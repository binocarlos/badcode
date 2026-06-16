// packages/cli/src/generate.ts
import { access, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { mapTailDirection } from './tail-map'
import { resolveAssetUrl, safeSlot } from './pull'
import type { StorytellerComicConfig, StorytellerPage, StorytellerTextBubble } from './storyteller-types'

export function toPascalCase(slug: string): string {
  const name = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
  return /^[0-9]/.test(name) ? `C${name}` : name
}

/**
 * Storyteller stores bubble font_size as a pixel value but tolerates tiny/relative
 * values (e.g. 1.2); at render time it clamps to [10, 24]px. We emit a px number to
 * SpeechBubble's `fontSize`, so match Storyteller's clamp — otherwise a value like
 * 1.2 becomes 1.2px and the text is invisible.
 */
export function clampFontSize(size: number): number {
  return Math.min(Math.max(size, 10), 24)
}

function charKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '')
}

export function generateMeta(config: StorytellerComicConfig, slug: string): string {
  const chars = config.characters.map(c => {
    return `    ${charKey(c.name)}: {\n      name: '${esc(c.name)}',\n      description: '${esc(c.description)}',\n      sheet: '', // TODO: add character sheet path\n    },`
  }).join('\n')

  const charIdList = config.characters.map(c => `'${charKey(c.name)}'`).join(', ')

  const assets: string[] = []
  for (let i = 0; i < config.pages.length; i++) {
    const page = config.pages[i]
    const pageNum = i + 1
    for (const [slotName, pageMedia] of Object.entries(page.images)) {
      if (!pageMedia?.media?.path) continue
      const assetId = `p${pageNum}-${safeSlot(slotName)}`
      assets.push(`    '${assetId}': {\n      kind: 'image',\n      path: '', // TODO: add GCS path if using bucket, or remove if using public/\n      characters: [${charIdList}], // TODO: filter to relevant characters\n      scene: '${esc(pageMedia.media.prompt)}',\n    },`)
    }
  }

  return `import { defineComic } from '@badcode/comic-meta'

export default defineComic({
  id: '${slug}',
  style: '${esc(config.style)}',
  characters: {
${chars}
  },
  assets: {
${assets.join('\n')}
  },
})
`
}

/** Tracks which symbols the generated component references, so we only import what's used. */
interface Usage {
  imageWidget: boolean
  animationWidget: boolean
  speechBubble: boolean
  narrationBox: boolean
  zoom: boolean
  crossfade: boolean
}

function renderBubble(bubble: StorytellerTextBubble, indent: string, usage: Usage): string {
  if (bubble.type === 'narration') {
    usage.narrationBox = true
    const props: string[] = []
    if (bubble.x != null) props.push(`x={${bubble.x}}`)
    if (bubble.y != null) props.push(`y={${bubble.y}}`)
    if (bubble.start_percent != null && bubble.end_percent != null) {
      props.push(`appearAt={[${bubble.start_percent}, ${bubble.end_percent}]}`)
    }
    props.push('fade')
    return `${indent}<NarrationBox ${props.join(' ')}>\n${indent}  {'${esc(htmlToText(bubble.text))}'}\n${indent}</NarrationBox>`
  }

  usage.speechBubble = true
  const props: string[] = []
  if (bubble.x != null) props.push(`x={${bubble.x}}`)
  if (bubble.y != null) props.push(`y={${bubble.y}}`)
  if (bubble.start_percent != null && bubble.end_percent != null) {
    props.push(`appearAt={[${bubble.start_percent}, ${bubble.end_percent}]}`)
  }
  props.push('fade')
  if (bubble.type === 'thought') props.push('type="thought"')
  if (bubble.renderer === 'rough') props.push(`renderer="rough"`)
  props.push(`tail="${mapTailDirection(bubble.direction)}"`)
  if (bubble.background_color) props.push(`background="${bubble.background_color}"`)
  if (bubble.text_color) props.push(`textColor="${bubble.text_color}"`)
  if (bubble.font_size != null) props.push(`fontSize={${clampFontSize(bubble.font_size)}}`)

  return `${indent}<SpeechBubble ${props.join(' ')}>\n${indent}  {'${esc(htmlToText(bubble.text))}'}\n${indent}</SpeechBubble>`
}

function renderPage(page: StorytellerPage, isFirst: boolean, indent: string, usage: Usage): string {
  const lines: string[] = []

  lines.push(`${indent}<Page`)
  lines.push(`${indent}  phases={{ enter: 0, hold: 1.4, exit: 0 }}`)
  lines.push(`${indent}  scrollDuration={1.4}`)
  if (isFirst) {
    usage.zoom = true
    lines.push(`${indent}  effect={zoom({ amount: 1.3 })}`)
  } else {
    usage.crossfade = true
    lines.push(`${indent}  transition={crossfade()}`)
  }
  lines.push(`${indent}  background="#0a0f1c"`)
  lines.push(`${indent}>`)
  if (!isFirst) {
    lines.push(`${indent}  {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}`)
  }
  lines.push(`${indent}  {/* TODO: pick background color */}`)

  // Track whether any real JSX child (widget or bubble) is emitted — JSX comments
  // don't count as children, and Page requires `children`, so a content-less page
  // needs a visible placeholder to typecheck.
  let hasChild = false

  // Widget — assets are referenced directly from the GCS bucket via their
  // remote paths in comic.json (resolveAssetUrl handles absolute vs. relative).
  const frames = (page.animation?.frames?.filter(f => f.path) ?? [])
    .slice()
    .sort((a, b) => a.index - b.index)
  if (frames.length > 0) {
    usage.animationWidget = true
    hasChild = true
    lines.push(`${indent}  <AnimationWidget`)
    lines.push(`${indent}    frames={[`)
    for (const frame of frames) {
      lines.push(`${indent}      '${resolveAssetUrl(frame.path)}',`)
    }
    lines.push(`${indent}    ]}`)
    lines.push(`${indent}  />`)
  } else {
    const slots = Object.keys(page.images).filter(s => page.images[s]?.media?.path)
    const mainSlot = slots.includes('main') ? 'main' : slots[0]
    if (mainSlot) {
      usage.imageWidget = true
      hasChild = true
      lines.push(`${indent}  <ImageWidget src="${resolveAssetUrl(page.images[mainSlot].media.path)}" />`)
      const otherSlots = slots.filter(s => s !== mainSlot)
      if (otherSlots.length > 0) {
        lines.push(`${indent}  {/* TODO: page has more image slots not rendered here: ${otherSlots.join(', ')} */}`)
      }
    }
  }

  // Bubbles
  for (const bubble of page.text_bubbles) {
    lines.push(renderBubble(bubble, indent + '  ', usage))
    hasChild = true
  }

  // Empty page — emit a placeholder child so the generated TSX typechecks and the
  // page (and overall page count) is preserved rather than silently dropped.
  if (!hasChild) {
    usage.narrationBox = true
    lines.push(`${indent}  {/* TODO: this page had no image/animation/text in Storyteller — replace this placeholder */}`)
    lines.push(`${indent}  <NarrationBox x={50} y={50} appearAt={[0, 1]} fade>{'TODO: empty page'}</NarrationBox>`)
  }

  // Side panel placeholder
  lines.push(`${indent}  {/* TODO: add SidePanelText with narrative content */}`)

  lines.push(`${indent}</Page>`)
  return lines.join('\n')
}

export function generateTsx(config: StorytellerComicConfig, slug: string): string {
  const name = toPascalCase(slug)
  const usage: Usage = {
    imageWidget: false,
    animationWidget: false,
    speechBubble: false,
    narrationBox: false,
    zoom: false,
    crossfade: false,
  }
  const pages = config.pages.map((page, i) =>
    renderPage(page, i === 0, '      ', usage)
  ).join('\n\n')

  const comicImports = ['ScrollComic', 'Page']
  if (usage.imageWidget) comicImports.push('ImageWidget')
  if (usage.animationWidget) comicImports.push('AnimationWidget')
  if (usage.speechBubble) comicImports.push('SpeechBubble')
  if (usage.narrationBox) comicImports.push('NarrationBox')

  const importLines = [`import { ${comicImports.join(', ')} } from '@badcode/comic'`]
  if (usage.zoom) importLines.push(`import { zoom } from '@badcode/comic/effects'`)
  if (usage.crossfade) importLines.push(`import { crossfade } from '@badcode/comic/transitions'`)
  importLines.push(
    `// Other effects/transitions available: grayscale, zoomInOut, pan, scale | iris, fadeOutFadeIn, slideOver, blur, wipe | scrollIn, fadeIn, fadeOut, pause (see @badcode/comic docs)`
  )

  return `${importLines.join('\n')}

export function ${name}Comic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint>
${pages}
    </ScrollComic>
  )
}
`
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function generate(slug: string, rootDir: string, force = false): Promise<void> {
  const comicDir = join(rootDir, 'apps/web/src/comics', slug)
  const jsonPath = join(comicDir, 'comic.json')

  let raw: string
  try {
    raw = await readFile(jsonPath, 'utf-8')
  } catch {
    throw new Error(`No comic.json found at ${jsonPath} — run "badcode pull" first`)
  }

  const config = JSON.parse(raw) as StorytellerComicConfig
  if (!config.pages?.length) throw new Error(`Comic "${slug}" has no pages`)
  const name = toPascalCase(slug)

  const metaPath = join(comicDir, 'comic.meta.ts')
  const tsxPath = join(comicDir, `${name}Comic.tsx`)

  if (!force) {
    const existing: string[] = []
    if (await fileExists(metaPath)) existing.push(metaPath)
    if (await fileExists(tsxPath)) existing.push(tsxPath)
    if (existing.length > 0) {
      throw new Error(
        `Refusing to overwrite existing files:\n  ${existing.join('\n  ')}\nRe-run with --force to overwrite.`
      )
    }
  }

  const metaContent = generateMeta(config, slug)
  const tsxContent = generateTsx(config, slug)

  await writeFile(metaPath, metaContent)
  await writeFile(tsxPath, tsxContent)

  console.log(`Generated:`)
  console.log(`  ${metaPath}`)
  console.log(`  ${tsxPath}`)
  console.log(`\nEdit these files to customize effects, transitions, side-panel text, and scroll durations.`)
  console.log(`Note: comic.meta.ts will fail schema validation until the TODO fields (sheet, path, characters) are filled in.`)
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')
}

/**
 * Convert Storyteller rich-text HTML (every bubble's `text` field) into clean
 * plain text suitable for emitting into a JSX string literal. esc() handles
 * JS-literal escaping afterwards, so we keep literal apostrophes/quotes/unicode.
 */
export function htmlToText(html: string): string {
  let text = html
    // Block/break boundaries → newline
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    // Opening block tags → remove (no newline)
    .replace(/<(p|div|li)(\s[^>]*)?>/gi, '')
    // Strip all remaining tags
    .replace(/<[^>]+>/g, '')

  // Numeric entities (decimal + hex)
  text = text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))

  // Named entities (&amp; handled last to avoid double-decoding)
  const named: Record<string, string> = {
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&rsquo;': '’',
    '&lsquo;': '‘',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
  }
  for (const [entity, char] of Object.entries(named)) {
    text = text.split(entity).join(char)
  }
  text = text.split('&amp;').join('&')

  // Whitespace cleanup
  text = text
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return text
}
