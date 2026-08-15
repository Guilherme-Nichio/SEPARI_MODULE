/* ============================================================================
   src/site/pages/ProdutosPage.tsx  —  Produtos

   Markup convertido do HTML original sem alteração de estrutura, classes ou
   texto. O que mudou: <a href> virou <Link>, os <button> ganharam navegação e
   os scripts inline viraram hooks. O CSS vive em styles/site/produtos.css,
   escopado em .sep-produtos.
   ========================================================================== */
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SiteLayout from '../SiteLayout'
import { Bg } from '../Media'
import { R, quoteRoute, catalogRoute, external } from '../routes'
import { useFaq, useReveal } from '../hooks/siteHooks'

export default function ProdutosPage() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  useReveal(ref, 0.1)
  useFaq(ref)

  return (
    <SiteLayout page="produtos" containerRef={ref}>
        {/* HERO */}
        <header className="hero">
          <Bg slot="prodHero" className="bg" />
          <div className="video_fallback"></div>
          <div className="wrap hero_inner">
            <div className="htxt">
              <div className="crumbs"><a href="separi-home.html">Início</a> / Produtos</div>
              <h1>Separação<br />centrífuga<br /><em>industrial.</em></h1>
            </div>
            <div className="hero_side">
              <p>Máquinas novas, recondicionadas, bowls e automação. Em um só fornecedor.</p>
              <div className="actions">
                <a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com especialista</a>
              </div>
            </div>
          </div>
          <div className="scroll_hint">↓</div>
        </header>

        {/* SPOTLIGHT MÁQUINAS SEPARI */}
        <section>
          <div className="wrap spot sep_reveal">
            <div className="txt">
              <h2>Máquinas Separi.<br />Feitas para durar.</h2>
              <p>Separadoras de discos novas, com a qualidade de quem recondiciona as melhores máquinas do mundo. Dimensionadas para o seu processo e entregues operando.</p>
              <div className="actions"><button className="btn btn_solid" onClick={() => navigate(R.maquinasNovas)}>Conhecer a linha</button></div>
            </div>
            <div className="visual">
              <Bg slot="prodMaquina" className="img" showLabel />
            </div>
          </div>
        </section>

        {/* TIPOS DE MÁQUINA */}
        <section style={{ "paddingTop": "0" }}>
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Comece pelo tipo de máquina.</h2>
              <p className="lead">Duas arquiteturas, dois jeitos de separar. Veja qual combina com o seu processo.</p>
            </div>
            <div className="types sep_reveal">
              <a className="type" href="#separadoras">
                <Bg slot="prodSeparadoras" className="img" />
                <div className="cap">
                 
                  <h3>Separadoras de discos</h3>
                  <p>Clarificação e separação líquido a líquido de alta rotação, com bowl autolimpante para desnate, recuperação e purificação.</p>
                  <span className="more">Ver separadoras →</span>
                </div>
              </a>
              <a className="type" href="#centrifugas">
                <Bg slot="prodCentrifugas" className="img" />
                <div className="cap">
                
                  <h3>Centrífugas e decanters</h3>
                  <p>Desidratação e espessamento contínuos para materiais com alto teor de sólidos em suspensão.</p>
                  <span className="more">Ver centrífugas →</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* DETALHE SEPARADORAS */}
        <section id="separadoras">
          <div className="wrap detail sep_reveal">
            <div className="dtxt">
              <div className="over">Separadoras de discos</div>
              <h2>Separação de alta precisão, disco a disco.</h2>
              <p>Uma pilha de discos cônicos gira em alta rotação para separar líquidos de densidades diferentes e remover sólidos finos com pureza elevada. É a tecnologia por trás de desnatadeiras, clarificadoras e purificadores.</p>
              <ul>
                <li>Purificador: remove água e finos do óleo, como em combustível marítimo</li>
                <li>Clarificador: retira sólidos em suspensão, clarificando o produto</li>
                <li>Autolimpante: ejeta os sólidos sem parar a produção</li>
              </ul>
              <div className="actions"><a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com especialista</a></div>
            </div>
            <div className="dimg"><Bg slot="prodSepDetalhe" className="img" showLabel /></div>
          </div>
        </section>

        {/* DETALHE CENTRÍFUGAS */}
        <section id="centrifugas" style={{ "paddingTop": "0" }}>
          <div className="wrap detail rev sep_reveal">
            <div className="dtxt">
              <div className="over">Centrífugas decanter</div>
              <h2>Sólidos pesados, separação contínua.</h2>
              <p>Um tambor horizontal com rosca transportadora desidrata e espessa materiais com alto teor de sólidos em regime contínuo. É a primeira linha de defesa em separações de carga pesada.</p>
              <ul>
                <li>Duas fases: separa sólido e líquido continuamente</li>
                <li>Três fases: separa óleo, água e sólidos ao mesmo tempo</li>
                <li>Solid bowl reforçado para polpas minerais abrasivas</li>
              </ul>
              <div className="actions"><a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com especialista</a></div>
            </div>
            <div className="dimg"><Bg slot="prodCentDetalhe" className="img" showLabel /></div>
          </div>
        </section>

        {/* SEGMENTOS */}
        <section className="seg">
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>O seu segmento está aqui.</h2>
              <p className="lead">Dimensionamos a máquina certa para a realidade de cada setor. Encontre o seu.</p>
            </div>
            <div className="seg_grid sep_reveal">
              <Link className="seg_card" to={`/aplicacoes/laticinios`}><Bg slot="segLaticinios" className="img" /><span className="cap">Laticínios</span></Link>
              <Link className="seg_card" to={`/aplicacoes/cervejarias`}><Bg slot="segCervejaria" className="img" /><span className="cap">Cervejaria</span></Link>
              <Link className="seg_card" to={`/aplicacoes/sumos-e-bebidas`}><Bg slot="segBebidas" className="img" /><span className="cap">Sumos e bebidas</span></Link>
              <Link className="seg_card" to={`/aplicacoes/marinha-e-naval`}><Bg slot="segNaval" className="img" /><span className="cap">Marinha e naval</span></Link>
              <Link className="seg_card" to={`/aplicacoes/oleos`}><Bg slot="segOleos" className="img" /><span className="cap">Óleos</span></Link>
              <Link className="seg_card" to={`/aplicacoes/farmaceutica`}><Bg slot="segFarma" className="img" /><span className="cap">Farmacêutica</span></Link>
              <Link className="seg_card" to={`/aplicacoes/oleo-e-gas`}><Bg slot="segOleoGas" className="img" /><span className="cap">Óleo e gás</span></Link>
              <Link className="seg_card" to={`/aplicacoes/mineracao`}><Bg slot="segMineracao" className="img" /><span className="cap">Mineração</span></Link>
              <Link className="seg_card" to={`/aplicacoes/geracao-de-energia`}><Bg slot="segEnergia" className="img" /><span className="cap">Geração de energia</span></Link>
              <Link className="seg_card" to={`/aplicacoes/fluidos-industriais`}><Bg slot="segFluidos" className="img" /><span className="cap">Fluidos industriais</span></Link>
            </div>
          </div>
        </section>

        {/* RECONDICIONADO */}
        <section className="recon">
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Não é usado.<br />É recondicionado.</h2>
              <p className="lead">Desmontada por completo, inspecionada peça por peça, rebalanceada e testada. Com o desempenho de uma nova e histórico comprovado em planta.</p>
            </div>
            <div className="recon_grid sep_reveal">
              <div className="rfeat"><h4>Garantia equivalente à OEM</h4><p>O recondicionamento é coberto por garantia equivalente à de um equipamento novo.</p></div>
              <div className="rfeat"><h4>Desmontagem total</h4><p>Cada parafuso, disco, mola e válvula é inspecionado e recuperado ou trocado por peça nova.</p></div>
              <div className="rfeat"><h4>Balanceado e testado</h4><p>Bowl rebalanceado e teste contínuo de 8 a 10 horas antes do envio.</p></div>
              <div className="rfeat"><h4>Entrega rápida</h4><p>Unidades prontas em programa de entrega rápida para minimizar a parada.</p></div>
            </div>
          </div>
        </section>

        {/* NÍVEIS */}
        <section className="levels">
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Usado, revisado ou remanufaturado?</h2>
              <p className="lead">Do padrão de mercado ao remanufaturado Separi, com garantia equivalente à de um equipamento novo.</p>
            </div>
            <div className="lvl_cards sep_reveal">
              <div className="lvl">
                <div className="k">Padrão de mercado</div>
                <h3>Usado / Revisado</h3>
                <p>Limpeza, troca de itens de desgaste óbvios e revisão básica. Não passa por inspeção completa nem balanceamento.</p>
              </div>
              <div className="lvl">
                <div className="k">Service overhaul</div>
                <h3>Revisado Separi</h3>
                <p>Inspeção do bowl, verificação de tolerâncias, troca de rolamentos, eixos e selos, balanceamento e teste de bancada, com garantia.</p>
              </div>
              <div className="lvl best">
                <div className="k">Como novo</div>
                <h3>Remanufaturado Separi</h3>
                <p>Desmontagem total. Cada peça inspecionada e recuperada ou trocada por nova. Funcionalidade, qualidade e garantia equivalentes a um OEM.</p>
              </div>
            </div>
            <div className="cmp sep_reveal">
              <table>
                <thead>
                  <tr>
                    <th>Etapa do recondicionamento</th>
                    <th>Usado<span>padrão de mercado</span></th>
                    <th>Revisado<span>service overhaul</span></th>
                    <th>Remanufaturado<span>como novo</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Inspeção de erosão, lock ring e roscas</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Polimento, refino e novas gaxetas do bowl</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Limpeza do chassi e remoção de controles antigos</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Limpeza química e teste de trincas</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Verificação de tolerâncias e discos</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Balanceamento dinâmico computadorizado</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Novos rolamentos, eixos e selos</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Teste contínuo de 8 a 10 horas</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Jateamento e pintura interna e externa</td><td><span className="no">·</span></td><td><span className="no">·</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Reconstrução da embreagem e bombas</td><td><span className="no">·</span></td><td><span className="no">·</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Motor retificado com rolamentos novos</td><td><span className="no">·</span></td><td><span className="no">·</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Novo painel de controle e calibração</td><td><span className="no">·</span></td><td><span className="no">·</span></td><td><span className="yes">✓</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DISPONIBILIDADE */}
        <section>
          <div className="wrap sep_reveal">
            <div className="avail">
              <div className="atxt">
                <h2>Consulte a disponibilidade.</h2>
                <p>Mantemos separadoras, clarificadoras e decanters recondicionados em estoque, de diversas marcas. Como o inventário gira rápido, o modelo ideal para o seu processo é confirmado no contato com a nossa engenharia.</p>
                <div className="actions">
                  <a className="btn btn_solid" {...external} href={R.whatsapp}>Consultar disponibilidade</a>
                  <a className="btn btn_line" style={{ color: 'var(--ink)' }} {...external} href={R.whatsapp}>Falar no WhatsApp</a>
                </div>
              </div>
              <div className="avail_list">
                <div className="avail_row"><span className="n">Separadoras</span><span className="s">Sob consulta</span></div>
                <div className="avail_row"><span className="n">Clarificadoras</span><span className="s">Sob consulta</span></div>
                <div className="avail_row"><span className="n">Decanters</span><span className="s">Sob consulta</span></div>
                <div className="avail_row"><span className="n">Purificadores marítimos</span><span className="s">Sob consulta</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* BOWL LOCAÇÃO */}
        <section>
          <div className="wrap bowl sep_reveal">
            <div className="txt">
              <h2>Troque o bowl.<br />Não pare a linha.</h2>
              <p>Instalamos um bowl do nosso estoque numa única visita e levamos o seu para recondicionar ao padrão OEM. A produção segue girando.</p>
              <ul>
                <li>Trocamos o rotor por um de locação numa única visita</li>
                <li>A sua linha volta a operar e levamos o seu para a oficina</li>
                <li>Recondicionado ao padrão OEM, fazemos a troca final</li>
              </ul>
              <div className="actions"><a className="btn btn_solid" {...external} href={R.whatsapp}>Consultar disponibilidade</a></div>
            </div>
            <div className="visual"><Bg slot="prodBowl" className="img" showLabel /></div>
          </div>
        </section>

        {/* PROGRAMA DE LOCAÇÃO */}
        <section className="rent_sec">
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Produção que não para.</h2>
              <p className="lead">Alugamos bowls, equipamentos completos e automação enquanto cuidamos do seu ativo, para você atravessar a manutenção sem parar a linha.</p>
            </div>
            <div className="rent_list sep_reveal">
              <div className="rrow"><h4>Bowls e rotores</h4><p>Trocamos o seu rotor por um do nosso estoque numa única visita. Você segue produzindo enquanto recondicionamos o seu ao padrão OEM.</p></div>
              <div className="rrow"><h4>Equipamento completo</h4><p>Separadoras e clarificadoras recondicionadas em locação, para picos de produção, contingência ou enquanto a sua máquina está em revisão.</p></div>
              <div className="rrow"><h4>Painéis e automação</h4><p>Unidades de controle e inversores disponíveis para uso temporário, mantendo a sua linha operando durante upgrades.</p></div>
              <div className="rrow"><h4>Logística de ida e volta</h4><p>Cuidamos da retirada, instalação e devolução, com prazos combinados para minimizar qualquer parada da planta.</p></div>
            </div>
            <div className="rent_cta sep_reveal">
              <strong>Precisa de uma janela de manutenção sem parar a linha?</strong>
              <a className="btn btn_solid" {...external} href={R.whatsapp}>Consultar locação</a>
            </div>
          </div>
        </section>

        {/* AUTOMAÇÃO */}
        <section>
          <div className="wrap">
            <div className="sec_head sep_reveal">
              <h2>Automação e controles.</h2>
              <p className="lead">Painéis modernos e inversores de frequência para operar qualquer equipamento Alfa Laval, Tetra Pak ou Westfalia, novo ou de décadas atrás.</p>
            </div>
            <div className="auto sep_reveal">
              <div className="acard">
                <h4>Inversores de frequência</h4>
                <p>Drives Allen Bradley pré-programados em qualquer faixa de potência para a sua aplicação.</p>
                <ul>
                  <li>Aceleração de arranque suave</li>
                  <li>Redução do consumo de corrente</li>
                  <li>Aumento da vida útil do motor</li>
                </ul>
              </div>
              <div className="acard">
                <h4>Painéis de controle</h4>
                <p>Painéis modernos que otimizam a automação e integram a máquina à fábrica, acabando com falhas de quadros desatualizados.</p>
                <ul>
                  <li>Monitoramento e diagnóstico remoto</li>
                  <li>Interface touch intuitiva</li>
                  <li>Integração com SCADA da fábrica</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* BUY BACK */}
        <section>
          <div className="wrap sep_reveal">
            <div className="buyback">
              <h2>Compramos o seu equipamento usado.</h2>
              <p>Tem centrífugas ou separadores Alfa Laval, Westfalia ou Tetra Pak parados na sua fábrica? A Separi adquire máquinas usadas para o programa de recondicionamento. Avaliação gratuita.</p>
              <div className="actions"><a className="btn btn_solid" {...external} href={R.whatsapp}>Solicitar avaliação</a></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq">
          <div className="wrap">
            <div className="sec_head sep_reveal"><h2>Dúvidas sobre os equipamentos.</h2></div>
            <div className="faq_list sep_reveal">
              <div className="faq_item"><button className="faq_q">O que está incluído numa centrífuga recondicionada Separi?<span className="ic">+</span></button><div className="faq_a"><p>Desmontagem total, inspeção peça a peça, balanceamento dinâmico, teste contínuo de 8 a 10 horas e certificado. O nível remanufaturado entrega funcionalidade e garantia equivalentes a um equipamento OEM.</p></div></div>
              <div className="faq_item"><button className="faq_q">Qual a garantia das máquinas recondicionadas?<span className="ic">+</span></button><div className="faq_a"><p>As unidades remanufaturadas contam com garantia equivalente à de um equipamento novo, acompanhadas de relatório técnico.</p></div></div>
              <div className="faq_item"><button className="faq_q">Vocês alugam bowls e peças?<span className="ic">+</span></button><div className="faq_a"><p>Sim. Temos programa de locação de bowls, equipamentos completos e automação, com logística de ida e volta para não parar a sua linha.</p></div></div>
              <div className="faq_item"><button className="faq_q">Tenho um equipamento parado, vocês compram?<span className="ic">+</span></button><div className="faq_a"><p>Sim. Adquirimos máquinas usadas Alfa Laval, Westfalia e Tetra Pak para o nosso programa de recondicionamento. A avaliação é gratuita.</p></div></div>
              <div className="faq_item"><button className="faq_q">Como sei qual modelo é ideal para o meu processo?<span className="ic">+</span></button><div className="faq_a"><p>Basta informar produto, vazão e setor. A nossa engenharia recomenda o modelo certo e confirma a disponibilidade no momento do contato.</p></div></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap sep_reveal">
            <h2>Pronto para elevar<br />o seu processo?</h2>
            <p className="lead">A nossa equipe de engenharia está a postos. Cotações, peças e equipamentos.</p>
            <div className="btns">
              <a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com especialista</a>
              <button className="btn btn_line" style={{ color: 'var(--ink)' }} onClick={() => navigate(R.pecas)}>Acessar catálogo de peças</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}



    </SiteLayout>
  )
}
