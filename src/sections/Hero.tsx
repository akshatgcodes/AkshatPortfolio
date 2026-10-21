import { ArrowLink, PrimaryButton } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { SoundControls, SoundWaves } from '../components/HeroSound'
import { Magnet } from '../components/Magnet'
import { MenuButton } from '../components/Nav'
import { RollText } from '../components/RollText'
import { Starfield } from '../components/Starfield'
import { experience } from '../data/experience'
import { navLinks } from '../data/nav'
import { profile } from '../data/profile'
import { useHeroSound } from '../lib/useHeroSound'

// Reading order: 1. the name, split across the frame with the photo standing in front of it,
// 2. role + tagline, 3. the one solid CTA. Nav, metadata and music stay in small mono.
export function Hero({ onMenu }: { onMenu: () => void }) {
  const sound = useHeroSound()
  const now = experience[0]

  return (
    <section id="top" className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden">
      <Starfield />
      <SoundWaves sound={sound} />

      <FadeIn as="nav" y={-12} className="relative z-30 grid grid-cols-12 items-center gap-x-6 px-5 pt-5 sm:px-8 md:px-10 md:pt-7">
        <a href="#top" className="col-span-6 md:col-span-3" aria-label="Akshat Gupta, home">
          <span className="font-display text-2xl italic">ag</span>
          <span className="label ml-3 text-muted">Portfolio ’26</span>
        </a>
        <div className="col-span-6 hidden justify-end gap-7 md:col-span-9 md:flex">
          {navLinks.map((l, i) => (
            <a key={l.href} href={l.href} className="label text-muted transition-colors hover:text-bone">
              <span className="mr-1.5 text-signal">0{i + 1}</span>
              <RollText text={l.label} />
            </a>
          ))}
        </div>
        <MenuButton onClick={onMenu} className="col-span-6 justify-self-end md:hidden" />
      </FadeIn>

      {/* The name sits behind the photo (z-0 vs z-10): line one hugs the left, line two the right. */}
      <h1 className="display pointer-events-none relative z-0 mt-6 px-5 sm:px-8 md:mt-2 md:px-10" style={{ fontSize: 'clamp(5.5rem, 17vw, 300px)' }}>
        <FadeIn as="span" delay={0.1} y={40} className="block">
          <RollText text="Hi, I’m" />
        </FadeIn>
        <FadeIn as="span" delay={0.2} y={40} className="-mt-[0.12em] block text-right italic">
          <RollText text={profile.firstName} />
          <span className="not-italic text-signal">.</span>
        </FadeIn>
      </h1>

      {/* Positioning lives on a plain wrapper: FadeIn animates transform and would clobber the translate classes. */}
      <div className="absolute left-1/2 top-[48%] z-10 w-[min(64vw,37svh)] -translate-x-1/2 -translate-y-1/2 lg:bottom-0 lg:top-auto lg:w-[min(460px,60svh)] lg:translate-y-0 xl:w-[min(520px,64svh)]">
        <FadeIn delay={0.5} y={30}>
          <Magnet padding={150} strength={5}>
            <img
              src={profile.photo}
              alt={profile.fullName}
              width={734}
              height={959}
              fetchPriority="high"
              draggable={false}
              className="w-full select-none [mask-image:linear-gradient(to_bottom,black_75%,transparent)] lg:[mask-image:none]"
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto grid grid-cols-12 items-end gap-x-6 gap-y-5 px-5 pb-6 sm:px-8 md:px-10 md:pb-9">
        <FadeIn delay={0.35} y={16} className="col-span-12 flex flex-col gap-3 lg:col-span-4">
          <p className="label flex items-center gap-2 text-muted">
            <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
            {profile.role} — {profile.location}
          </p>
          <p className="max-w-[26ch] text-lg leading-snug text-bone sm:text-xl xl:text-2xl">{profile.tagline}</p>
          <div className="mt-2 flex items-center gap-6">
            <PrimaryButton href="#projects" className="min-w-[210px]">
              View work <span aria-hidden="true">↓</span>
            </PrimaryButton>
            <ArrowLink href="#contact" className="text-bone">
              Contact
            </ArrowLink>
          </div>
        </FadeIn>
        <FadeIn delay={0.6} y={16} className="col-span-12 flex flex-col items-start gap-1 lg:col-span-4 lg:col-start-9 lg:items-end">
          <p className="label hidden text-muted lg:block">
            Now — {now.role}, {now.company}
          </p>
          <SoundControls sound={sound} />
        </FadeIn>
      </div>
    </section>
  )
}
