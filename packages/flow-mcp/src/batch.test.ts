import { describe, it, expect } from 'vitest'
import { batchOutPath } from './batch'

describe('batchOutPath', () => {
  it('zero-pads the index to 2 digits and uses .jpg', () => {
    expect(batchOutPath('/out', 0)).toBe('/out/00.jpg')
    expect(batchOutPath('/out', 7)).toBe('/out/07.jpg')
    expect(batchOutPath('/out', 12)).toBe('/out/12.jpg')
  })
  it('does not double a trailing slash', () => {
    expect(batchOutPath('/out/', 1)).toBe('/out/01.jpg')
  })
})
