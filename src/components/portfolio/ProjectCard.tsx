import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { Image } from '@/components/ui/Image'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  /** Eager-load the first couple of cards; the rest stay lazy. */
  priority?: boolean
}

/**
 * Cinematic portfolio card linking to the project's detail page.
 * - Muted, looping preview clip plays on hover (YouTube-style) over the poster.
 * - Subtle mouse-driven 3D tilt on the media. Both are desktop-only and
 *   disabled for reduced-motion users.
 */
export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const [previewing, setPreviewing] = useState(false)
  const reduce = useReducedMotion()
  const ratio = project.orientation === 'portrait' ? '4/5' : '16/10'

  const rotateX = useSpring(0, { stiffness: 150, damping: 18, mass: 0.3 })
  const rotateY = useSpring(0, { stiffness: 150, damping: 18, mass: 0.3 })

  function startPreview() {
    if (!project.previewVideo) return
    const v = videoRef.current
    if (!v) return
    setPreviewing(true)
    v.currentTime = 0
    void v.play().catch(() => {})
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const rect = mediaRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 6)
    rotateX.set(-py * 6)
  }

  function reset() {
    setPreviewing(false)
    videoRef.current?.pause()
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="group block focus-visible:outline-none"
      aria-label={`${project.title} — view project`}
    >
      <motion.div
        ref={mediaRef}
        onMouseEnter={startPreview}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="relative overflow-hidden rounded-xl border border-white/10 transition-colors duration-500 group-hover:border-white/25 [transform-style:preserve-3d]"
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          placeholderLabel={project.title}
          priority={priority}
          ratio={ratio}
          rounded={false}
          className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />

        {/* Hover preview clip (muted, looping) layered over the poster */}
        {project.previewVideo && (
          <video
            ref={videoRef}
            src={project.previewVideo}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
              previewing ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}

        {/* Gradient scrim + hover affordance (above the preview) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full border border-white/20 bg-void/40 text-bone opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {project.categories.slice(0, 3).map((c) => (
            <Tag key={c} className="bg-void/50 backdrop-blur-sm">
              {c}
            </Tag>
          ))}
        </div>
      </motion.div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl font-semibold tracking-tight text-chalk transition-colors sm:text-2xl">
            {project.title}
          </h3>
          <span className="shrink-0 text-xs text-ash">{project.year}</span>
        </div>
        <p className="text-sm leading-relaxed text-mist">{project.summary}</p>
        <span className="mt-1 text-[0.7rem] uppercase tracking-[0.2em] text-ash">{project.kind}</span>
      </div>
    </Link>
  )
}
