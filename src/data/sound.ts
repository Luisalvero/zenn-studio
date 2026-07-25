/**
 * Sound-design portfolio types + playlist metadata.
 * ---------------------------------------------------------------------------
 * The actual track data lives in `sound.data.json`, fetched at runtime from
 * `/sound.data.json` (a static asset in prod; served + writable by a dev-only
 * Vite endpoint locally, which is how the admin Sound editor saves). This file
 * holds only the shapes and the fixed playlist definitions.
 */
export interface SoundTrack {
  id: string
  title: string
  description: string
  /** Playable audio URL. Empty = not playable yet. */
  url: string
  duration?: string
}

export interface SoundPlaylist {
  id: string
  title: string
  description: string
  /** Two hex colors for the gradient cover. */
  colors: [string, string]
  tracks: SoundTrack[]
}

/** One row in sound.data.json — a flat track with its playlist + order. */
export interface SoundTrackRow {
  id: string
  title: string
  description: string
  url: string
  duration: string | null
  playlist: string
  sort_order: number
}

/** The fixed set of playlists (id, title, description, gradient). */
export const PLAYLIST_META: { id: string; title: string; description: string; colors: [string, string] }[] = [
  { id: 'beats-instrumentals', title: 'Beats & Instrumentals', description: 'Original beats and instrumental productions.', colors: ['#3b1d5e', '#c34a3e'] },
  { id: 'ambient-chill', title: 'Ambient & Chill', description: 'Atmospheric, downtempo, and dream-leaning pieces.', colors: ['#0b3d3a', '#1d6e5e'] },
  { id: 'vocals-voice', title: 'Vocals & Voice', description: 'Tracks built around vocals and vocal textures.', colors: ['#3a1a4a', '#8a4ac3'] },
  { id: 'remixes-covers', title: 'Remixes & Covers', description: 'Flips, remixes, and reimagined tracks.', colors: ['#1a2a52', '#4a6cc3'] },
  { id: 'game-audio', title: 'Game Audio', description: 'Themes, menu UI, and foley made for games.', colors: ['#12303a', '#2f9ab9'] },
  { id: 'sound-design-fx', title: 'Sound Design & FX', description: 'Designed textures, ambiences, and cues.', colors: ['#4a3410', '#b98a2f'] },
]

/** Group flat track rows into the fixed playlists, dropping empty playlists. */
export function groupTracks(rows: SoundTrackRow[]): SoundPlaylist[] {
  const ordered = [...rows].sort((a, b) => a.sort_order - b.sort_order)
  return PLAYLIST_META.map((meta) => ({
    ...meta,
    tracks: ordered
      .filter((r) => r.playlist === meta.id)
      .map<SoundTrack>((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        url: r.url,
        duration: r.duration ?? undefined,
      })),
  })).filter((p) => p.tracks.length > 0)
}
