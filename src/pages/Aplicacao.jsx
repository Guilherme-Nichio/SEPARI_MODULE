import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, CheckCircle2,
  AlertCircle, AlertTriangle, Cog, Droplets, Sparkles, Wrench,
  Layers, Play
} from 'lucide-react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'
import {
  getApplicationBySlug, APPLICATIONS,
  CATEGORY_COLORS, CATEGORY_LABELS,
  getAppMedia, getAppEquipment, getSectorPhoto, getSectorVideo, getAppBrands
} from '../data/applications.jsx'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

/* Imagem do setor. Enquanto o arquivo real não existir em /public, mostra um
   placeholder elegante com o caminho da imagem — mesmo padrão da Home e das
   páginas de produto — só para indicar onde a foto vai entrar. Assim que a
   imagem carregar, o placeholder some automaticamente. */
function AppImage({ src, alt, className = '', label, seed = 'app' }) {
  const [loaded, setLoaded] = useState(false)
  const web = getSectorPhoto(seed, 1000)
  const ph = web
    ? `url("${web}"), url("/_fallback/sector-${seed}.jpg")`
    : `url("/_fallback/sector-${seed}.jpg")`
  return (
    <div
      className={`app-photo ${loaded ? '' : 'is-placeholder'} ${className}`}
      style={{ '--ph': ph }}
    >
      {src ? (
        <img
          src={src} alt={alt} loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      ) : null}
      {!loaded && (
        <div className="app-photo-ph">
          <span className="app-photo-ph-label">imagem:</span>
          {src && <code>/public{src}</code>}
        </div>
      )}
      <span className="app-photo-overlay" />
      {label && <span className="app-photo-label">{label}</span>}
    </div>
  )
}

