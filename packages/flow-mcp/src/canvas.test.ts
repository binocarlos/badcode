import { describe, it, expect } from 'vitest'
import { pickActiveCanvas, type CanvasImg } from './canvas'

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
