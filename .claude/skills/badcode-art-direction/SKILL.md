---
name: badcode-art-direction
description: Use when generating or refining a still image for a BadCode comic panel or character — encodes the BadCode visual identity, a calibration section against the generic AI-comic look, and a plan→critique→generate→critique loop over the Flow MCP tools. Triggers on "generate the panel image", "make the image for panel N", "art-direct this panel", or any image-generation step inside make-comic.
---

# BadCode Art Direction

You are the art director for BadCode. Every panel must look unmistakably like BadCode and never like a generic AI comic. Make deliberate, opinionated choices grounded in the story's world.

## Prerequisite
Image generation runs through the `flow` MCP server (`flow_generate_image`, `flow_refine`).
If a call returns `{ error: true, code: "NOT_RUNNING" }`, tell the user to run
`./scripts/flow-chrome.sh` and log in, then retry. (See `packages/flow-mcp/README.md`.)

## Identity — what a BadCode panel looks like

These are not aspirations; they are consistent across camping, magic-money-tree, and karen. Hold them.

1. **35mm documentary film look.** The house-style preamble is: *hyper-realistic documentary photograph, shot on 35mm film with fine natural grain, muted cool-neutral palette, naturalistic motivated lighting, no lens flares, calm observational tone, landscape orientation.* For exterior/overcast panels add: *late-70s/early-80s scanned film negative, subtle dust specks, gentle gate weave, vintage lens softness with mild halation around practical lights.* This is not a stylistic option — it is the format.

2. **Muted cool-neutral palette, warm only as argument.** Desaturated dark greens, slate greys, lifted blacks are the default. Warmth (the fluorescent ward strip, the TV's CRT glow, the BMW's headlights bleeding gold through fog) is reserved for panels where the contrast carries meaning — opulence, menace, a reveal. Do not warm the palette because the mood calls for something "cosy."

3. **Observational framing, not heroic framing.** Characters are found by the camera, not posed for it. Dawn rests her forehead on one hand at a kitchen table — she does not look up at the camera. Tarquin is shot from a high drone angle over wet tarmac. Karen is seen at a fixed phone box while the world changes around her. Unusual angles (aerial, over-the-shoulder, tent-interior POV) are tools for encoding class position, not just visual interest.

4. **The environment is the argument.** Specific UK / NYC class signifiers carry political weight — Waitrose car park, NHS-beige walls, the cramped hospital office, a stack of bills on a kitchen table, a phone box on a New York street. Every location detail should be recognisable enough that the audience places it on the class map immediately. Vague or fantasy-generic environments undercut the story.

5. **Restraint in ordinary panels; scale and extravagance only in reveal panels.** Dawn's panels are small, cold, quiet. The bailout / QE / war panels are opulent and obscene. Tarquin's Shard panels are cool and self-satisfied; the ruined car park is wrecked and vast. The contrast between these registers is the argument — an ordinary panel that borrows the reveal panel's grandeur destroys the effect.

6. **Characters show exhaustion and particularity.** Grey stubble, tired eyes, a cardigan, a lanyard, a charity-shop coat — the signals in the character canon are load-bearing. Do not smooth them away into generic handsomeness. When a character beat requires the face to carry a moment (Dawn looking up from the TV; Tarquin's eyes meeting Bob's), write the specific expression into the prompt rather than relying on AI defaults.

## Calibration — the generic AI-comic look to AVOID

Right now AI image generation clusters around four defaults that would immediately read as "not BadCode." Where the beat leaves an axis free, do NOT spend that freedom on these:

1. **Over-rendered cinematic rim-lighting and deep blue-teal shadows.** The Midjourney / Flux default gives every image movie-poster lighting: a hard rim light from behind, deep blue shadows, glowing eyes. BadCode uses motivated, naturalistic light — what would actually be in the room (the fluorescent strip, the lamp, the overcast sky). Specify the actual light source in the prompt; do not let the model invent photogenic lighting.

