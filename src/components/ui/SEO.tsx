import { useEffect } from 'react'
import { siteConfig } from '@/config/site'

interface SEOProps {
  /** Page-specific title. Rendered as "Title — Zenn Studio" unless it is the home page. */
  title?: string
  description?: string
  /** Route path (e.g. "/portfolio") used to build the canonical + og:url. */
  path?: string
  image?: string
  /** og:type — "website" for pages, "article" for project detail pages. */
  type?: 'website' | 'article'
  /** When true, ask crawlers not to index (e.g. the 404 page). */
  noIndex?: boolean
}

/** Upsert a <meta> tag by attribute, creating it if missing. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Dependency-free document head manager for per-route SEO.
 * Base/social tags also live statically in index.html so non-JS crawlers still
 * get a complete card; this keeps the in-app title + meta correct per route.
 */
export function SEO({ title, description, path = '/', image, type = 'website', noIndex }: SEOProps) {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title
  const desc = description ?? siteConfig.description
  const url = `${siteConfig.url}${path}`
  const ogImage = image ?? `${siteConfig.url}/og-image.jpg`

  useEffect(() => {
    document.title = fullTitle

    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', ogImage)

    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', ogImage)

    setLink('canonical', url)
  }, [fullTitle, desc, url, type, ogImage, noIndex])

  return null
}
