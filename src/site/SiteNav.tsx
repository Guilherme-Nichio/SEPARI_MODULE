/* ============================================================================
   src/site/SiteNav.tsx

   Markup idêntico ao <nav> das páginas HTML originais — mesmas classes, mesma
   ordem, mesmo SVG. A única diferença é que os <a> viraram <Link> e os
   <button> ganharam navegação.

   O visual (nav branca sobre hero escuro na Home/Produtos/Serviços, nav escura
   sobre fundo claro em Peças/Sobre) continua vindo do CSS de cada página, que
   está escopado em .sep-home / .sep-pecas / etc. Este componente não decide
   cor nenhuma.

   ── v77, responsividade ───────────────────────────────────────────────────
   Abaixo de 980px o CSS de cada página ja escondia `.nav_links` — mas não
   existia nada no lugar, então os links e os botões de conta ficavam
   inacessíveis no celular. Foi acrescentado um menu deslizante (drawer) com
   os MESMOS links e as MESMAS ações, sem tirar nada do que ja existia: o
   `.nav_in` original continua idêntico, o drawer é markup novo que so aparece
   via CSS abaixo do breakpoint (styles/v77-responsive.css).
   ========================================================================== */
import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavScrolled } from './hooks/siteHooks'
import { R } from './routes'
import { Logo, Wordmark } from './Media'
import { BRAND } from './assets'

/* Home, Produtos e Serviços abrem com hero escuro: a nav fica branca até o
   scroll passar de 40px. Nessas, a logo usa a variante clara enquanto está
   por cima do vídeo. Peças e Sobre já nascem com nav escura. */
const DARK_HERO: Record<SitePage, boolean> = {
  home: true, produtos: true, servicos: true, pecas: false, sobre: false,
  /* v3.14 — páginas novas: todas nascem com fundo claro */
  estoque: false, segmentos: false, catalogo: false,
}

export type SitePage =
  | 'home' | 'produtos' | 'pecas' | 'servicos' | 'sobre'
  /* v3.14 */
  | 'estoque' | 'segmentos' | 'catalogo'

/* A Home chamava o item de "Equipamentos"; as internas, de "Produtos".
   Mantido como estava em cada página para não mexer no conteúdo original. */
/* Itens da barra. A Home chamava o item de "Equipamentos"; as internas, de
   "Produtos". Mantido como estava em cada página para não mexer no conteúdo
   original — o que entrou de novo foi o item "Estoque". */
const BASE_LINKS = (produtosLabel: string) => [
  { label: 'Peças', to: R.pecas },
  { label: produtosLabel, to: R.produtos },
  { label: 'Estoque', to: R.estoque },
  { label: 'Serviços', to: R.servicos },
  { label: 'Sobre', to: R.sobre },
]

const LINKS: Record<SitePage, Array<{ label: string; to: string }>> = {
  home:           BASE_LINKS('Equipamentos'),
  produtos:       BASE_LINKS('Produtos'),
  pecas:          BASE_LINKS('Produtos'),
  servicos:       BASE_LINKS('Produtos'),
  sobre:          BASE_LINKS('Produtos'),
  estoque:        BASE_LINKS('Produtos'),
  segmentos:      BASE_LINKS('Produtos'),
  catalogo:       BASE_LINKS('Produtos'),
}

export default function SiteNav({ page }: { page: SitePage }) {
  const links = LINKS[page] ?? LINKS.pecas
  const scrolled = useNavScrolled(40)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  /* trocou de rota, fecha */
  useEffect(() => { setMenuOpen(false) }, [location.pathname, location.hash])

  /* Esc fecha, e o fundo para de rolar enquanto o menu esta aberto */
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = anterior
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  /* girou o aparelho ou voltou pro desktop: o drawer some sozinho */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 981px)')
    const onChange = () => { if (mq.matches) setMenuOpen(false) }
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const irPara = (to: string) => { setMenuOpen(false); navigate(to) }

  return (
    <>
    <nav id="nav" className={scrolled ? 'scrolled' : undefined}>
      <div className="nav_in">
        <Link className="brand" to={R.home} aria-label="Separi, página inicial">
          <Logo
            height={BRAND.heightNav}
            variant={DARK_HERO[page] && !scrolled ? 'light' : 'dark'}
          />
          <Wordmark />
        </Link>

        <div className="nav_links">
          {links.map((l) => (
            <Link key={l.label} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav_actions">
          {isAuthenticated ? (
            <>
              <button
                className="btn btn_enter"
                onClick={() => navigate(R.perfil)}
              >
                Minha conta
              </button>
              <button
                className="btn btn_solid"
                onClick={() => navigate(R.catalogo)}
              >
                Catálogo
              </button>
            </>
          ) : (
            <>
              <button className="btn btn_enter" onClick={() => navigate(R.login)}>
                Entrar
              </button>
              <button
                className="btn btn_solid"
                onClick={() => navigate(R.registro)}
              >
                Cadastrar
              </button>
            </>
          )}
        </div>

        {/* so aparece abaixo de 980px, ver v77-responsive.css */}
        <button
          type="button"
          className={`nav_burger${menuOpen ? ' is_open' : ''}`}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="sep-nav-drawer"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </nav>

      {/* ── MENU MOBILE ──────────────────────────────────────────────────
          Fica FORA do <nav> de proposito. A nav e `position: fixed` e, quando
          rolada, ganha `backdrop-filter` — e backdrop-filter transforma o
          elemento em bloco contêiner dos descendentes `fixed`. Dentro dela o
          drawer ficaria preso a altura da barra em vez de ocupar a tela. */}
      <div
        className={`nav_scrim${menuOpen ? ' is_open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        id="sep-nav-drawer"
        className={`nav_drawer${menuOpen ? ' is_open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegacao"
      >
        <div className="nav_drawer_head">
          <Link className="brand" to={R.home} onClick={() => setMenuOpen(false)}>
            <Logo height={BRAND.heightNav} variant="dark" />
            <Wordmark />
          </Link>
          <button
            type="button"
            className="nav_drawer_close"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          >
            &#10005;
          </button>
        </div>

        <div className="nav_drawer_links">
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav_drawer_actions">
          {isAuthenticated ? (
            <>
              <button className="btn btn_enter" onClick={() => irPara(R.perfil)}>
                Minha conta
              </button>
              <button className="btn btn_solid" onClick={() => irPara(R.catalogo)}>
                Catálogo
              </button>
            </>
          ) : (
            <>
              <button className="btn btn_enter" onClick={() => irPara(R.login)}>
                Entrar
              </button>
              <button className="btn btn_solid" onClick={() => irPara(R.registro)}>
                Cadastrar
              </button>
            </>
          )}
        </div>

        <div className="nav_drawer_foot">
          <a href={R.telefone}>+55 (19) 97405 9048</a>
          <a href={R.email}>vendas@separi.com.br</a>
        </div>
      </div>
    </>
  )
}
