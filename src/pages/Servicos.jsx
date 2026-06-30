import { Link } from 'react-router-dom'
import {
  Settings, Wrench, ArrowRight, Check, X,
  MapPin, Building2, Clock, ShieldOff, TrendingDown,
  Activity, Timer, FileText, RefreshCw, ShieldCheck,
  Play, Truck, ClipboardCheck, PackageCheck
} from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionNav from '../components/SectionNav'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

// Vídeo institucional de serviços, solte o arquivo em /public/servicos-video.mp4
const SV_VIDEO_FILE = '/servicos-video.mp4'
const SV_VIDEO_POSTER = '/servicos/video-poster.jpg'

// Jornada do equipamento: da chegada à entrega (cada etapa com foto)
const journey = [
  { n: '01', title: 'Chegada do equipamento', desc: 'Recebimento, identificação e registro fotográfico da máquina como ela chegou à oficina.', img: '/servicos/jornada-chegada.jpg', icon: <Truck size={20} /> },
  { n: '02', title: 'Desmontagem e inspeção', desc: 'Desmontagem completa com inspeção dimensional, líquido penetrante e mapa de desgaste documentado peça a peça.', img: '/servicos/jornada-desmontagem.jpg', icon: <Wrench size={20} /> },
  { n: '03', title: 'Orçamento técnico', desc: 'Diagnóstico transparente com escopo, peças a substituir, prazo e custo — você decide o que aprovar.', img: '/servicos/jornada-orcamento.jpg', icon: <FileText size={20} /> },
  { n: '04', title: 'Aprovação e execução', desc: 'Após o aceite, executamos o serviço: balanceamento, microusinagem, troca de itens de desgaste e remontagem.', img: '/servicos/jornada-execucao.jpg', icon: <ClipboardCheck size={20} /> },
  { n: '05', title: 'Teste e entrega', desc: 'Run-in contínuo de 8 a 10 horas, relatório fotográfico, certificado de balanceamento e devolução pronta para operar.', img: '/servicos/jornada-entrega.jpg', icon: <PackageCheck size={20} /> }
]


const preventiva = ['Inspeção do bowl, vedações e portas de entrada/saída', 'Serviço intermediário com troca de gaxetas', 'Lubrificação e verificação de componentes rotativos']
const revisao = ['Desmontagem completa e limpeza geral', 'Verificação de rolamentos, eixos e drives', 'Teste de desempenho (Água/Produto) e calibração']

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

const campo = ['Diagnóstico técnico in loco', 'Manutenção preventiva programada', 'Substituição de componentes críticos', 'Instalação e comissionamento', 'Acompanhamento de start-up', 'Treinamento da equipe de operação']
const oficina = ['Balanceamento dinâmico computadorizado', 'Microusinagem de precisão', 'Jateamento e pintura industrial', 'Inspeção de bowls, rotores e discos', 'Teste contínuo (run-in) de 8 a 10 horas', 'Locação de bowls para não parar a produção']

const problems = [
  { icon: <Clock size={24} />, title: 'Paradas não planeadas', desc: 'Perda de horas de produção valiosas por falhas que poderiam ser previstas e corrigidas antes de quebrarem.', prevent: 'Inspeção programada e leitura de vibração antecipam a falha antes da quebra.' },
  { icon: <ShieldOff size={24} />, title: 'Contaminação e danos', desc: 'Contaminação do produto final ou danos irreversíveis aos componentes internos (rotores e eixos) do separador.', prevent: 'Troca de vedações e gaxetas no intervalo certo protege o produto e os internos.' },
  { icon: <Activity size={24} />, title: 'Vibração em alta rotação', desc: 'Um bowl desbalanceado vira a peça mais perigosa do chão de fábrica e destrói mancais e eixo em pouco tempo.', prevent: 'Balanceamento dinâmico mantém o conjunto na tolerância e seguro a plena rotação.' },
  { icon: <TrendingDown size={24} />, title: 'Custos exorbitantes', desc: 'O custo de uma reparação corretiva massiva é imensamente maior do que o da manutenção preventiva planejada.', prevent: 'Preventiva custa uma fração de uma corretiva — e mantém a planta produzindo.' }
]

