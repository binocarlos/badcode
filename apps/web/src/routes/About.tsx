import { TextPage } from './TextPage'

export function About() {
  return (
    <TextPage title="BadCode">
      <p>BadCode is an art collective broadcasting from a future that already went wrong.</p>
      <p>
        The conceit: humanity ran <code>git push origin master</code> on its worst code — greed,
        runaway inequality, politics that couldn't keep pace with its own machines — and shipped it
        straight to production with no review. This homepage is that repository. Walk its history,
        reach the fork, and choose a branch.
      </p>
      <p>
        The bad branch ends in the <a href="/storyverse">Storyverse</a>. The good branch ends in{' '}
        <a href="/future-proof">Future Proof</a>. We are here to make sure you take the second one.
      </p>
    </TextPage>
  )
}
