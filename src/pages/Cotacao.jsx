import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Package, Plus, Minus, Trash2, FileText,
  ArrowLeft, AlertCircle, Layers
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'

const fmtMoney = (v) => v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Cotacao() {
  const { user } = useAuth()
  const { items, itemKey, itemCount, updateQuantity, removeItem, clear } = useCart()
  const navigate = useNavigate()

  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Total estimado (só conta itens com preço visível e definido)
  const total = items.reduce((sum, it) => {
    if (it.kind === 'part') {
      if (it.part.price_visible && it.part.price) return sum + Number(it.part.price) * it.quantity
      return sum
    }
    if (it.kit.price_visible && it.kit.final_price) return sum + Number(it.kit.final_price) * it.quantity
    return sum
  }, 0)

  const handleSubmit = async () => {
    if (items.length === 0) return toast.error('Adicione itens à cotação')
    setSubmitting(true)
    try {
      const { data: quote, error: qErr } = await supabase
        .from('quote_requests')
        .insert({ user_id: user.id, notes: notes || null, status: 'open' })
        .select().single()
      if (qErr) throw qErr

      const rows = items.map(it => ({
        quote_id: quote.id,
        part_id: it.kind === 'part' ? it.part.id : null,
        kit_id: it.kind === 'kit' ? it.kit.id : null,
        user_machine_id: it.user_machine_id || null,
        quantity: it.quantity
      }))
      const { error: iErr } = await supabase.from('quote_items').insert(rows)
      if (iErr) throw iErr

      toast.success('Cotação enviada! Nossa equipe entrará em contato.')
      clear()
      setNotes('')
      navigate('/meus-pedidos')
    } catch (err) {
      toast.error(err.message || 'Erro ao enviar cotação')
    }
    setSubmitting(false)
  }

  return (
    <section className="dashboard">
      <Seo title="Minha Cotação · Separi" noIndex />
      <div className="container" style={{ paddingBottom: 80 }}>

        <Breadcrumbs items={[
          { label: 'Catálogo', to: '/pecas' },
          { label: `Cotação (${itemCount} ${itemCount === 1 ? 'item' : 'itens'})` }
        ]} />

        <div className="dashboard-header">
          <div className="dashboard-header-row">
            <div>
              <h1>Minha Cotação</h1>
              <p>Revise os itens, adicione observações e envie para a Separi.</p>
            </div>
            <Link to="/pecas" className="btn btn-ghost btn-sm">
              <ArrowLeft size={16} /> Continuar comprando
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingCart size={48} /></div>
            <h3>Sua cotação está vazia</h3>
            <p>Adicione peças ou kits de revisão preventiva para começar.</p>
            <Link to="/pecas" className="btn btn-primary">
              <Package size={16} /> Ir ao catálogo
            </Link>
          </div>
        ) : (
          <div className="cotacao-layout">

            {/* Coluna principal, itens */}
            <div>
              <div className="panel">
                <div className="panel-header">
                  <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingCart size={16} /> Itens da cotação
                  </h3>
                  <button className="btn btn-ghost btn-xs" onClick={() => { if (confirm('Limpar todos os itens?')) clear() }}>
                    <Trash2 size={14} /> Limpar tudo
                  </button>
                </div>
                <div className="panel-body" style={{ padding: 0 }}>
                  {items.map(it => {
                    const key = itemKey(it)
                    const isKit = it.kind === 'kit'
                    const obj = isKit ? it.kit : it.part
                    const price = isKit
                      ? (it.kit.price_visible ? Number(it.kit.final_price || 0) : null)
                      : (it.part.price_visible ? Number(it.part.price || 0) : null)

                    return (
                      <div className="cart-item-row" key={key}>
                        <div className="cart-item-row-img">
                          {obj.image_url
                            ? <img src={obj.image_url} alt={obj.name} loading="lazy" />
                            : (isKit ? <Layers size={24} /> : <Package size={24} />)
                          }
                        </div>
                        <div className="cart-item-row-info">
                          <div className="cart-item-row-tag">
                            {isKit ? <Layers size={12} /> : <Package size={12} />}
                            {isKit ? 'Kit' : 'Peça'}
                          </div>
                          <div className="cart-item-row-name">{obj.name}</div>
                          <div className="cart-item-row-code">{obj.code}</div>
                        </div>
                        <div className="cart-item-row-qty">
                          <button onClick={() => updateQuantity(key, it.quantity - 1)} aria-label="Diminuir">
                            <Minus size={12} />
                          </button>
                          <span>{it.quantity}</span>
                          <button onClick={() => updateQuantity(key, it.quantity + 1)} aria-label="Aumentar">
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="cart-item-row-price">
                          {price != null
                            ? <>
                                <div className="cart-item-row-price-unit">{fmtMoney(price)} <small>/un</small></div>
                                <div className="cart-item-row-price-total">{fmtMoney(price * it.quantity)}</div>
                              </>
                            : <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sob consulta</span>
                          }
                        </div>
                        <button className="cart-item-row-remove" onClick={() => removeItem(key)} aria-label="Remover">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="panel" style={{ marginTop: 16 }}>
                <div className="panel-header">
                  <h3>Observações</h3>
                </div>
                <div className="panel-body">
                  <textarea
                    className="form-textarea"
                    placeholder="Prazo desejado, prioridade, observações técnicas..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ minHeight: 120 }}
                  />
                </div>
              </div>
            </div>

            {/* Coluna lateral, resumo */}
            <aside className="cotacao-summary">
              <div className="panel">
                <div className="panel-header">
                  <h3>Resumo</h3>
                </div>
                <div className="panel-body">
                  <div className="cotacao-summary-row">
                    <span>Itens</span>
                    <strong>{itemCount}</strong>
                  </div>
                  <div className="cotacao-summary-row">
                    <span>Subtotal estimado</span>
                    <strong>{total > 0 ? fmtMoney(total) : 'Sob consulta'}</strong>
                  </div>

                  <div className="cotacao-summary-info">
                    <AlertCircle size={14} />
                    <span>O valor final será confirmado pela equipe Separi após a análise.</span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 16 }}
                    onClick={handleSubmit}
                    disabled={submitting || items.length === 0}
                  >
                    {submitting
                      ? <><span className="loader sm" /> Enviando...</>
                      : <><FileText size={16} /> Solicitar cotação</>}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
