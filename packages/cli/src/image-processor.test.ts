import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { SharpImageProcessor } from './image-processor'

let dir: string
let srcPng: string

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'imgproc-'))
  srcPng = join(dir, 'src.png')
  await sharp({ create: { width: 1200, height: 800, channels: 3, background: { r: 10, g: 90, b: 160 } } })
    .png()
    .toFile(srcPng)
})

afterAll(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('SharpImageProcessor', () => {
  const proc = new SharpImageProcessor()

  it('reports intrinsic dimensions', async () => {
    expect(await proc.dimensions(srcPng)).toEqual({ width: 1200, height: 800 })
  })

  it('writes a WebP no wider than the requested width', async () => {
    const out = join(dir, 'out.low.webp')
    await proc.toWebp(srcPng, out, 720, 70)
    const meta = await sharp(out).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.width).toBeLessThanOrEqual(720)
  })

  it('does not upscale images smaller than the target width', async () => {
    const out = join(dir, 'out.high.webp')
    await proc.toWebp(srcPng, out, 1920, 80)
    const meta = await sharp(out).metadata()
    expect(meta.width).toBe(1200)
  })

  it('produces a compact base64 ThumbHash (not a data-URI)', async () => {
    const hash = await proc.thumbhash(srcPng)
    expect(typeof hash).toBe('string')
    expect(hash.length).toBeGreaterThan(0)
    expect(hash.length).toBeLessThan(100) // raw ~25-byte hash → ~33 base64 chars, never KBs
    expect(hash.startsWith('data:')).toBe(false)
  })
})
