// Usage: npx tsx packages/flow-mcp/src/smoke-core.ts
// Opens camping-v2, generates one image, refines it once. Proves Tasks 1 + 2.
import { mkdtemp, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  console.log('opened:', await c.status())
  const dir = await mkdtemp(join(tmpdir(), 'flow-core-'))
  const a = await c.generateImage('A single landscape image: a quiet campsite at dawn, one empty tent, mist. Cinematic, grounded.', join(dir, 'a.jpg'))
  console.log('image:', a, 'bytes:', (await stat(a.path)).size)
  const b = await c.refine('Make it dusk instead of dawn; warmer light.', join(dir, 'b.jpg'))
  console.log('refined:', b, 'bytes:', (await stat(b.path)).size)
  console.log('CORE SMOKE OK')
} finally { await c.close() }
