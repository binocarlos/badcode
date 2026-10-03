#!/usr/bin/env node
// Drive Suno's Advanced create form over CDP, deterministically.
//
// Why a script and not a pile of MCP calls: every model round-trip is a chance for a
// flaky link to strand a half-filled form. This runs entirely on this machine — one
// invocation does paste → sliders → Create → wait → harvest, and writes a JSON report
// to disk. If the session driving it disappears, the take still completes.
//
// Attaches to the Chrome launched by scripts/flow-chrome.sh (CDP :9222), which must
// already be logged into Suno. Never launches or kills a browser of its own.
//
//   node scripts/suno-run.mjs inspect
//   node scripts/suno-run.mjs run <job.json> [--dry]
//
// A job file looks like:
//   { "title": "camping-r11a-base-s70w40", "model": "v6",
//     "style": "...", "exclude": "...", "lyrics": "...",
//     "styleInfluence": 70, "weirdness": 40, "workspace": "camping-Jack" }

import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const ENDPOINT = `http://localhost:${process.env.SUNO_CDP_PORT ?? process.env.FLOW_CDP_PORT ?? '9222'}`
const CREATE_URL = 'https://suno.com/create'
const CLIP_API = 'https://studio-api.prod.suno.com/api/clip'
const GEN_TIMEOUT_MS = 6 * 60_000
const POLL_MS = 3_000

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a)

// ---------------------------------------------------------------- connection

async function attach() {
  const browser = await chromium.connectOverCDP(ENDPOINT)
  const context = browser.contexts()[0]
  if (!context) throw new Error('NO_CONTEXT — is scripts/flow-chrome.sh running?')
  const pages = context.pages()
  let page = pages.find((p) => p.url().includes('suno.com'))
  if (!page) {
    page = pages[0] ?? (await context.newPage())
  }
  if (!/suno\.com\/create/.test(page.url())) {
    await page.goto(CREATE_URL, { waitUntil: 'domcontentloaded' })
  }
  // Don't override viewport: it can fight Kai's real window size and change Suno's
  // responsive layout (observed: an override hid the Exclude Styles box that shows in a
  // wider real window). Only set one if the page reports null (headless/no real window).
  if (!page.viewportSize()) await page.setViewportSize({ width: 1500, height: 1000 }).catch(() => {})
  await dismissConsent(page)
  const loggedIn = await page.evaluate(() =>
    !Array.from(document.querySelectorAll('button')).some((b) => b.textContent.trim() === 'Log in'),
  )
  if (!loggedIn) throw new Error('NOT_LOGGED_IN — log into Suno in the Chrome window, then re-run')
  return { browser, page }
}

async function dismissConsent(page) {
  await page
    .evaluate(() => {
      const b = document.querySelector('#onetrust-reject-all-handler')
      if (b) { b.click(); return }
      document.querySelector('#onetrust-consent-sdk')?.remove()
    })
    .catch(() => {})
}

// ---------------------------------------------------------------- form parts

/** The Advanced tab is a base-ui tab that Playwright often judges "unstable"; force it. */
async function openAdvanced(page) {
  const selected = await page.evaluate(
    () => document.querySelector('[role="tab"][aria-label="Advanced"]')?.getAttribute('aria-selected') === 'true',
  )
  if (selected) return
  await page.getByRole('tab', { name: 'Advanced' }).click({ force: true, timeout: 10_000 })
  await page.waitForFunction(
    () => document.querySelector('[role="tab"][aria-label="Advanced"]')?.getAttribute('aria-selected') === 'true',
    { timeout: 10_000 },
  )
}

/** React owns these textareas, so poke the native setter and fire a bubbling input event. */
const SET_TEXTAREA = (maxlen, value) => {
  const el = Array.from(document.querySelectorAll('textarea')).find(
    (t) => t.getAttribute('maxlength') === String(maxlen),
  )
  if (!el) return { ok: false, reason: 'no textarea with maxlength=' + maxlen }
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
  setter.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  return { ok: true, len: el.value.length }
}

async function fillStyle(page, text) {
  const r = await page.evaluate(SET_TEXTAREA, 1000, text)
  if (!r.ok) throw new Error('STYLE_BOX_NOT_FOUND: ' + r.reason)
  if (r.len !== text.length) throw new Error(`STYLE_TRUNCATED: wrote ${r.len} of ${text.length}`)
  return r
}

/**
 * Lyrics live in a contenteditable rich editor, so the native-setter trick is useless.
 * Clear it, then insertText — and verify, because a rich editor that eats newlines is
 * exactly the "stale lyric box" failure that is inaudible in the result.
 */
