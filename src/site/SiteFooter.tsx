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

          <div className="foot_col">
            <strong>Conta</strong>
            {isAuthenticated ? (
              <>
                <Link to={R.perfil}>Minha conta</Link>
                <Link to={R.meusPedidos}>Meus pedidos</Link>
                <Link to={R.catalogo}>Catálogo de peças</Link>
              </>
            ) : (
              <>
                <Link to={R.login}>Entrar</Link>
                <Link to={R.registro}>Criar conta</Link>
              </>
            )}
          </div>

          <div className="foot_col">
            <strong>Contato</strong>
            <a href={R.telefone}>+55 (19) 97405 9048</a>
            <a href={R.email}>vendas@separi.com.br</a>
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
