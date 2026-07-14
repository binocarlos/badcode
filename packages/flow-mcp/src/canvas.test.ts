import { describe, it, expect } from 'vitest'
import { collectNewCanvases, pickActiveCanvas, type CanvasImg } from './canvas'

describe('collectNewCanvases', () => {
  it('returns only images whose name is not in before', () => {
    const imgs: CanvasImg[] = [
      { name: 'old', width: 100, height: 100 },
      { name: 'new1', width: 200, height: 100 },
      { name: 'new2', width: 300, height: 100 },
    ]
    const out = collectNewCanvases(imgs, new Set(['old']))
    expect(out.map((i) => i.name).sort()).toEqual(['new1', 'new2'])
  })

  it('dedupes by name keeping the largest instance', () => {
    const imgs: CanvasImg[] = [
      { name: 'a', width: 80, height: 80 },
      { name: 'a', width: 1376, height: 768 },
    ]
    const out = collectNewCanvases(imgs, new Set())
    expect(out).toEqual([{ name: 'a', width: 1376, height: 768 }])
  })

  it('skips empty names and returns [] when nothing is new', () => {
    const imgs: CanvasImg[] = [
      { name: '', width: 500, height: 500 },
      { name: 'seen', width: 100, height: 100 },
    ]
    expect(collectNewCanvases(imgs, new Set(['seen']))).toEqual([])
  })
})

describe('pickActiveCanvas', () => {
  it('returns the name of the largest image by area', () => {
    const imgs: CanvasImg[] = [
      { name: 'thumb', width: 80, height: 80 },
      { name: 'active', width: 1376, height: 768 },
      { name: 'medium', width: 400, height: 400 },
    ]
    expect(pickActiveCanvas(imgs)).toBe('active')
  })

  it('ignores entries with an empty name', () => {
    const imgs: CanvasImg[] = [
      { name: '', width: 9999, height: 9999 },
      { name: 'real', width: 100, height: 100 },
    ]
    expect(pickActiveCanvas(imgs)).toBe('real')
  })

  it('returns null when there are no candidates', () => {
    expect(pickActiveCanvas([])).toBeNull()
    expect(pickActiveCanvas([{ name: '', width: 10, height: 10 }])).toBeNull()
  })
})
