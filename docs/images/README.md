# docs/images — BadCode brand imagery

The home for **standalone BadCode-branded images** — the pieces that carry the
collective's visual identity outside a specific comic: site headers, openers,
social frames. Images here are produced by the **`new-image`** skill
(`.claude/skills/new-image/`), which pads a short description into the brand
register (near-black, one thin light, monumental machine architecture) and drives
Google Flow to generate it.

**Convention:** every generated image is `<slug>.jpg` with a sibling `<slug>.md`
record holding the exact Flow prompt, media id, and revision log — so "just like
that, but change X" is one cheap `flow_refine`. Brand images that live elsewhere
(a story dir, an `apps/web` asset path) still get an index row here.

## Index

| Image | Record | Note |
| --- | --- | --- |
| [`../gpom-short/storyboard/img/p01.jpg`](../gpom-short/storyboard/img/p01.jpg) | [`p01.md`](../gpom-short/storyboard/p01.md) | **The register anchor.** Near-black server hall, one thin blade of light, LED constellations — gpom-short panel 1, with its exact Flow prompt in the record. This is the calibration reference the `new-image` skill reads before generating. |
| [`gpom-short-opener.jpeg`](./gpom-short-opener.jpeg) | — (predates the skill) | A comic-viewer screenshot of the anchor above, with browser/UI chrome baked in. Kept for history; use the raw `p01.jpg` instead. |
