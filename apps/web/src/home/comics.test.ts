import { describe, it, expect } from 'vitest'
import { resolveComic } from './comics'

describe('resolveComic', () => {
  it('resolves a live comic to a component', () => {
    const r = resolveComic('camping')
    expect(r.kind).toBe('live')
    if (r.kind === 'live') expect(typeof r.Component).toBe('function')
  })

  it('resolves a known coming-soon comic to a stub with its title', () => {
    const r = resolveComic('emperors-coin')
    expect(r.kind).toBe('stub')
    if (r.kind === 'stub') expect(r.title).toContain('Emperor')
  })

  it('resolves an unknown slug to not-found', () => {
    expect(resolveComic('does-not-exist').kind).toBe('not-found')
  })

  it('resolves the second shipped comic (karen) to a live component', () => {
    const r = resolveComic('karen')
    expect(r.kind).toBe('live')
    if (r.kind === 'live') expect(typeof r.Component).toBe('function')
  })
})
