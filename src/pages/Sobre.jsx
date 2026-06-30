import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight,
  MapPin, Phone, Mail, Briefcase, Headphones, Wrench,
  Cog, Heart, Shield, TrendingUp, Award, Handshake, Check
} from 'lucide-react'
import Reveal from '../components/Reveal'
import ValuesCycle from '../components/ValuesCycle'
import BrandWordCycle from '../components/BrandWordCycle'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

const facts = [
  { k: '2018', v: 'ano de fundação' },
  { k: 'Indaiatuba/SP', v: 'sede técnica e oficina' },
  { k: 'América Latina', v: 'cobertura de atendimento' },
  { k: '4 marcas', v: 'Alfa Laval · GEA · Tetra Pak · Seital' }
]

const timeline = [
  { year: '2018', title: 'Fundação da Separi', desc: 'A Separi foi fundada como uma empresa focada em serviço de alta qualidade para separadores e suporte técnico para a indústria naval e industrial.' },
  { year: '2020', title: 'Expansão de Serviços', desc: 'Abertura de novos segmentos de atuação e expansão da nossa oficina, ampliando o atendimento para indústrias de laticínios, cervejarias e óleo/gás.' },
  { year: '2023', title: 'Sede Tecnológica em Indaiatuba', desc: 'Mudança para uma estrutura moderna e totalmente equipada, permitindo serviços avançados como balanceamento dinâmico de rotores num só lugar.' },
  { year: 'Hoje', title: 'Atuação Global & Inovação', desc: 'Consolidação do envio internacional de peças de alta precisão e planeamento para a fabricação e venda de equipamentos proprietários Separi.' }
]

const values = [
  { icon: <Handshake size={20} />, title: 'Atendimento', sub: 'O cliente sempre em primeiro lugar.' },
  { icon: <Heart size={20} />, title: 'Respeito', sub: 'Relações transparentes e éticas.' },
  { icon: <TrendingUp size={20} />, title: 'Melhoria', sub: 'Sempre à procura de fazer melhor.' },
  { icon: <Shield size={20} />, title: 'Integridade', sub: 'Agimos com honestidade em tudo.' },
  { icon: <Award size={20} />, title: 'Confiança', sub: 'Construída com resultados.' }
]

// Equipe — troque a foto pelo arquivo indicado em `img`
const team = [
  { icon: <Briefcase size={26} />, role: 'Direção', name: 'Hugo Rafacho', img: '/public/equipe/direcao.jpg' },
  { icon: <Wrench size={26} />, role: 'Engenharia', name: 'Técnicos Certificados', img: '/public/equipe/engenharia.jpg' },
  { icon: <Headphones size={26} />, role: 'Atendimento', name: 'Suporte Técnico Especializado', img: '/public/equipe/atendimento.jpg' }
]

const edges = [
  { icon: <Wrench size={24} />, tag: 'Causa-raiz, não sintoma', title: 'Diagnóstico que vai fundo', desc: 'Cada equipamento que entra na nossa oficina passa por um protocolo de inspeção criteriosa. Não trocamos peça por trocar: identificamos a causa-raiz da vibração, da queda de rendimento, do desbalanceamento, do desgaste prematuro.' },
  { icon: <Cog size={24} />, tag: '8 etapas documentadas', title: 'Recondicionamento completo', desc: 'Limpeza química, líquido penetrante, microusinagem, jateamento, balanceamento computadorizado em dois planos, motor retificado, pintura industrial e run-in contínuo. Cada etapa documentada num relatório técnico.' },
  { icon: <Shield size={24} />, tag: 'Garantia de 3 meses', title: 'Garantia técnica', desc: 'Cada peça vendida e cada serviço executado sai com garantia documentada. Não trabalhamos com volume, trabalhamos com confiança construída cliente por cliente. É por isso que nossos clientes voltam.' }
]

