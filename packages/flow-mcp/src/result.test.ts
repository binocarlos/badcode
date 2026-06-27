import { describe, it, expect } from 'vitest'
import { ok, fail, NOT_RUNNING_HINT } from './result'

describe('tool results', () => {
  it('wraps success data in text + structuredContent', () => {
    const r = ok({ path: '/tmp/p05.jpg', mediaId: 'uuid' })
    expect(r.isError).toBeUndefined()
    expect(r.structuredContent).toEqual({ path: '/tmp/p05.jpg', mediaId: 'uuid' })
    expect(JSON.parse(r.content[0].text)).toEqual({ path: '/tmp/p05.jpg', mediaId: 'uuid' })
  })

  it('marks failures and carries code/message/hint', () => {
    const r = fail('NOT_RUNNING', 'Chrome is not reachable on :9222', NOT_RUNNING_HINT)
    expect(r.isError).toBe(true)
    expect(JSON.parse(r.content[0].text)).toEqual({
      error: true,
      code: 'NOT_RUNNING',
      message: 'Chrome is not reachable on :9222',
      hint: NOT_RUNNING_HINT,
    })
  })

  it('omits hint when not provided', () => {
    const r = fail('TIMEOUT', 'generation timed out')
    expect(JSON.parse(r.content[0].text)).toEqual({
      error: true,
      code: 'TIMEOUT',
      message: 'generation timed out',
    })
  })
})
