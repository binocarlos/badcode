// packages/cli/src/storyteller-auth.ts

export async function login(baseUrl: string, email: string, password: string): Promise<string> {
  const res = await fetch(`${baseUrl}/api/v1/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  }
  const data = (await res.json()) as { token: string }
  return data.token
}
