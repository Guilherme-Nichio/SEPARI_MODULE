import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, UserPlus, Wrench, ShieldCheck,
  Package, Cog, Disc3, Check, ChevronRight, ChevronLeft, LogIn
} from 'lucide-react'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { findMachine, relatedModels, FAMILY_NOTES, TYPE_NOTES, slugify } from '../data/catalog.js'
import { PARTS_MACHINES, PARTS_GUIDE, PARTS_KITS } from '../data/partsGuide.js'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

/* Imagem da peca (PNG sem fundo) que "salta" para fora do topo da caixa.
   Basta soltar o arquivo em /public/pecas/<slug>.png que ele aparece. */
function PartPop({ slug, name }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`mqc-pop ${ok ? 'is-img' : 'is-empty'}`}>
      <img
        src={`/pecas/${slug}.png`}
        alt={name}
        loading="lazy"
        onError={() => setOk(false)}
        style={{ display: ok ? 'block' : 'none' }}
      />
      {!ok && <span className="mqc-pop-ph">imagem: <code>/pecas/{slug}.png</code></span>}
    </div>
  )
}

export default function MaquinaResultado() {
  const { marca, modelo } = useParams()
  const machine = findMachine(marca, modelo)
  if (!machine) return <Navigate to="/pecas" replace />

  const { manufacturer, model, type, app, family, arch } = machine
  const note = FAMILY_NOTES[family] || TYPE_NOTES[type] || ''

  // pecas dinamicas: derivadas da arquitetura da maquina
  const archMachine = PARTS_MACHINES.find((m) => m.key === arch) || PARTS_MACHINES[0]
  const parts = (archMachine?.parts || [])
    .map((slug) => ({ slug, ...PARTS_GUIDE[slug] }))
    .filter((p) => p.name)

  const related = relatedModels(marca, machine)
  const wa = (txt) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`
  const waModel = wa(`Ola! Preciso de pecas/servico para a minha ${manufacturer.name} ${model}.`)

  // controle simples do carrossel de componentes
  const scrollParts = (dir) => {
    const el = document.getElementById('mqc-track')
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: 'smooth' })
  }

  return (
    <div className="mq-page">
      <Seo
        title={`${manufacturer.name} ${model} - Pecas e servico para centrifuga | Separi`}
        description={`Pecas OEM e equivalentes, kits de servico e recondicionamento para a ${manufacturer.name} ${model} (${type}). ${app}.`}
      />

      {/* HERO */}
      <section className="mq-hero mq-hero-rich">
        <div className="mq-hero-glow" aria-hidden="true" />
        <div className="mq-hero-grid-bg" aria-hidden="true" />
        <div className="container">
          <nav className="mq-crumbs" aria-label="Voce esta aqui">
            <Link to="/">Inicio</Link><ChevronRight size={14} />
            <Link to="/pecas">Pecas</Link><ChevronRight size={14} />
            <Link to={`/fabricantes/${manufacturer.slug}`}>{manufacturer.name}</Link><ChevronRight size={14} />
            <span aria-current="page">{model}</span>
          </nav>

          <Reveal variant="fade-up">
            <h1 className="mq-title">{model}</h1>
            <div className="mq-tags">
              <span className="mq-tag mq-tag--type"><Cog size={13} /> {type}</span>
              <span className="mq-tag"><Disc3 size={13} /> {app}</span>
              <span className="mq-tag mq-tag--ok"><ShieldCheck size={13} /> Pecas disponiveis</span>
            </div>
            <p className="mq-lead">{note}</p>
            <div className="mq-cta">
              <Link to="/registro" className="btn btn-primary btn-lg"><UserPlus size={18} /> Cadastrar esta maquina</Link>
              <a href={waModel} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg">
                <WhatsAppIcon size={18} /> Falar com especialista
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PECAS DINAMICAS - carrossel com PNG saltando da caixa */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="mqc-head">
              <div>
                <h2 className="section-title">Componentes do seu <span className="text-gradient">{model}</span></h2>
                <p className="section-intro">
                  Itens de reposicao tipicos desta arquitetura ({type}). Toque num componente para ver funcao,
                  sinais de desgaste e solicitar OEM ou equivalente homologado.
                </p>
              </div>
              <div className="mqc-nav">
                <button type="button" className="mqc-nav-btn" onClick={() => scrollParts(-1)} aria-label="Anterior"><ChevronLeft size={20} /></button>
                <button type="button" className="mqc-nav-btn" onClick={() => scrollParts(1)} aria-label="Proximo"><ChevronRight size={20} /></button>
              </div>
            </div>
          </Reveal>

          <div className="mqc-carousel">
            <div className="mqc-track" id="mqc-track">
              {parts.map((p) => (
                <Link key={p.slug} to={`/pecas/guia/${p.slug}`} className="mqc-card">
                  <PartPop slug={p.slug} name={p.name} />
                  <div className="mqc-card-body">
                    <h3>{p.name}</h3>
                    <p>{p.short}</p>
                    <span className="mqc-card-go">Ver peca <ArrowRight size={14} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KITS */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <h2 className="section-title">Kits de servico recomendados</h2>
            <p className="section-intro">
              Reuna num unico codigo tudo o que cada nivel de manutencao pede para o seu {model}.
              Como referencia, separadores de alta rotacao pedem servico a cada 8.000 horas ou 12 meses - o que vier primeiro.
            </p>
          </Reveal>
          <div className="mq-kits">
            {PARTS_KITS.map((k, i) => (
              <Reveal key={k.name} variant="fade-up" delay={i * 50}>
                <div className="mq-kit">
                  <span className="mq-kit-ic"><Package size={20} /></span>
                  <h4>{k.name}</h4>
                  <p>{k.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mq-warranty"><ShieldCheck size={15} /> Itens de nao-desgaste com garantia de 3 meses. OEM ou equivalente homologado - a origem e sempre detalhada no orcamento.</p>
        </div>
      </section>

      {/* CHAMADA: cadastro / login / contato (substitui "Aplicacao tipica") */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="mq-join">
              <div className="mq-join-text">
                <h2>Veja preco, estoque e cote o seu {model} em minutos</h2>
                <p>
                  Crie a sua conta gratuita e cadastre a maquina: a nossa engenharia libera o catalogo
                  certo, com pecas compativeis, kits prontos e cotacao direta. Ja e cliente? Faca login e
                  continue de onde parou - ou fale agora com um especialista.
                </p>
                <ul className="mq-join-feats">
                  <li><Check size={16} /> Catalogo e kits compativeis com o seu modelo</li>
                  <li><Check size={16} /> Cotacao online e historico de pedidos</li>
                  <li><Check size={16} /> Atendimento tecnico direto, sem intermediarios</li>
                </ul>
              </div>
              <div className="mq-join-actions">
                <Link to="/registro" className="btn btn-primary btn-lg"><UserPlus size={18} /> Criar conta gratuita</Link>
                <Link to="/login" state={{ from: { pathname: '/pecas' } }} className="btn btn-outline btn-lg"><LogIn size={16} /> Ja tenho conta</Link>
                <a href={waModel} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-teal btn-lg">
                  <WhatsAppIcon size={18} /> Falar no WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RELACIONADOS */}
      {related.length > 0 && (
        <section className="section-padding bg-subtle">
          <div className="container">
            <Reveal variant="fade-up">
              <h2 className="section-title">Outros modelos {manufacturer.name}</h2>
              <p className="section-intro">Linhas proximas que tambem passam pela nossa bancada - pecas, revisao e recondicionamento.</p>
            </Reveal>
            <div className="mq-related2">
              {related.map((r) => (
                <Link key={r.model} to={`/maquina/${manufacturer.slug}/${slugify(r.model)}`} className="mq-rel2">
                  <span className="mq-rel2-ic"><Cog size={18} /></span>
                  <span className="mq-rel2-info">
                    <span className="mq-rel2-model">{r.model}</span>
                    <span className="mq-rel2-type">{r.type}</span>
                  </span>
                  <span className="mq-rel2-go"><ArrowRight size={16} /></span>
                </Link>
              ))}
            </div>
            <div className="mq-related-foot">
              <Link to={`/fabricantes/${manufacturer.slug}`} className="btn btn-outline">
                Ver todos os modelos {manufacturer.name} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="mq-final">
        <div className="mq-final-glow" aria-hidden="true" />
        <div className="container">
          <div className="mq-final-inner">
            <span className="mq-final-kicker"><ShieldCheck size={14} /> Engenharia leal ao seu processo</span>
            <h2>Precisa de pecas ou servico para o {model}?</h2>
            <p>Cadastre a sua maquina e a nossa engenharia libera o catalogo certo - com disponibilidade, kits prontos e cotacao direta, sem intermediarios.</p>
            <div className="mq-final-cta">
              <Link to="/registro" className="btn btn-primary btn-lg"><UserPlus size={18} /> Criar conta gratuita</Link>
              <a href={waModel} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light btn-lg">
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </div>
            <Link to="/pecas" className="mq-back"><ArrowLeft size={15} /> Voltar para Pecas</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
