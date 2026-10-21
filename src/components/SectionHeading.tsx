import { FadeIn } from './FadeIn'
import { RollText } from './RollText'

// One heading scale for every section, a clear step down from the hero name: a small eyebrow
// that says what the section is for, then the title.
export function SectionHeading({ eyebrow, title, dark = false, className = 'mb-12 sm:mb-16 md:mb-20' }: { eyebrow: string; title: string; dark?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center ${className}`}>
      <FadeIn as="p" y={20} className={`text-xs font-medium uppercase tracking-[0.25em] sm:text-sm ${dark ? 'text-ink/55' : 'text-mist/60'}`}>
        {eyebrow}
      </FadeIn>
      <FadeIn
        as="h2"
        y={40}
        delay={0.05}
        className={`font-black uppercase leading-[0.9] tracking-tight ${dark ? 'text-ink' : 'hero-heading'}`}
      >
        <span style={{ fontSize: 'clamp(2.75rem, 8vw, 112px)' }}>
          <RollText text={title} />
        </span>
      </FadeIn>
    </div>
  )
}
