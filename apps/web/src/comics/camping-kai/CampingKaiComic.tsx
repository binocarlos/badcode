import { ScrollComic, Page, ImageWidget, AnimationWidget, SpeechBubble, NarrationBox } from '@badcode/comic'
import { zoom } from '@badcode/comic/effects'
import { crossfade } from '@badcode/comic/transitions'
// Other effects/transitions available: grayscale, zoomInOut, pan, scale | iris, fadeOutFadeIn, slideOver, blur, wipe | scrollIn, fadeIn, fadeOut, pause (see @badcode/comic docs)

export function CampingKaiComic() {
  return (
    <ScrollComic progressBar pageIndicator scrollHint>
      <Page
        phases={{ enter: 0, hold: 1.4, exit: 0 }}
        scrollDuration={1.4}
        effect={zoom({ amount: 1.3 })}
        background="#0a0f1c"
      >
        {/* TODO: pick background color */}
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_017.jpg" />
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
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_1/animation/539e8835-09ee-4284-babb-5b4df12f1af4/frame_095.jpg',
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_3/main/5ba6745d-05a9-47f8-91c2-29cb4ac925ad.png" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/0f4216c3-b682-4650-bd37-ee076f03078a/main/4ed70055-2e6f-4705-94dd-a25306602c5b.png" />
        <SpeechBubble x={68.81140259197325} y={51.19844576564767} appearAt={[0, 0.6]} fade tail="none" fontSize={1.2}>
          {'Tarquin, the deal you just closed is worth millions!\n\nHow do you do it?'}
        </SpeechBubble>
        <SpeechBubble x={70.21582357859532} y={21.883338795000235} appearAt={[0.5, 1]} fade tail="none" fontSize={1.2}>
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_5/main/483f4a65-37be-4180-b255-015252796489.jpg" />
        <SpeechBubble x={74.46436036789298} y={17.15275502083236} appearAt={[0.65, 1]} fade type="thought" tail="none" fontSize={1.2}>
          {'He is so cool...'}
        </SpeechBubble>
        <SpeechBubble x={44.647522993311036} y={49.40077711717616} appearAt={[0, 0.4]} fade tail="none" fontSize={1.2}>
          {'What are you up to this weekend mate?'}
        </SpeechBubble>
        <SpeechBubble x={31.086695234113716} y={48.40129207434109} appearAt={[0.4, 1]} fade tail="none" fontSize={1.2}>
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
        <AnimationWidget
          frames={[
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_191.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_192.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_193.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_194.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_195.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_196.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_197.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_198.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_199.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_200.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_201.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_202.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_203.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_204.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_205.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_206.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_207.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_208.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_209.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_210.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_211.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_212.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_213.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_214.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_215.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_216.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_217.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_218.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_219.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_220.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_221.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_222.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_223.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_224.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_225.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_226.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_227.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_228.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_229.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_230.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_231.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_232.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_233.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_234.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_235.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_236.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_237.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_238.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_239.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_240.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_7/animation/b33e6a4f-1a1a-4205-8abc-0b1280aaa565/frame_241.jpg',
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_9/main/696780a8-6859-4af0-9ce7-6394447e8b2a.png" />
        <SpeechBubble x={21.321070234113712} y={83.85609287954684} appearAt={[0.7, 1]} fade type="thought" tail="none" fontSize={1.7999999999999998}>
          {'Woaa, who is this guy?'}
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
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_8/animation/306dfe54-a1eb-4421-a5aa-cbc7a5bd8963/frame_121.jpg',
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/unknown_page/main/5d4b972f-19cd-4b98-9fed-9b29befb2e96.png" />
        <SpeechBubble x={54.0956835284281} y={29.153597678011327} appearAt={[0.1, 0.5]} fade type="thought" tail="none" fontSize={1.7999999999999998}>
          {'Look at the state of that tent!'}
        </SpeechBubble>
        <SpeechBubble x={55.769230769230774} y={74.4183324750714} appearAt={[0.5, 0.9]} fade type="thought" tail="top-left" fontSize={1.7999999999999998}>
          {'Fucking drug addicts - they need to get off their arse and do some bloody work!'}
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_9/main/696780a8-6859-4af0-9ce7-6394447e8b2a.png" />
        <SpeechBubble x={21.321070234113712} y={84.00589860025279} appearAt={[0, 0.5]} fade type="thought" tail="none" fontSize={1.7999999999999998}>
          {'Fucking rich twat'}
        </SpeechBubble>
        <SpeechBubble x={81.75428511705685} y={66.23519498150836} appearAt={[0.5, 1]} fade type="thought" tail="bottom-left" fontSize={1.7999999999999998}>
          {'I bet he just spent 20 grand\nat the dentist'}
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_000.jpg" />
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
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_000.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_001.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_002.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_003.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_004.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_005.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_006.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_007.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_008.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_009.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_010.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_011.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_012.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_013.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_014.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_015.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_016.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_017.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_018.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_019.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_020.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_021.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_022.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_023.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_024.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_025.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_026.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_027.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_028.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_029.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_030.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_031.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_032.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_033.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_034.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_035.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_036.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_037.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_038.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_039.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_040.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_041.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_042.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_043.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_044.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_045.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_046.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_047.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_048.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_049.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_050.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_051.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_052.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_053.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_054.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_055.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_056.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_057.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_058.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_059.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_060.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_061.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_062.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_063.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_064.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_065.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_066.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_067.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_068.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_069.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_070.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_071.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_072.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_073.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_074.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_075.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_076.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_077.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_078.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_079.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_080.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_081.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_082.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_083.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_084.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_085.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_086.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_087.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_088.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_089.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_090.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_091.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_092.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_093.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_094.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_095.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_096.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_097.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_098.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_099.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_100.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_101.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_102.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_103.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_104.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_105.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_106.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_107.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_108.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_109.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_110.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_111.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_112.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_113.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_114.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_115.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_116.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_117.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_118.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_119.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_120.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_121.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_122.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_123.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_124.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_125.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_126.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_127.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_128.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_129.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_130.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_131.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_132.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_133.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_134.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_135.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_136.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_137.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_138.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_139.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_140.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_141.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_142.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_143.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_144.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_145.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_146.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_147.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_148.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_149.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_150.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_151.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_152.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_153.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_154.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_155.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_156.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_157.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_158.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_159.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_160.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_161.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_162.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_163.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_164.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_165.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_166.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_167.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_168.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_169.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_170.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_171.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_172.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_173.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_174.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_175.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_176.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_177.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_178.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_179.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_180.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_181.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_182.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_183.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_184.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_185.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_186.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_187.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_188.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_189.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_190.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_191.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_192.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_193.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_194.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_195.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_196.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_197.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_198.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_199.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_200.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_201.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_202.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_203.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_204.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_205.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_206.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_207.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_208.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_209.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_210.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_211.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_212.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_213.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_214.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_215.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_216.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_217.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_218.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_219.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_220.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_221.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_222.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_223.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_224.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_225.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_226.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_227.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_228.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_229.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_230.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_231.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_232.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_233.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_234.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_235.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_236.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_237.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_238.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_239.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_240.jpg',
            'https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_241.jpg',
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/page_12/animation/83bf1ee8-f029-4e8c-be57-f5a1e94db4e2/frame_241.jpg" />
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
        <ImageWidget src="https://storage.googleapis.com/badcode-storage/comics/a17f2cc4-1efb-4cb9-a6d9-0912e4c18662/pages/unknown_page/main/4c4f44d9-bba7-45de-8070-268004d9cce8.png" />
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
