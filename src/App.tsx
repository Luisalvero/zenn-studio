import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'

// Home ships in the main bundle (it's the landing page); the rest are
// code-split and loaded on navigation to keep the initial payload small.
const PortfolioPage = lazy(() =>
  import('@/pages/PortfolioPage').then((m) => ({ default: m.PortfolioPage })),
)
const ProjectPage = lazy(() =>
  import('@/pages/ProjectPage').then((m) => ({ default: m.ProjectPage })),
)
const ServicesPage = lazy(() =>
  import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))
const SoundPage = lazy(() => import('@/pages/SoundPage').then((m) => ({ default: m.SoundPage })))

/** Minimal, on-brand fallback while a route chunk loads. */
function RouteFallback() {
  return <div className="min-h-[100svh] bg-void" aria-hidden="true" />
}

export function App() {
  return (
    // reducedMotion="user" makes every animation respect the OS setting.
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Owner-only admin — outside the public layout (no marketing chrome) */}
          <Route path="/admin" element={<AdminPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:slug" element={<ProjectPage />} />
            <Route path="/sound" element={<SoundPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </MotionConfig>
  )
}
