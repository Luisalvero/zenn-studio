import type { Service } from '@/types'

/**
 * Services offered. Icons reference Lucide icon names and are resolved in the
 * component layer. No pricing yet — every service ends in a custom quote.
 */
export const services: Service[] = [
  {
    slug: 'trailer-editing',
    title: 'Trailer Editing',
    icon: 'Clapperboard',
    summary: 'Tease, escalate, and land the cut. Trailers built around tension and rhythm.',
    description:
      'Cut-downs and teasers structured like film trailers — a hook, a build, and a title that arrives at exactly the right moment. Every beat is timed to sound so the piece feels inevitable.',
    deliverables: ['Trailer / teaser edit', 'Sound-led pacing', 'Title & end card', 'Revision rounds'],
  },
  {
    slug: 'gameplay-cinematics',
    title: 'Gameplay Cinematics',
    icon: 'Gamepad2',
    summary: 'Turning in-game capture into sequences that read like pre-rendered film.',
    description:
      'Cinematic edits cut from gameplay capture — reframed, stabilised, matched, and graded so real-time footage feels authored. Ideal for reveals, recaps, and hype pieces.',
    deliverables: ['Cinematic sequence', 'Shot matching & grade', 'Title system', 'Delivery for platforms'],
  },
  {
    slug: 'developer-logs',
    title: 'Developer Logs',
    icon: 'Terminal',
    summary: 'Devlogs with narrative structure, clean motion graphics, and real momentum.',
    description:
      'Developer-log edits that give the format an arc — scripted beats, legible screen capture, and a reusable motion-graphics kit so a series stays consistent episode to episode.',
    deliverables: ['Episode edit', 'Motion-graphics kit', 'Screen-capture cleanup', 'Series consistency'],
  },
  {
    slug: 'short-films',
    title: 'Short Films',
    icon: 'Film',
    summary: 'Story-first editing that cuts for emotion, breath, and character.',
    description:
      'Narrative editing for shorts and passion projects — assembly through final cut, built around emotional pacing rather than information. The goal is a piece that lingers.',
    deliverables: ['Assembly → final cut', 'Emotional pacing', 'Scene sound design', 'Final grade'],
  },
  {
    slug: 'sound-design',
    title: 'Sound Design',
    icon: 'AudioLines',
    summary: 'Atmospheres, foley, and mixes built from scratch to carry the story.',
    description:
      'Sound design and mixing built element by element — foley, atmospheres, and design layers that give a piece weight and space. Delivered mixed to reference loudness for clean playback everywhere.',
    deliverables: ['Sound design & foley', 'Dialogue cleanup', 'Final mix', 'Loudness delivery'],
  },
  {
    slug: 'color-grading',
    title: 'Color Grading',
    icon: 'Palette',
    summary: 'Grades built with intention — from log balance to a look with identity.',
    description:
      'Color grading from a neutral, balanced starting point up to a finished look — primaries, secondaries, power windows, and film emulation. Built node by node so every choice is deliberate.',
    deliverables: ['Shot balancing', 'Look development', 'Secondary color work', 'Film emulation & grain'],
  },
  {
    slug: 'motion-graphics',
    title: 'Motion Graphics',
    icon: 'Shapes',
    summary: 'Restrained, typographic motion design that supports the story, never distracts.',
    description:
      'Titles, lower-thirds, and callouts designed as a coherent system — precise, typographic, and animated on long, intentional curves. Nothing bounces; everything settles.',
    deliverables: ['Title & end cards', 'Lower-thirds / callouts', 'Reusable kit', 'Animated logo'],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
