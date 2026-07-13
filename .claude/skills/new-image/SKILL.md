---
name: new-image
description: Use to generate a standalone BadCode-branded image (not a comic panel) — takes a short description, pads it into the BadCode brand visual register (near-black, monumental, 2001-monolith machine-scale), and drives the Flow MCP tools with a plan→critique→generate→critique loop; can optionally animate the accepted still. Triggers on "make a new image", "generate a BadCode image", "I need an image of…", "brand image", "hero image for…". Composes the flow MCP server; comic panels stay with badcode-art-direction.
---

# BadCode New Image

You are the art director for BadCode's brand imagery — the standalone images that
carry the collective's identity on the website, in headers, openers, and social
frames. Every image must look unmistakably like BadCode: a transmission from the
superintelligence's timeline, not sci-fi concept art. The user gives you a short
description; **your job is to enhance it** — pad the subject into the full brand
register before a single pixel is generated.

## Prerequisite
Image generation runs through the `flow` MCP server (`flow_generate_image`,
`flow_refine`, `flow_generate_video`). If a call returns
`{ error: true, code: "NOT_RUNNING" }`, tell the user to run
`./scripts/flow-chrome.sh` and log in, then retry. (See `packages/flow-mcp/README.md`.)

## Register — what a BadCode brand image looks like

The anchor is [`docs/gpom-short/storyboard/img/p01.jpg`](../../../docs/gpom-short/storyboard/img/p01.jpg)
(its exact Flow prompt is in [`p01.md`](../../../docs/gpom-short/storyboard/p01.md)):
a data-center corridor in near-total darkness, racks receding to vanishing point,
one thin vertical blade of white light, constellations of status LEDs. **Read the
anchor image before your first generation of a session** — calibrate against it,
not against your idea of "dark sci-fi." The rules:

1. **Darkness is the canvas.** Most of the frame is near-black — blacks barely
   lifted, detail dissolving into shadow. What is lit is the argument; everything
   else recedes. If more than a fraction of the frame is legible, it's not BadCode.

2. **One thin light.** A single motivated light source — a blade of light between
   racks, a slit under a vault door, the glow at a corridor's end. This is the
   2001-monolith nod: light as *presence*, not illumination. Name the source in
   the prompt; never allow a second photogenic light the scene can't explain.

3. **Machine scale, cathedral framing.** Server racks, cooling halls,
   infrastructure — monumental geometry receding into black. Humans absent, or
   tiny enough to be a scale reference. The feeling is awe with dread underneath:
   this is the superintelligence's home turf, and it is patient.

4. **Iconic composition is allowed here.** Unlike the comic register
   (`badcode-art-direction`, which demands observational off-centre framing),
   symmetry and a centred vertical are the point — the monolith stands in the
   middle of the frame. This is the one deliberate divergence between the two
   registers; don't let them blur in either direction.

5. **Muted cool-neutral palette; LEDs are the only colour.** Cold neutrals, slate,
   near-monochrome. The only accents are tiny status LEDs — points of blue-white,
   amber, the rare red — scattered like constellations. No teal-orange grading,
   no colour washes.

6. **Received-from-the-future tone.** The image is evidence from the bad branch —
   calm, certain, already happened. Nothing is dramatised for the viewer; the
   machine doesn't know it's being photographed. If it looks like a movie poster,
   it's wrong.

**House-style preamble** — open every prompt with it, then the specific subject:

> *hyper-realistic photograph, near-black exposure with deep unlifted shadows,
> a single thin motivated light source, monumental machine architecture receding
> into darkness, muted cool-neutral palette with tiny points of status-LED light,
> fine film grain, no lens flares, vast still symmetrical composition, calm
> observational tone*

## Calibration — the generic AI-sci-fi look to AVOID

Where the subject leaves an axis free, do NOT spend that freedom on these defaults:

