import { useEffect } from 'react'

/**
 * Componente leve de SEO, sem dependência externa (react-helmet etc).
 * Atualiza <title>, meta tags principais (description, og:*, twitter:*),
 * canonical e (opcionalmente) JSON-LD structured data.
 *
 * Uso:
 *   <Seo title="..." description="..." image="/foo.png" jsonLd={{...}} />
 */

const DEFAULT_IMAGE = '/og-cover.jpg'
const SITE_NAME = 'Separi'
const DEFAULT_TITLE = 'Separi, Peças, Equipamentos e Serviços para Centrífugas Industriais'
const DEFAULT_DESC = 'Especialista em peças OEM, recondicionamento, balanceamento dinâmico e serviços de manutenção para centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital.'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(id, data) {
  // Remove qualquer JSON-LD anterior com o mesmo id pra evitar duplicação
  document.head.querySelectorAll(`script[data-seo-id="${id}"]`).forEach(s => s.remove())
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-seo-id', id)
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

export default function Seo({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
  noIndex = false
}) {
  useEffect(() => {
    const finalTitle = title ? `${title}` : DEFAULT_TITLE
    const finalDesc = description || DEFAULT_DESC
    const finalImg = image || DEFAULT_IMAGE
    const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    document.title = finalTitle
    setMeta('description', finalDesc)
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph
    setMeta('og:title', finalTitle, 'property')
    setMeta('og:description', finalDesc, 'property')
    setMeta('og:type', type, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')
    setMeta('og:image', finalImg, 'property')
    setMeta('og:url', finalUrl, 'property')
    setMeta('og:locale', 'pt_BR', 'property')

    // Twitter
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', finalTitle)
    setMeta('twitter:description', finalDesc)
    setMeta('twitter:image', finalImg)

    // Canonical
    setLink('canonical', finalUrl)

    // Structured data
    if (jsonLd) setJsonLd('page', jsonLd)
    return () => { setJsonLd('page', null) }
  }, [title, description, image, url, type, noIndex, JSON.stringify(jsonLd || {})])

  return null
}
