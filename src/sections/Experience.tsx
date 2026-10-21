import { FadeIn } from '../components/FadeIn'
import { RollText } from '../components/RollText'
import { SectionHead } from '../components/SectionHead'
import { experience } from '../data/experience'
import { education } from '../data/profile'

// The one light section: bone paper, ink text, so the CV part reads like a printed page.
export function Experience() {
  return (
    <section id="experience" className="bg-bone px-5 py-24 text-ink sm:px-8 md:px-10 md:py-36">
      <SectionHead index="04" label="Experience" title="Where I’ve" accent="worked" light />
      <ol>
        {experience.map((e, i) => (
          <FadeIn as="li" key={e.company} delay={i * 0.08} y={20} className="grid grid-cols-12 gap-x-6 gap-y-3 border-t border-ink/20 py-8 md:py-10">
            <div className="col-span-12 md:col-span-3">
              <p className="label text-ink/60">{e.dates}</p>
              <p className="label mt-1 text-ink/45">{e.mode}</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h3 className="display" style={{ fontSize: 'clamp(1.9rem, 3vw, 2.75rem)' }}>
                <RollText text={e.role} />
              </h3>
              <p className="label mt-2">
                <span className="mr-2 inline-block h-1.5 w-1.5 bg-signal align-middle" aria-hidden="true" />
                {e.company}
              </p>
            </div>
            <p className="col-span-12 max-w-[60ch] leading-relaxed text-ink/75 md:col-span-5">{e.summary}</p>
          </FadeIn>
        ))}
        <FadeIn as="li" delay={experience.length * 0.08} y={20} className="grid grid-cols-12 gap-x-6 gap-y-3 border-y border-ink/20 py-8 md:py-10">
          <p className="label col-span-12 text-ink/60 md:col-span-3">{education.dates}</p>
          <div className="col-span-12 md:col-span-4">
            <h3 className="display" style={{ fontSize: 'clamp(1.9rem, 3vw, 2.75rem)' }}>
              <RollText text={education.degree} />
            </h3>
            <p className="label mt-2">Education</p>
          </div>
          <p className="col-span-12 leading-relaxed text-ink/75 md:col-span-5">{education.school}</p>
        </FadeIn>
      </ol>
    </section>
  )
}