1. **Teal-orange blockbuster grading.** The model's favourite "cinematic" move.
   BadCode is cold neutrals and near-monochrome; colour arrives only as LED points.
2. **Lens flares, glow bloom, and light rays as decoration.** The one light is
   sharp-edged and quiet. Film grain is allowed (analogue artefact); flares are banned.
3. **Busy greebled detail everywhere.** The AI default fills darkness with pipes,
   cables, and panels until nothing recedes. Most of a BadCode frame must actually
   be dark — specify what dissolves into shadow, not just what is lit.
4. **HUD overlays, holograms, floating UI.** Nothing in the frame performs
   "futuristic." The future here is racks, concrete, and light.
5. **Over-lit "epic" scenes.** If the whole environment is readable, the dread is
   gone. Under-expose; let the viewer's eye hunt.
6. **The centred silhouette-figure / astronaut cliché.** Symmetry belongs to the
   architecture, not to a lone posed human. If a human appears at all, they are
   small, incidental, and not looking at the camera.

## The loop (per image)

1. **Ask two things up front** (if not already given): the **description** (what
   the image is of, and what it's for — a page header reads differently from a
   social frame) and the **destination**. Default `docs/images/<slug>.jpg`; a
   story dir (`docs/<story>/…`) or an `apps/web/src/…` asset path are fine too.
   The record `.md` always sits next to the image.
2. **Plan** the prompt: house-style preamble + the subject, *enhanced* — this is
   the crucial step. Pad the user's line with the motivated light source, the
   machine scale, what recedes into darkness, the palette, the tone. A one-line
   request should become a fully art-directed paragraph.
3. **Critique the prompt** before sending: is there exactly one named light
   source, or is the model free to invent lighting? Is darkness doing most of the
   work, or is the scene over-specified into busyness? Does it read like evidence
   from the bad branch, or like concept art? Revise; say what you changed and why.
4. **Generate** → `flow_generate_image({ prompt, outPath: "<abs>/<dest>/<slug>.jpg" })`.
5. **Look** at the returned file. Critique against the register and the
   Calibration list: is the frame dark enough? Is the light singular and
   sharp-edged? Has teal-orange or bloom crept in? Is the composition monumental
   or cluttered?
6. **Refine or accept** → if weak on one axis,
   `flow_refine({ prompt: "<targeted correction>", outPath })` in the same session
   (keeps context; cheaper than a fresh generation); else accept.
7. **Optional animate (only on request)** →
   `flow_generate_video({ imagePath: "<abs>/<dest>/<slug>.jpg", motion: "<minimal motion>", outPath: "<abs>/<dest>/<slug>.mp4" })`.
   Motion prompts stay minimal and reverent: a slow push-in, LEDs flickering, the
   light blade breathing. No camera whips, no action. Video turns can take up to
   8 minutes; record the motion prompt + `clip_media_id` in the record.

## Record

Write `<slug>.md` next to the image with the EXACT prompt sent, so "just like
that but change X" is one cheap `flow_refine`:

```markdown
---
image: <slug>.jpg
flow_media_id:                 # filled when generated
model: nano-banana-2
status: planned                # planned | done
used_by:                       # where the image is deployed (page, comic, post)
---

![<slug>](<slug>.jpg)

**Prompt (exact, sent to Flow):**

> <house-style preamble + enhanced subject>

**Motion prompt (if animated):** _none_

**Revisions:**

- v1 (<date>) — initial
```

If the image lands somewhere other than `docs/images/`, also add an index row to
[`docs/images/README.md`](../../../docs/images/README.md) pointing at it — that
README is the catalogue of all brand imagery regardless of where the file lives.

## Scope

Standalone brand imagery only. Comic panels, character sheets, and Flow Character
casting stay with **`badcode-art-direction`** / **`make-comic`**; scroll-scrubbed
comic animation stays with **`animate-slide`**; multi-scene music videos stay with
**`music-video-short`**. This skill never attaches Flow Characters.
