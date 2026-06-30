import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench, Settings, Package, Cog,
  ArrowRight, Check, ChevronRight, CheckCircle2,
  Truck, Globe, GraduationCap, Search,
  ClipboardCheck, FileText, Play, User as UserIcon,
  Award, ShieldCheck,
  Repeat, FileCheck, Microscope, Gauge, Scale, Sparkles,
  Mail, Phone, MapPin
} from 'lucide-react'
import Reveal from '../components/Reveal'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'
import HeroSplit from '../components/HeroSplit'
import SectorGrid from '../components/SectorGrid'
import WorkshopProtocol from '../components/WorkshopProtocol'
import { OperationShapes } from '../components/HomeShapes'
import { useAuth } from '../contexts/AuthContext'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

// Vídeo institucional, solte o arquivo em /public/separi-video.mp4
const VIDEO_FILE = '/separi-video.mp4'
const VIDEO_POSTER = '/teste.png'

// Imagens dos info blocks, solte arquivos em /public/ ou troque pelos seus URLs
// Enquanto não houver imagem, o bloco mostra "...imagem" no centro
const HERO_IMG_OFICINA = ''      // foto da sua oficina
const HERO_IMG_BOWL    = ''      // foto de um bowl em recondicionamento


const services = [
  { icon: <Settings size={26} />, title: 'Manutenção Preventiva', desc: 'Inspeções programadas em campo, verificações operacionais e substituição planejada de componentes consumíveis para evitar paradas inesperadas.' },
  { icon: <Wrench size={26} />,   title: 'Revisão Geral em Oficina', desc: 'Desmontagem completa, inspeção dimensional, balanceamento dinâmico computadorizado e remontagem dentro das tolerâncias originais do fabricante.' },
  { icon: <Cog size={26} />,      title: 'Recondicionamento Total', desc: 'Restauração integral do equipamento: usinagem, jateamento, pintura industrial, motor retificado e teste contínuo de bancada antes do envio.' }
]

const workshopServices = [
  { title: 'Balanceamento Dinâmico',   img: '/oficina/balanceamento.jpg', desc: 'Balanceamento de bowls completos em balanceadora computadorizada, com correção em dois planos conforme tolerâncias OEM e ISO.', tag: 'Norma OEM/ISO', points: ['Correção em dois planos', 'Relatório de vibração residual', 'Conformidade ISO 1940'] },
  { title: 'Inspeção Não-Destrutiva',  img: '/oficina/ndt.jpg', desc: 'Líquido penetrante para detecção de trincas, inspeção de erosão em lock ring, verificação de tolerâncias dos discos e medição de altura do conjunto.', tag: 'NDT', points: ['Ensaio por líquido penetrante', 'Medição de altura do conjunto', 'Mapa de trincas e erosão'] },
  { title: 'Teste de Run-in Contínuo', img: '/oficina/runin.jpg', desc: 'Run-in monitorado de 8 a 10 horas com líquido antes do envio, validando vibração, temperatura de mancais e vazão de descarga.', tag: 'Pré-envio', points: ['8 a 10 h de operação contínua', 'Monitoramento de mancais', 'Validação de vazão e temperatura'] },
  { title: 'Microusinagem e Jateamento', img: '/oficina/usinagem.jpg', desc: 'Microusinagem de superfícies de selagem e roscas, jateamento de areia, pintura externa e tratamento da carcaça interna.', tag: 'Restauração', points: ['Superfícies de selagem recuperadas', 'Jateamento e pintura industrial', 'Tratamento da carcaça interna'] },
  { title: 'Programa de Bowls de Troca', img: '/oficina/bowls.jpg', desc: 'Substitua o bowl da sua máquina por um de nosso estoque enquanto recondicionamos o seu, evite paradas longas durante a revisão.', tag: 'Locação', points: ['Bowl de estoque durante a revisão', 'Sem parada longa de produção', 'Logística de ida e volta'] },
  { title: 'Certificado e Garantia',   img: '/oficina/certificado.jpg', desc: 'Relatório técnico fotográfico documentando cada etapa executada, mais certificado de balanceamento e garantia de 3 meses.', tag: 'Documentação', points: ['Relatório fotográfico por etapa', 'Certificado de balanceamento', 'Garantia de 3 meses'] }
]

