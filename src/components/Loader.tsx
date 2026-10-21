import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { profile } from '../data/profile'
import { lockScroll } from '../lib/scroll'

const DURATION = 1.4

// Name rises in letter by letter while a counter runs to 100, then the curtain lifts.
export function Loader({ onDone }: { onDone: () => void }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))

  useEffect(() => {
    lockScroll(true)
    const controls = animate(count, 100, { duration: DURATION, ease: [0.65, 0, 0.35, 1], onComplete: onDone })
    return () => {
      controls.stop()
      lockScroll(false)
    }
  }, [count, onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-5 py-6 sm:px-8 md:px-10 md:py-9"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <span className="label text-muted">{profile.role}</span>
      <div className="flex overflow-hidden">
        {profile.firstName.split('').map((ch, i) => (
          <motion.span
            key={i}
            className="display italic"
            style={{ fontSize: 'clamp(5rem, 20vw, 320px)' }}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
      <div className="flex items-end justify-between border-t border-rule pt-4">
        <span className="label text-muted">{profile.location}</span>
        <motion.span className="label text-signal">{rounded}</motion.span>
      </div>
    </motion.div>
  )
}
