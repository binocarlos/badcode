---
name: make-comic
description: Use to take a BadCode comic from idea to a rendered comic in the browser as a gated, staged workflow — discuss & approve each stage, then produce. Triggers on "make a comic", "let's build the <x> comic", "turn this idea into a comic", "ideate a comic", "new comic from scratch", or any request to generate comic images / a storyboard via Google Flow. Composes new-story (canon) + Google Flow (images) + @badcode/comic (assembly).
---

# Make Comic (BadCode)

Take a comic from **idea → rendered comic in the browser**, run as a gated
workflow: each stage is *discuss → approve → produce*. Nothing is produced before
its stage is approved. This skill **composes** existing tools — it does not
duplicate them.

## Read first

- `CLAUDE.md` — what BadCode is and the repo map.
- `docs/voice.md` — load-bearing tone (sarcastic, dark, total authority; politics
  & economics first; story over sermon). All prose and captions match it.
- `docs/storytelling.md` — the method: one load-bearing idea, real grounding,
  beats. Don't reinvent it.
- The **`new-story`** skill — captures the `docs/<story>/` canon. Stages 1, 2, 4
  delegate to its method.
- `docs/superpowers/flow-selectors.md` — the Google Flow recipe (agent-driven UI,
  the Character feature, the signed-URL image harvest). The Flow engine below is
  the short version; this is the depth.
- `packages/comic/AUTHORING.md` — **mandatory** before writing any comic `.tsx`
  in Stage 6.

## The six stages (each: discuss → approve → produce)

| # | Stage | Produces | Tool |
|---|---|---|---|
| 1 | Idea | `docs/<story>/story.md` + `README.md` | new-story method |
| 2 | Characters | `docs/<story>/characters/<name>.md` (+ visual `sheet` desc) | new-story method |
| 3 | Character images | a Flow Character + portrait + record per character | Flow engine |
| 4 | Storyboard | `docs/<story>/storyboard/index.md` + `pNN.md` (planned) | new-story method |
| 5 | Storyboard images | one image + record per panel | Flow engine |
| 6 | Assemble | comic `.tsx` + manifest + route, verified rendering | @badcode/comic |

`docs/<story>/` is the **source of truth**; the comic in `apps/web` is *derived*
(Stage 6). Worked reference: `docs/magic-money-tree/` and
`apps/web/src/comics/magic-money-tree/`.

## Gating principle

Never run a *produce* step before the user approves that stage's *discuss*
output. After each stage, summarise what was produced and ask before proceeding.
This mirrors how `superpowers:brainstorming` gates its sections.

## Resume

Progress **is** the artifacts. On invocation, inspect `docs/<story>/` and
continue at the first incomplete stage/panel:

- `story.md` / `characters/*` present → stages 1–2 done.
- a character whose `.md` has a recorded portrait → stage 3 done for it.
- `storyboard/pNN.md` with `status: done` → that panel done.

Resume; don't restart.

---

## Stage 1 — Idea

Discuss the concept and the single load-bearing political/economic idea, in the
BadCode voice. Take a fragment, reference, or existing material — **don't demand a
brief.** Using `new-story`'s method, write `docs/<story>/story.md` (key concept,
background, high-level beats, the twist) and `docs/<story>/README.md` (the
tracker).

**Gate:** present the spine; get approval before Stage 2.

## Stage 2 — Characters

Discuss each character. Using `new-story`, write `docs/<story>/characters/<name>.md`
for **every named character** — each one becomes a Flow Character in Stage 3. Each
file must include a specific, class-coded **visual `sheet` description** in house
style (see `docs/voice.md` image direction; `docs/camping/characters/` and
`docs/magic-money-tree/characters/dawn.md` are worked examples).

**Gate:** approve the character descriptions before Stage 3.

---

## Flow engine (used by stages 3 & 5)

Image stages **require Flow connected**. Ensure it before producing:

