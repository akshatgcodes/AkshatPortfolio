import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Pause, Play, SkipForward } from 'lucide-react'
import { playlist } from '../data/profile'
import { useHeroSound } from '../lib/useHeroSound'

type Sound = ReturnType<typeof useHeroSound>

export function SoundWaves({ sound }: { sound: Sound }) {
  return <canvas ref={sound.canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}

// Deliberately quiet (thin, translucent border) so it never competes with the hero CTAs.
export function SoundControls({ sound, className = '' }: { sound: Sound; className?: string }) {
  const { state, index, toggle, skip } = sound
  const playing = state === 'playing'
  const Icon = state === 'loading' ? Loader2 : playing ? Pause : Play
  return (
    <div className={`flex items-center gap-3 rounded-full bg-ink/70 py-1 pl-4 pr-1 backdrop-blur-sm ${className}`}>
      <div className="min-w-0 text-right text-[11px] uppercase leading-tight tracking-[0.18em] sm:text-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={state === 'error' ? 'error' : state === 'idle' || state === 'loading' ? 'idle' : index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="truncate text-mist/60"
          >
            {state === 'error' ? (
              'Preview unavailable'
            ) : state === 'idle' || state === 'loading' ? (
              'Play my vibe'
            ) : (
              <>
                {playlist[index].title}
                <br />
                <span className="text-mist/45">{playlist[index].artist}</span>
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex shrink-0 items-center rounded-full border border-mist/35 text-mist/80">
        <button
          type="button"
          onClick={toggle}
          disabled={state === 'loading'}
          aria-label={playing ? 'Pause music' : 'Play music: 30-second song previews'}
          className="flex h-11 w-11 items-center justify-center rounded-l-full transition-colors hover:bg-mist/10 hover:text-mist"
        >
          <Icon className={`h-4 w-4 ${state === 'loading' ? 'animate-spin' : 'fill-current'}`} />
        </button>
        <span className="h-5 w-px bg-mist/25" aria-hidden="true" />
        <button
          type="button"
          onClick={skip}
          disabled={state === 'loading'}
          aria-label="Next song"
          className="flex h-11 w-11 items-center justify-center rounded-r-full transition-colors hover:bg-mist/10 hover:text-mist"
        >
          <SkipForward className="h-4 w-4 fill-current" />
        </button>
      </div>
    </div>
  )
}
