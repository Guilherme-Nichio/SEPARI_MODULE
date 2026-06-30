import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Factory, Disc3, Search } from 'lucide-react'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { MANUFACTURERS } from '../data/catalog.js'

export default function Fabricantes() {
  return (
    <div className="fbs-page">
      <Seo
        title="Fabricantes de centrífugas atendidos | Peças e serviço | Separi"
        description="Peças OEM e equivalentes, recondicionamento e bowls de troca para Alfa Laval, GEA Westfalia, Tetra Pak, Seital, Mitsubishi, Flottweg e Pieralisi."
      />
      <section className="fbs-hero">
        <div className="container">
          <Reveal variant="fade-up">
            <span className="fb-eyebrow"><Factory size={14} /> Fabricantes</span>
            <h1 className="fbs-title">Atendemos as principais <span className="text-gradient">marcas de centrífugas</span></h1>
            <p className="fbs-lead">
              Peças OEM e equivalentes homologados, recondicionamento e bowls de troca. Escolha o seu fabricante
              ou busque direto a sua máquina.
            </p>
            <Link to="/pecas" className="btn btn-primary btn-lg"><Search size={18} /> Buscar minha máquina</Link>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="fbs-grid">
            {MANUFACTURERS.map((m, i) => (
              <Reveal key={m.slug} variant="fade-up" delay={i * 60}>
                <Link to={`/fabricantes/${m.slug}`} className="fbs-card">
                  <div className="fbs-card-top">
                    <span className="fbs-card-logo">{m.name.charAt(0)}</span>
                    <span className="fbs-card-meta"><MapPin size={13} /> {m.country} · desde {m.founded}</span>
                  </div>
                  <h3>{m.name}</h3>
                  <p>{m.blurb}</p>
                  <div className="fbs-card-foot">
                    <span><Disc3 size={14} /> {m.models.length} modelos</span>
                    <span className="fbs-card-go">Ver fabricante <ArrowRight size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
