import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../data/nav'
import { socials } from '../data/profile'
import { lockScroll, scrollToHash, scrollToTop } from '../lib/scroll'
import { RollText } from './RollText'

const ease = [0.76, 0, 0.24, 1] as const

export function MenuButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-haspopup="dialog" className={`label min-h-11 text-bone ${className}`}>
      Menu <span className="text-signal">+</span>
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
          className="fixed inset-0 z-[90] flex flex-col bg-ink px-5 pb-8 pt-5"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl italic">ag</span>
            <button ref={closeRef} type="button" onClick={onClose} className="label min-h-11 text-bone">
              Close <span className="text-signal">×</span>
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center">
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
                className="flex items-baseline gap-4 border-t border-rule py-3"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.5 }}
              >
                <span className="label text-signal">0{i + 1}</span>
                <span className="display text-[15vw]">{l.label}</span>
              </motion.a>
            ))}
          </nav>
          <div className="label flex justify-between text-muted">
            <a href={`mailto:${socials.email}`}>Email ↗</a>
            <a href={socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// A thin full-width bar with a hairline, dropping in once the hero has scrolled away.
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
          className="fixed inset-x-0 top-0 z-[80] border-b border-rule bg-ink/80 backdrop-blur-md"
          initial={{ y: -70 }}
          animate={{ y: 0 }}
          exit={{ y: -70 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="grid grid-cols-12 items-center gap-x-6 px-5 py-2 sm:px-8 md:px-10">
            <button type="button" onClick={scrollToTop} className="col-span-6 min-h-11 text-left md:col-span-3" aria-label="Back to top">
              <span className="font-display text-xl italic">ag</span>
            </button>
            <nav className="col-span-9 hidden justify-end gap-7 md:flex">
              {navLinks.map((l, i) => (
                <a key={l.href} href={l.href} className={`label transition-colors ${l.href === '#contact' ? 'text-signal hover:text-bone' : 'text-muted hover:text-bone'}`}>
                  <span className="mr-1.5 opacity-60">0{i + 1}</span>
                  <RollText text={l.label} />
                </a>
              ))}
            </nav>
            <MenuButton onClick={onMenu} className="col-span-6 justify-self-end md:hidden" />
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
