import { Link, useParams, Navigate } from 'react-router-dom'
import {
  CircleDot, CircleDashed, Layers, Disc3, Minus, Droplets, Cylinder,
  RotateCw, Settings, ShieldCheck, Share2, ArrowLeft, ArrowRight,
  AlertTriangle, Check, LogIn
} from 'lucide-react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'
import { getPartGuide, PARTS_GUIDE, PARTS_MACHINES, PARTS_BRANDS } from '../data/partsGuide.js'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'
const ICONS = { CircleDot, CircleDashed, Layers, Disc3, Minus, Droplets, Cylinder, RotateCw, Settings, ShieldCheck, Share2 }

export default function PartGuide() {
  const { slug } = useParams()
  const part = getPartGuide(slug)
  if (!part) return <Navigate to="/pecas" replace />
  const Icon = ICONS[part.icon] || CircleDot

  // peças relacionadas: mesma máquina
  const machine = PARTS_MACHINES.find(m => m.parts.includes(slug))
  const related = (machine?.parts || []).filter(s => s !== slug && PARTS_GUIDE[s]).slice(0, 4)

  return (
    <div className="pg-page">
      <Seo title={`${part.name} · Peças para centrífugas | Separi`} description={part.short} />

      <section className="pg-hero">
        <div className="pg-hero-grid-bg" aria-hidden="true" />
        <div className="container">
          <nav className="sb-crumbs" aria-label="breadcrumb">
            <Link to="/">Início</Link><span>/</span>
            <Link to="/pecas">Peças</Link><span>/</span><span>{part.name}</span>
          </nav>
          <div className="pg-hero-inner">
            <div className="pg-hero-text">
              <span className="pg-hero-machine">{part.machine}</span>
              <h1>{part.name}</h1>
              <p>{part.short}</p>
              <div className="pg-hero-ctas">
                <Link to="/registro" className="btn btn-primary btn-lg"><LogIn size={16} /> Ver no catálogo</Link>
                <Link to="/pecas" className="btn btn-outline btn-lg"><ArrowLeft size={16} /> Todas as peças</Link>
              </div>
            </div>
            <div className="pg-hero-art" aria-hidden="true"><Icon size={120} /></div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container pg-body">
          <div className="pg-main">
            <Reveal variant="fade-up">
              <h2 className="pg-h2">O que é e para que serve</h2>
              {part.body.map((p, i) => <p key={i} className="pg-p">{p}</p>)}
            </Reveal>
          </div>

          <aside className="pg-aside">
            <Reveal variant="fade-up" delay={80}>
              <div className="pg-wear">
                <span className="pg-wear-head"><AlertTriangle size={16} /> Sinais de desgaste</span>
                <ul>
                  {part.wear.map((w, i) => <li key={i}><span className="pg-wear-dot" />{w}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={140}>
              <div className="pg-quality">
                <p><Check size={15} /> OEM e equivalentes homologados</p>
                <p><Check size={15} /> 100% compatíveis com o original</p>
                <p><Check size={15} /> Garantia em itens de não-desgaste</p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* COMO SOLICITAR + MARCAS */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <div className="pg-order">
            <Reveal variant="fade-right">
              <div className="pg-order-text">
                <h2 className="pg-h2">Como solicitar esta peça</h2>
                <ol className="pg-steps">
                  <li><span>1</span><div><strong>Identifique a sua máquina</strong><p>Marca, modelo e número de série — ajudamos se precisar.</p></div></li>
                  <li><span>2</span><div><strong>Cadastre no portal</strong><p>A nossa engenharia valida e libera o catálogo certo para o seu equipamento.</p></div></li>
                  <li><span>3</span><div><strong>Receba a cotação</strong><p>Você escolhe entre OEM e equivalente, com prazo e disponibilidade.</p></div></li>
                </ol>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={120}>
              <div className="pg-brands">
                <span className="pg-brands-label">Atendemos as principais marcas</span>
                <div className="pg-brands-list">
                  {PARTS_BRANDS.map((bn, i) => <span className="pg-brand-chip" key={i}>{bn}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-padding bg-subtle">
          <div className="container">
            <h2 className="pg-related-title">Outras peças desta máquina</h2>
            <div className="pg-related">
              {related.map(s => {
                const r = PARTS_GUIDE[s]; const RI = ICONS[r.icon] || CircleDot
                return (
                  <Link key={s} to={`/pecas/guia/${s}`} className="pg-related-card">
                    <span className="pg-related-ic"><RI size={20} /></span>
                    <div>
                      <h3>{r.name}</h3>
                      <p>{r.short}</p>
                    </div>
                    <ArrowRight size={16} className="pg-related-arrow" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container">
          <div className="pc-cta">
            <div className="pc-cta-text">
              <span className="pc-cta-kicker">Catálogo de peças</span>
              <h3>Precisa desta peça para a sua máquina?</h3>
              <p>Cadastre o seu equipamento e a nossa engenharia libera o catálogo com os itens certos, disponibilidade e cotação direta.</p>
            </div>
            <div className="pc-cta-actions">
              <Link to="/registro" className="btn btn-primary btn-lg"><LogIn size={16} /> Entrar e ver o catálogo</Link>
              <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Preciso da peça: ' + part.name)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                <WhatsAppIcon size={16} /> Falar com especialista
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
