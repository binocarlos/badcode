// packages/cli/src/pull.test.ts
import { describe, it, expect } from 'vitest'
import { extractComicId, toSlug, buildAssetManifest, resolveAssetUrl } from './pull'
import type { StorytellerComic } from './storyteller-types'

describe('extractComicId', () => {
  it('extracts UUID from a full storyteller URL', () => {
    const url = 'https://badcode.tv/admin/comic/97a4cb4c-0f22-424c-96dd-8f6b5becb2df?type=page&viewId=1e408cf1'
    expect(extractComicId(url)).toBe('97a4cb4c-0f22-424c-96dd-8f6b5becb2df')
  })

  it('accepts a bare UUID', () => {
    expect(extractComicId('97a4cb4c-0f22-424c-96dd-8f6b5becb2df')).toBe('97a4cb4c-0f22-424c-96dd-8f6b5becb2df')
  })

  it('throws for a URL with no UUID', () => {
    expect(() => extractComicId('https://badcode.tv/admin')).toThrow('Could not find a comic UUID')
  })
})

describe('toSlug', () => {
  it('converts a name to kebab-case', () => {
    expect(toSlug('My Cool Comic')).toBe('my-cool-comic')
  })

  it('strips non-alphanumeric characters', () => {
    expect(toSlug("Bob's Adventure!")).toBe('bobs-adventure')
  })

  it('strips curly apostrophes', () => {
    expect(toSlug('Bob’s Adventure!')).toBe('bobs-adventure')
  })

  it('collapses multiple dashes', () => {
    expect(toSlug('  hello   world  ')).toBe('hello-world')
  })
})

describe('resolveAssetUrl', () => {
  it('passes an absolute http(s) URL through unchanged', () => {
    const url = 'https://storage.googleapis.com/badcode-storage/comics/x/page_1/main.jpg'
    expect(resolveAssetUrl(url)).toBe(url)
  })

  it('prefixes a bucket-relative key with the GCS base', () => {
    expect(resolveAssetUrl('comics/x/page_1/main.jpg')).toBe(
      'https://storage.googleapis.com/badcode-storage/comics/x/page_1/main.jpg',
    )
  })

  it('matches the protocol case-insensitively', () => {
    const url = 'HTTPS://storage.googleapis.com/badcode-storage/comics/x/main.jpg'
    expect(resolveAssetUrl(url)).toBe(url)
  })
})

describe('buildAssetManifest', () => {
  const comic: StorytellerComic = {
    id: 'test-id',
    config: {
      name: 'Test Comic',
      description: 'A test',
      style: 'gritty',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {
            main: {
              id: 'img1',
              media: { id: 'm1', prompt: '', media_type: 'image', path: 'comics/test/page_1/main.jpg' },
            },
          },
          text_bubbles: [],
        },
        {
          id: 'p2',
          layout: 'full',
          images: {
            main: {
              id: 'img2',
              media: { id: 'm2', prompt: '', media_type: 'image', path: 'comics/test/page_2/main.jpg' },
            },
          },
          text_bubbles: [],
          animation: {
            method: 'image_quick',
            frame_count: 3,
            transition_prompt: 'pan left',
            status: 'completed',
            frames: [
              { index: 0, path: 'comics/test/page_2/frame_000.jpg', url: '' },
              { index: 1, path: 'comics/test/page_2/frame_001.jpg', url: '' },
              { index: 2, path: 'comics/test/page_2/frame_002.jpg', url: '' },
            ],
          },
        },
      ],
    },
  }

  it('lists image downloads', () => {
    const manifest = buildAssetManifest(comic, 'test-comic')
    const imageAssets = manifest.filter(a => a.type === 'image')
    expect(imageAssets).toHaveLength(2)
    expect(imageAssets[0]).toEqual({
      type: 'image',
      remotePath: 'comics/test/page_1/main.jpg',
      localPath: 'apps/web/public/comics/test-comic/p1-main.jpg',
    })
  })

  it('lists animation frame downloads', () => {
    const manifest = buildAssetManifest(comic, 'test-comic')
    const frameAssets = manifest.filter(a => a.type === 'frame')
    expect(frameAssets).toHaveLength(3)
    expect(frameAssets[0]).toEqual({
      type: 'frame',
      remotePath: 'comics/test/page_2/frame_000.jpg',
      localPath: 'apps/web/public/comics/test-comic/p2-animation/frame-000.jpg',
    })
  })
})
