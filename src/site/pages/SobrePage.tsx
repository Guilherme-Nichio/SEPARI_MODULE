/* ============================================================================
   src/site/pages/SobrePage.tsx  —  Sobre

   Markup convertido do HTML original sem alteração de estrutura, classes ou
   texto. O que mudou: <a href> virou <Link>, os <button> ganharam navegação e
   os scripts inline viraram hooks. O CSS vive em styles/site/sobre.css,
   escopado em .sep-sobre.
   ========================================================================== */
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SiteLayout from '../SiteLayout'
import { Bg } from '../Media'
import HeroBgVideo from '../HeroBgVideo'
import { R, quoteRoute, catalogRoute, external } from '../routes'
import { useReveal } from '../hooks/siteHooks'

export default function SobrePage() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  useReveal(ref, 0.12)

  return (
    <SiteLayout page="sobre" containerRef={ref}>
        {/* HERO — mesma construção da Home: vídeo no fundo, véu verde por cima
            e o texto por último. Os três níveis vão inline de propósito, para
            ficarem idênticos aos da HomePage e não dependerem de nenhuma regra
            do CSS legado. O conteúdo (migalha, título, texto e botão) é o
            mesmo de antes. */}
        <header className="hero" style={{ position: 'relative', overflow: 'hidden' }}>

          {/* Vídeo de fundo (Nível 1) + véu verde (Nível 2).
              Antes o <source> aqui vinha escrito type="drone/mp4" — um tipo
              MIME que não existe. O navegador descartava a fonte sem nem
              tentar baixar, e o hero ficava só com o véu por cima do branco.
              Agora o arquivo vem do manifesto (VIDEO.sobreHero) e o type é
              montado pelo componente, então não tem como errar de novo. */}
          <HeroBgVideo slot="sobreHero" zIndex={1} zoom={1.4} />

          {/* Texto (Nível 3) */}
          <div className="wrap hero_inner" style={{ position: 'relative', zIndex: 3 }}>
            <div className="hero_head">
              <div className="crumbs"><Link to={R.home}>Início</Link> / Sobre</div>
              <h1>Separamos o essencial.<br /><em>Entregamos confiança.</em></h1>
            </div>
            <div className="hero_side">
              <p>Engenharia leal ao seu processo, não ao fabricante. Desde 2018, mantendo centrífugas industriais e marítimas girando.</p>
              <div className="actions">
                <a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com especialista</a>
              </div>
            </div>
          </div>
        </header>

        {/* STORY */}
        <section>
          <div className="wrap story sep_reveal">
            <div className="txt">
              <h2>O parceiro técnico<br />por trás do giro.</h2>
              <p>Fundada em 2018, a Separi cresceu para se tornar um fornecedor global de peças de alta qualidade e componentes recondicionados para separadores marinhos e industriais.</p>
              <p>Valorizamos o contato pessoal e a expertise técnica. Nossos engenheiros estão sempre disponíveis para manter a sua operação girando, sem interrupções.</p>
            </div>
            <div className="shape"><Bg slot="sobreOficina" className="img" showLabel /></div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="manifesto">
          <div className="wrap sep_reveal">
            <blockquote>Separar o essencial do supérfluo e entregar soluções em que a sua operação pode <em>confiar de olhos fechados.</em></blockquote>
          </div>
        </section>

        {/* PROPÓSITO */}
        <section>
          <div className="wrap purpose sep_reveal">
            <div className="col">
              <h2>A nossa missão.</h2>
              <p>Entregar soluções completas em serviço, peças e equipamentos para centrífugas, com máxima eficiência, segurança e produtividade para a sua planta.</p>
            </div>
            <div className="col divider">
              <h2>A nossa visão.</h2>
              <p>Ser a empresa de referência em serviço e peças no Brasil e no mundo, reconhecida pela excelência técnica e confiabilidade absoluta.</p>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="vals">
          <div className="wrap">
            <div className="head sep_reveal">
              <h2>No que acreditamos.</h2>
              <p className="lead" style={{ "marginTop": "20px" }}>Princípios que sustentam cada peça entregue e cada serviço executado.</p>
            </div>
            <div className="vals_list sep_reveal">
              <div className="vrow"><h3>Atendimento</h3><p>O cliente sempre em primeiro lugar, do primeiro contato ao pós-serviço.</p></div>
              <div className="vrow"><h3>Respeito</h3><p>Relações transparentes e éticas, com clientes, parceiros e equipe.</p></div>
              <div className="vrow"><h3>Melhoria</h3><p>Sempre à procura de fazer melhor, em cada processo e cada entrega.</p></div>
              <div className="vrow"><h3>Integridade</h3><p>Agimos com honestidade em tudo, mesmo quando ninguém está olhando.</p></div>
              <div className="vrow"><h3>Confiança</h3><p>Construída com resultados, cliente por cliente, ano após ano.</p></div>
            </div>
          </div>
        </section>

        {/* EVOLUÇÃO */}
        <section className="evo">
          <div className="wrap">
            <div className="head sep_reveal">
              <h2>A nossa evolução.</h2>
              <p className="lead" style={{ "marginTop": "20px" }}>De uma empresa local a um parceiro com atuação internacional.</p>
            </div>
            <div className="evo_grid sep_reveal">
              <div className="evo_item"><div className="yr">2018</div><h4>Fundação</h4><p>Nascemos com foco em serviço de alta qualidade para separadores navais e industriais.</p></div>
              <div className="evo_item"><div className="yr">2020</div><h4>Expansão</h4><p>Novos segmentos e oficina ampliada, atendendo laticínios, cervejarias e óleo e gás.</p></div>
              <div className="evo_item"><div className="yr">2023</div><h4>Sede em Indaiatuba</h4><p>Estrutura moderna com balanceamento dinâmico de rotores em um só lugar.</p></div>
              <div className="evo_item"><div className="yr">Hoje</div><h4>Atuação global</h4><p>Envio internacional de peças de precisão e equipamentos próprios Separi.</p></div>
            </div>
          </div>
        </section>

        {/* EQUIPE */}
        <section className="team">
          <div className="wrap">
            <div className="head sep_reveal">
              <h2>Quem mantém tudo girando.</h2>
              <p className="lead" style={{ "marginTop": "20px" }}>Engenheiros e técnicos formados na escola dos próprios fabricantes.</p>
            </div>
            <div className="team_grid sep_reveal">
              <div className="member">
                <Bg slot="equipeDirecao" className="pic" />
                <div className="cap"><div className="role">Direção</div><h4>Hugo Rafacho</h4></div>
              </div>
              <div className="member">
                <Bg slot="equipeEngenharia" className="pic" />
                <div className="cap"><div className="role">Engenharia</div><h4>Técnicos certificados</h4></div>
              </div>
              <div className="member">
                <Bg slot="equipeAtendimento" className="pic" />
                <div className="cap"><div className="role">Atendimento</div><h4>Suporte especializado</h4></div>
              </div>
            </div>
          </div>
        </section>

        {/* LOCALIZAÇÃO */}
        <section>
          <div className="wrap loc sep_reveal">
            <div className="txt">
              <h2>Perto de quem precisa.</h2>
              <p>Estamos em Indaiatuba, São Paulo. Uma posição privilegiada que garante respostas rápidas e logística ágil de peças e equipamentos para toda a América Latina.</p>
              <ul>
                <li>R. Augusto Poltronieri, 179, Indaiatuba SP</li>
                <li>+55 (19) 97405 9048</li>
                <li>vendas@separi.com.br</li>
              </ul>
            </div>
            <div className="map">
              {/* Mapa real do Google. O modo `output=embed` não exige chave de
                  API nem cobrança: é o mesmo endereço que o botão "Compartilhar
                  → Incorporar um mapa" gera. `loading="lazy"` segura o carregamento
                  até o bloco chegar perto da tela, então o mapa não pesa na
                  abertura da página. */}
              <iframe
                title="Separi — R. Augusto Poltronieri, 179, Indaiatuba, SP"
                src="https://www.google.com/maps?q=R.+Augusto+Poltronieri,+179,+Indaiatuba+-+SP&z=16&hl=pt-BR&output=embed"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a className="map_link" href={R.endereco} {...external}>
                Abrir no Google Maps ↗
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap sep_reveal">
            <h2>Vamos manter o seu<br />processo girando.</h2>
            <p className="lead">Conte o que você precisa e a nossa engenharia retorna com uma proposta técnica.</p>
            <div className="btns">
              <a className="btn btn_solid" {...external} href={R.whatsapp}>Falar com especialista</a>
              <button className="btn btn_line" style={{ color: 'var(--ink)' }} onClick={() => navigate(R.pecas)}>Ver catálogo</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}



    </SiteLayout>
  )
}
