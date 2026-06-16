// Intentional mirror of TailDirection in @badcode/comic (packages/comic/src/bubbles/renderers/types.ts).
// The CLI emits generated code as strings and deliberately doesn't depend on @badcode/comic —
// keep this union in sync by hand if the comic package's set changes.
type TailDirection = 'bottom-left' | 'bottom' | 'bottom-right' | 'top-left' | 'top' | 'top-right' | 'none'

const DIRECTION_MAP: Record<string, TailDirection> = {
  'top-center': 'top',
  'top-left': 'top-left',
  'top-left-left': 'top-left',
  'top-right': 'top-right',
  'top-right-right': 'top-right',
  'bottom-center': 'bottom',
  'bottom-left': 'bottom-left',
  'bottom-left-left': 'bottom-left',
  'bottom-right': 'bottom-right',
  'bottom-right-right': 'bottom-right',
}

export function mapTailDirection(direction: string | undefined): TailDirection {
  if (!direction) return 'none'
  return DIRECTION_MAP[direction] ?? 'none'
}
