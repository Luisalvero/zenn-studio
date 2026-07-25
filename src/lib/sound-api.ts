import type { SoundTrackRow } from '@/data/sound'

/**
 * Sound-library data access.
 * ---------------------------------------------------------------------------
 * The library is a static JSON asset at `/sound.data.json`. Reads work
 * everywhere (dev + deployed). Writes only work in local dev, where a Vite
 * middleware (see vite.config.ts) persists the file back into the repo — so
 * there's no login or database, and your edits ship with the site on deploy.
 */
const URL = `${import.meta.env.BASE_URL}sound.data.json`

export async function fetchTracks(): Promise<SoundTrackRow[]> {
  const res = await fetch(URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Couldn't load sound library (${res.status})`)
  return (await res.json()) as SoundTrackRow[]
}

/** Editing is local-dev only. Persists the whole library back to the JSON file. */
export const canEdit = import.meta.env.DEV

export async function saveTracks(tracks: SoundTrackRow[]): Promise<void> {
  if (!canEdit) throw new Error('Editing is only available when running the site locally (npm run dev).')
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tracks),
  })
  if (!res.ok) throw new Error(`Save failed (${res.status})`)
}
