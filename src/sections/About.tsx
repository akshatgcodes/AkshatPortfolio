import { AnimatedText } from '../components/AnimatedText'
import { ArrowLink } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { SectionHead } from '../components/SectionHead'
import { experience } from '../data/experience'
import { profile } from '../data/profile'

export function About() {
  const now = experience[0]
  const facts = [...profile.facts, ['Now', `${now.role}, ${now.company}`]]

  return (
    <section id="about" className="px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <SectionHead index="01" label="About" title="About" accent="me" />
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <dl className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-6 self-start md:col-span-3 md:grid-cols-1">
          {facts.map(([k, v], i) => (
            <FadeIn key={k} delay={i * 0.06} y={12}>
              <dt className="label mb-1 text-muted">{k}</dt>
              <dd className="text-sm leading-snug text-bone sm:text-base">{v}</dd>
            </FadeIn>
          ))}
        </dl>
        <div className="col-span-12 flex flex-col gap-10 md:col-span-9">
          <AnimatedText
            text={profile.about}
            className="display max-w-[22ch] text-bone sm:max-w-[26ch]"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 4.25rem)', lineHeight: 1.05 }}
          />
          <FadeIn>
            <ArrowLink href="#projects" className="text-signal">
              See what I’ve built ↓
            </ArrowLink>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
