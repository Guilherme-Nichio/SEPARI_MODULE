import { NavLink, useLocation } from 'react-router-dom'
import { Settings, Package, ShoppingCart, FileText, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const CLIENT_ROUTE_PREFIXES = ['/perfil', '/pecas', '/cotacao', '/meus-pedidos']

/**
 * Barra de navegação secundária do cliente.
 * Aparece logo abaixo da navbar quando o cliente está logado E navegando
 * em uma das áreas de cliente. Garante que "onde estou / onde posso ir"
 * fique sempre visível.
 *
 * No mobile vira scroll horizontal automático.
 */
export default function ClientNav() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const { pathname } = useLocation()

  // Só mostra pra cliente autenticado em páginas de cliente
  if (!isAuthenticated || isAdmin) return null
  if (!CLIENT_ROUTE_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))) return null

  const items = [
    {
      to: '/perfil',
      label: 'Minhas Máquinas',
      icon: <Settings size={16} />,
      activeWhen: (p) => p === '/perfil' || p.startsWith('/perfil/')
    },
    {
      to: '/pecas',
      label: 'Catálogo',
      icon: <Package size={16} />,
      activeWhen: (p) => p === '/pecas' || p.startsWith('/pecas/')
    },
    {
      to: '/cotacao',
      label: 'Cotação',
      icon: <ShoppingCart size={16} />,
      activeWhen: (p) => p === '/cotacao',
      badge: itemCount
    },
    {
      to: '/meus-pedidos',
      label: 'Pedidos',
      icon: <FileText size={16} />,
      activeWhen: (p) => p === '/meus-pedidos'
    }
  ]

  return (
    <div className="client-nav">
      <div className="container">
        <div className="client-nav-scroller">
          {items.map(it => {
            const isActive = it.activeWhen(pathname)
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={`client-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="client-nav-icon">{it.icon}</span>
                <span className="client-nav-label">{it.label}</span>
                {it.badge > 0 && <span className="client-nav-badge">{it.badge}</span>}
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
