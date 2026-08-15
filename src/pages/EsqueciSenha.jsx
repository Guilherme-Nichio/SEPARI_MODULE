import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Seo from '../components/Seo'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPasswordForEmail } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Informe seu email')
    setLoading(true)
    const { error } = await resetPasswordForEmail(email)
    setLoading(false)
    if (error) return toast.error(error.message)
    setSent(true)
  }

  if (sent) {
    return (
      <>
        <Seo title="Email enviado · Separi" description="Verifique seu email para redefinir a senha." />
        <section className="auth-page-v2">
          <div className="auth-shell single-col">
            <div className="auth-card-v2 text-center" style={{ maxWidth: 480 }}>
              <div className="auth-success-icon"><CheckCircle2 size={48} /></div>
              <h1>Email enviado</h1>
              <p className="auth-subtitle">
                Se houver uma conta associada a <strong>{email}</strong>, você receberá um link
                para redefinir sua senha em alguns instantes.
              </p>
              <Link to="/login" className="btn btn-primary btn-block mt-20">
                <ArrowLeft size={16} /> Voltar para o login
              </Link>
              <p className="auth-tiny-note">
                Não recebeu? Confira a caixa de spam ou tente novamente em alguns minutos.
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title="Recuperar senha · Separi" description="Recupere o acesso à sua conta Separi." />
      <section className="auth-page-v2">
        <div className="auth-shell single-col">
          <div className="auth-card-v2" style={{ maxWidth: 480 }}>
            <div className="auth-mobile-logo">
              <Link to="/"><img src="/logo.png" alt="Separi" /></Link>
            </div>
            <div className="auth-icon-circle"><KeyRound size={28} /></div>
            <h1>Esqueci minha senha</h1>
            <p className="auth-subtitle">
              Informe o email cadastrado e enviaremos um link para criar uma nova senha.
            </p>

            <form onSubmit={submit}>
              <div className="form-group">
                <label><Mail size={13} /> Email</label>
                <input
                  type="email" className="form-input"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" autoComplete="email" required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <><span className="loader sm" /> Enviando...</> : 'Enviar link de redefinição'}
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/login"><ArrowLeft size={13} /> Voltar para o login</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
