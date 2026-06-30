import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense, Component } from 'react'
import Navbar from './components/Navbar'
import ClientNav from './components/ClientNav'
import Footer from './components/Footer'
import AdminRoute from './components/AdminRoute'
import CustomerRoute from './components/CustomerRoute'
import Seo from './components/Seo'

// Páginas públicas, eager (carregadas no primeiro paint)
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Páginas públicas secundárias, lazy
const Sobre          = lazy(() => import('./pages/Sobre'))
const Servicos       = lazy(() => import('./pages/Servicos'))
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
    telephone: '+55-19-3816-7640',
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

function Shell() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <Seo jsonLd={ORG_JSON_LD} />
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      {!isAdmin && <ClientNav />}
      <main className={isAdmin ? 'main-admin' : undefined}>
        <RouteErrorBoundary>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/equipamentos" element={<Equipamentos />} />
              <Route path="/produtos" element={<Equipamentos />} />
              <Route path="/produtos/separadoras" element={<Separadoras />} />
              <Route path="/produtos/centrifugas" element={<Centrifugas />} />
              <Route path="/maquinas" element={<MaquinasNovas />} />
              <Route path="/aplicacoes/:slug" element={<Aplicacao />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />

              {/* CLIENTE */}
              <Route path="/perfil" element={<CustomerRoute><Perfil /></CustomerRoute>} />
              <Route path="/perfil/maquinas/nova" element={<CustomerRoute><MaquinaNova /></CustomerRoute>} />
              <Route path="/perfil/maquinas/:id" element={<CustomerRoute><MinhaMaquinaDetalhe /></CustomerRoute>} />
              <Route path="/pecas" element={<Pecas />} />
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
      {!isAdmin && <Footer />}
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
