import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, ArrowUpRight, ChevronRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import ImageSlot from '../components/ImageSlot'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'
import { WHATSAPP_DIGITS } from '../site/siteConfig'

/* O número comercial vive em src/site/siteConfig.ts. Antes ele vinha da
   variável VITE_WHATSAPP_NUMBER, que estava com outra linha no .env e
   mandava os cliques para um número que não é o de vendas. */
const WHATSAPP = WHATSAPP_DIGITS

/* ── Como a separadora trabalha (3 passos, curto) ── */
const HOW = [
  { n: '01', title: 'Alimentação contínua', desc: 'O produto entra pelo topo e desce ao bowl em rotação, sem parar a linha.' },
  { n: '02', title: 'Pilha de discos', desc: 'A força centrífuga separa as fases entre dezenas de discos cônicos.' },
  { n: '03', title: 'Descarga automática', desc: 'Os sólidos são ejetados em ciclos programados, sem abrir a máquina.' }
]

/* ── As sete séries da linha ──
   Imagem de cada série: /public/maquinas/serie-<key>.jpg */
const FAMILIES = [
  {
    key: 'marine', tag: 'Série Marine', name: 'Óleo marítimo',
    lead: 'Purificadores para HFO, diesel e óleo lubrificante a bordo.',
    specs: ['Remoção de água e cat fines', 'Modo purificador / clarificador', 'Descarga automática de borra'],
    slug: 'marinha-e-naval'
  },
  {
    key: 'mineral', tag: 'Série Mineral', name: 'Óleos minerais',
    lead: 'Recuperação de óleos hidráulicos, de têmpera e de isolação.',
    specs: ['Desidratação contínua', 'Protege turbinas e hidráulica', 'Menos descarte de óleo'],
    slug: 'fluidos-industriais'
  },
  {
    key: 'vegetable', tag: 'Série Food-Oil', name: 'Óleos vegetais e animais',
    lead: 'Degomagem, neutralização e lavagem de óleos comestíveis.',
    specs: ['Alto rendimento de óleo neutro', 'Construção sanitária', 'Gorduras animais (sebo, banha)'],
    slug: 'oleos'
  },
  {
    key: 'environmental', tag: 'Série Enviro', name: 'Industrial e ambiental',
    lead: 'Efluentes oleosos, emulsões e separação de três fases.',
    specs: ['Quebra de emulsões óleo-água', 'Recuperação de óleo usado', 'Enquadramento ambiental'],
    slug: 'oleo-e-gas'
  },
  {
    key: 'chemical', tag: 'Série Chem', name: 'Química',
    lead: 'Separação líquido-líquido em processos químicos agressivos.',
    specs: ['Recuperação de catalisador', 'Materiais compatíveis com solvente', 'Clarificação de licores'],
    slug: 'fluidos-industriais'
  },
  {
    key: 'fermentation', tag: 'Série Bio', name: 'Fermentação',
    lead: 'Colheita de biomassa e clarificação de caldo em bioprocessos.',
    specs: ['Design higiênico CIP/SIP', 'Baixo estresse celular', 'Enzimas, probióticos e fármacos'],
    slug: 'farmaceutica'
  },
  {
    key: 'dairy', tag: 'Série Dairy', name: 'Alimentos e laticínios',
    lead: 'Desnate, padronização e clarificação de leite, sucos e cervejas.',
    specs: ['Acabamento sanitário e CIP', 'Recuperação de levedura', 'Desnate e padronização'],
    slug: 'laticinios'
  }
]

/* ── Da proposta ao pós-venda ── */
const JOURNEY = [
  { key: 'proposta', title: 'Proposta dimensionada', desc: 'Você informa produto e vazão; a engenharia recomenda o modelo.' },
  { key: 'entrega', title: 'Entrega documentada', desc: 'Nota fiscal, garantia de fábrica e manual em português.' },
  { key: 'startup', title: 'Instalação e start-up', desc: 'A máquina é entregue operando no seu processo.' },
  { key: 'posvenda', title: 'Pós-venda no Brasil', desc: 'Treinamento e peças em estoque em Indaiatuba/SP.' }
]

