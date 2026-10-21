import { useState } from 'react'
import { ArrowLink } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { RollText } from '../components/RollText'
import { SectionHead } from '../components/SectionHead'
import { profile, socials } from '../data/profile'

// The email itself is the closing CTA, set as large as a heading.
export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(socials.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${socials.email}`
    }
  }

  return (
    <section id="contact" className="flex min-h-[90svh] flex-col px-5 pt-24 sm:px-8 md:px-10 md:pt-36">
      <SectionHead index="07" label="Contact" title="Let’s build" accent="something." />
      <div className="grid flex-1 grid-cols-12 gap-x-6 gap-y-8">
        <FadeIn as="p" className="col-span-12 max-w-[36ch] leading-relaxed text-bone/80 md:col-span-3">
          Open to internships, full-time roles and interesting side projects. Email is the fastest way to reach me.
        </FadeIn>
        <FadeIn delay={0.1} className="col-span-12 md:col-span-9">
          <a
            href={`mailto:${socials.email}`}
            className="display link break-all text-signal transition-colors hover:text-bone"
            style={{ fontSize: 'clamp(2.1rem, 6.4vw, 104px)' }}
          >
            {socials.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            <button type="button" onClick={copy} className="link label min-h-11 text-bone">
              <span aria-live="polite">{copied ? 'Copied ✓' : 'Copy email'}</span>
            </button>
            <ArrowLink href={socials.github} className="text-bone">
              GitHub ↗
            </ArrowLink>
            <ArrowLink href={socials.linkedin} className="text-bone">
              LinkedIn ↗
            </ArrowLink>
          </div>
        </FadeIn>
      </div>

      <footer className="label mt-24 grid grid-cols-12 gap-x-6 gap-y-2 border-t border-rule py-6 text-muted">
        <span className="col-span-12 md:col-span-3">
          © {new Date().getFullYear()} {profile.fullName}
        </span>
        <span className="col-span-12 md:col-span-4">{profile.location}</span>
        <span className="col-span-12 md:col-span-5 md:text-right">
          <RollText text="Set in Instrument Serif, Geist & Geist Mono" />
        </span>
      </footer>
    </section>
  )
}
