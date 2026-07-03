/**
 * The GPOM commit graph as a living glyph: shared history → the push → the fork.
 * Draws itself in on load (stroke-dash), then the two branch tips pulse.
 * Geometry echoes the Atlas: bad branch up, good branch down, rings at the tips.
 */
export function ForkGlyph() {
  return (
    <svg
      className="fork-glyph"
      viewBox="0 0 320 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* shared history */}
      <path className="fg-trunk" d="M 8 60 H 148" pathLength={1} />
      {/* the fork */}
      <path className="fg-branch fg-bad" d="M 148 60 C 180 60 176 24 208 24 H 288" pathLength={1} />
      <path className="fg-branch fg-good" d="M 148 60 C 180 60 176 96 208 96 H 288" pathLength={1} />
      {/* commits on the trunk */}
      <circle className="fg-commit" cx="36" cy="60" r="3.5" />
      <circle className="fg-commit" cx="76" cy="60" r="3.5" />
      <circle className="fg-commit" cx="116" cy="60" r="3.5" />
      {/* the push — the commit where it forks */}
      <circle className="fg-commit fg-push" cx="148" cy="60" r="4.5" />
      {/* commits on the branches */}
      <circle className="fg-commit" cx="226" cy="24" r="3.5" />
      <circle className="fg-commit" cx="256" cy="24" r="3.5" />
      <circle className="fg-commit" cx="226" cy="96" r="3.5" />
      <circle className="fg-commit" cx="256" cy="96" r="3.5" />
      {/* branch tips — the two endings */}
      <circle className="fg-tip" cx="296" cy="24" r="7" />
      <circle className="fg-tip" cx="296" cy="96" r="7" />
    </svg>
  )
}
