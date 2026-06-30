import { chromium, type Browser, type Page } from 'playwright'
import { pickActiveCanvas } from './canvas'
import { toCanvasImgs, SCRAPE_IMGS, type RawImg } from './dom'
import { harvestToFile, contentTypeOf } from './harvest'
import { pickProject, SCRAPE_PROJECTS, type ProjectTile } from './project'
import { batchOutPath } from './batch'

const FLOW_URL = 'https://labs.google/fx/tools/flow'
const DEFAULT_ENDPOINT = `http://localhost:${process.env.FLOW_CDP_PORT ?? '9222'}`
const TURN_TIMEOUT_MS = 90_000
const VIDEO_TIMEOUT_MS = 8 * 60_000
const POLL_MS = 5_000

export interface ImageResult { path: string; mediaId: string; width: number; height: number }
export interface MediaResult { path: string; mediaId: string }
export interface BatchItem { index: number; prompt: string; path: string; mediaId: string; width: number; height: number }
export interface FlowStatus { loggedIn: boolean; projectOpen: boolean; url: string }

export class FlowClient {
  private constructor(private browser: Browser, private page: Page) {}

  /** Attach to the already-logged-in Chrome launched by scripts/flow-chrome.sh. */
  static async connect(endpoint = DEFAULT_ENDPOINT): Promise<FlowClient> {
    const browser = await chromium.connectOverCDP(endpoint)
    const context = browser.contexts()[0]
    if (!context) throw new Error('NO_CONTEXT')
    const pages = context.pages()
    // Prefer an already-open project page; fall back to any Flow page.
    let page =
      pages.find((p) => /labs\.google\/fx\/tools\/flow\/project\//.test(p.url())) ??
      pages.find((p) => p.url().includes('labs.google/fx/tools/flow'))
    if (!page) {
      page = pages[0] ?? (await context.newPage())
      await page.goto(FLOW_URL, { waitUntil: 'domcontentloaded' })
    }
    return new FlowClient(browser, page)
  }

  async status(): Promise<FlowStatus> {
    const url = this.page.url()
    // Logged out → Flow bounces to an accounts/sign-in URL.
    const loggedIn = !/accounts\.google\.com|signin/i.test(url) && url.includes('labs.google')
    const projectOpen = /\/project\//.test(url)
    return { loggedIn, projectOpen, url }
  }

  private async ensureProject(): Promise<void> {
    if (/\/project\//.test(this.page.url())) return
    const newProject = this.page.getByRole('button', { name: /New project/i })
    await newProject.click()
    await this.page.waitForURL(/\/project\//, { timeout: TURN_TIMEOUT_MS })
  }

  async openProject(name: string): Promise<void> {
    // Always start from the projects list so the name match is honoured even if a
    // different project is already open.
    if (/\/project\//.test(this.page.url()) || !this.page.url().includes('labs.google/fx/tools/flow')) {
      await this.page.goto(FLOW_URL, { waitUntil: 'domcontentloaded' })
    }
    // The project grid hydrates AFTER domcontentloaded, so poll the scrape until the
    // named project appears rather than reading an empty list once.
    const deadline = Date.now() + TURN_TIMEOUT_MS
    let href: string | null = null
    while (Date.now() < deadline) {
      const tiles = (await this.page.evaluate(`(${SCRAPE_PROJECTS})()`)) as ProjectTile[]
      href = pickProject(tiles, name)
      if (href) break
      await this.page.waitForTimeout(POLL_MS)
    }
    if (!href) throw new Error('PROJECT_NOT_FOUND')
    // SPA-navigate by clicking the project tile. A second hard goto (list -> project)
    // races the app's hydration and tips it into its client-side error boundary.
    await this.page.locator(`a[href="${href}"]`).first().click()
    await this.page.waitForURL(/\/project\//, { timeout: TURN_TIMEOUT_MS })
    // The create bar hydrates after navigation; wait for the (enabled) prompt textbox
    // before returning so callers never interact with a half-rendered editor.
    await this.page
      .locator('div[role="textbox"][contenteditable="true"]')
      .first()
      .waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
  }

  private async submitPrompt(prompt: string): Promise<void> {
    // Confirmed live 2026-06-30: the prompt box is a contenteditable div with role="textbox"
    // and NO own placeholder text (the old hasText filter matched nothing). A sibling <textarea>
    // also exposes the textbox role, so target the contenteditable div directly.
    const box = this.page.locator('div[role="textbox"][contenteditable="true"]').first()
    await box.fill(prompt)
    // Submit is the arrow_forward button; its accessible name renders as "arrow_forwardCreate"
    // (no space) — allow optional whitespace between the icon ligature and the label.
    await this.page.getByRole('button', { name: /arrow_forward\s*Create/i }).click()
  }

  /**
   * Force the create bar into single-image mode. The bar defaults to
   * "Video · 8s"; opening the mode menu exposes an Image tab and a 1x count.
   * Idempotent — safe to call when already in image mode.
   */
  private async ensureImageMode(): Promise<void> {
    // The mode/config button is the only create-bar button whose label carries
    // an aspect-ratio icon ("crop_…"); open its menu.
    await this.page.getByRole('button', { name: /crop_/ }).first().click()
    // The tab's accessible name concatenates the icon ligature with the label, no space.
    await this.page.getByRole('tab', { name: /image\s*Image/i }).click()
    const oneX = this.page.getByRole('tab', { name: '1x', exact: true })
    if (await oneX.count()) await oneX.click().catch(() => {})
    await this.page.keyboard.press('Escape')
  }

  /** Snapshot the media UUIDs currently on the canvas, so a later turn can detect new ones. */
  private async snapshotMediaNames(): Promise<Set<string>> {
    const raw = (await this.page.evaluate(`(${SCRAPE_IMGS})()`)) as RawImg[]
    return new Set(toCanvasImgs(raw).map((i) => i.name))
  }

  /**
   * Poll until a media img appears whose UUID was NOT present in `before`, then return the
   * largest such image. Each Flow turn yields a fresh UUID, so comparing against the pre-submit
   * snapshot is what distinguishes a new generation from the previous (still on-canvas) image —
   * waiting for "any image" would harvest the stale previous frame on refine/batch turns.
   */
  private async waitForNewCanvas(
    before: Set<string>,
    timeoutMs: number,
  ): Promise<{ name: string; width: number; height: number }> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const raw = (await this.page.evaluate(`(${SCRAPE_IMGS})()`)) as RawImg[]
      const imgs = toCanvasImgs(raw).filter((i) => !before.has(i.name))
      const name = pickActiveCanvas(imgs)
      if (name) {
        const hit = imgs.find((i) => i.name === name)!
        return { name, width: Math.round(hit.width), height: Math.round(hit.height) }
      }
      await this.page.waitForTimeout(POLL_MS)
    }
    throw new Error('TIMEOUT')
  }

  async generateImage(prompt: string, outPath: string): Promise<ImageResult> {
    await this.ensureProject()
    await this.ensureImageMode()
    const before = await this.snapshotMediaNames()
    await this.submitPrompt(prompt)
    const { name, width, height } = await this.waitForNewCanvas(before, TURN_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name, width, height }
  }

  async generateBatch(prompts: string[], outDir: string): Promise<BatchItem[]> {
    await this.ensureProject()
    await this.ensureImageMode()
    const items: BatchItem[] = []
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i]!
      const before = await this.snapshotMediaNames()
      await this.submitPrompt(prompt)
      const { name, width, height } = await this.waitForNewCanvas(before, TURN_TIMEOUT_MS)
      const path = batchOutPath(outDir, i)
      await harvestToFile(this.page.request, name, path)
      items.push({ index: i, prompt, path, mediaId: name, width, height })
    }
    return items
  }

