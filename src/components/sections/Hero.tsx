import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { Play, ArrowUpRight, ArrowDown } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useContent } from '@/lib/content'
import type { VideoProvider } from '@/lib/video'
import { Button } from '@/components/ui/Button'
import { VideoModal } from '@/components/ui/VideoModal'
import { fadeUp, staggerContainer } from '@/lib/animations'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [reelOpen, setReelOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const { get } = useContent()

  // Scroll parallax: content drifts up + fades; the background drifts slower.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  // Subtle mouse-follow drift on the background (desktop only, off for reduced motion).
  const mx = useSpring(0, { stiffness: 50, damping: 18, mass: 0.4 })
  const my = useSpring(0, { stiffness: 50, damping: 18, mass: 0.4 })

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 26)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 26)
  }
  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Cinematic background portrait — heavily darkened so it reads as atmosphere */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
        <motion.img
          src="/images/hero-portrait.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          style={{ x: mx as MotionValue<number>, y: my as MotionValue<number> }}
          className="h-full w-full scale-[1.14] object-cover object-[62%_center]"
        />
      </motion.div>

      {/* Dark treatment: overall darken + top/bottom grounding + left readability */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-void/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-transparent to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/30 to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-[0.25] mask-fade-b" />
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-[88rem] px-6 pt-28 sm:px-8 lg:px-12"
      >
        <motion.div
          variants={staggerContainer(0.14, 0.1)}
          initial="hidden"
          animate="visible"
          className="flex max-w-3xl flex-col gap-8"
        >
          <motion.h1 variants={fadeUp} className="text-hero font-display font-semibold text-chalk">
            {get('hero_line1')}
            <br />
            <span className="text-mist">{get('hero_line2')}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-silver">
            {get('hero_paragraph')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => setReelOpen(true)}
              iconLeft={<Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />}
            >
              Watch Showreel
            </Button>
            <Button
              to="/contact"
              size="lg"
              variant="secondary"
              iconRight={<ArrowUpRight className="h-4 w-4" />}
            >
              Start a Project
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ash sm:flex"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.div>

      <VideoModal
        open={reelOpen}
        onClose={() => setReelOpen(false)}
        provider={get('showreel_provider') as VideoProvider}
        id={get('showreel_id')}
        title={siteConfig.showreel.title}
      />
    </section>
  )
}
