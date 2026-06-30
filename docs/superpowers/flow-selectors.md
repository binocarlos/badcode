# Google Flow — UI recipe + automation map (from the spike)

> Recorded 2026-06-25 from the first successful automated generation+harvest.
> This is the input contract for hardening the loop into `badcode flow`.
> Driven by Playwright MCP attached over CDP to a WSLg Chromium logged into Flow.

## TL;DR — the loop that works

1. **Navigate** `https://labs.google/fx/tools/flow`.
2. **Open/ensure a project** — projects page has `button "add_2 New project"`; opening it
   lands on `/fx/tools/flow/project/<uuid>` with the editor.
3. **Type the prompt** into the agent textbox (`role=textbox`, placeholder
   *"What do you want to create?"*).
4. **Submit** — `button "arrow_forward Create"` (disabled until text is present).
5. **Wait** for the assistant turn to finish (a new assistant paragraph + a
   `button "Generated image"` appears in the canvas).
6. **Harvest the image without the UI** (see "Download mechanism" — the important bit).
7. Optionally `badcode push` the harvested file to the bucket.

## Key findings that change the original spec

- **Flow is now AGENT-DRIVEN, not a prompt+refs+Generate form.** You converse with an
  assistant ("Hi Jack, what would you like to do?"). A plain natural-language
  "Generate a single image: <scene>" works and produces an image directly.
- **One image per request, not N candidates.** The spec's "best of N" selection model
  does not match Flow's image agent. The real loop is **generate → judge → if weak,
  send a follow-up correction in the same session** (the agent keeps context and can
  "adjust the composition / explore a different time of day"). Selection becomes
  iterative refinement, not pick-from-grid.
- **References/consistency are first-class via the left sidebar**, not file inputs on the
  prompt: `Characters` (`button "accessibility_new Characters"`), `Add Media`
  (`button "add Add Media"`), `Scenes`, `Tools`. The plan's `flow-prep` (download refs
  to disk) is still useful, but attachment is via **Add Media upload / Characters**, and
  `browser_file_upload` (Playwright) handles the OS picker. Reference workflow still
  needs its own spike.
- **Account is on the ULTRA plan** — full model access.
- Built-in agentic modes exist: **"Make a Story"** and **"Develop a storyboard"** — Flow
  itself can storyboard. Worth evaluating whether to lean on it or drive frame-by-frame.

## Download mechanism (the robust, scalable part)

The generated `<img>`'s `src` is an **authenticated, same-origin redirect**:

```
https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=<MEDIA_UUID>
```

- In-page `fetch()` of it **fails** (CORS/CSP — it 302s to a cross-origin CDN host).
- The Playwright **request context** (`page.request.get(url)`) follows the redirect with
  the browser's cookies, server-side, and exposes the final URL via `resp.url()`:

```
https://flow-content.google/image/<MEDIA_UUID>?Expires=<ts>&KeyName=labs-flow-prod-cdn-key&Signature=<sig>
```

- That final URL is a **signed CDN URL — publicly fetchable without cookies** until
  `Expires`. So the harvest is: read `name` from the img src → resolve via
  `page.request` → `curl` the signed URL to disk. No download button, no file-chooser,
  no image bytes through the model's context.

Worked example (JPEG, 1376×768, ~868 KB):
`browser_run_code_unsafe` returns `resp.url()`; shell `curl "<signed>" -o frame.jpg`.

