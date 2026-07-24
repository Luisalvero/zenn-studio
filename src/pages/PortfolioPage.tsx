import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProjects } from '@/lib/projects-store'
import type { ProjectCategory } from '@/types'
import { SEO } from '@/components/ui/SEO'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import { FeaturedProjectCard } from '@/components/portfolio/FeaturedProjectCard'
import { cn } from '@/lib/utils'
import { fadeUp } from '@/lib/animations'

type Filter = 'All' | ProjectCategory

export function PortfolioPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const { projects } = useProjects()

  // Unique categories, in first-seen order, for the filter bar.
  const filters = useMemo<Filter[]>(() => {
    const set = new Set<ProjectCategory>()
    projects.forEach((p) => p.categories.forEach((c) => set.add(c)))
    return ['All', ...Array.from(set)]
  }, [projects])

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  )

  // On "All", lead with a large featured project and grid the rest.
  const isAll = filter === 'All'
  const featured = isAll ? projects[0] : undefined
  const gridProjects = isAll ? projects.slice(1) : visible

  return (
    <>
      <SEO
        title="Portfolio"
        path="/portfolio"
        description="Selected work by Zenn Studio — real projects and collaborations in cinematic editing, sound design, and color grading."
      />

      <PageHeader
        eyebrow="Current Portfolio"
        title="Selected work"
        description="A growing collection of personal projects and collaborations — each one a chance to push the craft further. Honest about where it started, serious about where it's going."
      />

      <Section spacing="compact" className="pt-0">
        <Container size="wide">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-2.5 border-b border-white/5 pb-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-all duration-300',
                  filter === f
                    ? 'border-white/40 bg-white/10 text-chalk'
                    : 'border-white/10 text-mist hover:border-white/25 hover:text-bone',
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Featured lead */}
          {featured && (
            <motion.div
              key={featured.slug}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="border-b border-white/5 py-14"
            >
              <FeaturedProjectCard project={featured} />
            </motion.div>
          )}

          {/* Grid */}
          {gridProjects.length > 0 && (
            <>
              {featured && (
                <p className="mt-12 mb-8 eyebrow">More work</p>
              )}
              <motion.div layout className={cn('grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3', !featured && 'mt-12')}>
                <AnimatePresence mode="popLayout">
                  {gridProjects.map((project, i) => (
                    <motion.div
                      key={project.slug}
                      layout
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ProjectCard project={project} priority={i < 3} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}

          {visible.length === 0 && (
            <p className="py-16 text-center text-mist">No projects in this category yet — more coming soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
