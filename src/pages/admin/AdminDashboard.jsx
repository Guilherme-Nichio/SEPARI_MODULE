import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useLocation, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Settings, Package, FileText, Users,
  Layers, BarChart3, Menu, X, Wrench, Droplet,
  LogOut, ExternalLink, ChevronLeft
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AdminHome from './AdminHome'
import AdminMachines from './AdminMachines'
import AdminMachineDetail from './AdminMachineDetail'
import AdminParts from './AdminParts'
import AdminKits from './AdminKits'
import AdminServices from './AdminServices'
import AdminModels from './AdminModels'
import AdminAssemblies from './AdminAssemblies'
import AdminApplications from './AdminApplications'
import AdminUsers from './AdminUsers'
import AdminQuotes from './AdminQuotes'
import AdminQuoteDetail from './AdminQuoteDetail'
import AdminReports from './AdminReports'

const sectionInfo = {
  '/admin': { title: 'Visão Geral', sub: 'Resumo do sistema e atividade recente' },
  '/admin/maquinas': { title: 'Aprovação de Máquinas', sub: 'Aprove ou rejeite máquinas cadastradas por clientes' },
  '/admin/pecas': { title: 'Catálogo de Peças', sub: 'Adicione, edite e remova peças' },
  '/admin/kits': { title: 'Kits / Revisão Preventiva', sub: 'Monte kits com peças e/ou serviços e preço calculado com ajuste em % ou R$' },
  '/admin/servicos': { title: 'Catálogo de Serviços', sub: 'Cadastre serviços (manutenção, balanceamento, instalação), avulsos ou usados em kits' },
  '/admin/modelos': { title: 'Modelos de Máquinas', sub: 'Gerencie os modelos disponíveis para cadastro' },
  '/admin/conjuntos': { title: 'Conjuntos Mecânicos', sub: 'Categorize peças e seções da máquina' },
  '/admin/aplicacoes': { title: 'Aplicações', sub: 'Segmentos / produtos processados' },
  '/admin/cotacoes': { title: 'Pedidos de Cotação', sub: 'Responda aos pedidos dos clientes' },
  '/admin/usuarios': { title: 'Usuários', sub: 'Gerencie acesso e permissões' },
  '/admin/relatorios': { title: 'Relatórios', sub: 'Métricas e análises' }
}

export default function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [openQuotesCount, setOpenQuotesCount] = useState(0)

  useEffect(() => {
    loadBadgeCounts()
    const id = setInterval(loadBadgeCounts, 30000)
    return () => clearInterval(id)
  }, [location.pathname])

  const loadBadgeCounts = async () => {
    const [{ count: pm }, { count: oq }] = await Promise.all([
      supabase.from('user_machines').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'open')
    ])
    setPendingCount(pm || 0)
    setOpenQuotesCount(oq || 0)
  }

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navGroups = [
    {
      label: 'Painel',
      items: [
        { to: '/admin', label: 'Visão Geral', icon: <LayoutDashboard size={18} />, end: true }
      ]
    },
    {
      label: 'Operações',
      items: [
        { to: '/admin/maquinas', label: 'Aprovação de Máquinas', icon: <Settings size={18} />, badge: pendingCount },
        { to: '/admin/cotacoes', label: 'Pedidos de Cotação', icon: <FileText size={18} />, badge: openQuotesCount }
      ]
    },
    {
      label: 'Catálogo',
      items: [
        { to: '/admin/pecas', label: 'Catálogo de Peças', icon: <Package size={18} /> },
        { to: '/admin/servicos', label: 'Catálogo de Serviços', icon: <Wrench size={18} /> },
        { to: '/admin/kits', label: 'Kits / Revisão Preventiva', icon: <Layers size={18} /> },
        { to: '/admin/modelos', label: 'Modelos de Máquinas', icon: <Layers size={18} /> },
        { to: '/admin/conjuntos', label: 'Conjuntos Mecânicos', icon: <Wrench size={18} /> },
        { to: '/admin/aplicacoes', label: 'Aplicações', icon: <Droplet size={18} /> }
      ]
    },
    {
      label: 'Gestão',
      items: [
        { to: '/admin/usuarios', label: 'Usuários', icon: <Users size={18} /> },
        { to: '/admin/relatorios', label: 'Relatórios', icon: <BarChart3 size={18} /> }
      ]
    }
  ]

  const current = (() => {
    if (sectionInfo[location.pathname]) return sectionInfo[location.pathname]
    if (location.pathname.startsWith('/admin/maquinas/')) {
      return { title: 'Detalhes da Máquina', sub: 'Aprovar ou rejeitar cadastro' }
    }
    if (location.pathname.startsWith('/admin/cotacoes/')) {
      return { title: 'Detalhes da Cotação', sub: 'Responder ao cliente' }
    }
    return sectionInfo['/admin']
  })()

  const adminName = profile?.full_name || profile?.company_name || user?.email?.split('@')[0] || 'Administrador'
  const adminInitial = (adminName || 'A').charAt(0).toUpperCase()

  return (
    <div className="admin-shell">
      {/* Overlay para fechar a sidebar no mobile */}
      <div
        className={`admin-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ───────────── SIDEBAR ───────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <Link to="/" title="Voltar ao site">
            <img src="/logo.png" alt="Separi" />
          </Link>
          <span className="admin-sidebar-brand-tag">Admin</span>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-sidebar-scroll">
          {navGroups.map(group => (
            <div key={group.label} className="admin-nav-group">
              <div className="admin-sidebar-cat">{group.label}</div>
              <nav className="admin-nav">
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge > 0 && <span className="admin-nav-badge">{item.badge}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Rodapé da sidebar: usuário + ações */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-user-avatar">{adminInitial}</div>
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-name">{adminName}</div>
              <div className="admin-sidebar-user-role">Administrador</div>
            </div>
          </div>
          <div className="admin-sidebar-footer-actions">
            <Link to="/" className="admin-footer-btn">
              <ExternalLink size={15} /> Ver site
            </Link>
            <button onClick={handleSignOut} className="admin-footer-btn danger">
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* ───────────── MAIN ───────────── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <div className="admin-topbar-title">
              <h1>{current.title}</h1>
              <p>{current.sub}</p>
            </div>
          </div>
          <div className="admin-topbar-right">
            <Link to="/" className="admin-topbar-link">
              <ChevronLeft size={15} /> Voltar ao site
            </Link>
            <div className="admin-topbar-user" title={user?.email || ''}>
              <span className="admin-topbar-user-avatar">{adminInitial}</span>
              <span className="admin-topbar-user-name">{adminName}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="maquinas" element={<AdminMachines />} />
            <Route path="maquinas/:id" element={<AdminMachineDetail />} />
            <Route path="pecas" element={<AdminParts />} />
            <Route path="kits" element={<AdminKits />} />
            <Route path="servicos" element={<AdminServices />} />
            <Route path="modelos" element={<AdminModels />} />
            <Route path="conjuntos" element={<AdminAssemblies />} />
            <Route path="aplicacoes" element={<AdminApplications />} />
            <Route path="cotacoes" element={<AdminQuotes />} />
            <Route path="cotacoes/:id" element={<AdminQuoteDetail />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="relatorios" element={<AdminReports />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
