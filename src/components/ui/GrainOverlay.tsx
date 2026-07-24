/**
 * Fixed, ultra-subtle film-grain texture layered over the whole page.
 * Purely decorative (aria-hidden) and non-interactive. Kept very low opacity so
 * it reads as film texture, never noise. Uses an inline SVG so there is no
 * network request.
 */
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-screen"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: '120px 120px' }}
    />
  )
}
