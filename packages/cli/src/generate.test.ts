// packages/cli/src/generate.test.ts
import { describe, it, expect } from 'vitest'
import ts from 'typescript'
import { clampFontSize, generateMeta, generateTsx, htmlToText, toPascalCase } from './generate'
import type { StorytellerComicConfig } from './storyteller-types'

const sampleConfig: StorytellerComicConfig = {
  name: 'Test Comic',
  description: 'A test comic',
  style: 'gritty ink',
  characters: [
    { id: 'char1', name: 'Alice', description: 'A brave hero' },
  ],
  pages: [
    {
      id: 'p1',
      layout: 'full',
      images: {
        main: {
          id: 'img1',
          media: { id: 'm1', prompt: 'a dark forest', media_type: 'image', path: 'comics/test/page_1/main.jpg' },
        },
      },
      text_bubbles: [
        {
          id: 'b1',
          type: 'speech',
          text: 'Hello world',
          x: 30,
          y: 60,
          start_percent: 0.1,
          end_percent: 0.8,
          direction: 'bottom-left-left',
          renderer: 'rough',
        },
      ],
    },
    {
      id: 'p2',
      layout: 'full',
      images: {
        main: {
          id: 'img2',
          media: { id: 'm2', prompt: 'a bright city', media_type: 'image', path: 'comics/test/page_2/main.jpg' },
        },
      },
      text_bubbles: [
        {
          id: 'b2',
          type: 'narration',
          text: 'Meanwhile...',
          x: 50,
          y: 20,
          start_percent: 0,
          end_percent: 0.5,
        },
      ],
    },
  ],
}

describe('clampFontSize', () => {
  it('floors tiny relative values to 10px (so text is not invisible)', () => {
    expect(clampFontSize(1.2)).toBe(10)
    expect(clampFontSize(1.8)).toBe(10)
  })
  it('caps large values at 24px', () => {
    expect(clampFontSize(30)).toBe(24)
  })
  it('passes through reasonable px values', () => {
    expect(clampFontSize(16)).toBe(16)
  })
})

describe('generateTsx font size', () => {
  it('emits a clamped fontSize for a tiny storyteller font_size', () => {
    const cfg: StorytellerComicConfig = {
      name: 'F', description: '', style: '', characters: [],
      pages: [{
        id: 'p1', layout: 'full',
        images: { main: { id: 'i', media: { id: 'm', prompt: '', media_type: 'image', path: 'comics/x/main.jpg' } } },
        text_bubbles: [{ id: 'b', type: 'speech', text: 'Hi', x: 10, y: 10, font_size: 1.2 }],
      }],
    }
    const out = generateTsx(cfg, 'f')
    expect(out).toContain('fontSize={10}')
    expect(out).not.toContain('fontSize={1.2}')
  })
})

describe('htmlToText', () => {
  it('strips tags and keeps text', () => {
    const out = htmlToText('<p><strong>Tarquin</strong>, worth <strong>millions!</strong></p>')
    expect(out).toBe('Tarquin, worth millions!')
    expect(out).not.toContain('<')
  })

  it('decodes named entities with &amp; last', () => {
    expect(htmlToText('&quot;Bebas&quot; &amp; &rsquo;x')).toBe('"Bebas" & ’x')
  })

  it('turns <br> into a newline', () => {
    expect(htmlToText('a<br>b')).toContain('a\nb')
  })
})

describe('toPascalCase', () => {
  it('converts kebab-case to PascalCase', () => {
    expect(toPascalCase('test-comic')).toBe('TestComic')
  })

  it('handles single word', () => {
    expect(toPascalCase('camping')).toBe('Camping')
  })
})

describe('generateMeta', () => {
  it('produces valid meta file content', () => {
    const output = generateMeta(sampleConfig, 'test-comic')
    expect(output).toContain("id: 'test-comic'")
    expect(output).toContain("alice:")
    expect(output).toContain("name: 'Alice'")
    expect(output).toContain("'p1-main':")
    expect(output).toContain("kind: 'image'")
    expect(output).toContain("scene: 'a dark forest'")
  })
})

