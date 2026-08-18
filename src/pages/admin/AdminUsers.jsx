import { useEffect, useMemo, useState } from 'react'
import {
  Search, Users, ShieldCheck, ShieldOff, Trash2,
  Mail, Building2, Phone, MapPin, Calendar, Settings,
  FileText, Eye, EyeOff, X, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminUsers() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [machineCounts, setMachineCounts] = useState({})
  const [quoteCounts, setQuoteCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [detail, setDetail] = useState(null)

  // Estados para o modal de segurança (promover/rebaixar admin)
  const [promoteTarget, setPromoteTarget] = useState(null)   // user a ser promovido
  const [demoteTarget, setDemoteTarget]   = useState(null)   // admin a ser rebaixado
  const [deleteTarget, setDeleteTarget]   = useState(null)   // user a ser deletado
  const [confirmInput, setConfirmInput]   = useState('')
  const [processing, setProcessing]       = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      // 1. Profiles SEM joins (join falhava por RLS encadeado)
      const { data: profilesData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profErr) {
        toast.error('Erro ao carregar usuários: ' + profErr.message)
        setLoading(false)
        return
      }
      setUsers(profilesData || [])

      // 2. Máquinas, agrupa por user_id
      const { data: machinesData } = await supabase
        .from('user_machines')
        .select('user_id, status')

      const mMap = {}
      ;(machinesData || []).forEach(m => {
        if (!mMap[m.user_id]) mMap[m.user_id] = { total: 0, approved: 0, pending: 0, rejected: 0 }
        mMap[m.user_id].total++
        if (m.status === 'approved') mMap[m.user_id].approved++
        else if (m.status === 'pending') mMap[m.user_id].pending++
        else if (m.status === 'rejected') mMap[m.user_id].rejected++
      })
      setMachineCounts(mMap)

      // 3. Cotações
      const { data: quotesData } = await supabase
        .from('quote_requests')
        .select('user_id, status')

      const qMap = {}
      ;(quotesData || []).forEach(q => {
        if (!qMap[q.user_id]) qMap[q.user_id] = 0
        qMap[q.user_id]++
      })
      setQuoteCounts(qMap)
    } catch (err) {
      toast.error('Erro inesperado: ' + (err.message || err))
    }
    setLoading(false)
  }

  const filtered = useMemo(() => {
    let list = users
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter)
    if (!search) return list
    const s = search.toLowerCase()
    return list.filter(u =>
      (u.email || '').toLowerCase().includes(s) ||
      (u.full_name || '').toLowerCase().includes(s) ||
      (u.company_name || '').toLowerCase().includes(s) ||
      (u.cnpj || '').toLowerCase().includes(s) ||
      (u.phone || '').toLowerCase().includes(s)
    )
  }, [users, search, roleFilter])

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role !== 'admin').length,
    withMachines: users.filter(u => (machineCounts[u.id]?.total || 0) > 0).length
  }), [users, machineCounts])

  // Abre o modal correspondente, ação de fato é executada depois de confirmação multi-step
  const requestToggleAdmin = (u) => {
    if (u.id === me.id) return toast.error('Você não pode alterar a própria permissão')
    setConfirmInput('')
    if (u.role === 'admin') setDemoteTarget(u)
    else                    setPromoteTarget(u)
  }
  const requestDelete = (u) => {
    if (u.id === me.id) return toast.error('Você não pode excluir a si mesmo')
    setConfirmInput('')
    setDeleteTarget(u)
  }
  const cancelModal = () => {
    setPromoteTarget(null)
    setDemoteTarget(null)
    setDeleteTarget(null)
    setConfirmInput('')
  }

  const confirmPromote = async () => {
    if (!promoteTarget) return
    if (confirmInput.trim().toLowerCase() !== promoteTarget.email.toLowerCase()) {
      toast.error('Email não confere com o usuário selecionado')
      return
    }
    setProcessing(true)
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', promoteTarget.id)
    setProcessing(false)
    if (error) toast.error('Erro: ' + error.message)
    else {
      toast.success(`${promoteTarget.email} agora é administrador`)
      cancelModal()
      load()
    }
  }
  const confirmDemote = async () => {
    if (!demoteTarget) return
    setProcessing(true)
    const { error } = await supabase.from('profiles').update({ role: 'customer' }).eq('id', demoteTarget.id)
    setProcessing(false)
    if (error) toast.error('Erro: ' + error.message)
    else {
      toast.success(`${demoteTarget.email} voltou a ser cliente`)
      cancelModal()
      load()
    }
  }
  const confirmDelete = async () => {
    if (!deleteTarget) return
    if (confirmInput.trim().toLowerCase() !== 'EXCLUIR'.toLowerCase()) {
      toast.error('Digite "EXCLUIR" para confirmar')
      return
    }
    setProcessing(true)
    const { error } = await supabase.from('profiles').delete().eq('id', deleteTarget.id)
    setProcessing(false)
    if (error) toast.error('Erro: ' + error.message)
    else {
      toast.success('Usuário excluído. A conta de autenticação ainda existe no Supabase Auth.')
      cancelModal()
      load()
    }
  }

  if (loading) {
    return <div className="loader-wrap"><div className="loader" /></div>
  }

  return (
    <>
      {/* Stats topo */}
      <div className="admin-stat-row">
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><Users size={18} /></div>
          <div>
            <div className="admin-stat-num">{stats.total}</div>
            <div className="admin-stat-label">Total cadastrados</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><ShieldCheck size={18} /></div>
          <div>
            <div className="admin-stat-num">{stats.admins}</div>
            <div className="admin-stat-label">Administradores</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><Users size={18} /></div>
          <div>
            <div className="admin-stat-num">{stats.customers}</div>
            <div className="admin-stat-label">Clientes</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon"><Settings size={18} /></div>
          <div>
            <div className="admin-stat-num">{stats.withMachines}</div>
            <div className="admin-stat-label">Com máquinas</div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por email, nome, empresa, CNPJ, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="admin-search-clear" aria-label="Limpar busca">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="admin-filter-pills">
          <button
            className={`admin-filter-pill ${roleFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRoleFilter('all')}
          >Todos ({users.length})</button>
          <button
            className={`admin-filter-pill ${roleFilter === 'customer' ? 'active' : ''}`}
            onClick={() => setRoleFilter('customer')}
          >Clientes ({stats.customers})</button>
          <button
            className={`admin-filter-pill ${roleFilter === 'admin' ? 'active' : ''}`}
            onClick={() => setRoleFilter('admin')}
          >Admins ({stats.admins})</button>
        </div>
      </div>

      {/* User cards grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Users size={48} /></div>
          <h3>Nenhum usuário encontrado</h3>
          <p>Tente ajustar a busca ou os filtros.</p>
        </div>
      ) : (
        <div className="admin-users-grid">
          {filtered.map(u => {
            const mc = machineCounts[u.id] || { total: 0, approved: 0, pending: 0, rejected: 0 }
            const qc = quoteCounts[u.id] || 0
            const initial = (u.full_name || u.email || '?').charAt(0).toUpperCase()
            const isMe = u.id === me.id
            return (
              <div className="admin-user-card" key={u.id}>
                <div className="admin-user-card-head">
                  <div className="admin-user-avatar">{initial}</div>
                  <div className="admin-user-card-head-text">
                    <div className="admin-user-card-name">
                      {u.full_name || ','}
                      {isMe && <span className="admin-user-card-me-tag">você</span>}
                    </div>
                    <div className="admin-user-card-email">
                      <Mail size={11} /> {u.email}
                    </div>
                  </div>
                  <span className={`admin-user-role-badge ${u.role === 'admin' ? 'is-admin' : ''}`}>
                    {u.role === 'admin' ? <ShieldCheck size={11} /> : <Users size={11} />}
                    {u.role === 'admin' ? 'Admin' : 'Cliente'}
                  </span>
                </div>

                <div className="admin-user-card-body">
                  {u.company_name && (
                    <div className="admin-user-card-row">
                      <Building2 size={12} /> {u.company_name}
                      {u.cnpj && <span className="admin-user-card-mono">CNPJ {u.cnpj}</span>}
                    </div>
                  )}
                  {u.phone && (
                    <div className="admin-user-card-row">
                      <Phone size={12} /> {u.phone}
                      {u.secondary_phone && <span>· {u.secondary_phone}</span>}
                    </div>
                  )}
                  {(u.city || u.state) && (
                    <div className="admin-user-card-row">
                      <MapPin size={12} /> {[u.city, u.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                  {u.segment && (
                    <div className="admin-user-card-row">
                      <FileText size={12} /> {u.segment}
                    </div>
                  )}
                  <div className="admin-user-card-row admin-user-card-row-meta">
                    <Calendar size={12} /> Cadastrado em {new Date(u.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div className="admin-user-card-stats">
                  <div className="admin-user-card-stat">
                    <span className="admin-user-card-stat-num">{mc.total}</span>
                    <span className="admin-user-card-stat-label">máquinas</span>
                    {mc.total > 0 && (
                      <span className="admin-user-card-stat-detail">
                        {mc.approved} aprovada{mc.approved !== 1 && 's'}{mc.pending > 0 && ` · ${mc.pending} pendente${mc.pending !== 1 && 's'}`}
                      </span>
                    )}
                  </div>
                  <div className="admin-user-card-stat">
                    <span className="admin-user-card-stat-num">{qc}</span>
                    <span className="admin-user-card-stat-label">cotações</span>
                  </div>
                </div>

                <div className="admin-user-card-cta">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setDetail(u)}
                    title="Ver detalhes completos"
                  >
                    <Eye size={13} /> Detalhes
                  </button>
                  {!isMe && (
                    <>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => requestToggleAdmin(u)}
                      >
                        {u.role === 'admin'
                          ? <><ShieldOff size={13} /> Tornar Cliente</>
                          : <><ShieldCheck size={13} /> Tornar Admin</>}
                      </button>
                      <button
                        className="btn btn-ghost btn-xs admin-user-card-danger"
                        onClick={() => requestDelete(u)}
                      >
                        <Trash2 size={13} /> Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetail(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>
                <div className="admin-user-avatar lg">{(detail.full_name || detail.email).charAt(0).toUpperCase()}</div>
                <div>
                  <div>{detail.full_name || ','}</div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>{detail.email}</span>
                </div>
              </h3>
              <button onClick={() => setDetail(null)} className="admin-modal-close" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <DetailGroup title="Identificação">
                <DetailRow label="Nome completo" value={detail.full_name} />
                <DetailRow label="Email" value={detail.email} mono />
                <DetailRow label="Telefone principal" value={detail.phone} />
                <DetailRow label="Telefone secundário" value={detail.secondary_phone} />
                <DetailRow label="Cargo" value={detail.position} />
              </DetailGroup>
              <DetailGroup title="Empresa">
                <DetailRow label="Razão social" value={detail.company_name} />
                <DetailRow label="CNPJ" value={detail.cnpj} mono />
                <DetailRow label="Segmento" value={detail.segment} />
              </DetailGroup>
              <DetailGroup title="Endereço">
                <DetailRow label="Endereço" value={detail.address} />
                <DetailRow label="Bairro" value={detail.neighborhood} />
                <DetailRow label="Cidade" value={detail.city} />
                <DetailRow label="Estado" value={detail.state} />
                <DetailRow label="CEP" value={detail.postal_code} />
              </DetailGroup>
              <DetailGroup title="Sistema">
                <DetailRow label="Papel" value={detail.role === 'admin' ? 'Administrador' : 'Cliente'} />
                <DetailRow label="Cadastrado em" value={new Date(detail.created_at).toLocaleString('pt-BR')} />
                <DetailRow label="Última atualização" value={detail.updated_at ? new Date(detail.updated_at).toLocaleString('pt-BR') : ','} />
                <DetailRow label="ID interno" value={detail.id} mono />
              </DetailGroup>
              {detail.notes && (
                <DetailGroup title="Observações">
                  <p style={{ margin: 0, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{detail.notes}</p>
                </DetailGroup>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────────── MODAL: Promover a Admin (multi-step) ────────── */}
      {promoteTarget && (
        <div className="admin-modal-overlay" onClick={cancelModal}>
          <div className="admin-danger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-danger-modal-head">
              <div className="admin-danger-modal-icon"><ShieldCheck size={26} /></div>
              <h3>Promover usuário a administrador</h3>
              <p>Esta ação concede acesso completo ao painel administrativo. Revise os privilégios antes de confirmar.</p>
            </div>
            <div className="admin-danger-modal-body">
              <div className="admin-danger-modal-warn">
                <AlertTriangle size={18} className="admin-danger-modal-warn-icon" />
                <div>
                  <strong>Atenção: privilégios de administrador incluem</strong>
                  Aprovar e rejeitar máquinas, gerenciar todo o catálogo de peças, kits e serviços,
                  responder cotações de todos os clientes, gerenciar usuários (inclusive promover/remover outros admins) e excluir dados do sistema.
                </div>
              </div>

              <p style={{ margin: '0 0 6px', fontSize: '0.92rem' }}>
                Você está prestes a tornar <strong>{promoteTarget.full_name || promoteTarget.email}</strong> um administrador.
              </p>
              <ul className="admin-danger-modal-list">
                <li>Email: <strong>{promoteTarget.email}</strong></li>
                {promoteTarget.company_name && <li>Empresa: {promoteTarget.company_name}</li>}
                {promoteTarget.cnpj && <li>CNPJ: {promoteTarget.cnpj}</li>}
              </ul>

              <label className="admin-danger-modal-input-label">
                Digite o email do usuário para confirmar:
              </label>
              <input
                type="text"
                className="admin-danger-modal-input"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={promoteTarget.email}
                autoComplete="off"
                autoFocus
              />
              <span className="admin-danger-modal-input-hint">{promoteTarget.email}</span>
            </div>
            <div className="admin-danger-modal-foot">
              <button onClick={cancelModal} className="btn btn-ghost" disabled={processing}>
                Cancelar
              </button>
              <button
                onClick={confirmPromote}
                className="btn btn-primary"
                disabled={processing || confirmInput.trim().toLowerCase() !== promoteTarget.email.toLowerCase()}
              >
                {processing
                  ? <><span className="loader sm" /> Promovendo...</>
                  : <><ShieldCheck size={15} /> Promover a administrador</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────── MODAL: Rebaixar Admin (sem digitação, mas confirmação) ────────── */}
      {demoteTarget && (
        <div className="admin-modal-overlay" onClick={cancelModal}>
          <div className="admin-danger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-danger-modal-head">
              <div className="admin-danger-modal-icon"><ShieldOff size={26} /></div>
              <h3>Remover acesso administrativo</h3>
              <p>
                <strong>{demoteTarget.full_name || demoteTarget.email}</strong> voltará a ter perfil de cliente
                e perderá acesso ao painel administrativo.
              </p>
            </div>
            <div className="admin-danger-modal-body">
              <ul className="admin-danger-modal-list">
                <li>Email: <strong>{demoteTarget.email}</strong></li>
                <li>O usuário continuará podendo se logar normalmente como cliente.</li>
                <li>Os dados das máquinas e cotações vinculados a ele permanecem intactos.</li>
                <li>Você pode reverter esta ação a qualquer momento.</li>
              </ul>
            </div>
            <div className="admin-danger-modal-foot">
              <button onClick={cancelModal} className="btn btn-ghost" disabled={processing}>
                Cancelar
              </button>
              <button onClick={confirmDemote} className="btn btn-outline" disabled={processing}>
                {processing
                  ? <><span className="loader sm" /> Atualizando...</>
                  : <><ShieldOff size={15} /> Confirmar rebaixamento</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────── MODAL: Excluir usuário (multi-step com palavra-chave) ────────── */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={cancelModal}>
          <div className="admin-danger-modal is-danger" onClick={(e) => e.stopPropagation()}>
            <div className="admin-danger-modal-head">
              <div className="admin-danger-modal-icon"><Trash2 size={26} /></div>
              <h3>Excluir usuário permanentemente</h3>
              <p>Esta ação é <strong>irreversível</strong>. Todos os dados associados ao perfil serão removidos.</p>
            </div>
            <div className="admin-danger-modal-body">
              <div className="admin-danger-modal-warn">
                <AlertTriangle size={18} className="admin-danger-modal-warn-icon" />
                <div>
                  <strong>O que será excluído</strong>
                  Perfil, máquinas cadastradas ({(machineCounts[deleteTarget.id] || {}).total || 0}),
                  cotações vinculadas ({quoteCounts[deleteTarget.id] || 0}) e todas as informações pessoais.
                  A conta de autenticação permanecerá no Supabase Auth, remova manualmente pelo painel do Supabase se necessário.
                </div>
              </div>

              <p style={{ margin: '0 0 6px', fontSize: '0.92rem' }}>
                Você está prestes a excluir <strong>{deleteTarget.full_name || deleteTarget.email}</strong>.
              </p>

              <label className="admin-danger-modal-input-label">
                Digite <code>EXCLUIR</code> para confirmar:
              </label>
              <input
                type="text"
                className="admin-danger-modal-input"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="EXCLUIR"
                autoComplete="off"
                autoFocus
              />
            </div>
            <div className="admin-danger-modal-foot">
              <button onClick={cancelModal} className="btn btn-ghost" disabled={processing}>
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
                disabled={processing || confirmInput.trim().toLowerCase() !== 'excluir'}
              >
                {processing
                  ? <><span className="loader sm" /> Excluindo...</>
                  : <><Trash2 size={15} /> Confirmar exclusão</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function DetailGroup({ title, children }) {
  return (
    <div className="admin-detail-group">
      <div className="admin-detail-group-title">{title}</div>
      <div className="admin-detail-group-body">{children}</div>
    </div>
  )
}
function DetailRow({ label, value, mono }) {
  if (!value && value !== 0) value = ','
  return (
    <div className="admin-detail-row">
      <div className="admin-detail-row-label">{label}</div>
      <div className={`admin-detail-row-value ${mono ? 'is-mono' : ''}`}>{value}</div>
    </div>
  )
}
