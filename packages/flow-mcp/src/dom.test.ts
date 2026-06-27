import { describe, it, expect } from 'vitest'
import { toCanvasImgs } from './dom'

describe('toCanvasImgs', () => {
  it('keeps only media imgs and parses their names', () => {
    const raw = [
      { src: 'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=aaa', width: 1376, height: 768 },
      { src: 'https://example.com/icon.svg', width: 24, height: 24 },
      { src: 'https://labs.google/fx/api/trpc/media.getMediaUrlRedirect?name=bbb', width: 80, height: 80 },
    ]
    expect(toCanvasImgs(raw)).toEqual([
      { name: 'aaa', width: 1376, height: 768 },
      { name: 'bbb', width: 80, height: 80 },
    ])
  })

  it('drops media imgs whose name fails to parse', () => {
    const raw = [{ src: 'getMediaUrlRedirect?notname=x', width: 10, height: 10 }]
    expect(toCanvasImgs(raw)).toEqual([])
  })
})
