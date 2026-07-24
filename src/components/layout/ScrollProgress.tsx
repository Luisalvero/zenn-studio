import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Thin reading-progress bar pinned to the very top of the viewport.
 * Springs toward the current scroll position for a smooth, premium feel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.2 })

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-white/40 via-white/80 to-white/40"
    />
  )
}
