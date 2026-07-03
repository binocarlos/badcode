import { useParams, useNavigate } from 'react-router-dom'
import { resolveComic } from '../home/comics'
import { homeSteps } from '../home/timeline'
import { ComicStub } from './ComicStub'
import { NotFound } from './NotFound'

function BackToTimeline({ slug }: { slug: string }) {
  const navigate = useNavigate()
  // Comics with an Atlas node return to the GPOM timeline focused on that
  // node; the rest return up to the BadCode index.
  const onAtlas = homeSteps.some((n) => n.route === `/comics/${slug}`)
  const target = onAtlas ? `/gitpush-origin-master#${slug}` : '/'
  return (
    <button
      onClick={() => navigate(target)}
      style={{ position: 'fixed', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.6)', border: '1px solid var(--cyan)', color: 'var(--cyan)', font: 'inherit', fontSize: 12, padding: '6px 10px', cursor: 'pointer' }}
    >
      {onAtlas ? '← timeline' : '← badcode'}
    </button>
  )
}

export function ComicPage() {
  const { slug = '' } = useParams()
  const r = resolveComic(slug)
  if (r.kind === 'live') {
    return (
      <>
        <BackToTimeline slug={slug} />
        <r.Component />
      </>
    )
  }
  if (r.kind === 'stub') return <ComicStub title={r.title} />
  return <NotFound />
}
