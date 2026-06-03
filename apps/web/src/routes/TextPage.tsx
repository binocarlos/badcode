import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function TextPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px', lineHeight: 1.7 }}>
      <Link to="/" style={{ fontSize: 13 }}>← timeline</Link>
      <h1 style={{ letterSpacing: 2, marginTop: 24 }}>{title}</h1>
      {children}
    </main>
  )
}
