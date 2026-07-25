import { useEffect, useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonSliderProps {
  /** URL of the "before" image (raw / ungraded). Shown on the left. */
  before: string
  /** URL of the "after" image (graded / finished). Shown on the right. */
  after: string
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  /** Caption under the slider. */
  label?: string
  /** Demo only: render `before` as a flat/ungraded simulation of `after`. */
  flatBefore?: boolean
  className?: string
}

/**
 * Draggable before/after image comparison. Drag anywhere (mouse or touch), or
 * focus the handle and use ← → keys. The "before" image is revealed from the
 * left via clip-path, so both images stay full-size (no squishing).
 */
export function ComparisonSlider({
  before,
  after,
  beforeAlt = '',
  afterAlt = '',
  beforeLabel = 'Before',
  afterLabel = 'After',
  label,
  flatBefore = false,
  className,
}: ComparisonSliderProps) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function setFromX(clientX: number) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragging.current) setFromX(e.clientX)
    }
    const onUp = () => {
      dragging.current = false
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div
        ref={ref}
        onPointerDown={(e) => {
          dragging.current = true
          setFromX(e.clientX)
        }}
        className="group relative aspect-video w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-white/10 bg-black"
      >
        {/* after — base layer */}
        <img src={after} alt={afterAlt || 'After'} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        {/* before — clipped from the left edge to the handle */}
        <img
          src={before}
          alt={beforeAlt || 'Before'}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            filter: flatBefore ? 'saturate(0.35) contrast(0.92) brightness(1.08)' : undefined,
          }}
        />

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-white/85 backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-white/85 backdrop-blur-sm">
          {afterLabel}
        </span>

        {/* divider + handle */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/85" />
          <button
            type="button"
            aria-label="Drag to compare before and after"
            aria-valuenow={Math.round(pos)}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4))
              if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4))
            }}
            className="pointer-events-auto absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <MoveHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      {label && <figcaption className="text-center text-xs text-ash">{label}</figcaption>}
    </figure>
  )
}
