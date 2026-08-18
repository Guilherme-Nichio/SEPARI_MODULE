/* ============================================================================
   src/site/pages/EstoqueDetalhePage.jsx  —  DETALHE DA MÁQUINA (público)

   Rota: /estoque/:slug
   Traz a ficha completa: galeria, especificações, condições de uso, o que
   acompanha e a chamada para falar com o vendedor.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SiteLayout from '../SiteLayout'
import { R, external } from '../routes'
import { ESTOQUE } from '../siteConfig'
import { AvisoEmBreve } from '../EmBreve'
import { useReveal } from '../hooks/siteHooks'
import {
  fetchStockMachineBySlug, fetchRelatedMachines,
  conditionLabel, statusLabel, segmentLabel, machineTitle, machinePhotos, fmtMoney
} from '../../lib/stock'

/* Monta o link de WhatsApp já com a mensagem pronta sobre esta máquina. */
const waLink = (m) => {
  const texto = `Olá! Tenho interesse na ${machineTitle(m)} (${conditionLabel(m.condition)}) que está no estoque do site. Pode me passar mais informações?`
  return `${R.whatsapp}?text=${encodeURIComponent(texto)}`
}

export default function EstoqueDetalhePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const ref = useRef(null)
  const [machine, setMachine] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [foto, setFoto] = useState(0)

  /* o conteúdo só existe depois do fetch: o reveal reobserva quando a máquina
     (e depois as relacionadas) entram na tela */
  useReveal(ref, 0.08, machine ? `${machine.id}:${related.length}` : null)

  useEffect(() => {
    /* Modo "estoque em preparação": nenhuma máquina é servida por endereço
       direto tampouco. Sem isso, um link antigo compartilhado no WhatsApp
       continuaria abrindo uma máquina de demonstração. */
    if (ESTOQUE.ativo) { setMachine(null); setLoading(false); return }

    let vivo = true
    setLoading(true)
    setFoto(0)
    ;(async () => {
      const { data } = await fetchStockMachineBySlug(slug)
      if (!vivo) return
      setMachine(data)
      setLoading(false)
      if (data) {
        const rel = await fetchRelatedMachines(data, 3)
        if (vivo) setRelated(rel)
      }
    })()
    return () => { vivo = false }
  }, [slug])

  /* ── carregando ── */
  if (loading) {
    return (
      <SiteLayout page="estoque" containerRef={ref}>
        <section className="det_loading">
          <div className="wrap"><p className="lead">Carregando máquina…</p></div>
        </section>
      </SiteLayout>
    )
  }

  /* ── não encontrada ── */
  if (!machine) {
    if (ESTOQUE.ativo) {
      return (
        <SiteLayout page="estoque" containerRef={ref}>
          <section className="det_loading">
            <div className="wrap">
              <AvisoEmBreve
                titulo={ESTOQUE.titulo}
                texto={ESTOQUE.texto}
                mensagemWhatsapp={ESTOQUE.mensagemWhatsapp}
                assuntoEmail={ESTOQUE.assuntoEmail}
              >
                <div className="sep-embreve_extra">
                  <button className="btn btn_line" onClick={() => navigate(R.estoque)}>
                    Voltar ao estoque
                  </button>
                </div>
              </AvisoEmBreve>
            </div>
          </section>
        </SiteLayout>
      )
    }
    return (
      <SiteLayout page="estoque" containerRef={ref}>
        <section className="det_loading">
          <div className="wrap">
            <h1>Máquina não encontrada.</h1>
            <p className="lead">
              Esta máquina saiu do estoque ou o endereço mudou. Veja o que está
              disponível agora.
            </p>
            <div className="actions">
              <button className="btn btn_solid" onClick={() => navigate(R.estoque)}>
                Ver estoque completo
              </button>
              <a className="btn btn_line" {...external} href={R.whatsapp}>
                Falar com um vendedor
              </a>
            </div>
          </div>
        </section>
      </SiteLayout>
    )
  }

  const fotos = machinePhotos(machine)
  const preco = machine.price_visible ? fmtMoney(machine.price) : null
  const specs = Array.isArray(machine.specs) ? machine.specs : []
  const disponivel = machine.status === 'available'

  /* Ficha rápida: só o que estiver preenchido. */
  const ficha = [
    ['Marca', machine.brand],
    ['Modelo', machine.model],
    ['Tipo', machine.machine_type],
    ['Condição', conditionLabel(machine.condition)],
    ['Ano', machine.year],
    ['Capacidade', machine.capacity],
    ['Rotação', machine.rpm],
    ['Potência', machine.power],
    ['Peso', machine.weight],
    ['Material', machine.material],
    ['Nº de série', machine.serial_number],
    ['Localização', machine.location],
    ['Garantia', machine.warranty],
    ...specs.map((s) => [s?.label, s?.value])
  ].filter(([, v]) => v !== null && v !== undefined && v !== '')

  return (
    <SiteLayout page="estoque" containerRef={ref}>
      {/* ── TOPO: galeria + resumo ─────────────────────────────────────── */}
      <header className="det_hero">
        <div className="wrap">
          <div className="crumbs">
            <Link to={R.home}>Início</Link> / <Link to={R.estoque}>Estoque</Link> /{' '}
            {machineTitle(machine)}
          </div>

          <div className="det_grid">
            {/* galeria */}
            <div className="det_gal">
              <div className="det_gal_main">
                {fotos.length > 0
                  ? <img src={fotos[foto]} alt={machineTitle(machine)} />
                  : <span className="det_gal_ph">/media/estoque/{machine.slug}.jpg</span>}
                <span className="det_gal_badges">
                  <span className="mbadge">{conditionLabel(machine.condition)}</span>
                  {!disponivel && (
                    <span className={`mbadge ${machine.status === 'sold' ? 'is_sold' : 'is_reserved'}`}>
                      {statusLabel(machine.status)}
                    </span>
                  )}
                </span>
              </div>

              {fotos.length > 1 && (
                <div className="det_gal_thumbs">
                  {fotos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className={`det_thumb${i === foto ? ' is_on' : ''}`}
                      onClick={() => setFoto(i)}
                      aria-label={`Foto ${i + 1}`}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* resumo + CTA */}
            <div className="det_side">
              <span className="det_type">{machine.machine_type}</span>
              <h1>{machineTitle(machine)}</h1>
              {machine.headline && <p className="det_headline">{machine.headline}</p>}

              {(machine.segments || []).length > 0 && (
                <div className="det_segs">
                  {(machine.segments || []).map((s) => (
                    <Link key={s} className="mseg" to={`/segmentos/${s}`}>
                      {segmentLabel(s)}
                    </Link>
                  ))}
                </div>
              )}

              <div className="det_price">
                {preco
                  ? <><strong>{preco}</strong><span>+ frete e impostos conforme proposta</span></>
                  : <><strong>Preço sob consulta</strong><span>proposta técnica em até 1 dia útil</span></>}
              </div>

              <div className="det_acts">
                <a className="btn btn_solid" {...external} href={waLink(machine)}>
                  Falar com um vendedor
                </a>
                <a className="btn btn_line" href={R.email}>Pedir proposta por e-mail</a>
              </div>

              {(machine.highlights || []).length > 0 && (
                <ul className="det_high">
                  {(machine.highlights || []).map((h) => <li key={h}>{h}</li>)}
                </ul>
              )}

              {!disponivel && (
                <p className="det_alert">
                  Esta máquina está <strong>{statusLabel(machine.status).toLowerCase()}</strong>.
                  Fale com a equipe: temos equipamentos equivalentes e podemos avisar quando
                  entrar outra igual.
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── DESCRIÇÃO + FICHA TÉCNICA ──────────────────────────────────── */}
      <section className="det_body">
        <div className="wrap det_body_grid">
          <div className="det_texts sep_reveal">
            {machine.description && (
              <>
                <h2>Sobre esta máquina</h2>
                <p>{machine.description}</p>
              </>
            )}

            {machine.usage_conditions && (
              <>
                <h2>Condições de uso</h2>
                <p>{machine.usage_conditions}</p>
              </>
            )}

            {machine.included && (
              <>
                <h2>O que acompanha</h2>
                <p>{machine.included}</p>
              </>
            )}

            <h2>Como funciona a compra</h2>
            <ol className="det_steps">
              <li>
                <strong>Você fala com o vendedor.</strong> Conta a aplicação, a vazão e o
                produto processado.
              </li>
              <li>
                <strong>A engenharia confirma o encaixe.</strong> Validamos se a máquina
                atende ao seu processo antes de qualquer proposta.
              </li>
              <li>
                <strong>Proposta técnica e comercial.</strong> Preço, prazo, escopo de
                revisão e condições de garantia por escrito.
              </li>
              <li>
                <strong>Entrega e partida assistida.</strong> Coordenamos a logística e,
                se você quiser, acompanhamos a instalação.
              </li>
            </ol>
          </div>

          <aside className="det_specs sep_reveal">
            <h3>Ficha técnica</h3>
            <dl>
              {ficha.map(([label, value], i) => (
                <div key={`${label}-${i}`}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <div className="det_specs_cta">
              <p>Precisa de um dado que não está aqui?</p>
              <a className="btn btn_solid" {...external} href={waLink(machine)}>
                Perguntar ao vendedor
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ── RELACIONADAS ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="det_rel">
          <div className="wrap">
            <div className="sec_head">
              <h2>Outras máquinas no estoque.</h2>
            </div>
            <div className="grid_cards">
              {related.map((m) => (
                <article key={m.id} className="mcard sep_reveal">
                  <Link to={`/estoque/${m.slug}`} className="mcard_pic" tabIndex={-1} aria-hidden="true">
                    {m.image_url
                      ? <img src={m.image_url} alt="" loading="lazy" />
                      : <span className="mcard_ph">/media/estoque/{m.slug}.jpg</span>}
                    <span className="mcard_badges">
                      <span className="mbadge">{conditionLabel(m.condition)}</span>
                    </span>
                  </Link>
                  <div className="mcard_body">
                    <span className="mcard_type">{m.machine_type}</span>
                    <h3><Link to={`/estoque/${m.slug}`}>{machineTitle(m)}</Link></h3>
                    {m.headline && <p className="mcard_desc">{m.headline}</p>}
                    <div className="mcard_foot">
                      <span className="mcard_price is_quote">
                        {m.price_visible ? fmtMoney(m.price) : 'Sob consulta'}
                      </span>
                      <Link className="mcard_more" to={`/estoque/${m.slug}`}>
                        Saber mais <i aria-hidden="true">→</i>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="det_rel_foot">
              <Link className="btn btn_line" to={R.estoque}>Ver estoque completo</Link>
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  )
}
