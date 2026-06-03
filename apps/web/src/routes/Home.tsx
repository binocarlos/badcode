import { Link } from 'react-router-dom'

// TEMPORARY body — replaced by the 3D scene / 2D fallback in later tasks.
export function Home() {
  return (
    <main style={{ padding: 48 }}>
      <h1 style={{ letterSpacing: 4 }}>BADCODE</h1>
      <p style={{ color: 'var(--grey)' }}>git push origin master</p>
      <ul>
        <li><Link to="/comics/camping">Camping (live)</Link></li>
        <li><Link to="/comics/karen">Karen (stub)</Link></li>
        <li><Link to="/storyverse">Storyverse</Link></li>
        <li><Link to="/future-proof">Future Proof</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </main>
  )
}
