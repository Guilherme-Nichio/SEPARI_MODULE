import { Link } from 'react-router-dom'
import {
  Settings, Wrench, MessageCircle, ArrowRight,
  Check, MapPin, Building2, AlertCircle, AlertTriangle,
  Layers, Phone, Shield, Clock, Cog
} from 'lucide-react'
import Reveal from '../components/Reveal'
import ParallaxSection from '../components/ParallaxSection'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

const comparisonRows = [
  { label: 'Inspeção do Bowl e Peças', preventiva: true, revisao: true, oficina: true },
  { label: 'Troca de Gaxetas e Vedações', preventiva: true, revisao: true, oficina: true },
  { label: 'Relatório Técnico Detalhado', preventiva: true, revisao: true, oficina: true },
  { label: 'Inspeção do Chassi e Estrutura', preventiva: false, revisao: true, oficina: true },
  { label: 'Substituição de Rolamentos', preventiva: false, revisao: true, oficina: true },
  { label: 'Testes de Calibração', preventiva: false, revisao: true, oficina: true },
  { label: 'Balanceamento Dinâmico', preventiva: false, revisao: false, oficina: true },
  { label: 'Microusinagem e Jateamento', preventiva: false, revisao: false, oficina: true }
]

const problems = [
  {
    icon: <AlertCircle size={28} />,
    title: 'Paragens Não Planeadas',
    desc: 'Perda de horas de produção valiosas por falhas que poderiam ser previstas e corrigidas antes de quebrarem.'
  },
  {
    icon: <AlertTriangle size={28} />,
    title: 'Contaminação e Danos',
    desc: 'Contaminação do produto final ou danos irreversíveis aos componentes internos (rotores e eixos) do separador.'
  },
  {
    icon: <Layers size={28} />,
    title: 'Custos Exorbitantes',
    desc: 'O custo de uma reparação corretiva massiva é imensamente maior do que os custos de contratos de manutenção preventiva.'
  }
]

