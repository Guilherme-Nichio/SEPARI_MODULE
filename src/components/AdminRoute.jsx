import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldAlert } from 'lucide-react'

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="loader-wrap" style={{ minHeight: '60vh' }}>
        <div className="loader" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (!isAdmin) {
    return (
      <section className="dashboard">
        <div className="container">
          <div className="notice-card" style={{ marginTop: '60px' }}>
            <div className="notice-card-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
              <ShieldAlert size={32} />
            </div>
            <h2>Acesso restrito</h2>
            <p>Esta área é exclusiva para administradores. Se você acredita que deveria ter acesso, entre em contato com nossa equipe.</p>
          </div>
        </div>
      </section>
    )
  }

  return children
}