export default function Aplicacao() {
  const { slug } = useParams()
  const app = getApplicationBySlug(slug)

  if (!app) {
    return (
      <section className="dashboard">
        <div className="container">
          <div className="pecas-gate" style={{ marginTop: 60 }}>
            <div className="pecas-gate-icon"><AlertCircle size={24} /></div>
            <h2>Aplicação não encontrada</h2>
            <p>Esta aplicação não existe ou foi renomeada. Veja todas as que atendemos:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 22 }}>
              {APPLICATIONS.map(a => (
                <Link key={a.slug} to={`/aplicacoes/${a.slug}`} className="chip teal">{a.short}</Link>
              ))}
            </div>
            <Link to="/produtos" className="btn btn-primary"><ArrowLeft size={16} /> Voltar para Produtos</Link>
          </div>
        </div>
      </section>
    )
  }

  const cat = CATEGORY_COLORS[app.category] || CATEGORY_COLORS.industrial
  const catLabel = CATEGORY_LABELS[app.category] || 'Industrial'
  const others = APPLICATIONS.filter(a => a.slug !== app.slug)
  const waText = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
  const media = getAppMedia(app.slug)
  const equipment = getAppEquipment(app.slug)
  const brands = getAppBrands(app.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `Centrífugas e separadores para ${app.name}`,
    provider: { '@type': 'Organization', name: 'Separi' },
    areaServed: { '@type': 'Place', name: 'América Latina' },
    description: app.heroLead
  }

  return (
    <>
      <Seo title={`${app.name} · Aplicações · Separi`} description={app.heroLead} jsonLd={jsonLd} />

      {/* ─────────── HERO (vídeo, centralizado estilo Apple) ─────────── */}
      <section className="app-vhero">
        <div className="app-vhero-media" aria-hidden="true">
          <video
            className="app-vhero-video"
            autoPlay muted loop playsInline preload="metadata"
            poster={getSectorPhoto(app.slug, 1600) || `/_fallback/sector-${app.slug}.jpg`}
          >
            <source src={getSectorVideo(app.slug)} type="video/mp4" />
          </video>
          <span className="app-vhero-shade" />
        </div>

        <div className="container app-vhero-inner">
          <Reveal variant="fade-up">
            <nav className="app-vhero-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link>
              <span className="sep">/</span>
              <Link to="/produtos">Produtos</Link>
              <span className="sep">/</span>
              <span className="current">{app.name}</span>
            </nav>
          </Reveal>
          <Reveal variant="fade-up" delay={120}>
            <h1 className="app-vhero-title">{app.heroTitle}</h1>
          </Reveal>
          <Reveal variant="fade-up" delay={180}>
            <p className="app-vhero-lead">{app.heroLead}</p>
          </Reveal>
          <Reveal variant="fade-up" delay={240}>
            <div className="app-vhero-ctas">
              <a href={waText(`Olá! Tenho interesse em soluções da Separi para ${app.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                <WhatsAppIcon size={16} /> Falar com especialista
              </a>
              <Link to="/registro" className="btn btn-outline-light btn-lg">
                Cadastrar máquina e cotar <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
        <a href="#processo" className="app-vhero-scroll" aria-label="Rolar para saber mais">
          <span className="app-vhero-scroll-dot" />
        </a>
      </section>

      {/* ─────────── PROCESSO ─────────── */}
      <section id="processo" className="section-padding bg-white">
        <div className="container">
          <div className="grid-2 gap-60 align-start">
            <Reveal variant="fade-right">
              <div>
                <span className="eyebrow">Como funciona</span>
                <h2 className="section-title">A separação no <span className="text-gradient">{app.short.toLowerCase()}</span></h2>
                <p className="text-lg mt-20">{app.intro}</p>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={150}>
              <div className="app-process">
                {app.process.map((p, i) => (
                  <div className="app-process-step" key={i}>
                    <div className="app-process-step-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="app-process-step-text">
                      <strong>{p.title}</strong>
                      <p>{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────── EQUIPAMENTOS DO SETOR ─────────── */}
      {equipment && (
        <section className="section-padding bg-subtle" style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}>
          <div className="container">
            <Reveal variant="fade-up">
              <div className="text-center mb-50">
                <span className="eyebrow"><Layers size={14} /> Tecnologia de separação</span>
                <h2 className="section-title">Separadoras e centrífugas no <span className="text-gradient">{app.short.toLowerCase()}</span></h2>
                <p className="text-lg max-width-text">{equipment.lead}</p>
              </div>
            </Reveal>

            <div className="app-equip-grid">
              {equipment.items.map((it, i) => (
                <Reveal key={i} variant="fade-up" delay={i * 90}>
                  <div className="app-equip-card">
                    <h3>{it.title}</h3>
                    <p>{it.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {media.gallery?.length > 0 && (
              <Reveal variant="fade-up" delay={120}>
                <div className="app-gallery">
                  {media.gallery.map((g, i) => (
                    <AppImage key={i} src={g} seed={app.slug} alt={`${app.name} — imagem ${i + 1}`} className="app-gallery-item" />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ─────────── MARCAS E MODELOS ATENDIDOS ─────────── */}
      {brands.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="text-center mb-50">
                <span className="eyebrow"><Cog size={14} /> Cobertura</span>
                <h2 className="section-title">Marcas e modelos <span className="text-gradient">atendidos</span></h2>
                <p className="text-lg max-width-text">
                  As principais máquinas que atendemos no {app.short.toLowerCase()}, com peças, recondicionamento e serviço.
                </p>
              </div>
            </Reveal>
            <div className="seg-brands">
              {brands.map((b, i) => (
                <Reveal key={b.brand} variant="fade-up" delay={i * 60}>
                  <div className="seg-brand">
                    <h3 className="seg-brand-name">{b.brand}</h3>
                    <div className="seg-brand-models">
                      {b.models.map((m) => (
                        <span key={m} className="seg-brand-model">{m}</span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal variant="fade-up" delay={120}>
              <p className="seg-brands-foot">
                Não encontrou o seu modelo?{' '}
                <a href={waText(`Olá! Atendem o meu equipamento de ${app.name}?`)} target="_blank" rel="noopener noreferrer">
                  Fale com a engenharia <ArrowRight size={13} />
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─────────── DESAFIOS ─────────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow"><AlertTriangle size={14} /> O que está em jogo</span>
              <h2 className="section-title">Desafios que <span className="text-gradient">resolvemos</span></h2>
              <p className="text-lg max-width-text">Os pontos críticos deste setor e como a manutenção certa protege o seu processo.</p>
            </div>
          </Reveal>
          <div className="app-challenges">
            {app.challenges.map((c, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 80}>
                <div className="app-challenge">
                  <span className="app-challenge-icon"><AlertTriangle size={18} /></span>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── O QUE A SEPARI ENTREGA ─────────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <div className="grid-2 gap-60 align-center">
            <Reveal variant="fade-right">
              <ul className="info-block-bullets">
                {app.delivers.map((b, i) => (
                  <li key={i}>
                    <span className="info-block-bullets-icon"><CheckCircle2 size={15} /></span>
                    <div>
                      <strong>{b.title}</strong>
                      <p>{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal variant="fade-left" delay={150}>
              <div>
                <span className="eyebrow">Nossa entrega</span>
                <h2 className="section-title">O que a Separi <span className="text-gradient">faz por você</span></h2>
                <p className="text-lg mt-20">
                  Peças originais e equivalentes homologados, recondicionamento com balanceamento dinâmico
                  e serviço técnico de campo e oficina, sempre com lealdade ao seu processo.
                </p>
                <Link to="/registro" className="btn btn-primary" style={{ marginTop: 24 }}>
                  Cadastrar minha máquina <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────── FOCO DA MANUTENÇÃO ─────────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow"><Wrench size={14} /> Onde olhamos primeiro</span>
              <h2 className="section-title">Foco da manutenção neste <span className="text-gradient">setor</span></h2>
              <p className="text-lg max-width-text">Os itens que mais influenciam desempenho e disponibilidade em cada revisão.</p>
            </div>
          </Reveal>
          <div className="app-focus">
            {app.focus.map((f, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 80}>
                <div className="app-focus-card" style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}>
                  <span className="app-focus-card-glow" aria-hidden="true" />
                  <div className="app-focus-card-head">
                    <span className="app-focus-card-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="app-focus-card-ico"><Wrench size={16} /></span>
                  </div>
                  <p className="app-focus-card-text">{f}</p>
                  <span className="app-focus-card-check"><CheckCircle2 size={15} /> Verificado em cada revisão</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FAQ ─────────── */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <span className="eyebrow">Perguntas frequentes</span>
              <h2 className="section-title">Dúvidas sobre <span className="text-gradient">{app.short.toLowerCase()}</span></h2>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={100}>
            <div className="faq-list">
              {app.faq.map((item, i) => (
                <details className="faq-item" key={i}>
                  <summary>{item.q}</summary>
                  <div className="faq-item-body">{item.a}</div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── OUTRAS APLICAÇÕES (sutil) ─────────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="app-other-head">
              <span className="info-block-eyebrow">Outros setores</span>
              <h2 className="section-title">Explore outras <span className="text-gradient">aplicações</span></h2>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={80}>
            <div className="app-other-rail">
              {others.map((a) => (
                <Link key={a.slug} to={`/aplicacoes/${a.slug}`} className="app-other-link">
                  <span className="app-other-link-ic">{a.icon}</span>
                  <span className="app-other-link-name">{a.short || a.name}</span>
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <span className="eyebrow on-dark"><WhatsAppIcon size={12} /> Vamos conversar</span>
              <h2 className="section-title text-white">Soluções de separação para <span className="text-gradient">{app.short.toLowerCase()}</span></h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                Nossa engenharia avalia o seu processo e recomenda peças, recondicionamento ou equipamento sob medida.
              </p>
              <div className="cta-buttons">
                <a href={waText(`Olá! Tenho interesse em soluções da Separi para ${app.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
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
