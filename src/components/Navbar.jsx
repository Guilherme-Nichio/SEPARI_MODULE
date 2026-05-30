import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown, User, Package, ShoppingCart, LogOut, Shield,
  Settings, Layers, ArrowRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState(null)
  const userMenuRef = useRef(null)
  const { user, profile, isAuthenticated, isAdmin, signOut } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Threshold mais alto e debounce-style com requestAnimationFrame
    // para evitar "tremor" quando passa pela borda
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 80)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMobileDropdown(null)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Travar scroll do body quando o menu mobile abrir
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const displayName = profile?.full_name?.split(' ')[0] || profile?.company_name || user?.email?.split('@')[0] || 'Conta'
  const avatarLetter = (displayName || 'C').charAt(0).toUpperCase()

  return (
    <div className={`navbar-wrapper navbar-v3 ${scrolled ? 'scrolled-wrap' : ''}`}>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="logo" aria-label="Página inicial Separi">
          <img src="/logo.png" alt="Separi" />
        </Link>

        <div className={`nav-links ${open ? 'active' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/sobre" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Sobre</NavLink>

          <div className={`dropdown ${mobileDropdown === 'serv' ? 'active' : ''}`}>
            <span
              className={`nav-item ${location.pathname === '/servicos' ? 'active' : ''}`}
              onClick={() => setMobileDropdown(mobileDropdown === 'serv' ? null : 'serv')}
            >
              Serviços <ChevronDown size={14} />
            </span>
            <div className="dropdown-menu">
              <Link to="/servicos#preventiva">Manutenção Preventiva</Link>
              <Link to="/servicos#revisao">Revisão Geral (Major)</Link>
              <Link to="/servicos#campo-oficina">Campo & Oficina</Link>
              <Link to="/servicos#beneficios">Benefícios</Link>
            </div>
          </div>

          <div className={`dropdown ${mobileDropdown === 'equip' ? 'active' : ''}`}>
            <span
              className={`nav-item ${location.pathname === '/equipamentos' ? 'active' : ''}`}
              onClick={() => setMobileDropdown(mobileDropdown === 'equip' ? null : 'equip')}
            >
              Equipamentos <ChevronDown size={14} />
            </span>
            <div className="dropdown-menu">
              <Link to="/equipamentos#recondicionados">Recondicionados</Link>
              <Link to="/equipamentos#locacao">Locação de Bowls</Link>
              <Link to="/equipamentos#automacao">Automação</Link>
              <Link to="/equipamentos#estoque">Disponíveis em Estoque</Link>
            </div>
          </div>

          {isAuthenticated && !isAdmin && (
            <>
              <NavLink to="/pecas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                Peças
              </NavLink>
              <NavLink to="/perfil" className={({ isActive }) => `nav-item ${isActive || location.pathname.startsWith('/perfil') ? 'active' : ''}`}>
                Minhas Máquinas
              </NavLink>
            </>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated && !isAdmin && itemCount > 0 && (
            <Link to="/cotacao" className="navbar-cart desktop-only" title="Minha cotação" aria-label={`Cotação com ${itemCount} item(ns)`}>
              <ShoppingCart size={18} />
              <span className="navbar-cart-badge">{itemCount}</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="user-menu-relative" ref={userMenuRef}>
              <button
                className="user-badge"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                <span className="user-avatar">{avatarLetter}</span>
                <span className="user-badge-name">{displayName}</span>
                <ChevronDown size={14} />
              </button>

              <div className={`user-menu ${userMenuOpen ? 'open' : ''}`} role="menu">
                <div className="user-menu-header">
                  <div className="user-menu-name">{profile?.full_name || displayName}</div>
                  <div className="user-menu-email">{user?.email}</div>
                </div>

                {isAdmin ? (
                  <>
                    <Link to="/admin" className="user-menu-item"><Shield size={16} /> Painel Administrativo</Link>
                    <Link to="/admin/pecas" className="user-menu-item"><Package size={16} /> Gerenciar Peças</Link>
                    <Link to="/admin/kits" className="user-menu-item"><Layers size={16} /> Gerenciar Kits</Link>
                    <Link to="/admin/usuarios" className="user-menu-item"><User size={16} /> Gerenciar Usuários</Link>
                  </>
                ) : (
                  <>
                    <Link to="/perfil" className="user-menu-item"><Settings size={16} /> Minhas Máquinas</Link>
                    <Link to="/pecas" className="user-menu-item"><Package size={16} /> Catálogo de Peças</Link>
                    <Link to="/cotacao" className="user-menu-item">
                      <ShoppingCart size={16} /> Minha Cotação
                      {itemCount > 0 && <span className="user-menu-item-badge">{itemCount}</span>}
                    </Link>
                    <Link to="/meus-pedidos" className="user-menu-item"><User size={16} /> Meus Pedidos</Link>
                  </>
                )}

                <div className="user-menu-divider" />
                <button onClick={handleSignOut} className="user-menu-item danger" role="menuitem">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm desktop-only">Entrar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Cadastrar</Link>
            </>
          )}

          <button
            className={`menu-toggle ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </nav>
    </div>
  )
}
