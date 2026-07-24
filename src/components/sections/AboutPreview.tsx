import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useContent } from '@/lib/content'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Image } from '@/components/ui/Image'
import { Reveal } from '@/components/ui/Reveal'
import { fadeUp, imageReveal, staggerContainer, viewportOnce } from '@/lib/animations'

const pillars = ['Editing', 'Color', 'Sound', 'Rhythm', 'Emotion']

/** Homepage about preview — the person behind the work. */
export function AboutPreview() {
  const { get } = useContent()
  return (
    <Section id="about" aria-label="About">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Portrait */}
          <motion.div
            variants={imageReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="order-last lg:order-first"
          >
            <Image
              src={siteConfig.portrait}
              alt={`${siteConfig.founder} — editor and founder of ${siteConfig.name}`}
              placeholderLabel="Portrait — add your photo"
              ratio="4/5"
              className="border border-white/10"
            />
          </motion.div>

          {/* Copy */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <motion.span variants={fadeUp} className="eyebrow">
              About
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl lg:text-5xl"
            >
              Obsessed with the feeling a cut can create.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base leading-relaxed text-mist sm:text-lg">
              {get('about_intro')}
            </motion.p>
            <motion.p variants={fadeUp} className="text-base leading-relaxed text-mist">
              I specialize in creating cinematic experiences through editing, color, sound, rhythm, and
              emotion. I'm early in the journey and honest about it — but every project gets the same
              obsessive attention to detail.
            </motion.p>

            <motion.ul variants={fadeUp} className="flex flex-wrap gap-2.5 pt-2">
              {pillars.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-silver"
                >
                  {p}
                </li>
              ))}
            </motion.ul>

            <Reveal delay={0.1} className="pt-4">
              <Button to="/about" variant="secondary" iconRight={<ArrowUpRight className="h-4 w-4" />}>
                More about me
              </Button>
            </Reveal>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
