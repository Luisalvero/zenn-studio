import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { Logo } from './Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useLockBodyScroll(menuOpen)

  // Solidify the bar once the hero starts scrolling away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled || menuOpen
          ? 'border-b border-white/10 bg-void/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-18 w-full max-w-[88rem] items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Logo />

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-9 md:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative text-sm tracking-tight transition-colors duration-300 hover:text-chalk',
                    isActive ? 'text-chalk' : 'text-mist',
                  )
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-block py-1">
                    {item.label}
                    <span
                      className={cn(
                        'absolute -bottom-0.5 left-0 h-px bg-chalk transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isActive ? 'w-full' : 'w-0',
                      )}
                    />
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <NavLink
            to="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone transition-all duration-500 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full text-bone transition-colors hover:bg-white/5 md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 top-18 z-40 bg-void/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="flex flex-col gap-2 px-6 pt-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
              {siteConfig.nav.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                >
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between border-b border-white/5 py-5 font-display text-3xl tracking-tight transition-colors',
                        isActive ? 'text-chalk' : 'text-mist',
                      )
                    }
                  >
                    {item.label}
                    <ArrowUpRight className="h-6 w-6 text-ash" />
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
