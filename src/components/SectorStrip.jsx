import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getSectorPhoto } from '../data/applications.jsx'

/**
 * SectorStrip — faixa de setores com foto em duotone teal (assinatura do site).
 * Substitui as antigas "chips" de texto nas páginas de Separadoras e Centrífugas.
 * Recebe [{ name, slug }] e resolve a foto do setor automaticamente.
 */
export default function SectorStrip({ sectors = [] }) {
  return (
    <div className="secstrip" style={{ '--n': sectors.length }}>
      {sectors.map((s) => (
        <Link
          key={s.slug}
          to={`/aplicacoes/${s.slug}`}
          className="secstrip-card"
          aria-label={`Ver setor ${s.name}`}
          style={{
            '--p': `url("${getSectorPhoto(s.slug, 600)}")`
          }}
        >
          <span className="secstrip-photo" aria-hidden="true" />
          <span className="secstrip-veil" aria-hidden="true" />
          <span className="secstrip-foot">
            <span className="secstrip-name">{s.name}</span>
            <span className="secstrip-go" aria-hidden="true"><ArrowUpRight size={15} /></span>
          </span>
        </Link>
      ))}
    </div>
  )
}
