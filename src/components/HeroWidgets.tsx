import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { experience } from '../data/experience'
import { nowPlaying, terminalScript } from '../data/profile'

const glass = 'rounded-2xl border border-mist/15 bg-[#16131a]/80 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-md'

// Widgets drift a little against the cursor; `depth` is how many px they travel at the edge.
function Float({ children, mx, my, depth, rotate, bob }: { children: ReactNode; mx: MotionValue<number>; my: MotionValue<number>; depth: number; rotate: number; bob: number }) {
  const still = useReducedMotion()
  const x = useTransform(mx, (v) => v * depth)
  const y = useTransform(my, (v) => v * depth)
  return (
    <motion.div style={{ x, y, rotate }}>
      <motion.div animate={still ? undefined : { y: [0, -8, 0] }} transition={{ duration: bob, repeat: Infinity, ease: 'easeInOut' }}>
        {children}
      </motion.div>
    </motion.div>
  )
}

function Terminal() {
  const still = useReducedMotion()
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState(still ? terminalScript[0].cmd.length : 0)
  const current = terminalScript[step % terminalScript.length]
  const previous = step > 0 ? terminalScript[(step - 1) % terminalScript.length] : null
  const done = typed >= current.cmd.length

  useEffect(() => {
    if (still) return
    // Type the command, pause on the output, then move to the next line.
    const t = done
      ? setTimeout(() => {
          setStep((s) => s + 1)
          setTyped(0)
        }, 2600)
      : setTimeout(() => setTyped((n) => n + 1), 70)
    return () => clearTimeout(t)
  }, [still, done, typed])

  return (
    <div className={`${glass} w-[220px] overflow-hidden font-mono text-[11px] leading-relaxed xl:w-[290px] xl:text-[13px]`}>
      <div className="flex items-center gap-1.5 border-b border-mist/10 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] text-mist/50">~/akshat — zsh</span>
      </div>
      <div className="h-[104px] px-3 py-2.5 text-mist/90">
        {previous && (
          <div className="opacity-40">
            <p>
              <span className="text-[#B600A8]">❯</span> {previous.cmd}
            </p>
            <p>{previous.out}</p>
          </div>
        )}
        <p>
          <span className="text-[#B600A8]">❯</span> {current.cmd.slice(0, typed)}
          {!done && <span className="ml-px inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-mist" />}
        </p>
        {done && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#7ee2a8]">
            {current.out}
          </motion.p>
        )}
      </div>
    </div>
  )
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function NowPlaying() {
  const still = useReducedMotion()
  const [elapsed, setElapsed] = useState(54)

  useEffect(() => {
    if (still) return
    const id = setInterval(() => setElapsed((e) => (e + 1) % nowPlaying.durationSec), 1000)
    return () => clearInterval(id)
  }, [still])

  return (
    <a
      href={nowPlaying.link}
      target="_blank"
      rel="noreferrer"
      aria-label={`On repeat: ${nowPlaying.title} by ${nowPlaying.artist}`}
      className={`${glass} block w-[220px] p-3 xl:w-[290px]`}
    >
      <p className="mb-2.5 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-mist/50">
        On repeat
        <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
          {[0.9, 0.5, 1, 0.65].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[#1ed760]"
              style={{ height: `${h * 100}%`, transformOrigin: 'bottom', animation: still ? undefined : `eq 0.${7 + i}s ease-in-out ${i * 0.12}s infinite alternate` }}
            />
          ))}
        </span>
      </p>
      <div className="flex items-center gap-3">
        <img src={nowPlaying.cover} alt="" width={52} height={52} className="h-[52px] w-[52px] rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="truncate text-base font-medium leading-tight text-mist">{nowPlaying.title}</p>
          <p className="truncate text-sm font-light text-mist/60">{nowPlaying.artist}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] tabular-nums text-mist/50">
        {fmt(elapsed)}
        <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-mist/15">
          <span className="absolute inset-y-0 left-0 rounded-full bg-mist" style={{ width: `${(elapsed / nowPlaying.durationSec) * 100}%` }} />
        </span>
        {fmt(nowPlaying.durationSec)}
      </div>
    </a>
  )
}

// A one-line pill on phones; on desktop it stacks under the terminal as a small card.
function Status() {
  const now = experience[0]
  return (
    <div className={`${glass} flex items-center gap-3 rounded-full py-2 pl-3 pr-4 lg:items-start lg:rounded-2xl lg:py-3`}>
      <span className="relative flex h-2.5 w-2.5 shrink-0 lg:mt-1">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#28c840] opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </span>
      <p className="whitespace-nowrap text-xs leading-tight text-mist sm:text-sm lg:whitespace-normal">
        <span className="text-mist/50 lg:mb-1 lg:block lg:text-[10px] lg:uppercase lg:tracking-[0.2em]">Currently </span>
        {now.role} <span className="text-mist/50">@</span> {now.company}
      </p>
    </div>
  )
}

export function HeroWidgets() {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 })
  const my = useSpring(rawY, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  const enter = (delay: number) => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  })

  return (
    <>
      <div className="absolute left-[3%] top-[34%] z-20 hidden w-[220px] flex-col gap-5 lg:flex xl:left-[6%] xl:w-[290px]">
        <motion.div {...enter(0.9)}>
          <Float mx={mx} my={my} depth={-14} rotate={-4} bob={6}>
            <Terminal />
          </Float>
        </motion.div>
        <motion.div {...enter(1.2)} className="pl-6">
          <Float mx={mx} my={my} depth={-8} rotate={0} bob={5}>
            <Status />
          </Float>
        </motion.div>
      </div>
      <motion.div {...enter(1.05)} className="absolute right-[3%] top-[31%] z-20 hidden lg:block xl:right-[6%]">
        <Float mx={mx} my={my} depth={-20} rotate={3} bob={7}>
          <NowPlaying />
        </Float>
      </motion.div>
      {/* Phones and tablets get just the status pill, tucked between the heading and the photo. */}
      <div className="absolute left-1/2 top-[17%] z-20 -translate-x-1/2 sm:top-[22%] lg:hidden">
        <motion.div {...enter(1.2)}>
          <Status />
        </motion.div>
      </div>
    </>
  )
}
