import { describe, it, expect } from 'vitest'
import { NAME, VERSION } from './version'

describe('version', () => {
  it('exposes the server name', () => {
    expect(NAME).toBe('flow')
  })
  it('exposes a semver string', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
