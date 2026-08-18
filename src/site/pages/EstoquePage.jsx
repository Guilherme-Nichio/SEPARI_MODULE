/* ============================================================================
   src/site/pages/EstoquePage.jsx  —  ESTOQUE DE MÁQUINAS (público)

   Catálogo das máquinas cadastradas pelo admin em /admin/estoque.
   Filtros: tipo de máquina, segmento, marca, condição e busca livre.
   Cada card leva à página de detalhe em /estoque/:slug.

   Estilo: mesmo do resto do site novo (.sep-site + .sep-estoque),
   CSS em styles/site/estoque.css.
   ========================================================================== */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SiteLayout from '../SiteLayout'
import { R, external } from '../routes'
import { ESTOQUE } from '../siteConfig'
import { AvisoEmBreve } from '../EmBreve'
import { useReveal } from '../hooks/siteHooks'
import {
  fetchStockMachines, MACHINE_TYPES, CONDITIONS, SEGMENT_OPTIONS,
  conditionLabel, segmentLabel, statusLabel, machineTitle, specChips, fmtMoney
} from '../../lib/stock'

const TODOS = 'todos'

/* Normaliza para busca: sem acento, minúsculo. */
const norm = (s = '') =>
  String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function EstoquePage() {
  const ref = useRef(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [missingTable, setMissingTable] = useState(false)

  /* Os filtros vivem na URL: o link do hero da Home (?marca=Alfa Laval) já
     chega filtrado, e o usuário pode compartilhar a busca dele. */
  const tipo      = searchParams.get('tipo')      || TODOS
  const segmento  = searchParams.get('segmento')  || TODOS
  const marca     = searchParams.get('marca')     || TODOS
  const condicao  = searchParams.get('condicao')  || TODOS
  const busca     = searchParams.get('q')         || ''

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === TODOS) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const limparFiltros = () => setSearchParams({}, { replace: true })

  /* MODO "ESTOQUE EM PREPARAÇÃO" (ESTOQUE.ativo em site/siteConfig.ts)
     ------------------------------------------------------------------
     Enquanto estiver ligado, a página nem consulta o banco: a lista fica
     vazia de propósito, para que as máquinas de demonstração que estavam
     cadastradas não apareçam para o visitante. O hero, o texto e o CTA final
     continuam exatamente como estavam.

     Quando você cadastrar as máquinas de verdade em /admin/estoque, troque
     ESTOQUE.ativo para false: a busca volta a rodar, os filtros reaparecem e
     a grade volta sozinha. Nenhum código aqui precisa ser tocado. */
  useEffect(() => {
    if (ESTOQUE.ativo) { setLoading(false); return }

    let vivo = true
    ;(async () => {
      const { data, missingTable } = await fetchStockMachines()
      if (!vivo) return
      setMachines(data)
      setMissingTable(missingTable)
      setLoading(false)
    })()
    return () => { vivo = false }
  }, [])

  /* As opções de marca saem do próprio estoque: nada de listar marca que não
     tem máquina cadastrada. */
  const marcas = useMemo(
    () => Array.from(new Set(machines.map((m) => m.brand).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [machines]
  )

  const tipos = useMemo(() => {
    const usados = new Set(machines.map((m) => m.machine_type).filter(Boolean))
    return MACHINE_TYPES.filter((t) => usados.has(t))
  }, [machines])

  const segmentos = useMemo(() => {
    const usados = new Set(machines.flatMap((m) => m.segments || []))
    return SEGMENT_OPTIONS.filter((s) => usados.has(s.slug))
  }, [machines])

  const filtradas = useMemo(() => {
    const q = norm(busca.trim())
    return machines.filter((m) => {
      if (tipo !== TODOS && m.machine_type !== tipo) return false
      if (marca !== TODOS && m.brand !== marca) return false
      if (condicao !== TODOS && m.condition !== condicao) return false
      if (segmento !== TODOS && !(m.segments || []).includes(segmento)) return false
      if (q) {
        const alvo = norm([
          m.brand, m.model, m.machine_type, m.headline, m.description,
          (m.segments || []).map(segmentLabel).join(' ')
        ].filter(Boolean).join(' '))
        if (!alvo.includes(q)) return false
      }
      return true
    })
  }, [machines, tipo, marca, condicao, segmento, busca])

  /* o reveal precisa reobservar quando a lista muda (dados vindos do banco
     e cada troca de filtro criam cards novos) */
  useReveal(ref, 0.08, filtradas)

  const temFiltro = tipo !== TODOS || marca !== TODOS || condicao !== TODOS ||
    segmento !== TODOS || busca !== ''

  return (
    <SiteLayout page="estoque" containerRef={ref}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="hero">
        <div className="wrap">
          <div className="crumbs">
            <Link to={R.home}>Início</Link> / Estoque
          </div>
          <div className="hero_grid">
            <div>
              <h1>Máquinas<br />prontas para<br /><em>entrar em linha.</em></h1>
              <p>
                
              </p>
              <div className="actions">
                <a className="btn btn_solid" {...external} href={R.whatsapp}>
                  Falar com um vendedor
                </a>
                <Link className="btn btn_line" to={R.servicos}>Ver recondicionamento</Link>
              </div>
            </div>

            
          </div>
        </div>
      </header>

      {/* ── CATÁLOGO ─────────────────────────────────────────────────────── */}
      <section className="catalogo">
        <div className="wrap">
          <div className="sec_head">
            <h2>O que está em estoque.</h2>
            <p className="lead">
              {ESTOQUE.ativo
                ? 'A vitrine está sendo montada. Enquanto isso, fale com a engenharia: buscamos o equipamento certo para o seu processo, novo ou recondicionado.'
                : 'Filtre por tipo de máquina, segmento ou marca. Se não encontrar o que precisa, fale com a engenharia: buscamos o equipamento certo para o seu processo.'}
            </p>
          </div>

          {/* Os filtros ficam escondidos enquanto não há máquinas publicadas —
              um formulário que sempre devolve zero resultados só frustra. */}
          {!ESTOQUE.ativo && (
          <div className="filtros">
            <div className="filtro_busca">
              <input
                type="search"
                value={busca}
                placeholder="Buscar por marca, modelo ou aplicação…"
                aria-label="Buscar máquina"
                onChange={(e) => setFilter('q', e.target.value)}
              />
            </div>

            <div className="filtro_selects">
              <label className="fsel">
                <span>Tipo de máquina</span>
                <select value={tipo} onChange={(e) => setFilter('tipo', e.target.value)}>
                  <option value={TODOS}>Todos os tipos</option>
                  {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label className="fsel">
                <span>Segmento</span>
                <select value={segmento} onChange={(e) => setFilter('segmento', e.target.value)}>
                  <option value={TODOS}>Todos os segmentos</option>
                  {segmentos.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                </select>
              </label>

              <label className="fsel">
                <span>Marca</span>
                <select value={marca} onChange={(e) => setFilter('marca', e.target.value)}>
                  <option value={TODOS}>Todas as marcas</option>
                  {marcas.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>

              <label className="fsel">
                <span>Condição</span>
                <select value={condicao} onChange={(e) => setFilter('condicao', e.target.value)}>
                  <option value={TODOS}>Todas</option>
                  {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </label>
            </div>

            <div className="filtro_foot">
              <span className="filtro_count">
                {loading
                  ? 'Carregando estoque…'
                  : `${filtradas.length} ${filtradas.length === 1 ? 'máquina encontrada' : 'máquinas encontradas'}`}
              </span>
              {temFiltro && (
                <button type="button" className="btn_ghost" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
          )}

          {/* ── GRADE ── */}
          {ESTOQUE.ativo ? (
            <AvisoEmBreve
              titulo={ESTOQUE.titulo}
              texto={ESTOQUE.texto}
              mensagemWhatsapp={ESTOQUE.mensagemWhatsapp}
              assuntoEmail={ESTOQUE.assuntoEmail}
            >
              <div className="sep-embreve_extra">
                <Link className="btn btn_line" to={R.segmentos}>
                  Ver segmentos atendidos
                </Link>
                <Link className="btn btn_line" to={R.servicos}>
                  Ver recondicionamento
                </Link>
              </div>
            </AvisoEmBreve>
          ) : loading ? (
            <div className="grid_cards">
              {[0, 1, 2].map((i) => <div key={i} className="card_skel" />)}
            </div>
          ) : missingTable ? (
            <div className="aviso">
              <h3>Estoque ainda não configurado</h3>
              <p>
                A tabela do estoque não existe no banco. Rode o arquivo{' '}
                <code>supabase/v49-estoque-maquinas.sql</code> no SQL Editor do Supabase
                e recarregue esta página.
              </p>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="aviso">
              <h3>Nenhuma máquina com esses filtros.</h3>
              <p>
                O estoque gira rápido e nem todo equipamento fica publicado. Diga o que
                você procura e a nossa engenharia busca para você.
              </p>
              <div className="aviso_acts">
                {temFiltro && (
                  <button type="button" className="btn btn_line" onClick={limparFiltros}>
                    Limpar filtros
                  </button>
                )}
                <a className="btn btn_solid" {...external} href={R.whatsapp}>
                  Falar com um vendedor
                </a>
              </div>
            </div>
          ) : (
            <div className="grid_cards">
              {filtradas.map((m) => <MachineCard key={m.id} m={m} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="cta_estoque">
        <div className="wrap">
          <div className="cta_box sep_reveal">
            <div>
              <h2>Não achou a máquina<br />que você precisa?</h2>
              <p className="lead">
                Trabalhamos com todas as marcas relevantes do mercado. Conte a sua
                aplicação, a vazão e o produto processado — a engenharia dimensiona e
                busca o equipamento certo, novo ou recondicionado.
              </p>
            </div>
            <div className="cta_acts">
              <a className="btn btn_solid" {...external} href={R.whatsapp}>
                Falar com um vendedor
              </a>
              <Link className="btn btn_line" to={R.segmentos}>Ver segmentos atendidos</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   Card da máquina
   ────────────────────────────────────────────────────────────────────────── */
function MachineCard({ m }) {
  const chips = specChips(m)
  const vendida = m.status === 'sold'
  const preco = m.price_visible ? fmtMoney(m.price) : null

  return (
    <article className={`mcard sep_reveal${vendida ? ' is_sold' : ''}`}>
      <Link to={`/estoque/${m.slug}`} className="mcard_pic" aria-hidden="true" tabIndex={-1}>
        {m.image_url
          ? <img src={m.image_url} alt="" loading="lazy" />
          : <span className="mcard_ph">/media/estoque/{m.slug}.jpg</span>}
        <span className="mcard_badges">
          <span className="mbadge">{conditionLabel(m.condition)}</span>
          {m.status !== 'available' && (
            <span className={`mbadge ${vendida ? 'is_sold' : 'is_reserved'}`}>
              {statusLabel(m.status)}
            </span>
          )}
        </span>
      </Link>

      <div className="mcard_body">
        <span className="mcard_type">{m.machine_type}</span>
        <h3>
          <Link to={`/estoque/${m.slug}`}>{machineTitle(m)}</Link>
        </h3>

        {m.headline && <p className="mcard_desc">{m.headline}</p>}

        {chips.length > 0 && (
          <dl className="mcard_specs">
            {chips.map((c) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd>{c.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {(m.segments || []).length > 0 && (
          <div className="mcard_segs">
            {(m.segments || []).slice(0, 3).map((s) => (
              <span key={s} className="mseg">{segmentLabel(s)}</span>
            ))}
          </div>
        )}

        <div className="mcard_foot">
          {preco
            ? <span className="mcard_price">{preco}</span>
            : <span className="mcard_price is_quote">Preço sob consulta</span>}
          <Link className="mcard_more" to={`/estoque/${m.slug}`}>
            Saber mais <i aria-hidden="true">→</i>
          </Link>
        </div>
      </div>
    </article>
  )
}
