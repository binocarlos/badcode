import { useParams } from 'react-router-dom'
import { resolveComic } from '../home/comics'
import { ComicStub } from './ComicStub'
import { NotFound } from './NotFound'

export function ComicPage() {
  const { slug = '' } = useParams()
  const r = resolveComic(slug)
  if (r.kind === 'live') return <r.Component />
  if (r.kind === 'stub') return <ComicStub title={r.title} />
  return <NotFound />
}
