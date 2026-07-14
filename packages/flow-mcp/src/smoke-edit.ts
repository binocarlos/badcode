// Usage: npx tsx packages/flow-mcp/src/smoke-edit.ts [referenceImage] [projectName]
// Attaches the reference image as an ingredient, applies a Google-template delta
// prompt at x2, and harvests both candidates. Proves flow_edit_image. Uses the
// currently-open Flow project unless a projectName is given — the edit is fully
// anchored by the uploaded reference, so any project works.
import { mkdtemp, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { FlowClient } from './flow-client'

const ref = resolve(process.argv[2] ?? 'docs/gpom-short/storyboard/img/p04.jpg')
const project = process.argv[3]
const c = await FlowClient.connect()
try {
  if (project) await c.openProject(project)
  console.log('status:', await c.status())
  const dir = await mkdtemp(join(tmpdir(), 'flow-edit-'))
  const t0 = Date.now()
  const result = await c.editImage(
    'Using the provided image, change only the time of day to night — the ceiling lights off, the self-service screens the only light source. Keep everything else in the image exactly the same, preserving the original style and composition.',
    [ref],
    join(dir, 'edit.jpg'),
    { numOutputs: 2 },
  )
  console.log(`edit took ${Math.round((Date.now() - t0) / 1000)}s, partial=${result.partial ?? false}`)
  for (const cand of result.candidates) {
    console.log('candidate:', cand, 'bytes:', (await stat(cand.path)).size)
  }
  console.log('EDIT SMOKE OK')
} finally {
  await c.close()
}
