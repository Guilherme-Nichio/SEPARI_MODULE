import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { APPLICATIONS, getAppMedia, getSectorPhoto } from '../data/applications.jsx'

/**
 * SectorBands — paralelogramas full-bleed (canto a canto), 5 por linha.
 * Cada setor recebe uma FOTO real e relevante (Pexels, livre de direitos
 * autorais) com fallback local em /public/_fallback/sector-<slug>.jpg.
 * Para usar SUA foto: /public/aplicacoes/<slug>-hero.jpg (tem prioridade).
 */
const localPhoto = (slug) => `/_fallback/sector-${slug}.jpg`

export default function SectorBands() {
  return (
    <div className="sector-bands" role="list">
      {APPLICATIONS.map((a) => {
        const media = getAppMedia(a.slug)
        const localOverride = media.hero ? `url("${media.hero}")` : 'none'
        const web = getSectorPhoto(a.slug)
        return (
          <Link
            key={a.slug}
            to={`/aplicacoes/${a.slug}`}
            className="sector-band"
            role="listitem"
            style={{
              '--img-local': localOverride,
              '--img-web': web ? `url("${web}")` : 'none',
              '--img-photo': `url("${localPhoto(a.slug)}")`
            }}
          >
            <span className="sector-band-img" aria-hidden="true" />
            <span className="sector-band-shade" aria-hidden="true" />
            <span className="sector-band-inner">
              <span className="sector-band-name">{a.short || a.name}</span>
              <span className="sector-band-cta">
                Ver setor <ArrowUpRight size={15} />
              </span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
