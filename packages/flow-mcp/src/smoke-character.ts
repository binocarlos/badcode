// Manual smoke — NOT part of CI.
// Pre-req: ./scripts/flow-chrome.sh running + logged in.
// Usage: npx tsx packages/flow-mcp/src/smoke-character.ts <refImagePath>
// Proves Task 5 (createCharacter) + Task 6 (generate casting that character via the @ picker).
import { mkdtemp, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FlowClient } from './flow-client'

const ref = process.argv[2]
if (!ref) throw new Error('pass a reference image path, e.g. .playwright-mcp/ref.jpg')

const c = await FlowClient.connect()
try {
  await c.openProject('camping-v2')
  const char = await c.createCharacter('SmokeChar', [ref])
  console.log('character:', char)
  const dir = await mkdtemp(join(tmpdir(), 'flow-charuse-'))
  const img = await c.generateImage(
    'standing beside a tent at dawn, mist behind, cinematic',
    join(dir, 'use.jpg'),
    { character: 'SmokeChar' },
  )
  console.log('char-image:', img, 'bytes:', (await stat(img.path)).size)
  console.log('CHARACTER SMOKE OK')
} finally {
  await c.close()
}
