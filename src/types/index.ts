/**
 * Shared domain types for LA Productions.
 * Keeping these centralised lets the data files and components stay in sync.
 */

/** Categories used as project tags and portfolio filters. */
export type ProjectCategory =
  | 'Trailer'
  | 'Game Cinematic'
  | 'Sound Design'
  | 'Color Grading'
  | 'Motion Graphics'
  | 'Short Film'
  | 'Developer Log'
  | 'Documentary'
  | 'Horror'

export interface VideoEmbed {
  provider: 'youtube' | 'vimeo'
  /** The video ID only, not the full URL. Leave empty to show a placeholder. */
  id: string
}

/** A pair of stills used for before/after color-grade comparisons. */
export interface GradeComparison {
  before: string
  after: string
  label?: string
}

export interface ProjectImage {
  src: string
  alt: string
  /** Optional caption shown beneath the still. */
  caption?: string
}

export interface Project {
  /** URL-safe identifier used for the detail route. */
  slug: string
  title: string
  /** One-line hook shown on cards. */
  summary: string
  /** Personal framing — spec work / creative exploration. */
  kind: string
  year: string
  categories: ProjectCategory[]
  /** Card + hero thumbnail. Swap the placeholder for a real still later. */
  thumbnail: string
  /** Large hero image on the detail page. Falls back to thumbnail. */
  cover?: string
  video?: VideoEmbed
  /** Longer narrative fields for the detail page. */
  overview: string
  goals: string[]
  direction: string
  process: string
  software: string[]
  techniques: string[]
  soundNotes?: string
  motionNotes?: string
  gradeNotes?: string
  challenges: string
  lessons: string
  stills?: ProjectImage[]
  timelineStills?: ProjectImage[]
  gradeComparisons?: GradeComparison[]
  /** When true, appears in the homepage "Selected Work" preview. */
  featured?: boolean
}

export interface Service {
  slug: string
  title: string
  /** Lucide icon name, resolved in the component layer. */
  icon: string
  summary: string
  description: string
  deliverables: string[]
}

export interface ProcessStep {
  index: string
  title: string
  description: string
  detail: string
}
