import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, Users, Package, FileText, Settings, ArrowRight,
  CheckCircle2, Layers, Wrench, BarChart3, Plus, Droplet,
  TrendingUp, AlertCircle, Hash, Calendar
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const statusLabels = {
  open: 'Aberta',
  in_progress: 'Em análise',
  answered: 'Respondida',
  closed: 'Fechada'
}

export default function AdminHome() {
  const [stats, setStats] = useState({
    pendingMachines: 0,
    approvedMachines: 0,
    totalParts: 0,
    activeParts: 0,
    openQuotes: 0,
    inProgressQuotes: 0,
    totalQuotes: 0,
    answeredQuotes: 0,
    totalUsers: 0,
    totalKits: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentQuotes, setRecentQuotes] = useState([])
  const [recentMachines, setRecentMachines] = useState([])

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const [
        { count: pendingMachines },
        { count: approvedMachines },
        { count: totalParts },
        { count: activeParts },
        { count: openQuotes },
        { count: inProgressQuotes },
        { count: answeredQuotes },
        { count: totalQuotes },
        { count: totalUsers },
        { count: totalKits },
        { data: recentQ },
        { data: recentM }
      ] = await Promise.all([
        supabase.from('user_machines').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('user_machines').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('parts').select('*', { count: 'exact', head: true }),
        supabase.from('parts').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'answered'),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('kits').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('quote_requests')
          .select('*, user:user_id(full_name, company_name, email), quote_items(id)')
          .order('created_at', { ascending: false }).limit(6),
        supabase.from('user_machines')
          .select('*, machine_model:machine_models(brand, model), user:user_id(full_name, company_name)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }).limit(6)
      ])

      setStats({
        pendingMachines: pendingMachines || 0,
        approvedMachines: approvedMachines || 0,
        totalParts: totalParts || 0,
        activeParts: activeParts || 0,
        openQuotes: openQuotes || 0,
        inProgressQuotes: inProgressQuotes || 0,
        answeredQuotes: answeredQuotes || 0,
        totalQuotes: totalQuotes || 0,
        totalUsers: totalUsers || 0,
        totalKits: totalKits || 0
      })
      setRecentQuotes(recentQ || [])
      setRecentMachines(recentM || [])
    } catch (err) {
      console.error('AdminHome loadStats:', err)
    }
    setLoading(false)
  }

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>

  const fmtDate = (d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  const needsAttention = stats.pendingMachines + stats.openQuotes

  return (
    <>
      {/* Alerta de itens que precisam de atenção */}
      {needsAttention > 0 && (
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10), rgba(245, 158, 11, 0.04))',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 14,
          marginBottom: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.18)',
            color: '#b45309',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertCircle size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <strong style={{ color: '#92400e', fontSize: '0.96rem' }}>
              {needsAttention} {needsAttention === 1 ? 'item precisa' : 'itens precisam'} da sua atenção
            </strong>
            <div style={{ fontSize: '0.84rem', color: '#92400e', marginTop: 2 }}>
              {stats.pendingMachines > 0 && `${stats.pendingMachines} máquina${stats.pendingMachines > 1 ? 's' : ''} aguardando aprovação`}
              {stats.pendingMachines > 0 && stats.openQuotes > 0 && ' · '}
              {stats.openQuotes > 0 && `${stats.openQuotes} cotação${stats.openQuotes > 1 ? 'ões' : ''} aberta${stats.openQuotes > 1 ? 's' : ''} sem resposta`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {stats.pendingMachines > 0 && (
              <Link to="/admin/maquinas" className="btn btn-primary btn-sm">
                Revisar máquinas <ArrowRight size={14} />
              </Link>
            )}
            {stats.openQuotes > 0 && (
              <Link to="/admin/cotacoes" className="btn btn-outline btn-sm">
                Ver cotações <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI CARDS - números principais */}
      <div className="admin-section-title">
        <BarChart3 size={14} /> Indicadores principais
      </div>
      <div className="admin-kpi-grid">
        <Link
          to="/admin/maquinas"
          className={`admin-kpi ${stats.pendingMachines > 0 ? 'urgent' : ''}`}
        >
          <div className="admin-kpi-head">
            <div className="admin-kpi-label">Máquinas pendentes</div>
            <div className="admin-kpi-icon"><Clock size={18} /></div>
          </div>
          <div className="admin-kpi-value">{stats.pendingMachines}</div>
          <div className="admin-kpi-sub">
            {stats.approvedMachines} aprovadas no total
          </div>
          <div className="admin-kpi-action">
            Revisar fila <ArrowRight size={12} />
          </div>
        </Link>

        <Link
          to="/admin/cotacoes"
          className={`admin-kpi ${stats.openQuotes > 0 ? 'urgent' : ''}`}
        >
          <div className="admin-kpi-head">
            <div className="admin-kpi-label">Cotações abertas</div>
            <div className="admin-kpi-icon"><FileText size={18} /></div>
          </div>
          <div className="admin-kpi-value">{stats.openQuotes}</div>
          <div className="admin-kpi-sub">
            {stats.inProgressQuotes} em análise · {stats.answeredQuotes} respondidas
          </div>
          <div className="admin-kpi-action">
            Responder agora <ArrowRight size={12} />
          </div>
        </Link>

        <Link to="/admin/pecas" className="admin-kpi">
          <div className="admin-kpi-head">
            <div className="admin-kpi-label">Peças ativas</div>
            <div className="admin-kpi-icon"><Package size={18} /></div>
          </div>
          <div className="admin-kpi-value">{stats.activeParts}</div>
          <div className="admin-kpi-sub">
            {stats.totalParts} cadastradas · {stats.totalKits} kits
          </div>
          <div className="admin-kpi-action">
            Gerenciar catálogo <ArrowRight size={12} />
          </div>
        </Link>

        <Link to="/admin/usuarios" className="admin-kpi">
          <div className="admin-kpi-head">
            <div className="admin-kpi-label">Clientes cadastrados</div>
            <div className="admin-kpi-icon"><Users size={18} /></div>
          </div>
          <div className="admin-kpi-value">{stats.totalUsers}</div>
          <div className="admin-kpi-sub">
            {stats.totalQuotes} cotações no histórico
          </div>
          <div className="admin-kpi-action">
            Ver clientes <ArrowRight size={12} />
          </div>
        </Link>
      </div>

      {/* ATALHOS RÁPIDOS */}
      <div className="admin-section-title">
        <Plus size={14} /> Cadastrar rápido
      </div>
      <div className="admin-quick-actions">
        <Link to="/admin/pecas" className="admin-quick-action">
          <div className="admin-quick-action-icon"><Package size={18} /></div>
          Nova peça
        </Link>
        <Link to="/admin/servicos" className="admin-quick-action">
          <div className="admin-quick-action-icon"><Wrench size={18} /></div>
          Novo serviço
        </Link>
        <Link to="/admin/kits" className="admin-quick-action">
          <div className="admin-quick-action-icon"><Layers size={18} /></div>
          Novo kit
        </Link>
        <Link to="/admin/modelos" className="admin-quick-action">
          <div className="admin-quick-action-icon"><Settings size={18} /></div>
          Novo modelo de máquina
        </Link>
        <Link to="/admin/aplicacoes" className="admin-quick-action">
          <div className="admin-quick-action-icon"><Droplet size={18} /></div>
          Nova aplicação
        </Link>
        <Link to="/admin/relatorios" className="admin-quick-action">
          <div className="admin-quick-action-icon"><TrendingUp size={18} /></div>
          Ver relatórios
        </Link>
      </div>

      {/* RECENTES — máquinas + cotações lado a lado */}
      <div className="admin-section-title">
        <Calendar size={14} /> Atividade recente
      </div>
      <div className="admin-recent-grid">

        {/* Máquinas pendentes */}
        <div className="admin-recent-card">
          <div className="admin-recent-card-head">
            <h3>
              <Clock size={16} />
              Máquinas aguardando aprovação
            </h3>
            <Link to="/admin/maquinas" className="btn btn-ghost btn-xs">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="admin-recent-card-body">
            {recentMachines.length === 0 ? (
              <div className="admin-recent-empty">
                <CheckCircle2 size={32} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Nenhuma máquina pendente. Tudo em dia!
                </p>
              </div>
            ) : (
              recentMachines.map(m => (
                <Link
                  key={m.id}
                  to={`/admin/maquinas/${m.id}`}
                  className="admin-recent-row"
                >
                  <div className="admin-recent-row-main">
                    <div className="admin-recent-row-title">
                      {m.machine_model?.brand} {m.machine_model?.model}
                    </div>
                    <div className="admin-recent-row-sub">
                      {m.user?.company_name || m.user?.full_name || 'Cliente'}
                      {' · '}
                      <Hash size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
                      {m.serial_number}
                    </div>
                  </div>
                  <span className="status-badge status-pending">Pendente</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Cotações recentes */}
        <div className="admin-recent-card">
          <div className="admin-recent-card-head">
            <h3>
              <FileText size={16} />
              Cotações mais recentes
            </h3>
            <Link to="/admin/cotacoes" className="btn btn-ghost btn-xs">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="admin-recent-card-body">
            {recentQuotes.length === 0 ? (
              <div className="admin-recent-empty" style={{ color: 'var(--text-muted)' }}>
                <FileText size={32} style={{ color: 'var(--text-muted)' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Nenhuma cotação ainda.</p>
              </div>
            ) : (
              recentQuotes.map(q => (
                <Link
                  key={q.id}
                  to={`/admin/cotacoes/${q.id}`}
                  className="admin-recent-row"
                >
                  <div className="admin-recent-row-main">
                    <div className="admin-recent-row-title">
                      {q.user?.company_name || q.user?.full_name || q.user?.email || 'Cliente'}
                    </div>
                    <div className="admin-recent-row-sub">
                      {q.quote_items?.length || 0} {(q.quote_items?.length || 0) === 1 ? 'item' : 'itens'}
                      {' · '}
                      {fmtDate(q.created_at)}
                    </div>
                  </div>
                  <span className={`status-badge status-${q.status}`}>
                    {statusLabels[q.status]}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
