#!/usr/bin/env -S npx tsx
import { Command } from 'commander'
import { loadComic } from './loadComic'
import { buildPrompt } from './prompt'
import { push } from './push'
import { status } from './status'
import { GsutilBucket } from './bucket'
import type { Target } from './target'

/** Resolve the CLI's (assetId | --character) into a Target. */
function toTarget(assetId: string | undefined, character: string | undefined): Target {
  if (character) return { kind: 'character', id: character }
  if (assetId) return { kind: 'asset', id: assetId }
  throw new Error('provide an <assetId> or --character <id>')
}

function printPrompt(result: { prompt: string; references: { label: string; url: string }[]; refHeading: string }): void {
  console.log('\n--- PROMPT (paste into Gemini) ---\n')
  console.log(result.prompt)
  if (result.references.length > 0) {
    console.log(`\n${result.refHeading}`)
    for (const ref of result.references) console.log(`  ${ref.label} ${ref.url}`)
  }
  console.log('')
}

const program = new Command()
program.name('badcode').description('Prepare Gemini prompts and manage comic assets in GCS.')

program
  .command('prompt')
  .description('Print the assembled Gemini prompt + reference URLs for an asset or character sheet.')
  .argument('<comic>', 'comic id (folder under apps/web/src/comics)')
  .argument('[assetId]', 'asset id from the comic metadata')
  .option('-c, --character <id>', 'target a character sheet instead of an asset')
  .option('-a, --add <text>', 'extra text appended to the prompt base')
  .action(async (comicId: string, assetId: string | undefined, opts: { character?: string; add?: string }) => {
    const comic = await loadComic(comicId)
    const result = buildPrompt(comic, toTarget(assetId, opts.character), opts.add)
    printPrompt(result)
  })

program
  .command('push')
  .description('Upload a generated file as the next version of an asset/sheet and refresh .latest.')
  .argument('<comic>', 'comic id')
  .argument('[assetId]', 'asset id from the comic metadata')
  .requiredOption('-f, --file <path>', 'local file to upload')
  .option('-c, --character <id>', 'target a character sheet instead of an asset')
  .action(async (comicId: string, assetId: string | undefined, opts: { file: string; character?: string }) => {
    const comic = await loadComic(comicId)
    const target = toTarget(assetId, opts.character)
    const version = await push(new GsutilBucket(), comic, target, opts.file)
    console.log(`pushed v${version}`)
  })

program
  .command('status')
  .description('Show which assets/sheets have been generated and how many versions exist.')
  .argument('<comic>', 'comic id')
  .action(async (comicId: string) => {
    const comic = await loadComic(comicId)
    const rows = await status(new GsutilBucket(), comic)
    for (const row of rows) {
      const latest = row.hasLatest ? 'latest✓' : 'latest✗'
      console.log(`${row.id.padEnd(18)} ${row.kind.padEnd(7)} v=${row.versions}  ${latest}`)
    }
  })

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exitCode = 1
})
