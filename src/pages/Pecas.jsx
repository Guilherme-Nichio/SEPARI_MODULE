import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Package, Search, Plus, ChevronRight, ChevronDown,
  X, Filter, Settings, ShoppingCart, Layers, Info, Sparkles, Wrench, CheckCircle2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'

const fmtMoney = (v) => v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Pecas() {
  const { user } = useAuth()
  const { addPart, addKit } = useCart()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [allParts, setAllParts] = useState([])
  const [approvedMachines, setApprovedMachines] = useState([])
  const [selectedMachineId, setSelectedMachineId] = useState(searchParams.get('machine_id') || '')
  const [kits, setKits] = useState([])

  const [search, setSearch] = useState('')
  const [filterAssembly, setFilterAssembly] = useState('all')
  const [collapsed, setCollapsed] = useState({})

  useEffect(() => { if (user) loadAll() }, [user])

  useEffect(() => {
    if (selectedMachineId && approvedMachines.length > 0) {
      const m = approvedMachines.find(x => x.id === selectedMachineId)
      if (m) loadKitsForMachine(m)
    } else {
      setKits([])
    }
  }, [selectedMachineId, approvedMachines])

  const loadAll = async () => {
    setLoading(true)
    const [{ data: machinesData }, { data: visibleParts, error: pErr }] = await Promise.all([
      supabase
        .from('user_machines')
        .select('*, machine_model:machine_models(id, brand, model)')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false }),
      supabase.from('user_visible_parts').select('*')
    ])
    setApprovedMachines(machinesData || [])
    if (pErr) {
      toast.error('Erro ao carregar peças: ' + pErr.message)
      setAllParts([])
    } else {
      setAllParts(visibleParts || [])
    }
    setLoading(false)
  }

  const loadKitsForMachine = async (machine) => {
    const modelId = machine.machine_model?.id
    if (!modelId) return
    const { data: kitsData, error } = await supabase
      .from('user_visible_kits')
      .select('*')
      .eq('machine_model_id', modelId)
      .in('kit_type', ['preventive_complete', 'preventive_intermediate'])
    if (error) {
      console.error(error)
      setKits([])
      return
    }
    setKits(kitsData || [])
  }

  const handleSelectMachine = (id) => {
    setSelectedMachineId(id)
    setSearch('')
    setFilterAssembly('all')
    setSearchParams(id ? { machine_id: id } : {})
  }

  const partsForView = useMemo(() => {
    if (!selectedMachineId) return allParts
    const m = approvedMachines.find(x => x.id === selectedMachineId)
    if (!m) return allParts
    const label = `${m.machine_model?.brand} ${m.machine_model?.model}`
    return allParts.filter(p => (p.compatible_with || []).some(c => c === label))
  }, [allParts, selectedMachineId, approvedMachines])

  const filteredParts = useMemo(() => {
    return partsForView.filter(p => {
      if (search && !`${p.code} ${p.name} ${p.description || ''}`.toLowerCase().includes(search.toLowerCase())) return false
      if (filterAssembly !== 'all' && p.assembly_name !== filterAssembly) return false
      return true
    })
  }, [partsForView, search, filterAssembly])

  const grouped = useMemo(() => {
    const map = new Map()
    filteredParts.forEach(p => {
      const key = p.assembly_name || 'Sem conjunto'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(p)
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))
  }, [filteredParts])

  const assemblyOptions = useMemo(() => {
    return Array.from(new Set(partsForView.map(p => p.assembly_name).filter(Boolean))).sort()
  }, [partsForView])

  const toggleAssembly = (name) => setCollapsed(prev => ({ ...prev, [name]: !prev[name] }))

  const handleAddPart = (part, qty = 1) => {
    addPart(part, qty, selectedMachineId || null)
    toast.success(`${part.name} adicionado à cotação`)
  }

  const handleAddKit = (kit) => {
    addKit(kit, 1, selectedMachineId)
    toast.success(`${kit.name} adicionado à cotação`)
  }

  const selectedMachine = approvedMachines.find(m => m.id === selectedMachineId)
  const kitComplete = kits.find(k => k.kit_type === 'preventive_complete')
  const kitInter = kits.find(k => k.kit_type === 'preventive_intermediate')

  return (
    <section className="dashboard">
      <Seo title="Catálogo de Peças · Separi" noIndex />
      <div className="container" style={{ paddingBottom: 80 }}>

        <Breadcrumbs items={[{ label: 'Catálogo' }]} />

        <div className="dashboard-header">
          <h1>Catálogo de Peças</h1>
          <p>
            {selectedMachine
              ? <>Peças e kits compatíveis com sua <strong>{selectedMachine.machine_model?.brand} {selectedMachine.machine_model?.model}</strong>.</>
              : 'Todas as peças disponíveis. Selecione uma das suas máquinas para filtrar e ver kits prontos.'
            }
          </p>
        </div>

        {/* ━━━━━━━ FILTRO POR MÁQUINA (opcional) ━━━━━━━ */}
        {approvedMachines.length > 0 && (
          <div className="catalog-machine-picker catalog-machine-picker-soft">
            <div className="catalog-machine-picker-head">
              <div className="catalog-machine-picker-label">
                <Settings size={16} />
                <span>Filtrar por minha máquina</span>
              </div>
              <span className="catalog-machine-picker-hint">
                <Info size={13} /> Selecionar uma máquina mostra peças compatíveis e kits prontos pra ela
              </span>
            </div>

            <div className="catalog-machine-chips">
              <button
                type="button"
                className={`catalog-machine-chip ${!selectedMachineId ? 'active' : ''}`}
                onClick={() => handleSelectMachine('')}
              >
                <Layers size={14} />
                <span>Todas as peças</span>
                <span className="catalog-machine-chip-count">{allParts.length}</span>
              </button>
              {approvedMachines.map(m => {
                const label = `${m.machine_model?.brand} ${m.machine_model?.model}`
                const active = m.id === selectedMachineId
                const compatCount = allParts.filter(p => (p.compatible_with || []).some(c => c === label)).length
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`catalog-machine-chip ${active ? 'active' : ''}`}
                    onClick={() => handleSelectMachine(m.id)}
                  >
                    {active && <CheckCircle2 size={14} />}
                    <div className="catalog-machine-chip-text">
                      <span className="catalog-machine-chip-brand">{m.machine_model?.brand}</span>
                      <span className="catalog-machine-chip-model">{m.machine_model?.model}</span>
                    </div>
                    <span className="catalog-machine-chip-count">{compatCount}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {!loading && approvedMachines.length === 0 && (
          <div className="catalog-no-machines-hint">
            <Info size={16} />
            <span>
              Você ainda não tem máquinas aprovadas. <Link to="/perfil/maquinas/nova">Cadastre uma agora</Link> para
              filtrar o catálogo e desbloquear kits prontos.
            </span>
          </div>
        )}

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : (
          <>
            {/* ━━━━━━━ KITS (só quando máquina selecionada) ━━━━━━━ */}
            {selectedMachine && (kitComplete || kitInter) && (
              <>
                <div className="cta-explain-banner" style={{ marginTop: 24 }}>
                  <div className="cta-explain-banner-icon"><Sparkles size={18} /></div>
                  <div>
                    <strong>Kits prontos para sua {selectedMachine?.machine_model?.brand} {selectedMachine?.machine_model?.model}</strong>
                    <p>
                      Pacotes pré-montados pela nossa equipe técnica com as <strong>peças críticas</strong> e os <strong>serviços recomendados</strong> para revisão preventiva.
                    </p>
                  </div>
                </div>

                <div className="catalog-kit-strip">
                  {kitComplete && (
                    <KitStripCard
                      kit={kitComplete}
                      title="Kit Completo"
                      description="Revisão preventiva total, todas as peças críticas e serviços recomendados."
                      badge="Mais completo"
                      primary
                      accentClass="cta-accent-teal"
                      icon={<Package size={22} />}
                      onAdd={() => handleAddKit(kitComplete)}
                    />
                  )}
                  {kitInter && (
                    <KitStripCard
                      kit={kitInter}
                      title="Kit Intermediário"
                      description="Manutenção parcial com as peças e serviços essenciais."
                      accentClass="cta-accent-cyan"
                      icon={<Layers size={22} />}
                      onAdd={() => handleAddKit(kitInter)}
                    />
                  )}
                </div>
              </>
            )}

            {/* ━━━━━━━ BUSCA + CONTADOR ━━━━━━━ */}
            <div className="parts-page-head" style={{ marginTop: 30 }}>
              <div className="parts-page-search">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar por código, nome ou descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                <strong>{filteredParts.length}</strong> de {partsForView.length} peça{partsForView.length !== 1 && 's'}
              </div>
            </div>

            <div className="parts-page-layout">
              <aside className="parts-page-sidebar">
                <h3><Filter size={14} /> Conjunto mecânico</h3>
                <div
                  className={`filter-item ${filterAssembly === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterAssembly('all')}
                >
                  Todos
                  <span className="filter-count">{partsForView.length}</span>
                </div>
                {assemblyOptions.map(name => (
                  <div
                    key={name}
                    className={`filter-item ${filterAssembly === name ? 'active' : ''}`}
                    onClick={() => setFilterAssembly(name)}
                  >
                    {name}
                    <span className="filter-count">{partsForView.filter(p => p.assembly_name === name).length}</span>
                  </div>
                ))}
              </aside>

              <div>
                {filteredParts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon"><Package size={48} /></div>
                    <h3>Nenhuma peça encontrada</h3>
                    <p>{partsForView.length === 0
                      ? selectedMachine
                        ? 'Ainda não há peças cadastradas para esta máquina específica.'
                        : 'Ainda não há peças disponíveis no catálogo.'
                      : 'Tente ajustar a busca ou o conjunto selecionado.'}</p>
                  </div>
                ) : (
                  <div className="parts-accordion">
                    {grouped.map(([asmName, asmParts]) => {
                      const isCollapsed = !!collapsed[asmName]
                      return (
                        <div className="parts-accordion-group" key={asmName}>
                          <button
                            type="button"
                            className="parts-accordion-head"
                            onClick={() => toggleAssembly(asmName)}
                          >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                            <span className="parts-accordion-title">{asmName}</span>
                            <span className="parts-accordion-count">{asmParts.length}</span>
                          </button>
                          {!isCollapsed && (
                            <div className="parts-grid" style={{ padding: '12px 4px 4px' }}>
                              {asmParts.map(p => {
                                const stockClass = p.stock > 5 ? 'in-stock' : p.stock > 0 ? 'low' : 'out'
                                const stockText = p.stock > 5 ? 'Em estoque' : p.stock > 0 ? 'Últimas un.' : 'Sob consulta'
                                return (
                                  <div key={p.id} className="part-card" onClick={() => navigate(`/pecas/${p.id}`)}>
                                    <div className="part-card-image">
                                      {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <span className="part-card-image-placeholder">...imagem</span>}
                                    </div>
                                    <div className="part-card-body">
                                      <div className="part-card-code">{p.code}</div>
                                      <div className="part-card-name">{p.name}</div>
                                      {p.category && <div className="part-card-category">{p.category}</div>}

                                      <div className="part-card-priceline">
                                        {p.price_visible && p.price > 0
                                          ? <span className="part-card-price">{fmtMoney(p.price)}</span>
                                          : <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sob consulta</span>
                                        }
                                        <span className={`part-card-stock ${stockClass}`}>● {stockText}</span>
                                      </div>

                                      <button
                                        className="btn btn-primary btn-xs"
                                        style={{ width: '100%', marginTop: 8 }}
                                        onClick={(e) => { e.stopPropagation(); handleAddPart(p) }}
                                      >
                                        <Plus size={14} /> Adicionar à cotação
                                      </button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function KitStripCard({ kit, title, description, badge, primary, accentClass, icon, onAdd }) {
  const partCount = kit.item_count || 0
  const serviceCount = kit.service_count || 0
  return (
    <div className={`catalog-kit-card ${accentClass} ${primary ? 'is-primary' : ''}`}>
      {badge && <div className="catalog-kit-card-badge">{badge}</div>}
      <div className="catalog-kit-card-icon">{icon}</div>
      <div className="catalog-kit-card-body">
        <h4>{title}</h4>
        <p>{description}</p>
        <div className="catalog-kit-card-stats">
          <span><Package size={12} /> {partCount} peça{partCount !== 1 && 's'}</span>
          <span><Wrench size={12} /> {serviceCount} serviço{serviceCount !== 1 && 's'}</span>
          {kit.price_visible && <span className="catalog-kit-card-price">{fmtMoney(kit.final_price)}</span>}
        </div>
      </div>
      <button
        className={primary ? 'btn btn-primary' : 'btn btn-outline'}
        onClick={onAdd}
      >
        <ShoppingCart size={14} /> Cotar este kit
      </button>
    </div>
  )
}
