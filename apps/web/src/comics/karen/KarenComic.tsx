import { ScrollComic, Page, ImageWidget, AnimationWidget, SpeechBubble , createComic } from '@badcode/comic'
import manifest from './assets.manifest.json'
import { zoom } from '@badcode/comic/effects'
import { crossfade } from '@badcode/comic/transitions'
// Other effects/transitions available: grayscale, zoomInOut, pan, scale | iris, fadeOutFadeIn, slideOver, blur, wipe | scrollIn, fadeIn, fadeOut, pause (see @badcode/comic docs)

const comic = createComic(manifest)

export function KarenComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint>
      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        effect={zoom({ amount: 1.3 })}
        background="#0a0f1c"
      >
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i01.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a01')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i02.png')} />
        <SpeechBubble x={55.769230769230774} y={75.01608035228341} fade tail="top">
          {'I’ve fired 8 people this week for micro-aggressions, little man, do you want to be next?'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i03.png')} />
        <SpeechBubble x={55.852842809364546} y={75.01608035228341} fade tail="top">
          {'Now, shoe boy, I’ve got important work to do, unlike some of us.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i04.png')} />
        <SpeechBubble x={66.38665342809364} y={60.78601189082909} fade type="thought" tail="none">
          {'Karen microwaving fish... again, kill me please, Lord.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i05.png')} />
        <SpeechBubble x={69.22815635451505} y={68.42610364683301} fade tail="none">
          {'Make sure you get that spot at the back, do you need me to tell you how to do your oh so complex job, hun?'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a02')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i06.png')} />
        <SpeechBubble x={61.7056856187291} y={64.68096062918403} fade tail="none">
          {'I\'m sorry Karen, I have to let you go, AI Shaun has deemed the entire HR Department completly useless, not to kick you while you are down or anything.'}
        </SpeechBubble>
        <SpeechBubble x={14.378658026755852} y={23.18477599363326} fade type="thought" tail="none">
          {'The fucking gall...'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a03')} />
        <SpeechBubble x={61.7056856187291} y={64.68096062918403} fade tail="none">
          {'I\'m sorry Karen, I have to let you go, AI Shaun has deemed the entire HR Department completly useless, not to kick you while you are down or anything.'}
        </SpeechBubble>
        <SpeechBubble x={14.378658026755852} y={23.18477599363326} fade type="thought" tail="none">
          {'The fucking gall...'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i07.png')} />
        <SpeechBubble x={59.27963001672241} y={70.82018541620802} fade tail="top">
          {'So you got replaced by AI. What does a robot know about people?'}
        </SpeechBubble>
        <SpeechBubble x={30.935148411371237} y={71.44639318999046} fade tail="none">
          {'The injustice of this heinous crime should be shouted from the rooftops, being victimised by the oppressive…'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i08.png')} />
        <SpeechBubble x={42.558528428093645} y={59.02478848151996} fade tail="top">
          {'Get out of the way, that’s right, pedal away, pumpkin!'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i09.png')} />
        <SpeechBubble x={14.54849498327759} y={33.22175928093254} fade tail="none">
          {'The gall...'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i10.png')} />
        <SpeechBubble x={14.54849498327759} y={33.22175928093254} fade tail="none">
          {'What are they gonna do without me?'}
        </SpeechBubble>
        <SpeechBubble x={52.4247491638796} y={85.95103225504424} fade tail="none">
          {'Who will whip that place into shape? Not fucking limp-dick Brian, that\'s for sure!'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i11.png')} />
        <SpeechBubble x={27.341137123745817} y={62.13426337718272} fade tail="none">
          {'I\'m not drunk, you\'re drunk!'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i12.png')} />
        <SpeechBubble x={27.341137123745817} y={62.13426337718272} fade tail="none">
          {'Need a tissue, I got ideas, hun...'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i13.png')} />
        <SpeechBubble x={33.11036789297659} y={73.36969243012967} fade tail="none">
          {'And another thing!'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a04')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a04')} />
        <SpeechBubble x={25.08361204013378} y={38.76457094705304} fade tail="none">
          {'The fuck was that shi...'}
        </SpeechBubble>
        <SpeechBubble x={79.68227424749163} y={74.11872103365947} fade tail="none">
          {'Trust me I got plan, but that can wait I need a few sleeping pills another glass of the good stuff.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i14.png')} />
        <SpeechBubble x={57.19063545150501} y={72.75988323190342} fade tail="none">
          {'Why don’t you do what you always do when justice needs to prevail? Call the manager.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i15.png')} />
        <SpeechBubble x={21.989966555183944} y={33.36922428725247} fade tail="none">
          {'Please, hold.'}
        </SpeechBubble>
        <SpeechBubble x={38.79468018394649} y={74.56813819577735} fade tail="none">
          {'Yeah, I’ll wait, buddy, I’ve got all day to complain.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i16.png')} />
        <SpeechBubble x={66.63879598662207} y={27.618500155684895} fade tail="none">
          {'Please, hold.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a05')} />
        <SpeechBubble x={66.63879598662207} y={27.618500155684895} fade tail="none">
          {'Please, hold.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i17.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i18.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a06')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i19.png')} />
        <SpeechBubble x={62.54180602006689} y={76.06619540283694} fade tail="none">
          {'Sir i am an american and I have rights…'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i20.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a07')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i21.png')} />
        <SpeechBubble x={59.78260869565217} y={67.52726932259726} fade tail="none">
          {'All day to complain.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i22.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i23.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a08')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i24.png')} />
        <SpeechBubble x={48.99665551839465} y={26.852051447869513} fade tail="none">
          {'You heard that Karen song then?'}
        </SpeechBubble>
        <SpeechBubble x={67.7257525083612} y={80.043591770257} fade tail="none">
          {'What like the meme?'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i24.png')} />
        <SpeechBubble x={50.08361204013379} y={28.538238605063356} fade tail="none">
          {'Shut up and listen.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i25.png')} />
        <SpeechBubble x={30.267558528428097} y={30.347375150955457} fade tail="none">
          {'We should go to where they are live streaming this!'}
        </SpeechBubble>
        <SpeechBubble x={66.47157190635451} y={30.70256446686084} fade tail="none">
          {'Yeah this is a banger.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i26.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a09')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i27.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i28.png')} />
        <SpeechBubble x={80.85284280936455} y={24.68283320069285} fade tail="none">
          {'You heard of this karen thing, she wants to talk to the fuckin’ president or some shit, we’ve got him on tonight… maybe-'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i29.png')} />
        <SpeechBubble x={79.0133779264214} y={24.980103927718737} fade tail="none">
          {'Maybe- we have the guy talk to the crazy bastard in the phone booth live on air, you heard the song? not bad let me tell you.'}
        </SpeechBubble>
        <SpeechBubble x={19.31438127090301} y={66.92804643977341} fade tail="none">
          {'Alright we would get decent views from this, or at least a clip on social media. Get on the phone!'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i30.png')} />
        <SpeechBubble x={18.810096153846153} y={24.82773318178589} fade tail="none">
          {'Finally someone with some sense, yes young man, I will hold…'}
        </SpeechBubble>
        <SpeechBubble x={35.869565217391305} y={72.98903648978239} fade tail="none">
          {'Is this Karen, hey I’m James, producer of late night, we have the president on tonight, would you stay there and talk to him when we call again?'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i31.png')} />
        <SpeechBubble x={32.02341137123746} y={37.56612518140536} fade tail="none">
          {'And they said hip hop died with Biggie…'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i32.png')} />
        <SpeechBubble x={14.297658862876252} y={31.573896353166987} fade tail="none">
          {'Ladies and gentlemen…'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i33.png')} />
        <SpeechBubble x={40.635451505016725} y={81.60900706895745} fade tail="top">
          {'Karen, the viral sensation, has a few words she\'d like to share with you. Are you happy to speak with her, Mr President?'}
        </SpeechBubble>
        <SpeechBubble x={28.511705685618725} y={32.173119235990825} fade tail="none">
          {'Of course, Ted.'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i34.png')} />
        <SpeechBubble x={38.79598662207358} y={34.719816487992134} fade tail="none">
          {'Finally…'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i35.png')} />
        <SpeechBubble x={27.173913043478258} y={29.776227704695472} fade tail="none">
          {'Hold on, Karen!'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i36.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i37.png')} />
        <SpeechBubble x={24.331103678929765} y={28.12836477692992} fade tail="none">
          {'Karen, we may have a solution for this AI issue…'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i38.png')} />
        <SpeechBubble x={49.91508152173913} y={26.780113290576285} fade tail="none">
          {'Once AI took jobs from the middle class, that\'s where things changed…'}
        </SpeechBubble>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i39.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i40.png')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a10')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>

      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        transition={crossfade()}
        background="#0a0f1c"
      >
        {/* TODO: pick an effect — zoom, grayscale, pan, zoomInOut, scale */}
        {/* TODO: pick background color */}
        <AnimationWidget animation={comic.resolveAnimation('anim/a11')} />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>
    </ScrollComic>
  )
}
