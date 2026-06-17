import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export interface VideoMeta {
  width: number
  height: number
  frameCount: number
  fps: number
}

/** Runs an ffmpeg/ffprobe invocation, returns stdout. Injectable for tests. */
export type FfRunner = (bin: 'ffmpeg' | 'ffprobe', args: string[]) => Promise<string>

export interface VideoProcessor {
  /** Read source width/height/frameCount/fps. */
  probe(input: string): Promise<VideoMeta>
  /** Encode `input` to an H.264 MP4 scaled to `height` (gop12, no B-frames). */
  encode(input: string, output: string, height: number): Promise<void>
  /** Extract the first frame of `input` to `outputPng`. */
  extractPoster(input: string, outputPng: string): Promise<void>
  /** Encode a numbered frame pattern (1-based) into a near-lossless source video. */
  framesToVideo(framePattern: string, fps: number, output: string): Promise<void>
}

const defaultRunner: FfRunner = async (bin, args) => {
  const { stdout } = await execFileAsync(bin, args)
  return stdout
}

const ENCODE_BASE = ['-c:v', 'libx264', '-g', '12', '-keyint_min', '12', '-bf', '0', '-pix_fmt', 'yuv420p', '-an']

export class FfmpegVideoProcessor implements VideoProcessor {
  constructor(private readonly run: FfRunner = defaultRunner) {}

  async probe(input: string): Promise<VideoMeta> {
    const out = await this.run('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,r_frame_rate,nb_frames:format=duration',
      '-of', 'json', input,
    ])
    const json = JSON.parse(out) as {
      streams?: { width?: number; height?: number; r_frame_rate?: string; nb_frames?: string }[]
      format?: { duration?: string }
    }
    const s = json.streams?.[0] ?? {}
    const [num, den] = (s.r_frame_rate ?? '0/1').split('/').map(Number)
    const fps = den ? num / den : 0
    const nb = Number(s.nb_frames)
    const duration = Number(json.format?.duration)
    const frameCount = Number.isFinite(nb) && nb > 0 ? nb : Math.round(duration * fps)
    return { width: s.width ?? 0, height: s.height ?? 0, frameCount, fps }
  }

  async encode(input: string, output: string, height: number): Promise<void> {
    await this.run('ffmpeg', ['-y', '-loglevel', 'error', '-i', input,
      '-vf', `scale=-2:${height}`, ...ENCODE_BASE, '-crf', '26', output])
  }

  async extractPoster(input: string, outputPng: string): Promise<void> {
    await this.run('ffmpeg', ['-y', '-loglevel', 'error', '-i', input, '-frames:v', '1', outputPng])
  }

  async framesToVideo(framePattern: string, fps: number, output: string): Promise<void> {
    await this.run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-start_number', '1',
      '-i', framePattern, ...ENCODE_BASE, '-crf', '12', output])
  }
}
