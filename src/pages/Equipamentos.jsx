import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Check
} from 'lucide-react'
import Reveal from '../components/Reveal'
import SectorGrid from '../components/SectorGrid'
import RemanGallery from '../components/RemanGallery'
import ImageSlot from '../components/ImageSlot'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '5519974059048'


const reconRows = [
  { label: 'Inspeção de Erosão, Lock Ring e Desgaste de Roscas',                usado: true,  revisado: true,  reman: true },
  { label: 'Polimento, Refinamento e Novas Gaxetas do Bowl',                    usado: true,  revisado: true,  reman: true },
  { label: 'Remoção de Controles Antigos e Limpeza Completa do Chassi',         usado: true,  revisado: true,  reman: true },
  { label: 'Limpeza Química e Teste de Penetração de Corante (Trincas)',        usado: false, revisado: true,  reman: true },
  { label: 'Verificação de Tolerâncias, Altura e Condição dos Discos',          usado: false, revisado: true,  reman: true },
  { label: 'Balanceamento Dinâmico Computadorizado do Bowl',                    usado: false, revisado: true,  reman: true },
  { label: 'Novos Rolamentos do Chassi, Eixos de Transmissão e Selos',          usado: false, revisado: true,  reman: true },
  { label: 'Teste Contínuo de 8 a 10 horas antes do Envio',                     usado: false, revisado: true,  reman: true },
  { label: 'Jateamento de Areia, Pintura Externa e Carcaça Interna',            usado: false, revisado: false, reman: true },
  { label: 'Reconstrução da Embreagem e Bombas Centrípetas',                    usado: false, revisado: false, reman: true },
  { label: 'Motor Retificado com Rolamentos Novos e Pintura Fresca',            usado: false, revisado: false, reman: true },
  { label: 'Novo Painel de Controle Integrado e Calibração de Água/Produto',    usado: false, revisado: false, reman: true }
]

// Os três níveis de condição, explicados (base técnica de mercado)
const reconTiers = [
  { key: 'usado',   name: 'Usado / Revisado',     sub: 'Padrão de mercado',   desc: 'Limpeza, troca de itens de desgaste óbvios e revisão básica. Não passa por inspeção completa nem por balanceamento, e bowl e chassi não são recuperados a fundo.' },
  { key: 'revisado',name: 'Revisado Separi',      sub: 'Service overhaul',    desc: 'Inspeção criteriosa do bowl, verificação de tolerâncias, troca de rolamentos, eixos e selos conforme necessidade, balanceamento dinâmico e teste de bancada, com garantia.' },
  { key: 'reman',   name: 'Remanufaturado Separi',sub: 'Como novo',           desc: 'Desmontagem total. Cada parafuso, disco, mola e válvula é inspecionado e recuperado ou trocado por peça nova. Funcionalidade, qualidade e garantia equivalentes a um equipamento OEM.' }
]

const bowls = [
  { model: 'B525, 525 H/M, 510 C/M', app: 'Sangue, Leite Quente/Frio' },
  { model: 'BRPX 213, AFPX 213, MRPX 213', app: 'Clarificador, Industrial, Leite Quente' },
  { model: '518, 618, 718', app: 'Soro, Leite Quente/Frio' },
  { model: 'MRPX 214 / 314 TGV-74', app: 'Leite Quente, Soro' },
  { model: 'MRPX 318 / 418 TGV', app: 'Soro, Leite Quente' },
  { model: 'MRPX 414 / 514 HGV', app: 'Leite Quente' },
  { model: 'SAMM 12006, MSA 100', app: 'Separador (Waster), Soro' },
  { model: 'SAMM 20006, MSA 160', app: 'Separador (Waster / Saver)' },
  { model: 'MSD 300, MSE 300', app: 'Leite Quente, Clarificador de Soro' },
  { model: 'SAMM 25006, MSA 200-01', app: 'Leite Quente, Soro' },
  { model: 'SAMR-15037, SA45-06', app: 'Clarificador Industrial' },
  { model: 'MSE 500-01-777', app: 'Leite Quente' }
]

const REMAN_BENEFITS = [
  { title: 'Garantia equivalente à OEM', desc: 'O recondicionamento é coberto por garantia equivalente à de um equipamento novo.' },
  { title: 'Desmontagem total',          desc: 'Cada parafuso, disco, mola e válvula é inspecionado e recuperado ou trocado por peça nova.' },
  { title: 'Balanceado e testado',        desc: 'Bowl rebalanceado e run-in contínuo de 8 a 10 horas antes do envio.' },
  { title: 'Entrega rápida',              desc: 'Unidades prontas em programa de entrega rápida para minimizar a parada.' }
]

