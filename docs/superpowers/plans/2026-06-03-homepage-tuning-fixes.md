# Homepage Tuning & Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the three findings from the visual verification of the 3D homepage: (1) the live 3D scene is too dark/sparse — fog and camera framing crush the bent-fork geometry; (2) the 2D fallback's Storyverse / Future Proof tip labels are clipped at the SVG edge; (3) the 2D fallback's click targets are only the glyphs, not the whole node row.

**Architecture:** Pure tuning of existing components — no new files, no API changes. Adjust three 3D components (`Spine`, `Atmosphere`, `CameraRig`) for legibility, and the `Fallback2D` SVG for label fit + hit area. Verification is **runtime screenshot capture** (Playwright + headless Chromium with software WebGL), since these are visual values with no unit-test surface.

**Tech Stack:** Existing `@badcode/web` (react-three-fiber, drei, postprocessing, react-router). Playwright for screenshot evidence.

**Source findings:** the verification report in the session that built `docs/superpowers/specs/2026-06-03-gitpush-homepage-design.md`.

**Conventions:** same as the build plan — `verbatimModuleSyntax` (`import type`), strict, `noUnusedLocals/Parameters`, automatic JSX. Typecheck a workspace with `npm run typecheck --workspace @badcode/web`.

**These are aesthetic values — expect to iterate.** Each tuning task gives concrete starting numbers AND a screenshot step. If the capture still looks off, nudge the values in the same step and re-capture before committing. The target is: the live 3D overview should read as the same clean bent fork the 2D fallback already shows.

---

## Verification harness (read once; used by Tasks 2–4)

Visual tasks verify by capturing a screenshot of the running app and **looking at it** (Read the PNG). Setup, done once per session:

- [ ] **H1: Ensure Playwright + Chromium are available**

If `/tmp/bc-verify/node_modules/playwright` already exists, skip. Otherwise:

```bash
mkdir -p /tmp/bc-verify && cd /tmp/bc-verify && npm init -y >/dev/null 2>&1 \
  && npm i playwright@latest >/dev/null 2>&1 \
  && npx playwright install chromium >/dev/null 2>&1 && echo "playwright ready"
```

- [ ] **H2: Write the capture script** `/tmp/bc-verify/shot.mjs`:

```js
import { chromium } from 'playwright'
const [path = '/', out = 'shot.png', reduce = '0', scroll = '0'] = process.argv.slice(2)
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({
  viewport: { width: 1366, height: 768 },
  reducedMotion: reduce === '1' ? 'reduce' : 'no-preference',
})
const page = await ctx.newPage()
const errs = []
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
await page.goto('http://localhost:5173' + path, { waitUntil: 'networkidle' }).catch(() => {})
await new Promise((r) => setTimeout(r, 3600)) // let opening settle
if (scroll !== '0') {
  await page.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f), Number(scroll))
  await new Promise((r) => setTimeout(r, 1400))
}
await page.screenshot({ path: '/tmp/bc-verify/' + out })
console.log('console/page errors:', JSON.stringify(errs))
await browser.close()
```

Usage: `node /tmp/bc-verify/shot.mjs <route> <outfile> <reduce 0|1> <scrollFraction>`.
The dev server must be running (each task starts/stops it).

---

## Task 1: Brighten the 3D spine + branch lines

The branch lines (`#bbbbbb`) read as nearly invisible against black under bloom/fog. Brighten and thicken them, and thicken the history line.

**Files:**
- Modify: `apps/web/src/home/Spine.tsx`

- [ ] **Step 1: Thicken the history line**

In `apps/web/src/home/Spine.tsx`, change the history `<Line>`:

```tsx
      <Line ref={historyRef} points={to3(branches.history)} color={COLORS.white} lineWidth={3} />
```

- [ ] **Step 2: Brighten + thicken the branch lines**

Change the bad/good `<Line>`s:

```tsx
          <Line points={to3(branches.bad)} color="#dfe7ec" lineWidth={3} />
          <Line points={to3(branches.good)} color="#dfe7ec" lineWidth={3} />
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/home/Spine.tsx
git commit -m "fix(home): brighten + thicken 3D spine and branch lines"
```

---

## Task 2: Retune fog + camera framing (the main legibility fix)

Fog `[black, 30, 90]` with the camera ~60 units back fogs the whole scene into black, and the overview pose frames the fork off to one side with empty space. Push fog out so near geometry stays crisp, and reframe the overview to center the full bent fork.

**Files:**
- Modify: `apps/web/src/home/Atmosphere.tsx`
- Modify: `apps/web/src/home/CameraRig.tsx`

- [ ] **Step 1: Push the fog range out**

In `apps/web/src/home/Atmosphere.tsx`, change the fog line:

```tsx
      <fog attach="fog" args={[COLORS.black, 55, 220]} />
```

