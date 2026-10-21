import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Loader } from './components/Loader'
import { FloatingNav, MobileMenu } from './components/Nav'
import { startSmoothScroll } from './lib/scroll'
import { About } from './sections/About'
import { Awards } from './sections/Awards'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { GithubActivity } from './sections/GithubActivity'
import { Hero } from './sections/Hero'
import { Marquee } from './sections/Marquee'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

const INTRO_KEY = 'intro-seen'

// The intro plays once per browser session; storage can throw in private modes.
function introSeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export default function App() {
  const [intro, setIntro] = useState(() => !introSeen())
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* not persisted, the intro just plays again next load */
    }
    setIntro(false)
  }, [])

  useEffect(() => startSmoothScroll(), [])

  return (
    <>
      <AnimatePresence>{intro && <Loader onDone={finishIntro} />}</AnimatePresence>
      <Cursor />
      <FloatingNav onMenu={openMenu} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <main className="bg-ink" style={{ overflowX: 'clip' }}>
        {/* Remounting the hero when the intro ends replays its entrance under the lifting curtain. */}
        <Hero key={intro ? 'behind-intro' : 'live'} onMenu={openMenu} />
        <Marquee />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <GithubActivity />
        <Awards />
        <Contact />
      </main>
    </>
  )
}
