import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown, User, Package, ShoppingCart, LogOut, Shield,
  Settings, Layers, ArrowRight, BookOpen, Boxes
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
  }, [location.pathname, location.hash])

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
      {/* ── barra fina superior: atalhos diretos ── */}
      <div className="navbar-topstrip">
        <div className="navbar-topstrip-inner">
          <span className="navbar-topstrip-msg">Peças OEM e equivalentes para centrífugas e separadores industriais</span>
          <div className="navbar-topstrip-actions">
            <Link to={isAdmin ? '/admin/pecas' : '/pecas'} className="navbar-topstrip-cta">
              <BookOpen size={14} /> Ver catálogo <ArrowRight size={13} />
            </Link>
            <Link to="/maquinas" className="navbar-topstrip-cta navbar-topstrip-cta--alt">
              <Boxes size={14} /> Nossas máquinas <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="logo" aria-label="Página inicial Separi">
          <img src="/logo.png" alt="Separi" />
        </Link>

        <div className={`nav-links ${open ? 'active' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Home</NavLink>
          {!isAdmin && (
            <NavLink to="/pecas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Peças
            </NavLink>
          )}

          <div className={`dropdown ${mobileDropdown === 'equip' ? 'active' : ''}`}>
            <NavLink
              to="/produtos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Produtos
              <span
                className="nav-caret"
                role="button"
                tabIndex={-1}
                aria-label="Abrir submenu de Produtos"
                onClick={(e) => {
                  if (window.innerWidth <= 980) {
                    e.preventDefault()
                    e.stopPropagation()
                    setMobileDropdown(mobileDropdown === 'equip' ? null : 'equip')
                  }
                }}
              >
                <ChevronDown size={14} />
              </span>
            </NavLink>
            <div className="dropdown-menu mega-menu mega-menu--products">
              <div className="mega-inner">
                <div className="mega-head">
                  <span className="mega-eyebrow">Produtos</span>
                  <p className="mega-sub">Equipamentos de separação centrífuga e soluções para cada operação.</p>
                </div>
                <div className="mega-grid mega-grid--products">
                  <Link to="/produtos/separadoras" className="mega-item mega-item--media">
                    <span className="mega-thumb"><img src="/_fallback/separadora.jpg" alt="" loading="lazy" /></span>
                    <span className="mega-text">
                      <span className="mega-title">Separadoras</span>
                      <span className="mega-desc">Clarificação e separação líquido-líquido de alta rotação.</span>
                    </span>
                  </Link>
                  <Link to="/produtos/centrifugas" className="mega-item mega-item--media">
                    <span className="mega-thumb"><img src="/_fallback/centrifuga.jpg" alt="" loading="lazy" /></span>
                    <span className="mega-text">
                      <span className="mega-title">Centrífugas</span>
                      <span className="mega-desc">Decanters e centrífugas para sólidos em suspensão.</span>
                    </span>
                  </Link>
                  <Link to="/produtos#aplicacoes" className="mega-item mega-item--media">
                    <span className="mega-thumb"><img src="/_fallback/setores.jpg" alt="" loading="lazy" /></span>
                    <span className="mega-text">
                      <span className="mega-title">Setores atendidos</span>
                      <span className="mega-desc">Óleo &amp; gás, alimentos, energia, naval e muito mais.</span>
                    </span>
                  </Link>
                  <Link to="/produtos#automacao" className="mega-item mega-item--media">
                    <span className="mega-thumb"><img src="/_fallback/painel.jpg" alt="" loading="lazy" /></span>
                    <span className="mega-text">
                      <span className="mega-title">Automação</span>
                      <span className="mega-desc">Painéis e controle inteligente para a sua linha.</span>
                    </span>
                  </Link>
                  <Link to="/maquinas" className="mega-item mega-item--media">
                    <span className="mega-thumb"><img src="/_fallback/estoque.jpg" alt="" loading="lazy" /></span>
                    <span className="mega-text">
                      <span className="mega-title">Nossas máquinas</span>
                      <span className="mega-desc">Linha própria Separi de separadoras, clarificadoras e decanters novos.</span>
                    </span>
                  </Link>
                  <Link to="/produtos#bowls" className="mega-item mega-item--media">
                    <span className="mega-thumb"><img src="/_fallback/bowl.jpg" alt="" loading="lazy" /></span>
                    <span className="mega-text">
                      <span className="mega-title">Bowls e Locação</span>
                      <span className="mega-desc">Reposição de bowls e locação de equipamentos.</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={`dropdown ${mobileDropdown === 'serv' ? 'active' : ''}`}>
            <NavLink
              to="/servicos"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Serviços
              <span
                className="nav-caret"
                role="button"
                tabIndex={-1}
                aria-label="Abrir submenu de Serviços"
                onClick={(e) => {
                  // No mobile o caret abre o submenu; no desktop o clique navega
                  if (window.innerWidth <= 980) {
                    e.preventDefault()
                    e.stopPropagation()
                    setMobileDropdown(mobileDropdown === 'serv' ? null : 'serv')
                  }
                }}
              >
                <ChevronDown size={14} />
              </span>
            </NavLink>
            <div className="dropdown-menu mega-menu">
              <div className="mega-inner">
                <div className="mega-head">
                  <span className="mega-eyebrow">Serviços</span>
                  <p className="mega-sub">Manutenção especializada que mantém suas centrífugas em operação contínua.</p>
                </div>
                <div className="mega-grid">
                  <Link to="/servicos#preventiva" className="mega-item">
                    <span className="mega-text">
                      <span className="mega-title">Manutenção Preventiva</span>
                      <span className="mega-desc">Inspeções programadas que evitam paradas não planejadas.</span>
                    </span>
                    <ArrowRight className="mega-arrow" size={16} />
                  </Link>
                  <Link to="/servicos#revisao" className="mega-item">
                    <span className="mega-text">
                      <span className="mega-title">Revisão Geral (Major)</span>
                      <span className="mega-desc">Recondicionamento completo do equipamento ao estado de fábrica.</span>
                    </span>
                    <ArrowRight className="mega-arrow" size={16} />
                  </Link>
                  <Link to="/servicos#campo-oficina" className="mega-item">
                    <span className="mega-text">
                      <span className="mega-title">Campo & Oficina</span>
                      <span className="mega-desc">Atendimento on-site na sua planta ou na nossa oficina especializada.</span>
                    </span>
                    <ArrowRight className="mega-arrow" size={16} />
                  </Link>
                  <Link to="/servicos#beneficios" className="mega-item">
                    <span className="mega-text">
                      <span className="mega-title">Benefícios</span>
                      <span className="mega-desc">Por que um plano de manutenção Separi compensa no longo prazo.</span>
                    </span>
                    <ArrowRight className="mega-arrow" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <NavLink to="/sobre" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Sobre</NavLink>


          {isAuthenticated && !isAdmin && (
            <NavLink to="/perfil" className={({ isActive }) => `nav-item ${isActive || location.pathname.startsWith('/perfil') ? 'active' : ''}`}>
              Minhas Máquinas
            </NavLink>
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
