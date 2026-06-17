# Spike: scroll-scrub video (WebCodecs vs `<video>.currentTime`)

Throwaway de-risking spike for the **video-based animation** direction (see
`docs/superpowers/specs/2026-06-16-progressive-comic-loading-design.md`, Q2). It answers:
**can we drive comic animations from a single small video file scrubbed by scroll,
instead of hundreds of individual image frames — and does it feel smooth?**

## Run it

```bash
npm run dev            # from repo root (Vite, port 5173)
# open: http://localhost:5173/spike/index.html
```
Open in **Chrome/Edge** (WebCodecs). Scroll the page to scrub the animation.

## The four buttons

| Button | What it tests | Expectation |
| --- | --- | --- |
| Naive · original 1080p (1 keyframe) | `<video>.currentTime = scroll` on the raw clip | **Janky** — every seek decodes from frame 0 (the clip has a single keyframe) |
| Naive · 480p all-keyframe | same, but re-encoded all-intra | **Smooth**, but the file is bigger (all keyframes) |
| WebCodecs · 480p gop12 | demux→VideoDecoder→ImageBitmap[]→canvas | **Smooth + tiny file**; scrub during decode to see progressive fill-in |
| WebCodecs · original 1080p | same path on the raw 1080p | tests decode speed / memory at full res |
| WebCodecs · LONG 576f windowed+LRU | on-demand **GOP decode** + LRU eviction on a 576-frame clip | smooth scrub (incl. backward) while **resident frames stay capped** ~144 — the production model |

Watch the **paint FPS** stat while scrolling fast, **time to 1st frame**, and
**time to decode all** (WebCodecs).

## Test assets (git-ignored — regenerate, don't commit)

```bash
cd apps/web/public/spike
# source clip (H.264 1080p, 96 frames, 1 keyframe)
gsutil cp gs://badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/video.mp4 short.mp4
# 480p all-intra proxy (smooth naive seeking, larger)
ffmpeg -y -i short.mp4 -vf scale=854:-2 -c:v libx264 -g 1  -bf 0 -crf 26 -pix_fmt yuv420p -an proxy-allkey.mp4
# 480p gop-12 proxy (small, WebCodecs)
ffmpeg -y -i short.mp4 -vf scale=854:-2 -c:v libx264 -g 12 -keyint_min 12 -bf 0 -crf 26 -pix_fmt yuv420p -an proxy-gop12.mp4
# long 576-frame clip (loop short x6) for the windowed-decode test
ffmpeg -y -stream_loop 5 -i short.mp4 -vf scale=854:-2 -c:v libx264 -g 12 -keyint_min 12 -bf 0 -crf 26 -pix_fmt yuv420p -an long.mp4
```

## Sizes observed (96-frame clip)

| asset | size |
| --- | --- |
| `short.mp4` (1080p original) | 11.5 MB |
| `proxy-allkey.mp4` (480p all-intra) | 1.79 MB |
| `proxy-gop12.mp4` (480p, kf/12) | 0.94 MB |
| equivalent all-frames WebP (current pipeline) | ~12 MB high + ~2 MB low |

## Notes / known gotchas being probed

- WebCodecs only **decodes**; we use `mp4box.js` (via esm.sh CDN) to demux the MP4 and
  extract the codec `description` (avcC).
- The gop12 proxy uses `-bf 0` (no B-frames) so decode order == presentation order,
  which keeps frame indexing trivial. With B-frames you must sort by presentation timestamp.
- The spike decodes the **whole** short clip into bitmaps (downscaled to ≤854w to bound
  memory). A production `AnimationWidget` for long clips (the comic has up to 576-frame
  sequences) needs **windowed decode + LRU eviction**, not decode-all — that's the next
  thing to validate after this.
- Some comics (`a17f2cc4`) still have the source `video.mp4`; others (`bebf53aa`) have
  **only frames**, so the pipeline must re-encode frames→video where the source is gone.
