import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VideoBackgroundProps {
  src: string
  poster: string
  /** 'absolute' fills the nearest positioned parent; 'fixed' stays put while content scrolls. */
  attachment?: 'absolute' | 'fixed'
  /** Extra overlay classes to fine-tune darkness/tint per placement. */
  overlayClassName?: string
  className?: string
}

/**
 * Muted, looping video used as background texture. Darkened enough to sit
 * behind content but still visible. Respects reduced-motion by falling back to
 * a static poster (no autoplay). Decorative and non-interactive.
 *
 * Usage: put on a `relative isolate overflow-hidden` parent with `className="z-0"`,
 * and give the content a `relative z-10` wrapper so it sits on top.
 */
export function VideoBackground({
  src,
  poster,
  attachment = 'absolute',
  overlayClassName,
  className,
}: VideoBackgroundProps) {
  const reduce = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none overflow-hidden',
        attachment === 'fixed' ? 'fixed inset-0' : 'absolute inset-0',
        className,
      )}
    >
      {reduce ? (
        <img src={poster} alt="" className="h-full w-full object-cover" />
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          className="h-full w-full object-cover"
        />
      )}

      {/* Dark treatment: modest flat darken + edge fade so it blends into black */}
      <div className={cn('absolute inset-0 bg-void/45', overlayClassName)} />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
    </div>
  )
}
