import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { playlist } from '../data/profile'

type PlayState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

const BAR = 4
const GAP = 5
const SIGNAL = '#FF4F1A'

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
// plays they follow its real frequency data through a Web Audio analyser. The hook owns the
// audio and the canvas loop so the waves and the controls can be placed independently.
export function useHeroSound() {
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

      const mid = h * (w < 1024 ? 0.48 : 0.6)
      const maxH = h * (w < 1024 ? 0.2 : 0.3)
      const perSide = Math.floor(w / 2 / (BAR + GAP))
      const live = analyser.current
      if (live) live.getByteFrequencyData(bins)
      if (levels.length !== perSide) levels = Array(perSide).fill(0)

      ctx.fillStyle = SIGNAL

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
        ctx.globalAlpha = (live ? 0.9 : 0.55) * (1 - d * 0.85)
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

  return { canvas, state, index, toggle, skip }
}
