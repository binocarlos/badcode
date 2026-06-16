// packages/cli/src/storyteller-auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from './storyteller-auth'

describe('login', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a JWT token on successful login', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'jwt-abc-123' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const token = await login('https://badcode.tv', 'user@test.com', 'pass123')

    expect(token).toBe('jwt-abc-123')
    expect(mockFetch).toHaveBeenCalledWith('https://badcode.tv/api/v1/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com', password: 'pass123' }),
    })
  })

  it('throws on failed login', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'unauthorized',
    }))

    await expect(login('https://badcode.tv', 'bad@test.com', 'wrong'))
      .rejects.toThrow('Login failed (401)')
  })
})
