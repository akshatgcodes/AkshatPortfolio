import { motion, useReducedMotion } from 'framer-motion'
import { Braces, Database, Rocket, Terminal, type LucideIcon } from 'lucide-react'
import { AnimatedText } from '../components/AnimatedText'
import { ContactButton } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { profile } from '../data/profile'

const tiles: { Icon: LucideIcon; pos: string; size: string; x: number; delay: number; rotate: number }[] = [
  { Icon: Braces, pos: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%]', size: 'w-[84px] sm:w-[120px] md:w-[150px]', x: -80, delay: 0.1, rotate: -12 },
  { Icon: Database, pos: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]', size: 'w-[72px] sm:w-[100px] md:w-[124px]', x: -80, delay: 0.25, rotate: 9 },
  { Icon: Terminal, pos: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%]', size: 'w-[84px] sm:w-[120px] md:w-[150px]', x: 80, delay: 0.15, rotate: 10 },
  { Icon: Rocket, pos: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]', size: 'w-[76px] sm:w-[108px] md:w-[136px]', x: 80, delay: 0.3, rotate: -8 },
]

function Tile({ Icon, rotate, index }: { Icon: LucideIcon; rotate: number; index: number }) {
  const still = useReducedMotion()
  return (
    <motion.div
      animate={still ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
      className="flex aspect-square w-full items-center justify-center rounded-[28%]"
      style={{
        rotate,
        background: 'linear-gradient(145deg, #2a1a33 0%, #120a18 55%, #2b1408 100%)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.12), inset 6px 6px 18px rgba(182,0,168,0.35), inset -6px -6px 18px rgba(190,76,0,0.25), 0 24px 40px rgba(0,0,0,0.55)',
      }}
    >
      <Icon className="h-[42%] w-[42%] text-mist" strokeWidth={1.4} />
    </motion.div>
  )
}

export function About() {
  return (
    <section id="about" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10">
      {tiles.map((t, i) => (
        <div key={i} className={`absolute ${t.pos} ${t.size}`} aria-hidden="true">
          <FadeIn delay={t.delay} x={t.x} y={0} duration={0.9}>
            <Tile Icon={t.Icon} rotate={t.rotate} index={i} />
          </FadeIn>
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn as="h2" y={40} className="hero-heading text-center font-black uppercase leading-none tracking-tight" >
            <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>About me</span>
          </FadeIn>
          <AnimatedText
            text={profile.about}
            className="max-w-[560px] text-center font-medium leading-relaxed text-mist"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <FadeIn className="flex flex-wrap justify-center gap-2">
            {profile.facts.map((f) => (
              <span key={f} className="rounded-full border border-mist/25 px-4 py-1.5 text-xs uppercase tracking-widest text-mist/80 sm:text-sm">
                {f}
              </span>
            ))}
          </FadeIn>
        </div>
        <FadeIn>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
