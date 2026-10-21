import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Loader2, Pause, Play, SkipForward } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { playlist } from '../data/profile'

type PlayState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

const BAR = 4
const GAP = 5
const STOPS = ['#BE4C00', '#B600A8', '#7621B0']

// Preview URLs are looked up (in one request) on first play rather than hardcoded, since
// Apple rotates them. Tracks without a preview are dropped from the rotation.
async function previewUrls() {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${playlist.map((t) => t.itunesId).join(',')}`)
  const data = await res.json()
  const byId = new Map<number, string>(data.results.filter((r: { previewUrl?: string }) => r.previewUrl).map((r: { trackId: number; previewUrl: string }) => [r.trackId, r.previewUrl]))
  const tracks = playlist.flatMap((t) => (byId.has(t.itunesId) ? [{ ...t, url: byId.get(t.itunesId)! }] : []))
  if (!tracks.length) throw new Error('no previews')
  return tracks
}

type Track = Awaited<ReturnType<typeof previewUrls>>[number]
const FADE = 0.35

// Sound bars behind the hero portrait. Idle they breathe on a sine; while the song preview
// plays they follow its real frequency data through a Web Audio analyser.
export function HeroSound() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const gain = useRef<GainNode | null>(null)
  const tracks = useRef<Track[]>([])
  const trackIndex = useRef(0)
  const [index, setIndex] = useState(0)
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

  // Builds the audio graph once: element -> gain (for fades) -> analyser (for the bars) -> speakers.
  const setup = async () => {
    tracks.current = await previewUrls()
    const a = new Audio()
    a.crossOrigin = 'anonymous'
    a.volume = 0.6
    a.onplay = () => setState('playing')
    a.onpause = () => !a.ended && setState('paused')
    a.onended = () => load(trackIndex.current + 1)
    const ac = new AudioContext()
    const g = ac.createGain()
    const node = ac.createAnalyser()
    node.fftSize = 256
    node.smoothingTimeConstant = 0.8
    ac.createMediaElementSource(a).connect(g).connect(node).connect(ac.destination)
    audio.current = a
    gain.current = g
    analyser.current = node
  }

  const load = async (i: number) => {
    const a = audio.current!
    const g = gain.current!
    const next = (i + tracks.current.length) % tracks.current.length
    trackIndex.current = next
    setIndex(playlist.findIndex((t) => t.itunesId === tracks.current[next].itunesId))
    a.src = tracks.current[next].url
    g.gain.setValueAtTime(0, g.context.currentTime)
    g.gain.linearRampToValueAtTime(1, g.context.currentTime + FADE)
    await a.play()
  }

  const toggle = async () => {
    try {
      if (state === 'playing') return audio.current?.pause()
      if (!audio.current) {
        setState('loading')
        await setup()
        return await load(0)
      }
      await audio.current.play()
    } catch {
      setState('error')
    }
  }

  const skip = async () => {
    try {
      const g = gain.current
      if (!g) {
        setState('loading')
        await setup()
        return await load(1)
      }
      g.gain.linearRampToValueAtTime(0, g.context.currentTime + FADE)
      await new Promise((r) => setTimeout(r, FADE * 1000))
      await load(trackIndex.current + 1)
    } catch {
      setState('error')
    }
  }

  const playing = state === 'playing'
  const Icon = state === 'loading' ? Loader2 : playing ? Pause : Play
  return (
    <>
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="absolute bottom-[96px] right-6 z-20 sm:bottom-[112px] md:bottom-[128px] md:right-10">
        {/* Sits to the left of the controls without pushing them around as titles change. */}
        <div className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap text-right text-[10px] uppercase leading-tight tracking-[0.2em] sm:text-xs">
          <AnimatePresence mode="wait">
            {(state === 'playing' || state === 'paused' || state === 'error') && (
              <motion.p
                key={state === 'error' ? 'error' : index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-mist/60"
              >
                {state === 'error' ? (
                  'Preview unavailable'
                ) : (
                  <>
                    {playlist[index].title}
                    <br />
                    <span className="text-mist/40">{playlist[index].artist}</span>
                  </>
                )}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center rounded-full border-2 border-mist/70 text-mist">
          <button
            type="button"
            onClick={toggle}
            disabled={state === 'loading'}
            aria-label={playing ? 'Pause music' : 'Play music: 30-second song previews'}
            className="flex h-10 w-11 items-center justify-center rounded-l-full transition-colors hover:bg-mist/10 md:h-11 md:w-12"
          >
            <Icon className={`h-4 w-4 ${state === 'loading' ? 'animate-spin' : 'fill-current'}`} />
          </button>
          <span className="h-5 w-px bg-mist/30" aria-hidden="true" />
          <button
            type="button"
            onClick={skip}
            disabled={state === 'loading'}
            aria-label="Next song"
            className="flex h-10 w-11 items-center justify-center rounded-r-full transition-colors hover:bg-mist/10 md:h-11 md:w-12"
          >
            <SkipForward className="h-4 w-4 fill-current" />
          </button>
        </div>
      </div>
    </>
  )
}
