/* ============================================================================
   src/site/SiteFooter.tsx

   Markup do <footer> original. As cinco páginas tinham footers quase iguais —
   a Home era a única sem o item "Home" na coluna Navegação. Unifiquei na
   versão completa (a das páginas internas), que é a mais correta agora que
   existe roteamento de verdade. Classes e estrutura, intactas.
   ========================================================================== */
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Logo, Wordmark } from './Media'
import { BRAND } from './assets'
import { R, external } from './routes'
import { CONTATO } from './siteConfig'
import { LinkPlataforma } from './EmBreve'

export default function SiteFooter() {
  const { isAuthenticated } = useAuth()

  return (
    <footer>
      <div className="wrap">
        <div className="foot_top">
          <div>
            <div className="brand">
              <Logo height={BRAND.heightFooter} variant="light" />
              <Wordmark />
            </div>
            <p className="foot_desc">
              Fornecedora confiável de peças e manutenção para separadores e
              centrífugas industriais e marinhos. A sua prioridade é o seu
              processo, a nossa também.
            </p>
          </div>

          <div className="foot_col">
            <strong>Navegação</strong>
            <Link to={R.home}>Home</Link>
            <Link to={R.pecas}>Peças</Link>
            <Link to={R.produtos}>Produtos</Link>
            <Link to={R.estoque}>Estoque de máquinas</Link>
            <Link to={R.segmentos}>Segmentos atendidos</Link>
            <Link to={R.servicos}>Serviços</Link>
            <Link to={R.sobre}>Sobre</Link>
          </div>

          {/* Coluna Conta: os mesmos itens de sempre. Enquanto a área do
              cliente está em construção eles abrem o aviso em vez de navegar,
              e voltam ao normal assim que PLATAFORMA.ativo virar false. */}
          <div className="foot_col">
            <strong>Conta</strong>
            {isAuthenticated ? (
              <>
                <LinkPlataforma to={R.perfil}>Minha conta</LinkPlataforma>
                <LinkPlataforma to={R.meusPedidos}>Meus pedidos</LinkPlataforma>
                <LinkPlataforma to={R.catalogo}>Catálogo de peças</LinkPlataforma>
              </>
            ) : (
              <>
                <LinkPlataforma to={R.login}>Entrar</LinkPlataforma>
                <LinkPlataforma to={R.registro}>Criar conta</LinkPlataforma>
              </>
            )}
          </div>

          <div className="foot_col">
            <strong>Contato</strong>
            <a href={R.telefone}>{CONTATO.telefoneTexto}</a>
            <a href={R.email}>{CONTATO.email}</a>
            <a href={R.endereco} {...external}>
              R. Augusto Poltronieri, 179, Indaiatuba SP
            </a>
            <a href={R.whatsapp} {...external}>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="foot_bottom">
          <span>© 2026 Separi. Todos os direitos reservados.</span>
          <span>Projetado por Guilherme Nicchio, 2026</span>
        </div>
      </div>
    </footer>
  )
}
