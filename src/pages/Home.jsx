import { Link } from 'react-router-dom'
import {
  Wrench, Settings, Package, Cog,
  ArrowRight, Check, MessageCircle,
  Beef, Building2, Wine, Beer, Ship, Leaf,
  FlaskConical, Droplets, Pickaxe, Flame, Lightbulb,
  ChevronRight, CheckCircle2,
  Truck, Globe, GraduationCap, Search,
  ClipboardCheck, FileText, Play, User as UserIcon,
  Image as ImageIcon, Award, ShieldCheck, Layers,
  Repeat, FileCheck, Microscope, Gauge, Scale, Sparkles,
  Mail, Phone, MapPin
} from 'lucide-react'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { useAuth } from '../contexts/AuthContext'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

// Vídeo institucional, solte o arquivo em /public/separi-video.mp4
const VIDEO_FILE = '/separi-video.mp4'
const VIDEO_POSTER = '/teste.png'

// Imagens dos info blocks, solte arquivos em /public/ ou troque pelos seus URLs
// Enquanto não houver imagem, o bloco mostra "...imagem" no centro
const HERO_IMG_OFICINA = ''      // foto da sua oficina
const HERO_IMG_BOWL    = ''      // foto de um bowl em recondicionamento

const CAT_COLORS = {
  alimentar:  { color: '#0891b2', bg: 'rgba(8,145,178,0.08)'  },
  maritimo:   { color: '#1e40af', bg: 'rgba(30,64,175,0.08)'  },
  energia:    { color: '#b45309', bg: 'rgba(180,83,9,0.08)'   },
  pharma:     { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  industrial: { color: '#475569', bg: 'rgba(71,85,105,0.08)'  }
}

const sectors = [
  { icon: <Beef size={26} strokeWidth={1.6} />,         title: 'Laticínios e Alimentos',     desc: 'Separação higiênica conforme normas sanitárias rigorosas para processamento de leite, creme, soro de queijo e derivados.', category: 'alimentar',  categoryLabel: 'Alimentar' },
  { icon: <Building2 size={26} strokeWidth={1.6} />,    title: 'Alimentos e Bebidas',         desc: 'Centrífugas para clarificação, recuperação e separação contínua em linhas de processamento de alta produtividade.', category: 'alimentar',  categoryLabel: 'Alimentar' },
  { icon: <Wine size={26} strokeWidth={1.6} />,         title: 'Sumos e Bebidas',             desc: 'Equipamentos e suporte técnico para produção de sucos naturais, néctares e bebidas funcionais com máxima retenção de aromas.', category: 'alimentar',  categoryLabel: 'Alimentar' },
  { icon: <Beer size={26} strokeWidth={1.6} />,         title: 'Cervejarias',                 desc: 'Separação de mosto, recuperação de leveduras e clarificação final com alto rendimento e baixo consumo energético.', category: 'alimentar',  categoryLabel: 'Alimentar' },
  { icon: <Ship size={26} strokeWidth={1.6} />,         title: 'Marinha e Naval',             desc: 'Peças OEM e serviço técnico embarcado para separadores de combustível e óleo lubrificante de motores marítimos.', category: 'maritimo',   categoryLabel: 'Marítimo' },
  { icon: <Leaf size={26} strokeWidth={1.6} />,         title: 'Biocombustíveis e Biodiesel', desc: 'Centrífugas robustas para separação contínua na produção de biodiesel a partir de óleos vegetais e gorduras residuais.', category: 'energia',    categoryLabel: 'Energia' },
  { icon: <FlaskConical size={26} strokeWidth={1.6} />, title: 'Farmacêutica e Biopharma',    desc: 'Soluções compatíveis com Boas Práticas de Fabricação (BPF/GMP) para laboratórios e plantas farmacêuticas.', category: 'pharma',     categoryLabel: 'Farma' },
  { icon: <Droplets size={26} strokeWidth={1.6} />,     title: 'Fluidos Industriais',         desc: 'Tratamento, recuperação e separação de fluidos sob condições de alta vazão, pressão e temperatura.', category: 'industrial', categoryLabel: 'Industrial' },
  { icon: <Pickaxe size={26} strokeWidth={1.6} />,      title: 'Mineração e Metais',          desc: 'Equipamentos resistentes à abrasão para concentração e desidratação de polpas minerais e tratamento de efluentes.', category: 'industrial', categoryLabel: 'Industrial' },
  { icon: <Flame size={26} strokeWidth={1.6} />,        title: 'Óleo e Gás',                  desc: 'Serviços especializados em separação para refino, exploração offshore e tratamento de produtos derivados de petróleo.', category: 'energia',    categoryLabel: 'Energia' },
  { icon: <Lightbulb size={26} strokeWidth={1.6} />,    title: 'Geração de Energia',          desc: 'Suporte a centrífugas em usinas termelétricas, biomassa e cogeração industrial em todo o ciclo do óleo de turbina.', category: 'energia',    categoryLabel: 'Energia' }
]

const services = [
  { icon: <Settings size={26} />, title: 'Manutenção Preventiva', desc: 'Inspeções programadas em campo, verificações operacionais e substituição planejada de componentes consumíveis para evitar paradas inesperadas.' },
  { icon: <Wrench size={26} />,   title: 'Revisão Geral em Oficina', desc: 'Desmontagem completa, inspeção dimensional, balanceamento dinâmico computadorizado e remontagem dentro das tolerâncias originais do fabricante.' },
  { icon: <Cog size={26} />,      title: 'Recondicionamento Total', desc: 'Restauração integral do equipamento: usinagem, jateamento, pintura industrial, motor retificado e teste contínuo de bancada antes do envio.' }
]

const workshopServices = [
  { icon: <Scale size={22} />,      title: 'Balanceamento Dinâmico',   desc: 'Balanceamento de bowls completos em balanceadora computadorizada, com correção em dois planos conforme tolerâncias OEM e ISO.', tag: 'Norma OEM/ISO' },
  { icon: <Microscope size={22} />, title: 'Inspeção Não-Destrutiva',  desc: 'Líquido penetrante para detecção de trincas, inspeção de erosão em lock ring, verificação de tolerâncias dos discos e medição de altura do conjunto.', tag: 'NDT' },
  { icon: <Gauge size={22} />,      title: 'Teste de Run-in Contínuo', desc: 'Run-in monitorado de 8 a 10 horas com líquido antes do envio, validando vibração, temperatura de mancais e vazão de descarga.', tag: 'Pré-envio' },
  { icon: <Sparkles size={22} />,   title: 'Microusinagem e Jateamento', desc: 'Microusinagem de superfícies de selagem e roscas, jateamento de areia, pintura externa e tratamento da carcaça interna.', tag: 'Restauração' },
  { icon: <Repeat size={22} />,     title: 'Programa de Bowls de Troca', desc: 'Substitua o bowl da sua máquina por um de nosso estoque enquanto recondicionamos o seu, evite paradas longas durante a revisão.', tag: 'Locação' },
  { icon: <FileCheck size={22} />,  title: 'Certificado e Garantia',   desc: 'Relatório técnico fotográfico documentando cada etapa executada, mais certificado de balanceamento e garantia de até 12 meses.', tag: 'Documentação' }
]

const features = [
  {
    icon: <Award size={22} />, title: 'Qualidade OEM ou equivalente certificada',
    desc: 'Cada componente do nosso programa é testado em bancada para atender ou superar a especificação do fabricante original. Equivalentes só entram após homologação técnica interna.',
    href: '/equipamentos#estoque', linkLabel: 'Ver catálogo'
  },
  {
    icon: <Truck size={22} />, title: 'Entrega rápida na América Latina',
    desc: 'Estoque consolidado em Indaiatuba/SP, com logística estruturada para minimizar o tempo de parada da planta. Envio expresso para todo o Brasil e exportação sob demanda.',
    href: '/registro', linkLabel: 'Solicitar cotação'
  },
  {
    icon: <Globe size={22} />, title: 'Cobertura completa de marcas',
    desc: 'Atendemos todas as gerações de Alfa Laval, GEA Westfalia, Tetra Pak e Seital, das séries clássicas (LOPX, OSA) às mais modernas (séries S/P, OSF).',
    href: '/sobre', linkLabel: 'Marcas atendidas'
  },
  {
    icon: <GraduationCap size={22} />, title: 'Engenharia técnica especializada',
    desc: 'Equipe de engenheiros com formação direta nas escolas dos fabricantes, com experiência prática em diagnóstico, recondicionamento e supervisão de comissionamento.',
    href: '/servicos', linkLabel: 'Conhecer serviços'
  }
]

const process = [
  { n: '01', title: 'Você cadastra sua máquina',  desc: 'Modelo, número de série e foto da placa de identificação. Cadastro gratuito, sem compromisso.', icon: <Settings size={22} /> },
  { n: '02', title: 'Nossa engenharia valida',    desc: 'Confirmamos compatibilidade técnica e liberamos um catálogo exclusivo para a sua máquina.', icon: <Search size={22} /> },
  { n: '03', title: 'Você cota peças e kits',     desc: 'Monte sua cotação peça por peça ou escolha kits prontos pré-aprovados para o seu modelo.', icon: <ClipboardCheck size={22} /> },
  { n: '04', title: 'Recebe orçamento técnico',   desc: 'Resposta com preço, prazo de entrega e plano de manutenção sugerido em poucos dias úteis.', icon: <FileText size={22} /> }
]

const faqs = [
  {
    q: 'Quais marcas e gerações de centrífuga a Separi atende?',
    a: 'Operamos com todas as gerações comerciais de Alfa Laval (séries LOPX, MOPX, FOPX, MFPX, MMPX, MIB, MAB, MAPX, S e P), GEA Westfalia (séries OSA, OSB, OSC, OSD, OSE e OSF) e Tetra Pak (linha Tetra Centri, incluindo H214). Também fornecemos suporte técnico e peças para Seital e atendemos máquinas Pieralisi e Flottweg sob consulta técnica prévia.'
  },
  {
    q: 'Como funciona o processo de cotação de peças no portal?',
    a: 'O cadastro de conta no portal é gratuito. Após o cadastro inicial, o cliente registra cada centrífuga com modelo, número de série e fotografia da placa de identificação. Nossa engenharia valida tecnicamente o cadastro em poucos dias úteis e libera o catálogo restrito de peças e kits compatíveis. A partir desse momento, o cliente monta sua cotação no portal e nossa equipe comercial retorna com proposta detalhada contendo preço, prazo e disponibilidade.'
  },
  {
    q: 'Vocês executam manutenção em campo nas instalações do cliente?',
    a: 'Sim. Dispomos de equipe técnica certificada que se desloca à planta do cliente para diagnóstico, manutenção preventiva, revisão geral, substituição de componentes críticos, instalação e comissionamento de equipamentos. Os técnicos têm formação direta nas escolas dos fabricantes que atendemos, e cada visita é documentada em relatório técnico com fotografias e checklist completo de pontos inspecionados.'
  },
  {
    q: 'Vocês trabalham com peças OEM, equivalentes ou ambas?',
    a: 'Nosso programa de suprimento opera com ambas as categorias. Para componentes críticos, bowls, sistemas de transmissão, partes rotativas estruturais, utilizamos exclusivamente peças OEM ou equivalentes homologados internamente após testes de bancada. Para itens consumíveis de menor criticidade, oferecemos equivalentes certificados quando estes apresentam desempenho equivalente a um custo mais competitivo. A origem de cada item é sempre informada de forma transparente na proposta comercial.'
  },
  {
    q: 'O que está incluído no recondicionamento de uma centrífuga Separi?',
    a: 'Cada equipamento submetido ao programa de recondicionamento passa por protocolo técnico estruturado: limpeza química, inspeção não-destrutiva (líquido penetrante para trincas), verificação dimensional do bowl e disc stack, microusinagem das superfícies de selagem, balanceamento dinâmico computadorizado em dois planos conforme tolerâncias OEM e ISO, jateamento e pintura industrial, retífica do motor, substituição completa de rolamentos e selos, integração de painel de controle e teste contínuo de bancada (run-in) entre 8 e 10 horas. Cada etapa é documentada em relatório fotográfico que segue com o equipamento.'
  },
  {
    q: 'Qual a abrangência geográfica de atendimento da Separi?',
    a: 'Nossa sede técnica e oficina ficam em Indaiatuba/SP, com cobertura regular de atendimento em todo o território brasileiro e em diversos países da América Latina. Atendemos sob demanda outros mercados internacionais, contando com equipe especializada em embarques internacionais, documentação aduaneira e logística para vessels em rota. A localização privilegiada da nossa sede facilita o envio expresso de peças para minimizar paradas em operações de alta criticidade.'
  },
  {
    q: 'Qual a garantia oferecida pelos serviços e equipamentos?',
    a: 'Cada serviço executado e cada equipamento entregue acompanha garantia técnica formal. Revisões em oficina possuem cobertura padrão de até seis meses sobre os componentes substituídos. Centrífugas integralmente recondicionadas são entregues com garantia de até doze meses, condicionada à utilização dentro dos parâmetros operacionais recomendados. Acompanhamento técnico pós-entrega é parte integrante do compromisso da Separi com cada cliente.'
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

// Componente helper para placeholder visual (caso imagem não exista)
function InfoBlockVisual({ src, alt, placeholderTitle, placeholderHint }) {
  return (
    <div className="info-block-visual">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : null}
      {/* Placeholder por baixo da imagem, só aparece se a imagem falhar */}
      <div className="info-block-visual-placeholder">...imagem</div>
    </div>
  )
}

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth()
  const accountHref = isAdmin ? '/admin' : '/perfil'
  const accountLabel = isAdmin ? 'Painel administrativo' : 'Ir para minha conta'

  return (
    <>
      <Seo
        title="Separi, Peças, Serviços e Equipamentos para Centrífugas Industriais"
        description="Especialista em peças OEM, recondicionamento, balanceamento dinâmico e manutenção para centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital."
        jsonLd={homeJsonLd}
      />

      {/* ─────────── HERO ─────────── */}
      <section className="hero-v6">
        <div className="hero-v6-bg-grid" />
        <div className="hero-v6-bg-glow" />
        <div className="hero-v6-bg-glow b" />

        <div className="container">
          <div className="hero-v6-grid">

            <div>
              <Reveal variant="fade-up">
                <h1 className="hero-v6-title">
                  Separamos<br />
                  o melhor<br />
                  <span className="hero-v6-title-accent">do resto.</span>
                </h1>
              </Reveal>

              <Reveal variant="fade-up" delay={120}>
                <p className="hero-v6-lead">
                  Especialistas em peças, recondicionamento e serviço técnico para centrífugas
                  industriais e marítimas das principais marcas globais. Operamos com lealdade
                  ao seu processo, não ao fabricante do equipamento.
                </p>
              </Reveal>

              <Reveal variant="fade-up" delay={220}>
                <div className="hero-v6-ctas">
                  {isAuthenticated ? (
                    <Link to={accountHref} className="btn btn-primary btn-lg">
                      <UserIcon size={18} /> {accountLabel}
                    </Link>
                  ) : (
                    <Link to="/registro" className="btn btn-primary btn-lg">
                      <UserIcon size={18} /> Criar conta gratuita
                    </Link>
                  )}
                  <Link to="/equipamentos" className="btn btn-outline-light btn-lg">
                    Ver Equipamentos <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal variant="fade-left" delay={200}>
              <div className="hero-v6-stage">
                <div className="hero-v6-stage-glow" />
                <div className="hero-v6-centrifuge" aria-hidden="true">
                  <span className="hcf-ring hcf-ring-1" />
                  <span className="hcf-ring hcf-ring-2" />
                  <span className="hcf-sweep" />
                  <span className="hcf-ring hcf-ring-3" />
                  <span className="hcf-core">
                    <span className="hcf-core-disc" />
                    <span className="hcf-core-disc d2" />
                    <span className="hcf-core-dot" />
                  </span>
                  <span className="hcf-orbit hcf-orbit-a"><i /></span>
                  <span className="hcf-orbit hcf-orbit-b"><i /></span>
                  <span className="hcf-orbit hcf-orbit-c"><i /></span>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ─────────── FEATURE GRID ─────────── */}
      <section className="section-padding bg-white" style={{ paddingTop: 'clamp(80px, 10vw, 130px)' }}>
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="info-block-eyebrow">Por que Separi</span>
              <h2 className="section-title">
                Especialistas em separação <span className="text-gradient">desde a primeira peça</span>
              </h2>
              <p className="text-lg max-width-text">
                Programa técnico completo para manter a sua centrífuga operando dentro das tolerâncias originais, hoje e nas próximas décadas.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={120}>
            <div className="feature-grid-v2">
              {features.map((f, i) => (
                <div className="feature-grid-v2-cell" key={i}>
                  <div className="feature-grid-v2-icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                  <Link to={f.href} className="feature-grid-v2-link">
                    {f.linkLabel} <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── INFO BLOCK 1, Sobre + imagem oficina ─────────── */}
      <section className="info-block">
        <div className="container">
          <div className="info-block-grid">
            <Reveal variant="fade-right">
              <div>
                <span className="info-block-eyebrow">Quem somos</span>
                <h2 className="info-block-title">
                  Leais ao seu <span className="text-gradient">processo</span>,<br />
                  não ao fabricante.
                </h2>
                <p className="info-block-lead">
                  Engenharia formada nos chãos de fábrica das principais indústrias do país e a bordo de embarcações comerciais.
                  A leitura técnica que só vem de décadas operando em ambientes reais, laticínios, cervejarias,
                  refinarias, motores marítimos e plantas de biodiesel.
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
              <InfoBlockVisual
                src={HERO_IMG_OFICINA}
                alt="Oficina Separi em Indaiatuba"
                placeholderTitle="Foto da oficina técnica"
                placeholderHint="/public/separi-oficina.jpg"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────── PROCESS, passo a passo ─────────── */}
      <section className="process-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="process-head">
              <span className="info-block-eyebrow">Como funciona</span>
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
                  <div className="process-step-circle">{p.n}</div>
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
              <InfoBlockVisual
                src={HERO_IMG_BOWL}
                alt="Bowl em processo de recondicionamento"
                placeholderTitle="Foto de bowl em recondicionamento"
                placeholderHint="/public/separi-bowl.jpg"
              />
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <div>
                <span className="info-block-eyebrow">Catálogo de peças</span>
                <h2 className="info-block-title">
                  Estoque consolidado,<br />
                  <span className="text-gradient">entrega que respeita o seu prazo.</span>
                </h2>
                <p className="info-block-lead">
                  Mantemos disponíveis em nossa sede técnica os componentes que historicamente apresentam maior taxa de
                  desgaste, bowls, partes de transmissão, kits de serviço, vedações, sensores e unidades de controle ,
                  para que sua planta não fique aguardando importação no momento crítico.
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
              <span className="info-block-eyebrow">Serviços</span>
              <h2 className="section-title">
                Tudo que <span className="text-gradient">mantém sua operação</span>
              </h2>
              <p className="text-lg max-width-text">
                Da manutenção preventiva em campo ao recondicionamento integral em nossa oficina.
              </p>
            </div>
          </Reveal>

          <div className="grid-3">
            {services.map((s, idx) => (
              <Reveal key={idx} variant="fade-up" delay={idx * 120}>
                <div className="card">
                  <div className="icon-box">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade-up" delay={200}>
            <div className="text-center mt-50">
              <Link to="/servicos" className="btn btn-outline">
                Ver todos os serviços <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── WORKSHOP / OFICINA (NOVO) ─────────── */}
      <section className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="info-block-eyebrow">Oficina técnica</span>
              <h2 className="section-title">
                Trabalho de <span className="text-gradient">precisão</span>, etapa por etapa
              </h2>
              <p className="text-lg max-width-text">
                Cada equipamento que entra em nossa oficina segue um protocolo técnico estruturado e auditável.
              </p>
            </div>
          </Reveal>

          <div className="workshop-grid">
            {workshopServices.map((w, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 60}>
                <div className="workshop-card">
                  <div className="workshop-card-icon">{w.icon}</div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                  <span className="workshop-card-tag">{w.tag}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── SETORES ─────────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="info-block-eyebrow">Setores atendidos</span>
              <h2 className="section-title">
                Onde <span className="text-gradient">a separação importa</span>
              </h2>
              <p className="text-lg max-width-text">
                Soluções técnicas dimensionadas para a realidade operacional de cada indústria.
              </p>
            </div>
          </Reveal>

          <div className="sectors-v2-grid">
            {sectors.map((s, idx) => {
              const cat = CAT_COLORS[s.category] || CAT_COLORS.industrial
              return (
                <Reveal key={idx} variant="fade-up" delay={idx * 40}>
                  <div className="sector-v2" style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}>
                    <span className="sector-v2-cat-tag">{s.categoryLabel}</span>
                    <div className="sector-v2-icon-wrap">{s.icon}</div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                    <span className="sector-v2-foot">
                      Saiba mais <ArrowRight size={12} />
                    </span>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal variant="fade-up" delay={200}>
            <div className="cta-inline">
              <div className="cta-inline-text">
                <strong>O seu setor não está listado?</strong>
                <p>
                  Atendemos diversas outras indústrias mediante consulta técnica prévia.
                  Entre em contato com nossa equipe de engenharia para uma avaliação personalizada.
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={16} /> Falar com especialista
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── FAQ ─────────── */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <span className="info-block-eyebrow">Perguntas frequentes</span>
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

      {/* ─────────── VIDEO INSTITUCIONAL ─────────── */}
      <section className="video-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="video-head">
              <span className="info-block-eyebrow">Conheça a Separi</span>
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
                  <MessageCircle size={18} /> Falar com Especialista
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
