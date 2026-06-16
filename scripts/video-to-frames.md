# Video to Frames

Split a video file into individual JPEG frames for use with `AnimationWidget`.

## Prerequisites

- `ffmpeg` installed (`brew install ffmpeg` / `apt install ffmpeg`)

## Usage

```bash
# Split at 24 fps (smooth, more frames)
ffmpeg -i input.mp4 -vf "fps=24" public/comics/<slug>/p<N>-animation/frame-%03d.jpg

# Split at 12 fps (fewer frames, faster scroll-through)
ffmpeg -i input.mp4 -vf "fps=12" public/comics/<slug>/p<N>-animation/frame-%03d.jpg

# Split at 8 fps (minimal frames, quick flick effect)
ffmpeg -i input.mp4 -vf "fps=8" public/comics/<slug>/p<N>-animation/frame-%03d.jpg
```

## Notes

- Fewer frames = faster scroll-through, less disk space
- More frames = smoother animation but heavier page load
- The `AnimationWidget` scrubs through frames as the reader scrolls
- Frame numbering must be sequential (`frame-001.jpg`, `frame-002.jpg`, ...)
- Use `-q:v 2` for higher quality JPEGs: `ffmpeg -i input.mp4 -vf "fps=24" -q:v 2 frames/frame-%03d.jpg`
