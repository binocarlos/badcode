import { ScrollComic, Page, ImageWidget, AnimationWidget, SpeechBubble } from '@badcode/comic'
import { zoom } from '@badcode/comic/effects'
import { crossfade } from '@badcode/comic/transitions'
// Other effects/transitions available: grayscale, zoomInOut, pan, scale | iris, fadeOutFadeIn, slideOver, blur, wipe | scrollIn, fadeIn, fadeOut, pause (see @badcode/comic docs)

export function KarenJackTestComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint>
      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        effect={zoom({ amount: 1.3 })}
        background="#0a0f1c"
      >
        {/* TODO: pick background color */}
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/d94d1c75-331c-4fb9-93a8-810352e8b1d0/main/1.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_2/animation/527e6ffd-3a0a-4ceb-90ba-690cc1506c12/frame_181.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/fc5f04e8-3bbc-4027-9620-9de95c2d2b07/main/2.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/92a82434-cc3c-4383-a0f7-6a7f5593c113/main/3.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/81332e1d-8f7e-4b0b-86e2-8a89d6206151/main/35.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/2ce2dbbf-2688-4297-ab65-bab4d457f4f6/main/36.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_191.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_192.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_193.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_194.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_195.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_196.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_197.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_198.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_199.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_200.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_201.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_202.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_203.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_204.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_205.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_206.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_207.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_208.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_209.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_210.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_211.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_212.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_213.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_214.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_215.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_216.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_217.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_218.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_219.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_220.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_221.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_222.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_223.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_224.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_225.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_226.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_227.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_228.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_229.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_230.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_231.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_232.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_233.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_234.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_235.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_236.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_237.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_238.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_239.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_240.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_241.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_242.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_243.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_244.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_245.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_246.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_247.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_248.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_249.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_250.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_251.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_252.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_253.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_254.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_255.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_256.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_7/animation/1b2e84ba-fe6a-440a-8f87-fa32820312da/frame_257.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/999984f5-b0ef-4caa-a5ba-e4ef275b8e09/main/1.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_9/animation/bcd30701-90ac-4384-bc1e-791ac66be77a/frame_191.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/7b2af635-bf14-4c4c-b7e1-0ac23fd00f3d/main/5.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/45f2fae7-7b14-4c8a-b9cf-18e3ec3bc0f9/main/6.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/8a7c3d44-c222-4f00-a5f7-110d01851311/main/39.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/dd2d220f-d5fe-440f-9339-3549e005b200/main/40.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/b52d3267-8182-41df-b3d7-2f60f9c965ce/main/41.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/f9983365-eb86-4ac8-8c85-20e3ef746e32/main/42.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/52b1a289-3c2b-4db8-b20f-2c7fc24bfff4/main/43.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_191.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_192.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_193.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_194.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_195.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_196.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_197.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_198.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_199.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_200.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_201.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_202.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_203.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_204.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_205.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_206.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_207.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_208.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_209.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_210.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_211.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_212.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_213.jpg',
          ]}
        />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_191.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_192.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_193.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_194.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_195.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_196.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_197.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_198.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_199.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_200.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_201.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_202.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_203.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_204.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_205.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_206.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_207.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_208.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_209.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_210.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_211.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_212.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_17/animation/0bf6fc6d-dbec-4f6d-9978-a6c41ef1092a/frame_213.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/9f8cd12f-96f2-4c5e-a5db-4481bd9f20c9/main/7.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/5a44ea28-3b0d-4119-a30a-0ff732e67869/main/8.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/e22bc353-f04c-4ec6-b6b0-a11c32279465/main/9.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_15/animation/e4be21df-4c8a-470f-ae73-87877299a6a0/frame_191.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/32c41d47-53fd-4e13-bd1a-c4b76ba811d4/main/10.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/cca36935-3e1c-4e18-8973-e706acbe60d1/main/first frame time.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_13/animation/14e83a6a-7923-44e5-b131-911c934efb7e/frame_191.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/33989b5f-080a-4380-a7c3-75bdb2522dc0/main/11.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/0e6df51f-7798-4d4e-ba66-73693cb44c51/main/12.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_28/animation/59fcfeb6-25d8-473f-b456-1ec50f3b79b7/frame_159.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/78f8699f-5491-4162-9e76-d8e0784cd133/main/13.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/bcf07292-926b-4917-bd3b-e05e97eeb385/main/14.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/273c834c-98da-4710-9df9-c2aeb3417a00/main/15.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_23/animation/6118cf4f-50a6-460d-bdab-17b1e681c0c0/frame_191.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/04a7fa9c-5e31-4bdb-9b93-12118178efe2/main/16.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/04a7fa9c-5e31-4bdb-9b93-12118178efe2/main/16.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/f30f68a2-a889-4031-a279-e38d7a137c79/main/17.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/b52287d3-408a-40c7-b3a5-6cd10ef62a42/main/18.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_30/animation/3e9f18ed-93e6-4164-a4ce-edf59aad650f/frame_191.jpg',
          ]}
        />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/f2ec82d2-f2aa-4abc-80d0-e54950faf015/main/19.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/571c69de-f5a9-4496-a9e2-d57ac23312b4/main/20.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/10088aef-e894-45dc-8da0-4ed8f7267666/main/21.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/10088aef-e894-45dc-8da0-4ed8f7267666/main/22.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/749a9efd-70b8-4533-bd4e-0a48355d4c4d/main/23.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/5b410144-e0e3-4377-91e4-250bdeaf0156/main/30.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/b4aedaf1-694b-419e-a830-178ba607912b/main/31.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/12d2573d-0ad0-4609-b37f-7aaa2c5eb2bf/main/34.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/83fc93de-e471-42fb-9b59-7bf8b343ea51/main/32.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/78e4e6c1-3aa5-4b28-ac41-f58dc68bc706/main/27.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/aec37f09-3a25-4deb-b441-82ace3035105/main/33.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/b06346ca-058f-437b-8f38-b32a58e5dfc5/main/48.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/f1da3636-bf47-48f9-9076-2d984ccc7620/main/48.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/11fd023c-683e-4801-9a22-74725d287b88/main/47.png" />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_52/animation/25fdae44-3368-41e6-bca6-426057bf2323/frame_191.jpg',
          ]}
        />
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/f63d9a14-5c2f-4415-be49-f4b62b2d71d4/pages/page_53/animation/f55d9cb5-5135-456f-bf7a-22aae306d38a/frame_191.jpg',
          ]}
        />
        {/* TODO: add SidePanelText with narrative content */}
      </Page>
    </ScrollComic>
  )
}