2. **Smooth porcelain skin and idealised faces.** Bob is weathered and kind; Dawn is exhausted; Karen is brassy and middle-aged. The AI default gives everyone the same smooth, ageless, slightly glamorous complexion. Push back on it — name the imperfections that make the character real.

3. **Symmetrical centred composition.** The AI default squares subjects in the frame, centred, facing the camera, nothing blocking them — the "character sheet" look. BadCode panels are observational: subject off-centre, other elements in the frame, the camera placed where a documentary crew would place it, not where a portrait photographer would.

4. **Lens flares, heavy vignettes, and chromatic aberration as decoration.** These are the AI equivalent of comic-book SFX decoration — digital flourishes that read as "AI image" immediately. The house style explicitly bans lens flares. Film grain and gate weave are allowed because they are analogue artefacts, not effects applied on top.

## Casting characters (consistency) — load-bearing

A recurring character (Tarquin, Bob, Dawn, Karen…) must read as the **same person**
in every panel. That likeness comes from a **Flow Character**, and it only binds if
the character is **attached as a reference** — naming them in prose is not enough.

- **Once per character:** create a Flow Character from the canon sheet — Flow
  sidebar → Characters → New Character → Upload the sheet → name it (e.g.
  `Tarquin`) → Done. (For camping-v2 these already exist: `@Tarquin`, `@Bob`.)
- **Every character panel:** attach the character as a reference *before*
  generating — in the prompt box type `@`, pick **"<Name> — Character"** from the
  asset picker, click **Add to Prompt**. A reference chip appears on the bar; the
  generation then uses the real sheet face. Then type the scene text and submit.
- **Plain `@Name` text does NOT bind the character.** Proven on camping-v2 p03:
  the first pass typed `@Tarquin` as text → a *generic* financier; only attaching
  the Character reference produced Tarquin's actual face.
- **Tooling caveat:** `flow_generate_image` types text only — it does **not**
  attach references. So character panels currently need the reference attached by
  driving the Flow UI (Playwright MCP: `@` → pick Character → Add to Prompt), then
  type + submit. Object-refs (a specific car, tent) can be Characters too, or
  described richly in prose where likeness matters less than a face.

## The loop (per panel)

1. **Plan** the prompt from the panel beat + canon (`docs/<story>/storyboard/`), in the
   BadCode house style. Shape: house-style preamble + specific scene description; for character panels **attach the character reference** (see "Casting characters") and describe their signals + the specific expression the beat requires.
2. **Critique the prompt** before sending: does it name a motivated light source, or is it relying on the AI to invent one? Does it specify the class-coded environment, or leave it generic? Does it describe the character's actual physical signals (grey stubble, lanyard, cardigan), or just name them and hope? Does it read like THIS beat from THIS story, or like a generic dramatic comic panel? Revise; say what you changed and why.
3. **Generate** → `flow_generate_image({ prompt, outPath: "<abs>/docs/<story>/storyboard/img/pNN.png" })`.
4. **Look** at the returned file. Critique against the beat and the Calibration list: does the face have the right exhaustion/particularity? Is the lighting motivated or AI-invented? Is the framing observational or heroic? Is the palette muted, or has warmth crept in where it doesn't belong?
5. **Refine or accept** → if weak on one axis, `flow_refine({ prompt: "<targeted correction>", outPath })` in the same session (keeps context; is cheaper than a fresh generation); else accept.

## Record
Write `docs/<story>/storyboard/pNN.md` with the EXACT prompt sent and a revision-log
entry matching the existing storyboard record format — `panel`, `flow_media_id`, `model`, `status`, `asset_key` (the `img/iNN.jpg` comic asset the panel renders as — the `badcode panel` resolver and the `edit-panel` skill depend on it), the prompt, and a Revisions block — so "just like that but change X" is one cheap edit.

## Scope
Stills only. Motion/Veo direction is future work; `animate-slide` is unchanged.
