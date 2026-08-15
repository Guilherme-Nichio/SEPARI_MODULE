/* ============================================================================
   src/site/pages/PecasPage.tsx  —  Peças

   Markup convertido do HTML original sem alteração de estrutura, classes ou
   texto. O que mudou: <a href> virou <Link>, os <button> ganharam navegação e
   os scripts inline viraram hooks. O CSS vive em styles/site/pecas.css,
   escopado em .sep-pecas.
   ========================================================================== */
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SiteLayout from '../SiteLayout'
import { Bg, Tag } from '../Media'
import { R, quoteRoute, catalogRoute, external } from '../routes'
import { useFaq, useReveal } from '../hooks/siteHooks'

export default function PecasPage() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  useReveal(ref, 0.1)
  useFaq(ref)

  return (
    <SiteLayout page="pecas" containerRef={ref}>
        {/* HERO */}
        <header className="hero">
          <div className="wrap hero_grid">
            <div className="hero_img"><Bg slot="pecasHero" className="img" showLabel /></div>
            <div className="txt">
              <div className="crumbs"><a href="separi-home.html">Início</a> / Peças</div>
              <h1>Peças de reposição<br />para a sua<br /><em>centrífuga.</em></h1>
              <p>Pronto atendimento, 24 horas por dia, 7 dias por semana.</p>
              <div className="actions">
                <button className="btn btn_solid" onClick={() => navigate(catalogRoute(isAuthenticated))}>Ver catálogo</button>
                <a className="btn btn_line" style={{ color: 'var(--ink)' }} {...external} href={R.whatsapp}>Falar com um especialista</a>
              </div>
            </div>
          </div>
        </header>

        {/* KITS DE SERVIÇO */}
        <section>
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Kits de serviço.</h2>
              <p className="lead">Todas as peças que o manual solicita, num único código ou montado sob medida para a sua necessidade.</p>
            </div>
            <div className="kits_grid sep_reveal">
              <div className="kit">
                <h3>Kit Geral</h3>
                <p>A revisão completa da máquina: vedações, gaxetas, O-rings, rolamentos, correia e todos os itens de desgaste recomendados para as 8.000 horas ou 12 meses.</p>
                <div className="sp"></div>
                <div className="act"><button className="btn_ghost" onClick={() => navigate(quoteRoute(isAuthenticated))}>Cotar Kit Geral →</button></div>
              </div>
              <div className="kit">
                <h3>Kit Tambor</h3>
                <p>Focado no bowl: gaxetas e vedações do tambor, anéis e componentes críticos da parte que gira em alta rotação. Ideal para a preventiva de rotina.</p>
                <div className="sp"></div>
                <div className="act"><button className="btn_ghost" onClick={() => navigate(quoteRoute(isAuthenticated))}>Cotar Kit Tambor →</button></div>
              </div>
              <div className="kit feat">
                <h3>Monte seu kit</h3>
                <p>Cadastre a sua máquina e a nossa engenharia monta o kit exato para o modelo, as horas de operação e o histórico dela. Só com o que você precisa.</p>
                <div className="sp"></div>
                <div className="act"><button className="btn btn_solid" onClick={() => navigate(isAuthenticated ? R.maquinaNova : R.registro)}>Montar meu kit</button></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DA PLACA À PEÇA CERTA ────────────────────────────────────────
            Ocupa o lugar da antiga seção "Encontre a sua máquina" (o finder de
            3 selects). Mantém a mesma função na página — levar o visitante até
            a peça certa — e o mesmo peso visual: continua sendo o bloco escuro
            que separa "Kits" de "Componentes". O estilo vive em
            styles/v78-nav-e-pecas.css, escopado em .sep-pecas .flow. */}
        <section className="flow">
          <div className="wrap flow_in sep_reveal">
            <div className="flow_txt">
              <h2>Da placa à<br /><em>peça certa.</em></h2>
              <p className="lead">Você não precisa do número da peça nem do catálogo do fabricante. Manda a foto da placa da máquina que a engenharia identifica o item.</p>
              <div className="flow_act">
                <a className="btn btn_solid" {...external} href={R.whatsapp}>Mandar no WhatsApp</a>
                <button
                  className="btn_ghost flow_ghost"
                  onClick={() => navigate(isAuthenticated ? R.maquinaNova : R.registro)}
                >
                  Cadastrar minha máquina →
                </button>
              </div>
            </div>

            <ol className="flow_steps">
              <li>
                <span className="fnum">01</span>
                <div>
                  <h3>Você manda a placa</h3>
                  <p>Foto da identificação, o modelo da centrífuga ou a peça já desmontada. Serve qualquer ponto de partida.</p>
                </div>
              </li>
              <li>
                <span className="fnum">02</span>
                <div>
                  <h3>A engenharia identifica</h3>
                  <p>Conferimos a compatibilidade na nossa base de mais de 20 mil itens OEM e equivalentes homologados.</p>
                </div>
              </li>
              <li>
                <span className="fnum">03</span>
                <div>
                  <h3>Você escolhe a origem</h3>
                  <p>O orçamento chega com OEM e equivalente lado a lado, com prazo e preço de cada item.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* COMPONENTES */}
        <section className="comp">
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Os componentes que fornecemos.</h2>
              <p className="lead comp_intro">Do coração da máquina aos itens de desgaste, cada peça com a função que ela cumpre na separação.</p>
            </div>
            <div className="comp_grid sep_reveal">
              <div className="part"><div className="pic"><Tag slot="pecasBowl" /></div><div className="pbody"><h4>Bowl / Rotor</h4><p>O coração da centrífuga, onde a separação acontece.</p></div></div>
              <div className="part"><div className="pic"><Tag slot="pecasDiscos" /></div><div className="pbody"><h4>Conjunto de discos</h4><p>Discos cônicos que multiplicam a área de separação.</p></div></div>
              <div className="part"><div className="pic"><Tag slot="pecasGravidade" /></div><div className="pbody"><h4>Disco de gravidade</h4><p>Define a posição da interface no modo purificador.</p></div></div>
              <div className="part"><div className="pic"><Tag slot="pecasRolamentos" /></div><div className="pbody"><h4>Rolamentos</h4><p>Sustentam os eixos. Principal fonte de vibração quando gastos.</p></div></div>
              <div className="part"><div className="pic"><Tag slot="pecasVedacoes" /></div><div className="pbody"><h4>Vedações e O-rings</h4><p>Itens de desgaste que garantem a estanqueidade do bowl.</p></div></div>
              <div className="part"><div className="pic"><Tag slot="pecasAgua" /></div><div className="pbody"><h4>Sistema de água</h4><p>Comanda a abertura e o fechamento do bowl autolimpante.</p></div></div>
            </div>
            <div className="comp_foot sep_reveal"><button className="btn btn_solid" onClick={() => navigate(quoteRoute(isAuthenticated))}>Cotar peças com a engenharia</button></div>
          </div>
        </section>

        {/* OEM vs EQUIVALENTE */}
        <section>
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>OEM ou equivalente?<br />Você decide.</h2>
              <p className="lead">Trabalhamos com as duas opções e detalhamos a origem de cada item no orçamento. A escolha, e a economia, fica com você.</p>
            </div>
            <div className="oe sep_reveal">
              <div className="oecard">
                <h3>Peça OEM</h3>
                <p>A peça original do fabricante, indicada quando a especificação exige a marca de origem ou a máquina ainda está em garantia de fábrica.</p>
                <ul>
                  <li>Marca original do fabricante</li>
                  <li>Indicada para garantia de fábrica</li>
                  <li>Rastreabilidade total</li>
                </ul>
              </div>
              <div className="oecard hl">
                <h3>Equivalente homologado</h3>
                <p>Peça aftermarket inspecionada e homologada pela nossa engenharia, 100% compatível com o original. Desempenho equivalente com economia real.</p>
                <ul>
                  <li>100% compatível com OEM</li>
                  <li>Inspeção rigorosa de qualidade</li>
                  <li>Economia sem perder confiabilidade</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MANUTENÇÃO */}
        <section>
          <div className="wrap maint sep_reveal">
            <div className="txt">
              <h2>Quando trocar as peças.</h2>
              <div className="num">8.000 h</div>
              <div className="num_sub">ou a cada 12 meses, o que vier primeiro.</div>
              <p>Respeitar o intervalo de serviço evita parada não planejada e protege o produto. Vedações, gaxetas, O-rings, rolamentos e correia são os primeiros a pedir atenção.</p>
            </div>
            <div className="signs">
              <h4>Sinais de que está na hora</h4>
              <ul>
                <li>Vibração ou ruído acima do normal</li>
                <li>Queda de rendimento na separação</li>
                <li>Vazamento e contaminação entre fases</li>
                <li>Aumento da temperatura de mancal</li>
                <li>Partida lenta ou patinando</li>
              </ul>
            </div>
          </div>
        </section>

        {/* MARCAS */}
        <section className="brands_sec">
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Marcas que atendemos.</h2>
              <p className="lead">Das séries clássicas às mais modernas, com cobertura completa de peças.</p>
            </div>
            <div className="brand_grid sep_reveal">
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
            <div className="brands_foot sep_reveal">
              <p className="lead">Não encontrou a sua marca? Atendemos outros fabricantes mediante consulta.</p>
              <button className="btn btn_solid" onClick={() => navigate(quoteRoute(isAuthenticated))}>Solicitar cotação</button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq">
          <div className="wrap">
            <div className="sec_head sep_reveal"><h2>Perguntas frequentes.</h2></div>
            <div className="faq_list sep_reveal">
              <div className="faq_item"><button className="faq_q">Vocês têm peça para o meu modelo?<span className="ic">+</span></button><div className="faq_a"><p>Atendemos as principais marcas e modelos do mercado. Cadastre a sua máquina ou envie a foto da placa que a engenharia confirma a compatibilidade e libera o catálogo certo para ela.</p></div></div>
              <div className="faq_item"><button className="faq_q">A peça equivalente tem garantia?<span className="ic">+</span></button><div className="faq_a"><p>Sim. Os itens de não desgaste contam com garantia de 3 meses. As peças equivalentes são homologadas pela nossa engenharia e 100% compatíveis com o original.</p></div></div>
              <div className="faq_item"><button className="faq_q">Qual a diferença entre OEM e equivalente?<span className="ic">+</span></button><div className="faq_a"><p>A OEM é a peça original do fabricante. A equivalente é uma peça aftermarket homologada, com desempenho equivalente e economia real. A origem de cada item vem detalhada no orçamento, e a escolha é sua.</p></div></div>
              <div className="faq_item"><button className="faq_q">Como vejo preços e disponibilidade?<span className="ic">+</span></button><div className="faq_a"><p>Os itens, preços e kits compatíveis com a sua máquina ficam disponíveis após o login. Basta cadastrar o seu equipamento para a engenharia liberar o catálogo certo.</p></div></div>
              <div className="faq_item"><button className="faq_q">Qual o prazo de envio das peças?<span className="ic">+</span></button><div className="faq_a"><p>Itens em estoque despacham em até 24 horas úteis, com logística porta a porta para toda a América Latina. Itens sob encomenda têm prazo informado no orçamento.</p></div></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap sep_reveal">
            <h2>Entre e veja o<br />catálogo completo.</h2>
            <p className="lead">Os itens, preços e kits compatíveis com a sua máquina ficam disponíveis após o login.</p>
            <div className="btns">
              <button className="btn btn_solid" onClick={() => navigate(R.registro)}>Criar conta</button>
              <button className="btn btn_line" style={{ color: 'var(--ink)' }} onClick={() => navigate(R.login)}>Fazer login</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}



    </SiteLayout>
  )
}