const faqs = [
  { q: 'Há quanto tempo a Separi existe?', a: 'A Separi foi fundada em 2018 com foco em serviço técnico de alta qualidade para separadores. Ao longo dos anos expandimos nosso atendimento para naval, alimentos, bebidas, óleo & gás, biocombustíveis e mineração, e em 2023 inauguramos nossa atual sede tecnológica em Indaiatuba/SP.' },
  { q: 'Quais marcas vocês conhecem mais a fundo?', a: 'Nossa engenharia tem domínio profundo de Alfa Laval (linhas LOPX, MOPX, FOPX, MFPX, MMPX, MIB, MAB, MAPX, S e P), GEA Westfalia (séries OSA, OSB, OSC, OSD, OSE e OSF), Tetra Pak (linha Tetra Centri) e Seital. Também atendemos Pieralisi e Flottweg sob consulta.' },
  { q: 'Vocês atendem fora do Brasil?', a: 'Sim. Atendemos toda a América Latina com regularidade e exportamos para outros mercados sob demanda. Temos experiência em embarques internacionais, documentação aduaneira e logística para minimizar paradas em plantas com alta criticidade operacional.' },
  { q: 'Por que vocês dizem ser "leais ao processo, não ao fabricante"?', a: 'Porque o cliente paga por confiabilidade da máquina, não pela marca dela. Nossa engenharia é independente: recomendamos OEM quando faz sentido e equivalente certificado quando o equivalente entrega o mesmo desempenho por um valor mais justo. A decisão é sempre informada e com você no controle.' },
  { q: 'Vocês têm certificações?', a: 'Trabalhamos seguindo as práticas técnicas dos próprios fabricantes que atendemos, e atendemos rigorosamente as normas sanitárias aplicáveis a cada segmento (laticínios, farmacêutica, etc.). Nossa equipe técnica tem formação direta nas escolas de fabricantes como Alfa Laval e GEA.' }
]

