import { defineComic } from '@badcode/comic-meta'

export default defineComic({
  id: 'camping-jack-test',
  style: '',
  characters: {
    tarquin: {
      name: 'tarquin',
      description: 'Full-body digital illustration of a ruggedly handsome middle-aged man with short dark hair and light stubble, confident smirk, wearing a dark olive/gray leather cafe racer jacket over a graphic t-shirt with geometric red and gray design, dark indigo slim-fit jeans with cuffed hems, brown leather belt, brown leather lace-up boots, carrying a vintage canvas messenger bag in one hand, other hand adjusting jacket collar, standing pose with relaxed confident stance, clean white background, hyperrealistic digital art style, fashion illustration, sharp details, soft shadows, full figure shot',
      sheet: '', // TODO: add character sheet path
    },
    tarquin_suit: {
      name: 'tarquin_suit',
      description: 'Full-body digital illustration of a ruggedly handsome middle-aged man with short dark hair and light stubble, confident smirk',
      sheet: '', // TODO: add character sheet path
    },
    wank_tank: {
      name: 'wank tank',
      description: 'A BMW X8 in black',
      sheet: '', // TODO: add character sheet path
    },
    bob: {
      name: 'bob',
      description: 'A homeless man',
      sheet: '', // TODO: add character sheet path
    },
    tent: {
      name: 'tent',
      description: 'The tatty tent that bob lives in outside of Waitrose',
      sheet: '', // TODO: add character sheet path
    },
  },
  assets: {
    'p1-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p2-animation_end': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'the exact building and lighting from [1] but zoomed into the window like we have done in the previous image',
    },
    'p2-animation_start': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p3-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p4-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p5-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p6-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p7-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p8-animation_end': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p8-animation_start': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p8-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Move the small green-grey camping tent from the center of the parking lot up close to the Waitrose store entrance, positioned just a few spaces back from the covered walkway area. The tent should be set up in an empty parking space near the shop front, with its door facing away from the viewer (toward the store), so we see only the back and sides of the tent. Directly opposite the tent\'s unseen door, place the [wank tank] facing it across a gap of empty parking spaces. Surround the tent and [wank tank] with a cluster of clearly empty parking bays, creating an island of vacant tarmac near the store while the rest of the lot remains filled with parked cars as before. Keep the two figures — one in a bright yellow raincoat and one holding a dark umbrella pushing a shopping cart — walking nearby. Maintain the exact same elevated drone-angle composition looking down toward the Waitrose storefront, the same overcast grey sky, wet reflective asphalt, misty rain atmosphere, and dim warm parking lot lamps. Shot on 35mm film with fine natural grain, subtle dust specks, and gentle gate weave. Muted cool-neutral color palette with low saturation, soft contrast, lifted blacks, and gentle highlight roll-off on the store\'s interior glow and lamp halos. Vintage lens softness with mild halation around the practical lights, naturalistic motivated lighting, calm observational documentary tone, landscape orientation.',
    },
    'p9-animation_end': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p9-animation_start': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p9-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Move the small green-grey camping tent from the center of the parking lot up close to the Waitrose store entrance, positioned just a few spaces back from the covered walkway area. The tent should be set up in an empty parking space near the shop front, with its door facing away from the viewer (toward the store), so we see only the back and sides of the tent. Directly opposite the tent\'s unseen door, place the [wank tank] facing it across a gap of empty parking spaces. Surround the tent and [wank tank] with a cluster of clearly empty parking bays, creating an island of vacant tarmac near the store while the rest of the lot remains filled with parked cars as before. Keep the two figures — one in a bright yellow raincoat and one holding a dark umbrella pushing a shopping cart — walking nearby. Maintain the exact same elevated drone-angle composition looking down toward the Waitrose storefront, the same overcast grey sky, wet reflective asphalt, misty rain atmosphere, and dim warm parking lot lamps. Shot on 35mm film with fine natural grain, subtle dust specks, and gentle gate weave. Muted cool-neutral color palette with low saturation, soft contrast, lifted blacks, and gentle highlight roll-off on the store\'s interior glow and lamp halos. Vintage lens softness with mild halation around the practical lights, naturalistic motivated lighting, calm observational documentary tone, landscape orientation.',
    },
    'p10-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'exactly like the previous image but rotate the car to it\'s left by 45 degrees',
    },
    'p11-animation_end': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p11-animation_start': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p12-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Just like the image in [1] but [tarquin] is stood outside looking at the [tent]',
    },
    'p13-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'exactly like the previous image but rotate the car to it\'s left by 45 degrees',
    },
    'p14-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'exactly like the previous image but rotate the car to it\'s left by 45 degrees',
    },
    'p15-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p16-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p17-animation_end': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p17-animation_start': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Just like [1] but without the car on the road',
    },
    'p17-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Shift the camera significantly higher into the air with a steeper downward angle, looking almost directly down onto the road below, creating a more pronounced aerial/bird\'s-eye perspective. Replace the dark car with a large, modern BMW X8 [wank tank] — a bulky, imposing black luxury SUV with its warm-toned headlights glowing through the mist, wet road spray trailing behind it. Keep everything else exactly the same — the wet two-lane asphalt highway with white dashed center line markings, dense Scandinavian pine and spruce forest flanking both sides, thick low-hanging fog weaving through the treetops, overcast grey sky heavy with rain clouds, and light rain with visible droplets. The road surface should be slick and reflective with a dark wet sheen. Maintain the exact same muted cool-neutral color palette with desaturated dark greens, slate greys, and lifted blacks — late-70s/early-80s scanned 35mm film negative aesthetic with visible fine grain, subtle dust specks, and gentle gate weave throughout. Vintage lens softness with mild halation blooming around the BMW\'s headlights, no clinical sharpness, naturalistic overcast lighting with soft contrast and gentle highlight roll-off. Landscape orientation, calm observational documentary tone.',
    },
    'p18-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: '',
    },
    'p19-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p20-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p21-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p22-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p23-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p24-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p25-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p26-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p27-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p28-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p29-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p30-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p31-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p32-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p33-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p34-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p35-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p36-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p37-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p38-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p39-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p40-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p41-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p42-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p43-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p44-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p45-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p46-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p47-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p48-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p49-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p50-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p51-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p52-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p53-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p54-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
    'p55-main': {
      kind: 'image',
      path: '', // TODO: add GCS path if using bucket, or remove if using public/
      characters: ['tarquin', 'tarquin_suit', 'wank_tank', 'bob', 'tent'], // TODO: filter to relevant characters
      scene: 'Uploaded image',
    },
  },
})
