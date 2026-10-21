import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Loader2, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { nowPlaying } from '../data/profile'

type PlayState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

const BAR = 4
const GAP = 5
const STOPS = ['#BE4C00', '#B600A8', '#7621B0']

// The preview URL is looked up on first play rather than hardcoded, since Apple rotates them.
async function previewUrl() {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${nowPlaying.itunesId}`)
  const data = await res.json()
  const url = data.results?.[0]?.previewUrl
  if (!url) throw new Error('no preview')
  return url as string
}

// Sound bars behind the hero portrait. Idle they breathe on a sine; while the song preview
// plays they follow its real frequency data through a Web Audio analyser.
export function HeroSound() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const [state, setState] = useState<PlayState>('idle')
  const still = useReducedMotion()

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const ctx = el.getContext('2d')!
    let frame = 0
    let visible = true
    let levels: number[] = []
    const bins = new Uint8Array(128)

    const draw = (t: number) => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = el.clientWidth
      const h = el.clientHeight
      if (el.width !== w * dpr || el.height !== h * dpr) {
        el.width = w * dpr
        el.height = h * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const mid = h * (w < 640 ? 0.52 : 0.6)
      const maxH = h * (w < 640 ? 0.22 : 0.3)
      const perSide = Math.floor(w / 2 / (BAR + GAP))
      const live = analyser.current
      if (live) live.getByteFrequencyData(bins)
      if (levels.length !== perSide) levels = Array(perSide).fill(0)

      const grad = ctx.createLinearGradient(0, mid - maxH, 0, mid + maxH)
      STOPS.forEach((c, i) => grad.addColorStop(i / (STOPS.length - 1), c))
      ctx.fillStyle = grad

      for (let i = 0; i < perSide; i++) {
        const d = i / perSide
        // Bars nearest the photo carry the bass, the outer ones the treble.
        const target = live
          ? Math.pow(bins[Math.min(bins.length - 1, Math.floor(d * bins.length * 0.75))] / 255, 1.4) * (1 - d * 0.35)
          : still
            ? 0.12
            : 0.1 + 0.08 * Math.sin(t / 700 - i * 0.22) * Math.cos(t / 1300 + i * 0.07)
        levels[i] += (target - levels[i]) * 0.25
        const bh = Math.max(3, levels[i] * maxH)
        ctx.globalAlpha = 0.85 * (1 - d * 0.8)
        for (const side of [-1, 1]) {
          const x = w / 2 + side * (i * (BAR + GAP) + GAP / 2) - (side < 0 ? BAR : 0)
          ctx.beginPath()
          ctx.roundRect(x, mid - bh, BAR, bh * 2, BAR / 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      if (visible) frame = requestAnimationFrame(draw)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(draw)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [still])

  useEffect(() => () => audio.current?.pause(), [])

  const toggle = async () => {
    if (state === 'playing') {
      audio.current?.pause()
      return
    }
    try {
      if (!audio.current) {
        setState('loading')
        const a = new Audio()
        a.crossOrigin = 'anonymous'
        a.src = await previewUrl()
        a.volume = 0.6
        a.onplay = () => setState('playing')
        a.onpause = () => setState('paused')
        a.onended = () => setState('idle')
        const ac = new AudioContext()
        const node = ac.createAnalyser()
        node.fftSize = 256
        node.smoothingTimeConstant = 0.8
        ac.createMediaElementSource(a).connect(node).connect(ac.destination)
        audio.current = a
        analyser.current = node
      }
      await audio.current.play()
    } catch {
      setState('error')
    }
  }

  const playing = state === 'playing'
  const Icon = state === 'loading' ? Loader2 : playing ? Pause : Play
  return (
    <>
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="absolute bottom-[96px] right-6 z-20 flex items-center gap-3 sm:bottom-[112px] md:bottom-[128px] md:right-10">
        <AnimatePresence>
          {(playing || state === 'error') && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-right text-[10px] uppercase leading-tight tracking-[0.2em] text-mist/60 sm:text-xs"
            >
              {state === 'error' ? 'Preview unavailable' : (
                <>
                  {nowPlaying.title}
                  <br />
                  <span className="text-mist/40">{nowPlaying.artist}</span>
                </>
              )}
            </motion.span>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={toggle}
          disabled={state === 'loading'}
          aria-label={playing ? 'Pause music' : `Play a 30-second preview of ${nowPlaying.title} by ${nowPlaying.artist}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-mist/70 text-mist transition-colors hover:bg-mist/10 md:h-12 md:w-12"
        >
          <Icon className={`h-4 w-4 ${state === 'loading' ? 'animate-spin' : 'fill-current'}`} />
        </button>
      </div>
    </>
  )
}