const benefitStats = [
  { icon: <Timer size={20} />, k: '8.000 h ou 12 meses', v: 'intervalo recomendado de serviço' },
  { icon: <RefreshCw size={20} />, k: 'Bowls de troca', v: 'a produção não para durante a revisão' },
  { icon: <FileText size={20} />, k: 'Relatório técnico', v: 'documentado e fotografado em cada serviço' },
  { icon: <ShieldCheck size={20} />, k: 'Garantia documentada', v: 'em peças e serviços executados' }
]

const faqs = [
  { q: 'Vocês atendem em campo na minha planta?', a: 'Sim. Nossa equipe técnica certificada se desloca até a sua planta para diagnóstico, manutenção preventiva, revisão geral, substituição de componentes críticos, instalação e comissionamento. Atendemos toda a América Latina com técnicos formados nas escolas dos próprios fabricantes.' },
  { q: 'Quanto tempo leva uma revisão geral?', a: 'Depende do tamanho e modelo, mas em geral uma revisão completa em oficina leva de 7 a 15 dias úteis após o recebimento. Sempre devolvemos uma proposta detalhada com prazo, escopo e custo antes de começar.' },
  { q: 'O balanceamento dinâmico é computadorizado?', a: 'Sim. Usamos balanceadoras de precisão computadorizadas em nossa oficina, com correção em dois planos. Cada serviço termina com um relatório técnico detalhado com leituras antes/depois e vetores de correção aplicados.' },
  { q: 'Vocês fornecem peças junto com o serviço?', a: 'Sim. Trabalhamos com peças OEM e equivalentes homologados pela nossa engenharia. Sempre detalhamos a origem de cada item no orçamento e você decide o que prefere. Mantemos um amplo estoque em Indaiatuba.' },
  { q: 'Como solicito um orçamento de serviço?', a: 'Fale com nosso time no WhatsApp ou cadastre sua máquina no portal. Após o cadastro inicial, nossa engenharia valida e libera o catálogo de peças e kits compatíveis com a sua centrífuga, junto com a possibilidade de solicitar serviço técnico vinculado.' },
  { q: 'Qual a garantia dos serviços executados?', a: 'Todo serviço sai com garantia técnica documentada de 3 meses sobre os componentes substituídos e o serviço executado, condicionada ao uso dentro dos parâmetros operacionais recomendados.' }
]

