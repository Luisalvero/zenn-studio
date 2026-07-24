import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** Show the full "PRODUCTIONS" wordmark next to the monogram. */
  full?: boolean
  onClick?: () => void
}

/** The LA Productions wordmark: a monogram tile + letter-spaced name. */
export function Logo({ className, full = true, onClick }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="LA Productions — home"
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.02] transition-colors duration-500 group-hover:border-white/35">
        <span className="font-display text-sm font-bold tracking-tight text-chalk">LA</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-sm font-semibold tracking-[0.02em] text-chalk">LA Productions</span>
        {full && (
          <span className="mt-1 text-[0.6rem] uppercase tracking-[0.32em] text-ash">Post-Production</span>
        )}
      </span>
    </Link>
  )
}
