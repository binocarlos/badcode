export interface ProjectTile { name: string; href: string }

/** Returns the href of the first tile whose name matches (case-insensitive, trimmed), else null. */
export function pickProject(tiles: ProjectTile[], name: string): string | null {
  const want = name.trim().toLowerCase()
  const hit = tiles.find((t) => t.name.trim().toLowerCase() === want)
  return hit ? hit.href : null
}

/**
 * In-page scraper (evaluated as `(${SCRAPE_PROJECTS})()`), mirroring dom.ts's SCRAPE_IMGS pattern.
 * Confirmed live 2026-06-30: project <a> anchors carry an empty text node — the visible name
 * lives in a sibling styled-components span with a HASHED class (so we cannot key on class).
 * For each project anchor we climb ancestors and take the first own-text node that is short and
 * is not an edit/delete affordance label. Untitled projects fall back to their date label.
 */
export const SCRAPE_PROJECTS = `() => {
  const ownText = (el) => Array.from(el.childNodes)
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent.trim())
    .join('')
    .trim()
  const out = []
  for (const a of document.querySelectorAll('a[href*="/fx/tools/flow/project/"]')) {
    const href = a.getAttribute('href') || ''
    let name = ''
    let node = a
    for (let i = 0; i < 8 && node; i++) {
      for (const el of node.querySelectorAll('*')) {
        const t = ownText(el)
        if (t && t.length < 40 && !/^(edit|delete)/i.test(t)) { name = t; break }
      }
      if (name) break
      node = node.parentElement
    }
    if (href) out.push({ name, href })
  }
  return out
}`
