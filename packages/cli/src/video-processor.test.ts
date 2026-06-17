import { describe, it, expect, vi } from 'vitest'
import { FfmpegVideoProcessor } from './video-processor'
import type { FfRunner } from './video-processor'

const PROBE_JSON = JSON.stringify({
  streams: [{ width: 1920, height: 1080, r_frame_rate: '24/1', nb_frames: '242' }],
  format: { duration: '10.083' },
})

describe('FfmpegVideoProcessor.probe', () => {
  it('parses ffprobe JSON into VideoMeta', async () => {
    const run = vi.fn(async () => PROBE_JSON)
    const p = new FfmpegVideoProcessor(run)
    expect(await p.probe('/t/src.mp4')).toEqual({ width: 1920, height: 1080, frameCount: 242, fps: 24 })
    expect(run).toHaveBeenCalledWith('ffprobe', expect.arrayContaining(['-of', 'json', '/t/src.mp4']))
  })

  it('falls back to duration*fps when nb_frames is N/A', async () => {
    const run = vi.fn(async () => JSON.stringify({
      streams: [{ width: 640, height: 480, r_frame_rate: '30/1', nb_frames: 'N/A' }],
      format: { duration: '2.0' },
    }))
    const p = new FfmpegVideoProcessor(run)
    expect(await p.probe('/t/x.mp4')).toEqual({ width: 640, height: 480, frameCount: 60, fps: 30 })
  })
})

describe('FfmpegVideoProcessor.encode', () => {
  it('runs ffmpeg with the spike-proven settings, scaled to height', async () => {
    const run = vi.fn<FfRunner>(async () => '')
    const p = new FfmpegVideoProcessor(run)
    await p.encode('/t/src.mp4', '/t/out.720.mp4', 720)
    const [bin, args] = run.mock.calls[0]
    expect(bin).toBe('ffmpeg')
    expect(args).toEqual(expect.arrayContaining(['-i', '/t/src.mp4', '-vf', 'scale=-2:720',
      '-c:v', 'libx264', '-g', '12', '-keyint_min', '12', '-bf', '0', '-crf', '26', '-an', '/t/out.720.mp4']))
  })
})

describe('FfmpegVideoProcessor.extractPoster', () => {
  it('extracts a single frame to the output path', async () => {
    const run = vi.fn<FfRunner>(async () => '')
    const p = new FfmpegVideoProcessor(run)
    await p.extractPoster('/t/src.mp4', '/t/poster.png')
    const [bin, args] = run.mock.calls[0]
    expect(bin).toBe('ffmpeg')
    expect(args).toEqual(expect.arrayContaining(['-i', '/t/src.mp4', '-frames:v', '1', '/t/poster.png']))
  })
})

describe('FfmpegVideoProcessor.framesToVideo', () => {
  it('encodes a frame pattern into a video at the given fps', async () => {
    const run = vi.fn<FfRunner>(async () => '')
    const p = new FfmpegVideoProcessor(run)
    await p.framesToVideo('/t/f/frame_%05d.jpg', 24, '/t/src.mp4')
    const [bin, args] = run.mock.calls[0]
    expect(bin).toBe('ffmpeg')
    expect(args).toEqual(expect.arrayContaining(['-framerate', '24', '-start_number', '1',
      '-i', '/t/f/frame_%05d.jpg', '-c:v', 'libx264', '/t/src.mp4']))
  })
})
