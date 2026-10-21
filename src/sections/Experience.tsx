import { FadeIn } from '../components/FadeIn'
import { experience } from '../data/experience'
import { education } from '../data/profile'

export function Experience() {
  return (
    <section id="experience" className="rounded-t-[40px] bg-white px-5 py-20 text-ink sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn as="h2" y={40} className="mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">
        <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>Experience</span>
      </FadeIn>

      <ol className="mx-auto max-w-5xl">
        {experience.map((e, i) => (
          <FadeIn
            as="li"
            key={e.company}
            delay={i * 0.1}
            className="flex gap-5 border-t py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12"
          >
            <span className="font-black leading-[0.8]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1 md:pt-3">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                <h3 className="font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                  {e.role}
                </h3>
                <span className="shrink-0 text-xs uppercase tracking-widest opacity-60 sm:text-sm">{e.dates}</span>
              </div>
              <p className="text-sm font-medium uppercase tracking-wider sm:text-base">
                {e.company} <span className="opacity-50">· {e.mode}</span>
              </p>
              <p className="max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                {e.summary}
              </p>
            </div>
          </FadeIn>
        ))}
        <FadeIn as="li" delay={experience.length * 0.1} className="flex flex-col gap-1 border-y py-8 sm:flex-row sm:items-baseline sm:justify-between sm:py-10">
          <p className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
            Education
          </p>
          <p className="text-sm uppercase tracking-wider opacity-70 sm:text-right sm:text-base">
            {education.degree} · {education.school}
            <br className="hidden sm:block" /> <span className="opacity-70">{education.dates}</span>
          </p>
        </FadeIn>
      </ol>
    </section>
  )
}
