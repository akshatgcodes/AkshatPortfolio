import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  as?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'li' | 'nav' | 'span'
  className?: string
  delay?: number
  duration?: number
  x?: number
  y?: number
}

const components = {
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  nav: motion.nav,
  span: motion.span,
}

export function FadeIn({ children, as = 'div', className, delay = 0, duration = 0.7, x = 0, y = 30 }: Props) {
  const Component = components[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  )
}
