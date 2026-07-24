import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { siteConfig, contactLinks } from '@/config/site'
import { Container } from '@/components/ui/Container'
import { InstagramIcon, GithubIcon } from '@/components/ui/BrandIcons'

const socials = [
  { label: 'Instagram', href: contactLinks.instagram, icon: InstagramIcon, external: true },
  { label: 'Email', href: contactLinks.email, icon: Mail, external: false },
  { label: 'GitHub', href: contactLinks.github, icon: GithubIcon, external: true },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 bg-ink">
      <Container size="wide" className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <span className="font-display text-2xl font-semibold tracking-tight text-chalk">
              Zenn Studio
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              Cinematic editing, sound design, and color — building a body of work and open for new
              collaborations.
            </p>
            <span className="text-xs uppercase tracking-[0.2em] text-ash">{siteConfig.availability}</span>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer" className="flex flex-col gap-4">
            <span className="eyebrow">Navigate</span>
            <ul className="flex flex-col gap-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-mist transition-colors duration-300 hover:text-chalk"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Connect</span>
            <ul className="flex flex-col gap-3">
              {socials.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group inline-flex items-center gap-2.5 text-sm text-mist transition-colors duration-300 hover:text-chalk"
                  >
                    <Icon className="h-4 w-4 text-ash transition-colors duration-300 group-hover:text-bone" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ash sm:flex-row sm:items-center">
          <p>
            © {year} Zenn Studio. Crafted by {siteConfig.founder}.
          </p>
          <p className="text-ash/70">Personal &amp; spec work — building the portfolio.</p>
        </div>
      </Container>
    </footer>
  )
}
