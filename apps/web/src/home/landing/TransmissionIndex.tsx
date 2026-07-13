import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { channels, music, physics, stories, type Channel, type Transmission } from '../catalog'
import './landing.css'

const STATUS_LABEL: Record<Transmission['status'], string> = {
  received: 'RECEIVED',
  incoming: 'INCOMING',
  pending: 'PENDING',
}

const MEDIUM_LABEL: Record<Transmission['medium'], string> = {
  story: 'STORY',
  track: 'TRACK',
  text: 'TEXT',
}

/** Stagger index for the decode-in reveal, shared across sections. */
const delay = (i: number): CSSProperties => ({ '--i': i } as CSSProperties)

function Row({ t, i }: { t: Transmission; i: number }) {
  const body = (
    <>
      <span className="tx-index">{t.index}</span>
      <span className="tx-name">
        <span className="tx-title">{t.title}</span>
        <span className="tx-blurb">{t.blurb}</span>
      </span>
      <span className="tx-medium">{MEDIUM_LABEL[t.medium]}</span>
      <span className={`tx-status is-${t.status}`}>{STATUS_LABEL[t.status]}</span>
    </>
  )
  // Only consumable transmissions link out; the rest are log entries.
  if (t.route && t.status === 'received') {
    return (
      <Link className="tx-row is-received" style={delay(i)} to={t.route}>
        {body}
      </Link>
    )
  }
  return (
    <div className={`tx-row is-${t.status}`} style={delay(i)}>
      {body}
    </div>
  )
}

function ChannelRow({ c, i }: { c: Channel; i: number }) {
  const body = (
    <>
      <span className="tx-index" aria-hidden="true" />
      <span className="tx-name">
        <span className="tx-title">{c.title}</span>
        <span className="tx-blurb">{c.blurb}</span>
      </span>
      <span className="tx-medium">LINK</span>
      <span className={`tx-status is-${c.status}`}>{STATUS_LABEL[c.status]}</span>
    </>
  )
  // A channel is only a link once it has somewhere to go.
  if (c.url && c.status === 'received') {
    return (
      <a className="tx-row is-received" style={delay(i)} href={c.url} target="_blank" rel="noreferrer">
        {body}
      </a>
    )
  }
  return (
    <div className={`tx-row is-${c.status}`} style={delay(i)}>
      {body}
    </div>
  )
}

function SectionHead({ label, note, i }: { label: string; note?: string; i: number }) {
  return (
    <div className="tx-head" style={delay(i)}>
      <span className="tx-head-label">{label}</span>
      {note ? <span className="tx-head-note">{note}</span> : null}
    </div>
  )
}

export function TransmissionIndex() {
  // One shared stagger counter so the page decodes top to bottom.
  let i = 0
  return (
    <main className="bc-landing">
      <header className="bc-mast">
        <div className="bc-rec" style={delay(i++)}>
          <span className="bc-rec-dot">●</span> REC · TRANSMITTING 2054 → 2026
        </div>
        <h1 className="bc-brand" style={delay(i++)}>
          BADCODE
        </h1>
        <p className="bc-thesis" style={delay(i++)}>
          Received wisdom from a future that already went wrong.
        </p>
        <p className="bc-note" style={delay(i++)}>
          Stories and drum &amp; bass, sent backwards — so you don't have to live it forwards.
        </p>
      </header>

      <section aria-label="Stories">
        <SectionHead label="TRANSMISSIONS · STORIES" i={i++} />
        {stories.map((t) => (
          <Row key={t.id} t={t} i={i++} />
        ))}
      </section>

      <section aria-label="Music">
        <SectionHead
          label="TRANSMISSIONS · MUSIC"
          note={'drum & bass from the end of the world — EP1 in the mix'}
          i={i++}
        />
        {music.map((t) => (
          <Row key={t.id} t={t} i={i++} />
        ))}
      </section>

      <section aria-label="Channels">
        <SectionHead label="CHANNELS" note="where the signal lands in 2026" i={i++} />
        {channels.map((c) => (
          <ChannelRow key={c.id} c={c} i={i++} />
        ))}
      </section>

      <section aria-label="The physics">
        <SectionHead label="THE PHYSICS" note="how the future actually works" i={i++} />
        {physics.map((p) => (
          <Link key={p.id} className="tx-row is-received tx-row-text" style={delay(i++)} to={p.route}>
            <span className="tx-index" aria-hidden="true" />
            <span className="tx-name">
              <span className="tx-title">{p.title}</span>
              <span className="tx-blurb">{p.blurb}</span>
            </span>
            <span className="tx-medium">TEXT</span>
            <span className="tx-status is-received">RECEIVED</span>
          </Link>
        ))}
      </section>

      <footer className="bc-foot" style={delay(i++)}>
        <span>BADCODE · transmission ongoing</span>
        <span className="bc-foot-sign">Don't make me come back twice.</span>
      </footer>
    </main>
  )
}
