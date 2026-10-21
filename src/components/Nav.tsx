import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../data/nav'
import { profile, socials } from '../data/profile'
import { lockScroll, scrollToHash, scrollToTop } from '../lib/scroll'
import { RollText } from './RollText'

const ease = [0.76, 0, 0.24, 1] as const

export function MenuButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className={`text-sm font-medium uppercase tracking-wider text-mist transition-opacity hover:opacity-70 ${className}`}
    >
      Menu
    </button>
  )
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[90] flex flex-col bg-ink px-6 pb-8 pt-6"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium uppercase tracking-wider text-mist">{profile.fullName}</span>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="p-1 text-mist">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2">
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                  // Wait for the menu to release the scroll lock before moving.
                  setTimeout(() => scrollToHash(l.href), 50)
                }}
                className="hero-heading text-[13vw] font-black uppercase leading-[1.05]"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.5 }}
              >
                {l.label}
              </motion.a>
            ))}
          </nav>
          <div className="flex justify-between text-xs uppercase tracking-widest text-mist/60">
            <a href={`mailto:${socials.email}`}>Email</a>
            <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Compact bar that drops in once the hero (and its own nav) has scrolled away.
export function FloatingNav({ onMenu }: { onMenu: () => void }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {shown && (
        <motion.header
          className="fixed inset-x-0 top-3 z-[80] flex justify-center px-3 sm:top-4"
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          exit={{ y: -80 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border border-mist/15 bg-ink/70 py-2 pl-5 pr-2 backdrop-blur-md">
            <button type="button" onClick={scrollToTop} className="hero-heading text-lg font-black" aria-label="Back to top">
              AG
            </button>
            <nav className="hidden gap-6 sm:flex">
              {navLinks.slice(0, 3).map((l) => (
                <a key={l.href} href={l.href} className="text-sm font-medium uppercase tracking-wider text-mist">
                  <RollText text={l.label} />
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <MenuButton onClick={onMenu} className="sm:hidden" />
              <a
                href="#contact"
                className="rounded-full px-5 py-2 text-xs font-medium uppercase tracking-widest text-white"
                style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' }}
              >
                <RollText text="Contact" />
              </a>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