(Near 55 keeps travel-distance geometry — camera ~18 units away — fully crisp; far 220 keeps the overview legible while still fading deep space.)

- [ ] **Step 2: Reframe the overview + ease the travel camera back**

In `apps/web/src/home/CameraRig.tsx`, change the intro pose constants and the travel `desired`/lookahead:

```tsx
const introPos = new Vector3(6, 0, 76) // pulled-back overview that frames the whole fork
const introTarget = new Vector3(6, 0, 0)
```

and inside `useFrame`, the travel branch:

```tsx
    pointAtT(ctrl.t, here)
    pointAtT(Math.min(1, ctrl.t + 0.05), ahead)
    desired.set(here.x, here.y + 3, 18) // back on +Z, slightly above
    camera.position.lerp(desired, k)
    camera.lookAt(ahead.x, ahead.y, 0)
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 4: Capture the overview + a travel frame, and look at them**

Start the dev server, capture, stop it:

```bash
cd /home/kai/projects/badcode/badcode
nohup npm run dev --workspace @badcode/web > /tmp/badcode-dev.log 2>&1 &
sleep 4
node /tmp/bc-verify/shot.mjs / t2-overview.png 0 0
node /tmp/bc-verify/shot.mjs / t2-travel.png 0 0.5
pkill -f "badcode/node_modules/.bin/vite"
```

Then **Read** `/tmp/bc-verify/t2-overview.png` and `/tmp/bc-verify/t2-travel.png`.
Expected: the overview shows the full bent fork — flat history on the left, the angular split, both branches running to the STORYVERSE / FUTURE PROOF tips — legibly, not crushed to black. The travel frame shows the camera moved up the bad branch with the branch line visible. The capture script must report `console/page errors: []`.
If still too dark or mis-framed, nudge `introPos.z` (70–84), `introTarget.x` (4–8), and fog far (180–260) in Steps 1–2 and re-capture before committing.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/Atmosphere.tsx apps/web/src/home/CameraRig.tsx
git commit -m "fix(home): retune fog range + overview/travel camera framing"
```

---

## Task 3: Fix 2D fallback tip-label clipping

`STORYVERSE` / `FUTURE PROOF` overflow the right edge of the `1280`-wide viewBox and render as "Storyv" / "Future". Add a right gutter to the viewBox and uppercase the tip titles for consistency with the 3D tips.

**Files:**
- Modify: `apps/web/src/home/Fallback2D.tsx`

- [ ] **Step 1: Add a right gutter to the viewBox**

In `apps/web/src/home/Fallback2D.tsx`, change the `<svg>` opening tag's viewBox (keep everything else on the line):

```tsx
        <svg viewBox="0 0 1400 560" role="img" aria-label="The BadCode timeline: shared history forking into a bad branch and a good branch" style={{ width: '100%', height: 'auto' }}>
```

(The geometry still maps into `0..1280`; the extra 120px on the right is gutter for labels.)

- [ ] **Step 2: Uppercase the tip labels**

Change the tip `<text>` content:

```tsx
              <text x={SX(tips[k].pos[0]) - 10} y={SY(tips[k].pos[1]) + (tips[k].branch === 'bad' ? -16 : 26)} fill={COLORS.white} fontSize={14}>
                {tips[k].title.toUpperCase()}
              </text>
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 4: Capture the fallback and look at it**

```bash
cd /home/kai/projects/badcode/badcode
nohup npm run dev --workspace @badcode/web > /tmp/badcode-dev.log 2>&1 &
sleep 4
node /tmp/bc-verify/shot.mjs / t3-fallback.png 1 0
pkill -f "badcode/node_modules/.bin/vite"
```

Then **Read** `/tmp/bc-verify/t3-fallback.png`.
Expected: both `STORYVERSE` and `FUTURE PROOF` render in full, not clipped. Story-node labels (Camping, Karen Will Lead the Revolution, Emperor's New Coin, An Optimistic Lens) all fit too.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/Fallback2D.tsx
git commit -m "fix(home): unclip 2D fallback tip labels (viewBox gutter + uppercase)"
```

---

## Task 4: Enlarge 2D fallback click targets

Only the circle + text glyphs are clickable; the gaps between them are dead space. Add a transparent hit rectangle inside each `<Link>` so the whole node/tip row is clickable.

**Files:**
- Modify: `apps/web/src/home/Fallback2D.tsx`

- [ ] **Step 1: Add a transparent hit rect to each story-node link**

In the story-nodes `.map`, add a `<rect>` as the FIRST child inside the `<Link>` (before the tether `<line>`):

