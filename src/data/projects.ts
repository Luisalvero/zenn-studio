import type { Project } from '@/types'

/**
 * Portfolio projects — real work only.
 * ---------------------------------------------------------------------------
 * Add real assets as they exist:
 *   - thumbnail: a still from the piece, e.g. '/images/projects/<slug>/thumb.jpg'
 *     (empty string '' renders a branded placeholder so the layout stays clean).
 *   - video: provider + id to embed the final piece.
 * Rich narrative fields (overview, goals, process, etc.) are all optional —
 * include only what's true for the piece.
 */
export const projects: Project[] = [
  {
    slug: 'xlnt-bjj-documentary-teaser',
    title: 'BJJ Documentary Teaser',
    summary:
      'A high-energy teaser reel cut to tease a Brazilian Jiu-Jitsu documentary for XLNT Visual Studio.',
    kind: 'Documentary teaser · made for XLNT Visual Studio',
    year: '2026',
    categories: ['Trailer', 'Documentary', 'Motion Graphics'],
    thumbnail: '/images/projects/xlnt-bjj-documentary-teaser/thumb.jpg',
    previewVideo: '/images/projects/xlnt-bjj-documentary-teaser/preview.mp4',
    orientation: 'portrait',
    video: { provider: 'drive', id: '1MaH2g5v3BsvZPVjcIOHWn3qUJ77k40MF' },
    collaborator: { name: 'XLNT Visual Studio', url: 'https://www.instagram.com/xlnt_visuals/' },
    overview:
      'A fast-cut teaser reel edited to build anticipation for a Brazilian Jiu-Jitsu documentary by XLNT Visual Studio. The goal was pure energy and momentum — punchy, rhythmic editing that grabs attention and teases the story without giving it away.',
    featured: true,
  },
  {
    slug: 'vfx-demo-reel',
    title: 'VFX Demo Reel',
    summary: 'A demo reel showcasing visual effects and motion work — compositing, animation, and cinematic finishing.',
    kind: 'VFX / motion demo reel',
    year: '2026',
    categories: ['VFX', 'Motion Graphics'],
    thumbnail: '/images/projects/vfx-demo-reel/thumb.jpg',
    previewVideo: '/images/projects/vfx-demo-reel/preview.mp4',
    orientation: 'landscape',
    video: { provider: 'drive', id: '1wDNFH8LioMaFqeXL4zfAP_3vZ5wS8fm2' },
    featured: true,
  },
]

/** Convenience selectors. */
export const featuredProjects = projects.filter((p) => p.featured)

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null
  next: Project | null
} {
  const index = projects.findIndex((p) => p.slug === slug)
  // No wrap-around navigation when there's only a single project.
  if (index === -1 || projects.length <= 1) return { prev: null, next: null }
  return {
    prev: index > 0 ? projects[index - 1] : projects[projects.length - 1],
    next: index < projects.length - 1 ? projects[index + 1] : projects[0],
  }
}
