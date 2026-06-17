import MP4Box from 'mp4box'
import { gopBoundsFor, nearestCached, gopsToEvict } from './gop'

const MAX_GOPS_RESIDENT = 12

interface Sample { type: 'key' | 'delta'; timestamp: number; duration: number; data: Uint8Array }

/**
 * Windowed WebCodecs decoder for one video rendition. Demuxes all samples up front
 * (compressed), decodes the GOP containing a requested frame on demand, caches decoded
 * frames as ImageBitmaps, and LRU-evicts whole GOPs. Browser-only; validated by the
 * spike at apps/web/public/spike/ and the Task 6 manual pass.
 */
export class VideoSource {
  private decoder: VideoDecoder | null = null
  private samples: Sample[] = []
  private gopStarts: number[] = []
  private cache = new Map<number, ImageBitmap>()
  private cachedGops: number[] = []
  private decodeCursor = 0
  private decodingGop: number | null = null
  private closed = false
  private lastDrawn = -1
  ready = false

  constructor(private readonly url: string, public readonly frameCount: number) {}

  async load(): Promise<void> {
    const mp4 = MP4Box.createFile()
    const description = (track: { id: number }): Uint8Array => {
      const trak = (mp4 as any).getTrackById(track.id)
      for (const entry of trak.mdia.minf.stbl.stsd.entries) {
        const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
        if (box) {
          const ds = new (MP4Box as any).DataStream(undefined, 0, (MP4Box as any).DataStream.BIG_ENDIAN)
          box.write(ds)
          return new Uint8Array(ds.buffer, 8)
        }
      }
      throw new Error('no codec description box')
    }

    await new Promise<void>((resolve, reject) => {
      ;(mp4 as any).onError = reject
      ;(mp4 as any).onReady = (info: any) => {
        const track = info.videoTracks[0]
        this.decoder = new VideoDecoder({
          output: (frame) => {
            const idx = this.decodeCursor++
            const w = frame.displayWidth, h = frame.displayHeight
            createImageBitmap(frame, { resizeWidth: w, resizeHeight: h }).then((bmp) => {
              frame.close()
              if (this.closed) { bmp.close(); return }
              this.cache.set(idx, bmp)
            }).catch(() => frame.close())
          },
          error: () => {},
        })
        this.decoder.configure({ codec: track.codec, codedWidth: track.video.width, codedHeight: track.video.height, description: description(track) })
        ;(mp4 as any).onSamples = (_id: number, _u: unknown, samples: any[]) => {
          for (const s of samples) {
            if (s.is_sync) this.gopStarts.push(s.number)
            this.samples[s.number] = {
              type: s.is_sync ? 'key' : 'delta',
              timestamp: (s.cts * 1e6) / s.timescale,
              duration: (s.duration * 1e6) / s.timescale,
              data: new Uint8Array(s.data),
            }
          }
        }
        ;(mp4 as any).setExtractionOptions(track.id, null, { nbSamples: Infinity })
        ;(mp4 as any).start()
        this.ready = true
        resolve()
      }
      fetch(this.url).then((r) => r.arrayBuffer()).then((buf) => {
        const ab = buf as ArrayBuffer & { fileStart?: number }
        ab.fileStart = 0
        ;(mp4 as any).appendBuffer(ab)
        ;(mp4 as any).flush()
      }).catch(reject)
    })
  }

  private evict(): void {
    for (const gs of gopsToEvict(this.cachedGops, MAX_GOPS_RESIDENT)) {
      const [a, b] = gopBoundsFor(this.gopStarts, gs, this.frameCount)
      for (let i = a; i <= b; i++) { const bmp = this.cache.get(i); if (bmp) { bmp.close(); this.cache.delete(i) } }
    }
    this.cachedGops = this.cachedGops.slice(Math.max(0, this.cachedGops.length - MAX_GOPS_RESIDENT))
  }

  private async decodeGop(gs: number, ge: number): Promise<void> {
    if (this.closed || !this.decoder) return
    if (this.cachedGops.includes(gs) || this.decodingGop !== null) return
    this.decodingGop = gs
    this.decodeCursor = gs
    try {
      for (let i = gs; i <= ge; i++) this.decoder.decode(new EncodedVideoChunk(this.samples[i]))
      await this.decoder.flush()
    } catch { /* decoder errors surface via the error callback */ }
    if (this.closed) return
    this.cachedGops.push(gs)
    this.evict()
    this.decodingGop = null
  }

  /** Draw the best available frame for `target` to the canvas, and ensure its GOP decodes. */
  draw(ctx: CanvasRenderingContext2D, target: number, w: number, h: number): void {
    if (!this.ready) return
    const pick = nearestCached((i) => this.cache.has(i), target, this.frameCount)
    // Only blit when the chosen frame changed — keeps a continuous rAF draw loop cheap when idle.
    if (pick >= 0 && pick !== this.lastDrawn) {
      ctx.drawImage(this.cache.get(pick) as ImageBitmap, 0, 0, w, h)
      this.lastDrawn = pick
    }
    const [gs, ge] = gopBoundsFor(this.gopStarts, target, this.frameCount)
    if (!this.cachedGops.includes(gs)) void this.decodeGop(gs, ge)
  }

  close(): void {
    this.closed = true
    for (const bmp of this.cache.values()) bmp.close()
    this.cache.clear()
    try { this.decoder?.close() } catch { /* already closed */ }
    this.decoder = null
  }
}
