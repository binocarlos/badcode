import { ScrollComic, Page, ImageWidget, AnimationWidget, SpeechBubble, NarrationBox, createComic } from '@badcode/comic'
import manifest from './assets.manifest.json'
import { zoom } from '@badcode/comic/effects'
import { crossfade } from '@badcode/comic/transitions'
// Other effects/transitions available: grayscale, zoomInOut, pan, scale | iris, fadeOutFadeIn, slideOver, blur, wipe | scrollIn, fadeIn, fadeOut, pause (see @badcode/comic docs)

const comic = createComic(manifest)

export function CampingComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint>
      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        effect={zoom({ amount: 1.3 })}
        background="#0a0f1c"
      >
        {/* TODO: pick background color */}
        <ImageWidget src={comic.resolve('img/i01.jpg')} />
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
        <SpeechBubble x={34.448160535117054} y={34.420205046580215} appearAt={[0, 1]} fade tail="none" fontSize={10}>
          {'Let\'s circle back to synergise our bandwidth…'}
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
        <SpeechBubble x={54.0956835284281} y={72.77046954730584} appearAt={[0, 0.6]} fade tail="none" fontSize={10}>
          {'Tarquin, as per, you\'ve done it again, old boy.\n\nHow do you do it?'}
        </SpeechBubble>
        <SpeechBubble x={50.48338210702341} y={21.75566105112801} appearAt={[0.5, 1]} fade tail="bottom" fontSize={10}>
          {'Charles, it\'s easy!\n\nYou just have to have a "Winning Mentality" (tm)'}
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
        <SpeechBubble x={64.76536371237458} y={19.680726557745423} appearAt={[0.65, 1]} fade type="thought" tail="none" fontSize={10}>
          {'He is so cool...'}
        </SpeechBubble>
        <SpeechBubble x={18.475647993311036} y={55.43747951874912} appearAt={[0, 0.4]} fade tail="none" fontSize={10}>
          {'What are you up to this weekend mate?'}
        </SpeechBubble>
        <SpeechBubble x={48.4779995819398} y={72.06024450699492} appearAt={[0.4, 1]} fade tail="top" fontSize={10}>
          {'I\'m off to an ayahuasca retreat in Wales!\nThere are parts of my personality I am keen to get to know more.'}
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
        <SpeechBubble x={64.76536371237458} y={19.680726557745423} appearAt={[0.65, 1]} fade type="thought" tail="none" fontSize={10}>
          {'He is so cool...'}
        </SpeechBubble>
        <SpeechBubble x={18.475647993311036} y={55.43747951874912} appearAt={[0, 0.4]} fade tail="none" fontSize={10}>
          {'What are you up to this weekend mate?'}
        </SpeechBubble>
        <SpeechBubble x={48.4779995819398} y={72.06024450699492} appearAt={[0.4, 1]} fade tail="top" fontSize={10}>
          {'I\'m off to an ayahuasca retreat in Wales!\nThere are parts of my personality I am keen to get to know more.'}
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
        <SpeechBubble x={35.785953177257525} y={52.54669725200131} fade type="thought" tail="none">
          {'Another week of impressing these morons, a chimp could do what they do. This retreat cannot come soon enough. When will this end? Why is it always up to me?'}
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
        <ImageWidget src={comic.resolve('img/i05.png')} />
        <SpeechBubble x={21.321070234113712} y={83.85609287954684} appearAt={[0.7, 1]} fade type="thought" tail="none" fontSize={10}>
          {'Why make my day worse than it has to be…'}
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
        <SpeechBubble x={60.1157504180602} y={20.91428303918356} appearAt={[0.1, 0.5]} fade type="thought" tail="none" fontSize={10}>
          {'Thanks for taking up two parking spaces with that charming tattered tent. You should have gotten the tent I purchased; it even has a cigar holder.'}
        </SpeechBubble>
        <SpeechBubble x={56.77257525083612} y={80.26075558260382} appearAt={[0.5, 0.9]} fade type="thought" tail="top-left" fontSize={10}>
          {'Why do people give their hard-earned cash to this putrid rat? He’ll just shoot it up his arm anyway. Get a job, you piece of…'}
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
        <SpeechBubble x={69.89835911371237} y={47.15369130658677} appearAt={[0, 0.5]} fade type="thought" tail="none" fontSize={10}>
          {'Since day one of being here, the guilt of being in the way of real people never fades. That being said, at least acknowledge that we are both being rained on by the same shitty weather; you are not blind to the elements that we cannot control.'}
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
        <SpeechBubble x={24.99869356187291} y={41.31126819905435} appearAt={[0, 0.5]} fade type="thought" tail="none" fontSize={10}>
          {'Luck, simulation theory or God, whatever your poison, mine is down the gullet of this bottleneck, it causes the interminable amount of throbbing guilt to fade to black. Plus, it\'s gluten-free.'}
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
        <SpeechBubble x={18.893708193979933} y={39.06418238846496} appearAt={[0, 0.5]} fade type="thought" tail="none" fontSize={10}>
          {'I remember 2008 like it was yesterday, the day of the car crash, I miss my wife so much I… I… I shudder every time I see those stupid wank tanks. Her face, those lifeless eyes… God let me forget these horrors. Amen.'}
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
        <ImageWidget src={comic.resolve('img/i08.jpg')} />
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
        <ImageWidget src={comic.resolve('img/i09.jpg')} />
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
        <SpeechBubble x={63.54515050167224} y={22.2859416693975} fade tail="none" fontSize={10}>
          {'I\'m Moonwhisper Ascending. I am here to cleanse my soul, also to do research for my new book called "The Wound That Teaches."'}
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
        <SpeechBubble x={36.2876254180602} y={21.986330227985583} appearAt={[0, 0.5]} fade type="thought" tail="none" fontSize={10}>
          {'I should have brought Daddy’s hunting rifle…'}
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
        <SpeechBubble x={15.466920986622073} y={75.01755535789523} fade type="thought" tail="none" fontSize={10}>
          {'Fuck me, that kicked in quick!'}
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
        <AnimationWidget animation={comic.resolveAnimation('anim/a07')} />
        <SpeechBubble x={15.466920986622073} y={75.01755535789523} fade type="thought" tail="none" fontSize={10}>
          {'Fuck me, that kicked in quick!'}
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
        <SpeechBubble x={15.466920986622073} y={75.01755535789523} fade type="thought" tail="none" fontSize={10}>
          {'Fuck me, that kicked in quick!'}
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
        <AnimationWidget animation={comic.resolveAnimation('anim/a09')} />
        <SpeechBubble x={61.62207357859531} y={35.01942792940406} fade tail="none">
          {'Tarquin, I\'ve come back here to warn you, you must change your ways, there is no time to fuck around, AI is coming, you fool! Unburden yourself from the judgment of your elbow-patch afflicted peers and take action. For our sake!'}
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
        <SpeechBubble x={30.434782608695656} y={24.083610317869013} fade type="thought" tail="none">
          {'I came here to learn more about myself, not this nonsensical bullshit. Why have I lowered myself to such squalor?'}
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
        <ImageWidget src={comic.resolve('img/i18.png')} />
        <SpeechBubble x={14.715719063545151} y={52.24708581058939} fade tail="none">
          {'Ouch! The fuck is happening...'}
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
        <ImageWidget src={comic.resolve('img/i19.png')} />
        <SpeechBubble x={52.675585284280935} y={21.387107345161745} fade type="thought" tail="none">
          {'The lake... the trip... it all...'}
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
        <SpeechBubble x={30.351170568561876} y={21.387107345161745} fade type="thought" tail="none">
          {'I\'ve never been this cold. How do people live like this? It\'s preposterous!'}
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
        <ImageWidget src={comic.resolve('img/i21.png')} />
        <SpeechBubble x={17.892976588628763} y={24.98244464210477} fade tail="none">
          {'Cold ain\'t it? What you doing here, havn\'t seen you in some time.'}
        </SpeechBubble>
        <SpeechBubble x={80.68561872909699} y={34.57001076728618} fade tail="none">
          {'I\'m frozen, wish I came more prepared. Look I really don\'t know what to do, probably for the first time in my life... um whatever your name is... cough... sir can you...'}
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
        <ImageWidget src={comic.resolve('img/i21.png')} />
        <SpeechBubble x={15.635451505016723} y={45.80543982023313} fade tail="top-right">
          {'Bob, my name\'s Bob mate, I\'m not sure what I can, in fact, do for you, really, unless you\'re hiding beer behind your silver spoon. On second thoughts, keep that one bud, looks like you need it.'}
        </SpeechBubble>
        <SpeechBubble x={78.17595108695652} y={28.12836477692992} fade tail="none">
          {'Bob, please, I am literally begging you. Oh, no offence there, old boy, I am not quite used to lowering myself to such...'}
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
        <SpeechBubble x={15.635451505016723} y={55.24320022470858} fade tail="none">
          {'Slow down, mate, don\'t make too much noise. If you kick off, I won\'t be able to stop these lot. Just don\'t show weakness like that; they can smell it a mile away. Sleep with both eyes open, take inventory, and keep your head down. Also, sleep with a blade under your pillow, this ain\'t Eton.'}
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
        <AnimationWidget animation={comic.resolveAnimation('anim/a11')} />
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
        <SpeechBubble x={61.78799122073578} y={65.28018351200787} fade tail="top">
          {'Well, what do I do now then?'}
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
        <AnimationWidget animation={comic.resolveAnimation('anim/a12')} />
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
        <SpeechBubble x={25.91973244147157} y={21.5369130658677} fade type="thought" tail="none">
          {'Crazy bastards...'}
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
        <ImageWidget src={comic.resolve('img/i26.jpeg')} />
        <SpeechBubble x={30.68561872909699} y={16.743130003277003} fade type="thought" tail="none">
          {'What was that?'}
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
        <ImageWidget src={comic.resolve('img/i27.jpeg')} />
        <SpeechBubble x={79.26290760869566} y={22.43340667571743} fade tail="none">
          {'Start shovelling or start fucking off!'}
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
        <ImageWidget src={comic.resolve('img/i28.jpeg')} />
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
        <AnimationWidget animation={comic.resolveAnimation('anim/a12')} />
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
        <AnimationWidget animation={comic.resolveAnimation('anim/a12')} />
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
        <ImageWidget src={comic.resolve('img/i32.jpeg')} />
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
        <ImageWidget src={comic.resolve('img/i33.jpeg')} />
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
        <AnimationWidget animation={comic.resolveAnimation('anim/a13')} />
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
        {/* TODO: this page had no image/animation/text in Storyteller — replace this placeholder */}
        <NarrationBox x={50} y={50} appearAt={[0, 1]} fade>{'TODO: empty page'}</NarrationBox>
        {/* TODO: add SidePanelText with narrative content */}
      </Page>
    </ScrollComic>
  )
}
