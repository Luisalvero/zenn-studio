/**
 * ZENN STUDIO — Central site configuration
 * ---------------------------------------------------------------------------
 * Every piece of brand, contact, and social information lives here so the rest
 * of the app never hard-codes a handle or URL. Replace the values marked
 * `TODO` with your real details — nothing else in the codebase needs to change.
 */

import { embedUrl, watchUrl } from '@/lib/video'

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
  /** Path to the founder portrait in /public (shown on About). */
  portrait: string
  showreel: {
    provider: 'youtube' | 'vimeo' | 'drive'
    /** The video ID only, not the full URL. */
    id: string
    title: string
  }
  nav: NavItem[]
}

export const siteConfig: SiteConfig = {
  name: 'Zenn Studio',
  shortName: 'Zenn',
  founder: 'Luis Alvero',
  role: 'Video Editor & Post-Production Artist',
  title: 'Zenn Studio — Cinematic Editing, Sound Design & Color',
  description:
    'Zenn Studio is the creative studio of Luis Alvero — cinematic video editing, sound design, and color grading. Building a portfolio of personal films and open for new collaborations.',
  url: 'https://zennvoi.com',
  locale: 'en_US',
  tagline: 'Crafting stories through editing, sound, and color.',
  availability: 'Open for collaborations · Remote, worldwide',

  // ── Contact ──────────────────────────────────────────────────────────────
  email: 'luis@empcnet.com',
  whatsapp: {
    number: '17864918568', // digits only, international format, for wa.me links
    display: '+1 (786) 491-8568',
  },
  instagram: {
    handle: '3choedreal',
    url: 'https://www.instagram.com/3choedreal/',
  },
  github: {
    handle: 'luisalvero',
    url: 'https://github.com/luisalvero',
  },

  // Founder portrait.
  portrait: '/images/portrait.png',

  // ── Featured showreel ────────────────────────────────────────────────────
  // Hosted on Google Drive for now. NOTE: for a portfolio showreel, YouTube or
  // Vimeo is strongly recommended (better player, faster load, no Drive quota
  // limits, and it's indexable). To switch, set provider + id to that video.
  showreel: {
    provider: 'drive',
    id: '1t_00jFv2aCJwuba3fkzDR5qArXkldCpj',
    title: 'Showreel',
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
  emailWithSubject: (subject = 'Project inquiry — Zenn Studio') =>
    `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`,
  whatsapp: (message = "Hi Luis, I'd love to talk about a project.") =>
    `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`,
  instagram: siteConfig.instagram.url,
  github: siteConfig.github.url,
} as const

/** Full watch URL for the showreel, derived from the provider + id. */
export function showreelWatchUrl(): string {
  return watchUrl(siteConfig.showreel.provider, siteConfig.showreel.id)
}

/** Embed URL for the showreel (no-cookie YouTube / clean Vimeo / Drive preview). */
export function showreelEmbedUrl(autoplay = false): string {
  return embedUrl(siteConfig.showreel.provider, siteConfig.showreel.id, autoplay)
}
