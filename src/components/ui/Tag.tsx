import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TagProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md'
}

/** Small, quiet category pill used on project cards and detail pages. */
export function Tag({ children, className, size = 'sm' }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] font-medium tracking-wide text-mist',
        size === 'sm' ? 'px-3 py-1 text-[0.7rem]' : 'px-3.5 py-1.5 text-xs',
        className,
      )}
    >
      {children}
    </span>
  )
}
