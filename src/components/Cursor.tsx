import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

type Mode = 'default' | 'link' | 'view'

// Desktop-only cursor: a dot that tracks exactly and a ring that trails it. The ring grows
// over links and turns into a "VIEW" badge over anything marked data-cursor="view".
export function Cursor() {
  const [enabled] = useState(
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor')
    const detect = (t: Element | null) =>
      setMode(t?.closest('[data-cursor="view"]') ? 'view' : t?.closest('a, button') ? 'link' : 'default')
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      detect(e.target as Element | null)
    }
    // Scrolling moves content under a still mouse, so re-check what is under it.
    const onScroll = () => detect(document.elementFromPoint(x.get(), y.get()))
    const onLeave = () => setVisible(false)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const size = mode === 'view' ? 88 : mode === 'link' ? 56 : 34
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', mixBlendMode: mode === 'view' ? 'normal' : 'difference' }}
        animate={{
          width: size,
          height: size,
          backgroundColor: mode === 'view' ? 'rgba(255,79,26,1)' : 'rgba(237,234,227,0)',
          borderColor: mode === 'view' ? 'rgba(255,79,26,0)' : 'rgba(237,234,227,1)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <span className="absolute inset-0 rounded-full border-[1.5px]" style={{ borderColor: 'inherit' }} />
        {mode === 'view' && <span className="label text-ink">View</span>}
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-bone"
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: mode === 'view' ? 0 : 1, mixBlendMode: 'difference' }}
      />
    </div>
  )
}
