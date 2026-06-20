import { join } from 'node:path'
import { BUCKET_BASE_URL, type Comic } from '@badcode/comic-meta'
import { buildPrompt } from './prompt'
import type { Bucket } from './bucket'
import type { Target } from './target'

export interface FlowPrepResult {
  /** Prompt text to paste into Flow. */
  prompt: string
  /** Reference images, downloaded locally, ready for setInputFiles. */
  refs: { label: string; file: string }[]
}

/** Strip the public bucket base URL to a bucket-relative key. */
export function refKey(url: string): string {
  const prefix = `${BUCKET_BASE_URL}/`
  if (!url.startsWith(prefix)) throw new Error(`url is not in the bucket: ${url}`)
  return url.slice(prefix.length)
}

/** Stage everything one generation needs: prompt text + downloaded reference files. */
export async function flowPrep(
  bucket: Bucket,
  comic: Comic,
  target: Target,
  destDir: string,
): Promise<FlowPrepResult> {
  const { prompt, references } = buildPrompt(comic, target)
  const refs: { label: string; file: string }[] = []
  for (let i = 0; i < references.length; i++) {
    const ref = references[i]
    const key = refKey(ref.url)
    const basename = key.split('/').pop()!
    const file = join(destDir, `ref-${i + 1}-${basename}`)
    await bucket.download(key, file)
    refs.push({ label: ref.label, file })
  }
  return { prompt, refs }
}
