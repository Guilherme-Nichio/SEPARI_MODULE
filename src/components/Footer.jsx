import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

export default function Footer() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src="/logo.png"
              alt="Separi"
              className="footer-logo"
            />
            <p>
              Fornecedora global confiável de peças e manutenção para separadores e
              centrífugas industriais e marinhos. A nossa prioridade é o seu processo.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <Link to="/">Home</Link>
            <Link to="/sobre">Sobre Nós</Link>
            <Link to="/servicos">Serviços</Link>
            <Link to="/equipamentos">Equipamentos</Link>
            {isAuthenticated && !isAdmin && <Link to="/pecas">Peças</Link>}
          </div>

          <div className="footer-col">
            <h4>Conta</h4>
            {!isAuthenticated && (
              <>
                <Link to="/login">Entrar</Link>
                <Link to="/registro">Criar Conta</Link>
              </>
            )}
            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/perfil">Meu Perfil</Link>
                <Link to="/meus-pedidos">Minhas Cotações</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin">Painel Administrativo</Link>
            )}
          </div>

          <div className="footer-col footer-contact">
            <h4>Contato</h4>
            <p>
              <Phone size={16} />
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 700, color: 'var(--teal-dark)' }}
              >
                +55 (19) 3816-7640
              </a>
            </p>
            <p>
              <Mail size={16} />
              vendas@separi.com.br
            </p>
            <p>
              <MapPin size={16} />
              <span>R. Augusto Poltronieri, 179 - LT - Park Comercial de Indaiatuba, Indaiatuba - SP, 13347-443</span>
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm mt-12"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Separi. Todos os direitos reservados.</span>
          <span style={{ fontSize: '0.85rem' }}>
            Projetado por Guilherme Nicchio {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  )
}
