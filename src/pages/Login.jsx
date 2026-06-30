import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck, Package, Headphones, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Seo from '../components/Seo'

const trustPoints = [
  { icon: <Package size={18} />, title: 'Catálogo personalizado', desc: 'Peças e kits compatíveis com as máquinas que você tem aprovadas.' },
  { icon: <ShieldCheck size={18} />, title: 'Cotação rápida', desc: 'Adicione itens, peça orçamento e acompanhe o status.' },
  { icon: <Headphones size={18} />, title: 'Suporte técnico real', desc: 'Engenheiros respondem suas dúvidas técnicas com profundidade.' },
  { icon: <Award size={18} />, title: 'Histórico completo', desc: 'Manuais, fotos e conjuntos de cada máquina sempre à mão.' }
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/perfil'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Preencha email e senha')
    setLoading(true)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos'
        : error.message)
    } else {
      toast.success('Bem-vindo de volta!')
      navigate(from, { replace: true })
    }
  }

  return (
    <>
      <Seo
        title="Entrar · Separi"
        description="Acesse sua conta Separi para visualizar suas máquinas, catálogo de peças e cotações."
      />
      <section className="auth-page-v2">
        <div className="auth-shell">

          <aside className="auth-side-panel">
            <Link to="/" className="auth-side-logo">
              <img src="/logo.png" alt="Separi" />
            </Link>
            <h2 className="auth-side-title">
              Sua área <span className="text-gradient">técnica completa</span>
            </h2>
            <p className="auth-side-lead">
              Acesse o catálogo personalizado, a cotação aberta e o histórico de cada centrífuga
              que você tem cadastrada conosco.
            </p>
            <ul className="auth-side-list">
              {trustPoints.map((tp, i) => (
                <li key={i}>
                  <span className="auth-side-icon">{tp.icon}</span>
                  <div><strong>{tp.title}</strong><p>{tp.desc}</p></div>
                </li>
              ))}
            </ul>
          </aside>

          <div className="auth-card-v2">
            <div className="auth-mobile-logo">
              <Link to="/"><img src="/logo.png" alt="Separi" /></Link>
            </div>
            <h1>Entrar na sua conta</h1>
            <p className="auth-subtitle">
              Acesse seu painel, máquinas e o catálogo personalizado
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><Mail size={13} /> Email</label>
                <input
                  type="email" className="form-input"
                  placeholder="seu@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" required
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label><Lock size={13} /> Senha</label>
                  <Link to="/esqueci-senha" className="auth-tiny-link">Esqueci minha senha</Link>
                </div>
                <div className="input-with-action">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password" required
                  />
                  <button type="button" className="input-action-btn"
                          onClick={() => setShowPass(s => !s)} tabIndex={-1}
                          aria-label="Mostrar/ocultar senha">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading
                  ? <><span className="loader sm" /> Entrando...</>
                  : <><LogIn size={18} /> Entrar</>}
              </button>
            </form>

            <div className="auth-footer">
              Ainda não tem uma conta? <Link to="/registro">Criar conta</Link>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