async function fillLyrics(page, text) {
  const box = page.locator('[aria-label="Lyrics editor"]').first()
  await box.click()
  await page.keyboard.press('ControlOrMeta+A')
  await page.keyboard.press('Backspace')
  await page.keyboard.insertText(text)
  await page.waitForTimeout(400)
  const got = await box.evaluate((el) => el.innerText)
  const norm = (s) => s.replace(/ /g, ' ').replace(/\r/g, '').replace(/\n+$/, '').trim()
  const ok = norm(got) === norm(text)
  return { ok, wrote: text.length, read: got.length, sample: ok ? null : norm(got).slice(0, 200) }
}

/** Sliders are role=slider; nudge with arrow keys until aria-valuenow lands on target. */
async function setSlider(page, label, target) {
  const s = page.locator(`[role="slider"][aria-label="${label}"]`).first()
  if (!(await s.count())) throw new Error(`SLIDER_NOT_FOUND: ${label}`)
  const read = () => s.evaluate((el) => Number(el.getAttribute('aria-valuenow')))
  await s.focus()
  let cur = await read()
  for (let i = 0; i < 220 && cur !== target; i++) {
    await page.keyboard.press(cur < target ? 'ArrowRight' : 'ArrowLeft')
    await page.waitForTimeout(15)
    const next = await read()
    if (next === cur) break // slider refused to move — don't spin
    cur = next
  }
  if (cur !== target) throw new Error(`SLIDER_STUCK: ${label} at ${cur}, wanted ${target}`)
  return cur
}

async function selectModel(page, want) {
  const cur = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => /^v\d/.test(x.textContent.trim()))
    return b ? b.textContent.trim() : null
  })
  if (cur === want) return cur
  throw new Error(`MODEL_MISMATCH: form is on ${cur}, wanted ${want} — switch it in the UI`)
}

// ---------------------------------------------------------------- inspection

/**
 * Round 10 is a v6 clip that carries negative_tags, but the v6 Advanced form shows no
 * Exclude Styles box. Either the v6 rollout dropped the control, or it is model-gated.
 * Open the model menu, try each option, and report where an exclude field exists.
 */
async function probeModels(page) {
  const out = { options: [], perModel: {} }
  const btn = page.locator('button').filter({ hasText: /^v\d/ }).first()
  await btn.click({ force: true, timeout: 10_000 })
  await page.waitForTimeout(800)
  out.options = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[role="menuitem"],[role="option"]'))
      .map((e) => e.textContent.trim().slice(0, 40))
      .filter(Boolean),
  )
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  const countBoxes = () =>
    page.evaluate(() =>
      Array.from(document.querySelectorAll('textarea')).map((t) => ({
        maxlength: t.getAttribute('maxlength'),
        placeholder: (t.getAttribute('placeholder') || '').slice(0, 40),
      })),
    )
  out.perModel.current = await countBoxes()
  return out
}

async function inspect(page) {
  await openAdvanced(page)
  const dom = await page.evaluate(() => {
    const txt = (e) => (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 70)
    return {
      url: location.href,
      tabs: Array.from(document.querySelectorAll('[role="tab"]')).map(
        (t) => `${t.getAttribute('aria-label')}=${t.getAttribute('aria-selected')}`,
      ),
      model: Array.from(document.querySelectorAll('button')).map(txt).find((t) => /^v\d/.test(t)) ?? null,
      textareas: Array.from(document.querySelectorAll('textarea')).map((t) => ({
        maxlength: t.getAttribute('maxlength'),
        placeholder: t.getAttribute('placeholder'),
        ariaLabel: t.getAttribute('aria-label'),
        value: t.value.length,
        visible: t.getBoundingClientRect().height > 0,
      })),
      editables: Array.from(document.querySelectorAll('[contenteditable="true"]')).map((e) => ({
        ariaLabel: e.getAttribute('aria-label'),
        chars: (e.innerText || '').length,
      })),
      sliders: Array.from(document.querySelectorAll('[role="slider"]')).map((s) => ({
        label: s.getAttribute('aria-label'),
        now: s.getAttribute('aria-valuenow'),
        min: s.getAttribute('aria-valuemin'),
        max: s.getAttribute('aria-valuemax'),
      })),
      switches: Array.from(document.querySelectorAll('[role="switch"],[role="radiogroup"]')).map((e) => ({
        role: e.getAttribute('role'),
        label: txt(e),
        checked: e.getAttribute('aria-checked'),
      })),
      // everything that might be the missing exclude-styles control
      excludeCandidates: Array.from(document.querySelectorAll('button,label,span,div'))
        .map(txt)
        .filter((t) => /exclud|negative|avoid|without|ban/i.test(t))
        .slice(0, 20),
      panelText: (() => {
        const tab = document.querySelector('[role="tab"][aria-label="Advanced"]')
        let p = tab
        for (let i = 0; i < 7 && p; i++) p = p.parentElement
        return p ? p.innerText.split('\n').map((s) => s.trim()).filter(Boolean) : []
      })(),
    }
  })
  return dom
}

