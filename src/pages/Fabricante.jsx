import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, MapPin, Calendar, Check,
  Factory, ChevronRight, Layers, Disc3, ArrowUpRight, Wrench, Boxes
} from 'lucide-react'
import { useMemo } from 'react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'
import { getManufacturer, slugify } from '../data/catalog.js'
import { getSectorsForBrand } from '../data/applications.jsx'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

export default function Fabricante() {
  const { slug } = useParams()
  const m = getManufacturer(slug)
  if (!m) return <Navigate to="/fabricantes" replace />

  // agrupa modelos por família
  const families = useMemo(() => {
    const map = new Map()
    m.models.forEach((md) => {
      if (!map.has(md.family)) map.set(md.family, [])
      map.get(md.family).push(md)
    })
    return [...map.entries()]
  }, [m])

  const sectors = useMemo(() => getSectorsForBrand(m.name), [m])
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Preciso de peças/serviço para separadores ${m.name}.`)}`

  return (
    <div className="fb-page">
      <Seo
        title={`Peças e serviço ${m.name} para centrífugas | Separi`}
        description={`${m.blurb} Peças OEM e equivalentes, recondicionamento e bowls de troca para ${m.name}.`}
      />

      <section className="fb-hero fb-hero--branded fb-clip-bottom">
        <div className="container">
          <nav className="mq-crumbs" aria-label="Você está aqui">
            <Link to="/">Início</Link><ChevronRight size={14} />
            <Link to="/fabricantes">Fabricantes</Link><ChevronRight size={14} />
            <span aria-current="page">{m.name}</span>
          </nav>
          <Reveal variant="fade-up">
            <div className="fb-hero-text">
              <span className="fb-eyebrow"><Factory size={14} /> Fabricante atendido</span>
              <h1 className="fb-title">{m.name}</h1>
              <p className="fb-lead">{m.blurb}</p>
              <div className="fb-meta">
                <span><MapPin size={15} /> {m.country}</span>
                <span><Calendar size={15} /> desde {m.founded}</span>
                <span><Disc3 size={15} /> {m.models.length} modelos no catálogo</span>
              </div>
              <div className="fb-cta">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  <WhatsAppIcon size={18} /> Falar com especialista
                </a>
                <Link to="/pecas" className="btn btn-outline-light btn-lg">Buscar minha máquina <ArrowRight size={16} /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* pontos fortes */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="fb-strengths">
            {m.strengths.map((s, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 60}>
                <div className="fb-strength"><Check size={18} /> {s}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* gerações / linhas */}
      {m.generations?.length > 0 && (
        <section className="section-padding bg-subtle">
          <div className="container">
            <Reveal variant="fade-up">
              <span className="eyebrow"><Layers size={14} /> Linhas e gerações</span>
              <h2 className="section-title">A evolução da {m.name}</h2>
            </Reveal>
            <div className="fb-gens">
              {m.generations.map((g, i) => (
                <Reveal key={i} variant="fade-up" delay={i * 60}>
                  <div className="fb-gen">
                    <span className="fb-gen-era">{g.era}</span>
                    <h4>{g.name}</h4>
                    <p>{g.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* modelos por família */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <span className="eyebrow"><Disc3 size={14} /> Catálogo de modelos</span>
            <h2 className="section-title">Modelos {m.name} que atendemos</h2>
            <p className="section-intro">Clique em um modelo para ver a página com peças, kits e serviço específicos dele.</p>
          </Reveal>
          <div className="fb-families">
            {families.map(([family, list]) => (
              <div key={family} className="fb-family">
                <h3 className="fb-family-title">{family}</h3>
                <div className="fb-models">
                  {list.map((md) => (
                    <Link key={md.model} to={`/maquina/${m.slug}/${slugify(md.model)}`} className="fb-model">
                      <span className="fb-model-name">{md.model}</span>
                      <span className="fb-model-type">{md.type}</span>
                      <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* setores atendidos × modelos deste fabricante */}
      {sectors.length > 0 && (
        <section className="section-padding bg-subtle">
          <div className="container">
            <Reveal variant="fade-up">
              <span className="eyebrow"><Layers size={14} /> Setores atendidos</span>
              <h2 className="section-title">Onde a {m.name} atua <span className="text-gradient">na sua indústria</span></h2>
              <p className="section-intro">
                Os segmentos em que aplicamos equipamentos {m.name}, com os modelos típicos de cada um.
                Clique no segmento para ver o processo em detalhe.
              </p>
            </Reveal>

            <Reveal variant="fade-up" delay={80}>
              <div className="fb-sectors">
                {sectors.map((sec) => (
                  <div key={sec.slug} className="fb-sector-row">
                    <Link
                      to={`/aplicacoes/${sec.slug}`}
                      className="fb-sector-photo"
                      style={{ '--p': `url("${sec.photo}")`, '--pf': `url("/_fallback/sector-${sec.slug}.jpg")` }}
                      aria-label={`Ver setor ${sec.name}`}
                    />
                    <div className="fb-sector-main">
                      <Link to={`/aplicacoes/${sec.slug}`} className="fb-sector-name">{sec.name}</Link>
                      <div className="fb-sector-models">
                        {sec.models.map((md) => (
                          <Link
                            key={md}
                            to={`/maquina/${m.slug}/${slugify(md)}`}
                            className="fb-sector-model"
                          >{md}</Link>
                        ))}
                      </div>
                    </div>
                    <Link to={`/aplicacoes/${sec.slug}`} className="fb-sector-go">
                      Ver setor <ArrowUpRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* chamada: serviços + kits */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="fb-calls">
            <Reveal variant="fade-right">
              <Link to="/servicos" className="fb-call">
                <span className="fb-call-icon"><Wrench size={24} /></span>
                <div className="fb-call-body">
                  <h3>Serviços para {m.name}</h3>
                  <p>Manutenção preventiva, revisão geral e recondicionamento ao padrão OEM, em campo ou na nossa oficina.</p>
                  <span className="fb-call-go">Ver serviços <ArrowRight size={16} /></span>
                </div>
              </Link>
            </Reveal>
            <Reveal variant="fade-left" delay={120}>
              <Link to="/pecas" className="fb-call">
                <span className="fb-call-icon"><Boxes size={24} /></span>
                <div className="fb-call-body">
                  <h3>Kits e peças {m.name}</h3>
                  <p>Kits de revisão prontos e peças OEM ou equivalentes homologadas, com cotação rápida pelo catálogo.</p>
                  <span className="fb-call-go">Ver kits e peças <ArrowRight size={16} /></span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mq-final">
        <div className="container">
          <h2>Não encontrou o seu modelo {m.name}?</h2>
          <p>Atendemos muitos outros modelos sob consulta. Fale com a nossa engenharia com o modelo e o número de série.</p>
          <div className="mq-final-cta">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg"><WhatsAppIcon size={18} /> WhatsApp</a>
            <Link to="/fabricantes" className="btn btn-ghost btn-lg">Ver outros fabricantes</Link>
          </div>
          <Link to="/pecas" className="mq-back"><ArrowLeft size={15} /> Voltar para Peças</Link>
        </div>
      </section>
    </div>
  )
}
