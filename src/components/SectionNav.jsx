import { useState, useEffect, useRef } from 'react'

/**
 * SectionNav — sumário lateral fixo junto à margem. Aparece quando o conteúdo
 * entra em cena e some ao chegar na seção de dúvidas (stopSelector). Destaca a
 * seção ativa com a cor de marca.
 */
export default function SectionNav({ items, stopSelector = '.faq-section' }) {
  const [active, setActive] = useState(items[0]?.id)
  const [show, setShow] = useState(false)
  const obs = useRef(null)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean)
    obs.current = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    els.forEach((el) => obs.current.observe(el))

    const onScroll = () => {
      const first = document.getElementById(items[0]?.id)
      const stop = document.querySelector(stopSelector)
      const vh = window.innerHeight
      const startedIn = first && first.getBoundingClientRect().top < vh * 0.55
      const beforeStop = stop ? stop.getBoundingClientRect().top > vh * 0.45 : true
      setShow(Boolean(startedIn && beforeStop))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      obs.current?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items, stopSelector])

  const go = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={`sv-toc ${show ? 'is-on' : ''}`} aria-label="Sumário">
      <span className="sv-toc-label">Nesta página</span>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <button
              className={`sv-toc-link ${active === it.id ? 'is-active' : ''}`}
              onClick={() => go(it.id)}
            >
              <span className="sv-toc-dot" aria-hidden="true" />
              <span className="sv-toc-text">{it.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
