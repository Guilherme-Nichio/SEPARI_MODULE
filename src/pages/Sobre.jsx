import { Link } from 'react-router-dom'
import {
  Target, Eye, MessageCircle, ArrowRight,
  MapPin, Phone, Mail, Briefcase, Headphones, Wrench,
  Cog, Sparkles, Heart, Shield, TrendingUp, Award, Handshake
} from 'lucide-react'
import Reveal from '../components/Reveal'
import ScrollSpyList from '../components/ScrollSpyList'
import ParallaxSection from '../components/ParallaxSection'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

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

export default function Sobre() {
  return (
    <>
      <Seo
        title="Sobre a Separi, Quem Somos | Centrífugas Industriais"
        description="Especialistas em centrífugas industriais e marítimas com sede em Indaiatuba/SP. Oficina técnica completa, equipe de campo certificada e décadas de experiência em recondicionamento e balanceamento dinâmico."
      />
      <section className="page-intro page-intro-sobre">
        <div className="container">
          <Reveal variant="fade-up">
            <nav className="sobre-hero-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link>
              <span className="sep" />
              <span>Sobre nós</span>
            </nav>
          </Reveal>

          <div className="sobre-hero-grid">
            <div>
              <Reveal variant="fade-up" delay={60}>
                <span className="sobre-hero-eyebrow">
                  <Sparkles size={14} /> Nossa essência
                </span>
              </Reveal>

              <Reveal variant="fade-up" delay={120}>
                <h1 className="sobre-hero-title">
                  Engenharia leal ao<br />
                  <span className="accent">seu processo</span>,<br />
                  não ao fabricante.
                </h1>
              </Reveal>

              <Reveal variant="fade-up" delay={180}>
                <p className="sobre-hero-lead">
                  Décadas de experiência prática a bordo de embarcações e dentro de plantas
                  industriais. A leitura técnica que só vem de quem operou, diagnosticou e
                  recondicionou centenas de centrífugas em ambientes reais de produção.
                </p>
              </Reveal>

              <Reveal variant="fade-up" delay={240}>
                <div className="sobre-hero-ctas">
                  <a href="#historia" className="btn btn-primary">
                    Conhecer a história <ArrowRight size={16} />
                  </a>
                  <a href="#valores" className="btn btn-outline-light">
                    Nossos valores
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── INTRO ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              
              <h2 className="section-title max-width-text">
                Muito mais do que um fornecedor.<br />
                <span className="text-gradient">O seu parceiro técnico global.</span>
              </h2>
              <p className="text-lg max-width-text mt-20">
                Fundada em 2018, a Separi cresceu para se tornar um fornecedor global confiável
                de peças de alta qualidade e componentes recondicionados para separadores marinhos
                e industriais.
              </p>
              <p className="text-lg max-width-text mt-20">
                Valorizamos o contacto pessoal e a expertise técnica. Por isso, todos os nossos
                engenheiros e representantes estão sempre disponíveis e prontos para manter a
                sua operação a girar sem interrupções.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── MISSÃO / VISÃO / VALORES, layout corrigido ───────── */}
      <section className="section-padding bg-subtle bp-bg">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              
              <h2 className="section-title">O que nos <span className="text-gradient">move</span></h2>
              <p className="text-lg max-width-text">
                Os princípios que garantem a excelência na Separi todos os dias.
              </p>
            </div>
          </Reveal>

          {/* Linha 1: Missão + Visão (dois cards claros equilibrados) */}
          <div className="grid-2 gap-32" style={{ marginBottom: 24 }}>
            <Reveal variant="fade-up" delay={100}>
              <div className="card bp-corners" style={{ padding: '36px 32px', height: '100%' }}>
                <div className="icon-box"><Target size={26} /></div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 12 }}>A Nossa Missão</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
                  Fornecer soluções completas em serviço, peças e equipamentos para centrífugas,
                  garantindo máxima eficiência, segurança e produtividade.
                </p>
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={200}>
              <div className="card bp-corners" style={{ padding: '36px 32px', height: '100%' }}>
                <div className="icon-box"><Eye size={26} /></div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: 12 }}>A Nossa Visão</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
                  Ser a empresa de referência em serviço e peças no Brasil e no mundo,
                  reconhecida pela excelência técnica e confiabilidade absoluta.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Linha 2: Valores (largura total, grid de pills horizontais) */}
          <Reveal variant="fade-up" delay={300}>
            <div className="split-panel panel-dark" style={{ padding: '44px 40px' }}>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 28px' }}>Os Nossos Valores</h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                position: 'relative',
                zIndex: 2
              }}>
                {values.map((v, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--r-md)',
                    padding: '20px',
                    transition: 'all 0.3s var(--ease-out)'
                  }}>
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: 10,
                      background: 'rgba(0,169,157,0.15)',
                      color: 'var(--teal-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14
                    }}>
                      {v.icon}
                    </div>
                    <div style={{ color: 'var(--teal-light)', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                      {v.title}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      {v.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── TIMELINE ───────── */}
      <section id="historia" className="section-padding relative">
        <div className="sectors-bg-pattern" />
        <div className="deco-orb teal" style={{ width: 380, height: 380, top: '15%', right: '5%' }} />

        <div className="container relative-z">
          <div className="sectors-layout">
            <Reveal variant="fade-up">
              <div className="sticky-sidebar">
                
                <h2 className="section-title">
                  A Nossa <span className="text-gradient">Evolução</span>
                </h2>
                <p className="text-lg">
                  De uma empresa local para um parceiro de serviços com atuação internacional.
                  Crescemos impulsionados pela inovação.
                </p>
              </div>
            </Reveal>

            <ScrollSpyList className="scroll-list">
              {timeline.map((t, idx) => (
                <Reveal key={idx} variant="fade-up" delay={idx * 80}>
                  <div className="spy-item">
                    <div className="spy-year">{t.year}</div>
                    <div>
                      <h4 style={{ fontSize: '1.2rem' }}>{t.title}</h4>
                      <p style={{ fontSize: '0.96rem' }}>{t.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ScrollSpyList>
          </div>
        </div>
      </section>

      {/* ───────── EQUIPA ───────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              
              <h2 className="section-title">
                Conheça a nossa <span className="text-gradient">Equipe</span>
              </h2>
              <p className="text-lg max-width-text">
                Engenheiros e técnicos altamente qualificados, dedicados a manter
                a sua operação a girar.
              </p>
            </div>
          </Reveal>

          <div className="grid-3">
            <Reveal variant="fade-up">
              <div className="team-card">
                <div className="team-photo">
                  <img
                    src="/teste.png"
                    alt="Direção Separi"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.style.removeProperty('display') }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Briefcase size={64} style={{ display: 'none' }} />
                </div>
                <div className="team-info">
                  <h4>Direção</h4>
                  <p>Hugo Rafacho</p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={100}>
              <div className="team-card">
                <div className="team-photo">
                  <img
                    src="/teste.png"
                    alt="Engenharia Separi"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.style.removeProperty('display') }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Wrench size={64} style={{ display: 'none' }} />
                </div>
                <div className="team-info">
                  <h4>Engenharia</h4>
                  <p>Técnicos Certificados</p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={200}>
              <div className="team-card">
                <div className="team-photo">
                  <img
                    src="/teste.png"
                    alt="Atendimento Separi"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.style.removeProperty('display') }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Headphones size={64} style={{ display: 'none' }} />
                </div>
                <div className="team-info">
                  <h4>Atendimento</h4>
                  <p>Suporte Técnico Especializado</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── LOCALIZAÇÃO ───────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid-2 gap-60 align-center">
            <Reveal variant="fade-right">
              <div>
                
                <h2 className="section-title">
                  Localização <span className="text-gradient">Estratégica</span>
                </h2>
                <p className="text-lg mt-20 mb-30">
                  A Separi está localizada em Indaiatuba, São Paulo. A nossa posição privilegiada
                  garante tempos de resposta rápidos para nossos clientes e facilita a logística ágil
                  de peças e equipamentos para toda a América Latina.
                </p>
                <div className="checklist">
                  <p>
                    <MapPin size={20} className="check-icon" />
                    <strong>R. Augusto Poltronieri, 179 - LT - Park Comercial de Indaiatuba, Indaiatuba - SP, 13347-443</strong>
                  </p>
                  <p>
                    <Phone size={20} className="check-icon" />
                    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                      <strong>+55 (19) 3816-7640</strong>
                    </a>
                  </p>
                  <p>
                    <Mail size={20} className="check-icon" />
                    <strong>vendas@separi.com.br</strong>
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <div className="image-frame" style={{ aspectRatio: '1/1' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.785002018803!2d-47.2140685!3d-23.1414437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8b3558832eb17%3A0xa1ea0eec405a3063!2sR.%20Augusto%20Poltronieri%2C%20179%20-%20Park%20Comercial%20de%20Indaiatuba%2C%20Indaiatuba%20-%20SP%2C%2013347-443!5e0!3m2!1spt-BR!2sbr!4v1715632420387!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', inset: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Separi"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS / NÚMEROS QUALITATIVOS */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow">O que nos diferencia</span>
              <h2 className="section-title">
                Engenharia <span className="text-gradient">de bancada</span>
              </h2>
              <p className="text-lg max-width-text">
                Décadas no chão de fábrica e a bordo de embarcações dão à Separi a leitura
                que poucos têm: o que realmente quebra primeiro em cada modelo.
              </p>
            </div>
          </Reveal>

          <div className="grid-3 gap-40">
            <Reveal variant="fade-up">
              <div className="card">
                <div className="icon-box"><Wrench size={26} /></div>
                <h4>Diagnóstico que vai fundo</h4>
                <p>
                  Cada equipamento que entra na nossa oficina passa por um protocolo de
                  inspeção criteriosa. Não trocamos peça por trocar: identificamos a causa-raiz
                  da vibração, da queda de rendimento, do desbalanceamento, do desgaste prematuro.
                </p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={100}>
              <div className="card">
                <div className="icon-box"><Cog size={26} /></div>
                <h4>Processo completo de recondicionamento</h4>
                <p>
                  Limpeza química, líquido penetrante, microusinagem, jateamento, balanceamento
                  computadorizado em dois planos, motor retificado, pintura industrial e run-in
                  contínuo. Cada etapa é documentada num relatório técnico que segue com o equipamento.
                </p>
              </div>
            </Reveal>
            <Reveal variant="fade-up" delay={200}>
              <div className="card">
                <div className="icon-box"><Shield size={26} /></div>
                <h4>Compromisso com garantia técnica</h4>
                <p>
                  Cada peça vendida e cada serviço executado sai com garantia documentada.
                  Não trabalhamos com volume, trabalhamos com confiança construída cliente
                  por cliente. É por isso que nossos clientes voltam.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <span className="eyebrow">Perguntas frequentes</span>
              <h2 className="section-title">
                As dúvidas <span className="text-gradient">mais comuns</span>
              </h2>
              <p className="text-lg max-width-text">
                Tudo que clientes em potencial costumam querer entender antes de fechar conosco.
              </p>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={100}>
            <div className="faq-list">
              <details className="faq-item">
                <summary>Há quanto tempo a Separi existe?</summary>
                <div className="faq-item-body">
                  A Separi foi fundada em 2018 com foco em serviço técnico de alta qualidade
                  para separadores. Ao longo dos anos expandimos nosso atendimento para naval,
                  alimentos, bebidas, óleo &amp; gás, biocombustíveis e mineração, e em 2023
                  inauguramos nossa atual sede tecnológica em Indaiatuba/SP.
                </div>
              </details>
              <details className="faq-item">
                <summary>Quais marcas vocês conhecem mais a fundo?</summary>
                <div className="faq-item-body">
                  Nossa engenharia tem domínio profundo de Alfa Laval (linhas LOPX, MOPX,
                  FOPX, MFPX, MMPX, MIB, MAB, MAPX, S e P), GEA Westfalia (séries OSA, OSB,
                  OSC, OSD, OSE e OSF), Tetra Pak (linha Tetra Centri) e Seital. Também
                  atendemos Pieralisi e Flottweg sob consulta.
                </div>
              </details>
              <details className="faq-item">
                <summary>Vocês atendem fora do Brasil?</summary>
                <div className="faq-item-body">
                  Sim. Atendemos toda a América Latina com regularidade e exportamos para
                  outros mercados sob demanda. Temos experiência em embarques internacionais,
                  documentação aduaneira e logística para minimizar paradas em plantas com
                  alta criticidade operacional.
                </div>
              </details>
              <details className="faq-item">
                <summary>Por que vocês dizem ser "leais ao processo, não ao fabricante"?</summary>
                <div className="faq-item-body">
                  Porque o cliente paga por confiabilidade da máquina, não pela marca dela.
                  Nossa engenharia é independente: recomendamos OEM quando faz sentido e
                  equivalente certificado quando o equivalente entrega o mesmo desempenho
                  por um valor mais justo. A decisão é sempre informada e com você no controle.
                </div>
              </details>
              <details className="faq-item">
                <summary>Vocês têm certificações?</summary>
                <div className="faq-item-body">
                  Trabalhamos seguindo as práticas técnicas dos próprios fabricantes que
                  atendemos, e atendemos rigorosamente as normas sanitárias aplicáveis a
                  cada segmento (laticínios, farmacêutica, etc.). Nossa equipe técnica tem
                  formação direta nas escolas de fabricantes como Alfa Laval e GEA.
                </div>
              </details>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="zoom-in">
            <div className="cta-card">
              <div className="cta-shape-1" />
              <div className="cta-shape-2" />
              <span className="eyebrow on-dark"><MessageCircle size={12} /> Vamos conversar</span>
              <h2 className="section-title text-white">
                Pronto para elevar <span className="text-gradient">o seu processo</span>?
              </h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                A nossa equipe de engenharia está a postos.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <MessageCircle size={18} /> Falar com Especialista
                </a>
                <Link to="/registro" className="btn btn-outline-light">
                  Ver Catálogo de Peças <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
