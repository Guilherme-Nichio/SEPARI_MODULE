import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Package, Clock, ChevronRight, ChevronDown, MessageCircle,
  Calendar, ShoppingCart, CheckCircle2, Layers, Hash, Search,
  Loader2, Mail, Phone, Send
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

const statusLabels = {
  open: 'Aberta',
  in_progress: 'Em análise',
  answered: 'Respondida',
  closed: 'Fechada'
}

// Etapas da timeline de cada pedido
const TIMELINE_STEPS = [
  { key: 'open',         label: 'Recebido',     sub: 'Solicitação chegou',   icon: <FileText size={16} /> },
  { key: 'in_progress',  label: 'Em análise',   sub: 'Cotando preço/prazo',  icon: <Search size={16} /> },
  { key: 'answered',     label: 'Respondida',   sub: 'Orçamento enviado',    icon: <MessageCircle size={16} /> },
  { key: 'closed',       label: 'Concluída',    sub: 'Pedido finalizado',    icon: <CheckCircle2 size={16} /> }
]

const stepIndex = (status) => TIMELINE_STEPS.findIndex(s => s.key === status)

export default function MeusPedidos() {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [filter, setFilter] = useState('all')

  useEffect(() => { if (user) load() }, [user])

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        quote_items (
          id, quantity,
          part:parts (id, code, name, image_url),
          kit:kits (id, code, name, image_url),
          service:services (id, code, name, image_url)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setQuotes(data || [])
    setLoading(false)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.status === filter)
  const withResponse = quotes.filter(q => q.admin_response).length
  const awaiting = quotes.filter(q => !q.admin_response && q.status !== 'closed').length

  return (
    <section className="dashboard">
      <Seo title="Meus Pedidos · Separi" noIndex />
      <div className="container" style={{ paddingBottom: 80 }}>

        <Breadcrumbs items={[{ label: 'Meus Pedidos' }]} />

        <div className="dashboard-header">
          <div className="dashboard-header-row">
            <div>
              <h1>Meus Pedidos de Cotação</h1>
              <p>
                Acompanhe cada cotação em tempo real, da solicitação até a resposta da nossa equipe técnica.
              </p>
            </div>
            <Link to="/pecas" className="btn btn-primary btn-sm">
              <Package size={16} /> Ir ao Catálogo
            </Link>
          </div>
        </div>

        {/* Stats em destaque */}
        {quotes.length > 0 && (
          <div className="account-stats" style={{ marginBottom: 28 }}>
            <div className="account-stat-card">
              <div className="account-stat-value">{quotes.length}</div>
              <div className="account-stat-label">Total de pedidos</div>
            </div>
            <div className="account-stat-card">
              <div className="account-stat-value" style={{ color: '#92400e' }}>{awaiting}</div>
              <div className="account-stat-label">Aguardando resposta</div>
            </div>
            <div className="account-stat-card">
              <div className="account-stat-value" style={{ color: '#047857' }}>{withResponse}</div>
              <div className="account-stat-label">Com retorno da Separi</div>
            </div>
          </div>
        )}

        {/* Filtros */}
        {quotes.length > 0 && (
          <div className="tabs" style={{ marginBottom: 22, overflowX: 'auto' }}>
            {[
              { key: 'all', label: 'Todas' },
              { key: 'open', label: 'Abertas' },
              { key: 'in_progress', label: 'Em análise' },
              { key: 'answered', label: 'Respondidas' },
              { key: 'closed', label: 'Fechadas' }
            ].map(t => {
              const count = t.key === 'all' ? quotes.length : quotes.filter(q => q.status === t.key).length
              return (
                <button
                  key={t.key}
                  className={`tab ${filter === t.key ? 'active' : ''}`}
                  onClick={() => setFilter(t.key)}
                >
                  {t.label} {count > 0 && <span className="tab-count">{count}</span>}
                </button>
              )
            })}
          </div>
        )}

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : quotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={48} /></div>
            <h3>Nenhum pedido de cotação ainda</h3>
            <p>Acesse o catálogo, adicione peças ou kits, e solicite sua primeira cotação. Nossa equipe responde com prazo e valores.</p>
            <Link to="/pecas" className="btn btn-primary">
              <ShoppingCart size={16} /> Ir ao Catálogo <ChevronRight size={16} />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Search size={40} /></div>
            <h3>Nenhum pedido neste filtro</h3>
            <p>Tente selecionar outra categoria acima ou volte para ver todos.</p>
            <button className="btn btn-outline-light" onClick={() => setFilter('all')}>
              Ver todas
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {filtered.map(q => {
              const hasResponse = !!q.admin_response
              const isExpanded = expanded[q.id]
              const currentStep = stepIndex(q.status)
              const shortId = q.id.slice(0, 8).toUpperCase()
              const itemCount = q.quote_items?.length || 0

              return (
                <article
                  key={q.id}
                  className={`pedido-card-v2 ${hasResponse ? 'has-response' : ''}`}
                >
                  {/* Header com ID, data e status */}
                  <header className="pedido-card-head">
                    <div className="pedido-card-head-meta">
                      <div className="pedido-card-id">
                        <Hash size={12} /> <strong>{shortId}</strong>
                        <span className={`status-badge status-${q.status}`}>
                          {statusLabels[q.status]}
                        </span>
                      </div>
                      <div className="pedido-card-date">
                        <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                        Solicitado em {formatDate(q.created_at)}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-light)' }}>
                        {itemCount} {itemCount === 1 ? 'item solicitado' : 'itens solicitados'}
                      </div>
                    </div>
                    <div className="pedido-card-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggle(q.id)}
                      >
                        {isExpanded ? <>Recolher <ChevronDown size={14} /></> : <>Ver itens <ChevronRight size={14} /></>}
                      </button>
                    </div>
                  </header>

                  {/* Timeline visual de progresso */}
                  <div className="pedido-timeline">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isDone = idx < currentStep
                      const isCurrent = idx === currentStep
                      const cls = isDone ? 'done' : isCurrent ? 'current' : ''
                      return (
                        <div key={step.key} className={`pedido-timeline-step ${cls}`}>
                          <div className="pedido-timeline-circle">
                            {isDone ? <CheckCircle2 size={16} /> : isCurrent ? step.icon : <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{idx + 1}</span>}
                          </div>
                          <div className="pedido-timeline-label">{step.label}</div>
                          <div className="pedido-timeline-sub">{step.sub}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Bloco de resposta da Separi */}
                  {hasResponse && (
                    <div className="pedido-response">
                      <div className="pedido-response-head">
                        <div className="pedido-response-avatar">
                          <MessageCircle size={20} />
                        </div>
                        <div className="pedido-response-meta">
                          <div className="pedido-response-title">
                            Resposta da equipe Separi
                            <CheckCircle2 size={16} style={{ color: 'var(--success, #10b981)' }} />
                          </div>
                          {q.responded_at && (
                            <div className="pedido-response-date">
                              Recebida em {formatDate(q.responded_at)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pedido-response-body">
                        {q.admin_response}
                      </div>

                      <div className="pedido-response-actions">
                        <a
                          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Tenho dúvidas sobre meu pedido #${shortId}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <MessageCircle size={14} /> Continuar pelo WhatsApp
                        </a>
                        <a href={`mailto:contato@separi.com.br?subject=Pedido%20%23${shortId}`} className="btn btn-outline-light btn-sm">
                          <Mail size={14} /> Responder por email
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Strip de espera (sem resposta ainda) */}
                  {!hasResponse && q.status !== 'closed' && (
                    <div className="pedido-pending-strip">
                      <Loader2 size={16} />
                      <span>
                        {q.status === 'open'
                          ? 'Recebemos seu pedido. Nossa equipe técnica vai analisar e responder em breve.'
                          : 'Estamos analisando seu pedido. Em breve enviaremos prazo e valores.'}
                      </span>
                    </div>
                  )}

                  {/* Itens expandidos */}
                  {isExpanded && (
                    <div className="pedido-items">
                      {q.notes && (
                        <div style={{ marginBottom: 22 }}>
                          <div className="pedido-items-title">
                            <FileText size={14} /> Suas observações
                          </div>
                          <div style={{
                            padding: 16,
                            background: '#FBFCFC',
                            border: '1px solid var(--gray-200)',
                            borderLeft: '3px solid var(--teal)',
                            borderRadius: 10,
                            color: 'var(--text-light)',
                            fontSize: '0.93rem',
                            lineHeight: 1.55,
                            whiteSpace: 'pre-wrap'
                          }}>{q.notes}</div>
                        </div>
                      )}

                      <div className="pedido-items-title">
                        <Package size={14} /> Itens solicitados ({itemCount})
                      </div>
                      {q.quote_items?.map(item => {
                        const isKit = !!item.kit
                        const isService = !!item.service
                        const obj = isKit ? item.kit : isService ? item.service : item.part
                        if (!obj) return null
                        const typeLabel = isKit ? 'KIT' : isService ? 'SERVIÇO' : null
                        const IconFallback = isKit ? Layers : isService ? Send : Package
                        return (
                          <div key={item.id} className="pedido-item">
                            <div className="pedido-item-img">
                              {obj.image_url
                                ? <img src={obj.image_url} alt={obj.name} />
                                : <IconFallback size={22} style={{ color: 'var(--text-muted)' }} />
                              }
                            </div>
                            <div className="pedido-item-info">
                              <div className="pedido-item-name">
                                {typeLabel && <span className="pedido-item-type-tag">{typeLabel}</span>}
                                {obj.name}
                              </div>
                              <div className="pedido-item-code">{obj.code}</div>
                            </div>
                            <div className="pedido-item-qty">×{item.quantity}</div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
