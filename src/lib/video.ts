export type VideoProvider = 'youtube' | 'vimeo' | 'drive' | 'file'

/** Build an embed/playback URL for a provider + id (or direct file URL). */
export function embedUrl(provider: VideoProvider, id: string, autoplay = false): string {
  if (provider === 'file') return id // direct file URL
  if (provider === 'drive') {
    // Google Drive preview embeds ignore autoplay and use their own controls.
    return `https://drive.google.com/file/d/${id}/preview`
  }
  if (provider === 'vimeo') {
    return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0${autoplay ? '&autoplay=1' : ''}`
  }
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`
}

/** Public watch URL for a provider + id. */
export function watchUrl(provider: VideoProvider, id: string): string {
  if (provider === 'file') return id
  if (provider === 'drive') return `https://drive.google.com/file/d/${id}/view`
  return provider === 'vimeo'
    ? `https://vimeo.com/${id}`
    : `https://www.youtube.com/watch?v=${id}`
}

/** Human-readable provider name for "watch on…" links. */
export function providerName(provider: VideoProvider): string {
  if (provider === 'drive') return 'Google Drive'
  if (provider === 'vimeo') return 'Vimeo'
  if (provider === 'file') return 'Video'
  return 'YouTube'
}

/**
 * Parse a pasted video URL into a provider + id. Supports YouTube, Vimeo,
 * Google Drive, and direct file URLs (mp4/webm/etc, incl. Supabase storage).
 * Returns null if it can't recognise the URL.
 */
export function parseVideoUrl(url: string): { provider: VideoProvider; id: string } | null {
  const u = url.trim()
  if (!u) return null

  let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/)
  if (m) return { provider: 'youtube', id: m[1] }

  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (m) return { provider: 'vimeo', id: m[1] }

  m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (m) return { provider: 'drive', id: m[1] }
  m = u.match(/drive\.google\.com\/open\?id=([\w-]+)/)
  if (m) return { provider: 'drive', id: m[1] }

  if (/^https?:\/\/.+\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(u)) return { provider: 'file', id: u }
  if (/^https?:\/\/.+supabase\.co\/storage\//i.test(u)) return { provider: 'file', id: u }

  return null
}
