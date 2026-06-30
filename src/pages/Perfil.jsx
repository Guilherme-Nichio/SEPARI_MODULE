import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Settings, Save, Plus, Trash2,
  Clock, CheckCircle2, XCircle, ChevronRight, Building2,
  MapPin, Phone, Mail, FileText, Briefcase
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'

const PROFILE_EMPTY = {
  full_name: '', company_name: '', cnpj: '',
  phone: '', secondary_phone: '',
  position: '', segment: '',
  address: '', neighborhood: '', city: '', state: '', postal_code: '',
  notes: ''
}

const statusInfo = {
  pending: { label: 'Em análise', icon: <Clock size={12} />, className: 'status-pending' },
  approved: { label: 'Aprovada', icon: <CheckCircle2 size={12} />, className: 'status-approved' },
  rejected: { label: 'Rejeitada', icon: <XCircle size={12} />, className: 'status-rejected' }
}

export default function Perfil() {
  const { profile, user, refreshProfile } = useAuth()
  const [tab, setTab] = useState('machines')

  const [form, setForm] = useState(PROFILE_EMPTY)
  const [savingProfile, setSavingProfile] = useState(false)

  const [machines, setMachines] = useState([])
  const [loadingMachines, setLoadingMachines] = useState(true)

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        cnpj: profile.cnpj || '',
        phone: profile.phone || '',
        secondary_phone: profile.secondary_phone || '',
        position: profile.position || '',
        segment: profile.segment || '',
        address: profile.address || '',
        neighborhood: profile.neighborhood || '',
        city: profile.city || '',
        state: profile.state || '',
        postal_code: profile.postal_code || '',
        notes: profile.notes || ''
      })
    }
  }, [profile])

  useEffect(() => { if (user) loadMachines() }, [user])

  const loadMachines = async () => {
    setLoadingMachines(true)
    const { data } = await supabase
      .from('user_machines')
      .select(`
        *,
        machine_model:machine_models(brand, model, category),
        application:application_id(id, name),
        assemblies:user_machine_assemblies(id, custom_name, assembly:assembly_id(id, name))
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setMachines(data || [])
    setLoadingMachines(false)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    const { error } = await supabase
      .from('profiles')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    setSavingProfile(false)
    if (error) toast.error('Erro ao salvar: ' + error.message)
    else { toast.success('Perfil atualizado!'); refreshProfile() }
  }

  const handleDeleteMachine = async (id) => {
    if (!confirm('Tem certeza que deseja remover esta máquina?')) return
    const { error } = await supabase.from('user_machines').delete().eq('id', id)
    if (error) toast.error('Erro ao remover')
    else { toast.success('Máquina removida'); loadMachines() }
  }

  const stats = useMemo(() => {
    const approved = machines.filter(m => m.status === 'approved').length
    const pending = machines.filter(m => m.status === 'pending').length
    const total = machines.length
    return { approved, pending, total }
  }, [machines])

  const profileCompleteness = useMemo(() => {
    const fields = ['full_name', 'company_name', 'cnpj', 'phone', 'position', 'city', 'state']
    const filled = fields.filter(k => (form[k] || '').trim().length > 0).length
    return Math.round((filled / fields.length) * 100)
  }, [form])

  return (
    <section className="dashboard">
      <Seo title="Minha Conta · Separi" noIndex />
      <div className="container">

        <Breadcrumbs items={[{ label: 'Minha Conta' }]} />

        {/* ─── HEADER CLEAN ─── */}
        <div className="account-head-clean">
          <div className="account-head-clean-text">
            <div className="account-head-clean-eyebrow">Minha conta</div>
            <h1>{profile?.full_name || profile?.email?.split('@')[0] || 'Bem-vindo'}</h1>
            <div className="account-head-clean-meta">
              {profile?.company_name && (
                <span><Building2 size={13} /> {profile.company_name}</span>
              )}
              {profile?.email && (
                <span><Mail size={13} /> {profile.email}</span>
              )}
              {form.city && form.state && (
                <span><MapPin size={13} /> {form.city}, {form.state}</span>
              )}
            </div>
          </div>

          <div className="account-head-clean-stats">
            <div className="account-stat-clean">
              <span className="account-stat-clean-num">{stats.approved}</span>
              <span className="account-stat-clean-label">Aprovadas</span>
            </div>
            <div className="account-stat-clean">
              <span className="account-stat-clean-num">{stats.pending}</span>
              <span className="account-stat-clean-label">Em análise</span>
            </div>
            <div className="account-stat-clean">
              <span className="account-stat-clean-num">{stats.total}</span>
              <span className="account-stat-clean-label">Total</span>
            </div>
          </div>
        </div>

        {/* ─── TABS ─── */}
        <div className="tabs" style={{ marginTop: 28 }}>
          <button className={`tab ${tab === 'machines' ? 'active' : ''}`} onClick={() => setTab('machines')}>
            <Settings size={16} /> Minhas Máquinas
            <span className="tab-count">{machines.length}</span>
          </button>
          <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            <User size={16} /> Meus Dados
            {profileCompleteness < 100 && (
              <span className="tab-count" title={`${profileCompleteness}% completo`}>{profileCompleteness}%</span>
            )}
          </button>
        </div>

        {/* ─── MÁQUINAS ─── */}
        {tab === 'machines' && (
          <>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 12, marginBottom: 20
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Centrífugas cadastradas</h2>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Cadastre suas máquinas para liberar o catálogo de peças compatíveis.
                </p>
              </div>
              <Link to="/perfil/maquinas/nova" className="btn btn-primary btn-sm">
                <Plus size={16} /> Adicionar Máquina
              </Link>
            </div>

            {loadingMachines ? (
              <div className="loader-wrap"><div className="loader" /></div>
            ) : machines.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Settings size={48} /></div>
                <h3>Nenhuma máquina cadastrada</h3>
                <p>Adicione suas centrífugas para acessar o catálogo personalizado de peças compatíveis.</p>
                <Link to="/perfil/maquinas/nova" className="btn btn-primary">
                  <Plus size={16} /> Adicionar Primeira Máquina
                </Link>
              </div>
            ) : (
              <div className="my-machines-grid-v2">
                {machines.map(m => {
                  const info = statusInfo[m.status]
                  const label = `${m.machine_model?.brand || ''} ${m.machine_model?.model || ''}`.trim() || 'Máquina'
                  const asmCount = m.assemblies?.length || 0
                  return (
                    <div className="my-machine-card-v2" key={m.id}>
                      <Link to={`/perfil/maquinas/${m.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="my-machine-card-v2-photo">
                          {m.photo_url
                            ? <img src={m.photo_url} alt={label} loading="lazy" />
                            : <div className="my-machine-card-v2-photo-placeholder">...imagem</div>
                          }
                          <div className={`my-machine-card-v2-status ${m.status}`}>
                            {info.icon} {info.label}
                          </div>
                        </div>
                        <div className="my-machine-card-v2-body">
                          <div className="my-machine-card-v2-brand">{m.machine_model?.brand}</div>
                          <div className="my-machine-card-v2-model">{m.machine_model?.model}</div>
                          <div className="my-machine-card-v2-meta">
                            <span><strong>Série:</strong> {m.serial_number}</span>
                            {asmCount > 0 && <span>· <strong>{asmCount}</strong> conjunto{asmCount !== 1 && 's'}</span>}
                          </div>
                          {m.application?.name && (
                            <div style={{ marginTop: 8 }}>
                              <span className="chip teal" style={{ fontSize: '0.72rem' }}>
                                {m.application.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="my-machine-card-v2-cta">
                        {m.status === 'pending' && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteMachine(m.id)}
                            title="Remover máquina"
                            style={{ flex: '0 0 auto' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <Link
                          to={`/perfil/maquinas/${m.id}`}
                          className={`btn ${m.status === 'approved' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        >
                          {m.status === 'approved' ? 'Cotar peças e kits' : 'Ver detalhes'}
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ─── MEUS DADOS, clean, single column ─── */}
        {tab === 'profile' && (
          <div className="profile-form-clean">

            {/* Barra de progresso topo */}
            <div className="profile-completeness-clean">
              <div className="profile-completeness-clean-head">
                <div>
                  <strong>Perfil {profileCompleteness}% completo</strong>
                  <span>Complete os campos para acelerar a aprovação de novas máquinas.</span>
                </div>
                <div className="profile-completeness-clean-num">{profileCompleteness}%</div>
              </div>
              <div className="profile-completeness-clean-bar">
                <div
                  className="profile-completeness-clean-bar-fill"
                  style={{ width: `${profileCompleteness}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>

              {/* Dados Pessoais */}
              <div className="profile-section-clean">
                <div className="profile-section-clean-head">
                  <div className="profile-section-clean-icon"><User size={18} /></div>
                  <div>
                    <h3>Dados Pessoais</h3>
                    <p>Como você se identifica conosco</p>
                  </div>
                </div>
                <div className="profile-section-clean-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nome completo</label>
                      <input className="form-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Seu nome" />
                    </div>
                    <div className="form-group">
                      <label>Cargo</label>
                      <input className="form-input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Ex: Engenheiro de Manutenção" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label><Phone size={12} style={{ verticalAlign: -1, marginRight: 4 }} /> Telefone</label>
                      <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" />
                    </div>
                    <div className="form-group">
                      <label>Telefone secundário</label>
                      <input className="form-input" value={form.secondary_phone} onChange={(e) => setForm({ ...form, secondary_phone: e.target.value })} placeholder="Whatsapp da equipe, recados…" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Empresa */}
              <div className="profile-section-clean">
                <div className="profile-section-clean-head">
                  <div className="profile-section-clean-icon"><Building2 size={18} /></div>
                  <div>
                    <h3>Empresa</h3>
                    <p>Dados da sua organização</p>
                  </div>
                </div>
                <div className="profile-section-clean-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Razão social / Empresa</label>
                      <input className="form-input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>CNPJ</label>
                      <input className="form-input" value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0000-00" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><Briefcase size={12} style={{ verticalAlign: -1, marginRight: 4 }} /> Segmento</label>
                    <input className="form-input" value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} placeholder="Ex: Laticínios, Naval, Biocombustíveis…" />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="profile-section-clean">
                <div className="profile-section-clean-head">
                  <div className="profile-section-clean-icon"><MapPin size={18} /></div>
                  <div>
                    <h3>Endereço</h3>
                    <p>Para correspondência e entregas</p>
                  </div>
                </div>
                <div className="profile-section-clean-body">
                  <div className="form-group">
                    <label>Endereço (rua, número, complemento)</label>
                    <input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bairro</label>
                      <input className="form-input" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>CEP</label>
                      <input className="form-input" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} placeholder="00000-000" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Cidade</label>
                      <input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <input className="form-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} maxLength={2} placeholder="SP" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="profile-section-clean">
                <div className="profile-section-clean-head">
                  <div className="profile-section-clean-icon"><FileText size={18} /></div>
                  <div>
                    <h3>Observações</h3>
                    <p>Informações úteis pra equipe técnica</p>
                  </div>
                </div>
                <div className="profile-section-clean-body">
                  <div className="form-group">
                    <textarea
                      className="form-textarea"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Horário de atendimento preferido, contatos alternativos, instruções pra equipe técnica…"
                      style={{ minHeight: 100 }}
                    />
                  </div>
                </div>
              </div>

              {/* Save bar fixa */}
              <div className="profile-save-bar">
                <span className="profile-save-bar-hint">As alterações ficam salvas automaticamente quando você clicar em salvar.</span>
                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                  {savingProfile ? <><span className="loader sm" /> Salvando...</> : <><Save size={16} /> Salvar Alterações</>}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </section>
  )
}
