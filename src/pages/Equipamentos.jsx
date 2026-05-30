import { Link } from 'react-router-dom'
import {
  Package, MessageCircle, ArrowRight,
  Check, Cpu, RotateCw, RefreshCw,
  TrendingUp, Sparkles, Cog
} from 'lucide-react'
import Reveal from '../components/Reveal'
import ParallaxSection from '../components/ParallaxSection'
import Seo from '../components/Seo'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

const reconRows = [
  { label: 'Limpeza Química e Teste de Penetração de Corante (Trincas)', separi: true, mercado: false },
  { label: 'Inspeção de Erosão, Lock Ring e Desgaste de Roscas', separi: true, mercado: true },
  { label: 'Verificação de Tolerâncias, Altura e Condição dos Discos', separi: true, mercado: false },
  { label: 'Polimento, Refinamento e Novas Gaxetas do Bowl', separi: true, mercado: true },
  { label: 'Balanceamento Dinâmico Computadorizado do Bowl', separi: true, mercado: false },
  { label: 'Remoção de Controles Antigos e Limpeza Completa do Chassi', separi: true, mercado: true },
  { label: 'Jateamento de Areia, Pintura Externa e Carcaça Interna', separi: true, mercado: false },
  { label: 'Reconstrução da Embreagem e Bombas Centrípetas', separi: true, mercado: false },
  { label: 'Motor Retificado com Rolamentos Novos e Pintura Fresca', separi: true, mercado: false },
  { label: 'Novos Rolamentos do Chassi, Eixos de Transmissão e Selos', separi: true, mercado: true },
  { label: 'Novo Painel de Controle Integrado e Calibração de Água/Produto', separi: true, mercado: false },
  { label: 'Teste Contínuo (Run-in) de 8 a 10 horas antes do Envio', separi: true, mercado: false }
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

const stock = [
  {
    badge: 'Novidade',
    badgeStyle: { background: 'var(--teal-dark)' },
    title: 'Alfa Laval CH700',
    serie: '#4205389',
    desc: 'Clarificador Industrial Auto-Limpante de Alta Capacidade. Nova, nunca foi operada.'
  },
  {
    badge: 'Recondicionada',
    badgeStyle: { background: 'var(--grey-dark)' },
    title: 'HMRPX 714 HGV',
    serie: '#4021550',
    desc: 'Separador Auto-Limpante. Alta Eficiência de Desnatação e Qualidade Consistente de Creme.'
  },
  {
    badge: 'Recondicionada',
    badgeStyle: { background: 'var(--grey-dark)' },
    title: 'DMRPX 618 HGV',
    serie: '#4081307',
    desc: 'Clarificador Hermético Auto-Limpante de Alta Capacidade. Reconstruído aos padrões OEM.'
  }
]

export default function Equipamentos() {
  return (
    <>
      <Seo
        title="Equipamentos, Centrífugas Recondicionadas, Bowls e Automação · Separi"
        description="Centrífugas Alfa Laval, GEA Westfalia, Tetra Pak e Seital totalmente recondicionadas. Locação de bowls, automação de controle e estoque de equipamentos disponíveis para entrega rápida na América Latina."
      />
      {/* HERO - Showcase */}
      <section className="page-intro page-intro-equipamentos">
        <div className="container">
          <Reveal variant="fade-up">
            <nav className="equip-hero-crumbs" aria-label="breadcrumb">
              <Link to="/">Início</Link>
              <span className="sep" />
              <span className="current">Equipamentos</span>
            </nav>
          </Reveal>

          <div className="equip-hero-grid">
            <div>
              <Reveal variant="fade-up" delay={60}>
                <span className="equip-hero-eyebrow">
                  <Package size={14} /> Programa de equipamentos
                </span>
              </Reveal>

              <Reveal variant="fade-up" delay={120}>
                <h1 className="equip-hero-title">
                  Centrífugas<br />
                  como <em>novas</em>,<br />
                  pelo valor justo.
                </h1>
              </Reveal>

              <Reveal variant="fade-up" delay={180}>
                <p className="equip-hero-lead">
                  Recondicionamento integral aos padrões OEM, programa de bowls de troca para evitar
                  paradas longas, automação moderna e estoque consolidado de equipamentos prontos
                  para entrega imediata na América Latina.
                </p>
              </Reveal>

              <Reveal variant="fade-up" delay={240}>
                <div className="equip-hero-ctas">
                  <a href="#recondicionados" className="btn btn-primary btn-lg">
                    Ver linha recondicionada <ArrowRight size={16} />
                  </a>
                  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg">
                    <MessageCircle size={16} /> Consultar disponibilidade
                  </a>
                </div>
              </Reveal>

              <Reveal variant="fade-up" delay={300}>
                <div className="equip-hero-brands">
                  <span className="equip-hero-brands-label">Atendemos:</span>
                  <div className="equip-hero-brands-list">
                    <span>Alfa Laval</span>
                    <span>GEA Westfalia</span>
                    <span>Tetra Pak</span>
                    <span>Seital</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal variant="fade-left" delay={220}>
              <div className="equip-hero-showcase">
                <h2 className="equip-hero-showcase-title">Linha Recondicionada</h2>
                <p className="equip-hero-showcase-sub">
                  Centrífugas com restauração completa em oficina, motor retificado, balanceamento
                  dinâmico computadorizado e garantia técnica.
                </p>

                <div className="equip-hero-showcase-specs">
                  <div className="equip-hero-showcase-spec">
                    <div className="equip-hero-showcase-spec-label">Padrão</div>
                    <div className="equip-hero-showcase-spec-value">OEM</div>
                  </div>
                  <div className="equip-hero-showcase-spec">
                    <div className="equip-hero-showcase-spec-label">Garantia</div>
                    <div className="equip-hero-showcase-spec-value">Até 12 meses</div>
                  </div>
                  <div className="equip-hero-showcase-spec">
                    <div className="equip-hero-showcase-spec-label">Teste</div>
                    <div className="equip-hero-showcase-spec-value">Run-in 8h+</div>
                  </div>
                  <div className="equip-hero-showcase-spec">
                    <div className="equip-hero-showcase-spec-label">Entrega</div>
                    <div className="equip-hero-showcase-spec-value">América Latina</div>
                  </div>
                </div>

                <a href="#recondicionados" className="equip-hero-showcase-cta">
                  Ver linha completa <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RECONDICIONADOS */}
      <section id="recondicionados" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow"><Sparkles size={14} /> Como Novo</span>
              <h2 className="section-title">
                Equipamentos <span className="text-gradient">Recondicionados</span>
              </h2>
              <p className="text-lg max-width-text">
                Cada equipamento passa por um processo rigoroso de 12 etapas. Veja por que
                a Separi entrega "como novo" enquanto o padrão do mercado entrega apenas "revisado".
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={50}>
            <div className="equip-image-frame" style={{ maxWidth: 920, margin: '0 auto 48px' }}>
              <span className="equip-image-frame-tag"><Sparkles size={12} /> Recondicionado Separi</span>
              <img
                src="/teste.png"
                alt="Centrífuga recondicionada Separi"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="equip-image-frame-placeholder">...imagem</div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="table-wrap">
              <div className="table-scroll">
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th className="left">Processo de Recondicionamento</th>
                      <th className="teal-header">
                        Recondicionado Separi<br />
                        <span className="sub">Como Novo</span>
                      </th>
                      <th>
                        Usado / Revisado<br />
                        <span className="sub">Padrão de Mercado</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="left">{row.label}</td>
                        <td>{row.separi ? <Check className="icon-check" size={20} /> : <span className="icon-dash">,</span>}</td>
                        <td>{row.mercado ? <Check className="icon-check" size={20} /> : <span className="icon-dash">,</span>}</td>
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

      {/* LOCAÇÃO DE BOWLS */}
      <section id="locacao" className="section-padding bg-subtle">
        <div className="container">
          <div className="grid-2 gap-60 align-center">
            <Reveal variant="fade-right">
              <div>
                <span className="eyebrow"><RotateCw size={14} /> Programa de Locação</span>
                <h2 className="section-title">
                  Locação de <span className="text-gradient">Rotores (Bowls)</span>
                </h2>
                <p className="text-lg mt-20">
                  O que acontece quando o seu rotor está desbalanceado ou precisa de uma
                  reparação extensa? Um rotor desbalanceado é uma receita para o desastre,
                  prejudicando o volume de produção e criando riscos de segurança.
                </p>
                <p className="text-lg mt-20 mb-30">
                  Não pare a sua produção. O nosso programa de locação mantém o seu equipamento
                  operacional. A nossa equipa substitui o seu rotor por um rotor de locação numa
                  única visita. Enquanto a sua fábrica continua a operar normalmente, levamos
                  o seu rotor para a nossa oficina, reparamos aos padrões OEM e, quando estiver
                  pronto, fazemos a troca final.
                </p>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <MessageCircle size={16} /> Consultar Disponibilidade
                </a>
              </div>
            </Reveal>

            <Reveal variant="fade-left" delay={150}>
              <div>
                <div className="equip-image-frame" style={{ aspectRatio: '4/3', marginBottom: 24 }}>
                  <span className="equip-image-frame-tag"><RotateCw size={12} /> Bowl em locação</span>
                  <img
                    src="/teste.png"
                    alt="Rotor Bowl Separi"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="equip-image-frame-placeholder">...imagem</div>
                </div>
                <h3 className="text-center mb-20" style={{ fontSize: '1.1rem' }}>
                  Rotores e Bowls Disponíveis para Troca
                </h3>
                <div className="table-wrap">
                  <div className="table-scroll" style={{ maxHeight: 320, overflowY: 'auto' }}>
                    <table className="cmp-table" style={{ minWidth: 0 }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr>
                          <th className="teal-header left" style={{ width: '45%' }}>Centrífugas Aplicáveis</th>
                          <th className="teal-header left" style={{ width: '55%' }}>Configuração / Aplicação</th>
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

      {/* AUTOMAÇÃO */}
      <section id="automacao" className="section-padding bg-white">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow"><Cpu size={14} /> Modernização</span>
              <h2 className="section-title">
                Automação e <span className="text-gradient">Controlos</span>
              </h2>
              <p className="text-lg max-width-text">
                Atualize a tecnologia da sua centrífuga. Painéis modernos e Drives de Frequência
                Variável (VFDs) para operar corretamente qualquer equipamento Alfa Laval,
                Tetra Pak ou Westfalia.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={50}>
            <div className="equip-image-frame" style={{ maxWidth: 920, margin: '0 auto 48px' }}>
              <span className="equip-image-frame-tag"><Cpu size={12} /> Painel CLP/IHM</span>
              <img
                src="/teste.png"
                alt="Painel de automação Separi"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="equip-image-frame-placeholder">...imagem</div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="split-grid">
              <div className="split-panel panel-light">
                <div className="icon-box"><TrendingUp size={26} /></div>
                <h3>Drives de Frequência Variável (VFD)</h3>
                <p>
                  Fornecemos inversores de frequência Allen Bradley pré-programados em qualquer
                  gama de potência requerida para a sua aplicação.
                </p>
                <ul className="feature-list">
                  <li><Check size={18} /> Aceleração de arranque suave</li>
                  <li><Check size={18} /> Redução dramática do consumo de corrente</li>
                  <li><Check size={18} /> Aumento extremo da vida útil do motor</li>
                </ul>
              </div>

              <div className="split-panel panel-dark">
                <div className="icon-box dark"><Cpu size={26} /></div>
                <h3>Painéis de Controlo (CLP/IHM)</h3>
                <p>
                  Projetamos painéis modernos que otimizam a automação e oferecem integração
                  completa com a fábrica, acabando com as falhas de quadros desatualizados.
                </p>
                <ul className="feature-list">
                  <li><Check size={18} /> Monitorização e Diagnóstico Remoto</li>
                  <li><Check size={18} /> Interface Touch (IHM) intuitiva</li>
                  <li><Check size={18} /> Integração com sistemas SCADA da fábrica</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ESTOQUE */}
      <section id="estoque" className="section-padding bg-subtle">
        <div className="container">
          <Reveal variant="fade-up">
            <div className="text-center mb-50">
              <span className="eyebrow"><Package size={14} /> Entrega Rápida</span>
              <h2 className="section-title">
                Equipamentos <span className="text-gradient">Disponíveis</span>
              </h2>
              <p className="text-lg max-width-text">
                O nosso Programa de Entrega Rápida foi criado para minimizar o tempo de
                inatividade. Equipamentos perfeitos para substituição sem interromper as
                suas estruturas atuais.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={50}>
            <div className="equip-image-frame" style={{ maxWidth: 920, margin: '0 auto 48px' }}>
              <span className="equip-image-frame-tag"><Package size={12} /> Estoque pronto</span>
              <img
                src="/teste.png"
                alt="Equipamentos disponíveis em estoque"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="equip-image-frame-placeholder">...imagem</div>
            </div>
          </Reveal>

          <div className="grid-3">
            {stock.map((eq, idx) => (
              <Reveal key={idx} variant="fade-up" delay={idx * 100}>
                <div className="equip-card">
                  <div className="equip-badge" style={eq.badgeStyle}>{eq.badge}</div>
                  <div className="equip-img">
                    <Package />
                  </div>
                  <div className="equip-body">
                    <h3>{eq.title}</h3>
                    <div className="serie">(Série {eq.serie})</div>
                    <p>{eq.desc}</p>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=Cotação%20${encodeURIComponent(eq.title)}%20-%20Série%20${encodeURIComponent(eq.serie)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-block"
                    >
                      <MessageCircle size={16} /> Solicitar Cotação
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade-up" delay={300}>
            <div className="text-center mt-30">
              <p className="text-lg" style={{ color: 'var(--text-light)' }}>
                Temos muito mais equipamentos em stock, incluindo modelos{' '}
                <strong>MSE 300, MSB 200</strong>, entre outros.
                Contacte-nos para consultar a disponibilidade atualizada.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BANNER COMPRA */}
      <section id="pecas" className="section-padding banner-dark">
        <div className="container relative-z">
          <Reveal variant="zoom-in">
            <div className="text-center" style={{ maxWidth: 800, margin: '0 auto' }}>
              <span className="eyebrow on-dark"><RefreshCw size={12} /> Compra de Usados</span>
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
                <MessageCircle size={18} /> Solicitar Avaliação de Equipamento
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
              <span className="eyebrow">Perguntas frequentes</span>
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
                  Cada centrífuga recondicionada sai com garantia técnica de até 12 meses,
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
              <span className="eyebrow on-dark"><MessageCircle size={12} /> Vamos conversar</span>
              <h2 className="section-title text-white">
                Pronto para elevar <span className="text-gradient">o seu processo</span>?
              </h2>
              <p className="text-lg text-white-muted max-width-text mt-20">
                A nossa equipa de engenharia está a postos. Cotações, peças e equipamentos.
              </p>
              <div className="cta-buttons">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <MessageCircle size={18} /> Falar com Especialista
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