const REMAN_TABS = [
  {
    key: 'separadoras',
    label: 'Separadoras',
    items: [
      { brand: 'Alfa Laval', model: 'MRPX 518 HGV', app: 'Laticínios · desnate', note: 'Separadora autolimpante para desnate e padronização, recondicionada ao padrão OEM.' },
      { brand: 'GEA Westfalia', model: 'OSC 60', app: 'Cervejaria · clarificação', note: 'Separadora de cervejaria revisada para baixa captação de O₂ e alto rendimento.' },
      { brand: 'Alfa Laval', model: 'LOPX 707', app: 'Marítimo · combustível e lubrificante', note: 'Purificador embarcado recondicionado para remoção de cat fines e água.' }
    ]
  },
  {
    key: 'clarificadoras',
    label: 'Clarificadoras',
    items: [
      { brand: 'Alfa Laval', model: 'MRPX 418 TGV', app: 'Laticínios · clarificação', note: 'Clarificadora autolimpante recuperada com novos discos, vedações e balanceamento.' },
      { brand: 'Tetra Pak', model: 'Tetra Centri C214', app: 'Bebidas · clarificação', note: 'Clarificadora de bebidas recondicionada com painel de controle integrado.' },
      { brand: 'GEA Westfalia', model: 'MSE 300', app: 'Soro · clarificação', note: 'Clarificadora de soro revisada e testada em bancada antes do envio.' }
    ]
  },
  {
    key: 'decanters',
    label: 'Decanters',
    items: [
      { brand: 'GEA Westfalia', model: 'SC 50', app: 'Mineração · desidratação', note: 'Decanter solid bowl recondicionado com foco nos componentes de maior desgaste.' },
      { brand: 'Pieralisi', model: 'FPC 25', app: 'Óleos · 3 fases', note: 'Decanter de três fases recuperado para óleos vegetais e resíduos.' },
      { brand: 'Alfa Laval', model: 'NX 418', app: 'Efluentes · sólido e líquido', note: 'Decanter recondicionado para clarificação e desidratação contínuas.' }
    ]
  }
]

const LOCACAO = [
  { title: 'Locação de bowls e rotores', desc: 'Trocamos o seu rotor por um do nosso estoque numa única visita. Você continua produzindo enquanto recondicionamos o seu aos padrões OEM.' },
  { title: 'Locação de equipamento completo', desc: 'Separadoras e clarificadoras recondicionadas em regime de locação, para picos de produção, contingência ou enquanto a sua máquina está em revisão.' },
  { title: 'Painéis e automação em comodato', desc: 'Unidades de controle e VFDs disponíveis para uso temporário, mantendo a sua linha operando durante upgrades.' },
  { title: 'Logística de ida e volta', desc: 'Cuidamos da retirada, instalação e devolução, com prazos combinados para minimizar qualquer parada da planta.' }
]

