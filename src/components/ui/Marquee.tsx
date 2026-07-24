import { Fragment } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: string[]
  className?: string
}

/**
 * Slow, seamless horizontal word strip. Content is duplicated so the CSS
 * marquee animation loops without a visible seam. Decorative; the words are
 * hidden from assistive tech to avoid duplicate announcements.
 */
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div
      className={cn('group relative flex overflow-hidden py-6 select-none', className)}
      aria-hidden="true"
    >
      {/* edge fades into black */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />

      <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap [animation-play-state:running] group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="mx-8 flex items-center gap-8">
                <span className="font-display text-xl font-medium tracking-tight text-ash/70 sm:text-2xl">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-ash/40" />
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
