import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from './ScrollProgress'
import { GrainOverlay } from '@/components/ui/GrainOverlay'

/**
 * Crossfades between routes. Opacity-only on purpose — a transform here would
 * create a containing block and break fixed modals / sticky sidebars inside
 * pages. Scroll resets after the outgoing page has faded out.
 */
function AnimatedOutlet() {
  const location = useLocation()
  const element = useOutlet()
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0 })}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  )
}

/** App shell: progress bar, grain, fixed nav, crossfading page content, footer. */
export function Layout() {
  return (
    <>
      <ScrollProgress />
      <GrainOverlay />

      <a
        href="#main"
        className="sr-only z-[200] rounded-full bg-chalk px-4 py-2 text-sm font-medium text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="relative z-[2]">
        <AnimatedOutlet />
      </main>

      <Footer />
    </>
  )
}
