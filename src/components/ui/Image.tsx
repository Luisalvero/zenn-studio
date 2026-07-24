import { useState } from 'react'
import { Film } from 'lucide-react'
import { cn, hashString } from '@/lib/utils'

interface ImageProps {
  src?: string
  alt: string
  className?: string
  /** Wrapper aspect ratio, e.g. "16/9", "4/5", "1/1". */
  ratio?: string
  /** Eager-load above-the-fold images; everything else stays lazy. */
  priority?: boolean
  /** Optional label shown on the placeholder to hint at the asset. */
  placeholderLabel?: string
  /** object-fit behaviour. */
  fit?: 'cover' | 'contain'
  /** Rounded corners on the wrapper. */
  rounded?: boolean
  /** Absolutely fill the positioned parent instead of imposing an aspect ratio. */
  fill?: boolean
}

/**
 * Reusable image with a graceful, on-brand placeholder.
 * ---------------------------------------------------------------------------
 * When `src` is empty or fails to load, a subtle monochrome placeholder is
 * shown instead of a broken image — so the layout always looks intentional
 * while real stills are still being produced. Fades in on load.
 */
export function Image({
  src,
  alt,
  className,
  ratio = '16/9',
  priority = false,
  placeholderLabel,
  fit = 'cover',
  rounded = true,
  fill = false,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const showPlaceholder = !src || failed
  // Deterministic subtle gradient so each placeholder differs but stays monochrome.
  const seed = hashString(placeholderLabel || alt)
  const angle = 120 + (seed % 90)

  return (
    <div
      className={cn(
        'isolate overflow-hidden bg-graphite',
        fill ? 'absolute inset-0 h-full w-full' : 'relative',
        rounded && 'rounded-xl',
        className,
      )}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      {showPlaceholder ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ash"
          style={{
            background: `linear-gradient(${angle}deg, #0d0d0f 0%, #17171a 55%, #0b0b0d 100%)`,
          }}
          aria-hidden={!!src ? undefined : true}
        >
          <div className="bg-grid absolute inset-0 opacity-40" />
          <Film className="relative h-7 w-7 opacity-50" strokeWidth={1.25} />
          {placeholderLabel && (
            <span className="relative px-6 text-center text-[0.7rem] uppercase tracking-[0.2em] text-ash/80">
              {placeholderLabel}
            </span>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'h-full w-full transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            fit === 'cover' ? 'object-cover' : 'object-contain',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  )
}
