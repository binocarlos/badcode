import { useParams, useNavigate } from 'react-router-dom'
import { resolveComic } from '../home/comics'
import { ComicStub } from './ComicStub'
import { NotFound } from './NotFound'

function BackToIndex() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/')}
      style={{ position: 'fixed', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.6)', border: '1px solid var(--cyan)', color: 'var(--cyan)', font: 'inherit', fontSize: 12, padding: '6px 10px', cursor: 'pointer' }}
    >
      ← badcode
    </button>
  )
}

export function ComicPage() {
  const { slug = '' } = useParams()
  const r = resolveComic(slug)
  if (r.kind === 'live') {
    return (
      <>
        <BackToIndex />
        <r.Component />
      </>
    )
  }
  if (r.kind === 'stub') return <ComicStub title={r.title} />
  return <NotFound />
}
