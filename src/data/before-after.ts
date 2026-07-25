export interface BeforeAfter {
  before: string
  after: string
  label?: string
  beforeAlt?: string
  afterAlt?: string
  /** Demo only: render `before` as a flat/ungraded simulation of `after`. */
  flatBefore?: boolean
}

/**
 * Before/after comparison pairs (color grade / edit reveals).
 * ---------------------------------------------------------------------------
 * Replace the demo entry below with your real matched frames: the SAME frame,
 * same crop + resolution — one ungraded (flat/log/raw), one graded/final — so
 * only the look changes when you drag. Drop the images in
 * public/images/before-after/ and point `before`/`after` at them, e.g.:
 *
 *   { before: '/images/before-after/01-before.jpg',
 *     after:  '/images/before-after/01-after.jpg',
 *     label:  'Short film — ungraded → final grade' }
 *
 * Delete `flatBefore` on real pairs (it only fakes a grade for the demo).
 */
export const beforeAfters: BeforeAfter[] = [
  {
    before: '/images/before-after/01-before.jpg',
    after: '/images/before-after/01-after.jpg',
    label: 'BJJ documentary — ungraded → final grade',
    beforeAlt: 'Ungraded frame from a Brazilian Jiu-Jitsu documentary',
    afterAlt: 'Final color grade of a Brazilian Jiu-Jitsu documentary frame',
  },
  {
    before: '/images/before-after/02-before.jpg',
    after: '/images/before-after/02-after.jpg',
    label: 'Nature — ungraded → final grade',
    beforeAlt: 'Ungraded nature frame',
    afterAlt: 'Final color grade of a nature frame',
  },
]
