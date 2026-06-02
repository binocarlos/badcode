import { comicUrl, type Comic } from '@badcode/comic-meta'
import type { Target } from './target'

export interface Reference {
  label: string
  url: string
}

export interface PromptResult {
  /** The text to paste into Gemini. */
  prompt: string
  /** Reference images/keyframes to download and attach. */
  references: Reference[]
  /** Heading printed above the references. */
  refHeading: string
}

const REF_HEADING = 'REFERENCE IMAGES (download + attach):'
const KEYFRAME_HEADING = 'KEYFRAMES (download + attach):'

/** Assemble the layered Gemini prompt for a target. `add` is appended verbatim. */
export function buildPrompt(comic: Comic, target: Target, add?: string): PromptResult {
  if (target.kind === 'character') return characterPrompt(comic, target.id, add)

  const asset = comic.assets[target.id]
  if (!asset) throw new Error(`unknown asset "${target.id}" in comic "${comic.id}"`)
  return asset.kind === 'image'
    ? imagePrompt(comic, target.id, add)
    : videoPrompt(comic, target.id, add)
}

function characterPrompt(comic: Comic, id: string, add?: string): PromptResult {
  const character = comic.characters[id]
  if (!character) throw new Error(`unknown character "${id}" in comic "${comic.id}"`)
  const lines = [
    `Art style: ${comic.style}`,
    '',
    `Character [${character.name}]: ${character.description}`,
    '',
    'Full-body character reference sheet, neutral pose, plain background, consistent design.',
  ]
  if (add) lines.push(add)
  const references = (character.refs ?? []).map((ref, i) => ({
    label: `[${i + 1}]`,
    url: comicUrl(comic.id, ref.path),
  }))
  return { prompt: lines.join('\n'), references, refHeading: REF_HEADING }
}

function imagePrompt(comic: Comic, id: string, add?: string): PromptResult {
  const asset = comic.assets[id]
  if (!asset || asset.kind !== 'image') throw new Error(`asset "${id}" is not an image`)
  const lines = [`Art style: ${comic.style}`]
  for (const charId of asset.characters) {
    const character = comic.characters[charId]
    if (!character) throw new Error(`asset "${id}" references unknown character "${charId}"`)
    lines.push(`Character [${character.name}]: ${character.description}`)
  }
  lines.push('', `Scene: ${asset.scene}`)
  if (add) lines.push(add)
  const references = asset.characters.map((charId, i) => ({
    label: `[${i + 1}]`,
    url: comicUrl(comic.id, comic.characters[charId].sheet),
  }))
  return { prompt: lines.join('\n'), references, refHeading: REF_HEADING }
}

function videoPrompt(comic: Comic, id: string, add?: string): PromptResult {
  const asset = comic.assets[id]
  if (!asset || asset.kind !== 'video') throw new Error(`asset "${id}" is not a video`)
  const lines = [`Art style: ${comic.style}`, '', `Transition: ${asset.transition}`]
  if (add) lines.push(add)
  const start = comic.assets[asset.from]
  const end = comic.assets[asset.to]
  const references = [
    { label: '[start]', url: comicUrl(comic.id, start.path) },
    { label: '[end]', url: comicUrl(comic.id, end.path) },
  ]
  return { prompt: lines.join('\n'), references, refHeading: KEYFRAME_HEADING }
}
