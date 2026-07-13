import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { BadCodeHome } from './routes/BadCodeHome'
import { Home } from './routes/Home'
import { ComicPage } from './routes/ComicPage'
import { About } from './routes/About'
import { Storyverse } from './routes/Storyverse'
import { FutureProof } from './routes/FutureProof'
import { NotFound } from './routes/NotFound'

/** The Atlas used to live at /gitpush-origin-master; keep old links (and their
 *  #node deep links) working. */
function LegacyAtlasRedirect() {
  const { hash } = useLocation()
  return <Navigate to={`/comics/gitpush-origin-master${hash}`} replace />
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BadCodeHome />} />
        <Route path="/comics/gitpush-origin-master" element={<Home />} />
        <Route path="/gitpush-origin-master" element={<LegacyAtlasRedirect />} />
        <Route path="/comics/:slug" element={<ComicPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/storyverse" element={<Storyverse />} />
        <Route path="/future-proof" element={<FutureProof />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