// ───────── SEÇÃO "DESDE A PRIMEIRA PEÇA" ─────────
// Troque a imagem de cada item pelo arquivo indicado em `img`
// (ou troque o `icon` por outro ícone seu).
const features = [
  {
    icon: <Award size={26} />,
    img: '/public/destaques/qualidade-oem.jpg',
    title: 'Qualidade OEM ou equivalente certificada',
    desc: 'Cada peça é testada em bancada para atender ou superar a especificação original.',
    href: '/equipamentos#estoque', linkLabel: 'Ver catálogo'
  },
  {
    icon: <Truck size={26} />,
    img: '/public/destaques/entrega-latam.jpg',
    title: 'Entrega rápida na América Latina',
    desc: 'Estoque em Indaiatuba/SP e envio expresso para todo o Brasil, para reduzir a sua parada.',
    href: '/registro', linkLabel: 'Solicitar cotação'
  },
  {
    icon: <Globe size={26} />,
    img: '/public/destaques/marcas.jpg',
    title: 'Cobertura completa de marcas',
    desc: 'Alfa Laval, GEA Westfalia, Tetra Pak e Seital — das séries clássicas às mais modernas.',
    href: '/sobre', linkLabel: 'Marcas atendidas'
  },
  {
    icon: <GraduationCap size={26} />,
    img: '/public/destaques/engenharia.jpg',
    title: 'Engenharia técnica especializada',
    desc: 'Engenheiros formados nas escolas dos fabricantes, com prática real em campo e oficina.',
    href: '/servicos', linkLabel: 'Conhecer serviços'
  }
]

// ───────── SEÇÃO "DO CADASTRO AO ORÇAMENTO" ─────────
// Troque livremente o `icon` de cada etapa pelo ícone que preferir.
const process = [
  { n: '01', title: 'Você cadastra sua máquina',  desc: 'Modelo, número de série e foto da placa de identificação. Cadastro gratuito, sem compromisso.', icon: <Settings size={30} /> },
  { n: '02', title: 'Nossa engenharia valida',    desc: 'Confirmamos compatibilidade técnica e liberamos um catálogo exclusivo para a sua máquina.', icon: <Search size={30} /> },
  { n: '03', title: 'Você cota peças e kits',     desc: 'Monte sua cotação peça por peça ou escolha kits prontos pré-aprovados para o seu modelo.', icon: <ClipboardCheck size={30} /> },
  { n: '04', title: 'Recebe orçamento técnico',   desc: 'Resposta com preço, prazo de entrega e plano de manutenção sugerido em poucos dias úteis.', icon: <FileText size={30} /> }
]

const faqs = [
  {
    q: 'Quais marcas e gerações de centrífuga a Separi atende?',
    a: 'Todas as gerações comerciais de Alfa Laval, GEA Westfalia e Tetra Pak (incluindo H214), além de Seital. Pieralisi e Flottweg sob consulta técnica.'
  },
  {
    q: 'Como funciona a cotação de peças no portal?',
    a: 'Cadastro gratuito. Você registra a máquina (modelo, série e foto da placa), a engenharia valida e libera o catálogo compatível. Daí monta a cotação e recebe proposta com preço e prazo.'
  },
  {
    q: 'Vocês fazem manutenção em campo?',
    a: 'Sim. Equipe certificada vai à planta para diagnóstico, preventiva, revisão geral, troca de componentes, instalação e comissionamento, sempre com relatório técnico.'
  },
  {
    q: 'Trabalham com peças OEM, equivalentes ou ambas?',
    a: 'Ambas. Componentes críticos usam OEM ou equivalente homologado em bancada; itens de menor criticidade têm equivalentes certificados. A origem é informada na proposta.'
  },
  {
    q: 'O que inclui o recondicionamento de uma centrífuga?',
    a: 'Limpeza química, inspeção não-destrutiva, verificação dimensional, microusinagem, balanceamento dinâmico, jateamento e pintura, motor retificado, troca de rolamentos e selos, painel de controle e run-in de 8 a 10 h — tudo documentado.'
  },
  {
    q: 'Qual a abrangência de atendimento?',
    a: 'Sede e oficina em Indaiatuba/SP, com cobertura em todo o Brasil e América Latina, e outros mercados sob demanda.'
  },
  {
    q: 'Qual a garantia oferecida?',
    a: 'Garantia técnica de 3 meses sobre os componentes substituídos, com acompanhamento pós-entrega.'
  }
]

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Manutenção de centrífugas industriais',
  provider: { '@type': 'Organization', name: 'Separi' },
  areaServed: { '@type': 'Place', name: 'América Latina' },
  description: 'Peças OEM, recondicionamento, balanceamento dinâmico e serviço técnico para centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital.'
}

