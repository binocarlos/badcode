import { chromium, type Browser, type Page } from 'playwright'
import { pickActiveCanvas } from './canvas'
import { toCanvasImgs, SCRAPE_IMGS, type RawImg } from './dom'
import { harvestToFile, contentTypeOf } from './harvest'

const FLOW_URL = 'https://labs.google/fx/tools/flow'
const DEFAULT_ENDPOINT = `http://localhost:${process.env.FLOW_CDP_PORT ?? '9222'}`
const TURN_TIMEOUT_MS = 90_000
const VIDEO_TIMEOUT_MS = 8 * 60_000
const POLL_MS = 5_000

export interface ImageResult { path: string; mediaId: string; width: number; height: number }
export interface MediaResult { path: string; mediaId: string }
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

  private async submitPrompt(prompt: string): Promise<void> {
    // The prompt box is an empty-named contenteditable; locate it by the
    // placeholder text it renders while empty (its accessible name is blank).
    const box = this.page.getByRole('textbox').filter({ hasText: /What do you want to create/i })
    await box.fill(prompt)
    // The bar has several "Create" buttons; the submit is the arrow_forward one.
    await this.page.getByRole('button', { name: /arrow_forward Create/i }).click()
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
    await this.page.getByRole('tab', { name: /image Image/i }).click()
    const oneX = this.page.getByRole('tab', { name: '1x', exact: true })
    if (await oneX.count()) await oneX.click().catch(() => {})
    await this.page.keyboard.press('Escape')
  }

  /** Poll the canvas until a media img is present, then return its name + size. */
  private async waitForActiveCanvas(timeoutMs: number): Promise<{ name: string; width: number; height: number }> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const raw = (await this.page.evaluate(`(${SCRAPE_IMGS})()`)) as RawImg[]
      const imgs = toCanvasImgs(raw)
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
    await this.submitPrompt(prompt)
    const { name, width, height } = await this.waitForActiveCanvas(TURN_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name, width, height }
  }

  /** Follow-up correction in the SAME session, then harvest the new active canvas. */
  async refine(prompt: string, outPath: string): Promise<MediaResult> {
    await this.submitPrompt(prompt)
    const { name } = await this.waitForActiveCanvas(TURN_TIMEOUT_MS)
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
