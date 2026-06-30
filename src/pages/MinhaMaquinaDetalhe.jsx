import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, AlertCircle, Settings, Package, ShoppingCart,
  CheckCircle2, Clock, XCircle, Layers, Calendar, Hash,
  Plus, FileText, ChevronDown, ChevronUp, ListTree, Wrench,
  Sparkles, ShoppingBag, Star, ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'

const statusMap = {
  pending:  { label: 'Em análise',  icon: <Clock size={12} />,        cls: 'mmd-status-pending' },
  approved: { label: 'Aprovada',    icon: <CheckCircle2 size={12} />, cls: 'mmd-status-approved' },
  rejected: { label: 'Rejeitada',   icon: <XCircle size={12} />,      cls: 'mmd-status-rejected' }
}

const fmtMoney = (v) =>
  v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function MinhaMaquinaDetalhe() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addKit } = useCart()
  const navigate = useNavigate()

  const [machine, setMachine] = useState(null)
  const [extraPhotos, setExtraPhotos] = useState([])
  const [kits, setKits] = useState([])
  const [kitItemsMap, setKitItemsMap] = useState({})
  const [kitServicesMap, setKitServicesMap] = useState({})
  const [openComposition, setOpenComposition] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => { if (user) load() }, [id, user])

  const load = async () => {
    setLoading(true)

    const { data: m, error: mErr } = await supabase
      .from('user_machines')
      .select(`
        *,
        machine_model:machine_models(id, brand, model, category),
        application:application_id(id, name),
        assemblies:user_machine_assemblies(id, custom_name, assembly:assembly_id(id, name))
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (mErr || !m) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setMachine(m)

    // Fotos extras, tabela opcional (v40)
    const photosRes = await supabase
      .from('user_machine_photos')
      .select('id, image_url, sort_order')
      .eq('user_machine_id', m.id)
      .order('sort_order', { ascending: true })
    if (!photosRes.error) setExtraPhotos(photosRes.data || [])

    // Kits visíveis somente quando aprovada
    if (m.status === 'approved') {
      const { data: kitsData } = await supabase
        .from('user_visible_kits')
        .select('*')
        .eq('machine_model_id', m.machine_model.id)
      setKits(kitsData || [])

      if (kitsData && kitsData.length > 0) {
        const kitIds = kitsData.map(k => k.id)

        const itemsRes = await supabase
          .from('kit_items')
          .select('kit_id, quantity, part:parts(id, code, name, price, price_visible)')
          .in('kit_id', kitIds)

        let servicesData = []
        const servicesRes = await supabase
          .from('kit_services')
          .select('kit_id, quantity, service:services(id, code, name, price, price_visible, duration_hours)')
          .in('kit_id', kitIds)
        if (!servicesRes.error) servicesData = servicesRes.data || []

        const pMap = {}
        ;(itemsRes.data || []).forEach(it => {
          if (!pMap[it.kit_id]) pMap[it.kit_id] = []
          pMap[it.kit_id].push(it)
        })
        setKitItemsMap(pMap)

        const sMap = {}
        servicesData.forEach(it => {
          if (!sMap[it.kit_id]) sMap[it.kit_id] = []
          sMap[it.kit_id].push(it)
        })
        setKitServicesMap(sMap)
      }
    }
    setLoading(false)
  }

  const toggle = (kid) => setOpenComposition(p => ({ ...p, [kid]: !p[kid] }))

  const kitComplete = useMemo(() => kits.find(k => k.kit_type === 'preventive_complete'), [kits])
  const kitInter    = useMemo(() => kits.find(k => k.kit_type === 'preventive_intermediate'), [kits])
  const otherKits   = useMemo(() => kits.filter(k => k.kit_type === 'custom'), [kits])

  const handleAddKit = (kit) => {
    addKit(kit, 1, machine.id)
    toast.success(`${kit.name} adicionado à cotação`)
  }

  const goToAvulsas = () => navigate(`/pecas?machine_id=${machine.id}`)

  if (loading) {
    return (
      <section className="dashboard">
        <div className="container"><div className="loader-wrap"><div className="loader" /></div></div>
      </section>
    )
  }

  if (notFound || !machine) {
    return (
      <section className="dashboard">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Minha Conta', to: '/perfil' }, { label: 'Máquina não encontrada' }]} />
          <div className="notice-card" style={{ marginTop: 30 }}>
            <div className="notice-card-icon"><AlertCircle size={32} /></div>
            <h2>Máquina não encontrada</h2>
            <p>Esta máquina não existe ou não pertence à sua conta.</p>
            <Link to="/perfil" className="btn btn-primary">
              <ArrowLeft size={16} /> Voltar
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const info = statusMap[machine.status]
  const machineLabel = `${machine.machine_model.brand} ${machine.machine_model.model}`
  const isApproved = machine.status === 'approved'

  return (
    <>
      <Seo
        title={`${machineLabel} · Minha máquina · Separi`}
        description={`Detalhes, kits de manutenção e peças compatíveis para sua ${machineLabel}.`}
        noIndex
      />

      <section className="dashboard">
        <div className="container" style={{ paddingBottom: 80 }}>

          <Breadcrumbs items={[
            { label: 'Minha Conta', to: '/perfil' },
            { label: machineLabel }
          ]} />

          {/* ─────── HERO ─────── */}
          <header className="mmd-hero">
            <div className="mmd-hero-grid">

              <div className="mmd-hero-photo">
                {machine.photo_url
                  ? <img src={machine.photo_url} alt={machineLabel} />
                  : <div className="mmd-hero-photo-placeholder">...imagem</div>}
              </div>

              <div className="mmd-hero-info">
                <span className="mmd-hero-eyebrow">
                  <Settings size={11} /> Sua máquina
                </span>
                <h1 className="mmd-hero-title">
                  {machineLabel}
                  <span className={`mmd-status-badge ${info.cls}`}>
                    {info.icon} {info.label}
                  </span>
                </h1>
                <p className="mmd-hero-subtitle">
                  {machine.application?.name || 'Centrífuga industrial'} · cadastrada em{' '}
                  {new Date(machine.created_at).toLocaleDateString('pt-BR')}
                </p>

                <div className="mmd-hero-meta">
                  <div className="mmd-hero-meta-item">
                    <span className="mmd-hero-meta-label">Nº de série</span>
                    <span className="mmd-hero-meta-value">{machine.serial_number}</span>
                  </div>
                  {machine.machine_model.category && (
                    <div className="mmd-hero-meta-item">
                      <span className="mmd-hero-meta-label">Categoria</span>
                      <span className="mmd-hero-meta-value">{machine.machine_model.category}</span>
                    </div>
                  )}
                  {machine.assemblies && machine.assemblies.length > 0 && (
                    <div className="mmd-hero-meta-item">
                      <span className="mmd-hero-meta-label">Conjuntos</span>
                      <span className="mmd-hero-meta-value">{machine.assemblies.length}</span>
                    </div>
                  )}
                  {machine.manual_url && (
                    <div className="mmd-hero-meta-item">
                      <span className="mmd-hero-meta-label">Manual</span>
                      <a
                        href={machine.manual_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mmd-hero-meta-value"
                        style={{ textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <FileText size={12} /> abrir
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mmd-hero-cta">
                <Link to="/perfil" className="mmd-hero-back">
                  <ArrowLeft size={13} /> Voltar
                </Link>
              </div>

            </div>
          </header>

          {/* ─────── STATUS ALERTS pra pending/rejected ─────── */}
          {!isApproved && (
            <div className="notice-card" style={{ marginTop: 24 }}>
              <div className="notice-card-icon">
                {machine.status === 'pending'
                  ? <Clock size={28} />
                  : <AlertCircle size={28} />}
              </div>
              <h2>
                {machine.status === 'pending' ? 'Cadastro em análise técnica' : 'Cadastro rejeitado'}
              </h2>
              <p>
                {machine.status === 'pending'
                  ? 'Nossa engenharia está validando os dados desta máquina. Assim que aprovada, você terá acesso aos kits e peças compatíveis.'
                  : 'Este cadastro foi rejeitado. Entre em contato com nosso suporte para entender os detalhes e refazer o envio.'}
              </p>
            </div>
          )}

          {/* ─────── PATHS (3 ações) ─────── */}
          {isApproved && (
            <>
              <div className="section-title-row" style={{ marginTop: 36, marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                  <Sparkles size={18} style={{ verticalAlign: -3, color: 'var(--teal-dark)' }} />{' '}
                  Como podemos ajudar nesta máquina?
                </h2>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Escolha um kit pronto montado pela nossa equipe, ou monte a cotação peça por peça.
                </p>
              </div>

              <div className="mmd-paths">

                <PathCard
                  kit={kitComplete}
                  parts={kitComplete ? kitItemsMap[kitComplete.id] : null}
                  services={kitComplete ? kitServicesMap[kitComplete.id] : null}
                  isOpen={kitComplete ? !!openComposition[kitComplete.id] : false}
                  onToggle={() => kitComplete && toggle(kitComplete.id)}
                  onAdd={() => kitComplete && handleAddKit(kitComplete)}
                  title="Kit Completo"
                  description="Pacote total de revisão preventiva, todas as peças críticas + serviços recomendados pela engenharia."
                  badge="Mais completo"
                  icon={<Star size={22} />}
                  primary
                />

                <PathCard
                  kit={kitInter}
                  parts={kitInter ? kitItemsMap[kitInter.id] : null}
                  services={kitInter ? kitServicesMap[kitInter.id] : null}
                  isOpen={kitInter ? !!openComposition[kitInter.id] : false}
                  onToggle={() => kitInter && toggle(kitInter.id)}
                  onAdd={() => kitInter && handleAddKit(kitInter)}
                  title="Kit Intermediário"
                  description="Manutenção essencial, itens com maior taxa de desgaste, sem o pacote completo."
                  icon={<Layers size={22} />}
                />

                {/* Card para peças avulsas */}
                <div className="mmd-path-card">
                  <div className="mmd-path-card-head">
                    <div className="mmd-path-icon"><ShoppingBag size={22} /></div>
                    <h3>Peças Avulsas</h3>
                  </div>
                  <p>
                    Explore o catálogo completo de peças compatíveis e monte sua cotação personalizada,
                    item por item.
                  </p>
                  <div className="mmd-path-empty-fill" />
                  <button onClick={goToAvulsas} className="btn btn-outline btn-block">
                    <ShoppingBag size={16} /> Abrir catálogo de peças
                  </button>
                </div>

              </div>
            </>
          )}

          {/* ─────── OTHER KITS ─────── */}
          {isApproved && otherKits.length > 0 && (
            <>
              <div className="section-title-row" style={{ marginTop: 50, marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Outros kits disponíveis</h2>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Kits especiais montados para esta máquina.
                </p>
              </div>
              <div className="parts-grid">
                {otherKits.map(k => (
                  <div key={k.id} className="part-card">
                    <div className="part-card-image">
                      {k.image_url
                        ? <img src={k.image_url} alt={k.name} />
                        : <span className="part-card-image-placeholder">...imagem</span>}
                    </div>
                    <div className="part-card-body">
                      <div className="part-card-code">{k.code}</div>
                      <div className="part-card-name">{k.name}</div>
                      {k.assembly_name && (
                        <div style={{
                          fontSize: '0.74rem', fontWeight: 600, color: 'var(--teal-dark)',
                          background: 'rgba(0,169,157,0.08)', padding: '2px 8px',
                          borderRadius: 'var(--r-pill)', display: 'inline-block', marginTop: 4
                        }}>{k.assembly_name}</div>
                      )}
                      <div className="part-card-footer">
                        {k.price_visible
                          ? <span style={{ fontWeight: 700 }}>{fmtMoney(k.final_price)}</span>
                          : <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sob consulta</span>}
                        <button className="btn btn-primary btn-xs" onClick={() => handleAddKit(k)}>
                          <Plus size={14} /> Cotar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─────── EXTRA PHOTOS GALLERY ─────── */}
          {extraPhotos.length > 0 && (
            <>
              <div className="section-title-row" style={{ marginTop: 50, marginBottom: 14 }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                  <ImageIcon size={18} style={{ verticalAlign: -3, color: 'var(--teal-dark)' }} />{' '}
                  Galeria de fotos
                </h2>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Outras imagens enviadas no cadastro desta máquina.
                </p>
              </div>
              <div className="mmd-gallery">
                {extraPhotos.map(ph => (
                  <div key={ph.id} className="mmd-gallery-thumb" onClick={() => setLightbox(ph.image_url)}>
                    <img src={ph.image_url} alt="Foto da máquina" loading="lazy" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─────── CONJUNTOS CHIPS ─────── */}
          {machine.assemblies && machine.assemblies.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <div style={{
                fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10
              }}>
                Conjuntos cadastrados
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {machine.assemblies.map(asm => (
                  <span key={asm.id} className="chip teal">
                    {asm.custom_name || asm.assembly?.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Lightbox simples */}
        {lightbox && (
          <div
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(10,24,32,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 40, zIndex: 1000, cursor: 'zoom-out', backdropFilter: 'blur(6px)'
            }}
          >
            <img
              src={lightbox} alt=""
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}
            />
          </div>
        )}
      </section>
    </>
  )
}

/* ─────────── PathCard ─────────── */
function PathCard({
  kit, parts, services, isOpen, onToggle, onAdd,
  title, description, badge, icon, primary
}) {
  if (!kit) {
    return (
      <div className={`mmd-path-card is-disabled ${primary ? 'is-primary' : ''}`}>
        {badge && <div className="mmd-path-card-badge">{badge}</div>}
        <div className="mmd-path-card-head">
          <div className="mmd-path-icon">{icon}</div>
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
        <div className="mmd-path-empty-fill" />
        <div style={{
          padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 8,
          fontSize: '0.84rem', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <AlertCircle size={14} /> Ainda não disponível para este modelo
        </div>
      </div>
    )
  }

  const partCount = parts ? parts.length : (kit.item_count || 0)
  const serviceCount = services ? services.length : (kit.service_count || 0)
  const total = partCount + serviceCount

  return (
    <div className={`mmd-path-card ${primary ? 'is-primary' : ''}`}>
      {badge && <div className="mmd-path-card-badge">{badge}</div>}

      <div className="mmd-path-card-head">
        <div className="mmd-path-icon">{icon}</div>
        <h3>{title}</h3>
      </div>
      <p>{description}</p>

      <div className="mmd-path-stats">
        <span><Package size={13} /> <strong>{partCount}</strong> peça{partCount !== 1 && 's'}</span>
        <span><Wrench size={13} /> <strong>{serviceCount}</strong> serviço{serviceCount !== 1 && 's'}</span>
      </div>

      {kit.price_visible && <div className="mmd-path-price">{fmtMoney(kit.final_price)}</div>}

      {total > 0 && (
        <button type="button" className="mmd-included-toggle" onClick={onToggle} aria-expanded={isOpen}>
          <ListTree size={14} />
          <span>{isOpen ? 'Ocultar' : 'Ver'} o que está incluído</span>
          {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      )}

      {isOpen && (
        <div className="mmd-included-list">
          {parts && parts.length > 0 && (
            <div className="mmd-included-list-group">
              <div className="mmd-included-list-title"><Package size={11} /> Peças</div>
              <ul>
                {parts.map((it, i) => (
                  <li key={`p${i}`}>
                    <span className="qty">{it.quantity}×</span>
                    <span>
                      <span className="code">{it.part?.code}</span>{' '}
                      <span className="name">{it.part?.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {services && services.length > 0 && (
            <div className="mmd-included-list-group">
              <div className="mmd-included-list-title"><Wrench size={11} /> Serviços</div>
              <ul>
                {services.map((it, i) => (
                  <li key={`s${i}`}>
                    <span className="qty">{it.quantity}×</span>
                    <span>
                      <span className="code">{it.service?.code}</span>{' '}
                      <span className="name">{it.service?.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        className={primary ? 'btn btn-primary btn-block' : 'btn btn-outline btn-block'}
        onClick={onAdd}
        style={{ marginTop: 'auto' }}
      >
        <ShoppingCart size={16} /> Adicionar à cotação
      </button>
    </div>
  )
}
