import type { ReactNode } from 'react'
import { rollStrings } from '../lib/roll'

// Two link styles only. PrimaryButton: the one solid signal block per view. ArrowLink: text with
// a drawn underline for everything else. Internal #anchors stay in the tab, the rest open new ones.
const external = (href: string) => (href.startsWith('#') || href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })

export function PrimaryButton({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      {...external(href)}
      className={`inline-flex min-h-12 items-center justify-between gap-6 bg-signal px-5 font-mono text-xs font-medium uppercase tracking-label text-ink transition-colors duration-200 hover:bg-bone sm:text-sm ${className}`}
    >
      {rollStrings(children)}
    </a>
  )
}

export function ArrowLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} {...external(href)} className={`link min-h-11 font-mono text-xs uppercase tracking-label sm:text-sm ${className}`}>
      {rollStrings(children)}
    </a>
  )
}
