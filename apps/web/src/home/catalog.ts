import { homeSteps, type HomeStep } from './timeline'

/**
 * The content catalog for the BadCode landing page (the Transmission Index).
 * Everything BadCode publishes is a numbered transmission received from 2054.
 *
 * Status truth: where a piece has an Atlas node, its `homeSteps` status is the
 * single source of truth (live → received, coming-soon → incoming). Entries the
 * Atlas doesn't know about declare their own status here.
 */
export type TransmissionStatus = 'received' | 'incoming' | 'pending'
export type Medium = 'story' | 'track' | 'text'

export interface Transmission {
  id: string
  /** Transmission code in publication order — BC-001, BC-002, … */
  index: string
  title: string
  medium: Medium
  status: TransmissionStatus
  /** Internal link. Rendered as a link only when the piece is consumable. */
  route?: string
  /** One line, BadCode voice. */
  blurb: string
}

const step = (id: string): HomeStep => {
  const s = homeSteps.find((n) => n.id === id)
  if (!s) throw new Error(`catalog: no timeline step '${id}'`)
  return s
}

const statusOf = (s: HomeStep): TransmissionStatus =>
  (s.status ?? 'live') === 'live' ? 'received' : 'incoming'

/** A story that lives on the Atlas: title/blurb/status come from its node. */
const fromStep = (id: string, index: string, blurb?: string): Transmission => {
  const s = step(id)
  return {
    id,
    index,
    title: s.title,
    medium: 'story',
    status: statusOf(s),
    route: s.route,
    blurb: blurb ?? s.blurb ?? '',
  }
}

export const stories: Transmission[] = [
  // GPOM is the Atlas itself, not a node on it — declared inline. BC-000: the
  // origin transmission everything else forks from.
  {
    id: 'gitpush-origin-master',
    index: 'BC-000',
    title: 'GitPush Origin Master',
    medium: 'story',
    status: 'received',
    route: '/comics/gitpush-origin-master',
    blurb:
      'Humanity is a repo. Scroll the log, find the push that ended us — and the fork where you get to differ.',
  },
  fromStep('camping', 'BC-001'),
  fromStep('karen', 'BC-002'),
  {
    id: 'magic-money-tree',
    index: 'BC-003',
    title: 'Magic Money Tree',
    medium: 'story',
    status: 'received',
    route: '/comics/magic-money-tree',
    blurb: 'There is no magic money tree. Except the one they shook for the banks.',
  },
  // BC-004 (gpom-short) and BC-005 (emperors-coin) stay live at their routes
  // but are deliberately not indexed here.
]

export const music: Transmission[] = [
  {
    id: 'track-camping',
    index: 'BC-006',
    title: 'Camping',
    medium: 'track',
    status: 'incoming',
    blurb: '174 BPM. Bob and Tarquin argue about who owns the field.',
  },
  {
    id: 'track-karen',
    index: 'BC-007',
    title: 'Karen Will Lead the Revolution',
    medium: 'track',
    status: 'pending',
    blurb: 'She has all day to complain. Now she has a bassline.',
  },
  {
    id: 'track-magic-money-tree',
    index: 'BC-008',
    title: 'Magic Money Tree',
    medium: 'track',
    status: 'pending',
    blurb: 'We can afford what we can create. Jump-up at 172.',
  },
  {
    id: 'track-gpom',
    index: 'BC-009',
    title: 'git push origin master',
    medium: 'track',
    status: 'pending',
    blurb: 'The title track. The whole story in one drop.',
  },
]

/**
 * Channels — where the signal lands in 2026. Distribution endpoints, not
 * numbered transmissions. A channel goes live by gaining a `url` and flipping
 * to `received`.
 */
export interface Channel {
  id: string
  title: string
  status: TransmissionStatus
  /** External link; the row renders as an <a> only when set. */
  url?: string
  blurb: string
}

export const channels: Channel[] = [
  {
    id: 'youtube',
    title: 'YouTube',
    status: 'incoming',
    blurb: 'The comics, animated. The shorts. The receipts.',
  },
  {
    id: 'soundcloud',
    title: 'SoundCloud',
    status: 'incoming',
    blurb: 'Drum & bass from the end of the world, streamable.',
  },
  {
    id: 'community',
    title: 'Community',
    status: 'incoming',
    blurb: 'The other humans who got the transmission. Compare notes.',
  },
]

/** The physics — reference texts, not numbered transmissions. */
export interface PhysicsLink {
  id: string
  title: string
  route: string
  blurb: string
}

export const physics: PhysicsLink[] = [
  {
    id: 'storyverse',
    title: 'Storyverse',
    route: '/storyverse',
    blurb: step('storyverse').blurb ?? '',
  },
  {
    id: 'future-proof',
    title: 'Future Proof',
    route: '/future-proof',
    blurb: step('future-proof').blurb ?? '',
  },
  {
    id: 'about',
    title: 'About',
    route: '/about',
    blurb: 'Who sent this, and why it keeps calling you loved.',
  },
]
