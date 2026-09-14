---
title: Camping (UKG cut)
status: round 10 is the base — recovered from Suno 2026-09-14, round 11 drafted below
sibling: ./camping.md
canonical: true
mode: advanced
model: v6 (chirp-hawk)
style_influence: 70
weirdness: 40
audio_influence: 0
bpm: 174
voices: [the first man (English storyteller), the second man (BBC newsreader)]
suno_base_take: https://suno.com/song/598c2a4d-df2a-4608-949c-eb6024806df5
---

# Camping — the UKG cut

**This is the active cut of "Camping" and the thing to base experiments on.** Its
sibling [`camping.md`](./camping.md) is the **released v1** — the neurofunk /
grime take Jack's music video was cut to. That file stands as released; do not
edit it to match this one.

**The two cuts are different songs wearing the same title.** The UKG cut drops
the two 32-bar drops, anonymises the voices (no Bob, no Tarquin — see below),
adds an acapella whisper hinge to each verse, and ends on a colder bridge.

> ## ⭐ The base take — round 10
>
> **[camping-r10-ukg-v6-w40](https://suno.com/song/598c2a4d-df2a-4608-949c-eb6024806df5)**
> — generated 2026-09-13 18:32 UTC, 3:24, model **v6** (`chirp-hawk`), style
> influence **70** / weirdness **40** / audio **0**. Kai: *"I really like this
> version."* The three boxes below are what made it, recovered verbatim from
> Suno's clip API and **not retyped**. Do not "improve" them without a specific
> complaint to answer.

> ## ⚠️ Provenance — what was recovered and what was lost
>
> Rounds 1–9 happened on Kai's other machine on 2026-09-13 and were never
> committed; nothing of that session reached this repo (clean tree, `main` at
> `3d47eeb` from 2026-08-11). What survives is what Suno stores: the round-10
> Style / Exclude / Lyrics boxes, the sliders and the model — pulled from
> `studio-api.prod.suno.com/api/clip/598c2a4d-df2a-4608-949c-eb6024806df5`
> (no login needed, even though the song is private).
>
> **What is still missing: the reasoning.** Nine rounds of *what was tried and
> rejected* are stranded on the other machine. If those notes exist there, fold
> them into the revision log at the bottom of this file.
>
> **Also missing: the My Taste box.** The API does not expose it, and My Taste
> biases every generation and cannot be switched off. It is account-level, so it
> is still live on Suno — **copy it in here before the next round**, or round 11
> is not reproducible.

## Style

623 chars. **The voices are described by behaviour, not by name** — "an English
storyteller… like telling a mate a story at 4am", "a BBC newsreader voice" —
where v1 named Scouse and posh London. Two category differences keep them apart:
conversational-and-tired versus clipped-and-cold, and storyteller versus
broadcaster. Both are still Bob and Tarquin in the story; the box just never says
so, which is what stops Suno averaging them into one narrator.

**The genre order is inverted against house doctrine and it worked.** The rule
(`suno-tag-mechanics.md`) is to name the foundation genre first and the second as
an influence on the arrangement. This box leads with `UK garage storytelling and
grime` and puts the actual foundation — the 174 BPM D&B — last, under
"Underneath it all". Round 11 variant **B** tests the doctrinal order against it;
until that resolves, the box stays as it is.

```
UK garage storytelling and grime over drum and bass. Verse one: an English storyteller talking his lines conversationally over the beat, a flat everyday English accent, observational and tired, spoken not rapped, like telling a mate a story at 4am. Verse two: a BBC newsreader voice, a posh older Englishman, clipped and cold. Then the two men trade lines. Skippy two-step garage shuffles and dark grime bass stabs folded into the drum and bass, cheap synth strings, night-bus melancholy. Underneath it all, a steady 174 BPM drum and bass beat: light rolling breakbeats and a warm rolling sub bass, spacious, never jump up.
```

## Exclude styles

438 chars. Five guards:

1. **The Americana block** — `American accent, American vocal, Southern drawl,
   country vocal, twang, americana, blues, Delta blues, gospel, soul singer, US
   rap, trap`. Twelve terms on one failure, which is the tell for what kept
   happening: two English speaking voices are the whole song, and the moment one
   goes American the joke dies.
2. **Wrong lead** — `teenage voice, boyish voice, falsetto, autotune, female
   vocal, choir, crowd noise, audience, applause`.
3. **Wrong D&B** — `jump up, wobble bass, neurofunk, dubstep, EDM drops, glossy
   production`. Note this excludes **v1's own genre**: the neurofunk take is the
   thing this cut is steering away from.
4. **Wrong register** — `happy, uplifting, major key`.
5. **Wrong tempo and wrong England** — `slow tempo, half time, tempo change`
   (the corpus says half-time can't be prompted anyway, so it is banned rather
   than fought), and `post-punk, madchester, baggy, britpop, folk, pub rock,
   piano` — the indie-lads gravity well that "two English blokes talking" pulls
   toward.

```
American accent, American vocal, Southern drawl, country vocal, twang, americana, blues, Delta blues, gospel, soul singer, US rap, trap, teenage voice, boyish voice, falsetto, autotune, female vocal, choir, crowd noise, audience, applause, jump up, wobble bass, neurofunk, dubstep, EDM drops, glossy production, happy, uplifting, major key, slow tempo, half time, tempo change, post-punk, madchester, baggy, britpop, folk, pub rock, piano
```

## Lyrics — round 10, as generated

The take Kai likes. Round 11's edits are in the next section; this block is the
historical record.

```lyrics
[Intro — 4 bars | the beat alone, then straight in]
[Verse 1 | the first man, an English storyteller, talking conversationally, spoken not rapped]
Once again, and you catching my eye,
and you looking to the side in shame, but why
now, let me explain, how I'm just poor
you keep on walking, through that Wait trose door
presenting yourself, with your shiny teeth
fucking sense of entitlement, and self belief
I get, that you think your deals are slick
but I bet, that you paid for your wheels on tick
cash from the bank for your wank tank
four tonnes of steel, just to get a meal deal
you got cheese but I want Cheddar
[almost whispered | nothing else | acapella]
I can't live like this forever
[the beat back in | the first man rising, never a scream]
I might be insane but I do want change,
let's see what we can arrange
now, I insist that I hold that door
[a weary, bitter plea, low, not shouted, cracking on the last word]
please sir, can I fuckin, have some more?
[Verse 2 | straight in, no break | the second man, a BBC newsreader voice, clipped and cold]
you are intent on living in a tent
it's a lack of work ethic, it's pathetic,
getting parra lettic, it seems that you are just a bum
drowning your sorrow until tomorrow comes
prospects exist and now I insist
that you just stop the grift
[almost whispered | nothing else | acapella]
What about if we taxed the rich?
[the beat back in | the second man rising, biting and bitter]
what the fuck you think this is, bitch
I work hard to pay for my yard
Payin my tax with a platinum card
you want change but my pockets are empty
the only thing I'm changing, is the lane in my M3
if you worked hard, then you could have plenty, fenty,
all you now seem to do, is resent me.
wealth gap? fuckin what a load of crap
now please let me drink my shatoe nerf doo pap
[Bridge | straight in, no break | the two men trade lines, the beat stripped back to a quiet rolling pulse]
[the first man]
Oh shit, here we both are, living in a car
park, rained on in the fucking dark
[the second man]
went down the wrong track, then I got the sack,
then I drank, broke my back, now I'm in the last part
[both men together]
the AI does the fast part, now, the real question is
will it allow, because it's in charge now...
[the second man]
you see as it turns out, there is very little clout,
in having the manager or any of the c-suite about
[the first man]
the speed the robots replaced us was quicker
and sicker than when the government debased us
[the second man]
back to that time when we very first met,
I do regret that I judged you, I was wrong,
[the first man]
yet I don't begrudge you,
it's us and them now
[the second man]
well we don't have long
and by the time it hits, we'll be gone
[end]
```

## Round 11 — the fixes

### 1. `c-suite` was read as "sih-suite"

Suno sounds words out from spelling and has no dictionary, so a bare letter gets
sounded, not named. House fix is phonetic respelling (`AI→A-I`, `DJ→dee-jay`):

> in having the manager or any of the **see-suite** about

If `suite` also trips, the fallback is `see-sweet` — same sound, and this lyric
already spells `shatoe nerf doo pap` and `parra lettic` that way.

**Flagged, not changed:** `the AI does the fast part` is the same class of
problem (`A-I` is the house respelling). It has not misfired, so it stays until
it does.

### 2. `it's us and them now` doesn't rhyme

Correct — it is the only orphan in the bridge. The tail runs
**wrong → long → gone**, and `now` lands on nothing, having just been used two
lines earlier in `it's in charge now`. Three ways back into the chain:

| | Line | What it buys |
|---|---|---|
| **D ⭐** | `it's only us and them now, in this song` | **Kai's, and it's the one in the paste block.** Keeps `us and them` *and* the `now`, rhymes on `song`, and `in this song` puts the two of them inside the record — the same self-reference v1 ended on (`let's make a happy ending for this song`), now turned cold |
| A | `it's us and them, and it was them all along` | Rhymes on `wrong`/`long`/`gone`; `all along` argues the split was always there and they spent the song pointing at each other |
| B | `turns out we both belong` | Warmer. The class inversion — the trader belongs down here now |
| C | `we picked the wrong them all along` | Sharpest, and echoes `I was wrong` two lines up. More words than the beat wants |

**D is in the paste block below**; the others are a one-line swap.

The reason any of these beat the orphan: the second man's `I was wrong` and the
first man's reply now rhyme **across the two speakers**. That is the bridge's
whole job — the moment they stop having separate conversations.

### 3. The bridge needs to drop its energy

The complaint: the bridge should be **far softer and less bouncy** than the two
verses — spoken word, low, two men talking rather than performing.

**The mechanism it was failing on:** a section header with no vocal direction
falls back to the genre default *for that section*, and round 10's bridge had
exactly one cue on the header and then eight bare speaker tags — `[the first
man]`, `[the second man]` — carrying no direction at all. So eight lines of the
most important part of the song were being read by "whatever this genre does",
which at 174 BPM is the bouncy thing. **The character belongs in nearly every
bracket cue**, and that is the single change here.

Round 11's bridge cues carry an arc rather than a state — worn out → thinking
aloud → an awkward apology → gentle → almost silent — so the section falls away
across its length instead of sitting at one volume:

| Cue | Direction |
|---|---|
| header | `the beat thins to a bare sub pulse and a ticking hat \| both men quiet now, spoken word speech talking, close-mic'd and unhurried, talking to each other` |
| first man | `spoken word speech talking \| low and close, worn out` |
| second man | `spoken word, flat and quiet, the posh edges worn smooth` |
| both | `murmured in unison, under the breath` |
| second man | `quiet and plain, thinking aloud` |
| first man | `soft and matter of fact, resigned` |
| second man | `slower, near-whispered, an awkward apology` |
| first man | `gentle and warm, barely above the beat` |
| second man | `almost silent, the last words, dissolving into the room` |

Three things are deliberate:

- **`spoken word speech talking` is redundant on purpose.** Escalating an
  ignored tag by stacking synonyms (`[spoken word]` → `[spoken word speech]` →
  `[spoken word speech talking]`) is a documented fix, not a smell. It appears
  twice at the top of the section, where it has the most pull, and the later
  cues stay short so they read as performance notes rather than competing
  genre instructions.
- **Every cue is positive.** No `not shouted`, no `less energy` — negation
  describes the thing you named and Suno generates it. Everything the bridge
  must *not* do lives in Exclude Styles.
- **The arrangement thins *and now drops* under the bridge** — see fix 4, which
  supersedes round 10's "thinned, never slowed".

### 4. The bridge drops tempo — and the excludes have to allow it

**Lane B only** — this is the one fix that can reach outside its own section,
which is why it is quarantined. See [Round 11 — two lanes](#round-11--two-lanes).

Kai's call: the last section should **change tempo**, not just quieten. That is
a three-box change, because round 10 was forbidding it in two places at once.

**Out of Exclude Styles: `half time` and `tempo change`.** They were guarding
the wrong thing. `slow tempo` **stays**, and that distinction is the whole
design: half-time at 174 is not a slow track, it is the *same* pulse with the
drums playing half as often. Keeping `slow tempo` lets the bridge halve while
still forbidding the track itself from dragging — which is what those three
terms were really there to prevent.

**Out of the Style box: the word `steady`.** One word, and it was pulling
directly against the request — a *steady* 174 BPM beat is exactly what a
tempo-dropping bridge is not. Deleting the word that pulls the wrong way beats
adding a corrective one; adding both makes Suno average them into mush.

**Into the lyrics: the drop is described, not named.** The corpus is blunt that
**half-time is a known blind spot** — repeated controlled tests never produced
true half-time from a tag, and the subgenre-name route fails the same way, which
is why the house rule for D&B is to *describe the sound design and rhythm*
rather than lean on the label. So the bridge gets both: the tag for the model
that knows it, and the physical description for the one that doesn't.

```
[Breakdown — half time | the drums drop to half speed, a slow heavy kick and snare, the sub holding underneath, the room opening up]
[Bridge | the two men talking to each other, spoken word speech talking, close-mic'd and unhurried]
```

**The happy accident:** the *documented failure mode* of a breakdown tag is that
it slows and thins the arrangement instead of cleanly halving the drums. For any
other D&B track that is the bug. Here it is approximately the brief — a softer,
slacker last section — so both the success and the failure land somewhere we
want.

> **⚠️ The new risk runs the other way.** `half time` was also holding the
> *verses* at full pace, and with it gone a take can come back with the whole
> song at half speed — a 174 track that feels like 87. Two cheap guards are in
> lane B: `slow tempo` stays in the excludes, and lane B's verses 1 and 2 say
> `the beat rolling at full pace` in their headers, so full tempo is asserted
> where it matters rather than merely un-banned. **Check the verses before you
> judge the bridge** — if the whole track slackened, that is this trade, and the
> fix is to put `half time` back and fall back to lane A.

## Round 11 — two lanes

**Lane A is the safe one and it is where most of the runs go.** The four fixes
above are not equally risky, and it is worth being precise about why:

| Fix | Blast radius |
|---|---|
| 1 — `see-suite` | one word |
| 2 — the bridge rhyme | one line |
| 3 — softer bridge cues | one section |
| **4 — the tempo drop** | **the whole track** |

Fixes 1–3 are section-local: if a cue misfires you lose the bridge, and the
verses arrive exactly as they did on round 10. Fix 4 is the only one that
reaches outside its section, because it works by *removing guards* — `half time`
and `tempo change` were global bans, and with them gone nothing stops a take
coming back half-speed from the first bar. That asymmetry, not a hunch, is the
argument for splitting the round.

- **Lane A — the fixes, none of the tempo.** Round 10's Style and Exclude boxes
  **unchanged** (`steady` still in, all three tempo terms still banned), with
  lane A's lyrics below. The most this can do is change how the bridge is
  *performed*. Round 10's arrangement is guaranteed to still be reachable.
- **Lane B — the tempo experiment.** The de-steadied box, the shortened exclude
  list and the half-time bridge. Genuinely open-ended.

**Run lane A to a keeper first, then open lane B.** That way the worst case in
lane B is a wasted afternoon rather than losing the version you already like.

> **The real safety net:** round 10 is saved, public-linked and fully recorded
> at the top of this file — boxes, sliders, model. Nothing in either lane can
> take it away, and it is re-generable from this file alone. **Don't
> thumbs-down round 10** while triaging; disliked generations leave the
> workspace.

## Lane A — boxes to paste (safe)

**Style and Exclude Styles: use the round-10 boxes from the top of this file,
unchanged** — [Style](#style) and [Exclude styles](#exclude-styles). Lane A
changes nothing about the sound, only the performance of the bridge.

### Lane A — lyrics

Fixes 1, 2 and 3. No tempo language anywhere: the bridge *thins*, and the verses
say nothing about pace because `half time` is still banned globally.

```lyrics
[Intro — 4 bars | the beat alone, then straight in]
[Verse 1 | the first man, an English storyteller, talking conversationally, spoken not rapped]
Once again, and you catching my eye,
and you looking to the side in shame, but why
now, let me explain, how I'm just poor
you keep on walking, through that Wait trose door
presenting yourself, with your shiny teeth
fucking sense of entitlement, and self belief
I get, that you think your deals are slick
but I bet, that you paid for your wheels on tick
cash from the bank for your wank tank
four tonnes of steel, just to get a meal deal
you got cheese but I want Cheddar
[almost whispered | nothing else | acapella]
I can't live like this forever
[the beat back in | the first man rising, never a scream]
I might be insane but I do want change,
let's see what we can arrange
now, I insist that I hold that door
[a weary, bitter plea, low, not shouted, cracking on the last word]
please sir, can I fuckin, have some more?
[Verse 2 | straight in, no break | the second man, a BBC newsreader voice, clipped and cold]
you are intent on living in a tent
it's a lack of work ethic, it's pathetic,
getting parra lettic, it seems that you are just a bum
drowning your sorrow until tomorrow comes
prospects exist and now I insist
that you just stop the grift
[almost whispered | nothing else | acapella]
What about if we taxed the rich?
[the beat back in | the second man rising, biting and bitter]
what the fuck you think this is, bitch
I work hard to pay for my yard
Payin my tax with a platinum card
you want change but my pockets are empty
the only thing I'm changing, is the lane in my M3
if you worked hard, then you could have plenty, fenty,
all you now seem to do, is resent me.
wealth gap? fuckin what a load of crap
now please let me drink my shatoe nerf doo pap
[Bridge | straight in, no break | the beat thins to a bare sub pulse and a ticking hat | both men quiet now, spoken word speech talking, close-mic'd and unhurried, talking to each other]
[the first man | spoken word speech talking | low and close, worn out]
Oh shit, here we both are, living in a car
park, rained on in the fucking dark
[the second man | spoken word, flat and quiet, the posh edges worn smooth]
went down the wrong track, then I got the sack,
then I drank, broke my back, now I'm in the last part
[both men together | murmured in unison, under the breath]
the AI does the fast part, now, the real question is
will it allow, because it's in charge now...
[the second man | quiet and plain, thinking aloud]
you see as it turns out, there is very little clout,
in having the manager or any of the see-suite about
[the first man | soft and matter of fact, resigned]
the speed the robots replaced us was quicker
and sicker than when the government debased us
[the second man | slower, near-whispered, an awkward apology]
back to that time when we very first met,
I do regret that I judged you, I was wrong,
[the first man | gentle and warm, barely above the beat]
yet I don't begrudge you,
it's only us and them now, in this song
[the second man | almost silent, the last words, dissolving into the room]
well we don't have long
and by the time it hits, we'll be gone
[end]
```

## Lane B — boxes to paste (tempo)

Everything in lane A, plus fix 4. All three boxes change, so paste all three.

### Lane B — style box to paste

Round 10's box with one word deleted (`steady`). Everything else byte-identical
— see fix 4.

```
UK garage storytelling and grime over drum and bass. Verse one: an English storyteller talking his lines conversationally over the beat, a flat everyday English accent, observational and tired, spoken not rapped, like telling a mate a story at 4am. Verse two: a BBC newsreader voice, a posh older Englishman, clipped and cold. Then the two men trade lines. Skippy two-step garage shuffles and dark grime bass stabs folded into the drum and bass, cheap synth strings, night-bus melancholy. Underneath it all, a 174 BPM drum and bass beat: light rolling breakbeats and a warm rolling sub bass, spacious, never jump up.
```

### Lane B — exclude styles to paste

Round 10's list minus `half time` and `tempo change`. `slow tempo` stays — see
fix 4 for why that split is the design.

```
American accent, American vocal, Southern drawl, country vocal, twang, americana, blues, Delta blues, gospel, soul singer, US rap, trap, teenage voice, boyish voice, falsetto, autotune, female vocal, choir, crowd noise, audience, applause, jump up, wobble bass, neurofunk, dubstep, EDM drops, glossy production, happy, uplifting, major key, slow tempo, post-punk, madchester, baggy, britpop, folk, pub rock, piano
```

### Lane B — lyrics to paste

```lyrics
[Intro — 4 bars | the beat alone, then straight in]
[Verse 1 | the beat rolling at full pace | the first man, an English storyteller, talking conversationally, spoken not rapped]
Once again, and you catching my eye,
and you looking to the side in shame, but why
now, let me explain, how I'm just poor
you keep on walking, through that Wait trose door
presenting yourself, with your shiny teeth
fucking sense of entitlement, and self belief
I get, that you think your deals are slick
but I bet, that you paid for your wheels on tick
cash from the bank for your wank tank
four tonnes of steel, just to get a meal deal
you got cheese but I want Cheddar
[almost whispered | nothing else | acapella]
I can't live like this forever
[the beat back in | the first man rising, never a scream]
I might be insane but I do want change,
let's see what we can arrange
now, I insist that I hold that door
[a weary, bitter plea, low, not shouted, cracking on the last word]
please sir, can I fuckin, have some more?
[Verse 2 | straight in, no break, the beat rolling at full pace | the second man, a BBC newsreader voice, clipped and cold]
you are intent on living in a tent
it's a lack of work ethic, it's pathetic,
getting parra lettic, it seems that you are just a bum
drowning your sorrow until tomorrow comes
prospects exist and now I insist
that you just stop the grift
[almost whispered | nothing else | acapella]
What about if we taxed the rich?
[the beat back in | the second man rising, biting and bitter]
what the fuck you think this is, bitch
I work hard to pay for my yard
Payin my tax with a platinum card
you want change but my pockets are empty
the only thing I'm changing, is the lane in my M3
if you worked hard, then you could have plenty, fenty,
all you now seem to do, is resent me.
wealth gap? fuckin what a load of crap
now please let me drink my shatoe nerf doo pap
[Breakdown — half time | straight in, no break | the drums drop to half speed, a slow heavy kick and snare, the sub holding underneath, the room opening up]
[Bridge | both men quiet now, spoken word speech talking, close-mic'd and unhurried, talking to each other]
[the first man | spoken word speech talking | low and close, worn out]
Oh shit, here we both are, living in a car
park, rained on in the fucking dark
[the second man | spoken word, flat and quiet, the posh edges worn smooth]
went down the wrong track, then I got the sack,
then I drank, broke my back, now I'm in the last part
[both men together | murmured in unison, under the breath]
the AI does the fast part, now, the real question is
will it allow, because it's in charge now...
[the second man | quiet and plain, thinking aloud]
you see as it turns out, there is very little clout,
in having the manager or any of the see-suite about
[the first man | soft and matter of fact, resigned]
the speed the robots replaced us was quicker
and sicker than when the government debased us
[the second man | slower, near-whispered, an awkward apology]
back to that time when we very first met,
I do regret that I judged you, I was wrong,
[the first man | gentle and warm, barely above the beat]
yet I don't begrudge you,
it's only us and them now, in this song
[the second man | almost silent, the last words, dissolving into the room]
well we don't have long
and by the time it hits, we'll be gone
[end]
```

## Round 11 — the experiment grid

Two lanes, seven runs, one axis at a time. **Re-paste all four boxes every
run** (My Taste, Style, Exclude, Lyrics) — "Reuse Prompt" silently carries the
old lyrics forward, and a stale lyric box is inaudible as such. **Check which
lane's boxes are in the window before you hit generate**; the lanes differ in
all three, and a lane-B lyric box under lane-A excludes is the kind of mistake
that reads as "the prompt was ignored".

### Lane A, axis 1 — sliders, style box held at round 10's

Five of the seven runs live here. The boxes cannot change the arrangement, so
this axis is a clean read on the sliders alone.

| Run | Style | Weird | Title | The question |
|---|---|---|---|---|
| A1 | 70 | 40 | `camping-r11a-base-s70w40` | Control, and **the run that matters most**. Does round 10 reproduce with the fixed lyrics and a softer bridge? If yes, you have a new keeper before anything risky happens. |
| A2 | 85 | 40 | `camping-r11a-tight-s85w40` | The corpus default is 75, not 100 — high adherence rewards a specific box, and this one is specific. Does the two-step get *more* garage, or does it over-tighten? |
| A3 | 70 | 60 | `camping-r11a-loose-s70w60` | 60–65 is the documented creative sweet spot. Round 10 sat at 40. Does the groove get more interesting or just less English? |
| A4 | 90 | 25 | `camping-r11a-literal-s90w25` | Maximum obedience. The diagnostic run: anything the box asks for that *still* doesn't appear here is not promptable and has to be edited in. |

### Lane A, axis 2 — style variants, sliders held at 70/40

**B — doctrinal genre order.** Swap the first sentence for:

```
Drum and bass at 174 BPM arranged as UK garage storytelling and grime.
```

…and delete `Underneath it all, a 174 BPM drum and bass beat:` from the
last sentence, so it reads `Light rolling breakbeats and a warm rolling sub
bass, spacious, never jump up.` Title `camping-r11a-varB-order-s70w40`. Tests the
house rule against what actually worked.

**C — voices win.** Round-10 box minus `cheap synth strings, night-bus
melancholy,` — Suno dilutes across everything named, and this box spends a third
of itself on two speaking voices that have to carry the whole track. Title
`camping-r11a-varC-strip-s70w40`. If the vocals sharpen, the strings were costing
more than they paid.

**D — night bus up.** The opposite bet: replace `cheap synth strings, night-bus
melancholy` with `a cold minor synth-string line held under everything, the last
bus home, sparse and unlit`. Title `camping-r11a-varD-nightbus-s70w40`.
**Optional** — run it only if A1–A3 leave you wanting more atmosphere.

### Lane B — the tempo experiment

Two runs, and **only after lane A has produced a keeper.**

| Run | Style | Weird | Title | The question |
|---|---|---|---|---|
| B1 | 70 | 40 | `camping-r11b-drop-s70w40` | Does the bridge drop, **and do the verses hold at full pace?** Judge the verses first — if they slackened, that is the trade, and lane A is still there. |
| B2 | 70 | 40 | `camping-r11b-varF-drop-s70w40` | Only if B1's bridge stayed bouncy. See F below. |

**If B1 comes back with the whole track at half speed**, the answer is not to
re-prompt — it is that removing a global ban did what removing a global ban
does. Put `half time` back in the excludes, and get the tempo change with a
Studio edit instead, which is what the corpus recommends for half-time anyway.

**F — the arc clause, and the drop named in the box.** The style box describes
the two voices as *states* and never says where they end up, and an arc is the
highest-leverage vocal device there is. It also, as of round 11, never mentions
the tempo drop — that lives only in a bracket cue. F puts both in the box:
replace `Then the two men trade lines.` with

```
Then the two men trade lines, and for the last section it drops to half time, both of them quiet, spoken and close over a slow heavy kick.
```

**This is the escalation for fix 4, so run it second (B2)** — take the plain
lane-B boxes first, and only reach for F if the
bridge refuses to come down on the lyric cues alone. Otherwise you will not know
which instruction did the work, and F costs you ~30 chars of the voices' weight
to find out.

### How to read the results

**Lane A** — judge on **prompt adherence** first (did the two voices stay
English and stay apart?), then **the bridge** (did it come down in energy
without the beat changing?), then **the groove** (is the two-step audible inside
the D&B, or did one eat the other?).

**Lane B** — judge **the verses before the bridge.** A dropped bridge is
worthless if the verses came down with it, and it is the easier thing to fall in
love with on a first listen.

Thumbs-down every reject as you go — disliked generations leave the workspace,
and the implicit half of My Taste learns from what you keep. **Except round 10**
— leave it alone.

Then log the round below, and mark the take you keep with a ⭐.

## Revision log

### Round 10 — 2026-09-13 — the UKG cut lands (other machine)

The take Kai likes. Rounds 1–9 of reasoning were not committed and are stranded;
what is recorded above is what Suno stored. **If the other machine still has the
session, fold its notes in here.**

What round 10's boxes tell us on their own:

- **The voices lost their names and got behaviours instead** — the single
  biggest change from v1, and the one most likely to be why it works.
- **The drops are gone.** v1 had two 32-bar instrumental drops; this cut runs
  verse → verse → bridge with `straight in, no break` at each seam. It is a
  storytelling record now, not a dancefloor one.
- **Each verse has an acapella hinge** — `I can't live like this forever` and
  `What about if we taxed the rich?` — marked `almost whispered | nothing else |
  acapella`, with the beat returning on the next cue. Both land the verse's
  point in the one bar where nothing else is playing.
- **New lyric material** absent from v1: `four tonnes of steel, just to get a
  meal deal`, `you got cheese but I want Cheddar`, `Payin my tax with a platinum
  card`, and the bridge ending cold rather than on v1's `let's make a happy
  ending for this song`.
- **The exclude list tripled** and is mostly about accent. See above.

### Round 11 — pending

Four fixes — `see-suite`, the bridge rhyme (Kai's line), softer spoken-word
bridge cues, and the half-time drop — split across two lanes: **A** keeps round
10's arrangement locked and changes only how the bridge is performed, **B**
opens the tempo. Five runs in A, two in B, A first. Grid above.

**Log the keeper here with a ⭐ and its Suno URL**, and say which lane it came
from — if lane B never beats lane A, that is a result worth writing down, not a
failure.
