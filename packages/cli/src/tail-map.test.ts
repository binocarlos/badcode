import { describe, it, expect } from 'vitest'
import { mapTailDirection } from './tail-map'

describe('mapTailDirection', () => {
  it('maps top-center to top', () => {
    expect(mapTailDirection('top-center')).toBe('top')
  })

  it('maps bottom-left-left to bottom-left', () => {
    expect(mapTailDirection('bottom-left-left')).toBe('bottom-left')
  })

  it('maps bottom-right-right to bottom-right', () => {
    expect(mapTailDirection('bottom-right-right')).toBe('bottom-right')
  })

  it('maps top-left to top-left', () => {
    expect(mapTailDirection('top-left')).toBe('top-left')
  })

  it('maps top-right-right to top-right', () => {
    expect(mapTailDirection('top-right-right')).toBe('top-right')
  })

  it('maps bottom-center to bottom', () => {
    expect(mapTailDirection('bottom-center')).toBe('bottom')
  })

  it('returns none for undefined', () => {
    expect(mapTailDirection(undefined)).toBe('none')
  })

  it('returns none for empty string', () => {
    expect(mapTailDirection('')).toBe('none')
  })

  it('returns none for unknown direction', () => {
    expect(mapTailDirection('something-weird')).toBe('none')
  })
})
