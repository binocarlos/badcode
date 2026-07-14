import { describe, it, expect } from 'vitest'
import { candidateOutPath } from './candidates'

describe('candidateOutPath', () => {
  it('keeps the path untouched for single-output calls', () => {
    expect(candidateOutPath('/x/p04.jpg', 0, 1)).toBe('/x/p04.jpg')
  })

  it('suffixes -a/-b before the extension for multi-output calls', () => {
    expect(candidateOutPath('/x/p04.jpg', 0, 2)).toBe('/x/p04-a.jpg')
    expect(candidateOutPath('/x/p04.jpg', 1, 2)).toBe('/x/p04-b.jpg')
    expect(candidateOutPath('/x/p04.jpg', 3, 4)).toBe('/x/p04-d.jpg')
  })

  it('handles dotted directories and extensionless paths', () => {
    expect(candidateOutPath('/a.b/frame', 1, 2)).toBe('/a.b/frame-b')
    expect(candidateOutPath('/a.b/frame.png', 0, 2)).toBe('/a.b/frame-a.png')
  })
})
