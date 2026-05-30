import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <section className="auth-page">
      <Seo title="404, Página não encontrada · Separi" noIndex />
      <div className="auth-card text-center">
        <h1 style={{ fontSize: '5rem', color: 'var(--teal-dark)', margin: 0 }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 12 }}>Página não encontrada</h2>
        <p className="auth-subtitle">A página que você está procurando não existe ou foi movida.</p>
        <Link to="/" className="btn btn-primary btn-block mt-20">
          <Home size={16} /> Voltar para Home
        </Link>
      </div>
    </section>
  )
}
