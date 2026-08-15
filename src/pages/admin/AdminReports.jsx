import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Award, Package, Users, FileText, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminReports() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    machineByStatus: { pending: 0, approved: 0, rejected: 0 },
    quoteByStatus: { open: 0, in_progress: 0, answered: 0, closed: 0 },
    topParts: [],
    topCustomers: [],
    monthlySignups: [],
    monthlyQuotes: []
  })

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      // Machines by status
      const { data: machines } = await supabase
        .from('user_machines')
        .select('status')

      const machineByStatus = (machines || []).reduce((acc, m) => {
        acc[m.status] = (acc[m.status] || 0) + 1
        return acc
      }, { pending: 0, approved: 0, rejected: 0 })

      // Quotes by status
      const { data: quotes } = await supabase
        .from('quote_requests')
        .select('status, user_id, created_at')

      const quoteByStatus = (quotes || []).reduce((acc, q) => {
        acc[q.status] = (acc[q.status] || 0) + 1
        return acc
      }, { open: 0, in_progress: 0, answered: 0, closed: 0 })

      // Top requested parts
      const { data: items } = await supabase
        .from('quote_items')
        .select('part_id, quantity, part:parts(code, name)')

      const partsAgg = {}
      ;(items || []).forEach(it => {
        const key = it.part_id
        if (!partsAgg[key]) partsAgg[key] = { ...it.part, total: 0, requests: 0 }
        partsAgg[key].total += it.quantity
        partsAgg[key].requests += 1
      })
      const topParts = Object.values(partsAgg).sort((a, b) => b.total - a.total).slice(0, 5)

      // Top customers (by quote count)
      const customerAgg = {}
      ;(quotes || []).forEach(q => {
        customerAgg[q.user_id] = (customerAgg[q.user_id] || 0) + 1
      })
      const topCustomerIds = Object.entries(customerAgg).sort((a, b) => b[1] - a[1]).slice(0, 5)
      let topCustomers = []
      if (topCustomerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, company_name, email')
          .in('id', topCustomerIds.map(x => x[0]))
        topCustomers = topCustomerIds.map(([id, count]) => {
          const p = (profilesData || []).find(x => x.id === id)
          return { ...p, count }
        })
      }

      // Monthly signups (last 6 months)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
      const monthlySignups = bucketByMonth(profiles, 'created_at', 6)

      // Monthly quotes (last 6 months)
      const monthlyQuotes = bucketByMonth(quotes, 'created_at', 6)

      setData({ machineByStatus, quoteByStatus, topParts, topCustomers, monthlySignups, monthlyQuotes })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const bucketByMonth = (rows, dateField, monthsBack) => {
    const buckets = {}
    const now = new Date()
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toISOString().slice(0, 7)
      buckets[key] = { label: d.toLocaleDateString('pt-BR', { month: 'short' }), count: 0 }
    }
    (rows || []).forEach(r => {
      const key = r[dateField]?.slice(0, 7)
      if (buckets[key]) buckets[key].count++
    })
    return Object.values(buckets)
  }

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Charts simples em CSS bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        <div className="panel">
          <div className="panel-header"><h3><Calendar size={16} style={{ display: 'inline', marginRight: 6 }} /> Cadastros / mês</h3></div>
          <div className="panel-body">
            <BarChartSimple data={data.monthlySignups} color="var(--teal-dark)" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><h3><FileText size={16} style={{ display: 'inline', marginRight: 6 }} /> Cotações / mês</h3></div>
          <div className="panel-body">
            <BarChartSimple data={data.monthlyQuotes} color="var(--teal-light)" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div className="panel">
          <div className="panel-header"><h3>Máquinas por Status</h3></div>
          <div className="panel-body">
            <StatRow label="Pendentes" value={data.machineByStatus.pending} className="status-pending" />
            <StatRow label="Aprovadas" value={data.machineByStatus.approved} className="status-approved" />
            <StatRow label="Rejeitadas" value={data.machineByStatus.rejected} className="status-rejected" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><h3>Cotações por Status</h3></div>
          <div className="panel-body">
            <StatRow label="Abertas" value={data.quoteByStatus.open} className="status-open" />
            <StatRow label="Em análise" value={data.quoteByStatus.in_progress} className="status-in_progress" />
            <StatRow label="Respondidas" value={data.quoteByStatus.answered} className="status-answered" />
            <StatRow label="Fechadas" value={data.quoteByStatus.closed} className="status-closed" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        <div className="panel">
          <div className="panel-header"><h3><Award size={16} style={{ display: 'inline', marginRight: 6 }} /> Peças mais solicitadas</h3></div>
          <div className="panel-body" style={{ padding: 0 }}>
            {data.topParts.length === 0 ? (
              <p style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>Sem dados ainda</p>
            ) : (
              <table className="data-table">
                <tbody>
                  {data.topParts.map((p, i) => (
                    <tr key={p.code || i}>
                      <td style={{ fontFamily: 'Courier New, monospace', fontSize: '0.85rem' }}>{p.code}</td>
                      <td><strong>{p.name}</strong></td>
                      <td style={{ textAlign: 'right' }}>
                        <strong>{p.total}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> un.</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h3><Users size={16} style={{ display: 'inline', marginRight: 6 }} /> Top clientes (por cotação)</h3></div>
          <div className="panel-body" style={{ padding: 0 }}>
            {data.topCustomers.length === 0 ? (
              <p style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>Sem dados ainda</p>
            ) : (
              <table className="data-table">
                <tbody>
                  {data.topCustomers.map((c, i) => (
                    <tr key={c.id || i}>
                      <td>
                        <strong>{c.company_name || c.full_name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.email}</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <strong>{c.count}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> cot.</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, className }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-mid)' }}>
      <span className={`status-badge ${className}`}>{label}</span>
      <strong style={{ fontSize: '1.1rem' }}>{value}</strong>
    </div>
  )
}

function BarChartSimple({ data, color }) {
  const max = Math.max(1, ...data.map(d => d.count))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--grey-dark)' }}>{d.count}</div>
          <div style={{
            width: '100%',
            background: color,
            height: `${(d.count / max) * 100}%`,
            minHeight: 4,
            borderRadius: '6px 6px 0 0',
            transition: 'height 0.5s ease'
          }} />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}
