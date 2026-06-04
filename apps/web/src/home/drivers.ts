// apps/web/src/home/drivers.ts
import gsap from 'gsap'
import type { TimelineLayout } from '@badcode/scroll-timeline'

/** Fly to a step's hold-start position — where the camera settles on that beat. */
export function flyToStep(
  id: string,
  layout: TimelineLayout,
  duration = 1.6,
): gsap.core.Tween {
  const step = layout.steps.find((s) => s.id === id)
  const target = step ? step.holdStart : 0
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: target,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}

/** Trailer/attract: sweep from the current scroll position to the end of the track. */
export function autoplay(layout: TimelineLayout, duration = 18): gsap.core.Tween {
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: Math.max(0, layout.totalHeight - window.innerHeight),
    duration,
    ease: 'none',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}
