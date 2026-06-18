// Headless capture harness: scroll through a comic and screenshot each beat.
// Usage: node scripts/capture-comic.mjs <route> <outDir> <shots>
// Drives the already-running dev server; renders the scroll-driven comic at
// evenly-spaced scroll positions and writes PNGs we can look at.
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import { readdirSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const require = createRequire(import.meta.url)

// Resolve Playwright from local/global install, falling back to the npx cache
// (where it often lives via `npx playwright`). Keeps this tool dependency-free.
function loadChromium() {
  const candidates = ['playwright']
  const npx = join(homedir(), '.npm', '_npx')
  if (existsSync(npx)) {
    for (const d of readdirSync(npx)) candidates.push(join(npx, d, 'node_modules', 'playwright'))
  }
  for (const c of candidates) {
    try { return require(c).chromium } catch { /* try next */ }
  }
  throw new Error('Playwright not found. Install with: npx playwright install chromium')
}

const chromium = loadChromium()

const route = process.argv[2] ?? '/comics/camping'
const outDir = process.argv[3] ?? '/tmp/comic-shots'
const shots = Number(process.argv[4] ?? 12)
const base = 'http://localhost:5173'

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto(base + route, { waitUntil: 'networkidle' })
// Let the first page's widget paint.
await page.waitForTimeout(1500)

const totalHeight = await page.evaluate(() => document.body.scrollHeight)
const viewport = 800
const maxScroll = Math.max(1, totalHeight - viewport)

for (let i = 0; i < shots; i++) {
  const y = Math.round((i / (shots - 1)) * maxScroll)
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  // Wait for the scroll engine (rAF) + any transition + asset decode.
  await page.waitForTimeout(900)
  const pct = Math.round((y / maxScroll) * 100)
  const name = `${outDir}/shot-${String(i).padStart(2, '0')}-${String(pct).padStart(3, '0')}pct.png`
  await page.screenshot({ path: name })
  console.log(`${name}  (scrollY=${y}, ${pct}%)`)
}

await browser.close()
console.log(`\nDone: ${shots} shots → ${outDir}`)
