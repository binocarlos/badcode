import { basename } from 'node:path'
import { chromium, type Browser, type Locator, type Page } from 'playwright'
import { collectNewCanvases, pickActiveCanvas, type CanvasImg } from './canvas'
import { toCanvasImgs, SCRAPE_IMGS, type RawImg } from './dom'
import { harvestToFile, contentTypeOf } from './harvest'
import { pickProject, SCRAPE_PROJECTS, type ProjectTile } from './project'
import { batchOutPath } from './batch'
import { candidateOutPath } from './candidates'

const FLOW_URL = 'https://labs.google/fx/tools/flow'
const DEFAULT_ENDPOINT = `http://localhost:${process.env.FLOW_CDP_PORT ?? '9222'}`
const TURN_TIMEOUT_MS = 90_000
const VIDEO_TIMEOUT_MS = 8 * 60_000
// Image/grid polls are cheap in-page DOM scrapes, so poll fast (~1s of discovery latency).
const POLL_MS = 1_000
// The video poll additionally makes a content-type HTTP request per candidate media, so keep it
// a touch slower to stay polite to Flow's media endpoint over the minutes-long generation wait.
const VIDEO_POLL_MS = 3_000

export interface ImageResult { path: string; mediaId: string; width: number; height: number }
export interface EditResult { candidates: ImageResult[]; partial?: boolean }
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
    await newProject.click({ force: true })
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
    await this.page.locator(`a[href="${href}"]`).first().click({ force: true })
    await this.page.waitForURL(/\/project\//, { timeout: TURN_TIMEOUT_MS })
    // The create bar hydrates after navigation; wait for the (enabled) prompt textbox
    // before returning so callers never interact with a half-rendered editor.
    await this.page
      .locator('div[role="textbox"][contenteditable="true"]')
      .first()
      .waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
  }

  // --- Click hardening (mapped live 2026-07-14, flow-selectors.md "Click reliability on WSLg") ---
  // Playwright's actionability "stable" check stalls on this UI (persistent animation) and
  // trusted CDP pointer input can silently miss, so each control type gets the recipe that
  // actually fires its handler. A bare click with default actionability is banned in this file.

  /**
   * Plain React buttons (submit, Upload media, Add to Prompt): in-page native el.click().
   * Coordinate-based clicks (even force:true) are untrustworthy on this rig — the WSLg
   * window's input pipeline scales coordinates, so pointer clicks can land on the wrong
   * element entirely (observed live 2026-07-14: a force-click on "Add to Prompt" hit
   * "Upload media" and opened a second file chooser).
   */
  private async forceClick(locator: Locator): Promise<void> {
    await locator.evaluate((el) => (el as HTMLElement).click())
  }

  /** Radix menu/dialog triggers (crop_ config, add_2 picker): synthetic pointer sequence. */
  private async pointerClick(locator: Locator): Promise<void> {
    await locator.evaluate((el) => {
      const opts: PointerEventInit = { bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1 }
      el.dispatchEvent(new PointerEvent('pointerdown', opts))
      el.dispatchEvent(new PointerEvent('pointerup', { ...opts, buttons: 0 }))
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }))
    })
  }

  /** Radix tabs (Image / aspect / count / picker tabs): focus + mouse sequence selects. */
  private async tabClick(locator: Locator): Promise<void> {
    await locator.evaluate((el) => {
      ;(el as HTMLElement).focus()
      for (const type of ['mousedown', 'mouseup', 'click'] as const) {
        el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0 }))
      }
    })
  }

  private promptBox(): Locator {
    // Confirmed live 2026-06-30: the prompt box is a contenteditable div with role="textbox"
    // and NO own placeholder text. A sibling <textarea> also exposes the textbox role.
    return this.page.locator('div[role="textbox"][contenteditable="true"]').first()
  }

  private async clickSubmit(): Promise<void> {
    // Accessible name renders as "arrow_forwardCreate" (no space). The button enables
    // asynchronously after the prompt fills — a click while it is still disabled is silently
    // swallowed (observed live 2026-07-14), so wait for enabled, click, and VERIFY the box
    // cleared (Flow empties the prompt on a successful submit); retry with Enter if not.
    const submit = this.page.getByRole('button', { name: /arrow_forward\s*Create/i }).first()
    const box = this.promptBox()
    const deadline = Date.now() + TURN_TIMEOUT_MS
    while (Date.now() < deadline) {
      if (await submit.isEnabled().catch(() => false)) break
      await this.page.waitForTimeout(250)
    }
    const boxCleared = async (): Promise<boolean> => {
      const text = ((await box.textContent()) ?? '')
        .replace(/[\u200B\uFEFF]/g, '')
        .replace('What do you want to create?', '')
        .trim()
      return text === ''
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt === 0) await this.forceClick(submit)
      else {
        await box.evaluate((el) => (el as HTMLElement).focus())
        await this.page.keyboard.press('Enter')
      }
      const settle = Date.now() + 5_000
      while (Date.now() < settle) {
        if (await boxCleared()) return
        await this.page.waitForTimeout(300)
      }
      // box still holds the prompt — submission didn't fire; try the next mechanism
    }
    throw new Error('SUBMIT_FAILED')
  }

  private async submitPrompt(prompt: string): Promise<void> {
    // Media-reference chips live OUTSIDE the contenteditable and survive fill(); only inline
    // character chips forbid it (submitWithCharacter appends instead).
    await this.promptBox().fill(prompt)
    await this.clickSubmit()
  }

  /**
   * Force the create bar into image mode at the requested output count (1–4).
   * Idempotent — when the config trigger's label already shows the target state
   * the menu is not even opened, which keeps repeat calls in an edit loop cheap.
   */
  private async ensureImageMode(count = 1): Promise<void> {
    // Wait for the create bar to hydrate (it renders after navigation).
    await this.promptBox().waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    // The bar toggles between "Agent" (conversational) and direct generation; the image config
    // (the "crop_…" button) only exists in generation mode. If it isn't showing we're in Agent
    // mode — click the Agent toggle to leave it. (Gating on crop_'s presence is more reliable
    // than reading the toggle's aria-pressed, which lags after navigation.)
    const crop = this.page.getByRole('button', { name: /crop_/ }).first()
    if (!(await crop.count())) {
      const agent = this.page.getByRole('button', { name: 'Agent', exact: true })
      if (await agent.count()) await this.forceClick(agent)
    }
    await crop.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    // Count tabs are named `1x` for one output and `x2`/`x3`/`x4` beyond (mapped live 2026-07-14).
    const countTab = count <= 1 ? '1x' : `x${count}`
    // Short-circuit: the trigger label concatenates model+aspect+count ("🍌 Nano Banana 2crop_16_91x").
    const label = ((await crop.textContent()) ?? '').trim()
    if (/Nano Banana/i.test(label) && label.endsWith(countTab)) return
    // Open the config menu — a Radix trigger; needs the synthetic pointer sequence.
    await this.pointerClick(crop)
    const imageTab = this.page.getByRole('tab', { name: /image\s*Image/i })
    await imageTab.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    await this.tabClick(imageTab)
    const countLocator = this.page.getByRole('tab', { name: countTab, exact: true })
    if (await countLocator.count()) await this.tabClick(countLocator)
    // Escape closes the menu; the selection sticks (verified live 2026-07-14).
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

  /**
   * Poll until `expected` fresh media UUIDs appear. Multi-output turns land their
   * candidates staggered (observed skew ≈ 9–15 s), so after the first arrival keep
   * polling for a grace window rather than the full turn timeout. Returns what
   * arrived (≥1) — the caller decides whether fewer than expected is `partial`.
   */
  private async waitForNewCanvases(
    before: Set<string>,
    expected: number,
    timeoutMs: number,
    graceMs = 30_000,
  ): Promise<CanvasImg[]> {
    const deadline = Date.now() + timeoutMs
    let graceDeadline = Number.POSITIVE_INFINITY
    const found = new Map<string, CanvasImg>()
    while (Date.now() < Math.min(deadline, graceDeadline)) {
      const raw = (await this.page.evaluate(`(${SCRAPE_IMGS})()`)) as RawImg[]
      for (const im of collectNewCanvases(toCanvasImgs(raw), before)) {
        const prev = found.get(im.name)
        if (!prev || im.width * im.height > prev.width * prev.height) found.set(im.name, im)
      }
      if (found.size >= expected) break
      if (found.size > 0 && graceDeadline === Number.POSITIVE_INFINITY) graceDeadline = Date.now() + graceMs
      await this.page.waitForTimeout(POLL_MS)
    }
    if (found.size === 0) throw new Error('TIMEOUT')
    return [...found.values()].map((im) => ({ name: im.name, width: Math.round(im.width), height: Math.round(im.height) }))
  }

  /** Harvest each canvas to its candidate path (suffixed -a/-b… when numOutputs > 1). */
  private async harvestCandidates(canvases: CanvasImg[], outPath: string, numOutputs: number): Promise<ImageResult[]> {
    const out: ImageResult[] = []
    for (let i = 0; i < canvases.length; i++) {
      const c = canvases[i]!
      const path = candidateOutPath(outPath, i, numOutputs)
      await harvestToFile(this.page.request, c.name, path)
      out.push({ path, mediaId: c.name, width: c.width, height: c.height })
    }
    return out
  }

  async generateImage(
    prompt: string,
    outPath: string,
    opts?: { character?: string; numOutputs?: number },
  ): Promise<ImageResult & { candidates?: ImageResult[]; partial?: boolean }> {
    const numOutputs = opts?.numOutputs ?? 1
    await this.ensureProject()
    await this.ensureImageMode(numOutputs)
    const before = await this.snapshotMediaNames()
    if (opts?.character) await this.submitWithCharacter(opts.character, prompt)
    else await this.submitPrompt(prompt)
    const canvases = await this.waitForNewCanvases(before, numOutputs, TURN_TIMEOUT_MS)
    const candidates = await this.harvestCandidates(canvases, outPath, numOutputs)
    if (numOutputs === 1) return candidates[0]!
    return { ...candidates[0]!, candidates, ...(canvases.length < numOutputs ? { partial: true } : {}) }
  }

  /**
   * Edit an existing image: attach the reference file(s) as prompt ingredients (the
   * create-bar "Add" asset picker, mapped live 2026-07-14), apply the delta prompt,
   * and harvest all fresh candidates. References should be the ORIGINAL/golden image,
   * not a previous edit output — chained edits accumulate artifacts.
   */
  async editImage(
    prompt: string,
    referenceImages: string[],
    outPath: string,
    opts?: { numOutputs?: number; character?: string },
  ): Promise<EditResult> {
    const numOutputs = opts?.numOutputs ?? 2
    await this.ensureProject()
    await this.ensureImageMode(numOutputs)
    await this.attachReferences(referenceImages)
    if (opts?.character) await this.addCharacterToPrompt(opts.character)
    // Snapshot AFTER attaching: the uploads themselves land in the media grid as new UUIDs.
    const before = await this.snapshotMediaNames()
    const box = this.promptBox()
    if (opts?.character) {
      // An inline character chip is now in the box — append, never fill().
      await box.evaluate((el) => (el as HTMLElement).focus())
      await this.page.keyboard.press('End')
      await this.page.keyboard.type(` ${prompt}`)
    } else {
      await box.fill(prompt) // media chips live outside the box and survive fill()
    }
    await this.clickSubmit()
    const canvases = await this.waitForNewCanvases(before, numOutputs, TURN_TIMEOUT_MS)
    const candidates = await this.harvestCandidates(canvases, outPath, numOutputs)
    return { candidates, ...(canvases.length < numOutputs ? { partial: true } : {}) }
  }

  /**
   * Open the create-bar asset picker (the `add_2 Create` trigger; `@` in the box opens the
   * same dialog). Mapped live 2026-07-14: a dialog with a project dropdown, tabs
   * All/Images/Videos/Voices/Characters/Uploads, an "upload Upload media" button and a
   * searchable asset grid. Resolves once the dialog's Upload button is visible.
   */
  private async openAssetPicker(): Promise<Locator> {
    const trigger = this.page.getByRole('button', { name: /add_2\s*Create/i }).first()
    await trigger.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    const dialog = this.page.getByRole('dialog').last()
    const uploadBtn = dialog.getByRole('button', { name: /upload\s*Upload media/i })
    // Native click opens this trigger (proven live on a fresh CDP connection); the synthetic
    // pointer sequence only works once the dialog has mounted before. Try native, then fall back.
    await this.forceClick(trigger)
    try {
      await uploadBtn.waitFor({ state: 'visible', timeout: 5_000 })
    } catch {
      await this.pointerClick(trigger)
      await uploadBtn.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    }
    return dialog
  }

  /** Close the asset picker if it is still open (Add to Prompt usually closes it). */
  private async closeAssetPicker(): Promise<void> {
    const dialog = this.page.getByRole('dialog').last()
    try {
      await dialog.waitFor({ state: 'hidden', timeout: 2_000 })
    } catch {
      await this.page.keyboard.press('Escape')
    }
  }

  /**
   * Attach local image file(s) to the prompt as ingredient references. Each upload lands
   * selected in the picker with an "Add to Prompt" button; the resulting media chip sits
   * OUTSIDE the contenteditable (probe it via the img alt — the accessible name comes from
   * the alt text "A piece of media generated or uploaded by you…").
   */
  private async attachReferences(refPaths: string[]): Promise<void> {
    const chip = this.page.locator('button:has(img[alt*="piece of media"])')
    const base = await chip.count() // pre-existing chips (e.g. left over on the bar) don't count
    for (let i = 0; i < refPaths.length; i++) {
      const ref = refPaths[i]!
      await this.openAssetPicker()
      // Upload by setting the page's persistent hidden file input directly — NO file chooser.
      // waitForEvent('filechooser') breaks when another Playwright client (e.g. the Playwright
      // MCP) is attached to the same Chrome with chooser interception armed (observed live
      // 2026-07-14: the chooser hangs open and the upload never lands).
      const fileInput = this.page.locator('input[type="file"][accept*="image"]').first()
      await fileInput.setInputFiles(ref)
      // The uploaded asset lands in the picker (Recent-first) named after the file; select it
      // if it isn't auto-selected, then attach. Match page-globally and case-insensitively:
      // the picker has two layout variants ("Add to Prompt" dialog / "Add to prompt" compact
      // popover) and stale dialog containers can outlive their content (observed 2026-07-14).
      const tile = this.page.locator(`[role="dialog"] img[alt="${basename(ref)}"]`).first()
      const addToPrompt = this.page.getByRole('button', { name: /add to prompt/i }).first()
      await tile.or(addToPrompt).first().waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
      if (!(await addToPrompt.isVisible().catch(() => false))) await this.forceClick(tile)
      await addToPrompt.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
      await this.forceClick(addToPrompt)
      try {
        await chip.nth(base + i).waitFor({ state: "visible", timeout: 10_000 })
      } catch {
        // One retry — the first click occasionally lands on a picker mid-render.
        await this.forceClick(addToPrompt)
        await chip.nth(base + i).waitFor({ state: "visible", timeout: TURN_TIMEOUT_MS })
      }
      await this.closeAssetPicker()
    }
  }

  /**
   * Cast a project Character into the next generation via the unified asset picker
   * (the 2026-06-30 `role="option"` flow is gone — UI update mapped 2026-07-14):
   * picker → Characters tab → select the named tile → Add to Prompt. The character chip
   * is INLINE in the contenteditable, so callers must APPEND prompt text afterwards.
   */
  private async addCharacterToPrompt(name: string): Promise<void> {
    const dialog = await this.openAssetPicker()
    const charactersTab = dialog.getByRole('tab', { name: /Characters/i })
    await charactersTab.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    await this.tabClick(charactersTab)
    // Select the tile carrying the character's name, then attach it.
    const tile = dialog.getByText(name, { exact: true }).first()
    await tile.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    await this.forceClick(tile)
    const addToPrompt = this.page.getByRole('button', { name: /add to prompt/i }).first()
    await addToPrompt.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    await this.forceClick(addToPrompt)
    await this.closeAssetPicker()
  }

  /** Character cast + scene text + submit (append after the inline chip — fill() wipes it). */
  private async submitWithCharacter(name: string, prompt: string): Promise<void> {
    await this.addCharacterToPrompt(name)
    const box = this.promptBox()
    await box.evaluate((el) => (el as HTMLElement).focus())
    await this.page.keyboard.press('End')
    await this.page.keyboard.type(` ${prompt}`)
    await this.clickSubmit()
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
    await this.page.getByRole('button', { name: /accessibility_new\s*Characters/i }).click({ force: true })
    // "New Character" is a clickable card (a div with an icon ligature), not a <button>.
    await this.page.getByText('New Character', { exact: true }).first().click({ force: true })
    await this.page.waitForURL(/\/characters\b/, { timeout: TURN_TIMEOUT_MS })
    // Upload the reference(s); the file chooser accepts the array.
    const chooser = this.page.waitForEvent('filechooser')
    await this.page.getByRole('button', { name: /upload\s*Upload/i }).first().click({ force: true })
    await (await chooser).setFiles(refImages)
    // After upload the character editor opens with a "Character Name" field defaulting to
    // "Untitled Character"; set it, then finalize.
    const nameInput = this.page.locator('input[placeholder="Character Name"]')
    await nameInput.waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    await nameInput.fill(name)
    await this.page.getByRole('button', { name: /^Done$/ }).click({ force: true })
    // Done returns to the project root (leaves /character/<id>).
    await this.page.waitForURL((u) => /\/project\/[0-9a-f-]+$/.test(u.toString()), {
      timeout: TURN_TIMEOUT_MS,
    })
    return { name }
  }

  /**
   * Animate a still into an image→video clip (Veo). Mapped live 2026-06-30 + flow-video.md:
   * Add Media → "Upload media" (file chooser) → the uploaded tile's more_vert → "Animate"
   * (attaches the source frame and switches the bar to Video mode) → motion prompt → submit →
   * approve the credit gate if shown → poll for the new video media and harvest the .mp4.
   */
  async generateVideo(
    imagePath: string,
    motion: string,
    outPath: string,
    _model?: string,
  ): Promise<MediaResult> {
    await this.ensureProject()
    // 1. Upload the source frame.
    await this.page.getByRole('button', { name: /add\s*Add Media/i }).click({ force: true })
    const chooser = this.page.waitForEvent('filechooser')
    await this.page.getByRole('menuitem', { name: /upload\s*Upload media/i }).click({ force: true })
    await (await chooser).setFiles(imagePath)
    // 2. Attach it as the animation source.
    await this.openAnimateMenu()
    // 3. Motion prompt + submit (capture the pre-submit media set to detect the new clip).
    const before = new Set(await this.scrapeMediaNames())
    await this.submitPrompt(motion)
    // 4. Approve the credit gate if Flow posts one (Veo Quality = 100 credits).
    await this.approveCreditGateIfPresent()
    // 5. Poll for the new video media and harvest.
    const name = await this.waitForVideoClip(before, VIDEO_TIMEOUT_MS)
    await harvestToFile(this.page.request, name, outPath)
    return { path: outPath, mediaId: name }
  }

  /**
   * Open the "Animate" action on an uploaded still. Media tiles only reveal their more_vert on
   * hover, and a media-rich project has several "Generated image" tiles (including video posters
   * whose menu has no Animate), so hover each tile, click the revealed more_vert, and accept the
   * first whose menu exposes Animate.
   *
   * NOTE (2026-06-30): the end-to-end image→video flow is PROVEN (a real .mp4 was generated and
   * harvested through this exact path), but this tile-targeting step has only been hardened, not
   * re-validated clean against a media-cluttered project — see docs/superpowers/flow-video.md.
   */
  private async openAnimateMenu(): Promise<void> {
    const tiles = this.page.locator('img[alt="Generated image"]')
    await tiles.first().waitFor({ state: 'visible', timeout: TURN_TIMEOUT_MS })
    const n = await tiles.count()
    for (let i = 0; i < n; i++) {
      await tiles.nth(i).hover()
      const more = this.page
        .locator('button:has-text("more_vert"):near(img[alt="Generated image"])')
        .first()
      if (!(await more.count())) continue
      await more.click({ force: true })
      const animate = this.page.getByRole('menuitem', { name: /motion_blur\s*Animate/i })
      if (await animate.count()) {
        await animate.click({ force: true })
        return
      }
      await this.page.keyboard.press('Escape') // wrong tile (e.g. a video) — close and try the next
    }
    throw new Error('ANIMATE_NOT_FOUND')
  }

  /** Media UUIDs from <video>/<source>/<img> nodes carrying a non-thumbnail getMediaUrlRedirect src. */
  private static readonly SCRAPE_MEDIA_NAMES = `() => {
    const names = []
    for (const el of document.querySelectorAll('video, source, img')) {
      const s = el.currentSrc || el.src || el.getAttribute('src') || ''
      if (s.includes('getMediaUrlRedirect') && !s.includes('THUMBNAIL')) {
        try { const n = new URL(s, location.href).searchParams.get('name'); if (n) names.push(n) } catch (e) {}
      }
    }
    return names
  }`

  private async scrapeMediaNames(): Promise<string[]> {
    return (await this.page.evaluate(`(${FlowClient.SCRAPE_MEDIA_NAMES})()`)) as string[]
  }

  /** Click the credit-confirmation "Approve" if Flow posts one; no-op if there is no gate. */
  private async approveCreditGateIfPresent(timeoutMs = 20_000): Promise<void> {
    const approve = this.page.getByRole('button', { name: /^Approve$/ }).first()
    try {
      await approve.waitFor({ state: 'visible', timeout: timeoutMs })
      await approve.click({ force: true })
    } catch {
      // No gate (Confirm=Never / direct generation) — nothing to approve.
    }
  }

  /** Poll for a media name not present pre-submit whose content-type is video/*; retry a transient gate. */
  private async waitForVideoClip(before: Set<string>, timeoutMs: number): Promise<string> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      // A genuine failure re-posts the gate ("Oops, something went wrong") — re-approve to retry.
      if (await this.page.getByText(/Oops, something went wrong/i).count()) {
        await this.approveCreditGateIfPresent(5_000)
      }
      for (const n of await this.scrapeMediaNames()) {
        if (before.has(n)) continue
        const ct = await contentTypeOf(this.page.request, n)
        if (ct.startsWith('video/')) return n
      }
      await this.page.waitForTimeout(VIDEO_POLL_MS)
    }
    throw new Error('TIMEOUT')
  }

  /** Whether the cached CDP attachment (and its page) is still usable. */
  isAlive(): boolean {
    return this.browser.isConnected() && !this.page.isClosed()
  }

  async close(): Promise<void> {
    await this.browser.close()
  }
}
