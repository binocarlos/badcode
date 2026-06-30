// Usage: npx tsx packages/flow-mcp/src/smoke-batch.ts
import { mkdtemp, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  const dir = await mkdtemp(join(tmpdir(), 'flow-batch-'))
  const items = await c.generateBatch(
    [
      'A single landscape image: a campsite firepit, cold ashes, morning light. Grounded, cinematic.',
      'A single landscape image: a folding camp chair knocked over on grass, dew. Grounded, cinematic.',
    ],
    dir,
  )
  for (const it of items) console.log(it.index, it.path, (await stat(it.path)).size, 'bytes')
  if (items.length !== 2) throw new Error('expected 2 items')
  console.log('BATCH SMOKE OK')
} finally { await c.close() }