export default function Servicos() {
  return (
    <>
      <Seo
        title="Serviços, Manutenção, Recondicionamento e Suporte Técnico · Separi"
        description="Manutenção preventiva, revisão geral, balanceamento dinâmico e serviço de campo para centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital. Equipe técnica especializada e oficina completa em Indaiatuba/SP."
      />
      {/* HERO - Blueprint técnico */}
      <section className="page-intro page-intro-servicos">
        <div className="container">
          <Reveal variant="fade-up">
            <nav className="servicos-hero-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link>
              <span className="sep" />
              <span className="current">Serviços</span>
            </nav>
          </Reveal>

          <div className="servicos-hero-top">
            <div>


              <Reveal variant="fade-up" delay={120}>
                <h1 className="servicos-hero-title">
                  Manter seu processo<br />
                  <em>sempre operando.</em>
                </h1>
              </Reveal>

              <Reveal variant="fade-up" delay={180}>
                <p className="servicos-hero-lead">
                  Manutenção preventiva em campo, revisão geral em oficina e recondicionamento integral.
                  Cada serviço executado por engenheiros formados pelos próprios fabricantes e documentado
                  em relatório técnico fotográfico.
                </p>
              </Reveal>

              <Reveal variant="fade-up" delay={240}>
                <div className="servicos-hero-ctas">
                  <a href="#preventiva" className="btn btn-primary btn-lg">
                    Ver tipos de serviço <ArrowRight size={16} />
                  </a>
                  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg">
                    <MessageCircle size={16} /> Agendar avaliação
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal variant="fade-up" delay={320}>
            <div className="servicos-hero-process">
              <div className="servicos-hero-step">
                <div className="servicos-hero-step-num">01</div>
                <h3 className="servicos-hero-step-title">Diagnóstico em campo</h3>
                <p className="servicos-hero-step-desc">
                  Avaliação técnica presencial com leitura de vibração, temperatura de mancais e
                  inspeção do bowl em operação.
                </p>
              </div>
              <div className="servicos-hero-step">
                <div className="servicos-hero-step-num">02</div>
                <h3 className="servicos-hero-step-title">Execução documentada</h3>
                <p className="servicos-hero-step-desc">
                  Serviço executado em campo ou na nossa oficina técnica com balanceamento dinâmico
                  e inspeção não destrutiva.
                </p>
              </div>
              <div className="servicos-hero-step">
                <div className="servicos-hero-step-num">03</div>
                <h3 className="servicos-hero-step-title">Relatório e garantia</h3>
                <p className="servicos-hero-step-desc">
                  Entrega de relatório técnico fotográfico, certificado de balanceamento e garantia
                  de até 12 meses.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MANUTENÇÃO PREVENTIVA */}
      <section id="preventiva" className="section-padding bg-subtle">
        <div className="container">
          <div className="grid-2 gap-60 align-center">
            <Reveal variant="fade-right">
              <div className="image-frame">
                <img
                  src="/teste.png"
                  alt="Manutenção preventiva em campo"
                  className="image-frame-photo"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <Settings className="main-icon" />
                <div className="float-badge">
                  <span className="eyebrow">Minor Service</span>
                  <div className="label">Inspeção regular condicional</div>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <div>
                <span className="eyebrow">Minor Service</span>
                <h2 className="section-title">
                  Manutenção <span className="text-gradient">Preventiva</span>
                </h2>
                <p className="text-lg mt-20">
                  A manutenção preventiva é a forma mais eficaz de evitar problemas inesperados
                  e proteger o desempenho a longo prazo do seu separador.
                </p>
                <p className="text-lg mt-20 mb-30">
                  Realizamos inspeções regulares e verificações baseadas na condição operacional.
                  A nossa equipa orienta os seus operadores sobre como limpar adequadamente e
                  identificar desgaste.
                </p>
                <div className="checklist">
                  <p><Check size={20} className="check-icon" /> Inspeção do bowl, vedações e portas de entrada/saída</p>
                  <p><Check size={20} className="check-icon" /> Serviço intermediário com troca de gaxetas</p>
                  <p><Check size={20} className="check-icon" /> Lubrificação e verificação de componentes rotativos</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* REVISÃO GERAL */}
      <section id="revisao" className="section-padding bg-white">
        <div className="container">
          <div className="grid-2 gap-60 align-center">
            <Reveal variant="fade-right">
              <div>
                <span className="eyebrow">Major Service</span>
                <h2 className="section-title">
                  Revisão <span className="text-gradient">Geral</span>
                </h2>
                <p className="text-lg mt-20">
                  O Major Service é a revisão anual completa do seu equipamento. Inclui todos
                  os itens do serviço preventivo, acrescidos de uma análise profunda no chassi
                  e componentes estruturais.
                </p>
                <p className="text-lg mt-20 mb-30">
                  Isso dá-nos a oportunidade de identificar problemas futuros a curto prazo e
                  evitar inatividade não planeada, além de permitir o planeamento de orçamentos
                  para reparações maiores.
                </p>
                <div className="checklist">
                  <p><Check size={20} className="check-icon" /> Desmontagem completa e limpeza geral</p>
                  <p><Check size={20} className="check-icon" /> Verificação de rolamentos, eixos e drives</p>
                  <p><Check size={20} className="check-icon" /> Teste de desempenho (Água/Produto) e calibração</p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <div className="image-frame">
                <img
                  src="/teste.png"
                  alt="Revisão geral em oficina"
                  className="image-frame-photo"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <Wrench className="main-icon" />
                <div className="float-badge">
                  <span className="eyebrow">Major Service</span>
                  <div className="label">Revisão anual completa</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TABELA COMPARATIVA */}
      <section id="comparativo" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow">Comparativo Técnico</span>
              <h2 className="section-title">
                O que está incluído em <span className="text-gradient">cada serviço</span>?
              </h2>
              <p className="text-lg max-width-text">
                Compare os escopos das nossas principais intervenções técnicas.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="table-wrap">
              <div className="table-scroll">
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th className="left">Escopo Técnico</th>
                      <th>Preventiva<br /><span className="sub">Minor Service</span></th>
                      <th>Revisão Geral<br /><span className="sub">Major Service</span></th>
                      <th className="teal-header">Em Oficina<br /><span className="sub">Shop Service</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="left">{row.label}</td>
                        <td>{row.preventiva ? <Check className="icon-check" size={20} /> : <span className="icon-dash">,</span>}</td>
                        <td>{row.revisao ? <Check className="icon-check" size={20} /> : <span className="icon-dash">,</span>}</td>
                        <td>{row.oficina ? <Check className="icon-check" size={20} /> : <span className="icon-dash">,</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAMPO & OFICINA */}
      <section id="campo-oficina" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow">Flexibilidade Total</span>
              <h2 className="section-title">
                Onde você precisar, <span className="text-gradient">quando precisar</span>
              </h2>
              <p className="text-lg max-width-text">
                Estrutura completa para atender na sua fábrica ou na nossa sede de alta tecnologia.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="split-grid">
              <div className="split-panel panel-light">
                <div className="icon-box"><MapPin size={26} /></div>
                <h3>Serviço em Campo</h3>
                <p>
                  A nossa equipa de engenheiros vai até ao seu navio ou instalação industrial.
                  Garantimos o mínimo de tempo inativo resolvendo o problema diretamente no local
                  onde ele ocorre.
                </p>
                <ul className="feature-list">
                  <li><Check size={18} /> Inspeção e diagnóstico na fábrica</li>
                  <li><Check size={18} /> Manutenção preventiva programada</li>
                  <li><Check size={18} /> Formação da sua equipa de operação</li>
                </ul>
              </div>

              <div className="split-panel panel-dark">
                <div className="icon-box dark"><Building2 size={26} /></div>
                <h3>Serviço em Oficina</h3>
                <p>
                  Para reconstruções completas, a precisão e qualidade encontram-se aqui.
                  As nossas capacidades avançadas de reparação estrutural restauram os
                  rigorosos padrões de fábrica.
                </p>
                <ul className="feature-list">
                  <li><Check size={18} /> Balanceamento dinâmico de rotores</li>
                  <li><Check size={18} /> Microusinagem e reparação de componentes</li>
                  <li><Check size={18} /> Opção de locação de Bowls para não parar</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVIÇO DE CAMPO */}
      <section id="campo-oficina" className="section-padding banner-dark">
        <div className="container relative-z">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow on-dark">Serviço em Campo & Oficina</span>
              <h2 className="section-title text-white">
                Da sua planta <span className="text-gradient">à nossa bancada</span>
              </h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                Atendemos no seu local com técnicos certificados ou recebemos seu equipamento
                em nossa sede em Indaiatuba/SP para serviços que exigem oficina completa.
              </p>
            </div>
          </Reveal>

          <div className="grid-2 gap-40">
            <Reveal variant="fade-right">
              <div className="card-dark">
                <div className="card-dark-icon"><MapPin size={26} /></div>
                <h3 className="text-white">Serviço em Campo</h3>
                <ul className="dark-list">
                  <li><Check size={14} /> Diagnóstico técnico in loco</li>
                  <li><Check size={14} /> Manutenção preventiva programada</li>
                  <li><Check size={14} /> Substituição de componentes críticos</li>
                  <li><Check size={14} /> Instalação e comissionamento</li>
                  <li><Check size={14} /> Acompanhamento de start-up</li>
                  <li><Check size={14} /> Treinamento da equipe de operação</li>
                </ul>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={150}>
              <div className="card-dark">
                <div className="card-dark-icon"><Building2 size={26} /></div>
                <h3 className="text-white">Oficina em Indaiatuba</h3>
                <ul className="dark-list">
                  <li><Check size={14} /> Balanceamento dinâmico computadorizado</li>
                  <li><Check size={14} /> Microusinagem de precisão</li>
                  <li><Check size={14} /> Jateamento e pintura industrial</li>
                  <li><Check size={14} /> Inspeção de bowls, rotores e discos</li>
                  <li><Check size={14} /> Teste contínuo (run-in) de 8 a 10 horas</li>
                  <li><Check size={14} /> Relatório técnico detalhado de cada etapa</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROBLEMAS / BENEFÍCIOS */}
      <section id="beneficios" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow">Por que Prevenir</span>
              <h2 className="section-title">
                Que problemas <span className="text-gradient">evita com a Separi</span>?
              </h2>
              <p className="text-lg max-width-text">
                A manutenção de rotina não é um custo, é uma proteção. Veja o que prevenimos
                ao manter o seu equipamento rigorosamente em dia.
              </p>
            </div>
          </Reveal>

          <div className="grid-3">
            {problems.map((p, idx) => (
              <Reveal key={idx} variant="fade-up" delay={idx * 100}>
                <div className="problem-card">
                  <div className="icon-box danger">{p.icon}</div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <span className="eyebrow">Perguntas frequentes</span>
              <h2 className="section-title">
                Tire as suas <span className="text-gradient">dúvidas</span>
              </h2>
              <p className="text-lg max-width-text">
                O que os clientes mais perguntam sobre nossos serviços.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="faq-list">
              <details className="faq-item">
                <summary>Vocês atendem em campo na minha planta?</summary>
                <div className="faq-item-body">
                  Sim. Nossa equipe técnica certificada se desloca até a sua planta
                  para diagnóstico, manutenção preventiva, revisão geral, substituição
                  de componentes críticos, instalação e comissionamento. Atendemos toda a
                  América Latina com técnicos formados nas escolas dos próprios fabricantes.
                </div>
              </details>
              <details className="faq-item">
                <summary>Quanto tempo leva uma revisão geral?</summary>
                <div className="faq-item-body">
                  Depende do tamanho e modelo, mas em geral uma revisão completa em oficina
                  leva de 7 a 15 dias úteis após o recebimento. Sempre devolvemos uma proposta
                  detalhada com prazo, escopo e custo antes de começar.
                </div>
              </details>
              <details className="faq-item">
                <summary>O balanceamento dinâmico é computadorizado?</summary>
                <div className="faq-item-body">
                  Sim. Usamos balanceadoras de precisão computadorizadas em nossa oficina,
                  com correção em dois planos. Cada serviço termina com um relatório técnico
                  detalhado com leituras antes/depois e vetores de correção aplicados.
                </div>
              </details>
              <details className="faq-item">
                <summary>Vocês fornecem peças junto com o serviço?</summary>
                <div className="faq-item-body">
                  Sim. Trabalhamos com peças OEM e equivalentes homologados pela nossa
                  engenharia. Sempre detalhamos a origem de cada item no orçamento e você
                  decide o que prefere. Mantemos um amplo estoque em Indaiatuba.
                </div>
              </details>
              <details className="faq-item">
                <summary>Como solicito um orçamento de serviço?</summary>
                <div className="faq-item-body">
                  Fale com nosso time no WhatsApp ou cadastre sua máquina no portal.
                  Após o cadastro inicial, nossa engenharia valida e libera o catálogo
                  de peças e kits compatíveis com a sua centrífuga, junto com a possibilidade
                  de solicitar serviço técnico vinculado.
                </div>
              </details>
              <details className="faq-item">
                <summary>Qual a garantia dos serviços executados?</summary>
                <div className="faq-item-body">
                  Todo serviço sai com garantia técnica documentada, variando conforme o
                  escopo. Revisões gerais em oficina têm cobertura padrão de até 6 meses
                  para os componentes substituídos, e até 12 meses no caso de máquinas
                  totalmente recondicionadas.
                </div>
              </details>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <span className="eyebrow on-dark"><MessageCircle size={12} /> Vamos conversar</span>
              <h2 className="section-title text-white">
                Pronto para elevar <span className="text-gradient">o seu processo</span>?
              </h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                A nossa equipa de engenharia está a postos.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <MessageCircle size={18} /> Falar com Especialista
                </a>
                <Link to="/equipamentos" className="btn btn-outline-light">
                  Ver Catálogo de Equipamentos <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
