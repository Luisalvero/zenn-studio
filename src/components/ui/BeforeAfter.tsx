import { useState } from 'react'
import { Image } from './Image'

interface BeforeAfterProps {
  before?: string
  after?: string
  label?: string
}

/**
 * Before/after grade comparison with a draggable slider (a range input, so it
 * is keyboard-accessible). Placeholders keep the layout intact until real
 * stills are added.
 */
export function BeforeAfter({ before, after, label }: BeforeAfterProps) {
  const [pos, setPos] = useState(50)

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 select-none">
        {/* Base: BEFORE */}
        <Image src={before} alt={label ? `${label} — before` : 'Before grade'} placeholderLabel="Before" fill rounded={false} />

        {/* Overlay: AFTER, clipped to the slider position */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={after} alt={label ? `${label} — after` : 'After grade'} placeholderLabel="After" fill rounded={false} />
        </div>

        {/* Divider */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/70"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-void/60 text-[0.6rem] text-bone backdrop-blur-sm">
            ⇄
          </span>
        </div>

        {/* Labels */}
        <span className="absolute bottom-3 left-3 rounded-full bg-void/60 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-mist backdrop-blur-sm">
          Before
        </span>
        <span className="absolute right-3 bottom-3 rounded-full bg-void/60 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-mist backdrop-blur-sm">
          After
        </span>

        {/* Range control fills the frame */}
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={label ? `${label} — compare before and after` : 'Compare before and after'}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {label && <figcaption className="text-xs text-ash">{label}</figcaption>}
    </figure>
  )
}