export default function Equipamentos() {
  // Scrollspy da subnav: marca o botão da seção atualmente visível.
  const [activeSec, setActiveSec] = useState('')
  useEffect(() => {
    const ids = ['novas', 'aplicacoes', 'reman-linha', 'recondicionados', 'bowls', 'automacao']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]) setActiveSec(vis[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.15, 0.4] }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  const spy = (id) => `prod-subnav-link${activeSec === id ? ' active' : ''}`

  return (
    <>
      <Seo
        title="Produtos, Centrífugas Recondicionadas, Bowls e Automação · Separi"
        description="Centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital totalmente recondicionadas. Locação de bowls, automação de controle e estoque de equipamentos disponíveis para entrega rápida na América Latina."
      />

      {/* HERO — editorial: tipografia grande + imagem com moldura, sem cards */}
      <section className="pdx-hero">
        <div className="container">
          <Reveal variant="fade-up">
            <nav className="sb-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link>
              <span>/</span>
              <span>Produtos</span>
            </nav>
          </Reveal>

          <div className="pdx-grid">
            <div className="pdx-copy">
              <Reveal variant="fade-up" delay={80}>
                <h1 className="pdx-title">
                  Separação<br />centrífuga <em>industrial.</em>
                </h1>
              </Reveal>
              <Reveal variant="fade-up" delay={140}>
                <span className="pdx-rule" aria-hidden="true" />
                <p className="pdx-lead">
                  Máquinas novas, recondicionadas, bowls e automação — em um só fornecedor.
                </p>
              </Reveal>
            </div>

            <Reveal variant="fade-up" delay={160}>
              <div className="pdx-media">
                <ImageSlot src="/produtos/hero.jpg" alt="Centrífuga industrial na oficina Separi" className="pdx-media-img" />
                <span className="pdx-media-frame" aria-hidden="true" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SUBABAS DE PRODUTOS */}
      <nav className="prod-subnav" aria-label="Seções de produtos">
        <div className="container">
          <div className="prod-subnav-track">
            <a href="#novas" className={spy('novas')}>
              Máquinas Separi
            </a>
            <Link to="/produtos/separadoras" className="prod-subnav-link">
              Separadoras
            </Link>
            <Link to="/produtos/centrifugas" className="prod-subnav-link">
              Centrífugas
            </Link>
            <a href="#aplicacoes" className={spy('aplicacoes')}>
              Segmentos atendidos
            </a>
            <a href="#reman-linha" className={spy('reman-linha')}>
              Recondicionadas
            </a>
            <a href="#bowls" className={spy('bowls')}>
              Bowls e Locação
            </a>
            <a href="#automacao" className={spy('automacao')}>
              Automação
            </a>
          </div>
        </div>
      </nav>

      {/* MÁQUINAS NOVAS — foco principal */}
      <section id="novas" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="novas-band">
              <div className="novas-band-text">
                <h2 className="section-title">Máquinas <span className="text-gradient">Separi</span></h2>
                <p className="text-lg mt-20">
                  Qualidade de fábrica, engenharia própria. Separadoras novas,
                  dimensionadas para o seu processo e entregues operando.
                </p>
                <div className="novas-band-ctas">
                  <Link to="/maquinas" className="btn btn-primary btn-lg">
                    Conhecer a linha
                  </Link>
                </div>
              </div>
              <div className="novas-band-card">
                <ImageSlot src="/produtos/ch700.png" alt="Alfa Laval CH700 nova" className="novas-band-img" />
                <div className="novas-band-card-body">
                  <strong>Alfa Laval CH700</strong>
                  <span>Clarificador industrial de alta capacidade · nova</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SEGMENTOS ATENDIDOS, grade estática (vê tudo de uma vez) */}
      <section id="aplicacoes" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Segmentos <span className="text-gradient">atendidos</span></h2>
              <p className="text-lg max-width-text">
                Abra o segmento e veja as marcas e os modelos que atendemos em cada um.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={60}>
            <SectorGrid />
          </Reveal>
        </div>
      </section>

      {/* CHAMADAS: CENTRÍFUGAS E SEPARADORAS */}
      <section id="familias" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Comece pelo <span className="text-gradient">tipo de máquina</span></h2>
              <p className="text-lg max-width-text">
                Duas arquiteturas, dois jeitos de separar. Abra a que combina com o seu processo.
              </p>
            </div>
          </Reveal>

          <div className="fam-calls">
            <Reveal variant="fade-right">
              <Link to="/produtos/centrifugas" className="fam-call">
                <div className="fam-call-media">
                  <ImageSlot src="/produtos/centrifugas-call.jpg" alt="Centrífugas e decanters" className="fam-call-img" />
                </div>
                <div className="fam-call-body">
                  <h3>Centrífugas e decanters</h3>
                  <p>Decanters solid bowl e centrífugas para sólidos em suspensão — desidratação e espessamento contínuos para alta carga de sólidos.</p>
                  <span className="fam-call-go">Ver centrífugas <ArrowRight size={16} /></span>
                </div>
              </Link>
            </Reveal>

            <Reveal variant="fade-left" delay={120}>
              <Link to="/produtos/separadoras" className="fam-call">
                <div className="fam-call-media">
                  <ImageSlot src="/produtos/separadoras-call.jpg" alt="Separadoras de discos" className="fam-call-img" />
                </div>
                <div className="fam-call-body">
                  <h3>Separadoras de discos</h3>
                  <p>Clarificação e separação líquido-líquido de alta rotação, com bowl autolimpante para desnate, recuperação e purificação.</p>
                  <span className="fam-call-go">Ver separadoras <ArrowRight size={16} /></span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* REMANUFATURADOS — por que não é "usado" */}
      <section id="remanufaturados" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">
                Não é usado, é <span className="text-gradient">recondicionado</span>
              </h2>
              <p className="text-lg max-width-text">
                Desmontada por completo, inspecionada peça por peça, rebalanceada e testada —
                com o desempenho de uma nova e histórico comprovado em planta.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={80}>
            <div className="reman-benefits">
              {REMAN_BENEFITS.map((b, i) => (
                <div className="reman-benefit" key={i}>
                  <div>
                    <strong>{b.title}</strong>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* LINHA RECONDICIONADA DISPONÍVEL */}
      <section id="reman-linha" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">Linha <span className="text-gradient">recondicionada</span> disponível</h2>
              <p className="text-lg max-width-text">
                Separadoras, clarificadoras e decanters prontos para entrega. Filtre por categoria.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <RemanGallery tabs={REMAN_TABS} whatsapp={WHATSAPP} />
          </Reveal>
        </div>
      </section>

      {/* RECONDICIONADOS — níveis e tabela */}
      <section id="recondicionados" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">
                Usado, revisado ou <span className="text-gradient">remanufaturado</span>?
              </h2>
              <p className="text-lg max-width-text">
                Veja o que cada nível inclui — do padrão de mercado ao remanufaturado Separi,
                com garantia equivalente à de um equipamento novo.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={40}>
            <div className="recon-tiers">
              {reconTiers.map((t) => (
                <div key={t.key} className={`recon-tier ${t.key === 'reman' ? 'is-best' : ''}`}>
                  <span className="recon-tier-sub">{t.sub}</span>
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="table-wrap">
              <div className="table-scroll">
                <table className="cmp-table cmp-table-3">
                  <thead>
                    <tr>
                      <th className="left">Processo de Recondicionamento</th>
                      <th>
                        Usado / Revisado<br />
                        <span className="sub">Padrão de Mercado</span>
                      </th>
                      <th>
                        Revisado Separi<br />
                        <span className="sub">Service Overhaul</span>
                      </th>
                      <th className="teal-header">
                        Remanufaturado Separi<br />
                        <span className="sub">Como Novo</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="left">{row.label}</td>
                        <td>{row.usado ? <Check className="icon-check" size={20} /> : <span className="icon-dash">—</span>}</td>
                        <td>{row.revisado ? <Check className="icon-check" size={20} /> : <span className="icon-dash">—</span>}</td>
                        <td>{row.reman ? <Check className="icon-check" size={20} /> : <span className="icon-dash">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={200}>
            <div className="text-center mt-30">
              <p className="text-lg max-width-text">
                <strong>A funcionalidade e garantia de um OEM, por uma fração do preço.</strong>{' '}
                As nossas máquinas recondicionadas são opções excelentes tanto como
                centrífugas primárias quanto equipamentos de backup.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BOWLS DE TROCA */}
      <section id="bowls" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">
                Troque o bowl. <span className="text-gradient">Não pare a linha.</span>
              </h2>
              <p className="text-lg max-width-text">
                Instalamos um bowl do nosso estoque numa única visita e levamos o seu
                para recondicionar ao padrão OEM — a produção segue girando.
              </p>
            </div>
          </Reveal>

          <div className="bowls-layout">
            <Reveal variant="fade-right">
              <div className="bowls-media-col">
                <div className="equip-image-frame bowls-frame" style={{ aspectRatio: '4/3', '--ph': 'url("/produtos/bowl.jpg")' }}>
                  <img
                    src="/produtos/bowl.jpg"
                    alt="Rotor Bowl Separi"
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="equip-image-frame-placeholder">imagem: <code>/public/produtos/bowl.jpg</code></div>
                </div>
                <div className="bowls-steps">
                  <div className="bowls-step"><span className="bowls-step-n">1</span> Trocamos o rotor por um de locação numa única visita.</div>
                  <div className="bowls-step"><span className="bowls-step-n">2</span> A sua linha volta a operar; levamos o seu rotor para a oficina.</div>
                  <div className="bowls-step"><span className="bowls-step-n">3</span> Recondicionado aos padrões OEM, fazemos a troca final.</div>
                </div>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={16} /> Consultar disponibilidade
                </a>
              </div>
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <div className="bowls-table-col">
                <h3 className="bowls-table-title">Rotores e bowls disponíveis para troca</h3>
                <div className="table-wrap">
                  <div className="table-scroll" style={{ maxHeight: 420, overflowY: 'auto' }}>
                    <table className="cmp-table" style={{ minWidth: 0 }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr>
                          <th className="teal-header left" style={{ width: '45%' }}>Centrífugas aplicáveis</th>
                          <th className="teal-header left" style={{ width: '55%' }}>Configuração / aplicação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bowls.map((bowl, idx) => (
                          <tr key={idx}>
                            <td className="left" style={{ fontSize: '0.88rem' }}>{bowl.model}</td>
                            <td className="left" style={{ fontSize: '0.88rem', color: 'var(--text-light)', fontWeight: 500 }}>{bowl.app}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LOCAÇÃO (dedicada) */}
      <section id="locacao" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <h2 className="section-title">
                Programa de <span className="text-gradient">locação</span>
              </h2>
              <p className="text-lg max-width-text">
                Mantenha a produção girando mesmo durante a manutenção. Alugamos bowls,
                equipamentos completos e automação enquanto cuidamos do seu ativo.
              </p>
            </div>
          </Reveal>

          <div className="locacao-grid">
            {LOCACAO.map((l, i) => (
              <Reveal key={i} variant="fade-up" delay={i * 80}>
                <div className="locacao-card">
                  <h3>{l.title}</h3>
                  <p>{l.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade-up" delay={120}>
            <div className="locacao-cta">
              <div className="locacao-cta-text">
                <strong>Precisa de uma janela de manutenção sem parar a linha?</strong>
                <p>Monte um plano de locação sob medida com a nossa engenharia.</p>
              </div>
              <a href={`https://wa.me/${WHATSAPP}?text=Quero%20consultar%20o%20programa%20de%20locação`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <WhatsAppIcon size={16} /> Consultar locação
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AUTOMAÇÃO E CONTROLES */}
      <section id="automacao" className="section-padding auto2">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="auto2-head">
              <h2 className="section-title">
                Automação e <span className="text-gradient">controles</span>
              </h2>
              <p>
                Atualize a tecnologia da sua centrífuga: painéis modernos e inversores
                de frequência para operar corretamente qualquer equipamento Alfa Laval,
                Tetra Pak ou Westfalia — novo ou de décadas atrás.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={80}>
            <div className="auto2-grid">
              <div className="auto2-card">
                <div
                  className="auto2-media" aria-hidden="true"
                  style={{ '--p': 'url("/produtos/vfd.jpg")' }}
                />
                <div className="auto2-body">
                  <h3>Inversores de frequência (VFD)</h3>
                  <p>Fornecemos drives Allen Bradley pré-programados em qualquer gama de potência requerida para a sua aplicação.</p>
                  <ul className="auto2-list">
                    <li><Check size={17} /> Aceleração de arranque suave</li>
                    <li><Check size={17} /> Redução dramática do consumo de corrente</li>
                    <li><Check size={17} /> Aumento extremo da vida útil do motor</li>
                  </ul>
                </div>
              </div>

              <div className="auto2-card">
                <div
                  className="auto2-media" aria-hidden="true"
                  style={{ '--p': 'url("/produtos/painel.jpg")' }}
                />
                <div className="auto2-body">
                  <h3>Painéis de controle (CLP/IHM)</h3>
                  <p>Projetamos painéis modernos que otimizam a automação e oferecem integração completa com a fábrica, acabando com as falhas de quadros desatualizados.</p>
                  <ul className="auto2-list">
                    <li><Check size={17} /> Monitoramento e diagnóstico remoto</li>
                    <li><Check size={17} /> Interface touch (IHM) intuitiva</li>
                    <li><Check size={17} /> Integração com sistemas SCADA da fábrica</li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={140}>
            <div className="auto2-strip">
              <div className="auto2-cell">
                <div>
                  <strong>Partida controlada</strong>
                  <span>Sem picos de corrente na rede</span>
                </div>
              </div>
              <div className="auto2-cell">
                <div>
                  <strong>Diagnóstico em tempo real</strong>
                  <span>Vibração, descarga e calibração</span>
                </div>
              </div>
              <div className="auto2-cell">
                <div>
                  <strong>Fábrica conectada</strong>
                  <span>Comunicação com SCADA e MES</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={180}>
            <div className="auto2-cta">
              <a href={`https://wa.me/${WHATSAPP}?text=Quero%20modernizar%20a%20automação%20da%20minha%20centrífuga`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                <WhatsAppIcon size={16} /> Modernizar minha automação
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BANNER COMPRA */}
      <section id="pecas" className="section-padding banner-dark">
        <div className="container relative-z">
          <Reveal variant="zoom-in">
            <div className="text-center" style={{ maxWidth: 800, margin: '0 auto' }}>
              <h2 className="section-title text-white">
                Compramos o seu <span className="text-gradient">equipamento usado</span>
              </h2>
              <p className="text-lg text-white-muted mt-20 mb-30">
                Tem centrífugas ou separadores (Alfa Laval, Westfalia, Tetra Pak) parados
                ou que já não estão em uso na sua fábrica? A Separi adquire máquinas usadas
                para o nosso programa de recondicionamento. Entre em contato para uma avaliação gratuita.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP}?text=Tenho%20um%20equipamento%20usado%20para%20avaliação`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppIcon size={18} /> Solicitar Avaliação de Equipamento
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center">
              <h2 className="section-title">
                Dúvidas sobre <span className="text-gradient">os equipamentos</span>
              </h2>
              <p className="text-lg max-width-text">
                As perguntas mais comuns sobre nossas centrífugas recondicionadas e bowls de locação.
              </p>
            </div>
          </Reveal>
          <Reveal variant="fade-up" delay={100}>
            <div className="faq-list">
              <details className="faq-item">
                <summary>O que está incluído numa centrífuga recondicionada Separi?</summary>
                <div className="faq-item-body">
                  Cada máquina passa pelo nosso protocolo completo de 12 etapas: limpeza
                  química, teste de penetração de corante para detecção de trincas, inspeção
                  de erosão e lock ring, verificação de tolerâncias dos discos, polimento
                  e refinamento, balanceamento dinâmico computadorizado, jateamento, pintura
                  industrial, reconstrução de embreagem e bombas centrípetas, motor retificado,
                  rolamentos novos, painel de controle integrado, e run-in contínuo de 8 a 10
                  horas antes do envio. Tudo documentado em relatório técnico.
                </div>
              </details>
              <details className="faq-item">
                <summary>Qual a garantia das máquinas recondicionadas?</summary>
                <div className="faq-item-body">
                  Cada centrífuga recondicionada sai com garantia técnica de 3 meses,
                  conforme o escopo do recondicionamento contratado. Cobrimos os componentes
                  trocados e o serviço de engenharia executado. O acompanhamento técnico
                  pós-venda é parte do nosso compromisso.
                </div>
              </details>
              <details className="faq-item">
                <summary>Vocês alugam bowls e peças?</summary>
                <div className="faq-item-body">
                  Sim. Mantemos bowls e componentes principais em estoque para locação
                  de curto prazo. É a solução para quando você precisa de uma janela de
                  manutenção sem comprar uma peça nova: alugamos enquanto o seu original
                  é recondicionado em nossa oficina.
                </div>
              </details>
              <details className="faq-item">
                <summary>Tenho um equipamento parado, vocês compram?</summary>
                <div className="faq-item-body">
                  Avaliamos sim. Adquirimos centrífugas usadas das marcas que atendemos
                  para nosso programa de recondicionamento. Mande as informações da máquina
                  (modelo, série e foto da placa de identificação) que retornamos com uma
                  avaliação técnica.
                </div>
              </details>
              <details className="faq-item">
                <summary>Como funciona o sistema de automação?</summary>
                <div className="faq-item-body">
                  Equipamos as máquinas com painéis de controle integrados modernos, que
                  fazem calibração de água e produto, monitoramento de vibração, controle
                  de descarga e diagnóstico em tempo real. É possível tanto reformar o
                  sistema de controle de uma máquina existente quanto entregar uma
                  centrífuga já recondicionada com automação atualizada.
                </div>
              </details>
              <details className="faq-item">
                <summary>Quanto tempo leva para receber uma máquina recondicionada?</summary>
                <div className="faq-item-body">
                  Depende do escopo e disponibilidade do equipamento. Para máquinas que já
                  estão em nosso estoque, o prazo é apenas o de logística. Para
                  recondicionamentos sob demanda, o prazo médio é de 30 a 60 dias úteis,
                  dependendo da complexidade. Sempre informamos a previsão antes de fechar.
                </div>
              </details>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
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
                A nossa equipa de engenharia está a postos. Cotações, peças e equipamentos.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={18} /> Falar com Especialista
                </a>
                <Link to="/registro" className="btn btn-outline-light">
                  Acessar Catálogo de Peças <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
