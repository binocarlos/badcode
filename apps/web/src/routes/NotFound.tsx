import { TextPage } from './TextPage'

export function NotFound() {
  return (
    <TextPage title="404 — no such commit">
      <p style={{ color: 'var(--grey)' }}>That path isn't on any branch.</p>
    </TextPage>
  )
}
