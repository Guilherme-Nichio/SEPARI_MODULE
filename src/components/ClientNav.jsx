import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Settings, Package, ShoppingCart, FileText, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const CLIENT_ROUTE_PREFIXES = ['/perfil', '/cotacao', '/meus-pedidos', '/catalogo-legado']

/**
 * Barra de navegação secundária do cliente.
 * Aparece logo abaixo da navbar quando o cliente está logado E navegando
 * em uma das áreas de cliente. Garante que "onde estou / onde posso ir"
 * fique sempre visível.
 *
 * No mobile vira scroll horizontal automático.
 */
export default function ClientNav() {
  const { isAuthenticated, isAdmin, signOut } = useAuth()
  const { itemCount } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  /* O "Sair" morava só no menu de usuário da navbar antiga. Como a área do
     cliente agora usa a barra do site (que não tem menu de usuário), o botão
     vem para cá — nenhuma função se perde no caminho. */
  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

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
      /* v3.14: o catálogo do cliente agora é /catalogo (design novo).
         /pecas passou a ser a página institucional pública. */
      to: '/catalogo',
      label: 'Catálogo',
      icon: <Package size={16} />,
      activeWhen: (p) => p === '/catalogo' || p.startsWith('/catalogo')
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

          <button
            type="button"
            className="client-nav-item client-nav-signout"
            onClick={handleSignOut}
          >
            <span className="client-nav-icon"><LogOut size={16} /></span>
            <span className="client-nav-label">Sair</span>
          </button>
        </div>
      </div>
    </div>
  )
}
