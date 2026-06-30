import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Check, X, XCircle, Calendar, AlertCircle,
  Building, Mail, Phone, Hash, Tag, Settings, FileText, Download
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const statusInfo = {
  pending: { label: 'Pendente', className: 'status-pending' },
  approved: { label: 'Aprovada', className: 'status-approved' },
  rejected: { label: 'Rejeitada', className: 'status-rejected' }
}

export default function AdminMachineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [machine, setMachine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [activePhoto, setActivePhoto] = useState(null)

  useEffect(() => { load() }, [id])

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_machines')
      .select(`
        *,
        machine_model:machine_models(brand, model, category, description),
        user:user_id(full_name, company_name, email, phone, cnpj, position, segment, city, state),
        application:application_id(id, name),
        assemblies:user_machine_assemblies(id, custom_name, assembly:assembly_id(id, name, allows_custom)),
        photos:user_machine_photos(id, image_url, sort_order)
      `)
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
    } else {
      setMachine(data)
    }
    setLoading(false)
  }

  const approve = async () => {
    setProcessing(true)
    const { error } = await supabase
      .from('user_machines')
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_at: new Date().toISOString(),
        rejection_reason: null
      })
      .eq('id', machine.id)
    setProcessing(false)
    if (error) toast.error('Erro ao aprovar')
    else { toast.success('Máquina aprovada!'); load() }
  }

  const reject = async () => {
    if (!rejectReason.trim()) return toast.error('Informe o motivo da rejeição')
    setProcessing(true)
    const { error } = await supabase
      .from('user_machines')
      .update({
        status: 'rejected',
        approved_by: user.id,
        approved_at: new Date().toISOString(),
        rejection_reason: rejectReason.trim()
      })
      .eq('id', machine.id)
    setProcessing(false)
    if (error) toast.error('Erro ao rejeitar')
    else {
      toast.success('Máquina rejeitada')
      setRejecting(false)
      setRejectReason('')
      load()
    }
  }

  const fmtDate = (d) => new Date(d).toLocaleString('pt-BR')

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>

  if (notFound || !machine) {
    return (
      <div className="notice-card">
        <div className="notice-card-icon"><AlertCircle size={32} /></div>
        <h2>Máquina não encontrada</h2>
        <p>Esta máquina não existe ou foi removida.</p>
        <Link to="/admin/maquinas" className="btn btn-primary">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>
    )
  }

  return (
    <>
      <Link to="/admin/maquinas" className="peca-back" style={{ marginBottom: 18, display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Voltar para Aprovação de Máquinas
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 18 }}>

        {/* COLUNA ESQUERDA, Foto */}
        <div className="panel">
          <div className="panel-header">
            <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Foto da Máquina
            </h3>
            <span className={`status-badge ${statusInfo[machine.status].className}`}>
              {statusInfo[machine.status].label}
            </span>
          </div>
          <div className="panel-body">
            {(() => {
              const gallery = [
                ...(machine.photo_url ? [{ id: 'main', image_url: machine.photo_url, main: true }] : []),
                ...((machine.photos || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
              ]
              if (gallery.length === 0) {
                return (
                  <div className="admin-photo-empty">Sem foto</div>
                )
              }
              const current = gallery.find(g => g.id === activePhoto) || gallery[0]
              return (
                <>
                  <a
                    href={current.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-photo-main"
                    title="Abrir em tamanho real"
                  >
                    <img src={current.image_url} alt="Máquina" />
                  </a>
                  {gallery.length > 1 && (
                    <div className="admin-photo-thumbs">
                      {gallery.map(g => (
                        <button
                          key={g.id}
                          type="button"
                          className={`admin-photo-thumb ${current.id === g.id ? 'active' : ''}`}
                          onClick={() => setActivePhoto(g.id)}
                        >
                          <img src={g.image_url} alt="" />
                          {g.main && <span className="admin-photo-thumb-tag">principal</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="admin-photo-count">
                    {gallery.length} foto{gallery.length > 1 ? 's' : ''} · clique para ampliar
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* COLUNA DIREITA, Info + Ações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* DADOS */}
          <div className="panel">
            <div className="panel-header">
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} /> Informações da Máquina
              </h3>
            </div>
            <div className="panel-body">
              <DetailRow icon={<Tag size={14} />} label="Marca" value={machine.machine_model?.brand} bold />
              <DetailRow icon={<Tag size={14} />} label="Modelo" value={machine.machine_model?.model} />
              {machine.machine_model?.category && (
                <DetailRow label="Categoria" value={machine.machine_model.category} />
              )}
              {machine.application?.name && (
                <DetailRow label="Aplicação" value={machine.application.name} bold />
              )}
              <DetailRow icon={<Hash size={14} />} label="Nº de Série" value={machine.serial_number} mono />
              <DetailRow icon={<Calendar size={14} />} label="Cadastrada em" value={fmtDate(machine.created_at)} />
              {machine.approved_at && (
                <DetailRow icon={<Calendar size={14} />} label="Processada em" value={fmtDate(machine.approved_at)} />
              )}
            </div>
          </div>

          {/* CONJUNTOS MECÂNICOS */}
          {machine.assemblies && machine.assemblies.length > 0 && (
            <div className="panel">
              <div className="panel-header">
                <h3>Conjuntos mecânicos selecionados</h3>
              </div>
              <div className="panel-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {machine.assemblies.map(asm => (
                    <span
                      key={asm.id}
                      style={{
                        background: 'rgba(0,169,157,0.08)',
                        color: 'var(--teal-dark)',
                        padding: '6px 14px',
                        borderRadius: 'var(--r-pill)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: '1px solid rgba(0,169,157,0.18)'
                      }}
                    >
                      {asm.custom_name || asm.assembly?.name}
                      {asm.custom_name && asm.assembly?.allows_custom && (
                        <span style={{ marginLeft: 6, opacity: 0.7, fontSize: '0.74rem', fontWeight: 500 }}>
                          (personalizado)
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <p style={{ marginTop: 12, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Estes são os conjuntos que o cliente indicou ter / precisar de atendimento.
                </p>
              </div>
            </div>
          )}

          {/* MANUAL TÉCNICO (PDF) */}
          {machine.manual_url && (
            <div className="panel">
              <div className="panel-header">
                <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} /> Manual Técnico
                </h3>
              </div>
              <div className="panel-body">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{
                    width: 44, height: 44,
                    background: 'var(--teal-dark)',
                    borderRadius: 'var(--r-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--white)',
                    flexShrink: 0
                  }}>
                    <FileText size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 2 }}>
                      Manual enviado pelo cliente
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      PDF · clique para abrir ou baixar
                    </div>
                  </div>
                  <a
                    href={machine.manual_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    download
                  >
                    <Download size={14} /> Abrir PDF
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTE */}
          <div className="panel">
            <div className="panel-header">
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Building size={16} /> Cliente
              </h3>
            </div>
            <div className="panel-body">
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
                {machine.user?.company_name || machine.user?.full_name || 'Cliente'}
              </div>
              {machine.user?.full_name && machine.user?.company_name && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: 10 }}>
                  {machine.user.full_name}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-light)' }}>
                  <Mail size={14} /> {machine.user?.email}
                </div>
                {machine.user?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-light)' }}>
                    <Phone size={14} /> {machine.user.phone}
                  </div>
                )}
                {machine.user?.cnpj && (
                  <div style={{ color: 'var(--text-light)' }}>
                    CNPJ: {machine.user.cnpj}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MOTIVO DE REJEIÇÃO (se aplicável) */}
          {machine.rejection_reason && (
            <div className="panel" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
              <div className="panel-header">
                <h3 style={{ color: 'var(--danger)' }}>Motivo da rejeição</h3>
              </div>
              <div className="panel-body">
                <div style={{
                  padding: 14,
                  background: 'rgba(239,68,68,0.05)',
                  borderRadius: 'var(--r-sm)',
                  borderLeft: '3px solid var(--danger)',
                  fontSize: '0.95rem'
                }}>
                  {machine.rejection_reason}
                </div>
              </div>
            </div>
          )}

          {/* AÇÕES, só se pendente */}
          {machine.status === 'pending' && (
            <div className="panel">
              <div className="panel-header">
                <h3>Ação</h3>
              </div>
              <div className="panel-body">
                {rejecting ? (
                  <>
                    <div className="form-group">
                      <label>Motivo da rejeição <span className="required">*</span></label>
                      <textarea
                        className="form-textarea"
                        placeholder="Explique ao cliente o que está faltando ou inadequado..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setRejecting(false); setRejectReason('') }}
                        disabled={processing}
                        style={{ flex: 1 }}
                      >
                        Cancelar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={reject}
                        disabled={processing || !rejectReason.trim()}
                        style={{ flex: 1 }}
                      >
                        {processing ? 'Rejeitando...' : <><X size={14} /> Confirmar Rejeição</>}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setRejecting(true)}
                      style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                      <XCircle size={14} /> Rejeitar
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={approve}
                      disabled={processing}
                      style={{ flex: 1 }}
                    >
                      {processing ? 'Aprovando...' : <><Check size={14} /> Aprovar</>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function DetailRow({ icon, label, value, bold, mono }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid var(--gray-200)',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', color: 'var(--text-light)' }}>
        {icon}
        {label}
      </div>
      <div style={{
        fontWeight: bold ? 700 : 500,
        fontSize: '0.95rem',
        color: 'var(--text)',
        fontFamily: mono ? 'monospace' : 'inherit',
        textAlign: 'right'
      }}>
        {value || '-'}
      </div>
    </div>
  )
}
