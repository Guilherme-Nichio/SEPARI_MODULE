import { Link } from 'react-router-dom'
import {
  Cog, ArrowRight, ArrowLeft, Check,
  Droplets, Layers, Gauge, ShieldCheck, RefreshCw, Sparkles
} from 'lucide-react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

const types = [
  {
    icon: <Droplets size={22} />,
    title: 'Purificador (Purifier)',
    desc: 'Separação líquido-líquido-sólido: remove água e partículas finas do óleo, como em combustível marítimo e óleo lubrificante. Trabalha com disco de gravidade dimensionado para a densidade do líquido.'
  },
  {
    icon: <Layers size={22} />,
    title: 'Clarificador (Clarifier)',
    desc: 'Separação líquido-sólido: retira sólidos em suspensão de um único líquido, clarificando o produto. Comum em laticínios, bebidas e polimento final antes do envase.'
  },
  {
    icon: <RefreshCw size={22} />,
    title: 'Concentrador / Autolimpante',
    desc: 'Bowl autolimpante que ejeta os sólidos acumulados em intervalos programados, sem parar a produção. Ideal para processos contínuos de alto volume.'
  }
]

const specs = [
  { label: 'Princípio', value: 'Pilha de discos cônicos em alta rotação' },
  { label: 'Corte de partícula', value: 'Partículas finas, abaixo de ~0,5 µm' },
  { label: 'Teor de sólidos', value: 'Baixo a moderado (ejeção periódica)' },
  { label: 'Forte em', value: 'Clarificação de alta pureza e separação de líquidos' }
]

const sectors = [
  { name: 'Laticínios', slug: 'laticinios' },
  { name: 'Cervejarias', slug: 'cervejarias' },
  { name: 'Sumos e Bebidas', slug: 'sumos-e-bebidas' },
  { name: 'Marinha e Naval', slug: 'marinha-e-naval' },
  { name: 'Farmacêutica', slug: 'farmaceutica' },
  { name: 'Geração de Energia', slug: 'geracao-de-energia' }
]

const benefits = [
  { icon: <Gauge size={20} />, title: 'Alta eficiência de separação', desc: 'A altíssima força G separa fases de densidade muito próxima e remove finos com precisão.' },
  { icon: <ShieldCheck size={20} />, title: 'Projeto sanitário', desc: 'Versões higiênicas com limpeza CIP/SIP para alimentos, bebidas e farmacêutica.' },
  { icon: <RefreshCw size={20} />, title: 'Operação contínua', desc: 'Bowls autolimpantes descarregam sólidos sem interromper o processo.' },
  { icon: <Cog size={20} />, title: 'Manutenção previsível', desc: 'Serviço de bowl programado (troca de selos) conforme a aplicação e as horas de operação.' }
]

export default function Separadoras() {
  return (
    <>
      <Seo
        title="Separadoras de Discos · Produtos · Separi"
        description="Separadoras centrífugas de discos (purificadores, clarificadores e autolimpantes) Alfa Laval, GEA Westfalia, Tetra Pak e Seital. Peças, recondicionamento e serviço técnico."
      />

      {/* HERO */}
      <section className="page-intro page-intro-equipamentos">
        <div className="container">
          <Reveal variant="fade-up">
            <nav className="equip-hero-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link>
              <span className="sep" />
              <Link to="/produtos">Produtos</Link>
              <span className="sep" />
              <span className="current">Separadoras</span>
            </nav>
          </Reveal>

          <div className="equip-hero-grid">
            <div>
              <Reveal variant="fade-up" delay={60}>
                <span className="equip-hero-eyebrow"><Cog size={14} /> Separadoras de discos</span>
              </Reveal>
              <Reveal variant="fade-up" delay={120}>
                <h1 className="equip-hero-title">
                  Separação de<br /><em>alta precisão</em>,<br />disco a disco.
                </h1>
              </Reveal>
              <Reveal variant="fade-up" delay={180}>
                <p className="equip-hero-lead">
                  A separadora de discos gira uma pilha de discos cônicos em alta rotação para
                  separar líquidos de densidades diferentes e remover sólidos finos com pureza
                  elevada. É a tecnologia por trás de desnatadeiras, clarificadoras e purificadores.
                </p>
              </Reveal>
              <Reveal variant="fade-up" delay={240}>
                <div className="equip-hero-ctas">
                  <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Tenho interesse em separadoras de discos')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                    <WhatsAppIcon size={16} /> Falar com especialista
                  </a>
                  <Link to="/produtos/centrifugas" className="btn btn-outline-light btn-lg">
                    Ver centrífugas decanter <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal variant="fade-left" delay={220}>
              <div className="prod-hero-photo is-placeholder" style={{ '--ph': 'url("/_fallback/separadora.jpg")' }}>
                <div className="prod-hero-photo-ph">
                  <span className="prod-hero-photo-ph-label">...imagem</span>
                  <code>/public/separadora.jpg</code>
                </div>
                <span className="prod-hero-photo-tag"><Cog size={13} /> Disc-stack</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TIPOS */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow"><Layers size={14} /> Configurações</span>
              <h2 className="section-title">Três modos de <span className="text-gradient">operar</span></h2>
              <p className="text-lg max-width-text">
                A mesma máquina muda de função conforme o conjunto de discos e a configuração do bowl.
              </p>
            </div>
          </Reveal>
          <div className="grid-3">
            {types.map((t, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 100}>
                <div className="card">
                  <div className="icon-box">{t.icon}</div>
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPECS + BENEFÍCIOS */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <div className="grid-2 gap-60 align-center">
            <Reveal variant="fade-right">
              <div>
                <span className="eyebrow"><Sparkles size={14} /> Em resumo</span>
                <h2 className="section-title">Quando a <span className="text-gradient">separadora</span> é a escolha certa</h2>
                <p className="text-lg mt-20">
                  Sempre que o processo pede clarificação fina, separação de líquidos imiscíveis
                  ou recuperação de produto de alto valor com baixo teor de sólidos.
                </p>
                <div className="prod-spec-list">
                  {specs.map((s, i) => (
                    <div key={i} className="prod-spec-row">
                      <span className="prod-spec-label">{s.label}</span>
                      <span className="prod-spec-value">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={150}>
              <div className="prod-benefits">
                {benefits.map((b, i) => (
                  <div className="reman-benefit" key={i}>
                    <div className="reman-benefit-icon">{b.icon}</div>
                    <div>
                      <strong>{b.title}</strong>
                      <p>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SETORES */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow">Onde aplicamos</span>
              <h2 className="section-title">Setores que usam <span className="text-gradient">separadoras</span></h2>
            </div>
          </Reveal>
          <div className="prod-sector-chips">
            {sectors.map((s) => (
              <Link key={s.slug} to={`/aplicacoes/${s.slug}`} className="prod-sector-chip">
                {s.name} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <span className="eyebrow on-dark"><WhatsAppIcon size={12} /> Vamos conversar</span>
              <h2 className="section-title text-white">Peças, recondicionamento e serviço para a sua <span className="text-gradient">separadora</span></h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                Atendemos Alfa Laval, GEA Westfalia, Tetra Pak e Seital, com oficina completa em Indaiatuba/SP.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} /> Falar com Especialista
                </a>
                <Link to="/produtos" className="btn btn-outline-light"><ArrowLeft size={16} /> Voltar para Produtos</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
