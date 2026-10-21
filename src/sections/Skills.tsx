import { FadeIn } from '../components/FadeIn'
import { SectionHead } from '../components/SectionHead'
import { skills } from '../data/skills'

// A typographic table rather than cards: group in mono, the tools as plain text, a note beside.
export function Skills() {
  return (
    <section className="px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <SectionHead index="05" label="Toolkit" title="What I" accent="work with" />
      <ul>
        {skills.map((g, i) => (
          <FadeIn as="li" key={g.name} delay={i * 0.06} y={16} className="grid grid-cols-12 gap-x-6 gap-y-2 border-t border-rule py-6 last:border-b md:py-8">
            <p className="label col-span-12 text-muted md:col-span-3">
              <span className="mr-2 text-signal">{String(i + 1).padStart(2, '0')}</span>
              {g.name}
            </p>
            <p className="col-span-12 text-xl leading-snug text-bone sm:text-2xl md:col-span-6">{g.items.join(', ')}</p>
            <p className="col-span-12 text-sm leading-relaxed text-muted md:col-span-3">{g.blurb}</p>
          </FadeIn>
        ))}
      </ul>
    </section>
  )
}
