/* ============================================================================
   src/site/pages/SegmentosPage.jsx  —  ÍNDICE DOS SEGMENTOS ATENDIDOS

   Rota: /segmentos
   Lista os dez setores de src/data/applications.jsx. Cada card abre a página
   própria do segmento em /segmentos/:slug.
   ========================================================================== */
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../SiteLayout'
import { Bg } from '../Media'
import { R, external } from '../routes'
import { useReveal } from '../hooks/siteHooks'
import { APPLICATIONS, CATEGORY_LABELS } from '../../data/applications.jsx'

/* Liga o slug do setor ao slot de imagem já existente no assets.ts, para
   reaproveitar as fotos que a Home usa. */
export const SEG_SLOT = {
  'laticinios': 'segLaticinios',
  'cervejarias': 'segCervejaria',
  'sumos-e-bebidas': 'segBebidas',
  'marinha-e-naval': 'segNaval',
  'oleos': 'segOleos',
  'farmaceutica': 'segFarma',
  'oleo-e-gas': 'segOleoGas',
  'mineracao': 'segMineracao',
  'geracao-de-energia': 'segEnergia',
  'fluidos-industriais': 'segFluidos'
}

export default function SegmentosPage() {
  const ref = useRef(null)
  useReveal(ref, 0.08)

  return (
    <SiteLayout page="segmentos" containerRef={ref}>
      <header className="hero">
        <div className="wrap">
          <div className="crumbs"><Link to={R.home}>Início</Link> / Segmentos</div>
          <div className="hero_grid">
            <div>
              <h1>Onde a<br />separação<br /><em>importa.</em></h1>
              <p>
                Dez setores, uma exigência em comum: a centrífuga não pode parar. Cada
                segmento tem a sua própria página, com o processo, os pontos de desgaste
                e as máquinas que atendemos.
              </p>
              <div className="actions">
                <Link className="btn btn_solid" to={R.estoque}>Ver máquinas em estoque</Link>
                <a className="btn btn_line" {...external} href={R.whatsapp}>Falar com especialista</a>
              </div>
            </div>
            <div className="hero_stats">
              <div className="hstat"><strong>10</strong><span>segmentos atendidos</span></div>
              <div className="hstat"><strong>+20</strong><span>marcas cobertas</span></div>
              <div className="hstat"><strong>LatAm</strong><span>alcance de atendimento</span></div>
            </div>
          </div>
        </div>
      </header>

      <section className="seg_list">
        <div className="wrap">
          <div className="sec_head">
            <h2>Escolha o seu setor.</h2>
            <p className="lead">
              O conteúdo de cada página foi escrito por quem faz o serviço, não por quem
              vende catálogo.
            </p>
          </div>

          <div className="seg_cards">
            {APPLICATIONS.map((app) => (
              <Link
                key={app.slug}
                to={`/segmentos/${app.slug}`}
                className="seg_item sep_reveal"
              >
                <div className="seg_item_pic">
                  {SEG_SLOT[app.slug]
                    ? <Bg slot={SEG_SLOT[app.slug]} className="bgimg ph" />
                    : <div className="bgimg ph" />}
                </div>
                <div className="seg_item_body">
                  <span className="seg_item_cat">
                    {CATEGORY_LABELS[app.category] || 'Industrial'}
                  </span>
                  <h3>{app.name}</h3>
                  <p>{app.heroLead}</p>
                  <span className="seg_item_go">Ver o segmento <i aria-hidden="true">→</i></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta_estoque">
        <div className="wrap">
          <div className="cta_box sep_reveal">
            <div>
              <h2>O seu processo não<br />está nesta lista?</h2>
              <p className="lead">
                Separação centrífuga aparece em muito mais lugar do que a gente consegue
                listar. Descreva o seu produto e a sua vazão que a engenharia responde se
                dá para separar — e como.
              </p>
            </div>
            <div className="cta_acts">
              <a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com a engenharia</a>
              <Link className="btn btn_line" to={R.servicos}>Ver serviços</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
