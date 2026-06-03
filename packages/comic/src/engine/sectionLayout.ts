/**
 * Pure scroll-section geometry for the comic.
 *
 * The comic is a tall scroll track with a pinned (sticky) stage. Each page owns
 * a vertical "section" of the track; how far you've scrolled through a page's
 * section is its scroll progress (0..1). Page sections sit between a leading and
 * trailing pad so the first and last pages can settle on screen.
 *
 * Ported from CapsuleLayoutRender's section memo + scroll handler.
 */

/** Base section height as a fraction of the viewport, per unit of scrollDuration. */
const BASE_SECTION_VH = 1.0
const MOBILE_SECTION_VH = 0.5
/** Leading and trailing pad, as a fraction of the viewport. */
const PAD_VH = 0.5

export interface Section {
  top: number
  height: number
  bottom: number
}

export interface SectionLayout {
  sections: Section[]
  totalHeight: number
  initialPadding: number
}

/**
 * @param durations - per-page scrollDuration multipliers (1 = one viewport tall)
 * @param viewportHeight - current window.innerHeight in px
 * @param mobile - halve the base section height on small screens
 */
export function computeSectionLayout(
  durations: number[],
  viewportHeight: number,
  mobile = false,
): SectionLayout {
  const base = (mobile ? MOBILE_SECTION_VH : BASE_SECTION_VH) * viewportHeight
  const initialPadding = PAD_VH * viewportHeight

  const sections: Section[] = []
  let top = initialPadding
  for (const duration of durations) {
    const height = base * (duration > 0 ? duration : 1)
    sections.push({ top, height, bottom: top + height })
    top += height
  }

  return {
    sections,
    totalHeight: top + PAD_VH * viewportHeight,
    initialPadding,
  }
}

/**
 * Given the scroll position, compute each page's progress (0..1) and which page
 * is current (the one whose section contains the viewport center).
 *
 * @param scrollTop - window.scrollY
 * @param containerTop - the scroll track's offsetTop
 * @param viewportHeight - window.innerHeight
 */
export function computeScrollState(
  layout: SectionLayout,
  scrollTop: number,
  containerTop: number,
  viewportHeight: number,
): { percents: number[]; currentPage: number } {
  const { sections } = layout
  const viewportCenter = scrollTop + viewportHeight / 2
  const percents: number[] = new Array(sections.length).fill(0)
  let currentPage = 0

  for (let i = 0; i < sections.length; i++) {
    const sectionTop = containerTop + sections[i].top
    const height = sections[i].height
    const scrollIntoSection = viewportCenter - sectionTop
    percents[i] = Math.max(0, Math.min(1, scrollIntoSection / height))
    if (viewportCenter >= sectionTop && viewportCenter < sectionTop + height) {
      currentPage = i
    }
  }

  // Edge cases: before the first section, or past the last.
  if (sections.length > 0) {
    if (viewportCenter < containerTop + sections[0].top) {
      currentPage = 0
    } else if (viewportCenter >= containerTop + sections[sections.length - 1].bottom) {
      currentPage = sections.length - 1
    }
  }

  currentPage = Math.max(0, Math.min(currentPage, sections.length - 1))
  return { percents, currentPage }
}
