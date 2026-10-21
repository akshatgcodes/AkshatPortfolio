import { ArrowLink } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { RollText } from '../components/RollText'
import { SectionHead } from '../components/SectionHead'
import { achievements } from '../data/achievements'

// An editorial spread per award: the title set large, the facts as a mono ledger, two plates.
export function Awards() {
  return (
    <section className="px-5 py-24 sm:px-8 md:px-10 md:py-36">
      <SectionHead index="06" label="Recognition" title="Best Emerging" accent="Innovator" />
      {achievements.map((a) => (
        <div key={a.award} className="grid grid-cols-12 gap-x-6 gap-y-10">
          <FadeIn className="col-span-12 md:col-span-3">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-1">
              {[
                ['Event', a.event],
                ['Format', a.detail],
                ['Team', a.team],
                ['My role', a.role],
                ['Stack', a.stack.join(', ')],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label mb-1 text-muted">{k}</dt>
                  <dd className="text-sm leading-snug text-bone sm:text-base">{v}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
          <FadeIn delay={0.1} className="col-span-12 md:col-span-9">
            <h3 className="display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              <RollText text={a.project} />
            </h3>
            <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-bone/80">{a.projectBlurb}</p>
            <div className="mt-6 flex gap-6">
              <ArrowLink href={a.live} className="text-bone">
                Live ↗
              </ArrowLink>
              <ArrowLink href={a.repo} className="text-muted">
                Team repo ↗
              </ArrowLink>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr]">
              {a.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${a.project} ${i === 0 ? 'product view' : 'how it works'}`}
                  loading="lazy"
                  decoding="async"
                  className={`w-full border border-rule object-cover object-top ${i === 1 ? 'sm:mt-16' : ''}`}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      ))}
    </section>
  )
}
