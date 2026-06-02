import { ScrollComic, Page, ImageWidget, SpeechBubble, NarrationBox, SidePanelText } from '@badcode/comic'
import { zoom, grayscale, zoomInOut, pan } from '@badcode/comic/effects'
import { crossfade, iris, fadeOutFadeIn } from '@badcode/comic/transitions'
import { scrollIn, fadeIn, fadeOut, pause } from '@badcode/comic/text'
import meta from './comic.meta'
import { resolve } from '@badcode/comic-meta'

/**
 * "Camping" — EP1, track 1. A code-first comic. This is a placeholder-art
 * vertical slice that exercises the @badcode/comic engine end to end: the
 * scroll→progress mapping, four effect types, three transitions, scroll-gated
 * speech/thought/narration bubbles, and scroll-linked side text.
 */
export function CampingComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint>
      {/* 1 — the celebration. Slow zoom toward the gold halo. */}
      <Page scrollDuration={1.4} effect={zoom({ amount: 1.4, focal: [0.75, 0.27] })} background="#0a0f1c">
        <ImageWidget src={resolve(meta, 'p1-main')} />
        <SidePanelText reveal={[fadeIn(), pause(0.3), fadeOut()]} background="dark-glass">
          <h1 style={{ margin: '0 0 12px', fontSize: 34 }}>Camping</h1>
          <p style={{ margin: 0 }}>
            Tarquin just closed the biggest deal of his career. He has done everything right.
            He is completely unprepared for what is coming.
          </p>
        </SidePanelText>
      </Page>

      {/* 2 — the car park. Color drains to grey as we meet Bob. Rough speech bubble. */}
      <Page
        scrollDuration={1.6}
        effect={grayscale()}
        transition={crossfade({ duration: 700 })}
        background="#15140f"
      >
        <ImageWidget src={resolve(meta, 'p2-main')} />
        <SpeechBubble x={28} y={64} appearAt={[0.15, 0.75]} fade renderer="rough">
          Spare any change, mate?
        </SpeechBubble>
        <SidePanelText reveal={[scrollIn(), pause(0.25), fadeOut()]}>
          <p style={{ margin: 0 }}>
            A man named Bob asks for change outside the Waitrose. Tarquin clocks the beer cans
            and decides he knows the whole story. He doesn't.
          </p>
        </SidePanelText>
      </Page>

      {/* 3 — the ghost. A breathing zoom; iris-in; a rough thought bubble. */}
      <Page
        scrollDuration={1.6}
        effect={zoomInOut({ peak: 1.3 })}
        transition={iris({ duration: 800 })}
        background="#03040a"
      >
        <ImageWidget src={resolve(meta, 'p3-main')} />
        <SpeechBubble x={62} y={30} appearAt={[0.2, 0.8]} fade type="thought" renderer="rough">
          I am the Ghost of Economic Future. Let me show you how Bob got here…
        </SpeechBubble>
        <SidePanelText reveal={[fadeIn(), fadeOut()]} position="left">
          <p style={{ margin: 0 }}>
            GEOFF replays 2008, a motorway, a drunk banker in a 4×4. None of it was a choice
            Bob made.
          </p>
        </SidePanelText>
      </Page>

      {/* 4 — five years later. A slow pan; sequential fade; narration + payoff bubble. */}
      <Page
        scrollDuration={1.6}
        effect={pan({ x: -8, scale: 1.2 })}
        transition={fadeOutFadeIn({ duration: 800 })}
        background="#0c0808"
      >
        <ImageWidget src={resolve(meta, 'p4-main')} />
        <NarrationBox x={50} y={14} appearAt={[0, 0.5]} fade>
          Five years later.
        </NarrationBox>
        <SpeechBubble x={64} y={66} appearAt={[0.45, 0.98]} fade renderer="rough">
          Here. Take it. You look like you need it more than me.
        </SpeechBubble>
        <SidePanelText
          reveal={[scrollIn(), fadeOut()]}
          background="gradient-dark"
          position="bottom"
          width={760}
        >
          <p style={{ margin: 0 }}>
            The Waitrose is boarded up. 99% unemployment. And it's Bob — still homeless — who
            shows Tarquin kindness. Humans, please don't make this obvious mistake.
          </p>
        </SidePanelText>
      </Page>
    </ScrollComic>
  )
}
