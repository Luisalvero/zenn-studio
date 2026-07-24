import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, fadeUpSmall, staggerContainer, viewportOnce } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  /** Visual size of the title. */
  size?: 'default' | 'large'
}

/** Consistent eyebrow → title → description block with a staggered reveal. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  size = 'default',
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <motion.span variants={fadeUpSmall} className="eyebrow">
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className={cn(
          'font-display font-semibold text-chalk',
          size === 'large' ? 'text-display' : 'text-3xl sm:text-4xl lg:text-5xl',
          align === 'center' && 'max-w-3xl',
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={cn('max-w-2xl text-base leading-relaxed text-mist sm:text-lg', align === 'center' && 'mx-auto')}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
