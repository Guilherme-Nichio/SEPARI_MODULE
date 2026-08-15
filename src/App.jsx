import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense, Component } from 'react'
import Navbar from './components/Navbar'
import ClientNav from './components/ClientNav'
import Footer from './components/Footer'
import AdminRoute from './components/AdminRoute'
import CustomerRoute from './components/CustomerRoute'
import Seo from './components/Seo'

// Páginas públicas, eager (carregadas no primeiro paint)
import NotFound from './pages/NotFound'

// ── SITE NOVO (design .tsx) ────────────────────────────────────────────────
// A Home é eager: é o primeiro paint e não pode piscar.
import HomePage from './site/pages/HomePage'
const ProdutosPage = lazy(() => import('./site/pages/ProdutosPage'))
const PecasPage    = lazy(() => import('./site/pages/PecasPage'))
const ServicosPage = lazy(() => import('./site/pages/ServicosPage'))
const SobrePage    = lazy(() => import('./site/pages/SobrePage'))
/* v3.14 — estoque de máquinas, segmentos e catálogo pós-login */
const EstoquePage         = lazy(() => import('./site/pages/EstoquePage'))
const EstoqueDetalhePage  = lazy(() => import('./site/pages/EstoqueDetalhePage'))
const SegmentosPage       = lazy(() => import('./site/pages/SegmentosPage'))
const SegmentoPage        = lazy(() => import('./site/pages/SegmentoPage'))
const CatalogoPage        = lazy(() => import('./site/pages/CatalogoPage'))

// Páginas antigas do site institucional, mantidas acessíveis por rota própria
const HomeLegado     = lazy(() => import('./pages/Home'))
const SobreLegado    = lazy(() => import('./pages/Sobre'))
const ServicosLegado = lazy(() => import('./pages/Servicos'))

// Páginas públicas secundárias, lazy
const Equipamentos   = lazy(() => import('./pages/Equipamentos'))
const Separadoras    = lazy(() => import('./pages/Separadoras'))
const Centrifugas    = lazy(() => import('./pages/Centrifugas'))
const MaquinasNovas  = lazy(() => import('./pages/MaquinasNovas'))
const Aplicacao      = lazy(() => import('./pages/Aplicacao'))
const Login          = lazy(() => import('./pages/Login'))
const Registro       = lazy(() => import('./pages/Registro'))
const EsqueciSenha   = lazy(() => import('./pages/EsqueciSenha'))
const RedefinirSenha = lazy(() => import('./pages/RedefinirSenha'))

// Páginas do cliente, lazy (não carregam se o user não logar)
const Perfil               = lazy(() => import('./pages/Perfil'))
const MaquinaNova          = lazy(() => import('./pages/MaquinaNova'))
const MinhaMaquinaDetalhe  = lazy(() => import('./pages/MinhaMaquinaDetalhe'))
const Pecas                = lazy(() => import('./pages/Pecas'))
const PartGuide            = lazy(() => import('./pages/PartGuide'))
const Fabricantes          = lazy(() => import('./pages/Fabricantes'))
const Fabricante           = lazy(() => import('./pages/Fabricante'))
const MaquinaResultado     = lazy(() => import('./pages/MaquinaResultado'))
const Cotacao              = lazy(() => import('./pages/Cotacao'))
const MeusPedidos          = lazy(() => import('./pages/MeusPedidos'))

// Admin, lazy (bundle separado: ~5K linhas só pra admin)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

import { CartProvider } from './contexts/CartContext'

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Separi',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://separi.com.br',
  logo: '/logo.png',
  description: 'Especialista em peças, recondicionamento e serviços de manutenção para centrífugas e separadores industriais.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'R. Augusto Poltronieri, 179 - Park Comercial de Indaiatuba',
    addressLocality: 'Indaiatuba',
    addressRegion: 'SP',
    postalCode: '13347-443',
    addressCountry: 'BR'
  },
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+55-19-97405-9048',
    contactType: 'customer service',
    availableLanguage: ['Portuguese', 'English']
  }],
  brand: ['Alfa Laval', 'GEA Westfalia', 'Tetra Pak', 'Seital'],
  areaServed: { '@type': 'Place', name: 'América Latina' }
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      let tries = 0
      let raf = 0
      const tryScroll = () => {
        let el = null
        try { el = document.querySelector(hash) } catch { el = null }
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        // a página pode estar carregando sob demanda (lazy): tenta de novo
        if (tries++ < 40) raf = window.setTimeout(tryScroll, 60)
      }
      raf = window.setTimeout(tryScroll, 60)
      return () => window.clearTimeout(raf)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

