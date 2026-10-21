import type { ReactNode } from 'react'
import { rollStrings } from '../lib/roll'

const gradient = {
  background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
  boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
  outline: '2px solid #fff',
  outlineOffset: '-3px',
}

export function ContactButton({ href = '#contact', children = 'Contact Me' }: { href?: string; children?: ReactNode }) {
  return (
    <a
      href={href}
      style={gradient}
      className="inline-block whitespace-nowrap rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
    >
      {rollStrings(children)}
    </a>
  )
}

export function GhostButton({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  const tone = dark
    ? 'border-ink text-ink hover:bg-ink/10'
    : 'border-mist text-mist hover:bg-mist/10'
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border-2 px-6 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors duration-200 sm:px-8 sm:py-3 sm:text-sm ${tone}`}
    >
      {rollStrings(children)}
    </a>
  )
}
