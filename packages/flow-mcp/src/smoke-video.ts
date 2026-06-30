// Manual smoke — NOT part of CI. Burns video credits + can take minutes.
// Pre-req: ./scripts/flow-chrome.sh running + logged in.
// Usage: npx tsx packages/flow-mcp/src/smoke-video.ts <imagePath>
import { mkdtemp, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const src = process.argv[2]
if (!src) throw new Error('pass a source image path, e.g. .playwright-mcp/ref.jpg')

const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  const dir = await mkdtemp(join(tmpdir(), 'flow-vid-'))
  const out = join(dir, 'clip.mp4')
  const res = await c.generateVideo(
    src,
    'Slow gentle push-in; mist drifts; subtle wind in the grass. Cinematic.',
    out,
  )
  const { size } = await stat(res.path)
  console.log('video:', res, 'bytes:', size)
  if (size < 10000) throw new Error('clip suspiciously small')
  console.log('VIDEO SMOKE OK')
} finally {
  await c.close()
}
