import { TextPage } from './TextPage'

export function ComicStub({ title }: { title: string }) {
  return (
    <TextPage title={title}>
      <p style={{ color: 'var(--grey)' }}>This story is still being drawn.</p>
      <p>It clips to the timeline, but the comic isn't published yet. Check back soon.</p>
    </TextPage>
  )
}
