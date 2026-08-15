import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * HeroSplit — texto fixo à esquerda; à direita um painel que cicla por várias
 * cenas (mesmo estilo). Cada cena mostra apenas o NOME e um botão de CTA.
 * O painel não usa imagem: indica o caminho onde a foto deve entrar.
 */
const SCENES = [
  { key: 'recond',  name: 'Recondicionamento integral', cta: 'Ver equipamentos', to: '/equipamentos', path: '/public/home/recond.jpg' },
  { key: 'pecas',   name: 'Catálogo de peças',          cta: 'Acessar catálogo',  to: '/pecas',        path: '/public/home/pecas.jpg' },
  { key: 'campo',   name: 'Serviço de campo e oficina', cta: 'Conhecer serviços', to: '/servicos',     path: '/public/home/campo.jpg' },
  { key: 'setores', name: 'Setores atendidos',          cta: 'Ver setores',       to: '/produtos#aplicacoes', path: '/public/home/setores.jpg' }
]

export default function HeroSplit() {
  const { isAuthenticated, isAdmin } = useAuth()
  const accountHref = isAdmin ? '/admin' : '/perfil'

  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const t = useRef(null)
  useEffect(() => {
    if (paused) return
    t.current = setTimeout(() => setI((p) => (p + 1) % SCENES.length), 4200)
    return () => clearTimeout(t.current)
  }, [i, paused])

  const active = SCENES[i]

  return (
    <section className="hero-split">
      <div className="hero-split-grid-bg" aria-hidden="true" />
      <div className="hero-split-glow" aria-hidden="true" />

      <div className="container hero-split-inner">
        {/* ── Texto (fixo) ── */}
        <div className="hero-split-text">
          <h1 className="hero-split-title">
            Separamos<br />
            o melhor <span className="hero-split-title-accent">do resto.</span>
          </h1>

          <p className="hero-split-lead">
            Engenharia leal ao seu processo, não ao fabricante. Peças, recondicionamento
            e máquinas novas para centrífugas industriais e marítimas.
          </p>

          <div className="hero-split-ctas">
            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin/pecas' : '/pecas'} className="btn btn-primary btn-lg">
                Ver catálogo <ArrowRight size={17} />
              </Link>
            ) : (
              <Link to="/registro" className="btn btn-primary btn-lg">
                Criar conta gratuita <ArrowRight size={17} />
              </Link>
            )}
            <Link to="/equipamentos" className="btn btn-outline btn-lg">
              Ver equipamentos
            </Link>
          </div>
        </div>

        {/* ── Painel que cicla (nome + CTA) ── */}
        <div
          className="hero-split-visual"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="hero-split-panel">
            {/* foto da cena: entra sozinha quando o arquivo existir */}
            <img
              key={active.key}
              src={active.path.replace('/public', '')} alt="" loading="lazy"
              className="hero-split-photo-slot"
              onLoad={(e) => e.target.parentElement.classList.add('has-img')}
              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.remove('has-img') }}
            />
            {/* placeholder: caminho da imagem da cena */}
            <span className="hero-split-pathnote" aria-hidden="true">imagem: <code>{active.path}</code></span>

            {/* conteúdo que troca: só nome + botão */}
            {SCENES.map((s, idx) => (
              <div key={s.key} className={`hero-split-scene ${idx === i ? 'is-active' : ''}`}>
                <span className="hero-split-scene-name">{s.name}</span>
                <Link to={s.to} className="btn btn-primary hero-split-scene-cta" tabIndex={idx === i ? 0 : -1}>
                  {s.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}

            {/* dots */}
            <div className="hero-split-dots" role="tablist" aria-label="Destaques">
              {SCENES.map((s, idx) => (
                <button
                  key={s.key}
                  className={`hero-split-dot ${idx === i ? 'is-active' : ''}`}
                  onClick={() => setI(idx)}
                  aria-label={s.name}
                  aria-selected={idx === i}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
