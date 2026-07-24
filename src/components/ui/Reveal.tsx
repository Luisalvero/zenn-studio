import type { ReactNode, ElementType } from 'react'
import { motion, type Variants } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Which motion preset to use. Defaults to a cinematic fade-up. */
  variants?: Variants
  /** Delay in seconds before the reveal begins. */
  delay?: number
  /** Fraction of the element that must be visible before it animates in. */
  amount?: number
  as?: 'div' | 'li' | 'span' | 'section' | 'article'
}

/**
 * Scroll-triggered reveal. Animates its children in once, when they enter the
 * viewport. Honors reduced-motion via the app-level MotionConfig.
 */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  amount = 0.3,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as] as ElementType
  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, amount }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  )
}