export default function MaquinasNovas() {
  const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
  const [activeFam, setActiveFam] = useState(FAMILIES[0].key)
  const fam = FAMILIES.find((f) => f.key === activeFam) || FAMILIES[0]

  return (
    <div className="mqx-page">
      <Seo
        title="Máquinas Separi — linha própria de separadoras de discos"
        description="Máquinas Separi: linha própria de separadoras de discos novas. Sete séries, do óleo marítimo ao leite, com instalação, treinamento e peças no Brasil."
      />

      {/* ───────── HERO — escuro, tipografia grande, enxuto ───────── */}
      <section className="mqx-hero">
        <div className="mqx-hero-glow" aria-hidden="true" />
        <span className="mqx-hero-word" aria-hidden="true">SEPARI</span>
        <div className="container">
          <nav className="sb-crumbs mqx-crumbs" aria-label="breadcrumb">
            <Link to="/">Início</Link><span>/</span><span>Máquinas Separi</span>
          </nav>

          <div className="mqx-hero-head">
            <Reveal variant="fade-up">
              <h1 className="mqx-title">Máquinas <em>Separi</em></h1>
            </Reveal>
            <Reveal variant="fade-up" delay={100}>
              <p className="mqx-lead">
                Separadoras de discos novas, com a qualidade de quem
                recondiciona as melhores máquinas do mundo há anos.
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={180}>
              <div className="mqx-ctas">
                <a href={wa('Quero um orçamento de máquina Separi')} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  <WhatsAppIcon size={17} /> Pedir orçamento
                </a>
                <a href="#series" className="btn btn-outline-light btn-lg">Ver as séries <ArrowRight size={16} /></a>
              </div>
            </Reveal>
          </div>

          {/* Vitrine — 3 portes */}
          <Reveal variant="fade-up" delay={240}>
            <div className="mqx-showcase">
              <figure className="mqx-machine">
                <ImageSlot src="/maquinas/separi-compacta.jpg" alt="Separadora Separi de pequeno porte" className="mqx-machine-img" />
                <figcaption>Compacta</figcaption>
              </figure>
              <figure className="mqx-machine mqx-machine-hero">
                <ImageSlot src="/maquinas/separi-media.jpg" alt="Separadora Separi de médio porte" className="mqx-machine-img" />
                <figcaption>Média</figcaption>
              </figure>
              <figure className="mqx-machine">
                <ImageSlot src="/maquinas/separi-grande.jpg" alt="Separadora Separi de grande porte" className="mqx-machine-img" />
                <figcaption>Alta capacidade</figcaption>
              </figure>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ───────── COMO FUNCIONA ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="mqx-sechead">
              <h2 className="section-title">Como ela trabalha</h2>
            </div>
          </Reveal>
          <div className="mqx-how">
            {HOW.map((s, i) => (
              <Reveal key={s.n} variant="fade-up" delay={i * 90}>
                <div className="mqx-step">
                  <span className="mqx-step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SÉRIES ───────── */}
      <section id="series" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="mqx-sechead">
              <h2 className="section-title">Sete séries, <span className="text-gradient">um só princípio</span></h2>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={80}>
            <div className="mqx-fam">
              <div className="mqx-fam-tabs" role="tablist" aria-label="Séries de máquinas">
                {FAMILIES.map((f) => (
                  <button
                    key={f.key}
                    role="tab"
                    aria-selected={activeFam === f.key}
                    className={`mqx-fam-tab ${activeFam === f.key ? 'is-active' : ''}`}
                    onClick={() => setActiveFam(f.key)}
                  >
                    <span className="mqx-fam-tab-t">
                      <span className="mqx-fam-tab-tag">{f.tag}</span>
                      <span className="mqx-fam-tab-name">{f.name}</span>
                    </span>
                    <ChevronRight size={16} className="mqx-fam-tab-go" />
                  </button>
                ))}
              </div>

              <div className="mqx-fam-panel" role="tabpanel">
                <ImageSlot
                  src={`/maquinas/serie-${fam.key}.jpg`}
                  alt={`${fam.tag} — ${fam.name}`}
                  className="mqx-fam-media"
                />
                <div className="mqx-fam-body">
                  <span className="mqx-fam-badge">{fam.tag}</span>
                  <h3>{fam.name}</h3>
                  <p className="mqx-fam-lead">{fam.lead}</p>
                  <ul className="mqx-fam-specs">
                    {fam.specs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="mqx-fam-ctas">
                    <a href={wa(`Quero informações da ${fam.tag} — ${fam.name}`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <WhatsAppIcon size={16} /> Consultar esta série
                    </a>
                    <Link to={`/aplicacoes/${fam.slug}`} className="mqx-fam-link">
                      Ver aplicação <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── JORNADA ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="mqx-sechead">
              <h2 className="section-title">Da proposta ao pós-venda</h2>
            </div>
          </Reveal>
          <ol className="mqx-journey">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.title} as="li" className="mqx-journey-step" variant="fade-up" delay={i * 80}>
                <h3>{j.title}</h3>
                <p>{j.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── CTA FINAL ───────── */}
      <section className="section-padding bg-white" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <h2 className="section-title text-white">Vamos dimensionar <span className="text-gradient">a sua máquina</span>?</h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                Diga o produto, a vazão e o setor. A engenharia responde com o modelo ideal.
              </p>
              <div className="cta-buttons">
                <a href={wa('Quero dimensionar uma máquina Separi')} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} /> Falar com a engenharia
                </a>
                <Link to="/produtos" className="btn btn-outline-light">Ver linha recondicionada <ArrowRight size={16} /></Link>
              </div>
            </div>
          </Reveal>
          <div className="text-center mt-30">
            <Link to="/" className="mq-back"><ArrowLeft size={15} /> Voltar para o início</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
