export type VideoProvider = 'youtube' | 'vimeo' | 'drive'

/** Build a privacy-friendly embed URL for a provider + video id. */
export function embedUrl(provider: VideoProvider, id: string, autoplay = false): string {
  if (provider === 'drive') {
    // Google Drive preview embeds ignore autoplay and use their own controls.
    return `https://drive.google.com/file/d/${id}/preview`
  }
  if (provider === 'vimeo') {
    return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0${autoplay ? '&autoplay=1' : ''}`
  }
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`
}

/** Public watch URL for a provider + video id. */
export function watchUrl(provider: VideoProvider, id: string): string {
  if (provider === 'drive') return `https://drive.google.com/file/d/${id}/view`
  return provider === 'vimeo'
    ? `https://vimeo.com/${id}`
    : `https://www.youtube.com/watch?v=${id}`
}

/** Human-readable provider name for "watch on…" links. */
export function providerName(provider: VideoProvider): string {
  if (provider === 'drive') return 'Google Drive'
  if (provider === 'vimeo') return 'Vimeo'
  return 'YouTube'
}
