/* ============================================================================
   src/site/pages/SegmentoPage.jsx  —  PÁGINA DE UM SEGMENTO

   Rota: /segmentos/:slug
   Todo o conteúdo vem de src/data/applications.jsx (o mesmo que a página
   antiga /aplicacoes/:slug usava), agora no estilo do site novo.

   Estrutura: hero · como funciona · desafios · o que a Separi entrega ·
   pontos de atenção · marcas e modelos · máquinas em estoque do setor ·
   FAQ · outros setores · CTA.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteLayout from '../SiteLayout'
import { Bg } from '../Media'
import { R, external } from '../routes'
import { useReveal, useFaq } from '../hooks/siteHooks'
import { SEG_SLOT } from './SegmentosPage'
import {
  APPLICATIONS, getApplicationBySlug, CATEGORY_LABELS,
  getAppEquipment, getAppBrands
} from '../../data/applications.jsx'
import {
  fetchStockMachines, conditionLabel, machineTitle, fmtMoney
} from '../../lib/stock'
import { ESTOQUE } from '../siteConfig'

export default function SegmentoPage() {
  const { slug } = useParams()
  const ref = useRef(null)
  useFaq(ref)

  const app = getApplicationBySlug(slug)
  const [stock, setStock] = useState([])

  /* reobserva quando os cards do estoque chegam do banco */
  useReveal(ref, 0.08, `${slug}:${stock.length}`)

  /* Máquinas do estoque marcadas com este segmento. Se não houver nenhuma, a
     seção simplesmente não aparece. */
  useEffect(() => {
    /* Modo "estoque em preparação": não consulta o banco, então a seção de
       máquinas deste setor não é montada — o resto da página (conteúdo
       técnico, marcas, peças, FAQ e CTA) continua igual. */
    if (ESTOQUE.ativo) return

    let vivo = true
    ;(async () => {
      const { data } = await fetchStockMachines()
      if (!vivo) return
      setStock(
        data
          .filter((m) => (m.segments || []).includes(slug) && m.status !== 'sold')
          .slice(0, 3)
      )
    })()
    return () => { vivo = false }
  }, [slug])

  /* ── segmento inexistente ── */
  if (!app) {
    return (
      <SiteLayout page="segmentos" containerRef={ref}>
        <section className="det_loading">
          <div className="wrap">
            <h1>Segmento não encontrado.</h1>
            <p className="lead">Veja todos os setores que atendemos:</p>
            <div className="seg_chips">
              {APPLICATIONS.map((a) => (
                <Link key={a.slug} className="mseg" to={`/segmentos/${a.slug}`}>
                  {a.short}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SiteLayout>
    )
  }

  const equip = getAppEquipment(app.slug)
  const brands = getAppBrands(app.slug)
  const outros = APPLICATIONS.filter((a) => a.slug !== app.slug).slice(0, 5)

  return (
    <SiteLayout page="segmentos" containerRef={ref}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="hero">
        <div className="wrap">
          <div className="crumbs">
            <Link to={R.home}>Início</Link> / <Link to={R.segmentos}>Segmentos</Link> /{' '}
            {app.short}
          </div>
          <div className="hero_grid">
            <div>
              <span className="eyebrow">{CATEGORY_LABELS[app.category] || app.eyebrow}</span>
              <h1>{app.heroTitle}</h1>
              <p>{app.heroLead}</p>
              <div className="actions">
                <a className="btn btn_solid" {...external} href={R.whatsapp}>
                  Falar com especialista
                </a>
                <Link className="btn btn_line" to={R.pecas}>Ver peças</Link>
              </div>
            </div>
            <div className="hero_img">
              {SEG_SLOT[app.slug]
                ? <Bg slot={SEG_SLOT[app.slug]} className="img" />
                : <div className="img" />}
            </div>
          </div>
        </div>
      </header>

      {/* ── INTRO ────────────────────────────────────────────────────────── */}
      <section className="seg_intro">
        <div className="wrap">
          <p className="big sep_reveal">{app.intro}</p>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────────────────────── */}
      {app.process?.length > 0 && (
        <section className="seg_proc">
          <div className="wrap">
            <div className="sec_head">
              <h2>Como a separação<br />funciona aqui.</h2>
            </div>
            <div className="proc_list">
              {app.process.map((p, i) => (
                <div key={p.title} className="proc_item sep_reveal">
                  <span className="proc_n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DESAFIOS ─────────────────────────────────────────────────────── */}
      {app.challenges?.length > 0 && (
        <section className="seg_chal">
          <div className="wrap">
            <div className="sec_head">
              <h2>O que costuma<br />dar errado.</h2>
              <p className="lead">
                Os três problemas que mais aparecem quando a manutenção atrasa neste setor.
              </p>
            </div>
            <div className="chal_grid">
              {app.challenges.map((c) => (
                <div key={c.title} className="chal sep_reveal">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── O QUE ENTREGAMOS ─────────────────────────────────────────────── */}
      {app.delivers?.length > 0 && (
        <section className="seg_deliver">
          <div className="wrap">
            <div className="sec_head">
              <h2>O que a Separi<br />entrega neste setor.</h2>
            </div>
            <div className="deliver_grid">
              {app.delivers.map((d) => (
                <div key={d.title} className="deliver sep_reveal">
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              ))}
            </div>

            {app.focus?.length > 0 && (
              <div className="focus_box sep_reveal">
                <h3>Pontos de atenção na manutenção</h3>
                <ul>
                  {app.focus.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── EQUIPAMENTO TÍPICO ───────────────────────────────────────────── */}
      {equip && (
        <section className="seg_equip">
          <div className="wrap">
            <div className="sec_head">
              <h2>A máquina certa<br />para o processo.</h2>
              <p className="lead">{equip.lead}</p>
            </div>
            <div className="equip_grid">
              {equip.items.map((it) => (
                <div key={it.title} className="equip sep_reveal">
                  <span className="equip_type">{it.type}</span>
                  <h3>{it.title}</h3>
                  <p>{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MARCAS E MODELOS ─────────────────────────────────────────────── */}
      {brands.length > 0 && (
        <section className="seg_brands">
          <div className="wrap">
            <div className="sec_head">
              <h2>Marcas e modelos<br />que atendemos aqui.</h2>
            </div>
            <div className="brands_rows">
              {brands.map((b) => (
                <div key={b.brand} className="brow sep_reveal">
                  <strong>{b.brand}</strong>
                  <div className="bmodels">
                    {b.models.map((mod) => <span key={mod}>{mod}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <p className="brands_note">
              Não achou o seu modelo? Atendemos outros fabricantes mediante consulta.
            </p>
          </div>
        </section>
      )}

      {/* ── ESTOQUE DO SETOR ─────────────────────────────────────────────── */}
      {stock.length > 0 && (
        <section className="seg_stock">
          <div className="wrap">
            <div className="sec_head">
              <h2>Em estoque para<br />{app.short.toLowerCase()}.</h2>
              <p className="lead">
                Máquinas disponíveis agora, prontas para inspeção na nossa oficina.
              </p>
            </div>
            <div className="grid_cards">
              {stock.map((m) => (
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
              <Link className="btn btn_line" to={`${R.estoque}?segmento=${app.slug}`}>
                Ver todo o estoque para este setor
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {app.faq?.length > 0 && (
        <section className="seg_faq">
          <div className="wrap">
            <div className="sec_head">
              <h2>Perguntas frequentes.</h2>
            </div>
            <div className="faq_list">
              {app.faq.map((f) => (
                <div key={f.q} className="faq_item">
                  <button type="button" className="faq_q">
                    {f.q}<span className="ic">+</span>
                  </button>
                  <div className="faq_a"><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OUTROS SETORES ───────────────────────────────────────────────── */}
      <section className="seg_others">
        <div className="wrap">
          <div className="sec_head">
            <h2>Outros setores<br />que atendemos.</h2>
          </div>
          <div className="others_grid">
            {outros.map((a) => (
              <Link key={a.slug} className="other_card sep_reveal" to={`/segmentos/${a.slug}`}>
                {SEG_SLOT[a.slug]
                  ? <Bg slot={SEG_SLOT[a.slug]} className="bgimg ph" />
                  : <div className="bgimg ph" />}
                <span className="cap">{a.short}</span>
              </Link>
            ))}
          </div>
          <div className="det_rel_foot">
            <Link className="btn btn_line" to={R.segmentos}>Ver todos os segmentos</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="cta_estoque">
        <div className="wrap">
          <div className="cta_box sep_reveal">
            <div>
              <h2>Vamos manter a sua<br />linha girando.</h2>
              <p className="lead">
                Peça, serviço ou máquina completa para {app.short.toLowerCase()}: conte o
                que você precisa e a engenharia retorna com uma proposta técnica.
              </p>
            </div>
            <div className="cta_acts">
              <a className="btn btn_solid" {...external} href={R.whatsapp}>
                Falar com especialista
              </a>
              <Link className="btn btn_line" to={R.estoque}>Ver estoque</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
