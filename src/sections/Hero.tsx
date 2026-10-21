import { ArrowDown } from 'lucide-react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { SoundControls, SoundWaves } from '../components/HeroSound'
import { Magnet } from '../components/Magnet'
import { MenuButton } from '../components/Nav'
import { RollText } from '../components/RollText'
import { Starfield } from '../components/Starfield'
import { navLinks } from '../data/nav'
import { profile } from '../data/profile'
import { useHeroSound } from '../lib/useHeroSound'

// Reading order: 1. the name (biggest), 2. what Akshat does + the tagline, 3. "View my work".
// Nav and the music controls are deliberately quieter than all three.
export function Hero({ onMenu }: { onMenu: () => void }) {
  const sound = useHeroSound()

  return (
    <section className="relative flex h-[100svh] min-h-[640px] flex-col" style={{ overflowX: 'clip' }}>
      <Starfield />

      <FadeIn as="nav" y={-20} className="relative z-20 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="hidden text-sm font-medium uppercase tracking-[0.15em] text-mist/70 transition-colors hover:text-mist sm:block md:text-base"
          >
            <RollText text={l.label} />
          </a>
        ))}
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-mist/70 sm:hidden">{profile.fullName}</span>
        <MenuButton onClick={onMenu} className="sm:hidden" />
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-5 w-full text-center text-[21vw] font-black uppercase leading-[0.88] tracking-tight sm:text-[17vw] lg:-mt-2 lg:whitespace-nowrap lg:text-[13vw] lg:leading-none"
        >
          <RollText text="Hi, i'm" />
          <br className="lg:hidden" />
          <span className="hidden lg:inline"> </span>
          <RollText text={profile.firstName} />
        </FadeIn>
      </div>

      <SoundWaves sound={sound} />

      {/* Positioning lives on a plain wrapper: FadeIn animates transform and would clobber the translate classes. */}
      <div className="absolute left-1/2 top-[54%] z-10 w-[min(62vw,40svh)] -translate-x-1/2 -translate-y-1/2 lg:bottom-0 lg:top-auto lg:w-[min(460px,58svh)] lg:translate-y-0 xl:w-[min(520px,62svh)]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={5}>
            <img
              src={profile.photo}
              alt={profile.fullName}
              width={734}
              height={959}
              fetchPriority="high"
              draggable={false}
              className="w-full select-none [mask-image:linear-gradient(to_bottom,black_80%,transparent)] lg:[mask-image:none]"
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* Desktop: the music sits on the wave line, away from the CTAs. */}
      <div className="absolute right-6 top-[60%] z-20 hidden -translate-y-1/2 md:right-10 lg:block">
        <FadeIn delay={0.8} y={0}>
          <SoundControls sound={sound} />
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex flex-col gap-5 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10 lg:flex-row lg:items-end lg:justify-between">
        <FadeIn delay={0.35} y={20} className="flex max-w-[min(100%,420px)] flex-col gap-2 lg:max-w-[250px] xl:max-w-[340px]">
          <div className="flex items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-mist/70 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B600A8]" aria-hidden="true" />
              {profile.role}
            </p>
            {/* Phones and tablets: the music rides along with the role line instead. */}
            <SoundControls sound={sound} className="-my-2 !bg-transparent !p-0 lg:hidden [&>div:first-child]:hidden" />
          </div>
          <p className="font-normal leading-snug text-mist" style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.5rem)' }}>
            {profile.tagline}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="grid grid-cols-[1fr_auto] gap-3 sm:flex sm:items-center lg:flex-col lg:items-end xl:flex-row xl:items-center">
          <PrimaryButton href="#projects">
            View my work <ArrowDown className="h-4 w-4" />
          </PrimaryButton>
          <GhostButton href="#contact">Contact</GhostButton>
        </FadeIn>
      </div>
    </section>
  )
}
