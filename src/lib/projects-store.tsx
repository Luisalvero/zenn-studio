import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import { projects as fallbackProjects } from '@/data/projects'
import type { Project, ProjectCategory, VideoEmbed } from '@/types'

export interface ProjectRow {
  slug: string
  title: string
  summary: string
  kind: string
  year: string
  categories: string[] | null
  orientation: string | null
  video_provider: string | null
  video_id: string | null
  thumbnail: string | null
  preview_video: string | null
  collaborator_name: string | null
  collaborator_url: string | null
  overview: string | null
  featured: boolean | null
  sort_order: number | null
}

/** Map a DB row to the app's Project shape. */
export function rowToProject(r: ProjectRow): Project {
  const video: VideoEmbed | undefined = r.video_id
    ? { provider: (r.video_provider ?? 'youtube') as VideoEmbed['provider'], id: r.video_id }
    : undefined
  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary ?? '',
    kind: r.kind ?? '',
    year: r.year ?? '',
    categories: (r.categories ?? []) as ProjectCategory[],
    orientation: r.orientation === 'portrait' ? 'portrait' : 'landscape',
    thumbnail: r.thumbnail ?? '',
    previewVideo: r.preview_video ?? undefined,
    video,
    collaborator: r.collaborator_name
      ? { name: r.collaborator_name, url: r.collaborator_url ?? '' }
      : undefined,
    overview: r.overview ?? undefined,
    featured: r.featured ?? false,
  }
}

interface ProjectsValue {
  projects: Project[]
  loading: boolean
  reload: () => Promise<void>
}

const ProjectsContext = createContext<ProjectsValue>({
  projects: fallbackProjects,
  loading: false,
  reload: async () => {},
})

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [loading, setLoading] = useState(true)

  async function reload() {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error && data && data.length > 0) {
      setProjects((data as ProjectRow[]).map(rowToProject))
    } else {
      // No table yet / empty / error → keep the built-in projects.
      setProjects(fallbackProjects)
    }
    setLoading(false)
  }

  useEffect(() => {
    void reload()
  }, [])

  return (
    <ProjectsContext.Provider value={{ projects, loading, reload }}>{children}</ProjectsContext.Provider>
  )
}

export const useProjects = () => useContext(ProjectsContext)

export function getBySlug(list: Project[], slug: string): Project | undefined {
  return list.find((p) => p.slug === slug)
}

export function getAdjacent(list: Project[], slug: string): { prev: Project | null; next: Project | null } {
  const i = list.findIndex((p) => p.slug === slug)
  if (i === -1 || list.length <= 1) return { prev: null, next: null }
  return {
    prev: i > 0 ? list[i - 1] : list[list.length - 1],
    next: i < list.length - 1 ? list[i + 1] : list[0],
  }
}
