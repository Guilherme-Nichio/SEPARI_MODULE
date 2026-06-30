import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import {
  Package, Search, Plus, ChevronRight, ChevronDown,
  X, Filter, Settings, ShoppingCart, Layers, Info, Sparkles, Wrench, CheckCircle2,
  LogIn, Lock, ArrowRight, Check, Truck
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Reveal from '../components/Reveal'
import ImageSlot from '../components/ImageSlot'
import Seo from '../components/Seo'
import WhatsAppIcon from '../components/WhatsAppIcon'
import MachineFinder from '../components/MachineFinder'
import {
  PARTS_STATS, PARTS_MACHINES, PARTS_GUIDE, PARTS_BRANDS, PARTS_MODELS, PARTS_KITS
} from '../data/partsGuide.js'
import {
  CircleDot, CircleDashed, Layers as LayersIc, Disc3, Minus, Droplets,
  Cylinder, RotateCw, ShieldCheck, Share2
} from 'lucide-react'

const PART_ICONS = { CircleDot, CircleDashed, Layers: LayersIc, Disc3, Minus, Droplets, Cylinder, RotateCw, Settings, ShieldCheck, Share2 }

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

// Marcas principais para navegação rápida (alfa e gea primeiro)
const BRAND_LINKS = [
  { name: 'Alfa Laval', slug: 'alfa-laval' },
  { name: 'GEA Westfalia', slug: 'gea-westfalia' },
  { name: 'Tetra Pak', slug: 'tetra-pak' },
  { name: 'Seital', slug: 'seital' },
  { name: 'Mitsubishi', slug: 'mitsubishi' },
  { name: 'Pieralisi', slug: 'pieralisi' },
  { name: 'Flottweg', slug: 'flottweg' }
]

// Kits de serviço — do menor para o maior (círculos concêntricos)
const KIT_RINGS = [
  { name: 'Kit Menor', tag: 'Minor service', desc: 'Gaxetas, O-rings e vedações para a manutenção preventiva de rotina.' },
  { name: 'Kit Intermediário', tag: 'Intermediate', desc: 'Inclui o kit menor + itens de desgaste intermediários e elementos do bowl.' },
  { name: 'Kit Maior', tag: 'Major service', desc: 'Inclui o intermediário + tudo para a revisão geral anual do equipamento.' }
]

const fmtMoney = (v) => v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Pecas() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { addPart, addKit } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [allParts, setAllParts] = useState([])
  const [approvedMachines, setApprovedMachines] = useState([])
  const [selectedMachineId, setSelectedMachineId] = useState(searchParams.get('machine_id') || '')
  const [kits, setKits] = useState([])

  const [search, setSearch] = useState('')
  const [filterAssembly, setFilterAssembly] = useState('all')
  const [collapsed, setCollapsed] = useState({})
  const [partsTab, setPartsTab] = useState('disc-stack')

  useEffect(() => { if (user) loadAll(); else setLoading(false) }, [user])

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

  // Admin usa o painel, não o catálogo do cliente
  if (isAdmin) return <Navigate to="/admin/pecas" replace />

  // Visitante sem login: página de conteúdo de peças + CTA para o catálogo
  if (!isAuthenticated) {
    const activeMachine = PARTS_MACHINES.find(m => m.key === partsTab) || PARTS_MACHINES[0]
    return (
      <div className="pcx">
        <Seo
          title="Peças para Centrífugas e Separadores · Alfa Laval, GEA, Tetra Pak | Separi"
          description="Peças OEM e equivalentes para separadores e centrífugas de disco, decanter e bowl de câmaras. +20.000 itens em estoque, compatíveis com Alfa Laval, GEA Westfalia, Tetra Pak, Seital e Mitsubishi."
        />

        {/* HERO (distinto: escuro, com seletor de máquina) */}
        <section className="pcx-hero pcx-hero-dark">
          <div className="pcx-hero-glow" aria-hidden="true" />
          <div className="pcx-hero-grid-bg" aria-hidden="true" />
          <div className="container">
            <nav className="sb-crumbs pcx-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link><span>/</span><span>Peças</span>
            </nav>
            <div className="pcx-hero-split">
              <div className="pcx-hero-left">
                <h1>Encontre as peças certas para a <span className="text-gradient">sua centrífuga</span></h1>
                <p>
                  Mais de 20.000 itens OEM e equivalentes homologados. Selecione a sua máquina
                  e abra a página com peças, kits e serviço sob medida.
                </p>
                <ul className="pcx-hero-feats">
                  <li><CheckCircle2 size={18} /> +20.000 peças em estoque</li>
                  <li><ShieldCheck size={18} /> OEM ou equivalente homologado</li>
                  <li><Truck size={18} /> Entrega para toda a América Latina</li>
                  <li><Check size={18} /> Garantia de 3 meses</li>
                </ul>
                <div className="pcx-hero-ctas">
                  <Link to="/registro" className="btn btn-ghost-light btn-lg"><LogIn size={16} /> Entrar e ver o catálogo completo</Link>
                </div>
              </div>

              <div className="pcx-hero-right">
                <div className="pcx-finder-head">
                  <h2>Encontre a sua máquina</h2>
                  <p>Em 3 passos você chega à página da sua centrífuga.</p>
                </div>
                <MachineFinder />
              </div>
            </div>
          </div>
        </section>

        {/* MARCAS */}
        <section className="pcx-brands">
          <div className="container"><span className="sv-brands-label">Compatível com as principais marcas</span></div>
          <div className="sv-brands-wrap">
            <div className="sv-brands-track">
              {[...PARTS_BRANDS, ...PARTS_BRANDS].map((b, i) => <span className="sv-brand" key={i}>{b}</span>)}
            </div>
          </div>
        </section>

        {/* O QUE PODEMOS OFERECER (subabas) */}
        <section id="oferta" className="section-padding bg-white">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="text-center mb-50">
                <h2 className="section-title">O que podemos <span className="text-gradient">oferecer</span></h2>
                <p className="text-lg max-width-text">
                  Cada arquitetura de separação tem o seu próprio conjunto de componentes.
                  Escolha o tipo da sua máquina e explore o que fornecemos — clique em cada item
                  para ver em detalhe a função e os sinais de desgaste.
                </p>
              </div>
            </Reveal>

            <div className="pcx-tabs" role="tablist">
              {PARTS_MACHINES.map(m => (
                <button
                  key={m.key} role="tab" aria-selected={partsTab === m.key}
                  className={`pcx-tab ${partsTab === m.key ? 'active' : ''}`}
                  onClick={() => setPartsTab(m.key)}
                >
                  {m.name}
                </button>
              ))}
            </div>

            <div className="pcx-machine">
              <p className="pcx-machine-tag">{activeMachine.tag}</p>
              <p className="pcx-machine-desc">{activeMachine.desc}</p>
              <div className="pcx-parts">
                {activeMachine.parts.map((slug, i) => {
                  const g = PARTS_GUIDE[slug]; if (!g) return null
                  const waPart = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Quero cotar: ${g.name}`)}`
                  return (
                    <div key={slug} className="pcx-part">
                      <ImageSlot src={`/pecas/${slug}.jpg`} alt={g.name} className="pcx-part-img" />
                      <div className="pcx-part-body">
                        <h3>{g.name}</h3>
                        <p>{g.short}</p>
                      </div>
                      <div className="part-actions">
                        <a
                          className="part-wa" href={waPart} target="_blank" rel="noopener noreferrer"
                          aria-label={`Falar no WhatsApp sobre ${g.name}`}
                        >
                          <WhatsAppIcon size={18} />
                        </a>
                        <Link to="/login" state={{ from: { pathname: '/pecas' } }} className="part-bar">
                          Entrar
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* OEM OU EQUIVALENTE */}
        <section className="section-padding bg-subtle">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="text-center mb-50">
                <h2 className="section-title">OEM ou <span className="text-gradient">equivalente</span>? Você decide</h2>
                <p className="text-lg max-width-text">
                  Trabalhamos com as duas opções e detalhamos a origem de cada item no orçamento.
                  A escolha — e a economia — fica com você, sem abrir mão da compatibilidade.
                </p>
              </div>
            </Reveal>
            <div className="pcx-compare">
              <Reveal variant="fade-right">
                <div className="pcx-compare-card">
                  <span className="pcx-compare-badge">Peça OEM</span>
                  <p>A peça original do fabricante, indicada quando a especificação exige a marca de origem ou quando a máquina ainda está em garantia de fábrica.</p>
                  <ul>
                    <li><Check size={16} /> Marca original do fabricante</li>
                    <li><Check size={16} /> Indicada para garantia de fábrica</li>
                    <li><Check size={16} /> Rastreabilidade total</li>
                  </ul>
                </div>
              </Reveal>
              <Reveal variant="fade-left" delay={120}>
                <div className="pcx-compare-card pcx-compare-card-dark">
                  <span className="pcx-compare-badge">Equivalente homologado</span>
                  <p>Peça aftermarket inspecionada e homologada pela nossa engenharia, 100% compatível com o original — desempenho equivalente com economia real.</p>
                  <ul>
                    <li><Check size={16} /> 100% compatível com OEM</li>
                    <li><Check size={16} /> Inspeção rigorosa de qualidade</li>
                    <li><Check size={16} /> Economia sem perder confiabilidade</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* INTERVALO DE MANUTENÇÃO */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="pcx-interval">
              <Reveal variant="fade-right">
                <div className="pcx-interval-text">
                  <h2 className="section-title">Quando trocar as <span className="text-gradient">peças de desgaste</span></h2>
                  <p className="text-lg mt-20">
                    Como referência geral, todo separador de alta rotação deve receber algum nível
                    de serviço a cada <strong>8.000 horas de operação ou a cada 12 meses</strong> —
                    o que vier primeiro. Respeitar o intervalo evita parada não planejada e protege
                    o produto.
                  </p>
                  <p className="mt-12">
                    Os itens de desgaste (vedações, gaxetas, O-rings, rolamentos, correia, sapatas
                    de fricção) são os primeiros a pedir atenção e formam a base dos kits de serviço.
                  </p>
                </div>
              </Reveal>
              <Reveal variant="fade-left" delay={120}>
                <div className="pcx-interval-signs">
                  <span className="pcx-interval-signs-head">Sinais de que está na hora</span>
                  <ul>
                    <li><span className="pcx-sign-dot" /> Vibração ou ruído acima do normal</li>
                    <li><span className="pcx-sign-dot" /> Queda de rendimento na separação</li>
                    <li><span className="pcx-sign-dot" /> Vazamentos e contaminação entre fases</li>
                    <li><span className="pcx-sign-dot" /> Aumento da temperatura de mancal</li>
                    <li><span className="pcx-sign-dot" /> Partida lenta ou patinando</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* KITS DE SERVIÇO */}
        <section className="section-padding bg-subtle">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="text-center mb-50">
                <h2 className="section-title">Kits de <span className="text-gradient">serviço</span></h2>
                <p className="text-lg max-width-text">Tudo o que cada nível de manutenção pede, reunido num único código.</p>
              </div>
            </Reveal>
            <div className="kit-rings">
              <div className="kit-rings-visual" aria-hidden="true">
                <div className="kit-ring kit-ring-3">
                  <span className="kit-ring-tag">Maior</span>
                  <div className="kit-ring kit-ring-2">
                    <span className="kit-ring-tag">Intermediário</span>
                    <div className="kit-ring kit-ring-1">
                      <span className="kit-ring-tag">Menor</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kit-rings-legend">
                {KIT_RINGS.map((k, i) => (
                  <Reveal key={i} variant="fade-up" delay={i * 90}>
                    <div className={`kit-rings-item kit-rings-item-${i + 1}`}>
                      <span className="kit-rings-dot" />
                      <div className="kit-rings-item-body">
                        <span className="kit-rings-item-tag">{k.tag}</span>
                        <strong>{k.name}</strong>
                        <p>{k.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* POR QUE SEPARI */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="pcx-why">
              <Reveal variant="fade-right">
                <div className="pcx-why-text">
                  <h2 className="section-title">Qualidade <span className="text-gradient">comprovada</span></h2>
                  <p className="text-lg mt-20">
                    Cada peça nova passa por inspeção rigorosa antes de entrar no estoque. Você
                    escolhe entre OEM e equivalente homologado — sempre com a origem detalhada no
                    orçamento e a decisão no seu controle.
                  </p>
                  <ul className="pcx-why-list">
                    <li><Check size={18} /> +20.000 peças físicas em estoque</li>
                    <li><Check size={18} /> 100% compatíveis com OEM</li>
                    <li><Check size={18} /> Garantia de 3 meses em itens de não-desgaste</li>
                    <li><Check size={18} /> Engenharia que indica a peça certa para o seu modelo</li>
                  </ul>
                </div>
              </Reveal>
              <Reveal variant="fade-left" delay={120}>
                <div className="pcx-models">
                  <span className="pcx-models-label">Marcas que atendemos</span>
                  <div className="pcx-models-chips">
                    {BRAND_LINKS.map((b) => (
                      <Link key={b.slug} to={`/fabricantes/${b.slug}`} className="pc-chip pc-chip-link">
                        {b.name} <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ PEÇAS */}
        <section className="section-padding bg-subtle">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="text-center mb-50">
                <h2 className="section-title">Perguntas <span className="text-gradient">frequentes</span></h2>
              </div>
            </Reveal>
            <div className="pcx-faq">
              {[
                { q: 'Vocês têm peça para o meu modelo?', a: 'Trabalhamos com as principais linhas de Alfa Laval, GEA Westfalia, Tetra Pak, Seital, Mitsubishi, Pieralisi e Flottweg, com mais de 20.000 itens em estoque. Cadastre a sua máquina e a engenharia confirma os itens compatíveis.' },
                { q: 'A peça equivalente tem garantia?', a: 'Sim. As peças equivalentes são homologadas pela nossa engenharia e 100% compatíveis com o original, com garantia de 3 meses nos itens de não-desgaste.' },
                { q: 'Qual a diferença entre OEM e equivalente?', a: 'A OEM é a peça original do fabricante; a equivalente é uma peça aftermarket inspecionada e homologada, com desempenho equivalente e custo menor. Detalhamos a origem de cada item no orçamento.' },
                { q: 'Como vejo preços e disponibilidade?', a: 'Os itens, preços e kits compatíveis ficam no catálogo, liberado após o cadastro da sua máquina. Assim a engenharia mostra só o que serve para o seu equipamento.' }
              ].map((f, i) => (
                <Reveal key={i} variant="fade-up" delay={i * 60}>
                  <details className="pcx-faq-item">
                    <summary>{f.q}<ChevronDown size={18} /></summary>
                    <p>{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / CATÁLOGO (gate) */}
        <section className="section-padding bg-subtle">
          <div className="container">
            <div className="pc-cta">
              <div className="pc-cta-text">
                <span className="pc-cta-kicker"><Lock size={14} /> Catálogo liberado após cadastro</span>
                <h3>Entre e veja o catálogo completo</h3>
                <p>
                  Os itens, preços e kits compatíveis com a sua máquina ficam disponíveis após o
                  login. Ainda não tem conta? Cadastre o seu equipamento e a nossa engenharia
                  libera o catálogo certo para ele.
                </p>
              </div>
              <div className="pc-cta-actions">
                <Link to="/login" state={{ from: { pathname: '/pecas' } }} className="btn btn-primary btn-lg"><LogIn size={16} /> Fazer login</Link>
                <Link to="/registro" className="btn btn-outline btn-lg">Criar conta <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

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
                                  <div key={p.id} className="part-card">
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

                                      <div className="part-actions">
                                        <a
                                          className="part-wa"
                                          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Quero cotar a peça ${p.code} — ${p.name}`)}`}
                                          target="_blank" rel="noopener noreferrer"
                                          aria-label={`Falar no WhatsApp sobre ${p.name}`}
                                        >
                                          <WhatsAppIcon size={18} />
                                        </a>
                                        <button
                                          type="button" className="part-bar"
                                          onClick={(e) => { e.stopPropagation(); handleAddPart(p) }}
                                        >
                                          <Plus size={15} /> Adicionar à cotação
                                        </button>
                                      </div>
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
