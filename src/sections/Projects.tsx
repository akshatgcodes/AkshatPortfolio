import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon as Github } from '../components/BrandIcons'
import { useRef } from 'react'
import { GhostButton } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { projects, type Project } from '../data/projects'

const featured = projects.filter((p) => p.featured)
const rest = projects.filter((p) => !p.featured)

function StackCard({ project, index, total, progress }: { project: Project; index: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  return (
    <div className="sticky top-24 flex h-[85vh] items-start md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px` }}
        className="relative mx-auto flex w-full max-w-6xl origin-top flex-col gap-5 rounded-[32px] border-2 border-mist bg-ink p-4 sm:gap-6 sm:rounded-[44px] sm:p-6 md:rounded-[56px] md:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-end gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-[0.8]" style={{ fontSize: 'clamp(3rem, 8vw, 120px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-mist/60 sm:text-sm">{project.category}</span>
              <h3 className="font-medium uppercase leading-none text-mist" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)' }}>
                {project.name}
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <GhostButton href={project.live}>
              Live <ArrowUpRight className="h-4 w-4" />
            </GhostButton>
            <GhostButton href={project.repo}>
              <Github className="h-4 w-4" /> Code
            </GhostButton>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="max-w-2xl text-sm font-light leading-relaxed text-mist/70 sm:text-base">{project.description}</p>
          <ul className="flex flex-wrap gap-1.5 md:max-w-[40%] md:justify-end">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-mist/20 px-2.5 py-0.5 text-xs text-mist/80">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          data-cursor="view"
          aria-label={`Open ${project.name} live`}
          className="grid grid-cols-[1fr_0.42fr] gap-3 sm:grid-cols-[1fr_0.36fr]"
        >
          <div className="flex flex-col gap-3">
            {[1, 2].map((n) => (
              <img
                key={n}
                src={`/projects/${project.slug}-${n}.webp`}
                alt={n === 1 ? `${project.name} landing page` : `${project.name} features section`}
                loading="lazy"
                decoding="async"
                className="w-full rounded-[20px] object-cover object-top sm:rounded-[28px] md:rounded-[36px]"
                style={{ height: 'clamp(90px, 13vw, 200px)' }}
              />
            ))}
          </div>
          <div className="relative">
            <img
              src={`/projects/${project.slug}-m.webp`}
              alt={`${project.name} on mobile`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full rounded-[20px] object-cover object-top sm:rounded-[28px] md:rounded-[36px]"
            />
          </div>
        </a>
      </motion.article>
    </div>
  )
}

export function Projects() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })

  return (
    <section id="projects" className="bg-ink px-4 pb-16 sm:px-8 md:px-10">
      <FadeIn as="h2" y={40} className="hero-heading pb-6 text-center font-black uppercase leading-none tracking-tight">
        <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>Projects</span>
      </FadeIn>

      <div ref={container} className="pb-[12vh]">
        {featured.map((p, i) => (
          <StackCard key={p.slug} project={p} index={i} total={featured.length} progress={scrollYProgress} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mx-auto mt-24 max-w-6xl">
          <FadeIn as="h3" className="mb-8 text-center text-2xl font-medium uppercase tracking-widest text-mist sm:text-3xl">
            More builds
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <FadeIn key={p.slug} delay={(i % 3) * 0.08} className="group flex flex-col overflow-hidden rounded-[28px] border border-mist/15 bg-white/[0.02]">
                <a href={p.live} target="_blank" rel="noreferrer" className="block overflow-hidden" tabIndex={-1} aria-hidden="true" data-cursor="view">
                  <img
                    src={`/projects/${p.slug}-1.webp`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </a>
                <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-xl font-medium uppercase text-mist">{p.name}</h4>
                    <span className="text-xs uppercase tracking-widest text-mist/50">{p.category}</span>
                  </div>
                  <p className="text-sm font-light leading-relaxed text-mist/65">{p.description}</p>
                  <p className="text-xs text-mist/50">{p.stack.join(' · ')}</p>
                  <div className="mt-auto flex gap-4 pt-2 text-sm font-medium uppercase tracking-widest text-mist">
                    <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:opacity-70">
                      Live <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:opacity-70">
                      <Github className="h-4 w-4" /> Code
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
