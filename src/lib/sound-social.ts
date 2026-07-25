import { supabase } from './supabase'

/**
 * Public sound interactions — likes + "request to use" — backed by Supabase.
 * Unlike the sound library editor (local-file, dev-only), these are visitor
 * actions that must work on the deployed site, so they go through Supabase with
 * anon-writable RLS. All calls degrade gracefully if the tables don't exist yet.
 */

/** Stable anonymous id for this browser, so a visitor likes a track only once. */
function voterId(): string {
  const KEY = 'zenn_voter'
  let v = localStorage.getItem(KEY)
  if (!v) {
    v = crypto.randomUUID()
    localStorage.setItem(KEY, v)
  }
  return v
}

/** Map of track id → like count (from the public sound_like_counts view). */
export async function fetchLikeCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('sound_like_counts').select('track_id, likes')
  if (error || !data) return {}
  const out: Record<string, number> = {}
  for (const r of data as { track_id: string; likes: number }[]) out[r.track_id] = r.likes
  return out
}

/** The set of track ids this browser has liked. */
export async function fetchMyLikes(): Promise<Set<string>> {
  const { data, error } = await supabase.from('sound_likes').select('track_id').eq('voter', voterId())
  if (error || !data) return new Set()
  return new Set((data as { track_id: string }[]).map((r) => r.track_id))
}

export async function setLike(trackId: string, liked: boolean): Promise<void> {
  if (liked) {
    // ignore duplicate-key errors (already liked)
    await supabase.from('sound_likes').insert({ track_id: trackId, voter: voterId() })
  } else {
    await supabase.from('sound_likes').delete().eq('track_id', trackId).eq('voter', voterId())
  }
}

export interface SongRequestInput {
  track_id: string
  track_title: string
  name: string
  email: string
  project: string
  message: string
}

export async function submitRequest(r: SongRequestInput): Promise<void> {
  const { error } = await supabase.from('song_requests').insert({
    track_id: r.track_id,
    track_title: r.track_title,
    name: r.name.trim(),
    email: r.email.trim(),
    project: r.project.trim() || null,
    message: r.message.trim() || null,
  })
  if (error) throw new Error(error.message)
}
