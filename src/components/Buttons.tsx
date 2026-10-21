import type { ReactNode } from 'react'
import { rollStrings } from '../lib/roll'

// Three CTA ranks, used consistently: Primary (gradient, one per view), Solid (main action on
// a card) and Ghost (secondary). Internal #anchors stay in the tab; anything else opens a new one.
const gradient = {
  background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
  boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
  outline: '2px solid #fff',
  outlineOffset: '-3px',
}

const external = (href: string) => (href.startsWith('#') || href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })
const base = 'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium uppercase tracking-widest'

export function PrimaryButton({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      {...external(href)}
      style={gradient}
      className={`${base} px-7 py-3 text-xs text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] sm:px-9 sm:text-sm md:px-10 md:py-4 md:text-base ${className}`}
    >
      {rollStrings(children)}
    </a>
  )
}

export function SolidButton({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  const tone = dark ? 'bg-ink text-white hover:bg-ink/85' : 'bg-mist text-ink hover:bg-white'
  return (
    <a href={href} {...external(href)} className={`${base} px-6 py-2.5 text-xs transition-colors duration-200 sm:px-7 sm:text-sm ${tone}`}>
      {rollStrings(children)}
    </a>
  )
}

export function GhostButton({ href, children, dark = false, className = '' }: { href: string; children: ReactNode; dark?: boolean; className?: string }) {
  const tone = dark ? 'border-ink/30 text-ink hover:border-ink' : 'border-mist/35 text-mist hover:border-mist'
  return (
    <a href={href} {...external(href)} className={`${base} border-2 px-6 py-2.5 text-xs transition-colors duration-200 sm:px-7 sm:text-sm ${tone} ${className}`}>
      {rollStrings(children)}
    </a>
  )
}
