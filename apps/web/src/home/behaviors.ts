import type { CameraBehaviorFn } from './timeline'

export const bespokePose: CameraBehaviorFn = ({ self }) => self

export const interpolatePoses: CameraBehaviorFn = ({ focus, prev, next }) => ({
  position: [
    prev.position[0] + (next.position[0] - prev.position[0]) * focus,
    prev.position[1] + (next.position[1] - prev.position[1]) * focus,
    prev.position[2] + (next.position[2] - prev.position[2]) * focus,
  ],
  lookAt: [
    prev.lookAt[0] + (next.lookAt[0] - prev.lookAt[0]) * focus,
    prev.lookAt[1] + (next.lookAt[1] - prev.lookAt[1]) * focus,
    prev.lookAt[2] + (next.lookAt[2] - prev.lookAt[2]) * focus,
  ],
})
