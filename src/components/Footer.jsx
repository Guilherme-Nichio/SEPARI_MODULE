import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Phone, Mail, MapPin, Send, User as UserIcon } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '551938167640'

export default function Footer() {
  const { isAuthenticated, isAdmin } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const upd = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Preencha nome, email e mensagem.')
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim() || 'Contato pelo site',
        message: form.message.trim()
      })
      if (error) throw error
      toast.success('Mensagem enviada! Em breve entraremos em contato.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      const body = encodeURIComponent(`Nome: ${form.name}\nEmail: ${form.email}\nTelefone: ${form.phone}\n\n${form.message}`)
      window.location.href = `mailto:vendas@separi.com.br?subject=${encodeURIComponent(form.subject || 'Contato pelo site')}&body=${body}`
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* ───────── PRÉ-FOOTER: FORMULÁRIO DE CONTATO ───────── */}
      <section className="prefooter-contact">
        <div className="container">
          <div className="prefooter-grid">
            <div className="prefooter-intro">
              <span className="prefooter-eyebrow">Fale com a Separi</span>
              <h2>Vamos manter o seu processo girando</h2>
              <p>
                Conte o que você precisa — peça, serviço ou equipamento — e nossa
                engenharia retorna com uma proposta técnica. Resposta em poucos dias úteis.
              </p>
              <ul className="prefooter-contacts">
                <li><span className="prefooter-ic"><Mail size={16} /></span> vendas@separi.com.br</li>
                <li><span className="prefooter-ic"><Phone size={16} /></span> +55 (19) 3816-7640</li>
                <li><span className="prefooter-ic"><MapPin size={16} /></span> Indaiatuba — SP</li>
              </ul>
            </div>

            <form className="prefooter-form" onSubmit={handleSubmit}>
              <div className="prefooter-row">
                <label className="prefooter-field">
                  <span>Nome*</span>
                  <input type="text" value={form.name} onChange={upd('name')} placeholder="Seu nome" required />
                </label>
                <label className="prefooter-field">
                  <span>Email*</span>
                  <input type="email" value={form.email} onChange={upd('email')} placeholder="voce@empresa.com" required />
                </label>
              </div>
              <div className="prefooter-row">
                <label className="prefooter-field">
                  <span>Telefone</span>
                  <input type="tel" value={form.phone} onChange={upd('phone')} placeholder="(00) 00000-0000" />
                </label>
                <label className="prefooter-field">
                  <span>Assunto</span>
                  <input type="text" value={form.subject} onChange={upd('subject')} placeholder="Peça, serviço ou equipamento" />
                </label>
              </div>
              <label className="prefooter-field">
                <span>Mensagem*</span>
                <textarea value={form.message} onChange={upd('message')} rows={4} placeholder="Descreva sua necessidade (modelo da máquina, nº de série, etc.)" required />
              </label>
              <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
                <Send size={16} /> {sending ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/logo.png" alt="Separi" className="footer-logo" />
              <p>
                Fornecedora global confiável de peças e manutenção para separadores e
                centrífugas industriais e marinhos. A nossa prioridade é o seu processo.
              </p>
            </div>

            <div className="footer-col">
              <h4>Navegação</h4>
              <Link to="/">Home</Link>
              <Link to="/pecas">Peças</Link>
              <Link to="/fabricantes">Fabricantes</Link>
              <Link to="/produtos">Produtos</Link>
              <Link to="/servicos">Serviços</Link>
              <Link to="/sobre">Sobre Nós</Link>
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
                <WhatsAppIcon size={16} /> WhatsApp
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
    </>
  )
}
