import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'
import { getPartGuide, PARTS_GUIDE, PARTS_MACHINES } from '../data/partsGuide.js'
import { WHATSAPP_DIGITS } from '../site/siteConfig'

/* O número comercial vive em src/site/siteConfig.ts. Antes ele vinha da
   variável VITE_WHATSAPP_NUMBER, que estava com outra linha no .env e
   mandava os cliques para um número que não é o de vendas. */
const WHATSAPP = WHATSAPP_DIGITS

export default function PartGuide() {
  const { slug } = useParams()
  const part = getPartGuide(slug)
  if (!part) return <Navigate to="/pecas" replace />

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
              <h1>{part.name}</h1>
              <p>{part.short}</p>
              <Link to="/pecas" className="pg-hero-back"><ArrowLeft size={15} /> Todas as peças</Link>
            </div>
            <aside className="pg-hero-card">
              <h2>Vá direto ao catálogo</h2>
              <p>Cadastre-se e veja disponibilidade e cotação para a sua máquina.</p>
              <Link to="/registro" className="btn btn-primary btn-lg">Acessar o catálogo</Link>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Preciso da peça: ' + part.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <WhatsAppIcon size={16} /> Falar no WhatsApp
              </a>
            </aside>
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
                <span className="pg-wear-head">Sinais de desgaste</span>
                <ul>
                  {part.wear.map((w, i) => <li key={i}><span className="pg-wear-dot" />{w}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={140}>
              <div className="pg-quality">
                <p>OEM e equivalentes homologados</p>
                <p>100% compatíveis com o original</p>
                <p>Garantia em itens de não-desgaste</p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* COMO SOLICITAR — compacto, em linha */}
      <section className="pg-order-band">
        <div className="container">
          <Reveal variant="fade-up">
            <h2 className="pg-h2 pg-order-title">Como solicitar esta peça</h2>
          </Reveal>
          <Reveal variant="fade-up" delay={80}>
            <ol className="pg-steps pg-steps-row">
              <li><span>1</span><div><strong>Identifique a sua máquina</strong><p>Marca, modelo e número de série — ajudamos se precisar.</p></div></li>
              <li><span>2</span><div><strong>Cadastre no portal</strong><p>A engenharia valida e libera o catálogo do seu equipamento.</p></div></li>
              <li><span>3</span><div><strong>Receba a cotação</strong><p>Você escolhe entre OEM e equivalente, com prazo e valor.</p></div></li>
            </ol>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-padding bg-subtle">
          <div className="container">
            <h2 className="pg-related-title">Outras peças desta máquina</h2>
            <div className="pg-related">
              {related.map(s => {
                const r = PARTS_GUIDE[s]
                return (
                  <Link key={s} to={`/pecas/guia/${s}`} className="pg-related-card">
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

    </div>
  )
}
