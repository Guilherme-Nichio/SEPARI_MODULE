import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import {
  ArrowLeft, Package, MessageCircle, Save, Calendar, Layers, Wrench,
  Mail, Phone, Building, AlertCircle, CheckCircle2, FileText, Hash
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const statusOptions = [
  { value: 'open',        label: 'Aberta',     desc: 'Pedido novo, ainda não foi analisado'        },
  { value: 'in_progress', label: 'Em análise', desc: 'Cotação em andamento pela equipe técnica'     },
  { value: 'answered',    label: 'Respondida', desc: 'Resposta enviada, aguardando o cliente'        },
  { value: 'closed',      label: 'Fechada',    desc: 'Pedido finalizado (aprovado ou cancelado)'     }
]

// Templates rápidos de resposta para economizar tempo do admin
const RESPONSE_TEMPLATES = [
  {
    label: 'Confirmação inicial',
    text: 'Olá! Recebemos seu pedido e nossa equipe técnica já está analisando. Enviaremos prazo e valores em até 1 dia útil.'
  },
  {
    label: 'Orçamento simples',
    text: 'Olá! Segue o orçamento para os itens solicitados:\n\n• Item 1 — R$ 0,00\n• Item 2 — R$ 0,00\n\nValor total: R$ 0,00\nPrazo de entrega: X dias úteis\nFrete: a combinar\nValidade da proposta: 7 dias\n\nQualquer dúvida, estamos à disposição.'
  },
  {
    label: 'Solicitar mais info',
    text: 'Olá! Para preparar seu orçamento com precisão, precisamos de mais algumas informações:\n\n• Número de série da máquina\n• Foto da peça atual (se possível)\n• Prazo desejado para a entrega\n\nFico no aguardo. Obrigado!'
  },
  {
    label: 'Sem estoque',
    text: 'Olá! No momento não temos uma destas peças em estoque imediato, mas podemos providenciar com prazo de X dias úteis. Confirmar interesse em prosseguir?'
  }
]

export default function AdminQuoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState('open')
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => { load() }, [id])

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        user:user_id(full_name, company_name, email, phone, cnpj),
        quote_items (
          id, quantity,
          part:parts (id, code, name, image_url),
          kit:kits (id, code, name, image_url),
          service:services (id, code, name, image_url)
        )
      `)
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      setNotFound(true)
    } else {
      setQuote(data)
      setResponse(data.admin_response || '')
      setStatus(data.status)
    }
    setLoading(false)
  }

  const saveResponse = async () => {
    if (!quote) return
    setSaving(true)
    const update = {
      status,
      admin_response: response.trim() || null
    }
    if (response.trim() && !quote.admin_response) {
      update.responded_by = me.id
      update.responded_at = new Date().toISOString()
    }
    const { error } = await supabase.from('quote_requests').update(update).eq('id', quote.id)
    setSaving(false)
    if (error) toast.error('Erro ao salvar: ' + error.message)
    else {
      toast.success('Cotação atualizada com sucesso')
      load()
    }
  }

  // Botão de auto-status: ao escrever a resposta, sugerir mudar para "respondida"
  const handleResponseChange = (val) => {
    setResponse(val)
    if (val.trim() && status === 'open') {
      setStatus('in_progress')
    }
  }

  const applyTemplate = (text) => {
    if (response.trim() && !window.confirm('Já existe um texto na resposta. Substituir?')) return
    setResponse(text)
    if (status === 'open') setStatus('in_progress')
  }

  const fmtDate = (d) => new Date(d).toLocaleString('pt-BR')
  const shortId = id?.slice(0, 8).toUpperCase() || ''

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>

  if (notFound || !quote) {
    return (
      <div className="notice-card">
        <div className="notice-card-icon"><AlertCircle size={32} /></div>
        <h2>Cotação não encontrada</h2>
        <p>Esta cotação não existe ou foi removida.</p>
        <Link to="/admin/cotacoes" className="btn btn-primary">
          <ArrowLeft size={16} /> Voltar para Cotações
        </Link>
      </div>
    )
  }

  const itemCount = quote.quote_items?.length || 0
  const partCount = quote.quote_items?.filter(i => i.part).length || 0
  const kitCount = quote.quote_items?.filter(i => i.kit).length || 0
  const serviceCount = quote.quote_items?.filter(i => i.service).length || 0

  return (
    <>
      <Link to="/admin/cotacoes" className="peca-back" style={{ marginBottom: 18, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <ArrowLeft size={16} /> Voltar para todas as cotações
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
        gap: 18
      }} className="quote-detail-grid">

        {/* COLUNA ESQUERDA, dados do pedido */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

          {/* HEADER: ID + status */}
          <div className="panel" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Hash size={12} /> Pedido #{shortId}
                </div>
                <div style={{ fontSize: '1.18rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {quote.user?.company_name || quote.user?.full_name || 'Cliente'}
                  <span className={`status-badge status-${quote.status}`}>
                    {statusOptions.find(s => s.value === quote.status)?.label}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-light)', textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <Calendar size={13} /> Criado em {fmtDate(quote.created_at)}
                </div>
                {quote.responded_at && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 4, color: 'var(--teal-dark)' }}>
                    <CheckCircle2 size={13} /> Respondido em {fmtDate(quote.responded_at)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CLIENTE */}
          <div className="panel">
            <div className="panel-header">
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Building size={16} /> Dados do cliente
              </h3>
            </div>
            <div className="panel-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  {quote.user?.full_name && quote.user?.company_name && (
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-light)', marginBottom: 10 }}>
                      Responsável: <strong>{quote.user.full_name}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.92rem' }}>
                    <a href={`mailto:${quote.user?.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-light)' }}>
                      <Mail size={14} /> {quote.user?.email}
                    </a>
                    {quote.user?.phone && (
                      <a href={`tel:${quote.user.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-light)' }}>
                        <Phone size={14} /> {quote.user.phone}
                      </a>
                    )}
                    {quote.user?.cnpj && (
                      <div style={{ color: 'var(--text-light)' }}>
                        CNPJ: {quote.user.cnpj}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{
                      padding: 12, background: 'var(--bg-subtle)',
                      borderRadius: 10, textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                        {itemCount}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: 4 }}>
                        Itens totais
                      </div>
                    </div>
                    <div style={{
                      padding: 12, background: 'var(--bg-subtle)',
                      borderRadius: 10, textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--teal-dark)', lineHeight: 1 }}>
                        {partCount}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: 4 }}>
                        Peças
                      </div>
                    </div>
                    {kitCount > 0 && (
                      <div style={{
                        padding: 12, background: 'rgba(0,169,157,0.08)',
                        borderRadius: 10, textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--teal-dark)', lineHeight: 1 }}>
                          {kitCount}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: 4 }}>
                          Kits
                        </div>
                      </div>
                    )}
                    {serviceCount > 0 && (
                      <div style={{
                        padding: 12, background: 'rgba(245,158,11,0.08)',
                        borderRadius: 10, textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#92400e', lineHeight: 1 }}>
                          {serviceCount}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: 4 }}>
                          Serviços
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          {quote.notes && (
            <div className="panel">
              <div className="panel-header">
                <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} /> Observações do cliente
                </h3>
              </div>
              <div className="panel-body">
                <div style={{
                  padding: 16,
                  background: 'var(--bg-subtle)',
                  borderRadius: 10,
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  borderLeft: '3px solid var(--teal)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {quote.notes}
                </div>
              </div>
            </div>
          )}

          {/* ITENS */}
          <div className="panel">
            <div className="panel-header">
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Package size={16} /> Itens solicitados ({itemCount})
              </h3>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {quote.quote_items?.map(item => {
                const isKit = !!item.kit
                const isService = !!item.service
                const obj = isKit ? item.kit : isService ? item.service : item.part
                if (!obj) return null
                const tag = isKit ? 'Kit' : isService ? 'Serviço' : 'Peça'
                const tagColor = isKit ? '#006260' : isService ? '#92400e' : 'var(--text-light)'
                const tagBg = isKit ? 'rgba(0,169,157,0.10)' : isService ? 'rgba(245,158,11,0.10)' : 'var(--bg-subtle)'
                const Fallback = isKit ? Layers : isService ? Wrench : Package
                return (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 22px',
                    borderBottom: '1px solid var(--gray-200)'
                  }}>
                    <div style={{
                      width: 56, height: 56,
                      borderRadius: 10,
                      background: 'var(--bg-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', flexShrink: 0,
                      border: '1px solid var(--gray-200)'
                    }}>
                      {obj.image_url
                        ? <img src={obj.image_url} alt={obj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Fallback size={22} style={{ color: 'var(--text-muted)' }} />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700,
                          padding: '2px 7px', borderRadius: 999,
                          background: tagBg, color: tagColor
                        }}>{tag}</span>
                        <div style={{ fontWeight: 600 }}>{obj.name}</div>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--teal-dark)', fontWeight: 600, fontFamily: 'monospace' }}>
                        {obj.code}
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--bg-subtle)',
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      ×{item.quantity}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA, Resposta */}
        <div>
          <div className="panel" style={{ position: 'sticky', top: 110 }}>
            <div className="panel-header">
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle size={16} /> Responder ao cliente
              </h3>
            </div>
            <div className="panel-body">

              {/* Status com descrição */}
              <div className="form-group">
                <label>Status atual</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <span className="form-help">
                  {statusOptions.find(s => s.value === status)?.desc}
                </span>
              </div>

              {/* Templates rápidos */}
              <div className="form-group">
                <label>Templates rápidos</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {RESPONSE_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyTemplate(tpl.text)}
                      style={{
                        padding: '9px 12px',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.86rem',
                        color: 'var(--text-light)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = 'rgba(0,169,157,0.06)'
                        e.currentTarget.style.borderColor = 'rgba(0,169,157,0.30)'
                        e.currentTarget.style.color = 'var(--teal-dark)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'var(--bg-subtle)'
                        e.currentTarget.style.borderColor = 'var(--gray-200)'
                        e.currentTarget.style.color = 'var(--text-light)'
                      }}
                    >
                      + {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mensagem */}
              <div className="form-group">
                <label>Mensagem ao cliente</label>
                <textarea
                  className="form-textarea"
                  value={response}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  placeholder="Escreva aqui a resposta com prazo, valores e observações técnicas..."
                  style={{ minHeight: 260, fontFamily: 'inherit', lineHeight: 1.55 }}
                />
                <span className="form-help">
                  {response.length} caracteres. O cliente verá esta mensagem em "Meus Pedidos".
                </span>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={saveResponse}
                disabled={saving}
                style={{ marginTop: 8 }}
              >
                {saving
                  ? <><span className="loader sm" /> Salvando...</>
                  : <><Save size={16} /> Salvar e enviar ao cliente</>
                }
              </button>

              {quote.user?.phone && (
                <a
                  href={`https://wa.me/${quote.user.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Sobre seu pedido #${shortId} na Separi...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-block"
                  style={{ marginTop: 10 }}
                >
                  <WhatsAppIcon size={16} /> Falar pelo WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .quote-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