export default function Servicos() {
  return (
    <div className="sv-page">
      <Seo
        title="Serviços, Manutenção, Recondicionamento e Suporte Técnico · Separi"
        description="Manutenção preventiva, revisão geral, balanceamento dinâmico e serviço de campo para centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital. Equipe técnica especializada e oficina completa em Indaiatuba/SP."
      />

      <SectionNav items={[
        { id: 'jornada', label: 'Da chegada à entrega' },
        { id: 'preventiva', label: 'Preventiva' },
        { id: 'revisao', label: 'Revisão geral' },
        { id: 'comparativo', label: 'Comparativo' },
        { id: 'campo-oficina', label: 'Campo & Oficina' },
        { id: 'beneficios', label: 'Problemas evitados' }
      ]} />

      {/* ───────── HERO ───────── */}
      <section className="sv-hero">
        <div className="sv-hero-grid-bg" aria-hidden="true" />
        <div className="container sv-hero-inner">
          <div className="sv-hero-text">
            <nav className="sb-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link><span>/</span><span>Serviços</span>
            </nav>
            <Reveal variant="fade-up">
              <h1 className="sv-hero-title">
                Manter seu processo <span className="text-gradient">sempre operando.</span>
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={80}>
              <p className="sv-hero-lead">
                Manutenção preventiva em campo, revisão geral em oficina e recondicionamento integral.
                Cada serviço executado por engenheiros formados pelos próprios fabricantes e documentado
                em relatório técnico fotográfico.
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={140}>
              <div className="sv-hero-ctas">
                <a href="#preventiva" className="btn btn-primary btn-lg">Ver tipos de serviço <ArrowRight size={16} /></a>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                  <WhatsAppIcon size={16} /> Agendar avaliação
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── MARCAS ATENDIDAS (carrossel) ───────── */}
      <section className="sv-brands">
        <div className="container"><span className="sv-brands-label">Marcas que atendemos</span></div>
        <div className="sv-brands-wrap">
          <div className="sv-brands-track">
            {['Alfa Laval', 'GEA Westfalia', 'Tetra Pak', 'Seital', 'Mitsubishi', 'Pieralisi', 'Flottweg',
              'Alfa Laval', 'GEA Westfalia', 'Tetra Pak', 'Seital', 'Mitsubishi', 'Pieralisi', 'Flottweg'].map((b, i) => (
              <span className="sv-brand" key={i}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── JORNADA: DA CHEGADA À ENTREGA ───────── */}
      <section id="jornada" className="section-padding bg-white sv-bound">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Da chegada <span className="text-gradient">à entrega</span></h2>
              <p className="text-lg max-width-text">
                Acompanhe cada etapa do seu equipamento na nossa oficina — da chegada ao
                teste final, tudo registrado e documentado.
              </p>
            </div>
          </Reveal>

          <div className="sv-journey">
            {journey.map((s, i) => (
              <Reveal key={s.n} variant="fade-up" delay={i * 80}>
                <div className="sv-journey-step">
                  <div className="sv-journey-media">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="sv-journey-media-ph">
                      <span className="sv-journey-media-ph-label">imagem:</span>
                      <code>{s.img}</code>
                    </div>
                  </div>
                  <div className="sv-journey-body">
                    <span className="sv-journey-icon">{s.icon}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                  {i < journey.length - 1 && <span className="sv-journey-connector" aria-hidden="true" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PREVENTIVA ───────── */}
      <section id="preventiva" className="section-padding bg-white sv-bound">
        <div className="container">
          <div className="sv-feature">
            <Reveal variant="fade-right">
              <div className="sv-feature-media">
                <span className="sv-feature-icon"><Settings size={28} /></span>
                <span className="sv-feature-path">imagem: <code>/public/servicos/preventiva.jpg</code></span>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={120}>
              <div className="sv-feature-text">
                <span className="sv-tag">Minor Service</span>
                <h2 className="section-title">Manutenção <span className="text-gradient">preventiva</span></h2>
                <p className="text-lg mt-20">
                  A manutenção preventiva é a forma mais eficaz de evitar problemas inesperados e
                  proteger o desempenho a longo prazo do seu separador.
                </p>
                <p className="mt-12 mb-30">
                  Realizamos inspeções regulares e verificações baseadas na condição operacional.
                  A nossa equipe orienta os seus operadores sobre como limpar adequadamente e
                  identificar desgaste.
                </p>
                <ul className="sv-checklist">
                  {preventiva.map((c, i) => <li key={i}><span className="sv-check"><Check size={13} /></span>{c}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── REVISÃO GERAL ───────── */}
      <section id="revisao" className="section-padding bg-subtle sv-bound">
        <div className="container">
          <div className="sv-feature sv-feature-rev">
            <Reveal variant="fade-right">
              <div className="sv-feature-text">
                <span className="sv-tag">Major Service</span>
                <h2 className="section-title">Revisão <span className="text-gradient">geral</span></h2>
                <p className="text-lg mt-20">
                  O Major Service é a revisão anual completa do seu equipamento. Inclui todos os itens
                  do serviço preventivo, acrescidos de uma análise profunda no chassi e componentes estruturais.
                </p>
                <p className="mt-12 mb-30">
                  Isso dá-nos a oportunidade de identificar problemas futuros a curto prazo e evitar
                  inatividade não planeada, além de permitir o planeamento de orçamentos para reparações maiores.
                </p>
                <ul className="sv-checklist">
                  {revisao.map((c, i) => <li key={i}><span className="sv-check"><Check size={13} /></span>{c}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={120}>
              <div className="sv-feature-media">
                <span className="sv-feature-icon"><Wrench size={28} /></span>
                <span className="sv-feature-path">imagem: <code>/public/servicos/revisao.jpg</code></span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── COMPARATIVO ───────── */}
      <section id="comparativo" className="section-padding bg-white sv-bound">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">O que está incluído em <span className="text-gradient">cada serviço</span>?</h2>
              <p className="text-lg max-width-text">Compare os escopos das nossas principais intervenções técnicas.</p>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={100}>
            <div className="sv-table-wrap">
              <table className="sv-table">
                <thead>
                  <tr>
                    <th className="left">Escopo técnico</th>
                    <th>Preventiva<span>em campo</span></th>
                    <th>Revisão geral<span>em campo</span></th>
                    <th className="hl">Em oficina<span>Indaiatuba</span></th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="left">{row.label}</td>
                      <td>{row.preventiva ? <Check className="ok" size={18} /> : <X className="no" size={16} />}</td>
                      <td>{row.revisao ? <Check className="ok" size={18} /> : <X className="no" size={16} />}</td>
                      <td className="hl">{row.oficina ? <Check className="ok" size={18} /> : <X className="no" size={16} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── CAMPO & OFICINA ───────── */}
      <section id="campo-oficina" className="section-padding bg-subtle sv-bound">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Onde você precisar, <span className="text-gradient">quando precisar</span></h2>
              <p className="text-lg max-width-text">
                Atendemos na sua planta com técnicos certificados ou recebemos seu equipamento na nossa
                sede de alta tecnologia em Indaiatuba/SP. Um só parceiro, da bancada ao campo.
              </p>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={100}>
            <div className="sv-cf">
              <div className="sv-cf-panel sv-cf-panel-dark">
                <div className="sv-cf-head">
                  <span className="sv-cf-icon"><MapPin size={22} /></span>
                  <div><span className="sv-cf-kicker">No seu local</span><h3>Serviço em campo</h3></div>
                </div>
                <p className="sv-cf-lead">Nossa equipe vai até o seu navio ou instalação industrial e resolve o problema onde ele acontece, com o mínimo de tempo parado.</p>
                <ul className="sv-cf-list">{campo.map((c, i) => <li key={i}><Check size={15} /> {c}</li>)}</ul>
              </div>
              <div className="sv-cf-panel sv-cf-panel-dark">
                <div className="sv-cf-head">
                  <span className="sv-cf-icon"><Building2 size={22} /></span>
                  <div><span className="sv-cf-kicker">Em Indaiatuba</span><h3>Oficina técnica</h3></div>
                </div>
                <p className="sv-cf-lead">Para reconstruções completas, a precisão encontra-se aqui. Capacidades avançadas de reparação que restauram os rigorosos padrões de fábrica.</p>
                <ul className="sv-cf-list">{oficina.map((c, i) => <li key={i}><Check size={15} /> {c}</li>)}</ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── BENEFÍCIOS ───────── */}
      <section id="beneficios" className="section-padding bg-white sv-bound">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Que problemas <span className="text-gradient">você evita</span>?</h2>
              <p className="text-lg max-width-text">
                A manutenção de rotina não é um custo, é uma proteção. Veja o que prevenimos ao manter
                o seu equipamento rigorosamente em dia.
              </p>
            </div>
          </Reveal>
          <div className="sv-problems">
            {problems.map((p, idx) => (
              <Reveal key={idx} variant="fade-up" delay={(idx % 2) * 90}>
                <div className="sv-problem">
                  <span className="sv-problem-icon">{p.icon}</span>
                  <div className="sv-problem-body">
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                    <p className="sv-problem-prevent"><span className="sv-problem-check"><Check size={13} /></span>{p.prevent}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── VÍDEO ───────── */}
      <section className="video-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="video-head">
              <h2 className="section-title">Veja a oficina <span className="text-gradient">em ação</span></h2>
              <p className="text-lg max-width-text">
                Um tour pelos processos de manutenção, balanceamento e recondicionamento das suas centrífugas.
              </p>
            </div>
          </Reveal>
          <Reveal variant="zoom-in" delay={100}>
            <div className="video-frame">
              <video src={SV_VIDEO_FILE} poster={SV_VIDEO_POSTER} controls preload="metadata" playsInline>
                Seu navegador não suporta vídeo HTML5.
              </video>
              <div className="video-placeholder">
                <div className="video-placeholder-icon"><Play size={32} fill="currentColor" /></div>
                <div className="video-placeholder-title">Vídeo dos serviços</div>
                <div className="video-placeholder-hint"><code>/public/servicos-video.mp4</code></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <h2 className="section-title">Tire as suas <span className="text-gradient">dúvidas</span></h2>
              <p className="text-lg max-width-text">O que os clientes mais perguntam sobre nossos serviços.</p>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={100}>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary>{f.q}</summary>
                  <div className="faq-item-body">{f.a}</div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <h2 className="section-title text-white">Pronto para elevar <span className="text-gradient">o seu processo</span>?</h2>
              <p className="text-lg text-white-muted max-width-text mt-20">A nossa equipe de engenharia está a postos.</p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} /> Falar com Especialista
                </a>
                <Link to="/produtos" className="btn btn-outline-light">Ver catálogo de equipamentos <ArrowRight size={16} /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
