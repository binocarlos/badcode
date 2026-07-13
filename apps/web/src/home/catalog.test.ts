import { describe, it, expect } from 'vitest'
import { channels, stories } from './catalog'

describe('catalog stories', () => {
  it('indexes exactly the four comics, GPOM first', () => {
    expect(stories.map((s) => s.id)).toEqual([
      'gitpush-origin-master',
      'camping',
      'karen',
      'magic-money-tree',
    ])
  })

  it('routes GPOM to its comic path', () => {
    const gpom = stories.find((s) => s.id === 'gitpush-origin-master')
    expect(gpom?.route).toBe('/comics/gitpush-origin-master')
  })

  it('gives every received story a route', () => {
    for (const s of stories.filter((s) => s.status === 'received')) {
      expect(s.route, `story '${s.id}' is received but has no route`).toBeTruthy()
    }
  })
})

describe('catalog channels', () => {
  it('never marks a url-less channel as received', () => {
    for (const c of channels.filter((c) => !c.url)) {
      expect(c.status, `channel '${c.id}' has no url`).not.toBe('received')
    }
  })
})
