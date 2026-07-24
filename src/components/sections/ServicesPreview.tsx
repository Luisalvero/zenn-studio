import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { services } from '@/data/services'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

/** Homepage services overview. */
export function ServicesPreview() {
  return (
    <Section id="services" className="border-t border-white/5 bg-ink" aria-label="Services">
      <Container size="wide">
        <SectionHeading
          eyebrow="What I do"
          title="Services"
          description="Full post-production, end to end — or just the piece you need. No pricing tiers; every project gets a custom quote."
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.slug}
              variants={fadeUp}
              className="group flex flex-col gap-4 bg-carbon p-8 transition-colors duration-500 hover:bg-graphite"
            >
              <ServiceIcon
                name={service.icon}
                className="h-7 w-7 text-bone transition-colors duration-500 group-hover:text-chalk"
                strokeWidth={1.4}
              />
              <h3 className="font-display text-lg font-semibold tracking-tight text-chalk">{service.title}</h3>
              <p className="text-sm leading-relaxed text-mist">{service.summary}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12">
          <Button to="/services" variant="secondary" iconRight={<ArrowUpRight className="h-4 w-4" />}>
            Explore services
          </Button>
        </div>
      </Container>
    </Section>
  )
}
