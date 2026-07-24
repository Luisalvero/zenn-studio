import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowUpRight } from 'lucide-react'
import { services } from '@/data/services'
import { SEO } from '@/components/ui/SEO'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

export function ServicesPage() {
  return (
    <>
      <SEO
        title="Services"
        path="/services"
        description="Post-production services from LA Productions — trailer editing, gameplay cinematics, developer logs, short films, sound design, color grading, and motion graphics. Contact for a custom quote."
      />

      <PageHeader
        eyebrow="Services"
        title="What I can make with you"
        description="Full post-production or a single piece of the puzzle. No pricing tiers — every project is different, so every project gets a custom quote."
      />

      <Section spacing="compact" className="pt-0">
        <Container size="wide">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col"
          >
            {services.map((service) => (
              <motion.article
                key={service.slug}
                variants={fadeUp}
                className="grid gap-6 border-t border-white/10 py-12 md:grid-cols-[auto_1fr_1fr] md:gap-10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02]">
                  <ServiceIcon name={service.icon} className="h-6 w-6 text-bone" strokeWidth={1.4} />
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk">
                    {service.title}
                  </h2>
                  <p className="max-w-md text-base leading-relaxed text-mist">{service.description}</p>
                  <Link
                    to="/contact"
                    className="group mt-1 inline-flex w-fit items-center gap-1.5 text-sm text-bone transition-colors hover:text-chalk"
                  >
                    Contact for a custom quote
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                <ul className="flex flex-col gap-3 md:pt-1">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-sm text-silver">
                      <Check className="h-4 w-4 shrink-0 text-ash" strokeWidth={2} />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </Container>
      </Section>

      <ProcessSection />
      <ContactCTA />
    </>
  )
}
