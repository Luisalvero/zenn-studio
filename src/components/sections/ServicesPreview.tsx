import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { services } from '@/data/services'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { VideoBackground } from '@/components/ui/VideoBackground'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

/**
 * Homepage services overview — an interactive index list (cleaner than a grid
 * with an odd item count) over a darkened edit-timeline texture. Each row
 * reveals its summary and an arrow on hover.
 */
export function ServicesPreview() {
  return (
    <Section id="services" className="relative isolate overflow-hidden border-t border-white/5" aria-label="Services">
      <VideoBackground
        src="/images/textures/edit-timelapse.mp4"
        poster="/images/textures/edit-timelapse.jpg"
        attachment="absolute"
        className="z-0"
      />
      <Container size="wide" className="relative z-10">
        <SectionHeading
          eyebrow="What I do"
          title="Services"
          description="Full post-production, end to end — or just the piece you need. No pricing tiers; every project gets a custom quote."
        />

        <motion.ul
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 flex flex-col border-t border-white/10"
        >
          {services.map((service) => (
            <motion.li key={service.slug} variants={fadeUp} className="border-b border-white/10">
              <Link
                to="/services"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 sm:py-7"
              >
                <ServiceIcon
                  name={service.icon}
                  className="h-6 w-6 text-ash transition-colors duration-500 group-hover:text-chalk"
                  strokeWidth={1.4}
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-medium tracking-tight text-silver transition-colors duration-500 group-hover:text-chalk sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-mist opacity-0 transition-all duration-500 group-hover:mt-2 group-hover:max-h-20 group-hover:opacity-100">
                    {service.summary}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 -translate-x-2 text-ash opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-chalk group-hover:opacity-100" />
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-12">
          <Button to="/services" variant="secondary" iconRight={<ArrowUpRight className="h-4 w-4" />}>
            Explore services
          </Button>
        </div>
      </Container>
    </Section>
  )
}
