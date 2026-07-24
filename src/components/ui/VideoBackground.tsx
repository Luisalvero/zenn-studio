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
 * Muted, looping video used purely as background texture. Heavily darkened so
 * it never competes with content. Respects reduced-motion by falling back to a
 * static poster (no autoplay). Decorative and non-interactive.
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
        <img src={poster} alt="" className="h-full w-full object-cover opacity-60" />
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="h-full w-full object-cover opacity-60"
        />
      )}

      {/* Dark treatment so the texture reads as atmosphere, never content */}
      <div className={cn('absolute inset-0 bg-void/75', overlayClassName)} />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/60 to-void" />
    </div>
  )
}
