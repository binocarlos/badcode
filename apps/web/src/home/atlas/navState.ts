export type Lod = 'galaxy' | 'mid' | 'node'

/**
 * Camera distance from the scene origin → reading altitude.
 * Thresholds chosen against existing camera poses: overview sits at z≈76
 * (galaxy), node close-ups sit at z≈22 (node).
 */
export function altitudeToLod(distance: number): Lod {
  if (distance > 50) return 'galaxy'
  if (distance > 22) return 'mid'
  return 'node'
}

export interface NavState {
  focusId: string | null
  lod:     Lod
}

export const INITIAL_NAV: NavState = { focusId: null, lod: 'galaxy' }

export function focusNode(_state: NavState, id: string): NavState {
  return { focusId: id, lod: 'node' }
}

export function toGalaxy(_state: NavState): NavState {
  return { focusId: null, lod: 'galaxy' }
}

export function withLod(state: NavState, lod: Lod): NavState {
  return { ...state, lod }
}