```tsx
          <Link key={n.id} to={n.route} aria-label={`${n.title}${n.status === 'live' ? '' : ' (coming soon)'}`}>
            <rect x={SX(n.pos[0]) - 14} y={SY(n.pos[1]) - 14} width={240} height={28} fill="transparent" />
            <line x1={SX(n.clip[0])} y1={SY(n.clip[1])} x2={SX(n.pos[0])} y2={SY(n.pos[1])} stroke={COLORS.tether} strokeWidth={1} />
            <circle cx={SX(n.pos[0])} cy={SY(n.pos[1])} r={8} fill="none" stroke={COLORS.cyan} strokeWidth={2} opacity={n.status === 'live' ? 1 : 0.5} />
            <text x={SX(n.pos[0]) + 12} y={SY(n.pos[1]) + 4} fill={COLORS.cyan} fontSize={12} opacity={n.status === 'live' ? 1 : 0.6}>
              {n.title}
            </text>
          </Link>
```

(`fill="transparent"` is painted and captures pointer events, unlike `fill="none"`.)

- [ ] **Step 2: Add a transparent hit rect to each tip link**

In the tips `.map`, add a `<rect>` as the first child inside the `<Link>`:

```tsx
            <Link key={k} to={tips[k].route}>
              <rect x={SX(tips[k].pos[0]) - 16} y={SY(tips[k].pos[1]) - 20} width={150} height={48} fill="transparent" />
              <circle cx={SX(tips[k].pos[0])} cy={SY(tips[k].pos[1])} r={9} fill="none" stroke={COLORS.white} strokeWidth={2.5} />
              <text x={SX(tips[k].pos[0]) - 10} y={SY(tips[k].pos[1]) + (tips[k].branch === 'bad' ? -16 : 26)} fill={COLORS.white} fontSize={14}>
                {tips[k].title.toUpperCase()}
              </text>
            </Link>
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace @badcode/web`
Expected: PASS.

- [ ] **Step 4: Verify the hit areas navigate (click between glyphs)**

Write `/tmp/bc-verify/hit.mjs`:

```js
import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1366, height: 768 } })
const page = await ctx.newPage()
const out = {}
// Click the transparent hit rect of the Camping node (the gap, not a glyph)
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await new Promise((r) => setTimeout(r, 500))
const rect = page.locator('a:has-text("Camping") rect').first()
const box = await rect.boundingBox()
if (box) { await page.mouse.click(box.x + box.width - 6, box.y + box.height / 2); await new Promise((r) => setTimeout(r, 600)) }
out.afterRectClick = page.url()
console.log(JSON.stringify(out))
await browser.close()
```

Run:

```bash
cd /home/kai/projects/badcode/badcode
nohup npm run dev --workspace @badcode/web > /tmp/badcode-dev.log 2>&1 &
sleep 4
node /tmp/bc-verify/hit.mjs
pkill -f "badcode/node_modules/.bin/vite"
```

Expected: output `{"afterRectClick":"http://localhost:5173/comics/camping"}` — clicking the dead space (now covered by the hit rect) navigates.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/home/Fallback2D.tsx
git commit -m "fix(home): full-row click targets for 2D fallback nodes + tips"
```

---

## Task 5: Final re-verification sweep

Confirm nothing regressed and capture fresh evidence across the key flows.

**Files:** none (verification only).

- [ ] **Step 1: Typecheck + build**

Run: `npm run typecheck --workspace @badcode/web` then `npm run build --workspace @badcode/web`
Expected: both PASS; the build still emits a separate lazy `Scene-*.js` chunk.

- [ ] **Step 2: Capture the full set and look at each**

```bash
cd /home/kai/projects/badcode/badcode
nohup npm run dev --workspace @badcode/web > /tmp/badcode-dev.log 2>&1 &
sleep 4
node /tmp/bc-verify/shot.mjs / final-overview.png 0 0
node /tmp/bc-verify/shot.mjs / final-travel.png 0 0.6
node /tmp/bc-verify/shot.mjs /comics/camping final-camping.png 0 0
node /tmp/bc-verify/shot.mjs / final-fallback.png 1 0
pkill -f "badcode/node_modules/.bin/vite"
```

**Read** all four PNGs. Expected:
- `final-overview` — full bent fork, legible, both tips visible.
- `final-travel` — camera up the bad branch, branch line visible.
- `final-camping` — comic renders with `← timeline` button.
- `final-fallback` — full fork, tip labels unclipped.
All captures report `console/page errors: []`.

- [ ] **Step 3: Done**

No commit (verification only). Report the four screenshots and the verdict.

---

## Self-Review notes (for the implementer)

- **Findings coverage:** Finding 1 (dark/sparse 3D) → Tasks 1–2; Finding 2 (clipped tip labels) → Task 3; Finding 3 (small hit targets) → Task 4. Task 5 re-verifies all flows.
- **All values are aesthetic.** If a capture looks wrong, iterate the numbers in the same task before committing — don't treat the first value as final.
- **No tests change** — these are runtime-visual fixes with no unit-test surface, verified by screenshot per the project's verification practice.
