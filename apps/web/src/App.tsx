import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './routes/Home'
import { ComicPage } from './routes/ComicPage'
import { About } from './routes/About'
import { Storyverse } from './routes/Storyverse'
import { FutureProof } from './routes/FutureProof'
import { NotFound } from './routes/NotFound'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comics/:slug" element={<ComicPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/storyverse" element={<Storyverse />} />
        <Route path="/future-proof" element={<FutureProof />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
