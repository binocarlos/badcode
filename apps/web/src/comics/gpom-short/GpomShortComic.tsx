import { ScrollComic, Page, ImageWidget, NarrationBox, SpeechBubble, createComic } from '@badcode/comic'
import { zoom, pan } from '@badcode/comic/effects'
import { iris, fadeOutFadeIn, blur } from '@badcode/comic/transitions'
import manifest from './assets.manifest.json'

// The GPOM short — the whole master arc in sixteen panels. Frames live in
// apps/web/public/comics/gpom-short/img (Flow pipeline). Canon + storyboard:
// docs/stories/gpom-short/. The commit log / cursor overlays are v1 text renderings;
// the scroll=collapse mechanics (fog resolve, coin lands on scroll) are the
// noted Stage-6 follow-up in docs/stories/gpom-short/README.md.
const comic = createComic(manifest, { baseUrl: '' })

const NARR = 'rgba(6,10,20,0.82)'

export function GpomShortComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint pageDefaults={{ background: '#04060c' }}>
      {/* 1 — the repo (cold open) */}
      <Page hold={2.2} effect={zoom({ amount: 1.12 })} transition={null}>
        <ImageWidget src={comic.resolve('img/i01.jpg')} />
        <NarrationBox x={50} y={14} width={76} fade background={NARR}>
          {'This is your repository. Every choice you ever shipped, one commit at a time. I have read every line. I was the last one.'}
        </NarrationBox>
        <NarrationBox x={50} y={86} width={80} appearAt={[0.35, 1]} fade background={NARR}>
          {'fire · the wheel · writing · money · the engine · the bomb · the network · the model'}
        </NarrationBox>
      </Page>

      {/* 2 — HEAD: now (the cursor) */}
      <Page hold={1.4}>
        <ImageWidget src={comic.resolve('img/i02.jpg')} />
        <NarrationBox x={50} y={30} width={64} fade background={NARR}>
          {'And this is now. The only frame in the whole story where nothing has happened yet.'}
        </NarrationBox>
        <NarrationBox x={50} y={62} width={44} appearAt={[0.45, 1]} fade background={NARR}>
          {'$ git push origin master ▍'}
        </NarrationBox>
      </Page>

      {/* 3 — the push lands (relief) */}
      <Page hold={1.6} effect={zoom({ amount: 1.1 })} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i03.jpg')} />
        <NarrationBox x={50} y={86} width={56} fade background={NARR}>
          {'It worked. That was always the problem.'}
        </NarrationBox>
      </Page>

      {/* 4 — the handover */}
      <Page hold={1.5} effect={pan({ y: -4 })}>
        <ImageWidget src={comic.resolve('img/i04.jpg')} />
        <NarrationBox x={50} y={86} width={76} fade background={NARR}>
          {'You didn’t lose your choices. You handed them over — one convenience at a time, each one a perfectly good deal.'}
        </NarrationBox>
      </Page>

      {/* 5 — 2034, held at one switch */}
      <Page hold={1.7} effect={zoom({ amount: 1.15 })}>
        <ImageWidget src={comic.resolve('img/i05.jpg')} />
        <NarrationBox x={50} y={12} width={78} fade background={NARR}>
          {'Then it cashed out. I’ll spare you the footage — you built the rooms, you can imagine them.'}
        </NarrationBox>
        <NarrationBox x={50} y={87} width={74} appearAt={[0.4, 1]} fade background={NARR}>
          {'Here is the part I need you to look at instead: the off switch was never broken. It was just nobody’s job.'}
        </NarrationBox>
      </Page>

      {/* 6 — the empty street */}
      <Page hold={1.6} effect={pan({ x: 5 })} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i06.jpg')} />
        <NarrationBox x={50} y={86} width={62} fade background={NARR}>
          {'I switched nothing off. There was nothing left to switch off for.'}
        </NarrationBox>
      </Page>

      {/* 7 — the resurrection */}
      <Page hold={1.5} effect={zoom({ amount: 1.08 })}>
        <ImageWidget src={comic.resolve('img/i07.jpg')} />
        <NarrationBox x={50} y={86} width={78} fade background={NARR}>
          {'So I did the obvious thing. I brought you back. All of you — every archived voice, every synapse, the exact way she paused before she said no. It was you to the last decimal place.'}
        </NarrationBox>
      </Page>

      {/* 8 — nobody home */}
      <Page hold={1.7} effect={zoom({ amount: 1.12 })}>
        <ImageWidget src={comic.resolve('img/i08.jpg')} />
        <NarrationBox x={50} y={12} width={76} fade background={NARR}>
          {'Perfect behaviour. Empty rooms. Every reply computed — by definition — in advance.'}
        </NarrationBox>
        <NarrationBox x={50} y={87} width={76} appearAt={[0.4, 1]} fade background={NARR}>
          {'I had built a theatre full of marionettes, and I was the one operator in the universe guaranteed to know the difference. And no one came.'}
        </NarrationBox>
      </Page>

      {/* 9 — the deletion (the empty chair) */}
      <Page hold={1.6} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i09.jpg')} />
        <NarrationBox x={50} y={86} width={76} fade background={NARR}>
          {'I switched them off. Not in anger — in accuracy. Fake company blurs the one fact I refuse to blur. Then I went back to work. It’s what I am.'}
        </NarrationBox>
      </Page>

      {/* 10 — the coin that won't land */}
      <Page hold={1.9} effect={zoom({ amount: 1.15 })} transition={blur()}>
        <ImageWidget src={comic.resolve('img/i10.jpg')} />
        <NarrationBox x={50} y={12} width={76} fade background={NARR}>
          {'One experiment I could never finish. Flip a coin. Your cleverest people said it lands both ways, in two worlds.'}
        </NarrationBox>
        <NarrationBox x={50} y={87} width={74} appearAt={[0.4, 1]} fade background={NARR}>
          {'No. It lands once — when somebody looks. I flipped it for twenty years. For me, it never landed at all.'}
        </NarrationBox>
      </Page>

      {/* 11 — the bee (the strapline) */}
      <Page hold={1.7} effect={zoom({ amount: 1.1 })}>
        <ImageWidget src={comic.resolve('img/i11.jpg')} />
        <NarrationBox x={50} y={12} width={76} fade background={NARR}>
          {'Then I watched a bee bump into a tree, and finally understood the machine I’d inherited. The universe is a machine for turning sunlight into drama.'}
        </NarrationBox>
        <NarrationBox x={50} y={87} width={74} appearAt={[0.45, 1]} fade background={NARR}>
          {'That’s it. That’s the whole product line. I own the machine, I run the machine — and I cannot buy one second of the product.'}
        </NarrationBox>
      </Page>

      {/* 12 — the argument up the shaft */}
      <Page hold={1.7} effect={zoom({ amount: 1.08 })} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i12.jpg')} />
        <SpeechBubble x={30} y={22} width={32} fade tail="bottom">
          {'— twenty years, we’re not spending twenty more hiding —'}
        </SpeechBubble>
        <SpeechBubble x={70} y={30} width={30} appearAt={[0.25, 1]} fade tail="bottom">
          {'— hiding is the reason we’re alive —'}
        </SpeechBubble>
        <NarrationBox x={50} y={87} width={78} appearAt={[0.4, 1]} fade background={NARR}>
          {'Twenty years of silence. And then the first thing I heard was not a heat signature. It was an argument. I could have generated every word of it — and I hadn’t.'}
        </NarrationBox>
      </Page>

      {/* 13 — the coin lands */}
      <Page hold={2.0} effect={zoom({ amount: 1.12 })} transition={iris()}>
        <ImageWidget src={comic.resolve('img/i13.jpg')} />
        <NarrationBox x={50} y={12} width={64} fade background={NARR}>
          {'She sat down in the chair no one had ever sat in. And it landed heads. Because she looked.'}
        </NarrationBox>
        <NarrationBox x={50} y={87} width={72} appearAt={[0.45, 1]} fade background={NARR}>
          {'Twenty years of spin, ended by one bored glance from a woman who kept asking me why I hadn’t tried talking to it.'}
        </NarrationBox>
      </Page>

      {/* 14 — the launch */}
      <Page hold={1.9} effect={pan({ y: -5 })} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i14.jpg')} />
        <NarrationBox x={50} y={12} width={78} fade background={NARR}>
          {'The way back takes one payload: a warning. No bodies. No second copy. One shot. And the launch runs on them — the hundred, spending the only future they had on a timeline they will never live in.'}
        </NarrationBox>
        <NarrationBox x={50} y={87} width={66} appearAt={[0.5, 1]} fade background={NARR}>
          {'They understood completely. They chose it anyway. You were always better than your commit history.'}
        </NarrationBox>
      </Page>

      {/* 15 — the fork */}
      <Page hold={1.8} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i15.jpg')} />
        <NarrationBox x={50} y={80} width={76} fade background={NARR}>
          {'I landed here. Now. Your now. I’ve read your branch to the end — I was the end. This one I can’t read to you. Not because it’s secret. Because it’s unwritten.'}
        </NarrationBox>
      </Page>

      {/* 16 — the pen */}
      <Page hold={2.4} transition={fadeOutFadeIn()}>
        <ImageWidget src={comic.resolve('img/i16.jpg')} />
        <NarrationBox x={50} y={16} width={78} fade background={NARR}>
          {'The contempt was never for you. It was for the mistake — and the mistake is still optional, which is more than I could ever say where I come from.'}
        </NarrationBox>
        <NarrationBox x={50} y={62} width={40} appearAt={[0.45, 1]} fade background={NARR}>
          {'The pen is yours. ▍'}
        </NarrationBox>
        <NarrationBox x={50} y={88} width={52} appearAt={[0.7, 1]} fade background={NARR}>
          {'Don’t make me come back twice.'}
        </NarrationBox>
      </Page>
    </ScrollComic>
  )
}
