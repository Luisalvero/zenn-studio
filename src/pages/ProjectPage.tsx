import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { getProjectBySlug, getAdjacentProjects } from '@/data/projects'
import { SEO } from '@/components/ui/SEO'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { Image } from '@/components/ui/Image'
import { Tag } from '@/components/ui/Tag'
import { Reveal } from '@/components/ui/Reveal'
import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'

/** Labelled long-form block with a consistent reveal. */
function Block({ label, title, children }: { label: string; title?: string; children: ReactNode }) {
  return (
    <Reveal className="flex flex-col gap-4">
      <span className="eyebrow">{label}</span>
      {title && (
        <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">{title}</h2>
      )}
      <div className="text-base leading-relaxed text-mist">{children}</div>
    </Reveal>
  )
}

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return (
      <>
        <SEO title="Project not found" path="/portfolio" noIndex />
        <Section className="pt-40">
          <Container className="flex flex-col items-start gap-6">
            <h1 className="font-display text-4xl font-semibold text-chalk">Project not found</h1>
            <p className="text-mist">That project doesn't exist — it may have moved.</p>
            <Button to="/portfolio" variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              Back to portfolio
            </Button>
          </Container>
        </Section>
      </>
    )
  }

  const { prev, next } = getAdjacentProjects(project.slug)
  const hasNotes = Boolean(project.soundNotes || project.motionNotes || project.gradeNotes)
  const hasSidebar = Boolean(project.software?.length || project.techniques?.length)
  const hasNarrative = Boolean(
    project.overview || project.goals?.length || project.direction || project.process || hasNotes,
  )
  const hasReflection = Boolean(project.challenges || project.lessons)

  const narrative = (
    <div className="flex flex-col gap-16">
      {project.overview && (
        <Block label="Overview">
          <p>{project.overview}</p>
        </Block>
      )}

      {project.goals && project.goals.length > 0 && (
        <Block label="Project goals" title="What I set out to do">
          <ul className="flex flex-col gap-3">
            {project.goals.map((g) => (
              <li key={g} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ash" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {project.direction && (
        <Block label="Creative direction">
          <p>{project.direction}</p>
        </Block>
      )}

      {project.process && (
        <Block label="Editing process">
          <p>{project.process}</p>
        </Block>
      )}

      {hasNotes && (
        <div className="flex flex-col gap-10">
          {project.soundNotes && (
            <Block label="Sound design notes">
              <p>{project.soundNotes}</p>
            </Block>
          )}
          {project.motionNotes && (
            <Block label="Motion graphics notes">
              <p>{project.motionNotes}</p>
            </Block>
          )}
          {project.gradeNotes && (
            <Block label="Color grading notes">
              <p>{project.gradeNotes}</p>
            </Block>
          )}
        </div>
      )}
    </div>
  )

  return (
    <>
      <SEO
        title={project.title}
        path={`/portfolio/${project.slug}`}
        description={project.summary}
        type="article"
      />

      {/* Hero */}
      <header className="relative overflow-hidden pt-32 pb-12 sm:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-grid opacity-[0.35] mask-fade-b" />
        <Container size="wide">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeUp}>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-chalk"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
                All work
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {project.categories.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-4xl text-display font-display font-semibold text-chalk"
            >
              {project.title}
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-relaxed text-mist">
              {project.summary}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ash">
              <span>{project.kind}</span>
              <span aria-hidden>·</span>
              <span>{project.year}</span>
            </motion.div>

            {project.collaborator && (
              <motion.div variants={fadeUp}>
                <a
                  href={project.collaborator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-bone transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  Made for {project.collaborator.name}
                  <ArrowUpRight className="h-4 w-4 text-ash transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </header>

      {/* Final video */}
      <Container size="wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10"
        >
          <VideoEmbed provider={project.video?.provider ?? 'youtube'} id={project.video?.id ?? ''} title={project.title} />
        </motion.div>
      </Container>

      {/* Body */}
      <Section>
        <Container size="wide">
          {hasNarrative &&
            (hasSidebar ? (
              <div className="grid gap-16 lg:grid-cols-[1fr_2fr] lg:gap-20">
                {/* Sticky meta sidebar */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <Reveal className="flex flex-col gap-8">
                    {project.software && project.software.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="eyebrow">Software</span>
                        <ul className="flex flex-wrap gap-2">
                          {project.software.map((s) => (
                            <li key={s}>
                              <Tag>{s}</Tag>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.techniques && project.techniques.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="eyebrow">Techniques</span>
                        <ul className="flex flex-col gap-2.5">
                          {project.techniques.map((t) => (
                            <li key={t} className="flex items-start gap-2.5 text-sm text-silver">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-ash" strokeWidth={2} />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Reveal>
                </div>
                {narrative}
              </div>
            ) : (
              <div className="max-w-3xl">{narrative}</div>
            ))}

          {/* Grade comparisons */}
          {project.gradeComparisons && project.gradeComparisons.length > 0 && (
            <div className={hasNarrative ? 'mt-20' : ''}>
              <Reveal className="mb-8 flex flex-col gap-3">
                <span className="eyebrow">Color grading</span>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
                  Before &amp; after
                </h2>
              </Reveal>
              <div className="grid gap-6 md:grid-cols-2">
                {project.gradeComparisons.map((c, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <BeforeAfter before={c.before} after={c.after} label={c.label} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Stills */}
          {project.stills && project.stills.length > 0 && (
            <div className="mt-20">
              <Reveal className="mb-8 flex flex-col gap-3">
                <span className="eyebrow">Stills</span>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
                  Frames from the piece
                </h2>
              </Reveal>
              <motion.div
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="grid gap-6 sm:grid-cols-2"
              >
                {project.stills.map((s, i) => (
                  <motion.figure key={i} variants={fadeUp} className="flex flex-col gap-3">
                    <Image src={s.src} alt={s.alt} placeholderLabel="Still" ratio="16/9" />
                    {s.caption && <figcaption className="text-xs text-ash">{s.caption}</figcaption>}
                  </motion.figure>
                ))}
              </motion.div>
            </div>
          )}

          {/* Timeline stills */}
          {project.timelineStills && project.timelineStills.length > 0 && (
            <div className="mt-20">
              <Reveal className="mb-8 flex flex-col gap-3">
                <span className="eyebrow">Behind the timeline</span>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
                  Inside the edit
                </h2>
              </Reveal>
              <motion.div
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="grid gap-6"
              >
                {project.timelineStills.map((s, i) => (
                  <motion.figure key={i} variants={fadeUp} className="flex flex-col gap-3">
                    <Image src={s.src} alt={s.alt} placeholderLabel="Timeline screenshot" ratio="21/9" fit="contain" />
                    {s.caption && <figcaption className="text-xs text-ash">{s.caption}</figcaption>}
                  </motion.figure>
                ))}
              </motion.div>
            </div>
          )}

          {/* Reflection */}
          {hasReflection && (
            <div className="mt-20 grid gap-10 border-t border-white/10 pt-16 md:grid-cols-2">
              {project.challenges && (
                <Block label="Challenges">
                  <p>{project.challenges}</p>
                </Block>
              )}
              {project.lessons && (
                <Block label="Lessons learned">
                  <p>{project.lessons}</p>
                </Block>
              )}
            </div>
          )}

          {/* Prev / Next (only when there's more than one project) */}
          {(prev || next) && (
            <nav className="mt-20 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2" aria-label="More projects">
              {prev && (
                <Link
                  to={`/portfolio/${prev.slug}`}
                  className="group flex flex-col gap-2 rounded-xl border border-white/10 p-6 transition-colors hover:border-white/25 hover:bg-white/[0.02]"
                >
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ash">
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
                    Previous
                  </span>
                  <span className="font-display text-lg font-semibold text-chalk">{prev.title}</span>
                </Link>
              )}
              {next && (
                <Link
                  to={`/portfolio/${next.slug}`}
                  className="group flex flex-col gap-2 rounded-xl border border-white/10 p-6 text-right transition-colors hover:border-white/25 hover:bg-white/[0.02] sm:col-start-2"
                >
                  <span className="inline-flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-ash">
                    Next
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                  <span className="font-display text-lg font-semibold text-chalk">{next.title}</span>
                </Link>
              )}
            </nav>
          )}

          <Reveal className="mt-16 flex justify-center">
            <Button to="/portfolio" variant="ghost" iconRight={<ArrowUpRight className="h-4 w-4" />}>
              See all work
            </Button>
          </Reveal>
        </Container>
      </Section>

      <ContactCTA />
    </>
  )
}