// Error Boundary, captura crashes em rotas e mostra fallback limpo
class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[RouteErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <section style={{ padding: '160px 20px 80px', minHeight: '70vh' }}>
          <div className="container">
            <div className="notice-card" style={{ maxWidth: 580, margin: '0 auto' }}>
              <h2 style={{ marginTop: 0 }}>Ops, algo deu errado.</h2>
              <p style={{ color: 'var(--text-light, #4a5a64)', marginBottom: 18 }}>
                Encontramos um erro ao carregar esta página. Tente recarregar, se persistir, fale com nossa equipe.
              </p>
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Recarregar página
              </button>
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}

function RouteLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40
    }}>
      <div className="loader" />
    </div>
  )
}

// Rotas servidas pelo design novo: elas trazem a própria nav e o próprio
// footer, então a Navbar/ClientNav/Footer da plataforma ficam de fora.
//
// v3.14: como agora existem rotas com parâmetro (/estoque/:slug e
// /segmentos/:slug), a lista virou lista de prefixos e a checagem virou uma
// função. `/` continua sendo comparação exata, senão pegaria o site inteiro.
const SITE_EXACT = ['/', '/produtos', '/pecas', '/servicos', '/sobre', '/catalogo']
const SITE_PREFIXES = ['/estoque', '/segmentos']

const isSiteRoute = (pathname) =>
  SITE_EXACT.includes(pathname) ||
  SITE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))

function Shell() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const isSite = isSiteRoute(pathname)
  const hideChrome = isAdmin || isSite

  return (
    <>
      <Seo jsonLd={ORG_JSON_LD} />
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      {!hideChrome && <ClientNav />}
      <main className={isAdmin ? 'main-admin' : isSite ? 'main-site' : undefined}>
        <RouteErrorBoundary>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* ── SITE NOVO ── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/produtos" element={<ProdutosPage />} />
              <Route path="/pecas" element={<PecasPage />} />
              <Route path="/servicos" element={<ServicosPage />} />
              <Route path="/sobre" element={<SobrePage />} />

              {/* ── v3.14: ESTOQUE DE MÁQUINAS E SEGMENTOS ── */}
              <Route path="/estoque" element={<EstoquePage />} />
              <Route path="/estoque/:slug" element={<EstoqueDetalhePage />} />
              <Route path="/segmentos" element={<SegmentosPage />} />
              <Route path="/segmentos/:slug" element={<SegmentoPage />} />
              {/* as antigas /aplicacoes/:slug continuam funcionando, agora
                  apontando para a página nova do segmento */}
              <Route path="/aplicacoes" element={<Navigate to="/segmentos" replace />} />

              {/* ── Páginas antigas, ainda acessíveis por endereço próprio ── */}
              <Route path="/home-legado" element={<HomeLegado />} />
              <Route path="/sobre-legado" element={<SobreLegado />} />
              <Route path="/servicos-legado" element={<ServicosLegado />} />
              <Route path="/equipamentos" element={<Equipamentos />} />
              <Route path="/produtos/separadoras" element={<Separadoras />} />
              <Route path="/produtos/centrifugas" element={<Centrifugas />} />
              <Route path="/maquinas" element={<MaquinasNovas />} />
              <Route path="/aplicacoes/:slug" element={<SegmentoPage />} />
              <Route path="/aplicacoes-legado/:slug" element={<Aplicacao />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />

              {/* CLIENTE */}
              <Route path="/perfil" element={<CustomerRoute><Perfil /></CustomerRoute>} />
              <Route path="/perfil/maquinas/nova" element={<CustomerRoute><MaquinaNova /></CustomerRoute>} />
              <Route path="/perfil/maquinas/:id" element={<CustomerRoute><MinhaMaquinaDetalhe /></CustomerRoute>} />
              {/* O catálogo com login mudou de /pecas para /catalogo, porque
                  /pecas agora é a página institucional nova. */}
              <Route path="/catalogo" element={<CustomerRoute><CatalogoPage /></CustomerRoute>} />
              {/* a versão antiga do catálogo continua acessível por endereço próprio */}
              <Route path="/catalogo-legado" element={<Pecas />} />
              <Route path="/pecas/catalogo" element={<Navigate to="/catalogo" replace />} />
              <Route path="/pecas/guia/:slug" element={<PartGuide />} />
              <Route path="/fabricantes" element={<Fabricantes />} />
              <Route path="/fabricantes/:slug" element={<Fabricante />} />
              <Route path="/maquina/:marca/:modelo" element={<MaquinaResultado />} />
              <Route path="/cotacao" element={<CustomerRoute><Cotacao /></CustomerRoute>} />
              <Route path="/meus-pedidos" element={<CustomerRoute><MeusPedidos /></CustomerRoute>} />

              {/* ADMIN */}
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>
      {!hideChrome && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  )
}
