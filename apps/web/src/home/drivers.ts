import gsap from 'gsap'

/** Convert a normalized t into a page scrollY target. */
function scrollTargetForT(t: number): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return Math.min(1, Math.max(0, t)) * max
}

/** Cinematic waypoint: tween the page scroll to a target t (so the rig follows). */
export function flyToT(t: number, duration = 1.6): gsap.core.Tween {
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: scrollTargetForT(t),
    duration,
    ease: 'power2.inOut',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}

/** Trailer/attract: sweep from start to end over `duration` seconds. */
export function autoplay(duration = 12): gsap.core.Tween {
  const proxy = { y: window.scrollY }
  return gsap.to(proxy, {
    y: () => document.documentElement.scrollHeight - window.innerHeight,
    duration,
    ease: 'none',
    onUpdate: () => window.scrollTo(0, proxy.y),
  })
}
