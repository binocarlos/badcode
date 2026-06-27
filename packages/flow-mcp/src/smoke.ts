/**
 * Manual smoke test — NOT part of CI.
 * Pre-req: run `./scripts/flow-chrome.sh` and log into Flow first.
 * Usage: npx tsx packages/flow-mcp/src/smoke.ts
 */
import { mkdtemp } from 'node:fs/promises'
import { stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const client = await FlowClient.connect()
try {
  console.log('status:', await client.status())
  const dir = await mkdtemp(join(tmpdir(), 'flow-smoke-'))
  const out = join(dir, 'smoke.jpg')
  const res = await client.generateImage(
    'A single landscape image: an empty office at golden hour, one overturned chair. Cinematic but grounded.',
    out,
  )
  const { size } = await stat(res.path)
  console.log('generated:', res, 'bytes:', size)
  if (size < 1000) throw new Error('file suspiciously small')
  console.log('SMOKE OK')
} finally {
  await client.close()
}
