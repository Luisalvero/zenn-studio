import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { useContent } from '@/lib/content'
import { watchUrl, providerName, type VideoProvider } from '@/lib/video'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { Reveal } from '@/components/ui/Reveal'
import { imageReveal, viewportOnce } from '@/lib/animations'

/** The featured showreel — a large, minimal, embedded video. */
export function FeaturedReel() {
  const { get } = useContent()
  const provider = get('showreel_provider') as VideoProvider
  const id = get('showreel_id')

  return (
    <Section spacing="compact" aria-label="Showreel">
      <Container size="wide">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <Reveal>
            <span className="eyebrow">Featured · Showreel</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl">
              A first look at the work
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={watchUrl(provider, id)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mist underline-offset-4 transition-colors hover:text-chalk hover:underline"
            >
              Watch on {providerName(provider)} ↗
            </a>
          </Reveal>
        </div>

        <motion.div
          variants={imageReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10"
        >
          <VideoEmbed provider={provider} id={id} title={siteConfig.showreel.title} />
        </motion.div>
      </Container>
    </Section>
  )
}
