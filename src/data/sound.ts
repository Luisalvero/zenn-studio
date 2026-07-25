/**
 * Sound-design portfolio data.
 * ---------------------------------------------------------------------------
 * Playlists of audio work, shown in a Spotify-style UI. This is placeholder
 * data to demo the layout — real tracks (with descriptions + audio URLs) will
 * be populated from the AI analysis of your Drive folder, or entered manually.
 * `url` is the playable audio file; empty '' just disables playback for now.
 */
export interface SoundTrack {
  id: string
  title: string
  description: string
  /** Playable audio URL (Supabase Storage / direct link). Empty = not playable yet. */
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

export const soundPlaylists: SoundPlaylist[] = [
  {
    id: 'impacts',
    title: 'Impacts & Hits',
    description: 'Cinematic booms, risers, and stingers with weight.',
    colors: ['#3b1d5e', '#c34a3e'],
    tracks: [
      { id: 'imp-1', title: 'Sub Boom 01', description: 'Deep sub-heavy impact with a slow tail.', url: '', duration: '0:06' },
      { id: 'imp-2', title: 'Metal Stinger', description: 'Sharp metallic hit into a ringing decay.', url: '', duration: '0:04' },
      { id: 'imp-3', title: 'Riser to Impact', description: 'Tension riser resolving on a chest-hitting boom.', url: '', duration: '0:09' },
    ],
  },
  {
    id: 'atmospheres',
    title: 'Atmospheres & Drones',
    description: 'Evolving textures and tension beds for scenes.',
    colors: ['#0b3d3a', '#1d6e5e'],
    tracks: [
      { id: 'atm-1', title: 'Cold Room Tone', description: 'A dim, uneasy room drone with faint movement.', url: '', duration: '0:22' },
      { id: 'atm-2', title: 'Signal Bed', description: 'Electronic texture layered from processed foley.', url: '', duration: '0:31' },
    ],
  },
  {
    id: 'whooshes',
    title: 'Whooshes & Transitions',
    description: 'Movement and transitions for cuts and reveals.',
    colors: ['#1a2a52', '#4a6cc3'],
    tracks: [
      { id: 'wh-1', title: 'Fast Pass-By', description: 'Tight whoosh with a doppler tail.', url: '', duration: '0:03' },
      { id: 'wh-2', title: 'Reverse Swell', description: 'Reversed swell building into a cut.', url: '', duration: '0:05' },
    ],
  },
  {
    id: 'foley',
    title: 'Foley & Textures',
    description: 'Recorded and processed foley, designed to detail.',
    colors: ['#4a3410', '#b98a2f'],
    tracks: [
      { id: 'fol-1', title: 'Fabric Movement', description: 'Close, tactile cloth foley.', url: '', duration: '0:08' },
      { id: 'fol-2', title: 'Processed Water', description: 'Water foley pitched and stretched into texture.', url: '', duration: '0:14' },
    ],
  },
]
