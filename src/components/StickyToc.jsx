import { useEffect, useState } from 'react'

/**
 * StickyToc — sumário lateral fixo com trilho de progresso (scrollspy).
 *
 * items: [{ id, label, desc }]
 *  - destaca a seção visível (IntersectionObserver)
 *  - marca como "concluídas" as seções já passadas (trilho preenchido)
 *  - scroll suave ao clicar, compensando a navbar fixa
 *
 * Fica grudado (position: sticky via CSS) enquanto o conteúdo rola ao lado.
 */
export default function StickyToc({ items = [], heading = 'Conteúdo' }) {
  const [activeId, setActiveId] = useState(items[0]?.id || null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const sections = items.map(i => document.getElementById(i.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.15, 0.4, 0.75, 1] }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 92
    window.scrollTo({ top: y, behavior: 'smooth' })
    setActiveId(id)
  }

  if (!items.length) return null

  const activeIndex = Math.max(0, items.findIndex(i => i.id === activeId))
  const progress = items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0

  return (
    <nav className="svc-toc-nav" aria-label="Sumário desta página">
      <div className="svc-toc-heading">{heading}</div>

      <ol className="svc-toc-list" style={{ '--toc-progress': `${progress}%` }}>
        {items.map((it, i) => {
          const state = i === activeIndex ? 'active' : i < activeIndex ? 'done' : 'upcoming'
          return (
            <li key={it.id} className={`svc-toc-item is-${state}`}>
              <a
                href={`#${it.id}`}
                className="svc-toc-link"
                onClick={(e) => handleClick(e, it.id)}
                aria-current={state === 'active' ? 'true' : undefined}
              >
                <span className="svc-toc-marker">
                  <span className="svc-toc-marker-dot" />
                </span>
                <span className="svc-toc-body">
                  <span className="svc-toc-label">{it.label}</span>
                  {it.desc && <span className="svc-toc-desc">{it.desc}</span>}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
