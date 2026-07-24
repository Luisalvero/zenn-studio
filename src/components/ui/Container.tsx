import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  /** Render as a different element (e.g. "section", "header"). Defaults to div. */
  as?: ElementType
  /** Narrow reading width for long-form text. */
  size?: 'default' | 'narrow' | 'wide'
}

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-[88rem]',
}

/** Horizontal padding + centered max-width wrapper used across the site. */
export function Container({ children, className, as: Tag = 'div', size = 'default' }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-6 sm:px-8 lg:px-12', sizes[size], className)}>{children}</Tag>
  )
}
