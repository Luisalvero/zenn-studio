import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/ui/SEO'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer } from '@/lib/animations'

export function NotFoundPage() {
  return (
    <>
      <SEO title="Page not found" path="/404" noIndex />
      <section className="relative flex min-h-[80svh] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.4] mask-fade-b" />
        <Container className="text-center">
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6"
          >
            <motion.span variants={fadeUp} className="font-display text-[8rem] leading-none font-semibold text-steel sm:text-[12rem]">
              404
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-display text-2xl font-semibold text-chalk sm:text-3xl">
              This scene didn't make the cut.
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-md text-mist">
              The page you're looking for doesn't exist. Let's get you back to the story.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-2">
              <Button to="/" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                Back home
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
