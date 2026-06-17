import { describe, it, expect } from 'vitest'
import { pickImageSrc } from './pickImageSrc'

const asset = { thumb: 'data:thumb', low: 'LOW', high: 'HIGH', width: 1, height: 1 }

describe('pickImageSrc', () => {
  it('shows high when it is ready', () => {
    expect(pickImageSrc(asset, true, true)).toBe('HIGH')
    expect(pickImageSrc(asset, false, true)).toBe('HIGH')
  })
  it('shows low when low is ready but high is not', () => {
    expect(pickImageSrc(asset, true, false)).toBe('LOW')
  })
  it('shows nothing (empty) when neither tier is ready (thumb shows underneath)', () => {
    expect(pickImageSrc(asset, false, false)).toBe('')
  })
})
