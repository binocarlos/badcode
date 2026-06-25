#!/usr/bin/env -S npx tsx
import { Command } from 'commander'
import { mkdir } from 'node:fs/promises'
import { loadComic } from './loadComic'
import { buildPrompt } from './prompt'
import { flowPrep } from './flow-prep'
import { push } from './push'
import { status } from './status'
import { pull } from './pull'
import { generate } from './generate'
import { assetsBuild } from './assets-build'
import { SharpImageProcessor } from './image-processor'
import { FfmpegVideoProcessor } from './video-processor'
import { readManifestIfExists, writeManifestFile } from './write-manifest'
import { GsutilBucket, LATEST_CC } from './bucket'
import type { Target } from './target'
import type { PromptResult } from './prompt'

/** Resolve the CLI's (assetId | --character) into a Target. */
function toTarget(assetId: string | undefined, character: string | undefined): Target {
  if (character) return { kind: 'character', id: character }
  if (assetId) return { kind: 'asset', id: assetId }
  throw new Error('provide an <assetId> or --character <id>')
}

function printPrompt(result: PromptResult): void {
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
  .command('flow-prep')
  .description('Stage a slide for Flow: print the prompt and download its reference images to a dir.')
  .argument('<comic>', 'comic id')
  .argument('[assetId]', 'asset id from the comic metadata')
  .option('-c, --character <id>', 'target a character sheet instead of an asset')
  .requiredOption('-d, --dest <dir>', 'local directory to write reference images into')
  .action(async (comicId: string, assetId: string | undefined, opts: { character?: string; dest: string }) => {
    const comic = await loadComic(comicId)
    await mkdir(opts.dest, { recursive: true })
    const result = await flowPrep(new GsutilBucket(), comic, toTarget(assetId, opts.character), opts.dest)
    console.log('\n--- PROMPT (paste into Flow) ---\n')
    console.log(result.prompt)
    console.log('\nREFERENCE FILES (attach in order):')
    for (const ref of result.refs) console.log(`  ${ref.label} ${ref.file}`)
    console.log('')
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

program
  .command('pull')
  .description('Pull a comic from Storyteller (badcode.tv) — fetches comic.json; assets are served from the bucket.')
  .argument('<url>', 'Storyteller comic URL or comic UUID')
  .option('-s, --slug <name>', 'override the auto-derived slug')
  .option('-a, --assets', 'also download asset files locally (default: reference them from the bucket)')
  .action(async (url: string, opts: { slug?: string; assets?: boolean }) => {
    const rootDir = process.cwd()
    await pull(url, rootDir, opts.slug, opts.assets ?? false)
  })

program
  .command('generate')
  .description('Generate a badcode comic scaffold (TSX + meta) from a pulled comic.json.')
  .argument('<slug>', 'comic slug (folder name under apps/web/src/comics)')
  .option('-f, --force', 'overwrite existing generated files')
  .action(async (slug: string, opts: { force?: boolean }) => {
    const rootDir = process.cwd()
    await generate(slug, rootDir, opts.force ?? false)
  })

program
  .command('assets-build')
  .description('Generate low/high WebP variants + ThumbHash for every image under a bucket subfolder, and emit a manifest.')
  .requiredOption('-s, --src <prefix>', 'bucket-relative source subfolder, e.g. comics-v2/gpom-ep1')
  .requiredOption('-m, --manifest <path>', 'local path to write assets.manifest.json')
  .option('-f, --force', 'rebuild variants even if they already exist')
  .option('--dry-run', 'compute the manifest without uploading or processing')
  .option('-c, --concurrency <n>', 'max images processed in parallel', '6')
  .action(async (opts: { src: string; manifest: string; force?: boolean; dryRun?: boolean; concurrency: string }) => {
    const bucket = new GsutilBucket()
    const previous = await readManifestIfExists(opts.manifest)
    const manifest = await assetsBuild({
      bucket,
      processor: new SharpImageProcessor(),
      video: new FfmpegVideoProcessor(),
      src: opts.src,
      previous,
      force: opts.force ?? false,
      dryRun: opts.dryRun ?? false,
      concurrency: Number(opts.concurrency),
      log: (msg) => console.log(msg),
    })

    await writeManifestFile(opts.manifest, manifest)
    console.log(`wrote ${Object.keys(manifest.assets).length} assets → ${opts.manifest}`)

    if (!opts.dryRun) {
      // Upload a copy of the just-written manifest into the bucket subfolder.
      await bucket.upload(opts.manifest, `${manifest.basePath}/assets.manifest.json`, LATEST_CC)
      console.log(`uploaded manifest copy → ${manifest.basePath}/assets.manifest.json`)
    }
  })

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exitCode = 1
})
