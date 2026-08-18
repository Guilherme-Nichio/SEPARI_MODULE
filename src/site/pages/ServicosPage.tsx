/* ============================================================================
   src/site/pages/ServicosPage.tsx  —  Serviços

   Markup convertido do HTML original sem alteração de estrutura, classes ou
   texto. O que mudou: <a href> virou <Link>, os <button> ganharam navegação e
   os scripts inline viraram hooks. O CSS vive em styles/site/servicos.css,
   escopado em .sep-servicos.
   ========================================================================== */
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SiteLayout from '../SiteLayout'
import { Bg } from '../Media'
import HeroBgVideo from '../HeroBgVideo'
import { IMG, STEP_KEYS } from '../assets'
import { R, quoteRoute, catalogRoute, external } from '../routes'
import { useFaq, useReveal, useStepsScroll } from '../hooks/siteHooks'

/* A etiqueta de caminho que aparece sobre a moldura das etapas. Enquanto os
   slots estão vazios mostra o arquivo esperado; assim que você preenche o
   assets.ts ela some sozinha. */
const STEP_LABELS = STEP_KEYS.map((k) => IMG[k].label)
const STEPS_FILLED = STEP_KEYS.every((k) => Boolean(IMG[k].src))

export default function ServicosPage() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  useReveal(ref, 0.12)
  useFaq(ref)
  useStepsScroll(ref, STEP_LABELS)

  return (
    <SiteLayout page="servicos" containerRef={ref}>
{/* HERO (pronto para vídeo) */}
        <header className="hero">
          
          {/* Vídeo de fundo (Nível 1) + véu verde (Nível 2), pelo mesmo
              componente das outras três páginas. As camadas seguem a ordem já
              fixada em styles/site/_legacy-collisions.css:
              fallback 0 · vídeo 1 · véu 2 · texto 3. */}
          <HeroBgVideo slot="servicosHero" zIndex={1} />

          <div className="video_fallback"></div>
          <div className="wrap hero_inner" style={{ zIndex: 3 }}>
            <div className="crumbs"><a href="separi-home.html">Início</a> / Serviços</div>
            <h1>De volta à<br /><em>rotação de projeto.</em></h1>
            <p>Preventiva, revisão e recondicionamento por quem se formou na escola dos próprios fabricantes.</p>
          </div>
          <div className="scroll_hint">↓</div>
        </header>

        {/* INTRO */}
        <section className="intro">
          <div className="wrap sep_reveal">
            <h2>Manutenção que <em>protege a produção.</em></h2>
            <p className="lead">Em campo ou na oficina, cada centrífuga volta a operar dentro das tolerâncias de fábrica. Sem improviso, com relatório e garantia.</p>
          </div>
        </section>

        {/* PREVENTIVA */}
        <section>
          <div className="wrap split sep_reveal">
            <div className="txt">
              <h2>Preventiva.</h2>
              <p className="lead">A rotina que evita a parada. Inspeção regular baseada na condição de operação, antes de o problema aparecer.</p>
              <ul>
                <li>Inspeção de bowl, vedações e portas</li>
                <li>Troca de gaxetas no intervalo certo</li>
                <li>Lubrificação e checagem do rotativo</li>
              </ul>
            </div>
            <div className="shape blob"><Bg slot="svcPreventiva" className="img" showLabel /></div>
          </div>
        </section>

        {/* REVISÃO */}
        <section>
          <div className="wrap split rev sep_reveal">
            <div className="txt">
              <h2>Revisão geral.</h2>
              <p className="lead">A revisão anual completa. Tudo da preventiva, mais uma análise profunda de chassi e estrutura para planejar o futuro.</p>
              <ul>
                <li>Desmontagem completa e limpeza</li>
                <li>Rolamentos, eixos e drives sob controle</li>
                <li>Teste de desempenho e calibração</li>
              </ul>
            </div>
            <div className="shape"><Bg slot="svcRevisao" className="img" showLabel /></div>
          </div>
        </section>

        {/* ===== ETAPAS, STICKY SCROLL ===== */}
        <div className="steps_scroll" id="stepsScroll">
          <div className="steps_pin">
            <div className="wrap">
              <div className="steps_head">
                <div className="lbl">Da chegada à entrega</div>
                <h2>O caminho do seu equipamento.</h2>
              </div>

              <div className="steps_layout">
                {/* MÍDIA */}
                <div className="steps_media">
                  <Bg slot="etapaChegada" className="frame on" data-i="0" />
                  <Bg slot="etapaDesmontagem" className="frame" data-i="1" />
                  <Bg slot="etapaOrcamento" className="frame" data-i="2" />
                  <Bg slot="etapaExecucao" className="frame" data-i="3" />
                  <Bg slot="etapaTeste" className="frame" data-i="4" />
                  {!STEPS_FILLED && <span className="tag" id="mediaTag">{STEP_LABELS[0]}</span>}
                  <span className="badge" id="mediaBadge">01</span>
                </div>

                {/* TEXTO */}
                <div className="steps_text">
                  <div className="panel on" data-i="0">
                    <div className="step_n">ETAPA 01</div>
                    <h3>Chegada do equipamento.</h3>
                    <p>Recebimento, identificação e registro fotográfico completo da máquina exatamente como ela chegou à oficina.</p>
                  </div>
                  <div className="panel" data-i="1">
                    <div className="step_n">ETAPA 02</div>
                    <h3>Desmontagem e inspeção.</h3>
                    <p>Desmontagem completa com inspeção dimensional, líquido penetrante e mapa de desgaste documentado peça a peça.</p>
                  </div>
                  <div className="panel" data-i="2">
                    <div className="step_n">ETAPA 03</div>
                    <h3>Orçamento técnico.</h3>
                    <p>Diagnóstico transparente com escopo, peças a substituir, prazo e custo. Você aprova antes de qualquer intervenção.</p>
                  </div>
                  <div className="panel" data-i="3">
                    <div className="step_n">ETAPA 04</div>
                    <h3>Aprovação e execução.</h3>
                    <p>Usinagem, tratamento de superfície contra incrustação e corrosão, revisão elétrica e de automação, montagem, ajustes, balanceamento dinâmico em dois planos na rotação nominal com simulação de descarga, troca de itens de desgaste e remontagem.</p>
                  </div>
                  <div className="panel" data-i="4">
                    <div className="step_n">ETAPA 05</div>
                    <h3>Teste funcional e entrega.</h3>
                    <p>Teste de 8 a 10 horas com água industrial, relatório fotográfico, certificado de balanceamento e devolução pronta para operar.</p>
                  </div>
                </div>
              </div>

              {/* PROGRESSO */}
              <div className="steps_prog">
                <div className="bar"><div className="fill" id="stepsFill"></div></div>
                <div className="ticks" id="stepsTicks">
                  <span className="on">01</span><span>02</span><span>03</span><span>04</span><span>05</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPARATIVO */}
        <section className="cmp_sec">
          <div className="wrap">
            <div className="head sep_reveal">
              <h2>O que entra em cada serviço.</h2>
              <p className="lead" style={{ "marginTop": "22px" }}>Compare o escopo das nossas principais intervenções.</p>
            </div>
            <div className="cmp sep_reveal">
              <table>
                <thead>
                  <tr>
                    <th>Escopo técnico</th>
                    <th>Preventiva<span>em campo</span></th>
                    <th>Revisão geral<span>em campo</span></th>
                    <th>Oficina<span>Indaiatuba</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Inspeção do bowl e peças</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Troca de gaxetas e vedações</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Relatório técnico detalhado</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Inspeção do chassi e estrutura</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Substituição de rolamentos</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Testes de calibração</td><td><span className="no">·</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Balanceamento dinâmico</td><td><span className="no">·</span></td><td><span className="no">·</span></td><td><span className="yes">✓</span></td></tr>
                  <tr><td>Microusinagem e jateamento</td><td><span className="no">·</span></td><td><span className="no">·</span></td><td><span className="yes">✓</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CAMPO x OFICINA */}
        <section>
          <div className="wrap">
            <div className="sep_reveal">
              <h2>Onde você precisar.</h2>
              <p className="lead" style={{ "maxWidth": "480px", "marginTop": "22px" }}>Na sua planta ou na nossa oficina em Indaiatuba, com a mesma engenharia.</p>
            </div>
            <div className="duo sep_reveal">
              <div className="duo_tile">
                <Bg slot="svcCampo" className="img" />
                <div className="cap">
                  <h3>Em campo</h3>
                  <p>Vamos até o seu navio ou planta e resolvemos onde o problema acontece, com o mínimo de parada.</p>
                  <a className="more" {...external} href={R.whatsapp}>Agendar visita →</a>
                </div>
              </div>
              <div className="duo_tile">
                <Bg slot="svcOficina" className="img" />
                <div className="cap">
                  <h3>Na oficina</h3>
                  <p>Reconstrução completa com balanceamento, microusinagem e teste contínuo antes de voltar ao serviço.</p>
                  <a className="more" {...external} href={R.whatsapp}>Enviar equipamento →</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROTECAO */}
        <section className="prot">
          <div className="wrap">
            <div className="head sep_reveal">
              <h2>O que a rotina evita.</h2>
              <p className="lead" style={{ "marginTop": "22px" }}>Manutenção não é custo, é proteção. Veja o que mantemos longe da sua planta.</p>
            </div>
            <div className="prot_grid sep_reveal">
              <div className="prot_item"><div className="dot">✕</div><div><h4>Parada não planejada</h4><p>Inspeção programada e leitura de vibração antecipam a falha antes da quebra.</p></div></div>
              <div className="prot_item"><div className="dot">✕</div><div><h4>Contaminação do produto</h4><p>Troca de vedações no intervalo certo protege o produto e os componentes internos.</p></div></div>
              <div className="prot_item"><div className="dot">✕</div><div><h4>Vibração em alta rotação</h4><p>Balanceamento dinâmico mantém o conjunto na tolerância e seguro a plena rotação.</p></div></div>
              <div className="prot_item"><div className="dot">✕</div><div><h4>Custo de corretiva</h4><p>Preventiva custa uma fração de uma corretiva e mantém a planta produzindo.</p></div></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq">
          <div className="wrap">
            <div className="head sep_reveal"><h2>Dúvidas.</h2></div>
            <div className="faq_list sep_reveal">
              <div className="faq_item"><button className="faq_q">Vocês atendem em campo na minha planta?<span className="ic">+</span></button><div className="faq_a"><p>Sim. Nossa equipe vai até a sua instalação industrial ou embarcação, com técnicos certificados, para diagnóstico, manutenção e substituição de componentes no local.</p></div></div>
              <div className="faq_item"><button className="faq_q">Quanto tempo leva uma revisão geral?<span className="ic">+</span></button><div className="faq_a"><p>O prazo depende do modelo e do estado do equipamento. Informamos o cronograma no orçamento técnico, após a desmontagem e inspeção inicial.</p></div></div>
              <div className="faq_item"><button className="faq_q">O balanceamento dinâmico é computadorizado?<span className="ic">+</span></button><div className="faq_a"><p>Sim. Usamos balanceadora computadorizada com correção em dois planos na rotação nominal, conforme as tolerâncias OEM e ISO.</p></div></div>
              <div className="faq_item"><button className="faq_q">Vocês fornecem peças junto com o serviço?<span className="ic">+</span></button><div className="faq_a"><p>Sim. Fornecemos peças OEM e equivalentes certificadas, já incluídas no escopo do serviço quando necessário.</p></div></div>
              <div className="faq_item"><button className="faq_q">Qual a garantia dos serviços executados?<span className="ic">+</span></button><div className="faq_a"><p>quipamentos revisados, consertados ou reformados pela SEPARI possuem garantia de 03 (três) meses para operação em regime de 24 (vinte e quatro) horas/dia e 06 (seis) meses para operação em regime de 08 (oito) horas/dia. O prazo é contado a partir da data de emissão da nota fiscal de retorno do equipamento ao cliente.</p></div></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap sep_reveal">
            <h2>Pronto para elevar<br />o seu processo?</h2>
            <p className="lead">A nossa equipe de engenharia está a postos.</p>
            <div className="btns">
              <a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com especialista</a>
              <button className="btn btn_line" style={{ color: 'var(--ink)' }} onClick={() => navigate(R.produtos)}>Ver equipamentos</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}



    </SiteLayout>
  )
}
