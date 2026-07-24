import { SEO } from '@/components/ui/SEO'
import { Marquee } from '@/components/ui/Marquee'
import { Hero } from '@/components/sections/Hero'
import { FeaturedReel } from '@/components/sections/FeaturedReel'
import { PortfolioPreview } from '@/components/sections/PortfolioPreview'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { AboutPreview } from '@/components/sections/AboutPreview'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { ContactCTA } from '@/components/sections/ContactCTA'

const marqueeWords = [
  'Cinematic Editing',
  'Sound Design',
  'Color Grading',
  'Trailer Editing',
  'Game Cinematics',
  'Motion Graphics',
  'Short Films',
  'Developer Logs',
]

export function HomePage() {
  return (
    <>
      <SEO
        path="/"
        description="Zenn Studio — cinematic video editing, sound design, and color grading by Luis Alvero. Personal films and spec work, open for new collaborations."
      />
      <Hero />
      <FeaturedReel />
      <Marquee items={marqueeWords} className="border-y border-white/5" />
      <PortfolioPreview />
      <ServicesPreview />
      <AboutPreview />
      <ProcessSection />
      <ContactCTA />
    </>
  )
}
