import { ContactButton } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { HeroSound } from '../components/HeroSound'
import { Magnet } from '../components/Magnet'
import { MenuButton } from '../components/Nav'
import { navLinks } from '../data/nav'
import { profile } from '../data/profile'

export function Hero({ onMenu }: { onMenu: () => void }) {
  return (
    <section className="relative flex h-[100svh] min-h-[620px] flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" y={-20} className="relative z-20 flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="hidden text-sm font-medium uppercase tracking-wider text-mist transition-opacity duration-200 hover:opacity-70 sm:block md:text-lg lg:text-[1.4rem]"
          >
            {l.label}
          </a>
        ))}
        <span className="text-sm font-medium uppercase tracking-wider text-mist sm:hidden">{profile.fullName}</span>
        <MenuButton onClick={onMenu} className="sm:hidden" />
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[12.4vw] font-black uppercase leading-none tracking-tight sm:mt-4 md:-mt-3 md:text-[13vw]"
        >
          Hi, i&apos;m {profile.firstName}
        </FadeIn>
      </div>

      <HeroSound />

      {/* Positioning lives on a plain wrapper: FadeIn animates transform and would clobber the translate classes. */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[min(360px,60svh)] sm:translate-y-0 md:w-[min(440px,60svh)] lg:w-[min(520px,62svh)]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={5}>
            <img
              src={profile.photo}
              alt={profile.fullName}
              width={734}
              height={959}
              fetchPriority="high"
              draggable={false}
              className="w-full select-none [mask-image:linear-gradient(to_bottom,black_80%,transparent)] sm:[mask-image:none]"
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-mist sm:max-w-[220px] md:max-w-[260px]"
        >
          <span style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>{profile.tagline}</span>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
