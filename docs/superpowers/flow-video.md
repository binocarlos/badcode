# Google Flow — image→video recipe (from the spike)

> Recorded 2026-06-25 from the first successful automated image→video generation.
> The **video** companion to [`flow-selectors.md`](./flow-selectors.md) (which covers images).
> This is the input contract the `animate-slide` skill drives. Playwright MCP attached over
> CDP to a WSLg Chromium logged into Flow (ULTRA plan).

## TL;DR — the loop that works

1. **Navigate** `https://labs.google/fx/tools/flow`; open/ensure a project
   (`button "add_2 New project"` → lands on `/fx/tools/flow/project/<uuid>`).
2. **Set video generation defaults** — agent panel `button "tune Settings"`:
   - **Video generation default** → model dropdown (`button "<model> arrow_drop_down"`) →
     pick **Veo 3.1 - Quality** (options: Omni Flash, Veo 3.1 Lite / Fast / Quality /
     Lite[Lower Priority]).
   - **Aspect**: `tab "crop_16_9 16:9"` (default) — matches the Karen comic page. Other:
     `9:16`. **This is how you pin aspect** — there is no per-prompt aspect control; it's the
     Video-generation-default tab. Count tabs `1x|x2|x3|x4` → **1x** for a single clip.
   - **Confirm before generating** is its own setting: `Always` (default) makes the agent ask
     before spending credits — a useful gate; `Never` is full-auto. **Save**.
3. **Upload the source image** — top bar `button "add Add Media"` → menuitem
   `"upload Upload media"` → a **file chooser** opens (`browser_file_upload`).
   - ⚠️ **The Playwright MCP sandboxes uploads to repo roots.** Files under `/tmp` are
     **denied** ("outside allowed roots"). Stage the source image **inside the repo** —
     e.g. `/home/kai/projects/badcode/badcode/.playwright-mcp/animate-slide/<img>` (that dir
     is git-ignored). Then upload that path.
   - Large sources (Karen's are ~5504×3072, 8 MB) upload fine but may flash a transient
     `warning Failed` / `99%` tile during thumbnail processing — it **recovers**; the image
     then appears as a media tile (`button "Generated image image <name>"`).
4. **Animate the image** — hover the uploaded tile → `button "more_vert More"` → menuitem
   **`"motion_blur Animate"`**. This attaches the image as the **source frame**: a media chip
   appears above the prompt box (`button "A piece of media generated or uploaded by you… cancel"`).
5. **Type the motion prompt** into the agent textbox (`role=textbox`, placeholder
   *"What do you want to create?"*). The `button "arrow_forward Create"` enables once text is present. Click it.
6. **Approve the credit gate** (when Confirm=Always): the agent posts *"Would you like me to
   kick off this 1 video generation, costing N credits?"* with `Approve` /
   `Approve, do not ask again` / `Reject`. Veo 3.1 Quality = **100 credits**. Click **Approve**.
7. **Wait — poll, never fixed-sleep.** Veo Quality can **queue** under load: *"Your video has
   been scheduled and is waiting in the queue due to high demand."* (a `warning Failed`-looking
   icon may show while queued — it is **not** a real failure). See "Completion signal" below.
8. **Harvest the .mp4** — same signed-URL trick as images (see "Harvest").

## Completion signal (how to know it's done) — IMPORTANT

The generated clip is a `<video>` whose `src` is an authenticated redirect
`…/media.getMediaUrlRedirect?name=<UUID>` (a sibling `…&mediaUrlType=MEDIA_URL_TYPE_THUMBNAIL`
is the poster).

**Two tempting signals that DON'T work** (confirmed on the spike):
- ❌ `video.videoWidth` — the `<video>` element is **lazy**; it stays `0×0` long after the
  clip is actually ready (it only decodes when scrolled into view / played).
- ❌ the chat text ("waiting in the queue due to high demand") — that message **persists in
  the chat transcript** even after the clip finishes, so "is the queue text gone?" is a false negative.

**The signal that works:** the `<video>`/source `name` appears in the DOM as soon as the node
is created; **resolve its media URL and check the response** — when it returns `content-type:
video/mp4` with a real byte length, it's done. Poll via `browser_run_code_unsafe`:

