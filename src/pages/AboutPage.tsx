import { motion } from 'framer-motion'
import { Heart, Scan, Sparkles, GraduationCap } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { SEO } from '@/components/ui/SEO'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Image } from '@/components/ui/Image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { Reveal } from '@/components/ui/Reveal'
import { fadeUp, imageReveal, staggerContainer, viewportOnce } from '@/lib/animations'

const values = [
  {
    icon: Heart,
    title: 'Storytelling first',
    body: 'Technique serves the story — never the other way around. Every choice starts with what the piece is trying to make someone feel.',
  },
  {
    icon: Scan,
    title: 'Obsessive detail',
    body: 'The difference between good and cinematic lives in the small things: a frame trimmed, a sound placed, a color protected.',
  },
  {
    icon: Sparkles,
    title: 'Honest & transparent',
    body: "I'm early in my career and I don't pretend otherwise. What I offer is dedication, taste, and real care for your project.",
  },
  {
    icon: GraduationCap,
    title: 'Always learning',
    body: 'Every project is a chance to get better. I study the craft constantly and bring that momentum to everything I cut.',
  },
]

const toolkit = [
  'DaVinci Resolve',
  'After Effects',
  'Premiere Pro',
  'Fairlight',
  'Fusion',
  'Photoshop',
  'Ableton Live',
  'iZotope RX',
]

export function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        path="/about"
        description={`About ${siteConfig.founder} — the editor behind Zenn Studio. Passionate about cinematic storytelling through editing, color, sound, rhythm, and emotion.`}
      />

      <PageHeader
        eyebrow="About"
        title="The person behind the cuts"
        description="Zenn Studio is one editor, building something real — obsessed with pacing, atmosphere, and the feeling a piece leaves behind."
      />

      {/* Narrative */}
      <Section spacing="compact" className="pt-0">
        <Container size="wide">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <motion.div
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="lg:sticky lg:top-28"
            >
              <Image
                src={siteConfig.portrait}
                alt={`${siteConfig.founder}, editor and founder of ${siteConfig.name}`}
                placeholderLabel="Portrait — add your photo"
                ratio="4/5"
                className="border border-white/10"
              />
            </motion.div>

            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-6 text-base leading-relaxed text-mist sm:text-lg"
            >
              <motion.p variants={fadeUp}>
                Hi — I'm {siteConfig.founder}. Zenn Studio is the name I'm building my post-production
                work under, and right now, it's just me: writing, cutting, designing sound, and grading
                every frame myself.
              </motion.p>
              <motion.p variants={fadeUp}>
                I fell for editing because of how much a single cut can change a moment — how rhythm and
                silence and color can make you feel something you can't quite explain. That's the part I
                chase: the atmosphere underneath the images.
              </motion.p>
              <motion.p variants={fadeUp}>
                Most of what I've made so far is personal work and early collaborations — pieces I've
                poured myself into to grow. I don't have years of client logos to show, and I'm not
                going to pretend I do. What I can promise is genuine care, real technical ability, and a
                relentless eye for detail on whatever we make together.
              </motion.p>
              <motion.p variants={fadeUp} className="text-silver">
                If you're a creator, developer, filmmaker, musician, or small business with a story worth
                telling, I'd love to be the person who helps you tell it well.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-4">
                <span className="eyebrow">Toolkit</span>
                <ul className="flex flex-wrap gap-2.5">
                  {toolkit.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-silver"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section className="border-t border-white/5 bg-ink">
        <Container size="wide">
          <SectionHeading eyebrow="What I believe" title="How I approach every project" />
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2"
          >
            {values.map(({ icon: Icon, title, body }) => (
              <motion.div key={title} variants={fadeUp} className="flex flex-col gap-4 bg-carbon p-8">
                <Icon className="h-7 w-7 text-bone" strokeWidth={1.4} />
                <h3 className="font-display text-xl font-semibold tracking-tight text-chalk">{title}</h3>
                <p className="text-sm leading-relaxed text-mist">{body}</p>
              </motion.div>
            ))}
          </motion.div>

          <Reveal delay={0.1} className="mt-10">
            <p className="max-w-2xl text-sm text-ash">
              This is the beginning of the journey, not the end — and that's exactly why now is a great
              time to work together.
            </p>
          </Reveal>
        </Container>
      </Section>

      <ProcessSection />
      <ContactCTA />
    </>
  )
}
