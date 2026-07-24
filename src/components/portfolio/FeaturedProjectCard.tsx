import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { Image } from '@/components/ui/Image'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'

/**
 * Large featured presentation for the lead project — media beside a full
 * write-up, with the same muted hover-preview as the grid cards.
 */
export function FeaturedProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [previewing, setPreviewing] = useState(false)
  const isPortrait = project.orientation === 'portrait'

  function startPreview() {
    if (!project.previewVideo) return
    const v = videoRef.current
    if (!v) return
    setPreviewing(true)
    v.currentTime = 0
    void v.play().catch(() => {})
  }
  function stopPreview() {
    setPreviewing(false)
    videoRef.current?.pause()
  }

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      aria-label={`${project.title} — view project`}
      className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      {/* Media */}
      <div className={cn(isPortrait && 'mx-auto w-full max-w-[360px] lg:mx-0')}>
        <div
          onMouseEnter={startPreview}
          onMouseLeave={stopPreview}
          className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 transition-colors duration-500 group-hover:border-white/25"
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            placeholderLabel={project.title}
            priority
            ratio={isPortrait ? '4/5' : '16/9'}
            rounded={false}
            className="transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-void/40 text-bone backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-void/20">
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" strokeWidth={0} />
            </span>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-5">
        <span className="eyebrow">Featured work</span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl lg:text-5xl">
          {project.title}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.categories.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </div>
        <p className="max-w-xl text-base leading-relaxed text-mist sm:text-lg">{project.summary}</p>
        <span className="text-xs uppercase tracking-[0.2em] text-ash">
          {project.kind} · {project.year}
        </span>
        <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-bone transition-colors group-hover:text-chalk">
          View project
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  )
}