// Placeholder visual: sem imagem, apenas o caminho onde a foto deve entrar.
function InfoBlockVisual({ src, alt, path = '/public/imagem.jpg' }) {
  return (
    <div className="info-block-visual is-empty">
      {src ? <img src={src} alt={alt} loading="lazy" onError={(e) => { e.target.style.display = 'none' }} /> : null}
      <div className="info-block-visual-placeholder">
        imagem: <code>{path}</code>
      </div>
    </div>
  )
}

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth()
  const accountHref = isAdmin ? '/admin' : '/perfil'
  const accountLabel = isAdmin ? 'Painel administrativo' : 'Ir para minha conta'

  // ── TESTE DE FONTE (somente home) ──
  // Aplica a fonte "flsFont" apenas enquanto a home está montada, para
  // comparar com a tipografia atual. Ao sair da página, volta ao normal.
  useEffect(() => {
    document.body.classList.add('home-font-test')
    return () => document.body.classList.remove('home-font-test')
  }, [])

  return (
    <>
      <Seo
        title="Separi, Peças, Serviços e Equipamentos para Centrífugas Industriais"
        description="Especialista em peças OEM, recondicionamento, balanceamento dinâmico e manutenção para centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital."
        jsonLd={homeJsonLd}
      />

      {/* ─────────── HERO (split editorial) ─────────── */}
      <HeroSplit />

      {/* ─────────── APLICAÇÕES (trazidas para o topo) ─────────── */}
      <section id="aplicacoes" className="section-padding bg-white" style={{ paddingTop: 'clamp(56px, 7vw, 90px)', paddingBottom: 'clamp(40px, 6vw, 70px)' }}>
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-40">
              <h2 className="section-title">Onde <span className="text-gradient">a separação importa</span></h2>
              <p className="text-lg max-width-text">
                Soluções dimensionadas para a realidade de cada setor. Veja as marcas e modelos que atendemos.
              </p>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={60}>
            <SectorGrid />
          </Reveal>
          <Reveal variant="fade-up" delay={140}>
            <div className="cta-inline" style={{ marginTop: 36 }}>
              <div className="cta-inline-text">
                <strong>O seu setor não está listado?</strong>
                <p>Atendemos outras indústrias mediante consulta técnica prévia.</p>
              </div>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <WhatsAppIcon size={16} /> Falar com especialista
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── MÁQUINAS NOVAS (destaque) ─────────── */}
      <section className="section-padding bg-subtle" style={{ paddingTop: 'clamp(48px, 6vw, 80px)' }}>
        <div className="container">
          <Reveal variant="fade-up">
            <div className="home-novas">
              <div className="home-novas-text">
                <span className="eyebrow"><Sparkles size={14} /> Em destaque</span>
                <h2 className="section-title">Máquinas <span className="text-gradient">novas de fábrica</span></h2>
                <p className="text-lg mt-20">
                  Além de peças e recondicionamento, fornecemos centrífugas e separadores
                  novos, configurados para a sua aplicação.
                </p>
                <Link to="/produtos#novas" className="btn btn-primary" style={{ marginTop: 22 }}>
                  Ver máquinas novas <ArrowRight size={16} />
                </Link>
              </div>
              <div className="home-novas-visual">
                <InfoBlockVisual src="" alt="Máquina nova Separi" path="/public/produtos/ch700.png" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── DESDE A PRIMEIRA PEÇA (destaques) ─────────── */}
      <section id="por-que" className="section-padding bg-white" style={{ paddingTop: 'clamp(80px, 10vw, 130px)' }}>
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">
                Especialistas em separação <span className="text-gradient">desde a primeira peça</span>
              </h2>
              <p className="text-lg max-width-text">
                O essencial para manter a sua centrífuga dentro das tolerâncias originais.
              </p>
            </div>
          </Reveal>

          <div className="highlight-grid">
            {features.map((f, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 90}>
                <div className="highlight-card">
                  {/* SLOT DE IMAGEM — troque pelo arquivo indicado */}
                  <div className="highlight-card-media">
                    <span className="highlight-card-icon">{f.icon}</span>
                    <span className="highlight-card-path">imagem: <code>{f.img}</code></span>
                  </div>
                  <div className="highlight-card-body">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                    <Link to={f.href} className="highlight-card-link">
                      {f.linkLabel} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── INFO BLOCK 1, Sobre + imagem oficina ─────────── */}
      <section className="info-block">
        <div className="container">
          <div className="info-block-grid">
            <Reveal variant="fade-right">
              <div>
                <h2 className="info-block-title">
                  Leais ao seu <span className="text-gradient">processo</span>,<br />
                  não ao fabricante.
                </h2>
                <p className="info-block-lead">
                  Engenharia formada nos chãos de fábrica e a bordo de embarcações comerciais —
                  a leitura técnica que só vem de décadas em ambientes reais: laticínios, cervejarias,
                  refinarias e plantas de biodiesel.
                </p>

                <ul className="info-block-bullets">
                  <li>
                    <span className="info-block-bullets-icon"><CheckCircle2 size={15} /></span>
                    <div>
                      <strong>Engenharia independente</strong>
                      <p>Recomendamos a solução correta para o seu processo, sem amarras comerciais a um fabricante específico.</p>
                    </div>
                  </li>
                  <li>
                    <span className="info-block-bullets-icon"><CheckCircle2 size={15} /></span>
                    <div>
                      <strong>Oficina técnica completa</strong>
                      <p>Balanceamento dinâmico computadorizado, microusinagem de precisão e teste contínuo de até 10 horas antes do envio.</p>
                    </div>
                  </li>
                  <li>
                    <span className="info-block-bullets-icon"><CheckCircle2 size={15} /></span>
                    <div>
                      <strong>Equipe de campo certificada</strong>
                      <p>Manutenção executada por técnicos com formação direta nas escolas dos próprios fabricantes que atendemos.</p>
                    </div>
                  </li>
                </ul>

                <Link to="/sobre" className="btn btn-outline">
                  Conheça a nossa história <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <InfoBlockVisual src={HERO_IMG_OFICINA} alt="Oficina Separi em Indaiatuba" path="/public/separi-oficina.jpg" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────── PROCESS, passo a passo ─────────── */}
      <section className="process-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="process-head">
              <h2 className="section-title">
                Do cadastro ao orçamento técnico em <span className="text-gradient">4 etapas</span>
              </h2>
              <p className="text-lg max-width-text">
                Cadastro gratuito, validação por engenharia e catálogo personalizado para cada máquina aprovada.
              </p>
            </div>
          </Reveal>

          <div className="process-flow">
            {process.map((p, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 100}>
                <div className="process-step">
                  <div className="process-step-symbol">{p.icon}</div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-50">
            {isAuthenticated ? (
              <Link to={accountHref} className="btn btn-primary">
                <UserIcon size={16} /> {accountLabel} <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/registro" className="btn btn-primary">
                Criar conta agora <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─────────── INFO BLOCK 2, Peças + imagem bowl ─────────── */}
      <section className="info-block dark">
        <div className="container">
          <div className="info-block-grid">
            <Reveal variant="fade-right">
              <InfoBlockVisual src={HERO_IMG_BOWL} alt="Bowl em recondicionamento" path="/public/separi-bowl.jpg" />
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <div>
                <h2 className="info-block-title">
                  Estoque consolidado,<br />
                  <span className="text-gradient">entrega que respeita o seu prazo.</span>
                </h2>
                <p className="info-block-lead">
                  Mantemos em estoque os componentes de maior desgaste — bowls, transmissão,
                  kits de serviço, vedações, sensores e unidades de controle — para a sua planta
                  não esperar importação no momento crítico.
                </p>

                <ul className="info-block-bullets">
                  <li>
                    <span className="info-block-bullets-icon"><Check size={15} /></span>
                    <div>
                      <strong>Kits de Serviço Completos</strong>
                      <p>Padrão OEM ou equivalente certificado para revisão preventiva e intermediária.</p>
                    </div>
                  </li>
                  <li>
                    <span className="info-block-bullets-icon"><Check size={15} /></span>
                    <div>
                      <strong>Bowls e componentes estruturais</strong>
                      <p>Linha completa Alfa Laval (LOPX, MOPX, FOPX, MFPX, MMPX, MIB, MAB, MAPX, séries S e P).</p>
                    </div>
                  </li>
                  <li>
                    <span className="info-block-bullets-icon"><Check size={15} /></span>
                    <div>
                      <strong>Placas e unidades de controle</strong>
                      <p>GEA Westfalia (séries OSA, OSB, OSC, OSD, OSE, OSF) e Alfa Laval, novas e exchange.</p>
                    </div>
                  </li>
                  <li>
                    <span className="info-block-bullets-icon"><Check size={15} /></span>
                    <div>
                      <strong>Vedações e itens de desgaste</strong>
                      <p>Gaxetas, o-rings, anéis de selagem e elementos elásticos sempre disponíveis.</p>
                    </div>
                  </li>
                </ul>

                {isAuthenticated ? (
                  <Link to="/pecas" className="btn btn-primary">
                    Acessar catálogo <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link to="/registro" className="btn btn-primary">
                    Acessar catálogo <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────── SERVIÇOS (3 tiers principais) ─────────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">
                Tudo que <span className="text-gradient">mantém sua operação</span>
              </h2>
              <p className="text-lg max-width-text">
                Da manutenção preventiva em campo ao recondicionamento integral em nossa oficina.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={120}>
            <OperationShapes />
          </Reveal>

          <Reveal variant="fade-up" delay={200}>
            <div className="text-center mt-50">
              <Link to="/servicos" className="btn btn-outline">
                Ver todos os serviços <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── WORKSHOP / OFICINA — protocolo (redesenhado) ─────────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">
                Trabalho de <span className="text-gradient">precisão</span>, etapa por etapa
              </h2>
              <p className="text-lg max-width-text">
                Cada equipamento que entra em nossa oficina segue um protocolo técnico estruturado e auditável.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={80}>
            <WorkshopProtocol steps={workshopServices} />
          </Reveal>
        </div>
      </section>

      {/* ─────────── VIDEO INSTITUCIONAL ─────────── */}
      <section className="video-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="video-head">
              <h2 className="section-title">
                Nossa operação por <span className="text-gradient">dentro</span>
              </h2>
              <p className="text-lg max-width-text">
                Um tour pela oficina técnica, equipe de campo e processos de recondicionamento.
              </p>
            </div>
          </Reveal>

          <Reveal variant="zoom-in" delay={100}>
            <div className="video-frame">
              <video
                src={VIDEO_FILE}
                poster={VIDEO_POSTER}
                controls
                preload="metadata"
                playsInline
              >
                Seu navegador não suporta vídeo HTML5.
              </video>
              <div className="video-placeholder">
                <div className="video-placeholder-icon"><Play size={32} fill="currentColor" /></div>
                <div className="video-placeholder-title">Vídeo institucional</div>
                <div className="video-placeholder-hint">
                  <code>/public/separi-video.mp4</code>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── FAQ ─────────── */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <h2 className="section-title">
                Respostas <span className="text-gradient">técnicas</span>
              </h2>
              <p className="text-lg max-width-text">
                Esclarecimentos sobre nosso modelo de operação, escopo de serviços e atendimento.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary>{f.q}</summary>
                  <div className="faq-item-body">{f.a}</div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── CTA FINAL ─────────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <h2 className="section-title text-white">
                Pronto para <span className="text-gradient">elevar o seu processo</span>?
              </h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                Nossa equipe de engenharia está à disposição, para orçamento detalhado,
                manutenção preventiva, revisão geral ou recondicionamento integral.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} /> Falar com Especialista
                </a>
                {isAuthenticated ? (
                  <Link to={accountHref} className="btn btn-outline-light">
                    {accountLabel} <ChevronRight size={16} />
                  </Link>
                ) : (
                  <Link to="/registro" className="btn btn-outline-light">
                    Criar conta gratuita <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
