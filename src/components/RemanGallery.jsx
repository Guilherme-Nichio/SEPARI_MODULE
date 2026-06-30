import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import WhatsAppIcon from './WhatsAppIcon'

/**
 * RemanGallery — galeria simples da linha recondicionada. Filtro por categoria
 * em texto (sem chips coloridos). Cada cartão: imagem da máquina, marca, modelo
 * e uma linha curta. Ação = botão circular de WhatsApp + barra "Entrar para cotar".
 */
const slugify = (s = '') =>
  s.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function MachineImg({ brand, model }) {
  const [ok, setOk] = useState(true)
  const path = `/produtos/reman/${slugify(brand + ' ' + model)}.png`
  return (
    <span className="rg-photo">
      {ok ? (
        <img
          src={path}
          alt={`${brand} ${model}`}
          loading="lazy"
          onError={() => setOk(false)}
        />
      ) : (
        <span className="rg-photo-ph">imagem: <code>/public{path}</code></span>
      )}
    </span>
  )
}

export default function RemanGallery({ tabs = [], whatsapp = '' }) {
  const [active, setActive] = useState('all')

  const machines = useMemo(() => {
    const out = []
    tabs.forEach((tab) => (tab.items || []).forEach((it) =>
      out.push({ ...it, category: tab.label, catKey: tab.key })))
    return out
  }, [tabs])

  const visible = active === 'all' ? machines : machines.filter((m) => m.catKey === active)
  const wa = (m) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Cotação remanufaturado ${m.brand || ''} ${m.model || ''}`.trim())}`

  return (
    <div className="rg">
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

      <div className="rg-grid">
        {visible.map((m, i) => (
          <article className="rg-card" key={`${m.catKey}-${i}`}>
            <MachineImg brand={m.brand} model={m.model} />
            <div className="rg-card-body">
              <span className="rg-card-cat">{m.category}</span>
              <span className="rg-card-brand">{m.brand}</span>
              <h3 className="rg-card-model">{m.model}</h3>
              <p className="rg-card-note">{m.note}</p>
            </div>
            <div className="rg-actions">
              <a
                className="rg-wa" href={wa(m)} target="_blank" rel="noopener noreferrer"
                aria-label={`Falar no WhatsApp sobre ${m.brand} ${m.model}`}
              >
                <WhatsAppIcon size={18} />
              </a>
              <Link to="/login" className="rg-bar">Entrar para cotar</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
