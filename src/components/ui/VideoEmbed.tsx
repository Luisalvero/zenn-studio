import { Play } from 'lucide-react'
import { embedUrl, type VideoProvider } from '@/lib/video'
import { cn } from '@/lib/utils'

interface VideoEmbedProps {
  provider: VideoProvider
  id: string
  title?: string
  className?: string
  /** 'portrait' renders a 9:16 player (vertical reels); default is 16:9. */
  orientation?: 'landscape' | 'portrait'
}

/**
 * Inline, responsive video embed used on project pages. Defaults to 16:9;
 * portrait renders a 9:16 player for vertical reels. Falls back to a tasteful
 * placeholder while the final video is still being produced.
 */
export function VideoEmbed({ provider, id, title = 'Video', className, orientation = 'landscape' }: VideoEmbedProps) {
  const hasVideo = id.trim().length > 0

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-white/10 bg-black',
        orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video',
        className,
      )}
    >
      {hasVideo ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl(provider, id)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="bg-grid absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0d0d0f] to-[#050506] text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 text-bone">
            <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" strokeWidth={0} />
          </span>
          <p className="text-sm uppercase tracking-[0.2em] text-ash">Final video coming soon</p>
        </div>
      )}
    </div>
  )
}
