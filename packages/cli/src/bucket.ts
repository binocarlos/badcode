import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { BUCKET } from '@badcode/comic-meta'

const execFileAsync = promisify(execFile)

export const GS_BUCKET = BUCKET
export const IMMUTABLE_CC = 'public, max-age=31536000, immutable'
export const LATEST_CC = 'no-cache'

/** Runs a gsutil invocation and returns stdout. Injectable for tests. */
export type GsutilRunner = (args: string[]) => Promise<string>

/** Bucket operations the commands depend on. Keys are bucket-relative (no `gs://`). */
export interface Bucket {
  /** List object basenames matching a bucket-relative glob (e.g. `comics/demo/p.v*.png`). */
  list(glob: string): Promise<string[]>
  /** Upload a local file to a bucket-relative key with the given Cache-Control. */
  upload(localFile: string, key: string, cacheControl: string): Promise<void>
  /** Copy one bucket-relative key to another with the given Cache-Control. */
  copy(srcKey: string, destKey: string, cacheControl: string): Promise<void>
  /** Download a bucket-relative key to a local file path. */
  download(key: string, localFile: string): Promise<void>
  /** Recursively list full bucket-relative keys under a prefix (directories excluded). */
  listKeys(prefix: string): Promise<string[]>
}

const defaultRunner: GsutilRunner = async (args) => {
  const { stdout } = await execFileAsync('gsutil', args)
  return stdout
}

export class GsutilBucket implements Bucket {
  constructor(private readonly run: GsutilRunner = defaultRunner) {}

  async list(glob: string): Promise<string[]> {
    let out: string
    try {
      out = await this.run(['ls', `gs://${GS_BUCKET}/${glob}`])
    } catch {
      return [] // gsutil exits non-zero when nothing matches
    }
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split('/').pop()!)
  }

  async upload(localFile: string, key: string, cacheControl: string): Promise<void> {
    await this.run(['-h', `Cache-Control:${cacheControl}`, 'cp', localFile, `gs://${GS_BUCKET}/${key}`])
  }

  async copy(srcKey: string, destKey: string, cacheControl: string): Promise<void> {
    await this.run(['-h', `Cache-Control:${cacheControl}`, 'cp', `gs://${GS_BUCKET}/${srcKey}`, `gs://${GS_BUCKET}/${destKey}`])
  }

  async download(key: string, localFile: string): Promise<void> {
    await this.run(['cp', `gs://${GS_BUCKET}/${key}`, localFile])
  }

  async listKeys(prefix: string): Promise<string[]> {
    let out: string
    try {
      out = await this.run(['ls', '-r', `gs://${GS_BUCKET}/${prefix}/**`])
    } catch {
      return [] // gsutil exits non-zero when nothing matches
    }
    const root = `gs://${GS_BUCKET}/`
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith(root) && !line.endsWith('/') && !line.endsWith(':'))
      .map((line) => line.slice(root.length))
  }
}
