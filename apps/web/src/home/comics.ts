import type { ComponentType } from 'react'
import { CampingComic } from '../comics/camping/CampingComic'
import { KarenComic } from '../comics/karen/KarenComic'
import { homeSteps } from './timeline'

export type ComicResolution =
  | { kind: 'live'; title: string; Component: ComponentType }
  | { kind: 'stub'; title: string }
  | { kind: 'not-found' }

/** Live comics: slug → component. Add an entry here when a comic ships. */
const liveComics: Record<string, ComponentType> = {
  camping: CampingComic,
  karen: KarenComic,
}

export function resolveComic(slug: string): ComicResolution {
  const Component = liveComics[slug]
  const node = homeSteps.find((n) => n.route === `/comics/${slug}`)
  // A registered live component renders directly, even if it has no timeline beat.
  if (Component && (!node || node.status === 'live')) {
    return { kind: 'live', title: node?.title ?? slug, Component }
  }
  if (!node) return { kind: 'not-found' }
  return { kind: 'stub', title: node.title }
}
