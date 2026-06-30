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
export interface CharacterRef { name: string }
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
    // Wait for the create bar to hydrate (it renders after navigation).
    await this.page
      .locator('div[role="textbox"][contenteditable="true"]')
      .first()
      .waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    // The bar toggles between "Agent" (conversational) and direct generation; the image config
    // (the "crop_…" button) only exists in generation mode. If it isn't showing we're in Agent
    // mode — click the Agent toggle to leave it. (Gating on crop_'s presence is more reliable
    // than reading the toggle's aria-pressed, which lags after navigation.)
    const crop = this.page.getByRole('button', { name: /crop_/ }).first()
    if (!(await crop.count())) {
      const agent = this.page.getByRole('button', { name: 'Agent', exact: true })
      if (await agent.count()) await agent.click()
    }
    // Open the config menu (auto-waits for crop_ to appear after any mode switch).
    await crop.click()
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

  async generateImage(
    prompt: string,
    outPath: string,
    opts?: { character?: string },
  ): Promise<ImageResult> {
    await this.ensureProject()
    await this.ensureImageMode()
    const before = await this.snapshotMediaNames()
    if (opts?.character) await this.submitWithCharacter(opts.character, prompt)
    else await this.submitPrompt(prompt)
    const { name, width, height } = await this.waitForNewCanvas(before, TURN_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name, width, height }
  }

  /**
   * Cast a project Character into the next generation. Mapped live 2026-06-30: type "@" to open
   * the asset picker, select the "<Name> — Character" option, "Add to Prompt" (which inserts an
   * inline character-reference chip), then APPEND the scene text after the chip and submit.
   * The scene text must be appended, not filled — `fill()` would clear the chip and lose the
   * reference (a plain "@Name" typed as text does NOT bind the character).
   */
  private async submitWithCharacter(name: string, prompt: string): Promise<void> {
    const box = this.page.locator('div[role="textbox"][contenteditable="true"]').first()
    await box.click()
    await box.pressSequentially('@')
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    await this.page
      .getByRole('option', { name: new RegExp(`${esc}\\s*Character`, 'i') })
      .first()
      .click()
    await this.page.getByRole('button', { name: /Add to Prompt/i }).click()
    // Move to the end of the chip and append the scene text (fill() would wipe the chip).
    await box.click()
    await this.page.keyboard.press('End')
    await this.page.keyboard.type(` ${prompt}`)
    await this.page.getByRole('button', { name: /arrow_forward\s*Create/i }).click()
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

  /**
   * Create a reusable, castable Flow Character from one or more reference images.
   * Mapped live 2026-06-30: Characters sidebar -> "New Character" card -> Upload (file chooser)
   * -> fill "Character Name" -> Done. Returns once the character editor is left.
   */
  async createCharacter(name: string, refImages: string[]): Promise<CharacterRef> {
    await this.ensureProject()
    await this.page.getByRole('button', { name: /accessibility_new\s*Characters/i }).click()
    // "New Character" is a clickable card (a div with an icon ligature), not a <button>.
    await this.page.getByText('New Character', { exact: true }).first().click()
    await this.page.waitForURL(/\/characters\b/, { timeout: TURN_TIMEOUT_MS })
    // Upload the reference(s); the file chooser accepts the array.
    const chooser = this.page.waitForEvent('filechooser')
    await this.page.getByRole('button', { name: /upload\s*Upload/i }).first().click()
    await (await chooser).setFiles(refImages)
    // After upload the character editor opens with a "Character Name" field defaulting to
    // "Untitled Character"; set it, then finalize.
    const nameInput = this.page.locator('input[placeholder="Character Name"]')
    await nameInput.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    await nameInput.fill(name)
    await this.page.getByRole('button', { name: /^Done$/ }).click()
    // Done returns to the project root (leaves /character/<id>).
    await this.page.waitForURL((u) => /\/project\/[0-9a-f-]+$/.test(u.toString()), {
      timeout: TURN_TIMEOUT_MS,
    })
    return { name }
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
