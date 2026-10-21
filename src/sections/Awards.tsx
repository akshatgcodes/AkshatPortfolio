import { ArrowUpRight, Trophy } from 'lucide-react'
import { GithubIcon } from '../components/BrandIcons'
import { GhostButton } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { RollText } from '../components/RollText'
import { achievements } from '../data/achievements'

export function Awards() {
  return (
    <section className="rounded-t-[40px] bg-white px-5 pb-32 pt-20 text-ink sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:rounded-t-[60px] md:px-10 md:pb-40 md:pt-32">
      <FadeIn as="h2" y={40} className="mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-24">
        <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          <RollText text="Awards" />
        </span>
      </FadeIn>

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {achievements.map((a) => (
          <FadeIn key={a.award} className="grid gap-8 rounded-[32px] border-2 border-ink p-5 sm:rounded-[44px] sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10 md:rounded-[56px] md:p-10">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                  style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' }}
                >
                  <Trophy className="h-6 w-6" />
                </span>
                <div className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">
                  {a.event} · {a.detail}
                </div>
              </div>
              <h3 className="font-black uppercase leading-[0.95]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                {a.award}
              </h3>
              <div className="border-t border-ink/15 pt-5">
                <p className="text-xl font-medium uppercase sm:text-2xl">
                  <RollText text={a.project} />
                </p>
                <p className="mt-2 font-light leading-relaxed opacity-70">{a.projectBlurb}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="uppercase tracking-widest opacity-50">My role</dt>
                  <dd className="mt-1 font-medium">{a.role}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest opacity-50">Team</dt>
                  <dd className="mt-1 font-medium">{a.team}</dd>
                </div>
              </dl>
              <ul className="flex flex-wrap gap-1.5">
                {a.stack.map((s) => (
                  <li key={s} className="rounded-full bg-ink/5 px-3 py-1 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3">
                <GhostButton href={a.live} dark>
                  Live <ArrowUpRight className="h-4 w-4" />
                </GhostButton>
                <GhostButton href={a.repo} dark>
                  <GithubIcon className="h-4 w-4" /> Team repo
                </GhostButton>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {a.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${a.project} ${i === 0 ? 'product view' : 'how it works'}`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full rounded-[24px] object-cover object-top sm:rounded-[32px]"
                />
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
