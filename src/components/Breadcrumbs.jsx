import { Link } from 'react-router-dom'
import { ChevronRight, Home as HomeIcon } from 'lucide-react'

/**
 * Breadcrumbs reutilizável.
 *
 * Uso:
 *   <Breadcrumbs items={[
 *     { label: 'Catálogo', to: '/pecas' },
 *     { label: 'Transmissão Vertical' },        // último, sem `to`, é o atual
 *   ]} />
 *
 * O "Início" é injetado automaticamente. Passe `showHome={false}` se não quiser.
 */
export default function Breadcrumbs({ items = [], showHome = true, homeHref = '/' }) {
  const all = showHome
    ? [{ label: 'Início', to: homeHref, isHome: true }, ...items]
    : items

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      {all.map((it, idx) => {
        const isLast = idx === all.length - 1
        return (
          <span key={idx} className="breadcrumbs-segment">
            {idx > 0 && <ChevronRight size={13} className="breadcrumbs-sep" aria-hidden="true" />}
            {isLast || !it.to ? (
              <span className="breadcrumbs-current" aria-current={isLast ? 'page' : undefined}>
                {it.isHome && <HomeIcon size={13} style={{ marginRight: 4, verticalAlign: -2 }} />}
                {it.label}
              </span>
            ) : (
              <Link to={it.to} className="breadcrumbs-link">
                {it.isHome && <HomeIcon size={13} style={{ marginRight: 4, verticalAlign: -2 }} />}
                {it.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
