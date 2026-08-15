import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'

/**
 * RemanGallery — lista da linha recondicionada em linhas horizontais:
 * imagem à esquerda, título + descrição + especificações à direita.
 * A linha inteira é clicável (abre a conversa de cotação no WhatsApp),
 * sem botões repetidos por cartão — só uma chamada única no final.
 */
const slugify = (s = '') =>
  s.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function RemanGallery({ tabs = [], whatsapp = '' }) {
  const [active, setActive] = useState('all')

  const machines = useMemo(() => {
    const out = []
    tabs.forEach((tab) => (tab.items || []).forEach((it) =>
      out.push({ ...it, category: tab.label, catKey: tab.key, fb: tab.fb })))
    return out
  }, [tabs])

  const visible = active === 'all' ? machines : machines.filter((m) => m.catKey === active)
  const wa = (m) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Cotação ${m.brand || ''} ${m.model || ''} recondicionada`.trim())}`

  return (
    <div className="rgl">
      <div className="rg-filters" role="tablist" aria-label="Categorias">
        <button
          type="button" role="tab" aria-selected={active === 'all'}
          className={`rg-filter ${active === 'all' ? 'is-active' : ''}`}
          onClick={() => setActive('all')}
        >Todas</button>
        {tabs.map((t) => (
          <button
            key={t.key} type="button" role="tab" aria-selected={active === t.key}
            className={`rg-filter ${active === t.key ? 'is-active' : ''}`}
            onClick={() => setActive(t.key)}
          >{t.label}</button>
        ))}
      </div>

      <div className="rgl-list">
        {visible.map((m, i) => (
          <a
            className="rgl-row"
            key={`${m.catKey}-${i}`}
            href={wa(m)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar ${m.brand} ${m.model} no WhatsApp`}
          >
            <span
              className="rgl-media"
              aria-hidden="true"
              style={{
                '--p': `url("/produtos/reman/${slugify(`${m.brand} ${m.model}`)}.png")`
              }}
            />
            <span className="rgl-body">
              <span className="rgl-brand">{m.brand}</span>
              <h3 className="rgl-model">{m.model}</h3>
              <p className="rgl-note">{m.note}</p>
              <span className="rgl-specs">
                <span className="rgl-spec">
                  <span className="rgl-spec-k">Categoria</span>
                  <span className="rgl-spec-v">{m.category}</span>
                </span>
                <span className="rgl-spec">
                  <span className="rgl-spec-k">Aplicação</span>
                  <span className="rgl-spec-v">{m.app}</span>
                </span>
                <span className="rgl-spec">
                  <span className="rgl-spec-k">Condição</span>
                  <span className="rgl-spec-v">Recondicionada · padrão OEM</span>
                </span>
              </span>
            </span>
            <span className="rgl-go" aria-hidden="true"><ArrowUpRight size={19} /></span>
          </a>
        ))}
      </div>

      <div className="rgl-cta">
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Quero consultar a linha recondicionada disponível')}`}
          target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg"
        >
          <WhatsAppIcon size={16} /> Consultar disponibilidade e prazos
        </a>
        <Link to="/login" className="rgl-cta-link">ou entre para cotar no catálogo</Link>
      </div>
    </div>
  )
}
