import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// One Lenis instance for the whole page. Null when the visitor prefers reduced motion,
// in which case everything falls back to native scrolling.
let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ lerp: 0.1, anchors: true })
  // The intro may already have locked the page before this runs.
  if (document.documentElement.style.overflow === 'hidden') lenis.stop()
  let frame = requestAnimationFrame(function raf(time) {
    lenis?.raf(time)
    frame = requestAnimationFrame(raf)
  })
  return () => {
    cancelAnimationFrame(frame)
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash)
  if (!el) return
  if (lenis) lenis.scrollTo(el as HTMLElement, { force: true })
  else el.scrollIntoView({ behavior: 'smooth' })
}
