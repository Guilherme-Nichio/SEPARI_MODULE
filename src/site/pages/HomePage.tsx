/* ============================================================================
   src/site/pages/HomePage.tsx  —  Home

   Markup convertido do HTML original sem alteração de estrutura, classes ou
   texto. O que mudou: <a href> virou <Link>, os <button> ganharam navegação e
   os scripts inline viraram hooks. O CSS vive em styles/site/home.css,
   escopado em .sep-home.
   ========================================================================== */
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SiteLayout from '../SiteLayout'
import { Bg, Tag } from '../Media'
import HeroBgVideo from '../HeroBgVideo'
import { R, quoteRoute, catalogRoute, external } from '../routes'
import { BtnPlataforma } from '../EmBreve'

/* As duas marcas em destaque no hero. Para trocar (ou acrescentar uma
   terceira), mexa só nesta lista: o layout se ajusta sozinho. */
const HERO_BRANDS = [
  { name: 'Alfa Laval',    eyebrow: 'Especialistas em' },
  { name: 'GEA Westfalia', eyebrow: 'Especialistas em' }
] as const

export default function HomePage() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()


  return (
    <SiteLayout page="home" containerRef={ref}>
{/* 1. HERO */}
        <header className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
          
          {/* Vídeo de fundo (Nível 1) + véu verde (Nível 2).
              Os dois vêm do componente único em site/HeroBgVideo.tsx, que é o
              mesmo usado em Produtos, Serviços e Sobre. O arquivo em si está
              declarado em site/assets.ts, no bloco VIDEO. */}
          <HeroBgVideo slot="homeHero" zIndex={1} zoom={1.4} />

          {/* Textos da Home (Nível 3) */}
          <div className="wrap hero_inner" style={{ position: 'relative', zIndex: 3 }}>
            <h1>Unir solucões<br />para separar<br />com eficiência.</h1>
            <div className="hero_side">
              <p>Peças, máquinas e serviço técnico especializado, para sua operação nunca parar.</p>

              {/* Chamadas por marca — vidro fosco sobre o vídeo.
                  Levam ao estoque já filtrado pela marca. */}
              <div className="hero_brands">
                {HERO_BRANDS.map((b) => (
                  <Link
                    key={b.name}
                    className="hero_brand"
                    to={`${R.estoque}?marca=${encodeURIComponent(b.name)}`}
                  >
                    <span className="hero_brand_eyebrow">{b.eyebrow}</span>
                    <span className="hero_brand_name">{b.name}</span>
                    <span className="hero_brand_go">Ver estoque e peças <i aria-hidden="true">→</i></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* 2. SOBRE */}
        <section id="sobre" className="statement">
          <div className="wrap">
            <h2>Leais ao seu processo,<br />não ao fabricante.</h2>
            <p className="lead">Recomendamos a solução certa para sua centrífuga, sem amarras comerciais com nenhum fabricante — com décadas de experiência técnica em laticínios, cervejarias, óleo vegetal, biodiesel, navios e outros segmentos industriais.</p>
            <div className="actions"><button className="btn_ghost" onClick={() => navigate(R.sobre)}>Conheça a nossa história →</button></div>
          </div>
        </section>

        {/* 3. SEGMENTOS */}
        <section className="setores">
          <div className="wrap">
            <div className="head">
              <h2>Onde a <span style={{ color: '#14b8a6' }}>separação</span> importa.</h2>
              <p className="lead">Soluções dimensionadas para a realidade de cada setor.</p>
            </div>
            <div className="seg_grid">
              <Link className="seg_card" to={`/segmentos/laticinios`}><Bg slot="segLaticinios" className="bgimg ph" /><span className="cap">Laticínios</span></Link>
              <Link className="seg_card" to={`/segmentos/cervejarias`}><Bg slot="segCervejaria" className="bgimg ph" /><span className="cap">Cervejaria</span></Link>
              <Link className="seg_card" to={`/segmentos/sumos-e-bebidas`}><Bg slot="segBebidas" className="bgimg ph" /><span className="cap">Sucos e bebidas</span></Link>
              <Link className="seg_card" to={`/segmentos/marinha-e-naval`}><Bg slot="segNaval" className="bgimg ph" /><span className="cap">Marinha e naval</span></Link>
              <Link className="seg_card" to={`/segmentos/oleos`}><Bg slot="segOleos" className="bgimg ph" /><span className="cap">Óleos</span></Link>
              <Link className="seg_card" to={`/segmentos/farmaceutica`}><Bg slot="segFarma" className="bgimg ph" /><span className="cap">Farmacêutica</span></Link>
              <Link className="seg_card" to={`/segmentos/oleo-e-gas`}><Bg slot="segOleoGas" className="bgimg ph" /><span className="cap">Óleo e gás</span></Link>
              <Link className="seg_card" to={`/segmentos/mineracao`}><Bg slot="segMineracao" className="bgimg ph" /><span className="cap">Mineração</span></Link>
              <Link className="seg_card" to={`/segmentos/geracao-de-energia`}><Bg slot="segEnergia" className="bgimg ph" /><span className="cap">Geração de energia</span></Link>
              <Link className="seg_card" to={`/segmentos/fluidos-industriais`}><Bg slot="segFluidos" className="bgimg ph" /><span className="cap">Biodisel</span></Link>
            </div>
          </div>
        </section>

        {/* 4. PEÇAS */}
        <section id="pecas">
          <div className="wrap split">
            <div className="txt">
              <h2>Sem parada<br />por falta de peça.</h2>
              <p className="lead">Kits de manutenção preventiva, itens condenados pelo fabricante, peças de desgaste e periféricos — tudo em estoque, sem depender de importação.</p>
              <div className="actions"><button className="btn_ghost" onClick={() => navigate(R.pecas)}>Explorar peças →</button></div>
            </div>
            <div className="visual"><Tag slot="homeBowl" /></div>
          </div>
        </section>

        {/* 5. EQUIPAMENTOS */}
        <section id="equipamentos">
          <div className="wrap split rev">
            <div className="txt">
              <h2>Centrífugas<br />novas ou usadas.</h2>
              <p className="lead">Máquinas novas de um dos maiores fabricantes de centrífugas do mundo, ou remanufaturadas na nossa própria oficina — a solução certa para sua operação.</p>
              <div className="actions"><button className="btn_ghost" onClick={() => navigate(R.produtos)}>Conhecer a linha →</button></div>
            </div>
            <div className="visual"><Tag slot="homeProduto" /></div>
          </div>
        </section>

        {/* 6. RECONDICIONAMENTO */}
        <section>
          <div className="wrap split">
            <div className="txt">
              <h2>Remanufatura<br />de verdade.</h2>
              <p className="lead">Não é 'reforma'. É desmontagem total, com ensaio não-destrutivo e análise dimensional criteriosa. Balanceamento dinâmico na rotação nominal, com simulação de descargas. Dez horas de teste contínuo — só volta para operação certificada e com garantia.</p>
              <div className="actions"><button className="btn_ghost" onClick={() => navigate(R.servicos)}>Como funciona →</button></div>
            </div>
            <div className="visual"><Tag slot="homeOficina" /></div>
          </div>
        </section>

        {/* 7. SERVIÇOS — duas imagens compridas */}
        <section id="servicos" className="services">
          <div className="wrap">
            <h2>Serviço em campo<br />e na oficina.</h2>
            <p className="lead">Manutenção preventiva ou corretiva, agendada ou emergencial — em nossa oficina ou onde sua operação estiver.</p>
            <div className="svc_duo">
              <div className="svc_tile">
                <Bg slot="homeSvcCampo" className="bgimg ph" />
                <div className="cap">
                  <h3>Serviço de campo</h3>
                  <Link className="more" to={R.servicos}>Saber mais →</Link>
                </div>
              </div>
              <div className="svc_tile">
                <Bg slot="homeSvcOficina" className="bgimg ph" />
                <div className="cap">
                  <h3>Oficina técnica</h3>
                  <Link className="more" to={R.servicos}>Saber mais →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. MARCAS */}
        <section className="brands">
          <div className="wrap">
            <div className="head">
              <h2> Marcas que você<br /> já conhece e confia.</h2>
              <p className="lead"> Se é centrífuga, atendemos — independente da marca.</p>
            </div>
            <div className="brand_grid">
              <div className="brand_cell">GEA Westfalia</div>
              <div className="brand_cell">Alfa Laval</div>
              <div className="brand_cell">Tetra Pak</div>
              <div className="brand_cell">Seital / SPX Flow</div>
              <div className="brand_cell">Mitsubishi</div>
              <div className="brand_cell">Pieralisi</div>
              <div className="brand_cell">Flottweg</div>
              <div className="brand_cell">REDA</div>
              <div className="brand_cell">Frautech</div>
              <div className="brand_cell">Andritz</div>
              <div className="brand_cell">STS</div>
              <div className="brand_cell">KMA Sudmo</div>
              <div className="brand_cell">Haus Centrifuges</div>
              <div className="brand_cell">Polat Makina</div>
              <div className="brand_cell">Macfuge</div>
              <div className="brand_cell">Huading</div>
              <div className="brand_cell">Juneng</div>
              <div className="brand_cell">Veronesi</div>
              <div className="brand_cell">Turbinav</div>
              <div className="brand_cell">Scremac</div>
            </div>
            <div className="foot">
              <p className="lead">Não encontrou a sua marca? Atendemos outros fabricantes mediante consulta.</p>
              <BtnPlataforma to={quoteRoute(isAuthenticated)} className="btn btn_solid">Solicitar cotação</BtnPlataforma>
            </div>
          </div>
        </section>

        {/* 9. PROCESSO */}
        <section className="proc">
          <div className="wrap">
            <h2>Como cotar suas peças pelo site.</h2>
            <div className="steps">
              <div className="step"><div className="n">01</div><div className="bar"></div><h4>Cadastre a máquina</h4><p>Cadastre sua empresa, insira a marca, o modelo, o número de série, o ano de fabricação e a foto da plaqueta.</p></div>
              <div className="step"><div className="n">02</div><div className="bar"></div><h4>Aprovação de cadastro</h4><p>Validamos e aprovamos as informações fornecidas.</p></div>
              <div className="step"><div className="n">03</div><div className="bar"></div><h4>Cotação</h4><p>Utilize os kits prontos para a sua máquina ou crie uma proposta com itens avulsos.</p></div>
              <div className="step"><div className="n">04</div><div className="bar"></div><h4>Receba a cotação</h4><p>Cotação enviada pelo nosso vendedor, com preços, prazos e plano de manutenção.</p></div>
            </div>
          </div>
        </section>

        {/* 10. CTA */}
        <section id="contato">
          <div className="wrap cta_split">
            <div className="txt">
              <h2>Ruído, vibração, queda de performance,<br />sinais que você já reconhece.</h2>
              <p className="lead">Fale conosco, resolvemos isso todos os dias.</p>
              <div className="actions">
                <a className="btn btn_solid" {...external} href={R.whatsapp}>Preciso saber mais</a>
              </div>
            </div>
            <div className="cta_img"><Tag slot="homeCta" /></div>
          </div>
        </section>

        {/* FOOTER */}



    </SiteLayout>
  )
}
