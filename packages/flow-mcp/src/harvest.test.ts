import { describe, it, expect, vi } from 'vitest'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { resolveSignedUrl, harvestToFile, contentTypeOf, type RequestLike } from './harvest'

function fakeRequest(opts: {
  finalUrl: string
  body?: Buffer
  contentType?: string
}): RequestLike {
  return {
    get: vi.fn(async (_url: string) => ({
      url: () => opts.finalUrl,
      body: async () => opts.body ?? Buffer.from(''),
      headers: () => ({ 'content-type': opts.contentType ?? 'image/jpeg' }),
    })),
  }
}

describe('harvest', () => {
  const signed =
    'https://flow-content.google/image/uuid?Expires=1&KeyName=k&Signature=s'

  it('resolves the signed CDN URL via the redirect', async () => {
    const req = fakeRequest({ finalUrl: signed })
    expect(await resolveSignedUrl(req, 'uuid')).toBe(signed)
    expect(req.get).toHaveBeenCalledWith(
      'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=uuid',
    )
  })

  it('downloads the bytes and writes them to outPath', async () => {
    const bytes = Buffer.from('JPEGDATA')
    const req = fakeRequest({ finalUrl: signed, body: bytes })
    const dir = await mkdtemp(join(tmpdir(), 'flow-harvest-'))
    const out = join(dir, 'p05.jpg')
    await harvestToFile(req, 'uuid', out)
    expect(await readFile(out)).toEqual(bytes)
  })

  it('reads the content-type for completion polling', async () => {
    const req = fakeRequest({ finalUrl: signed, contentType: 'video/mp4' })
    expect(await contentTypeOf(req, 'uuid')).toBe('video/mp4')
  })
})
