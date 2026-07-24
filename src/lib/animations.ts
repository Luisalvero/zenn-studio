import type { Variants, Transition } from 'framer-motion'

/**
 * Cinematic motion language.
 * ---------------------------------------------------------------------------
 * Slow, intentional, and never playful. Everything eases on long curves and
 * settles — nothing bounces. These variants are shared across the site so the
 * motion stays consistent. Framer Motion automatically softens all of this for
 * visitors who prefer reduced motion (see MotionConfig in App).
 */

const easeCinematic = [0.16, 1, 0.3, 1] as const
const easeSoft = [0.22, 1, 0.36, 1] as const

export const transitions = {
  cinematic: { duration: 0.9, ease: easeCinematic } satisfies Transition,
  soft: { duration: 0.7, ease: easeSoft } satisfies Transition,
  slow: { duration: 1.2, ease: easeCinematic } satisfies Transition,
}

/** Fade up — the workhorse entrance for text and blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.cinematic,
  },
}

/** Simple opacity fade — for images and overlays. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.slow },
}

/** Small fade up for finer elements (tags, captions). */
export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: transitions.soft },
}

/** Slow reveal for imagery — combines opacity with a gentle scale settle. */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: easeCinematic },
  },
}

/** Container that staggers its children into view. */
export const staggerContainer = (stagger = 0.12, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

/** Standard viewport config for scroll-triggered reveals. */
export const viewportOnce = { once: true, amount: 0.3 } as const
