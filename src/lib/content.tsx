import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import { siteConfig } from '@/config/site'

/**
 * Editable site content.
 * ---------------------------------------------------------------------------
 * The public site reads these values from Supabase (public read) and falls
 * back to the defaults below when nothing is set. The admin edits them. This
 * lets a few key strings change without a redeploy.
 */
export const CONTENT_DEFAULTS = {
  availability: siteConfig.availability,
  hero_line1: 'Crafting stories through',
  hero_line2: 'editing, sound, and color.',
  hero_paragraph: `I'm ${siteConfig.founder} — building ${siteConfig.name} one film at a time. Cinematic edits made with obsessive attention to pacing, atmosphere, and detail.`,
  about_intro: `I'm ${siteConfig.founder}, and ${siteConfig.name} is where I'm building a career in cinematic post-production. I care less about flashy effects and more about the quiet things — the length of a hold, the weight of a sound, the exact moment to cut.`,
  showreel_provider: siteConfig.showreel.provider as string,
  showreel_id: siteConfig.showreel.id,
}

export type ContentKey = keyof typeof CONTENT_DEFAULTS

interface ContentValue {
  get: (key: ContentKey) => string
  ready: boolean
}

const ContentContext = createContext<ContentValue>({
  get: (key) => CONTENT_DEFAULTS[key],
  ready: false,
})

export function ContentProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    supabase
      .from('site_content')
      .select('key, value')
      .then(({ data }) => {
        if (!active) return
        if (data) {
          const map: Record<string, string> = {}
          for (const row of data as { key: string; value: string | null }[]) {
            if (row.value != null && row.value !== '') map[row.key] = row.value
          }
          setOverrides(map)
        }
        setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  const get = (key: ContentKey) => overrides[key] ?? CONTENT_DEFAULTS[key]

  return <ContentContext.Provider value={{ get, ready }}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)
