import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  /** Vertical rhythm — generous by default for a spacious, cinematic feel. */
  spacing?: 'default' | 'compact' | 'loose'
  'aria-label'?: string
}

const spacings = {
  compact: 'py-16 sm:py-20',
  default: 'py-24 sm:py-32',
  loose: 'py-28 sm:py-40',
}

/** A full-width vertical section with consistent breathing room. */
export function Section({ children, className, id, spacing = 'default', ...rest }: SectionProps) {
  return (
    <section id={id} className={cn('relative', spacings[spacing], className)} {...rest}>
      {children}
    </section>
  )
}
