import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Cog, RotateCw, Layers,
  ShieldCheck, Wrench, GraduationCap, Boxes, Factory, ChevronRight
} from 'lucide-react'
import Reveal from '../components/Reveal'
import ImageSlot from '../components/ImageSlot'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

// Linha própria Separi. As fichas técnicas ainda não estão publicadas, então
// trabalhamos só com descrições. Sem números/specs provisórios.
const LINES = [
  {
    key: 'separadoras',
    name: 'Separadoras de discos',
    icon: <Cog size={22} />,
    img: '/maquinas/separadora.jpg',
    desc: 'Para separar dois líquidos ou clarificar um líquido com poucos sólidos, em fluxo contínuo e alta rotação. É a máquina de desnate, recuperação e purificação.',
    to: '/produtos/separadoras'
  },
  {
    key: 'clarificadoras',
    name: 'Clarificadoras herméticas',
    icon: <Layers size={22} />,
    img: '/maquinas/clarificadora.jpg',
    desc: 'Projeto higiênico para clarificar com mínima entrada de ar, pensado para alimentos, bebidas e processos sensíveis ao oxigênio.',
    to: '/produtos#aplicacoes'
  },
  {
    key: 'decanters',
    name: 'Decanters (solid bowl)',
    icon: <RotateCw size={22} />,
    img: '/maquinas/decanter.jpg',
    desc: 'Para cargas altas de sólido, com desidratação e espessamento contínuos. É a escolha quando a separadora de discos não dá conta do volume de sólidos.',
    to: '/produtos/centrifugas'
  }
]

const WHY = [
  { icon: <ShieldCheck size={20} />,   title: 'Garantia e nota fiscal',     desc: 'Equipamento novo, com garantia de fábrica e documentação completa.' },
  { icon: <Boxes size={20} />,         title: 'Peças em estoque no Brasil', desc: 'Reposição consolidada em Indaiatuba/SP, sem depender de importação para um disco ou uma vedação.' },
  { icon: <Wrench size={20} />,        title: 'Instalação e start-up',      desc: 'Fazemos o comissionamento na sua planta e deixamos a máquina operando.' },
  { icon: <GraduationCap size={20} />, title: 'Treinamento da sua equipe',  desc: 'Capacitamos seu time na operação, limpeza e manutenção de primeiro nível.' }
]

export default function MaquinasNovas() {
  return (
    <div className="mn-page">
      <Seo
        title="Nossas Máquinas — Linha própria Separi · Separadoras, Clarificadoras e Decanters"
        description="A linha própria Separi de centrífugas novas: separadoras de discos, clarificadoras herméticas e decanters. Com instalação, garantia e peças em estoque no Brasil."
      />

      {/* HERO */}
      <section className="mn-hero mn-clip-bottom">
        <div className="container">
          <Reveal variant="fade-up">
            <nav className="sb-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link><ChevronRight size={14} />
              <span aria-current="page">Nossas máquinas</span>
            </nav>
          </Reveal>

          <div className="mn-hero-grid">
            <div>
              <Reveal variant="fade-up" delay={80}>
                <span className="eyebrow"><Factory size={14} /> Linha própria Separi</span>
              </Reveal>
              <Reveal variant="fade-up" delay={140}>
                <h1 className="mn-hero-title">
                  Máquinas novas <span className="text-gradient">Separi</span>
                </h1>
              </Reveal>
              <Reveal variant="fade-up" delay={200}>
                <p className="mn-hero-lead">
                  Agora a Separi também fornece a própria linha de centrífugas. A mesma
                  engenharia que cuida da sua manutenção há anos, agora também na máquina nova —
                  com suporte local de quem conhece o equipamento por dentro.
                </p>
              </Reveal>
              <Reveal variant="fade-up" delay={260}>
                <div className="mn-hero-ctas">
                  <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Quero um orçamento de máquina nova Separi')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                    <WhatsAppIcon size={16} /> Pedir orçamento
                  </a>
                  <a href="#linhas" className="btn btn-outline-light btn-lg">Ver as linhas <ArrowRight size={16} /></a>
                </div>
              </Reveal>
            </div>

            <Reveal variant="fade-left" delay={220}>
              <ImageSlot src="/maquinas/hero-linha-separi.jpg" alt="Linha de máquinas novas Separi" className="mn-hero-img" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* INTRO — texto genérico, sem cards e sem specs */}
      <section className="section-padding bg-white">
        <div className="container container-narrow">
          <Reveal variant="fade-up">
            <div className="mn-intro">
              <span className="eyebrow"><Boxes size={14} /> Sobre a linha</span>
              <h2 className="section-title">Engenharia pensada para o seu processo</h2>
              <p className="text-lg">
                Estamos montando a nossa linha de equipamentos novos com o mesmo critério
                técnico que aplicamos no recondicionamento: materiais corretos, montagem
                cuidadosa e foco no que mantém a sua produção girando.
              </p>
              <p className="text-lg">
                As fichas técnicas detalhadas de cada modelo entram em breve nesta página.
                Por enquanto, conte para a nossa engenharia o seu produto, a sua vazão e o
                seu setor — montamos a recomendação certa e enviamos uma proposta sob medida.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LINHAS — cards limpos, navegáveis, sem specs */}
      <section id="linhas" className="section-padding bg-subtle mn-clip-top">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Três <span className="text-gradient">tipos de máquina</span></h2>
              <p className="text-lg max-width-text">
                Cada arquitetura resolve um problema de separação diferente. Abra a que combina com o seu processo.
              </p>
            </div>
          </Reveal>

          <div className="mn-lines">
            {LINES.map((l, i) => (
              <Reveal key={l.key} variant="fade-up" delay={i * 80}>
                <Link to={l.to} className="mn-line">
                  <div className="mn-line-media">
                    <ImageSlot src={l.img} alt={l.name} className="mn-line-img" />
                  </div>
                  <div className="mn-line-body">
                    <span className="mn-line-icon">{l.icon}</span>
                    <h3 className="mn-line-name">{l.name}</h3>
                    <p className="mn-line-lead">{l.desc}</p>
                    <span className="mn-line-link">Saber mais <ArrowRight size={14} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE COMPRAR DA SEPARI */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Por que comprar <span className="text-gradient">da Separi</span></h2>
              <p className="text-lg max-width-text">
                Não vendemos só a máquina: entregamos o equipamento operando, com quem
                conhece centrífuga por dentro cuidando de você no pós-venda.
              </p>
            </div>
          </Reveal>
          <div className="mn-why">
            {WHY.map((w, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 70}>
                <div className="mn-why-card">
                  <span className="mn-why-icon">{w.icon}</span>
                  <strong>{w.title}</strong>
                  <p>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <h2 className="section-title text-white">
                Vamos dimensionar <span className="text-gradient">a sua máquina</span>?
              </h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                Diga o seu produto, a vazão e o setor. A nossa engenharia recomenda a linha
                ideal e envia uma proposta sob medida.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Quero dimensionar uma máquina nova Separi')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} /> Falar com a engenharia
                </a>
                <Link to="/produtos" className="btn btn-outline-light">
                  Ver linha recondicionada <ArrowRight size={16} />
                </Link>
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
