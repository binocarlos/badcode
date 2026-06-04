import type { ComponentType } from 'react'
import { CampingComic } from '../comics/camping/CampingComic'
import { homeSteps } from './timeline'

export type ComicResolution =
  | { kind: 'live'; title: string; Component: ComponentType }
  | { kind: 'stub'; title: string }
  | { kind: 'not-found' }

/** Live comics: slug → component. Add an entry here when a comic ships. */
const liveComics: Record<string, ComponentType> = {
  camping: CampingComic,
}

export function resolveComic(slug: string): ComicResolution {
  const node = homeSteps.find((n) => n.route === `/comics/${slug}`)
  if (!node) return { kind: 'not-found' }
  const Component = liveComics[slug]
  if (node.status === 'live' && Component) return { kind: 'live', title: node.title, Component }
  return { kind: 'stub', title: node.title }
}
