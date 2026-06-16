import { describe, it, expect, vi } from 'vitest'
import { GsutilBucket, IMMUTABLE_CC, LATEST_CC, GS_BUCKET } from './bucket'

describe('GsutilBucket', () => {
  it('lists object basenames and ignores the no-match error', async () => {
    let calledWith: string[] = []
    const run = async (args: string[]) => {
      calledWith = args
      return [
        `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v1.png`,
        `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v2.png`,
        '',
      ].join('\n')
    }
    const bucket = new GsutilBucket(run)
    const names = await bucket.list('comics/demo/pages/p1/main.v*.png')
    expect(names).toEqual(['main.v1.png', 'main.v2.png'])
    expect(calledWith).toEqual(['ls', `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v*.png`])
  })

  it('returns [] when gsutil errors (no matching objects)', async () => {
    const run = async () => {
      throw new Error('CommandException: One or more URLs matched no objects.')
    }
    const bucket = new GsutilBucket(run)
    expect(await bucket.list('comics/demo/none.v*.png')).toEqual([])
  })

  it('uploads with immutable cache-control', async () => {
    const calls: string[][] = []
    const run = async (args: string[]) => {
      calls.push(args)
      return ''
    }
    const bucket = new GsutilBucket(run)
    await bucket.upload('/tmp/x.png', 'comics/demo/pages/p1/main.v3.png', IMMUTABLE_CC)
    expect(calls[0]).toEqual([
      '-h',
      `Cache-Control:${IMMUTABLE_CC}`,
      'cp',
      '/tmp/x.png',
      `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v3.png`,
    ])
  })

  it('copies within the bucket with no-cache for the latest pointer', async () => {
    const calls: string[][] = []
    const run = async (args: string[]) => {
      calls.push(args)
      return ''
    }
    const bucket = new GsutilBucket(run)
    await bucket.copy('comics/demo/pages/p1/main.v3.png', 'comics/demo/pages/p1/main.latest.png', LATEST_CC)
    expect(calls[0]).toEqual([
      '-h',
      `Cache-Control:${LATEST_CC}`,
      'cp',
      `gs://${GS_BUCKET}/comics/demo/pages/p1/main.v3.png`,
      `gs://${GS_BUCKET}/comics/demo/pages/p1/main.latest.png`,
    ])
  })
})

describe('GsutilBucket.listKeys', () => {
  it('lists full bucket-relative keys recursively, dropping directory lines', async () => {
    const run = vi.fn(async () =>
      [
        `gs://${GS_BUCKET}/comics-v2/ep1/:`,
        `gs://${GS_BUCKET}/comics-v2/ep1/p1/main.png`,
        `gs://${GS_BUCKET}/comics-v2/ep1/p1/`,
        `gs://${GS_BUCKET}/comics-v2/ep1/p2/main.jpg`,
        ``,
      ].join('\n'),
    )
    const bucket = new GsutilBucket(run)
    const keys = await bucket.listKeys('comics-v2/ep1')
    expect(run).toHaveBeenCalledWith(['ls', '-r', `gs://${GS_BUCKET}/comics-v2/ep1/**`])
    expect(keys).toEqual(['comics-v2/ep1/p1/main.png', 'comics-v2/ep1/p2/main.jpg'])
  })

  it('returns [] when nothing matches', async () => {
    const run = vi.fn(async () => {
      throw new Error('CommandException: One or more URLs matched no objects.')
    })
    const bucket = new GsutilBucket(run)
    expect(await bucket.listKeys('comics-v2/empty')).toEqual([])
  })
})

describe('GsutilBucket.download', () => {
  it('cp from the bucket key to a local file', async () => {
    const run = vi.fn(async () => '')
    const bucket = new GsutilBucket(run)
    await bucket.download('comics-v2/ep1/p1/main.png', '/tmp/main.png')
    expect(run).toHaveBeenCalledWith(['cp', `gs://${GS_BUCKET}/comics-v2/ep1/p1/main.png`, '/tmp/main.png'])
  })
})