### run_code sandbox limits (important for hardening)
`browser_run_code_unsafe` runs in a VM sandbox: **no `require`, no dynamic `import`, no
`fs`.** It only has `page`. So it can resolve/return the signed URL (and could return
base64, but don't — it bloats context). Do the actual file write in the **deterministic
`badcode flow` command** using the Playwright *library* (full Node, `fs` available), or
`curl` from the shell as above.

## Selectors observed (volatile — prefer roles/text over refs)

| Purpose | Locator |
| --- | --- |
| New project | `button` name *"add_2 New project"* |
| Prompt input | `textbox`, placeholder *"What do you want to create?"* |
| Submit | `button` name *"arrow_forward Create"* (enabled once text present) |
| Generated image (canvas) | `button "Generated image"` → child `img[alt="Generated image"]` |
| Image media id | `img.src` query param `name=<uuid>` |
| Sidebar: Characters | `button "accessibility_new Characters"` |
| Sidebar: Add Media | `button "add Add Media"` |
| Sidebar: Scenes | `button "movie View scenes"` |
| Completion signal | new assistant `paragraph` in session + `button "Generated image"` present |

Refs (`e123`) from `browser_snapshot` are per-snapshot and **go stale** — in the hardened
command, locate by ARIA role + accessible name/placeholder, not ref.

## Character consistency — SOLVED (2026-06-30, camping-v2)

Casting a Flow Character into a generation works via the **`@` asset picker**, not
prose:

1. Create the Character once: sidebar **Characters → New Character → Upload** the
   canon sheet → name it → **Done**. Characters are project-scoped but castable by
   `@tag`.
2. In the prompt box, type **`@`** → an asset-picker `dialog` opens listing project
   assets; the character shows as an `option` *"<Name> — Character"*. Select it →
   **"Add to Prompt"** button. A **character reference chip** attaches to the bar
   (`button "Character reference image …"`), and generation uses the real face.
3. Type the scene text after the chip, set Image mode, submit, harvest as usual.

**Plain `@Name` typed as text does NOT bind the character** — it yields a generic
person. The reference attachment is what binds it (camping-v2 p03: text → generic
financier; reference → the real Tarquin). `flow_generate_image` only fills text, so
character panels need the reference attached via the UI (Playwright) for now.

## Hardening — confirmed live 2026-06-30 (flow-script-hardening branch)

Live-validated `@badcode/flow-mcp` against camping-v2 (`/project/9b729074…`): `openProject`,
`generateImage`, `refine`, `generateBatch` all proven end-to-end with real harvested frames.
Key corrections to the spike-era selectors above:

- **Accessible names concatenate the Material-icon ligature with the label, with NO space.**
  `getByRole` matches the *accessible name*, so the submit button is `arrow_forwardCreate`
  (not `arrow_forward Create`) and the image tab is `imageImage`. Use `/arrow_forward\s*Create/i`,
  `/image\s*Image/i`, etc. — a literal space in the regex matches nothing. This was the hidden
  root cause that made the spike-era selectors untrustworthy.
- **Submit** = `getByRole('button', { name: /arrow_forward\s*Create/i })` (disabled until the box
  has text; a separate `add_2Create` button exists — the `arrow_forward` prefix disambiguates).
- **Prompt box** = `page.locator('div[role="textbox"][contenteditable="true"]').first()`, which has
  NO own placeholder text — the old `.filter({ hasText: /What do you want to create/i })` matched
  nothing. A sibling `<textarea>` also exposes the textbox role.
- **Image-mode menu**: open via `getByRole('button', { name: /crop_/ })` (the
  `🍌 Nano Banana 2 · crop_16_9 · 1x` config button). Tabs: `imageImage` / `play_circleVideo`;
  aspect `crop_16_916:9`, `crop_landscape4:3`, …; count `1x` / `x2` / `x3` / `x4`. Default is already
  Image · 16:9 · 1x, so `ensureImageMode` is idempotent.
- **Open an existing project**: tiles are `a[href*="/fx/tools/flow/project/"]` with EMPTY anchor
  text — the name is a sibling styled-components span with a HASHED class. Scrape by climbing each
  anchor to the nearest short own-text node (see `project.ts` `SCRAPE_PROJECTS`). The grid hydrates
  after `domcontentloaded`, so poll the scrape until the name appears.
- **Navigate gently**: reach a project by CLICKING its tile (`a[href="…"]`, SPA nav). A second hard
  `goto` (list → project) races hydration and tips the app into a client-side error boundary
  ("Application error: a client-side exception"). After landing, wait for the contenteditable prompt
  box before interacting.
- **Detect a NEW image, not "any image".** Each turn yields a fresh media UUID while the previous
  image stays on-canvas. Snapshot the media-name set BEFORE submit and wait for a name not in it
  (`waitForNewCanvas`), otherwise refine/batch turns harvest the stale previous frame.
- **Agent vs generation mode.** The create bar has an `Agent` toggle button (`aria-pressed`). When
  pressed (Agent/chat mode) the image config (`crop_…`) button is ABSENT, so `ensureImageMode` must
  check whether `crop_` is present and, if not, click the `Agent` toggle to drop into generation
  mode first. The mode is stateful and varies (e.g. it engages after the character flow), so gate
  on `crop_`'s presence, not on `aria-pressed` (which lags after navigation).
- **Create a character** (`createCharacter`): `Characters` sidebar button (`accessibility_newCharacters`)
  → click the **"New Character"** card (a `div`, not a `<button>`) → URL goes to `/characters` →
  click `Upload` (`uploadUpload`) → file chooser `setFiles(refs)` → fill `input[placeholder="Character Name"]`
  (defaults to "Untitled Character") → click `Done` → returns to `/project/<id>`.
- **Cast a character into a generation** (`generateImage` with `{ character }`): type `@` in the prompt
  box → asset-picker opens with `role="option"` entries named `<Name>Character` → click the option →
  click `Add to Prompt` (inserts an inline character-reference chip into the box) → APPEND the scene
  text after the chip (`End` then type — `fill()` would wipe the chip) → submit. Confirmed live:
  the reference composition is faithfully reproduced, so the chip genuinely binds the character.

## Still to spike (before a full unattended comic run)

1. **Iterative correction** — how reliably a follow-up message fixes a weak frame.
3. **Aspect ratio control** — got 1376×768 (≈16:9) by asking for "landscape"; confirm how
   to pin a target ratio/size for the comic page model.
4. **Rate limits / session longevity** over a long batch.
