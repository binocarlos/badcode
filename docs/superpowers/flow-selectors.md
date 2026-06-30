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

## Still to spike (before a full unattended comic run)

1. **Iterative correction** — how reliably a follow-up message fixes a weak frame.
3. **Aspect ratio control** — got 1376×768 (≈16:9) by asking for "landscape"; confirm how
   to pin a target ratio/size for the comic page model.
4. **Rate limits / session longevity** over a long batch.