describe('generateTsx', () => {
  it('produces a valid TSX component', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('export function TestComicComic()')
    expect(output).toContain('<ScrollComic')
    expect(output).toContain('<ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/test/page_1/main.jpg"')
    expect(output).toContain('<SpeechBubble')
    expect(output).toContain('x={30}')
    expect(output).toContain('y={60}')
    expect(output).toContain('appearAt={[0.1, 0.8]}')
    expect(output).toContain('tail="bottom-left"')
    expect(output).toContain('renderer="rough"')
    expect(output).toContain('Hello world')
  })

  it('maps narration bubbles to NarrationBox', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('<NarrationBox')
    expect(output).toContain('Meanwhile...')
  })

  it('applies zoom effect to first page', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('zoom({ amount: 1.3 })')
  })

  it('relies on the library default transition — no per-page crossfade', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).not.toContain('crossfade')
    expect(output).toContain('pageDefaults={{ background: ')
  })

  it('emits hold and a null opener transition', () => {
    const output = generateTsx(sampleConfig, 'test-comic')
    expect(output).toContain('hold={1.4}')
    expect(output).toContain('transition={null}')
  })

  it('emits remote bucket URLs for animation frames in ascending index order', () => {
    const animConfig: StorytellerComicConfig = {
      name: 'Anim',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {},
          text_bubbles: [],
          animation: {
            method: 'frames',
            frame_count: 3,
            transition_prompt: '',
            status: 'done',
            frames: [
              { index: 3, path: 'comics/anim/page_1/frame_3.png', url: '' },
              { index: 1, path: 'comics/anim/page_1/frame_1.png', url: '' },
              { index: 2, path: 'comics/anim/page_1/frame_2.png', url: '' },
            ],
          },
        },
      ],
    }
    const output = generateTsx(animConfig, 'anim-test')
    expect(output).toContain('<AnimationWidget')
    expect(output).toContain("'https://storage.googleapis.com/badcode-storage/comics/anim/page_1/frame_1.png'")
    expect(output).toContain("'https://storage.googleapis.com/badcode-storage/comics/anim/page_1/frame_2.png'")
    expect(output).toContain("'https://storage.googleapis.com/badcode-storage/comics/anim/page_1/frame_3.png'")
    // ascending frame.index order regardless of array order
    const i1 = output.indexOf('frame_1.png')
    const i2 = output.indexOf('frame_2.png')
    const i3 = output.indexOf('frame_3.png')
    expect(i1).toBeLessThan(i2)
    expect(i2).toBeLessThan(i3)
  })

  it('skips animation frames with no path', () => {
    const animConfig: StorytellerComicConfig = {
      name: 'Anim',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {},
          text_bubbles: [],
          animation: {
            method: 'frames',
            frame_count: 2,
            transition_prompt: '',
            status: 'done',
            frames: [
              { index: 1, path: 'comics/anim/page_1/frame_1.png', url: '' },
              { index: 2, path: '', url: '' },
            ],
          },
        },
      ],
    }
    const output = generateTsx(animConfig, 'anim-test')
    expect(output).toContain("'https://storage.googleapis.com/badcode-storage/comics/anim/page_1/frame_1.png'")
    expect(output).not.toContain('frame_2')
  })

  it('emits an absolute image path unchanged (no double-prefix)', () => {
    const absConfig: StorytellerComicConfig = {
      name: 'Abs',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {
            main: {
              id: 'img1',
              media: {
                id: 'm1',
                prompt: 'x',
                media_type: 'image',
                path: 'https://storage.googleapis.com/badcode-storage/x/main.png',
              },
            },
          },
          text_bubbles: [],
        },
      ],
    }
    const output = generateTsx(absConfig, 'abs')
    expect(output).toContain('<ImageWidget src="https://storage.googleapis.com/badcode-storage/x/main.png"')
    expect(output).not.toContain('badcode-storage/https')
  })

  it('emits bubble text as a string expression with proper escapes', () => {
    const trickyConfig: StorytellerComicConfig = {
      name: 'Tricky',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {
            main: {
              id: 'img1',
              media: { id: 'm1', prompt: 'x', media_type: 'image', path: 'comics/t/page_1/main.jpg' },
            },
          },
          text_bubbles: [
            {
              id: 'b1',
              type: 'speech',
              text: "Don't &lt;stop&gt; {now}",
              x: 10,
              y: 10,
              start_percent: 0,
              end_percent: 1,
            },
          ],
        },
      ],
    }
    const output = generateTsx(trickyConfig, 'tricky')
    expect(output).toContain("{'Don\\'t <stop> {now}'}")
  })

  it('emits TSX that parses without diagnostics', () => {
    const mixedConfig: StorytellerComicConfig = {
      name: 'Mixed',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {
            main: {
              id: 'img1',
              media: { id: 'm1', prompt: 'x', media_type: 'image', path: 'comics/m/page_1/main.jpg' },
            },
          },
          text_bubbles: [
            {
              id: 'b1',
              type: 'speech',
              text: "Don't <stop> {now} 'quoted'",
              x: 10,
              y: 10,
              start_percent: 0,
              end_percent: 1,
              direction: 'top-right',
              renderer: 'rough',
            },
            {
              id: 'b2',
              type: 'narration',
              text: 'line one\nline <two> {three}',
              x: 50,
              y: 20,
              start_percent: 0,
              end_percent: 0.5,
            },
          ],
        },
        {
          id: 'p2',
          layout: 'full',
          images: {},
          text_bubbles: [],
          animation: {
            method: 'frames',
            frame_count: 2,
            transition_prompt: '',
            status: 'done',
            frames: [
              { index: 0, path: 'comics/m/page_2/frame_0.png', url: '' },
              { index: 1, path: 'comics/m/page_2/frame_1.png', url: '' },
            ],
          },
        },
      ],
    }
    const output = generateTsx(mixedConfig, 'mixed')
    const sourceFile = ts.createSourceFile('x.tsx', output, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const diagnostics = (sourceFile as unknown as { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics
    expect(diagnostics.map(d => d.messageText)).toEqual([])
  })

  it('converts rich-text HTML bubble content to clean text', () => {
    const htmlConfig: StorytellerComicConfig = {
      name: 'Html',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        {
          id: 'p1',
          layout: 'full',
          images: {
            main: {
              id: 'img1',
              media: { id: 'm1', prompt: 'x', media_type: 'image', path: 'comics/h/page_1/main.jpg' },
            },
          },
          text_bubbles: [
            {
              id: 'b1',
              type: 'speech',
              text: '<p><span style="font-size: 14pt; font-family: &quot;Bebas Neue&quot;, sans-serif;">Hello &amp; bye</span></p>',
              x: 10,
              y: 10,
              start_percent: 0,
              end_percent: 1,
            },
          ],
        },
      ],
    }
    const output = generateTsx(htmlConfig, 'html')
    expect(output).toContain("{'Hello & bye'}")
    expect(output).not.toContain('<span')
    expect(output).not.toContain('<p')
    const sourceFile = ts.createSourceFile('x.tsx', output, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const diagnostics = (sourceFile as unknown as { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics
    expect(diagnostics.map(d => d.messageText)).toEqual([])
  })

  it('emits a NarrationBox placeholder for a content-less page', () => {
    const emptyPageConfig: StorytellerComicConfig = {
      name: 'Empty',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        { id: 'p1', layout: 'full', images: {}, text_bubbles: [] },
      ],
    }
    const output = generateTsx(emptyPageConfig, 'empty')
    expect(output).toContain('<NarrationBox')
    expect(output).toContain("{'TODO: empty page'}")
    expect(output).toContain('NarrationBox }') // present in the @badcode/comic import list
    const sourceFile = ts.createSourceFile('x.tsx', output, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const diagnostics = (sourceFile as unknown as { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics
    expect(diagnostics.map(d => d.messageText)).toEqual([])
  })

  it('imports NarrationBox for an all-empty-pages comic', () => {
    const allEmptyConfig: StorytellerComicConfig = {
      name: 'All Empty',
      description: '',
      style: 'ink',
      characters: [],
      pages: [
        { id: 'p1', layout: 'full', images: {}, text_bubbles: [] },
        { id: 'p2', layout: 'full', images: {}, text_bubbles: [] },
      ],
    }
    const output = generateTsx(allEmptyConfig, 'all-empty')
    expect(output).toContain("import { ScrollComic, Page, NarrationBox } from '@badcode/comic'")
    const sourceFile = ts.createSourceFile('x.tsx', output, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const diagnostics = (sourceFile as unknown as { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics
    expect(diagnostics.map(d => d.messageText)).toEqual([])
  })
})
