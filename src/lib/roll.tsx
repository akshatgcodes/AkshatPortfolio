import { Children, type ReactNode } from 'react'
import { RollText } from '../components/RollText'

// Rolls the plain-text parts of a button's children and leaves icons alone.
export function rollStrings(children: ReactNode) {
  return Children.map(children, (c) => (typeof c === 'string' && c.trim() ? <RollText text={c.trim()} /> : c))
}
