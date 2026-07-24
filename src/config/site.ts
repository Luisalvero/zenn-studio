/**
 * LA PRODUCTIONS — Central site configuration
 * ---------------------------------------------------------------------------
 * Every piece of brand, contact, and social information lives here so the rest
 * of the app never hard-codes a handle or URL. Replace the values marked
 * `TODO` with your real details — nothing else in the codebase needs to change.
 */

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
  /** Lucide icon name is chosen at the call-site; this stays data-only. */
  handle?: string
}

export interface SiteConfig {
  name: string
  shortName: string
  founder: string
  role: string
  title: string
  description: string
  /** Absolute production URL, no trailing slash. Update to your live domain. */
  url: string
  locale: string
  tagline: string
  availability: string
  email: string
  whatsapp: {
    /** Digits only, international format (no +, spaces or dashes) for wa.me. */
    number: string
    display: string
  }
  instagram: {
    handle: string
    url: string
  }
  github: {
    handle: string
    url: string
  }
  showreel: {
    provider: 'youtube' | 'vimeo'
    /** The video ID only, not the full URL. */
    id: string
    title: string
  }
  nav: NavItem[]
}

export const siteConfig: SiteConfig = {
  name: 'LA Productions',
  shortName: 'LA',
  founder: 'Luis Alvero',
  role: 'Video Editor & Post-Production Artist',
  title: 'LA Productions — Cinematic Editing, Sound Design & Color',
  description:
    'LA Productions is the creative studio of Luis Alvero — cinematic video editing, sound design, and color grading. Building a portfolio of personal films and open for new collaborations.',
  url: 'https://laproductions.com',
  locale: 'en_US',
  tagline: 'Crafting stories through editing, sound, and color.',
  availability: 'Open for collaborations · Remote, worldwide',

  // ── Contact ──────────────────────────────────────────────────────────────
  email: 'emilacosta@gmail.com',
  whatsapp: {
    number: '10000000000', // TODO: replace with your WhatsApp Business number (digits only)
    display: '+1 (000) 000-0000', // TODO: replace with a human-readable version
  },
  instagram: {
    handle: 'laproductions', // TODO: replace with your Instagram handle (no @)
    url: 'https://instagram.com/laproductions', // TODO
  },
  github: {
    handle: 'luisalvero', // TODO: replace with your GitHub username
    url: 'https://github.com/luisalvero', // TODO
  },

  // ── Featured showreel ────────────────────────────────────────────────────
  showreel: {
    provider: 'youtube',
    id: 'ScMzIvxBSi4', // TODO: replace with your real showreel video ID
    title: 'LA Productions — Showreel',
  },

  // ── Navigation ───────────────────────────────────────────────────────────
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
}

/* Derived contact links — build once, use everywhere. */

export const contactLinks = {
  email: `mailto:${siteConfig.email}`,
  emailWithSubject: (subject = 'Project inquiry — LA Productions') =>
    `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`,
  whatsapp: (message = "Hi Luis, I'd love to talk about a project.") =>
    `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`,
  instagram: siteConfig.instagram.url,
  github: siteConfig.github.url,
} as const

/** Full watch URL for the showreel, derived from the provider + id. */
export function showreelWatchUrl(): string {
  const { provider, id } = siteConfig.showreel
  return provider === 'vimeo'
    ? `https://vimeo.com/${id}`
    : `https://www.youtube.com/watch?v=${id}`
}

/** Privacy-friendly embed URL (no-cookie for YouTube). */
export function showreelEmbedUrl(autoplay = false): string {
  const { provider, id } = siteConfig.showreel
  if (provider === 'vimeo') {
    return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0${
      autoplay ? '&autoplay=1' : ''
    }`
  }
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${
    autoplay ? '&autoplay=1' : ''
  }`
}
