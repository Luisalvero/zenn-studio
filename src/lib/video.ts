export type VideoProvider = 'youtube' | 'vimeo'

/** Build a privacy-friendly embed URL for a provider + video id. */
export function embedUrl(provider: VideoProvider, id: string, autoplay = false): string {
  if (provider === 'vimeo') {
    return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0${autoplay ? '&autoplay=1' : ''}`
  }
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`
}

/** Public watch URL for a provider + video id. */
export function watchUrl(provider: VideoProvider, id: string): string {
  return provider === 'vimeo'
    ? `https://vimeo.com/${id}`
    : `https://www.youtube.com/watch?v=${id}`
}
