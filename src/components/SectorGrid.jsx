import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { APPLICATIONS, getSectorPhoto } from '../data/applications.jsx'

/**
 * SectorGrid — todos os segmentos visíveis de uma vez (sem carrossel).
 * Foto do setor em duotone teal que resolve para cor no hover. Sem etiquetas:
 * apenas a foto, o nome e uma seta discreta. Minimalista e na cor da marca.
 */
export default function SectorGrid() {
  return (
    <div className="sg">
      {APPLICATIONS.map((a) => (
        <Link
          key={a.slug}
          to={`/aplicacoes/${a.slug}`}
          className="sg-card"
          aria-label={a.name}
          style={{
            '--p': `url("${getSectorPhoto(a.slug, 700)}")`,
            '--pf': `url("/_fallback/sector-${a.slug}.jpg")`
          }}
        >
          <span className="sg-card-photo" aria-hidden="true" />
          <span className="sg-card-veil" aria-hidden="true" />
          <span className="sg-card-foot">
            <span className="sg-card-name">{a.short || a.name}</span>
            <span className="sg-card-go" aria-hidden="true"><ArrowUpRight size={16} /></span>
          </span>
        </Link>
      ))}
    </div>
  )
}
