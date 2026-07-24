import { motion } from 'framer-motion'
import { processSteps } from '@/data/process'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

interface ProcessSectionProps {
  /** Hide the heading when embedding under another (e.g. the About page). */
  showHeading?: boolean
}

/** The four-step working process: Discover → Edit → Refine → Deliver. */
export function ProcessSection({ showHeading = true }: ProcessSectionProps) {
  return (
    <Section id="process" className="border-t border-white/5 bg-ink" aria-label="Process">
      <Container size="wide">
        {showHeading && (
          <SectionHeading
            eyebrow="How I work"
            title="A simple, deliberate process"
            description="Four steps, no mystery. Just a clear path from your footage to a finished, cinematic piece."
          />
        )}

        <motion.ol
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-2 lg:grid-cols-4"
        >
          {processSteps.map((step) => (
            <motion.li key={step.index} variants={fadeUp} className="flex flex-col gap-5 bg-carbon p-8">
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-semibold text-steel">{step.index}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-semibold tracking-tight text-chalk">{step.title}</h3>
                <p className="text-sm font-medium text-silver">{step.description}</p>
              </div>
              <p className="text-sm leading-relaxed text-ash">{step.detail}</p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </Section>
  )
}
