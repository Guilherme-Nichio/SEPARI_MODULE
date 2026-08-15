import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, MapPin, Calendar, Check,
  ChevronRight, Layers, Disc3, ArrowUpRight, Wrench, Boxes
} from 'lucide-react'
import { useMemo } from 'react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'
import { getManufacturer, slugify } from '../data/catalog.js'
import { getSectorsForBrand } from '../data/applications.jsx'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '5519974059048'

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

      {/* modelos por segmento — substitui a antiga seção "evolução" */}
      {sectors.length > 0 && (
        <section className="section-padding bg-subtle">
          <div className="container">
            <Reveal variant="fade-up">
              <h2 className="section-title">Onde cada modelo {m.name} <span className="text-gradient">trabalha</span></h2>
              <p className="section-intro">
                Os segmentos em que aplicamos equipamentos {m.name} e os modelos típicos de cada processo.
              </p>
            </Reveal>
            <div className="fbseg-grid">
              {sectors.map((sec, i) => (
                <Reveal key={sec.slug} variant="fade-up" delay={i * 60}>
                  <article className="fbseg">
                    <Link
                      to={`/aplicacoes/${sec.slug}`}
                      className="fbseg-media"
                      style={{ '--p': `url("${sec.photo}")` }}
                      aria-label={`Ver setor ${sec.name}`}
                    >
                      <span className="fbseg-photo" aria-hidden="true" />
                      <span className="fbseg-veil" aria-hidden="true" />
                      <span className="fbseg-head">
                        <span className="fbseg-name">{sec.short || sec.name}</span>
                        <span className="fbseg-go" aria-hidden="true"><ArrowUpRight size={15} /></span>
                      </span>
                    </Link>
                    <div className="fbseg-models">
                      {sec.models.slice(0, 4).map((md) => (
                        <Link key={md} to={`/maquina/${m.slug}/${slugify(md)}`} className="fbseg-model">
                          <span>{md}</span>
                          <ArrowRight size={13} />
                        </Link>
                      ))}
                      {sec.models.length > 4 && (
                        <a href="#catalogo" className="fbseg-more">+ {sec.models.length - 4} outros modelos</a>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* modelos por família — índice completo */}
      <section id="catalogo" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <h2 className="section-title">Todos os modelos {m.name} que atendemos</h2>
            <p className="section-intro">Clique em um modelo para ver a página com peças, kits e serviço específicos dele.</p>
          </Reveal>
          <div className="fb-families">
            {families.map(([family, list]) => (
              <div key={family} className="fb-family">
                <h3 className="fb-family-title">{family} <span className="fb-family-count">{list.length}</span></h3>
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
