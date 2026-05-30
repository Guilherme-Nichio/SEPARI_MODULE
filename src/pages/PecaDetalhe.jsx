import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Package, ArrowLeft, Plus, Minus, ShoppingCart, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'

const fmtMoney = (v) => v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function PecaDetalhe() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addPart } = useCart()

  const [part, setPart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => { load() }, [id, user])

  const load = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('user_visible_parts')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) setNotFound(true)
    else setPart(data)
    setLoading(false)
  }

  const handleAdd = () => {
    addPart(part, qty)
    toast.success(`${qty}× ${part.name} adicionado à cotação`)
    setQty(1)
  }

  if (loading) {
    return (
      <section className="peca-page">
        <div className="container"><div className="loader-wrap"><div className="loader" /></div></div>
      </section>
    )
  }

  if (notFound || !part) {
    return (
      <section className="peca-page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Catálogo', to: '/pecas' }, { label: 'Peça não encontrada' }]} />
          <div className="notice-card" style={{ marginTop: 30 }}>
            <div className="notice-card-icon"><AlertCircle size={32} /></div>
            <h2>Peça não encontrada</h2>
            <p>Esta peça não existe ou não está disponível para o seu catálogo.</p>
            <Link to="/pecas" className="btn btn-primary">
              <ArrowLeft size={16} /> Voltar ao catálogo
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const stockClass = part.stock > 5 ? 'in-stock' : part.stock > 0 ? 'low' : 'out'
  const stockText = part.stock > 5 ? `Em estoque (${part.stock} un.)` : part.stock > 0 ? `Últimas ${part.stock} un.` : 'Sob consulta'

  return (
    <section className="peca-page">
      <Seo title={`${part.name} · Catálogo · Separi`} noIndex />
      <div className="container">

        <Breadcrumbs items={[
          { label: 'Catálogo', to: '/pecas' },
          ...(part.assembly_name ? [{ label: part.assembly_name }] : []),
          { label: part.name }
        ]} />

        <div className="peca-layout">
          <div className="peca-image">
            {part.image_url ? <img src={part.image_url} alt={part.name} loading="lazy" /> : <span className="peca-image-placeholder">...imagem</span>}
          </div>

          <div className="peca-info">
            <div className="peca-info-code">{part.code}</div>
            <h1>{part.name}</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {part.assembly_name && (
                <span style={{
                  background: 'var(--teal-dark)', color: 'var(--white)',
                  padding: '5px 14px', borderRadius: 'var(--r-pill)',
                  fontSize: '0.82rem', fontWeight: 700
                }}>{part.assembly_name}</span>
              )}
              {part.category && <span className="peca-info-cat" style={{ margin: 0 }}>{part.category}</span>}
            </div>

            {part.price_visible && part.price > 0 && (
              <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                {fmtMoney(part.price)}
                <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>/ unidade</span>
              </div>
            )}

            {part.description && <p className="peca-info-desc">{part.description}</p>}

            <div className={`peca-stock ${stockClass}`}>● {stockText}</div>

            {part.compatible_with && part.compatible_with.length > 0 && (
              <div>
                <span className="peca-compat-title">Compatível com:</span>
                <div className="peca-compat-tags">
                  {part.compatible_with.map(c => (
                    <span key={c} className="chip teal">{c}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="peca-cart-row">
              <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir"><Minus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Aumentar"><Plus size={14} /></button>
              </div>
              <button className="btn btn-primary" onClick={handleAdd} style={{ flex: 1 }}>
                <ShoppingCart size={18} /> Adicionar à cotação
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
