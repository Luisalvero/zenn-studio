import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { featuredProjects } from '@/data/projects'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

/** Homepage preview of selected personal projects. */
export function PortfolioPreview() {
  return (
    <Section id="work" aria-label="Selected work">
      <Container size="wide">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title="The work I'm proudest of"
            description="A growing collection of personal projects and collaborations. Honest about where I am, serious about where it's going."
          />
          <div className="hidden shrink-0 sm:block">
            <Button to="/portfolio" variant="secondary" iconRight={<ArrowUpRight className="h-4 w-4" />}>
              View all work
            </Button>
          </div>
        </div>

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuredProjects.map((project, i) => (
            <motion.div key={project.slug} variants={fadeUp}>
              <ProjectCard project={project} priority={i < 2} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 sm:hidden">
          <Button to="/portfolio" variant="secondary" fullWidth iconRight={<ArrowUpRight className="h-4 w-4" />}>
            View all work
          </Button>
        </div>
      </Container>
    </Section>
  )
}
