/* ============================================================================
   src/site/pages/CatalogoPage.jsx  —  CATÁLOGO DE PEÇAS (pós-login)

   Rota: /catalogo  (protegida por CustomerRoute)

   É a mesma funcionalidade que existia na área logada da antiga /pecas —
   filtro por máquina aprovada, kits prontos, busca, filtro por conjunto
   mecânico, adicionar à cotação — só que agora com a casca do site novo:
   mesma nav, mesmo rodapé, mesma tipografia, mesmos botões.

   CSS: styles/site/catalogo.css, escopado em .sep-catalogo.
   ========================================================================== */
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import SiteLayout from '../SiteLayout'
import { R, external } from '../routes'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { WHATSAPP_DIGITS } from '../siteConfig'

/* O número comercial vive em src/site/siteConfig.ts. Antes ele vinha da
   variável VITE_WHATSAPP_NUMBER, que estava com outra linha no .env e
   mandava os cliques para um número que não é o de vendas. */
const WHATSAPP = WHATSAPP_DIGITS

const fmtMoney = (v) =>
  v == null ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`

export default function CatalogoPage() {
  const { user, signOut } = useAuth()
  const { addPart, addKit, itemCount } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const [loading, setLoading] = useState(true)
  const [allParts, setAllParts] = useState([])
  const [approvedMachines, setApprovedMachines] = useState([])
  const [kits, setKits] = useState([])
  const [selectedMachineId, setSelectedMachineId] = useState(searchParams.get('machine_id') || '')

  const [search, setSearch] = useState('')
  const [filterAssembly, setFilterAssembly] = useState('all')
  const [collapsed, setCollapsed] = useState({})

  /* ── carga inicial ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!user) { setLoading(false); return }
    let vivo = true

    ;(async () => {
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
      if (!vivo) return
      setApprovedMachines(machinesData || [])
      if (pErr) {
        toast.error('Erro ao carregar peças: ' + pErr.message)
        setAllParts([])
      } else {
        setAllParts(visibleParts || [])
      }
      setLoading(false)
    })()

    return () => { vivo = false }
  }, [user])

  /* ── kits da máquina selecionada ───────────────────────────────────────── */
  useEffect(() => {
    let vivo = true
    const machine = approvedMachines.find((x) => x.id === selectedMachineId)
    const modelId = machine?.machine_model?.id
    if (!modelId) { setKits([]); return }

    ;(async () => {
      const { data, error } = await supabase
        .from('user_visible_kits')
        .select('*')
        .eq('machine_model_id', modelId)
        .in('kit_type', ['preventive_complete', 'preventive_intermediate'])
      if (!vivo) return
      setKits(error ? [] : (data || []))
    })()

    return () => { vivo = false }
  }, [selectedMachineId, approvedMachines])

  const handleSelectMachine = (id) => {
    setSelectedMachineId(id)
    setSearch('')
    setFilterAssembly('all')
    setSearchParams(id ? { machine_id: id } : {}, { replace: true })
  }

  /* ── derivados ─────────────────────────────────────────────────────────── */
  const selectedMachine = approvedMachines.find((m) => m.id === selectedMachineId)

  const partsForView = useMemo(() => {
    if (!selectedMachine) return allParts
    const label = `${selectedMachine.machine_model?.brand} ${selectedMachine.machine_model?.model}`
    return allParts.filter((p) => (p.compatible_with || []).some((c) => c === label))
  }, [allParts, selectedMachine])

  const filteredParts = useMemo(() => {
    const q = search.toLowerCase()
    return partsForView.filter((p) => {
      if (q && !`${p.code} ${p.name} ${p.description || ''}`.toLowerCase().includes(q)) return false
      if (filterAssembly !== 'all' && p.assembly_name !== filterAssembly) return false
      return true
    })
  }, [partsForView, search, filterAssembly])

  const grouped = useMemo(() => {
    const map = new Map()
    filteredParts.forEach((p) => {
      const key = p.assembly_name || 'Sem conjunto'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(p)
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))
  }, [filteredParts])

  const assemblyOptions = useMemo(
    () => Array.from(new Set(partsForView.map((p) => p.assembly_name).filter(Boolean))).sort(),
    [partsForView]
  )

  const kitComplete = kits.find((k) => k.kit_type === 'preventive_complete')
  const kitInter = kits.find((k) => k.kit_type === 'preventive_intermediate')

  const toggleAssembly = (name) => setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }))

  const handleAddPart = (part) => {
    addPart(part, 1, selectedMachineId || null)
    toast.success(`${part.name} adicionado à cotação`)
  }

  const handleAddKit = (kit) => {
    addKit(kit, 1, selectedMachineId)
    toast.success(`${kit.name} adicionado à cotação`)
  }

  return (
    <SiteLayout page="catalogo">
      {/* ── BARRA DA ÁREA DO CLIENTE ────────────────────────────────────── */}
      <div className="cli_bar">
        <div className="wrap">
          <nav className="cli_links" aria-label="Área do cliente">
            <Link to={R.perfil}>Minhas máquinas</Link>
            <Link to={R.catalogo} className="is_on" aria-current="page">Catálogo</Link>
            <Link to={R.meusPedidos}>Meus pedidos</Link>
          </nav>
          <div className="cli_side">
            <Link className="cli_cart" to={R.cotacao}>
              Ver cotação
              {itemCount > 0 && <span className="cli_count">{itemCount}</span>}
            </Link>
            {/* o "Sair" vivia no menu de usuário da navbar antiga, que esta
                página nunca montou. Agora ele existe aqui também. */}
            <button type="button" className="cli_out" onClick={handleSignOut}>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* ── CABEÇALHO ───────────────────────────────────────────────────── */}
      <header className="cat_head">
        <div className="wrap">
          <div className="crumbs">
            <Link to={R.home}>Início</Link> / Catálogo de peças
          </div>
          <h1>Catálogo de peças.</h1>
          <p className="lead">
            {selectedMachine
              ? <>Peças e kits compatíveis com a sua <strong>{selectedMachine.machine_model?.brand} {selectedMachine.machine_model?.model}</strong>.</>
              : 'Tudo o que está liberado para a sua conta. Selecione uma das suas máquinas para filtrar e abrir os kits prontos.'}
          </p>
        </div>
      </header>

      <section className="cat_main">
        <div className="wrap">

          {/* ── FILTRO POR MÁQUINA ── */}
          {approvedMachines.length > 0 && (
            <div className="mach_picker">
              <div className="mach_picker_head">
                <strong>Filtrar pela minha máquina</strong>
                <span>Escolher uma máquina mostra só peças compatíveis e libera os kits prontos.</span>
              </div>
              <div className="mach_chips">
                <button
                  type="button"
                  className={`mach_chip${!selectedMachineId ? ' is_on' : ''}`}
                  onClick={() => handleSelectMachine('')}
                >
                  <span className="mach_chip_txt"><em>Todas as peças</em></span>
                  <span className="mach_chip_n">{allParts.length}</span>
                </button>

                {approvedMachines.map((m) => {
                  const label = `${m.machine_model?.brand} ${m.machine_model?.model}`
                  const n = allParts.filter((p) => (p.compatible_with || []).some((c) => c === label)).length
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={`mach_chip${m.id === selectedMachineId ? ' is_on' : ''}`}
                      onClick={() => handleSelectMachine(m.id)}
                    >
                      <span className="mach_chip_txt">
                        <span className="mach_chip_brand">{m.machine_model?.brand}</span>
                        <em>{m.machine_model?.model}</em>
                      </span>
                      <span className="mach_chip_n">{n}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {!loading && approvedMachines.length === 0 && (
            <div className="cat_note">
              Você ainda não tem máquinas aprovadas.{' '}
              <Link to={R.maquinaNova}>Cadastre uma agora</Link> para filtrar o catálogo e
              desbloquear os kits prontos.
            </div>
          )}

          {/* ── KITS ── */}
          {selectedMachine && (kitComplete || kitInter) && (
            <div className="kits_row">
              {kitComplete && (
                <KitCard
                  kit={kitComplete}
                  title="Kit completo"
                  desc="Revisão preventiva total: todas as peças críticas e os serviços recomendados para o seu modelo."
                  badge="Mais completo"
                  primary
                  onAdd={() => handleAddKit(kitComplete)}
                />
              )}
              {kitInter && (
                <KitCard
                  kit={kitInter}
                  title="Kit intermediário"
                  desc="Manutenção parcial com as peças e os serviços essenciais entre revisões gerais."
                  onAdd={() => handleAddKit(kitInter)}
                />
              )}
            </div>
          )}

          {/* ── BUSCA ── */}
          <div className="cat_tools">
            <div className="cat_search">
              <input
                type="search"
                value={search}
                placeholder="Buscar por código, nome ou descrição…"
                aria-label="Buscar peça"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="cat_count">
              {loading ? 'Carregando…' : <><strong>{filteredParts.length}</strong> de {partsForView.length} peças</>}
            </span>
          </div>

          {/* ── LAYOUT: FILTROS + LISTA ── */}
          <div className="cat_layout">
            <aside className="cat_side">
              <h3>Conjunto mecânico</h3>
              <button
                type="button"
                className={`side_item${filterAssembly === 'all' ? ' is_on' : ''}`}
                onClick={() => setFilterAssembly('all')}
              >
                Todos <span>{partsForView.length}</span>
              </button>
              {assemblyOptions.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`side_item${filterAssembly === name ? ' is_on' : ''}`}
                  onClick={() => setFilterAssembly(name)}
                >
                  {name} <span>{partsForView.filter((p) => p.assembly_name === name).length}</span>
                </button>
              ))}

              <div className="side_help">
                <p>Não achou a peça?</p>
                <a className="btn btn_line" {...external} href={wa('Olá! Não encontrei uma peça no catálogo e preciso de ajuda.')}>
                  Falar com a engenharia
                </a>
              </div>
            </aside>

            <div className="cat_list">
              {loading ? (
                <div className="grid_parts">
                  {[0, 1, 2, 3].map((i) => <div key={i} className="part_skel" />)}
                </div>
              ) : filteredParts.length === 0 ? (
                <div className="aviso">
                  <h3>Nenhuma peça encontrada.</h3>
                  <p>
                    {partsForView.length === 0
                      ? selectedMachine
                        ? 'Ainda não há peças cadastradas para esta máquina específica.'
                        : 'Ainda não há peças liberadas para a sua conta.'
                      : 'Ajuste a busca ou o conjunto selecionado.'}
                  </p>
                  <div className="aviso_acts">
                    <a className="btn btn_solid" {...external} href={wa('Olá! Quero cotar peças para a minha centrífuga.')}>
                      Pedir cotação no WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                grouped.map(([asmName, asmParts]) => {
                  const fechado = !!collapsed[asmName]
                  return (
                    <div className="asm" key={asmName}>
                      <button type="button" className="asm_head" onClick={() => toggleAssembly(asmName)}>
                        <span className={`asm_caret${fechado ? '' : ' is_open'}`} aria-hidden="true">›</span>
                        <span className="asm_title">{asmName}</span>
                        <span className="asm_n">{asmParts.length}</span>
                      </button>

                      {!fechado && (
                        <div className="grid_parts">
                          {asmParts.map((p) => (
                            <PartCard key={p.id} p={p} onAdd={() => handleAddPart(p)} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
      <section className="cat_cta">
        <div className="wrap">
          <div className="cta_box">
            <div>
              <h2>Montou a sua lista?</h2>
              <p className="lead">
                Feche a cotação e a engenharia retorna com preço, prazo e alternativas
                equivalentes homologadas quando fizer sentido.
              </p>
            </div>
            <div className="cta_acts">
              <Link className="btn btn_solid" to={R.cotacao}>
                Ver cotação{itemCount > 0 ? ` (${itemCount})` : ''}
              </Link>
              <Link className="btn btn_line" to={R.perfil}>Minhas máquinas</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

/* ──────────────────────────────────────────────────────────────────────── */

function KitCard({ kit, title, desc, badge, primary, onAdd }) {
  return (
    <div className={`kitc${primary ? ' is_feat' : ''}`}>
      {badge && <span className="kitc_badge">{badge}</span>}
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="kitc_stats">
        <span>{kit.item_count || 0} peças</span>
        <span>{kit.service_count || 0} serviços</span>
        {kit.price_visible && <span className="kitc_price">{fmtMoney(kit.final_price)}</span>}
      </div>
      <button type="button" className={`btn ${primary ? 'btn_solid' : 'btn_line'}`} onClick={onAdd}>
        Cotar este kit
      </button>
    </div>
  )
}

function PartCard({ p, onAdd }) {
  const nivel = p.stock > 5 ? 'ok' : p.stock > 0 ? 'low' : 'out'
  const texto = p.stock > 5 ? 'Em estoque' : p.stock > 0 ? 'Últimas unidades' : 'Sob consulta'

  return (
    <article className="partc">
      <div className="partc_pic">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} loading="lazy" />
          : <span className="partc_ph">sem foto</span>}
      </div>
      <div className="partc_body">
        <span className="partc_code">{p.code}</span>
        <h4>{p.name}</h4>
        {p.category && <span className="partc_cat">{p.category}</span>}

        <div className="partc_line">
          {p.price_visible && p.price > 0
            ? <span className="partc_price">{fmtMoney(p.price)}</span>
            : <span className="partc_price is_quote">Sob consulta</span>}
          <span className={`partc_stock is_${nivel}`}>{texto}</span>
        </div>

        <div className="partc_acts">
          <button type="button" className="btn btn_solid btn_sm" onClick={onAdd}>
            Adicionar à cotação
          </button>
          <a
            className="partc_wa"
            {...external}
            href={wa(`Olá! Quero cotar a peça ${p.code} — ${p.name}`)}
            aria-label={`Falar no WhatsApp sobre ${p.name}`}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