export default function Sobre() {
  return (
    <div className="sobre-page">
      <Seo
        title="Sobre a Separi, Quem Somos | Centrífugas Industriais"
        description="Especialistas em centrífugas industriais e marítimas com sede em Indaiatuba/SP. Oficina técnica completa, equipe de campo certificada e décadas de experiência em recondicionamento e balanceamento dinâmico."
      />

      {/* ───────── HERO ───────── */}
      <section className="sb-hero sb-hero-solo">
        <div className="sb-hero-grid-bg" aria-hidden="true" />
        <div className="container sb-hero-inner">
          <div className="sb-hero-text">
            <nav className="sb-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link><span>/</span><span>Sobre</span>
            </nav>
            <Reveal variant="fade-up">
              <h1 className="sb-hero-title">
                Engenharia leal ao <span className="text-gradient">seu processo</span>,
                não ao fabricante.
              </h1>
            </Reveal>
            <Reveal variant="fade-up" delay={80}>
              <p className="sb-hero-lead">
                Décadas de experiência prática a bordo de embarcações e dentro de plantas
                industriais. A leitura técnica que só vem de quem operou, diagnosticou e
                recondicionou centenas de centrífugas em ambientes reais de produção.
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={140}>
              <div className="sb-hero-ctas">
                <a href="#historia" className="btn btn-primary btn-lg">Conhecer a história <ArrowRight size={16} /></a>
                <a href="#valores" className="btn btn-outline btn-lg">Nossos valores</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── MANIFESTO ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="sb-manifesto">
              <h2 className="section-title">
                Muito mais do que um fornecedor.<br />
                <span className="text-gradient">O seu parceiro técnico global.</span>
              </h2>
              <div className="sb-manifesto-cols">
                <p>
                  Fundada em 2018, a Separi cresceu para se tornar um fornecedor global confiável
                  de peças de alta qualidade e componentes recondicionados para separadores marinhos
                  e industriais.
                </p>
                <p>
                  Valorizamos o contacto pessoal e a expertise técnica. Por isso, todos os nossos
                  engenheiros e representantes estão sempre disponíveis e prontos para manter a
                  sua operação a girar sem interrupções.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── MISSÃO / VISÃO ───────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <div className="sb-mv2">
            <Reveal variant="fade-right">
              <div className="sb-mv2-brand">
                <BrandWordCycle />
                <p className="sb-mv2-brand-sub">
                  Um nome que carrega o que fazemos: separar o essencial do supérfluo
                  e entregar soluções em que a sua operação pode confiar.
                </p>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={120}>
              <div className="sb-mv2-content">
                <div className="sb-mv2-item">
                  <span className="sb-mv2-tag">Missão</span>
                  <p>
                    Fornecer soluções completas em serviço, peças e equipamentos para centrífugas,
                    garantindo máxima eficiência, segurança e produtividade.
                  </p>
                </div>
                <span className="sb-mv2-divider" aria-hidden="true" />
                <div className="sb-mv2-item">
                  <span className="sb-mv2-tag">Visão</span>
                  <p>
                    Ser a empresa de referência em serviço e peças no Brasil e no mundo,
                    reconhecida pela excelência técnica e confiabilidade absoluta.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── VALORES (ciclo) ───────── */}
      <section id="valores" className="sb-values-section">
        <div className="sb-values-bg" aria-hidden="true" />
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title text-white">Os nossos <span className="text-gradient">valores</span></h2>
              <p className="text-lg sb-values-lead">
                Cinco princípios que funcionam em ciclo — cada um conduz ao próximo
                e sustenta tudo o que fazemos.
              </p>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={120}>
            <ValuesCycle values={values} />
          </Reveal>
        </div>
      </section>

      {/* ───────── TIMELINE ───────── */}
      <section id="historia" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">A nossa <span className="text-gradient">evolução</span></h2>
              <p className="text-lg max-width-text">
                De uma empresa local para um parceiro de serviços com atuação internacional.
              </p>
            </div>
          </Reveal>
          <div className="sb-timeline">
            {timeline.map((t, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 80}>
                <div className="sb-tl-item">
                  <div className="sb-tl-marker"><span /></div>
                  <div className="sb-tl-card">
                    <span className="sb-tl-year">{t.year}</span>
                    <h4>{t.title}</h4>
                    <p>{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── EQUIPE ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Conheça a nossa <span className="text-gradient">equipe</span></h2>
              <p className="text-lg max-width-text">Engenheiros e técnicos qualificados, dedicados a manter a sua operação girando.</p>
            </div>
          </Reveal>
          <div className="sb-team">
            {team.map((m, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 90}>
                <div className="sb-team-card">
                  <div className="sb-team-media">
                    <span className="sb-team-icon">{m.icon}</span>
                    <span className="sb-team-path">imagem: <code>{m.img}</code></span>
                  </div>
                  <div className="sb-team-info">
                    <h4>{m.role}</h4>
                    <p>{m.name}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── DIFERENCIAIS ───────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Engenharia <span className="text-gradient">de bancada</span></h2>
              <p className="text-lg max-width-text">
                Décadas no chão de fábrica e a bordo de embarcações dão à Separi a leitura
                que poucos têm: o que realmente quebra primeiro em cada modelo.
              </p>
            </div>
          </Reveal>
          <div className="sb-edges">
            {edges.map((e, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 100}>
                <div className="sb-edge">
                  <span className="sb-edge-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sb-edge-icon">{e.icon}</span>
                  <h4>{e.title}</h4>
                  <p>{e.desc}</p>
                  <span className="sb-edge-bar" aria-hidden="true" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── LOCALIZAÇÃO ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="sb-local">
            <Reveal variant="fade-right">
              <div className="sb-local-text">
                <h2 className="section-title">
                  Localização <span className="text-gradient">estratégica</span>
                </h2>
                <p className="text-lg mt-20 mb-30">
                  A Separi está localizada em Indaiatuba, São Paulo. A nossa posição privilegiada
                  garante tempos de resposta rápidos e facilita a logística ágil de peças e
                  equipamentos para toda a América Latina.
                </p>
                <ul className="sb-contact">
                  <li><span className="sb-contact-ic"><MapPin size={18} /></span>R. Augusto Poltronieri, 179 - LT - Park Comercial de Indaiatuba, Indaiatuba - SP, 13347-443</li>
                  <li><span className="sb-contact-ic"><Phone size={18} /></span><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">+55 (19) 3816-7640</a></li>
                  <li><span className="sb-contact-ic"><Mail size={18} /></span>vendas@separi.com.br</li>
                </ul>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={120}>
              <div className="sb-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.785002018803!2d-47.2140685!3d-23.1414437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8b3558832eb17%3A0xa1ea0eec405a3063!2sR.%20Augusto%20Poltronieri%2C%20179%20-%20Park%20Comercial%20de%20Indaiatuba%2C%20Indaiatuba%20-%20SP%2C%2013347-443!5e0!3m2!1spt-BR!2sbr!4v1715632420387!5m2!1spt-BR!2sbr"
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Separi"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <h2 className="section-title">As dúvidas <span className="text-gradient">mais comuns</span></h2>
              <p className="text-lg max-width-text">Tudo que clientes em potencial costumam querer entender antes de fechar conosco.</p>
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

      {/* ───────── CTA ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <h2 className="section-title text-white">
                Pronto para elevar <span className="text-gradient">o seu processo</span>?
              </h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                A nossa equipe de engenharia está a postos.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} /> Falar com Especialista
                </a>
                <Link to="/registro" className="btn btn-outline-light">
                  Ver Catálogo de Peças <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
