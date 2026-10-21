import { FadeIn } from '../components/FadeIn'
import { SectionHeading } from '../components/SectionHeading'
import { skills } from '../data/skills'

export function Skills() {
  return (
    <section className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32">
      <SectionHeading eyebrow="What I work with" title="Skills" />

      <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {skills.map((g, i) => (
          <FadeIn
            key={g.name}
            delay={i * 0.08}
            className={`flex flex-col gap-4 rounded-[32px] border border-mist/15 p-6 sm:p-8 ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'} ${i === 4 ? 'sm:col-span-2 lg:col-span-3' : ''}`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-xl font-medium uppercase tracking-wide text-mist sm:text-2xl">{g.name}</h3>
              <span className="hero-heading text-4xl font-black sm:text-5xl">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <p className="leading-relaxed text-mist/70">{g.blurb}</p>
            <ul className="mt-auto flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s} className="rounded-full bg-mist/10 px-3 py-1 text-sm text-mist">
                  {s}
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
