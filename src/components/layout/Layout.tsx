import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { ScrollProgress } from './ScrollProgress'
import { GrainOverlay } from '@/components/ui/GrainOverlay'

/** App shell: fixed nav, animated grain, routed page content, footer. */
export function Layout() {
  return (
    <>
      <ScrollToTop />
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
        <Outlet />
      </main>

      <Footer />
    </>
  )
}
