import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle2, XCircle, Eye, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const statusInfo = {
  pending: { label: 'Pendente', className: 'status-pending' },
  approved: { label: 'Aprovada', className: 'status-approved' },
  rejected: { label: 'Rejeitada', className: 'status-rejected' }
}

export default function AdminMachines() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [filter])

  const load = async () => {
    setLoading(true)
    let q = supabase
      .from('user_machines')
      .select('*, machine_model:machine_models(brand, model, category), user:user_id(full_name, company_name, email, phone)')
      .order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data, error } = await q
    if (error) {
      console.error('AdminMachines load error:', error)
      toast.error('Erro ao carregar máquinas: ' + error.message)
    }
    setMachines(data || [])
    setLoading(false)
  }

  const quickApprove = async (e, id) => {
    e.stopPropagation()
    setProcessing(true)
    const { error } = await supabase
      .from('user_machines')
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_at: new Date().toISOString(),
        rejection_reason: null
      })
      .eq('id', id)
    setProcessing(false)
    if (error) toast.error('Erro ao aprovar')
    else {
      toast.success('Máquina aprovada!')
      load()
    }
  }

  return (
    <>
      <div className="tabs" style={{ marginBottom: 24 }}>
        {[
          { key: 'pending', label: 'Pendentes', icon: <Clock size={14} /> },
          { key: 'approved', label: 'Aprovadas', icon: <CheckCircle2 size={14} /> },
          { key: 'rejected', label: 'Rejeitadas', icon: <XCircle size={14} /> },
          { key: 'all', label: 'Todas' }
        ].map(t => (
          <button
            key={t.key}
            className={`tab ${filter === t.key ? 'active' : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : machines.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><CheckCircle2 size={48} /></div>
          <h3>Nada por aqui</h3>
          <p>Nenhuma máquina no status selecionado.</p>
        </div>
      ) : (
        <div className="panel">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Máquina</th>
                  <th>Nº Série</th>
                  <th>Solicitada em</th>
                  <th>Status</th>
                  <th style={{ width: 220 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {machines.map(m => (
                  <tr
                    key={m.id}
                    onClick={() => navigate(`/admin/maquinas/${m.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong>{m.user?.company_name || m.user?.full_name || 'Cliente'}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.user?.email}</div>
                    </td>
                    <td>
                      <strong>{m.machine_model?.brand}</strong> {m.machine_model?.model}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--teal-dark)', fontWeight: 600 }}>{m.serial_number}</td>
                    <td>{new Date(m.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`status-badge ${statusInfo[m.status].className}`}>{statusInfo[m.status].label}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/maquinas/${m.id}`) }}
                        >
                          <Eye size={14} /> Ver
                        </button>
                        {m.status === 'pending' && (
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={(e) => quickApprove(e, m.id)}
                            disabled={processing}
                            title="Aprovar rapidamente"
                          >
                            <Check size={14} /> Aprovar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