1. **CDP up?** `curl -s http://localhost:9222/json/version` returns JSON.
2. **Playwright MCP available?** a `browser_*` tool is present.
3. **If not connected**, walk the user through setup:
   - `./scripts/flow-chrome.sh` — launches the logged-in Chromium (on WSL it uses
     Playwright's bundled Chromium via WSLg). Log into Google **once**; the
     session persists in `.flow-profile/`. Launch detached so it survives a
     session resume.
   - If the Playwright MCP isn't loaded, `.mcp.json` only loads at startup — have
     the user restart / `claude --resume` this thread, approve the `playwright`
     server, and confirm via `/mcp`.
4. Confirm a signed-in screenshot of `https://labs.google/fx/tools/flow`.

Flow is **agent-driven**: you type a request into the prompt box and it returns
**one** image (not a grid). Refine by sending a follow-up in the same session.

### Per-image routine

1. Ensure a project is open (`add_2 New project` from the project list).
2. Fill the agent prompt textbox (placeholder *"What do you want to create?"*) and
   click `arrow_forward Create`. Prompt shape: **house style + scene**, and for
   character scenes "featuring the character `<Name>`" — **cast EVERY relevant
   Flow Character by name** (multi-character casting is supported and keeps each
   one's likeness).
3. Wait ~25–30s for the assistant turn to finish.
4. Identify the new image and resolve its signed URL in one
   `browser_run_code_unsafe` call. The sandbox has **only `page`** — no
   `fs`/`require`/`import`; use `page.evaluate` for the DOM and `page.request` for
   the fetch:

   ```js
   async (page) => {
     const name = await page.evaluate(() => {
       const imgs = [...document.querySelectorAll('img')]
         .filter(im => (im.currentSrc || im.src || '').includes('getMediaUrlRedirect'));
       let best = null, area = 0;
       for (const im of imgs) {
         const n = new URL(im.currentSrc || im.src).searchParams.get('name');
         const r = im.getBoundingClientRect(); const a = r.width * r.height;
         if (a > area) { area = a; best = n; }   // largest-rendered = active canvas image
       }
       return best;
     });
     const resp = await page.request.get(
       'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=' + name);
     return { name, url: resp.url() };           // url = signed flow-content.google CDN URL
   }
   ```

5. Download with the shell: `curl -sS "<url>" -o <dest>.jpg`; confirm with `file`.
6. **Judge** the result (read the downloaded file) against the scene + house
   style. If weak, refine in the **same** Flow session ("just like that but
   `<change>`") and re-harvest.
7. Write/update the record (formats below).

> Why this download path: the `<img>` src is an authenticated same-origin redirect
> that fails an in-page `fetch` (CORS); `page.request` follows it server-side with
> the browser's cookies and yields a signed, publicly-fetchable CDN URL. No
> download button, no image bytes through context. Full detail:
> `docs/superpowers/flow-selectors.md`.

---

## Stage 3 — Character images

For **every named character**, in Flow: Characters → *"Describe your character…"*
→ paste the character's `sheet` description → Create → name it → Done. Harvest the
portrait via the Flow engine to `docs/<story>/characters/img/<name>.jpg`, set the
character file's `sheet:` frontmatter to that path, and append the **character
record** below. Scenes in Stage 5 can cast multiple of these Characters at once.

**Gate:** show the portraits; reroll any the user rejects before Stage 4.

### Character record (appended to `characters/<name>.md`)

```markdown
**Flow Character:** id `<flow-character-id>` · model `nano-banana-2`

**Portrait prompt (exact):**
> <the description sent to Flow>

**Revisions:**
- v1 (<date>) — initial
```

---

## Stage 4 — Storyboard

Discuss the panel sequence (beats → panels). Write `docs/<story>/storyboard/index.md`
(an overview: numbered panels, each with a one-line intent and which characters
appear) and one `docs/<story>/storyboard/pNN.md` per panel with `status: planned`,
the planned scene, the narration/speech copy (BadCode voice), and the characters
in it.

**Gate:** approve the board before any image is generated.

### Panel record — `docs/<story>/storyboard/pNN.md`

```markdown
---
panel: 3
characters: [dawn]
flow_media_id:                 # filled when generated
model: nano-banana-2
status: planned                # planned | done
---
![panel 3](img/p03.jpg)        # added when generated

**Prompt (exact, sent to Flow):**
> <exact prompt: house style + scene + cast every character by name>

**Narration:** "<caption / speech>"

**Revisions:**
- v1 (<date>) — initial
```

## Stage 5 — Storyboard images

For each `pNN.md` with `status: planned`: run the Flow engine, casting **every**
character listed in `characters:` by name; generate, judge, and harvest to
`docs/<story>/storyboard/img/pNN.jpg`. Then fill `flow_media_id`, set
`status: done`, embed the image, record the **exact prompt** used, and add a
revision line.

**Gate:** present a contact sheet of all panels; reroll weak ones before Stage 6.

---

## Stage 6 — Assemble

Derive the comic from the storyboard (`docs/<story>/` stays the source). Read
`packages/comic/AUTHORING.md` first.

1. Copy storyboard images to `apps/web/public/comics/<slug>/img/iNN.jpg` (the
   source of truth stays in `docs/<story>/storyboard/img/`). *[v1 path; migrating
   to the `badcode assets-build` bucket pipeline is a later follow-up.]*
2. Write `apps/web/src/comics/<slug>/assets.manifest.json`: `basePath`
   `"comics/<slug>"`, one asset per frame
   (`{ "thumbhash": "", "low": "img/iNN.jpg", "high": "img/iNN.jpg", "width", "height" }`).
3. Write `apps/web/src/comics/<slug>/<Name>Comic.tsx` with `@badcode/comic`:
   `createComic(manifest, { baseUrl: '' })`, one `<Page>` per panel, narration via
   `<NarrationBox>` (speech via `<SpeechBubble>`), and tasteful built-in
   effects/transitions (see `AUTHORING.md`).
4. Register in `apps/web/src/home/comics.ts`: import the component and add
   `'<slug>': <Name>Comic` to `liveComics` (route `/comics/<slug>`).
5. **Verify:** `npm run typecheck`; `npm run dev`; navigate the Flow browser to
   `http://localhost:5173/comics/<slug>` and screenshot the opener + one mid
   panel to confirm it renders.

**Gate:** show the rendered comic; the story is done when the user is happy.

---

## Iterating on an image

The records exist so *"just like that image, but change X"* is one cheap
operation:

1. Open the record (`storyboard/pNN.md` or `characters/<name>.md`) and read the
   recorded prompt.
2. Re-prompt Flow — "just like that but `<change>`", re-casting the same Flow
   Character(s) and optionally re-referencing the prior image — and harvest the
   new version via the Flow engine.
3. **Append a revision line** describing the change; replace the image; if it's a
   storyboard panel that's already assembled, recopy that one frame into the web
   app.

Touch only that one record/image — leave the rest of the comic untouched.

## Out of scope

- **Music.** Songs are the `suno-prompt` skill's job; only offer it as an optional
  follow-on after Stage 6.
- **Bucket-pipeline migration** for derived assets (a noted follow-up).
- **Fully-unattended runs.** The gates assume a human approving each stage.
