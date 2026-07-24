import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { fadeUp, staggerContainer } from '@/lib/animations'

interface PageHeaderProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

/** Consistent interior-page header that clears the fixed navbar. */
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-grid opacity-[0.4] mask-fade-b" />
      <Container size="wide">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="flex max-w-3xl flex-col gap-6"
        >
          {eyebrow && (
            <motion.span variants={fadeUp} className="eyebrow">
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            variants={fadeUp}
            className="text-display font-display font-semibold text-chalk"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-relaxed text-mist">
              {description}
            </motion.p>
          )}
          {children && <motion.div variants={fadeUp}>{children}</motion.div>}
        </motion.div>
      </Container>
    </header>
  )
}
