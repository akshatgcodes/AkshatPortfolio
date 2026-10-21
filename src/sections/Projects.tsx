import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowLink } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { RollText } from '../components/RollText'
import { SectionHead } from '../components/SectionHead'
import { projects } from '../data/projects'

const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)]

// Desktop only: the hovered project's screenshot trails the cursor.
function Preview({ slug }: { slug: string | null }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 28 })
  const sy = useSpring(y, { stiffness: 260, damping: 28 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {slug && (
          <motion.img
            key={slug}
            src={`/projects/${slug}-1.webp`}
            alt=""
            className="absolute left-8 top-0 w-[380px] -translate-y-1/2 border border-rule shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function Projects() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="projects" className="px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <SectionHead index="02" label="Selected work" title="Things I’ve" accent="built" />
      <Preview slug={hovered} />

      <div className="label mb-3 hidden grid-cols-12 gap-x-6 text-muted lg:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-4">Project</span>
        <span className="col-span-5">What it does</span>
        <span className="col-span-2 text-right">Links</span>
      </div>

      <ol onMouseLeave={() => setHovered(null)}>
        {ordered.map((p, i) => (
          <FadeIn
            as="li"
            key={p.slug}
            delay={(i % 4) * 0.05}
            y={20}
            className="group border-t border-rule py-6 transition-colors last:border-b hover:bg-bone/[0.03] md:py-8"
          >
            <div className="grid grid-cols-12 gap-x-6 gap-y-3" onMouseEnter={() => setHovered(p.slug)}>
              <span className="label col-span-2 pt-2 text-signal sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <div className="col-span-10 sm:col-span-11 lg:col-span-4">
                <h3 className="display transition-transform duration-300 group-hover:translate-x-2" style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)' }}>
                  <a href={p.live} target="_blank" rel="noreferrer" data-cursor="view">
                    <RollText text={p.name} />
                  </a>
                </h3>
                <p className="label mt-1 text-muted">{p.category}</p>
              </div>
              <div className="col-span-12 sm:col-span-11 sm:col-start-2 lg:col-span-5 lg:col-start-auto">
                <p className="max-w-[52ch] leading-relaxed text-bone/80">{p.description}</p>
                <p className="label mt-3 text-muted">{p.stack.join(' / ')}</p>
              </div>
              <div className="col-span-12 flex gap-6 sm:col-span-11 sm:col-start-2 lg:col-span-2 lg:col-start-auto lg:flex-col lg:items-end lg:gap-1">
                <ArrowLink href={p.live} className="text-bone">
                  Live ↗
                </ArrowLink>
                <ArrowLink href={p.repo} className="text-muted">
                  Code ↗
                </ArrowLink>
              </div>
              {/* No hover on touch screens, so the screenshot sits inline instead. */}
              <img
                src={`/projects/${p.slug}-1.webp`}
                alt={`${p.name} screenshot`}
                loading="lazy"
                decoding="async"
                className="col-span-12 mt-2 w-full border border-rule sm:col-span-11 sm:col-start-2 lg:hidden"
              />
            </div>
          </FadeIn>
        ))}
      </ol>
    </section>
  )
}