// ---------------------------------------------------------------- harvesting

/** Clip ids currently listed in the workspace pane, so we can diff after Create. */
async function listClipIds(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="/song/"]'))
      .map((a) => a.getAttribute('href').split('/song/')[1]?.split('?')[0])
      .filter(Boolean),
  )
}

async function fetchClip(page, id) {
  const res = await page.request.get(`${CLIP_API}/${id}`)
  if (!res.ok()) return { id, error: res.status() }
  const d = await res.json()
  return {
    id,
    title: d.title,
    status: d.status,
    created_at: d.created_at,
    duration: d.metadata?.duration,
    model: d.model_name,
    major_model_version: d.major_model_version,
    sliders: d.metadata?.control_sliders,
    tags: d.metadata?.tags,
    negative_tags: d.metadata?.negative_tags,
    url: `https://suno.com/song/${id}`,
  }
}

// ---------------------------------------------------------------- the run

async function run(page, job, { dry }) {
  const report = { job: job.title, startedAt: new Date().toISOString(), steps: {} }
  await openAdvanced(page)
  report.steps.model = await selectModel(page, job.model ?? 'v6')

  const before = await listClipIds(page)
  report.steps.clipsBefore = before.length

  report.steps.style = await fillStyle(page, job.style)
  log('style box:', report.steps.style.len, 'chars')

  const lyr = await fillLyrics(page, job.lyrics)
  report.steps.lyrics = lyr
  if (!lyr.ok) throw new Error(`LYRICS_MISMATCH: wrote ${lyr.wrote}, editor holds ${lyr.read}. Sample: ${lyr.sample}`)
  log('lyrics:', lyr.wrote, 'chars, verified')

  if (job.exclude) {
    const r = await page.evaluate(SET_TEXTAREA, 500, job.exclude)
    report.steps.exclude = r
    if (!r.ok) report.steps.excludeWarning = 'NO_EXCLUDE_BOX — generated without an exclude list'
    log('exclude:', r.ok ? r.len + ' chars' : 'NOT FOUND')
  }

  report.steps.styleInfluence = await setSlider(page, 'Style Influence', job.styleInfluence)
  report.steps.weirdness = await setSlider(page, 'Weirdness', job.weirdness)
  log('sliders: style', report.steps.styleInfluence, '/ weirdness', report.steps.weirdness)

  if (dry) {
    report.steps.dry = true
    log('DRY RUN — form is filled, not generating')
    return report
  }

  await page.getByRole('button', { name: /Create song/i }).click({ force: true, timeout: 15_000 })
  report.steps.submittedAt = new Date().toISOString()
  log('submitted; waiting for clips…')

  const deadline = Date.now() + GEN_TIMEOUT_MS
  let fresh = []
  while (Date.now() < deadline) {
    await page.waitForTimeout(POLL_MS)
    const now = await listClipIds(page)
    fresh = now.filter((id) => !before.includes(id))
    if (fresh.length >= 2) break
  }
  report.steps.newClipIds = fresh
  log('new clips:', fresh.join(', ') || 'none')

  report.clips = []
  for (const id of fresh) {
    let clip = await fetchClip(page, id)
    const until = Date.now() + GEN_TIMEOUT_MS
    while (clip.status !== 'complete' && Date.now() < until) {
      await page.waitForTimeout(POLL_MS * 2)
      clip = await fetchClip(page, id)
    }
    report.clips.push(clip)
    log(`  ${id} ${clip.status} ${clip.duration ?? '?'}s ${clip.url}`)
  }
  report.finishedAt = new Date().toISOString()
  return report
}

// ---------------------------------------------------------------- entrypoint

const [mode, arg] = process.argv.slice(2)
const dry = process.argv.includes('--dry')
const { browser, page } = await attach()
try {
  if (mode === 'inspect') {
    const out = await inspect(page)
    if (arg === '--models') out.models = await probeModels(page)
    console.log(JSON.stringify(out, null, 1))
  } else if (mode === 'run') {
    if (!arg) throw new Error('usage: suno-run.mjs run <job.json> [--dry]')
    const job = JSON.parse(readFileSync(resolve(arg), 'utf8'))
    const report = await run(page, job, { dry })
    const out = resolve('docs/stories/camping/songs/runs', `${job.title}.json`)
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, JSON.stringify(report, null, 2))
    log('report →', out)
  } else {
    console.error('usage: suno-run.mjs inspect | run <job.json> [--dry]')
    process.exitCode = 2
  }
} finally {
  // connectOverCDP: close() only detaches, it never kills Kai's Chrome.
  await browser.close()
}
