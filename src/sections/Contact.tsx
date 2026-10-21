import { Check, Copy, Mail } from 'lucide-react'
import { useState } from 'react'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import { ContactButton } from '../components/Buttons'
import { FadeIn } from '../components/FadeIn'
import { RollText } from '../components/RollText'
import { profile, socials } from '../data/profile'

const links = [
  { label: 'GitHub', href: socials.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: socials.linkedin, Icon: LinkedinIcon },
]

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
    <section
      id="contact"
      className="relative z-10 -mt-10 flex min-h-[90svh] flex-col rounded-t-[40px] bg-ink px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
        <FadeIn as="h2" y={40} className="hero-heading font-black uppercase leading-[0.9] tracking-tight">
          <span style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            <RollText text="Let's talk" />
          </span>
        </FadeIn>
        <FadeIn delay={0.1} as="p" className="max-w-xl font-light leading-relaxed text-mist/70" >
          <span style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}>
            Open to internships, full-time roles and interesting side projects. The fastest way to reach me is email.
          </span>
        </FadeIn>
        <FadeIn delay={0.2} className="flex flex-col items-center gap-5">
          <ContactButton href={`mailto:${socials.email}`}>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> {socials.email}
            </span>
          </ContactButton>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-mist/70 transition-opacity hover:opacity-70"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
          </button>
        </FadeIn>
        <FadeIn delay={0.3} className="flex gap-3">
          {links.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-mist px-6 py-2.5 text-sm font-medium uppercase tracking-widest text-mist transition-colors hover:bg-mist/10"
            >
              <Icon className="h-4 w-4" /> <RollText text={label} />
            </a>
          ))}
        </FadeIn>
      </div>

      <footer className="mt-20 flex flex-col items-center justify-between gap-2 border-t border-mist/10 py-6 text-xs uppercase tracking-widest text-mist/50 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.fullName}
        </span>
        <span>{profile.location}</span>
      </footer>
    </section>
  )
}