```js
async (page) => {
  const name = await page.evaluate(() => {
    const el = [...document.querySelectorAll('video,source,img')]
      .map(e => e.currentSrc || e.src || '')
      .find(s => s.includes('getMediaUrlRedirect') && !s.includes('THUMBNAIL'));
    return el ? new URL(el).searchParams.get('name') : null;
  });
  if (!name) return { ready: false, reason: 'no media node yet' };
  const r = await page.request.get(
    'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=' + name,
    { headers: { Range: 'bytes=0-0' } });
  const ct = r.headers()['content-type'] || '';
  return { ready: ct.startsWith('video/'), name, contentType: ct, size: r.headers()['content-range'] };
}
```

`ready: true` (content-type `video/mp4`) ⇒ harvest it. Poll every ~30–60 s; Veo Quality under
"high demand" took ~5 min on the spike. (Don't fixed-sleep a guessed duration — poll.)

## Harvest (the robust, scalable part — identical to images)

The `<video>` `src` redirect 302s to a signed CDN URL with the browser's cookies. In-page
`fetch` fails (CORS); the Playwright **request context** follows it server-side:

```js
async (page) => {
  const v = [...document.querySelectorAll('video')]
    .find(v => (v.currentSrc||v.src||'').includes('getMediaUrlRedirect'));
  const name = new URL(v.currentSrc||v.src).searchParams.get('name');
  const resp = await page.request.get(
    'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=' + name);
  return { name, url: resp.url() };   // url = signed flow-content.google CDN URL
}
```

Then `curl "<signed url>" -o clip.mp4` from the shell (no `fs` in the run_code sandbox — it has
only `page`). Confirm `file clip.mp4` → `ISO Media, MP4`. **Same mechanism as `flow-selectors.md`,
just a `<video>` source instead of an `<img>`.**

## Selectors observed (volatile — prefer roles/text over snapshot refs)

| Purpose | Locator |
| --- | --- |
| New project | `button` name *"add_2 New project"* |
| Agent settings | `button "tune Settings"` (agent panel footer) |
| Video model dropdown | `button "<model name> arrow_drop_down"` under **Video generation default** |
| Video aspect | `tab "crop_16_9 16:9"` / `tab "crop_9_16 9:16"` (Video generation default) |
| Save settings | `button "Save"` |
| Add Media | top bar `button "add Add Media"` → menuitem `"upload Upload media"` |
| Uploaded tile | `button "Generated image image <filename>"` |
| Per-asset menu | hover tile → `button "more_vert More"` |
| **Animate (image→video)** | menuitem **`"motion_blur Animate"`** |
| Source-frame chip | `button "A piece of media generated or uploaded by you… cancel"` (above prompt) |
| Prompt input | `role=textbox`, placeholder *"What do you want to create?"* |
| Submit | `button "arrow_forward Create"` (enabled once text present) |
| Credit gate | agent message + `Approve` / `Approve, do not ask again` / `Reject` |
| Completion | a `<video>` with `getMediaUrlRedirect` src and `videoWidth > 0` |

`browser_snapshot` refs (`e123`) go stale between snapshots — locate by ARIA role + accessible
name, not ref.

**Progress screenshots go in `.flow-screenshots/`.** `browser_take_screenshot` writes its
`filename` relative to the repo root, so always prefix it — e.g.
`filename: ".flow-screenshots/gen-progress.png"` — to keep these scratch captures out of the
repo root. That folder is git-ignored (only its `README.md` is committed); delete the PNGs
whenever.

## Confirmed on the first run (Karen i38 → anim/a12, 2026-06-25)

- **Clip spec:** Veo 3.1 Quality at 16:9 returned **1280×720, 24 fps, 8.0 s (192 frames),
  H.264 MP4, ~2.9 MB.** That feeds the scroll-scrubbed `AnimationWidget` cleanly (192 frames is
  plenty of scrub resolution); `assets-build` made 480p+720p renditions + a WebP poster.
- **Harvest:** the signed `flow-content.google/video/<uuid>?…Signature=…` URL `curl`s to disk
  with no cookies — identical to the image path.
- **Queue latency:** ~5 min under "high demand" for Quality.

## Still to watch (over a longer batch)

1. **Queue latency** under "high demand" for Veo Quality — minutes. Fast/Lite models queue
   less; trade quality for latency on bulk runs.
2. **Aspect** is a global default, not per-prompt — set it once per session before generating.
3. **Rate limits / credit burn** (100 credits per Quality clip).
4. **Manifest path trap** (downstream of the harvest, in the skill): `npm run --workspace
   @badcode/cli -- assets-build -m <relative>` writes the manifest relative to `packages/cli/`.
   Pass an **absolute** `-m` path. See `.claude/skills/animate-slide/SKILL.md` step 6.
