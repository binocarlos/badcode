import { ScrollComic, Page, ImageWidget, NarrationBox, SpeechBubble, createComic } from '@badcode/comic'
import { zoom, pan, zoomInOut } from '@badcode/comic/effects'
import { iris, fadeOutFadeIn, blur } from '@badcode/comic/transitions'
import manifest from './assets.manifest.json'

// Frames live in apps/web/public/comics/magic-money-tree/img (generated via the
// Flow automation pipeline). baseUrl '' resolves them from the site root, not the
// asset bucket. See docs/magic-money-tree/ for the canon + storyboard.
const comic = createComic(manifest, { baseUrl: '' })

const NARR = 'rgba(10,15,28,0.82)'

export function MagicMoneyTreeComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint pageDefaults={{ background: '#05070d' }}>
      {/* 1 — the work */}
      <Page hold={1.8} effect={zoom({ amount: 1.15 })} transition={null}>
        <ImageWidget src={comic.resolve('img/i01.jpg')} />
        <NarrationBox x={50} y={84} width={74} fade background={NARR}>
          {'This is Dawn. She keeps strangers alive for a living. The system that runs on her is about to teach her some arithmetic.'}
        </NarrationBox>
      </Page>

      {/* 2 — the line */}
      <Page hold={1.6}>
        <ImageWidget src={comic.resolve('img/i02.jpg')} />
        <SpeechBubble x={28} y={34} width={34} fade tail="top">
          {'There’s no magic money tree, Dawn.'}
        </SpeechBubble>
        <NarrationBox x={50} y={86} width={76} fade background={NARR}>
          {'She asked for a little more — for the ward, for herself. They told her the oldest bedtime story in the country.'}
        </NarrationBox>
      </Page>

      {/* 3 — same maths at home */}
      <Page hold={1.6} effect={zoom({ amount: 1.1 })}>
        <ImageWidget src={comic.resolve('img/i03.jpg')} />
        <NarrationBox x={50} y={85} width={74} fade background={NARR}>
          {'At home, the same maths. No money for the ward. No money for her mum. No money, no money, no money.'}
        </NarrationBox>
      </Page>

      {/* 4 — the trick */}
      <Page hold={1.4} effect={zoom({ amount: 1.25 })} transition={blur()}>
        <ImageWidget src={comic.resolve('img/i04.jpg')} />
        <NarrationBox x={50} y={85} width={60} fade background={NARR}>
          {'And then the telly did a magic trick.'}
        </NarrationBox>
      </Page>

      {/* 5 — bailout */}
      <Page hold={1.5} effect={pan({ y: -6 })} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i05.jpg')} />
        <NarrationBox x={50} y={86} width={76} fade background={NARR}>
          {'2008. For the people who broke it: found instantly. Five hundred billion, no questions asked.'}
        </NarrationBox>
      </Page>

      {/* 6 — QE */}
      <Page hold={1.5} effect={zoomInOut({ peak: 1.15 })}>
        <ImageWidget src={comic.resolve('img/i06.jpg')} />
        <NarrationBox x={50} y={86} width={76} fade background={NARR}>
          {'Eight hundred and ninety-five billion. Conjured from nothing. No tree required, apparently.'}
        </NarrationBox>
      </Page>

      {/* 7 — war */}
      <Page hold={1.5} effect={pan({ x: 6 })}>
        <ImageWidget src={comic.resolve('img/i07.jpg')} />
        <NarrationBox x={50} y={86} width={76} fade background={NARR}>
          {'And for the things that end lives: a blank cheque, and a standing ovation.'}
        </NarrationBox>
      </Page>

      {/* 8 — the arithmetic */}
      <Page hold={1.7} effect={zoom({ amount: 1.12 })} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i08.jpg')} />
        <NarrationBox x={50} y={86} width={70} fade background={NARR}>
          {'So Dawn did the arithmetic they hoped she never would.'}
        </NarrationBox>
      </Page>

      {/* 9 — the reveal */}
      <Page hold={2.0} effect={zoom({ amount: 1.2 })} transition={iris()}>
        <ImageWidget src={comic.resolve('img/i09.jpg')} />
        <NarrationBox x={50} y={86} width={72} fade background={NARR}>
          {'The tree was always real. It just never shook for her.'}
        </NarrationBox>
      </Page>

      {/* 10 — the warning */}
      <Page hold={2.4} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i10.jpg')} />
        <NarrationBox x={50} y={16} width={80} appearAt={[0.04, 1]} fade background={NARR}>
          {'We let three little words — we can’t afford it — decide who got to live. It was never true. It was never a tree. It was a choice, with a press release.'}
        </NarrationBox>
        <NarrationBox x={50} y={88} width={70} appearAt={[0.45, 1]} fade background={NARR}>
          {'You still have time to notice. Don’t make us say we told you so.'}
        </NarrationBox>
      </Page>
    </ScrollComic>
  )
}
