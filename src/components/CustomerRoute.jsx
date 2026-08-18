import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Bloqueia usuários NÃO autenticados (manda pra /login) E
 * bloqueia ADMINS (manda pra /admin), esta rota é só para clientes.
 *
 * Garante separação total: admins não podem cadastrar máquinas,
 * pedir cotação, ver "meus pedidos" ou ter perfil customer.
 */
export default function CustomerRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loader-wrap" style={{ minHeight: '60vh' }}>
        <div className="loader" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}
