import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { contactLinks } from '@/config/site'
import { InstagramIcon, WhatsappIcon } from '@/components/ui/BrandIcons'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

/** Large closing CTA used on the home page (and echoed on Contact). */
export function ContactCTA() {
  return (
    <Section spacing="loose" aria-label="Get in touch" className="relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[50vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_65%)] blur-2xl" />
      </div>

      <Container className="text-center">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col items-center gap-8"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Open for collaboration
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-display font-display font-semibold text-chalk"
          >
            Let's create something
            <br />
            unforgettable.
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Whether you're an indie developer, filmmaker, musician, or small business — if you have
            footage and a story to tell, I'd love to help you tell it.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:w-auto sm:flex-row"
          >
            <Button
              href={contactLinks.whatsapp()}
              size="lg"
              iconLeft={<WhatsappIcon className="h-4 w-4" />}
            >
              WhatsApp Business
            </Button>
            <Button
              href={contactLinks.instagram}
              size="lg"
              variant="secondary"
              iconLeft={<InstagramIcon className="h-4 w-4" />}
            >
              Instagram
            </Button>
            <Button
              href={contactLinks.emailWithSubject()}
              newTab={false}
              size="lg"
              variant="secondary"
              iconLeft={<Mail className="h-4 w-4" />}
            >
              Email
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  )
}
