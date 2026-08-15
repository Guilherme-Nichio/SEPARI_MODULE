import { useState } from 'react'

/**
 * WorkshopProtocol — lista numerada à esquerda (clicável) + ficha à direita
 * que troca conforme a etapa. A ficha mostra uma IMAGEM no topo (dentro de uma
 * box) e, abaixo dela, o título e a descrição da etapa.
 */
export default function WorkshopProtocol({ steps }) {
  const [active, setActive] = useState(0)
  const cur = steps[active]
  const total = steps.length

  return (
    <div className="wp">
      <div className="wp-list" role="tablist" aria-label="Etapas do protocolo">
        {steps.map((s, i) => (
          <button
            key={i}
            className={`wp-item ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={i === active}
          >
            <span className="wp-item-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="wp-item-title">{s.title}</span>
            <span className="wp-item-bar" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="wp-sheet" role="tabpanel">
        {/* IMAGEM no topo (box) */}
        <div className="wp-sheet-media" key={`media-${active}`}>
          {cur.img && (
            <img
              src={cur.img}
              alt={cur.title}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}
          <div className="wp-sheet-media-ph">
            <span className="wp-sheet-media-ph-label">imagem:</span>
            <code>{cur.img || `/oficina/etapa-${active + 1}.jpg`}</code>
          </div>
          {cur.tag && <span className="wp-sheet-media-tag">{cur.tag}</span>}
        </div>

        {/* TEXTO abaixo da imagem */}
        <div className="wp-sheet-body">
          <div className="wp-sheet-top">
            <span className="wp-sheet-step">Etapa {active + 1} <i>/ {total}</i></span>
            <div className="wp-sheet-track" aria-hidden="true">
              {steps.map((_, i) => (
                <span key={i} className={`wp-seg ${i <= active ? 'is-on' : ''}`} />
              ))}
            </div>
          </div>
          <h3 className="wp-sheet-title">{cur.title}</h3>
          <p className="wp-sheet-desc">{cur.desc}</p>
        </div>
      </div>
    </div>
  )
}