  /** Follow-up correction in the SAME session, then harvest the new active canvas. */
  async refine(prompt: string, outPath: string): Promise<MediaResult> {
    const before = await this.snapshotMediaNames()
    await this.submitPrompt(prompt)
    const { name } = await this.waitForNewCanvas(before, TURN_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name }
  }

  async generateVideo(
    imagePath: string,
    motion: string,
    outPath: string,
    _model?: string,
  ): Promise<MediaResult> {
    await this.ensureProject()
    // Upload the source frame via Add Media → file chooser.
    const chooser = this.page.waitForEvent('filechooser')
    await this.page.getByRole('button', { name: /Add Media/i }).click()
    await (await chooser).setFiles(imagePath)
    // Attach as animation source, then prompt + create. (See flow-video.md.)
    await this.submitPrompt(motion)
    // Video is ready when the media's content-type is video/*.
    const name = await this.waitForVideo(VIDEO_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name }
  }

  private async waitForVideo(timeoutMs: number): Promise<string> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const raw = (await this.page.evaluate(`(${SCRAPE_IMGS})()`)) as RawImg[]
      const name = pickActiveCanvas(toCanvasImgs(raw))
      if (name) {
        const ct = await contentTypeOf(this.page.request, name)
        if (ct.startsWith('video/')) return name
      }
      await this.page.waitForTimeout(POLL_MS)
    }
    throw new Error('TIMEOUT')
  }

  async close(): Promise<void> {
    await this.browser.close()
  }
}
