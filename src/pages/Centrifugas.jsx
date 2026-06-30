import { Link } from 'react-router-dom'
import {
  RotateCw, ArrowRight, ArrowLeft,
  Layers, Gauge, ShieldCheck, Settings, Sparkles, Pickaxe
} from 'lucide-react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

const types = [
  {
    icon: <Layers size={22} />,
    title: 'Decanter de 2 fases',
    desc: 'Separa sólido e líquido continuamente. O tambor horizontal gira em alta rotação e a rosca transportadora descarrega os sólidos compactados na ponta cônica.'
  },
  {
    icon: <Settings size={22} />,
    title: 'Decanter de 3 fases',
    desc: 'Separa óleo, água e sólidos simultaneamente. Muito usado em biocombustíveis, óleo e gás e processamento de alimentos com gordura.'
  },
  {
    icon: <Pickaxe size={22} />,
    title: 'Solid bowl para abrasão',
    desc: 'Construção reforçada e rosca revestida em tungstênio para desidratar polpas minerais e concentrados de alta abrasividade.'
  }
]

const specs = [
  { label: 'Princípio', value: 'Tambor horizontal + rosca transportadora' },
  { label: 'Corte de partícula', value: 'Partículas maiores, ~100 µm ou mais' },
  { label: 'Teor de sólidos', value: 'Alto, até ~50% em volume' },
  { label: 'Forte em', value: 'Desidratação, espessamento e fluxo contínuo' }
]

const sectors = [
  { name: 'Mineração e Metais', slug: 'mineracao' },
  { name: 'Biocombustíveis', slug: 'biocombustiveis' },
  { name: 'Óleo e Gás', slug: 'oleo-e-gas' },
  { name: 'Sumos e Bebidas', slug: 'sumos-e-bebidas' },
  { name: 'Fluidos Industriais', slug: 'fluidos-industriais' }
]

const benefits = [
  { icon: <Gauge size={20} />, title: 'Alta capacidade de sólidos', desc: 'Lida com cargas que entupiriam uma separadora de discos, ideal para lamas e polpas densas.' },
  { icon: <RotateCw size={20} />, title: 'Operação contínua', desc: 'Alimentação, separação e descarga acontecem sem interrupção, perfeito para alto volume.' },
  { icon: <ShieldCheck size={20} />, title: 'Robustez em ambiente severo', desc: 'Projetado para abrasão e três fases, resistindo a condições que outras tecnologias não suportam.' },
  { icon: <Settings size={20} />, title: 'Manutenção mais simples', desc: 'Projeto mecânico direto, com pontos de desgaste bem mapeados (rosca, mancais e tambor).' }
]

export default function Centrifugas() {
  return (
    <>
      <Seo
        title="Centrífugas Decanter · Produtos · Separi"
        description="Centrífugas decanter (solid bowl) de 2 e 3 fases para desidratação, espessamento e separação contínua em mineração, biocombustíveis, óleo e gás e efluentes."
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
              <span className="current">Centrífugas</span>
            </nav>
          </Reveal>

          <div className="equip-hero-grid">
            <div>
              <Reveal variant="fade-up" delay={60}>
                <span className="equip-hero-eyebrow"><RotateCw size={14} /> Centrífugas decanter</span>
              </Reveal>
              <Reveal variant="fade-up" delay={120}>
                <h1 className="equip-hero-title">
                  Sólidos pesados,<br /><em>separação</em><br />contínua.
                </h1>
              </Reveal>
              <Reveal variant="fade-up" delay={180}>
                <p className="equip-hero-lead">
                  A centrífuga decanter usa um tambor horizontal com rosca transportadora para
                  desidratar e espessar materiais com alto teor de sólidos em regime contínuo.
                  É a primeira linha de defesa em separações de carga pesada.
                </p>
              </Reveal>
              <Reveal variant="fade-up" delay={240}>
                <div className="equip-hero-ctas">
                  <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Tenho interesse em centrífugas decanter')}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                    <WhatsAppIcon size={16} /> Falar com especialista
                  </a>
                  <Link to="/produtos/separadoras" className="btn btn-outline-light btn-lg">
                    Ver separadoras de discos <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal variant="fade-left" delay={220}>
              <div className="prod-hero-photo is-placeholder" style={{ '--ph': 'url("/_fallback/centrifuga.jpg")' }}>
                <div className="prod-hero-photo-ph">
                  <span className="prod-hero-photo-ph-label">...imagem</span>
                  <code>/public/centrifuga.jpg</code>
                </div>
                <span className="prod-hero-photo-tag"><RotateCw size={13} /> Solid bowl</span>
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
              <h2 className="section-title">Decanters para cada <span className="text-gradient">desafio</span></h2>
              <p className="text-lg max-width-text">
                Do tratamento de efluentes à desidratação de concentrados minerais, o decanter se
                adapta ao teor de sólidos e ao número de fases do seu processo.
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
                <h2 className="section-title">Quando o <span className="text-gradient">decanter</span> é a escolha certa</h2>
                <p className="text-lg mt-20">
                  Sempre que há alta concentração de sólidos, partículas grandes ou abrasivas,
                  necessidade de três fases ou operação contínua de alto volume.
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
              <h2 className="section-title">Setores que usam <span className="text-gradient">decanters</span></h2>
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
              <h2 className="section-title text-white">Peças, recondicionamento e serviço para a sua <span className="text-gradient">centrífuga</span></h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                Recuperamos decanters de Alfa Laval, GEA Westfalia, Pieralisi e outras marcas, com foco nos componentes de maior desgaste.
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
