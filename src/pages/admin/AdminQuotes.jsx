import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Eye, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const statusLabels = {
  open: 'Aberta',
  in_progress: 'Em análise',
  answered: 'Respondida',
  closed: 'Fechada'
}

export default function AdminQuotes() {
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { load() }, [filter])

  const load = async () => {
    setLoading(true)
    let q = supabase
      .from('quote_requests')
      .select(`
        *,
        user:user_id(full_name, company_name, email, phone, cnpj),
        quote_items (id)
      `)
      .order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data, error } = await q
    if (error) console.error('AdminQuotes load error:', error)
    setQuotes(data || [])
    setLoading(false)
  }

  const fmtDate = (d) => new Date(d).toLocaleString('pt-BR')

  return (
    <>
      <div className="tabs" style={{ marginBottom: 24 }}>
        {[
          { key: 'all', label: 'Todas' },
          { key: 'open', label: 'Abertas' },
          { key: 'in_progress', label: 'Em análise' },
          { key: 'answered', label: 'Respondidas' },
          { key: 'closed', label: 'Fechadas' }
        ].map(t => (
          <button
            key={t.key}
            className={`tab ${filter === t.key ? 'active' : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : quotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FileText size={48} /></div>
          <h3>Nenhuma cotação</h3>
          <p>Não há cotações no filtro selecionado.</p>
        </div>
      ) : (
        <div className="panel">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th style={{ width: 110 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => (
                  <tr
                    key={q.id}
                    onClick={() => navigate(`/admin/cotacoes/${q.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong>{q.user?.company_name || q.user?.full_name || 'Cliente'}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{q.user?.email}</div>
                    </td>
                    <td><strong>{q.quote_items?.length || 0}</strong> peça{q.quote_items?.length !== 1 && 's'}</td>
                    <td style={{ fontSize: '0.88rem' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle', color: 'var(--text-muted)' }} />
                      {fmtDate(q.created_at)}
                    </td>
                    <td><span className={`status-badge status-${q.status}`}>{statusLabels[q.status]}</span></td>
                    <td>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/cotacoes/${q.id}`) }}
                      >
                        <Eye size={14} /> Abrir
                      </button>
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
