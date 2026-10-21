import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; r: number; a: number; speed: number; phase: number; depth: number; color: string }
type Shooter = { x: number; y: number; vx: number; vy: number; life: number }

const TINTS = ['215,226,234', '215,226,234', '215,226,234', '215,226,234', '182,0,168', '190,76,0']

function makeStars(w: number, h: number): Star[] {
  const count = Math.round((w * h) / 1900)
  return Array.from({ length: count }, () => {
    const depth = Math.random()
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + depth * 1.3,
      a: 0.35 + Math.random() * 0.65,
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      depth,
      color: TINTS[Math.floor(Math.random() * TINTS.length)],
    }
  })
}

// Twinkling stars behind the hero. Nearer (bigger) stars shift more with the mouse, and a
// shooting star crosses the upper half every few seconds. Static when motion is reduced.
export function Starfield() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const ctx = el.getContext('2d')!
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let shooter: Shooter | null = null
    let nextShot = performance.now() + 2500
    let w = 0
    let h = 0
    const pointer = { x: 0, y: 0, ex: 0, ey: 0 }
    let frame = 0
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      w = el.clientWidth
      h = el.clientHeight
      el.width = w * dpr
      el.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = makeStars(w, h)
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      pointer.ex += (pointer.x - pointer.ex) * 0.05
      pointer.ey += (pointer.y - pointer.ey) * 0.05

      for (const s of stars) {
        const twinkle = still ? 1 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase)
        const x = s.x - pointer.ex * s.depth * 14
        const y = s.y - pointer.ey * s.depth * 10
        ctx.fillStyle = `rgba(${s.color},${s.a * twinkle})`
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
        // The nearest few get a soft halo.
        if (s.depth > 0.93) {
          ctx.fillStyle = `rgba(${s.color},${0.12 * twinkle})`
          ctx.beginPath()
          ctx.arc(x, y, s.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!still) {
        if (!shooter && t > nextShot) {
          const fromLeft = Math.random() < 0.5
          shooter = { x: fromLeft ? Math.random() * w * 0.4 : w * (0.6 + Math.random() * 0.4), y: Math.random() * h * 0.35, vx: (fromLeft ? 1 : -1) * 9, vy: 3.2, life: 1 }
        }
        if (shooter) {
          const s = shooter
          const tail = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12)
          tail.addColorStop(0, `rgba(215,226,234,${s.life})`)
          tail.addColorStop(1, 'rgba(215,226,234,0)')
          ctx.strokeStyle = tail
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12)
          ctx.stroke()
          s.x += s.vx
          s.y += s.vy
          s.life -= 0.012
          if (s.life <= 0 || s.x < -100 || s.x > w + 100 || s.y > h) {
            shooter = null
            nextShot = t + 4000 + Math.random() * 5000
          }
        }
        if (visible) frame = requestAnimationFrame(draw)
      }
    }

    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onResize = () => {
      resize()
      if (still) draw(0)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(frame)
      if (visible && !still) frame = requestAnimationFrame(draw)
    })

    resize()
    if (still) draw(0)
    io.observe(el)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
    />
  )
}
