import { AnimatePresence, motion } from 'framer-motion'
import { playlist } from '../data/profile'
import { useHeroSound } from '../lib/useHeroSound'

type Sound = ReturnType<typeof useHeroSound>

export function SoundWaves({ sound }: { sound: Sound }) {
  return <canvas ref={sound.canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}

// Plain mono text controls, quieter than the CTA: "▶ Play — Compass / The Neighbourhood  Next →".
export function SoundControls({ sound, className = '' }: { sound: Sound; className?: string }) {
  const { state, index, toggle, skip } = sound
  const playing = state === 'playing'
  const label = state === 'loading' ? 'Loading…' : playing ? '❚❚ Pause' : '▶ Play'
  return (
    <div className={`label flex items-center gap-4 text-muted ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={state === 'loading'}
        aria-label={playing ? 'Pause music' : 'Play music: 30-second song previews'}
        className="min-h-11 text-bone transition-colors hover:text-signal"
      >
        {label}
      </button>
      <AnimatePresence mode="wait">
        <motion.span
          key={state === 'error' ? 'error' : state === 'idle' || state === 'loading' ? 'idle' : index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="hidden truncate sm:inline"
        >
          {state === 'error'
            ? 'Preview unavailable'
            : state === 'idle' || state === 'loading'
              ? 'My vibe — 30s previews'
              : `${playlist[index].title} / ${playlist[index].artist}`}
        </motion.span>
      </AnimatePresence>
      <button type="button" onClick={skip} disabled={state === 'loading'} aria-label="Next song" className="min-h-11 transition-colors hover:text-bone">
        Next →
      </button>
    </div>
  )
}
