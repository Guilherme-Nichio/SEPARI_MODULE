import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserPlus, CheckCircle2, ShieldCheck, Award, Headphones, Package,
  Eye, EyeOff, Mail, Lock, Building2, Phone, User as UserIcon, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Seo from '../components/Seo'

function maskCNPJ(v) {
  return v
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}
function maskPhone(v) {
  return v
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

const trustPoints = [
  { icon: <Package size={18} />, title: 'Catálogo amplo de peças', desc: 'OEM e equivalentes homologados pra Alfa Laval, GEA, Tetra Pak e Seital.' },
  { icon: <ShieldCheck size={18} />, title: 'Cotação personalizada', desc: 'Após aprovação, você vê só o que é compatível com a sua máquina.' },
  { icon: <Headphones size={18} />, title: 'Suporte técnico real', desc: 'Engenheiros respondem suas dúvidas em dias de operação.' },
  { icon: <Award size={18} />, title: 'Sem compromisso', desc: 'Conta gratuita. Você só fecha quando aprovar o orçamento.' }
]

export default function Registro() {
  const [form, setForm] = useState({
    full_name: '', company_name: '', cnpj: '', phone: '',
    email: '', password: '', confirm: '', accept_terms: false
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const upd = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    if (key === 'cnpj') return setForm(f => ({ ...f, cnpj: maskCNPJ(val) }))
    if (key === 'phone') return setForm(f => ({ ...f, phone: maskPhone(val) }))
    setForm(f => ({ ...f, [key]: val }))
  }

  const passStrength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
    if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++
    return s
  })()
  const strengthLabel = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'][passStrength]
  const strengthColor = ['#e5e7eb', '#ef4444', '#f59e0b', '#10b981', '#0ea5e9'][passStrength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('A senha deve ter no mínimo 6 caracteres')
    if (form.password !== form.confirm) return toast.error('As senhas não conferem')
    if (!form.accept_terms) return toast.error('Você precisa aceitar os termos')

    setLoading(true)
    const { data, error } = await signUp({
      email: form.email,
      password: form.password,
      full_name: form.full_name,
      company_name: form.company_name,
      cnpj: form.cnpj,
      phone: form.phone
    })
    setLoading(false)

    if (error) return toast.error(error.message)

    if (data?.user && !data?.session) {
      setSuccess(true)
      toast.success('Conta criada! Verifique seu email.')
    } else {
      toast.success('Conta criada com sucesso!')
      navigate('/perfil')
    }
  }

  if (success) {
    return (
      <>
        <Seo title="Conta criada · Separi" description="Verifique seu email para ativar a conta Separi." />
        <section className="auth-page-v2">
          <div className="auth-shell">
            <div className="auth-card-v2 text-center" style={{ maxWidth: 540 }}>
              <div className="auth-success-icon"><CheckCircle2 size={48} /></div>
              <h1>Conta criada!</h1>
              <p className="auth-subtitle">
                Enviamos um email de confirmação para <strong>{form.email}</strong>.
                Clique no link da mensagem para ativar sua conta.
              </p>
              <Link to="/login" className="btn btn-primary btn-block mt-20">Ir para o Login</Link>
              <p className="auth-tiny-note">Não encontrou? Confira a caixa de spam.</p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo
        title="Criar conta · Separi"
        description="Crie sua conta Separi e acesse o catálogo personalizado de peças OEM, kits de revisão preventiva e suporte técnico para centrífugas industriais."
      />
      <section className="auth-page-v2">
        <div className="auth-shell">

          <aside className="auth-side-panel">
            <Link to="/" className="auth-side-logo">
              <img src="/logo.png" alt="Separi" />
            </Link>
            <h2 className="auth-side-title">
              Acesse o catálogo<br />
              <span className="text-gradient">feito pra sua máquina</span>
            </h2>
            <p className="auth-side-lead">
              Cadastre sua centrífuga uma vez e nossa equipe libera o catálogo de peças e kits
              compatíveis exclusivamente com ela.
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
            <h1>Criar conta gratuita</h1>
            <p className="auth-subtitle">Leva menos de 1 minuto. Sem cartão, sem compromisso.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><UserIcon size={13} /> Nome completo <span className="required">*</span></label>
                <input type="text" className="form-input" value={form.full_name}
                       onChange={upd('full_name')} placeholder="Como devemos te chamar" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Building2 size={13} /> Empresa</label>
                  <input type="text" className="form-input" value={form.company_name}
                         onChange={upd('company_name')} placeholder="Razão social" />
                </div>
                <div className="form-group">
                  <label><FileText size={13} /> CNPJ</label>
                  <input type="text" className="form-input" placeholder="00.000.000/0001-00"
                         value={form.cnpj} onChange={upd('cnpj')} inputMode="numeric" />
                </div>
              </div>

              <div className="form-group">
                <label><Phone size={13} /> Telefone / WhatsApp</label>
                <input type="tel" className="form-input" placeholder="(11) 99999-9999"
                       value={form.phone} onChange={upd('phone')} inputMode="numeric" />
              </div>

              <div className="form-group">
                <label><Mail size={13} /> Email <span className="required">*</span></label>
                <input type="email" className="form-input" value={form.email}
                       onChange={upd('email')} autoComplete="email"
                       placeholder="seu@email.com" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Lock size={13} /> Senha <span className="required">*</span></label>
                  <div className="input-with-action">
                    <input type={showPass ? 'text' : 'password'} className="form-input"
                           value={form.password} onChange={upd('password')}
                           minLength={6} autoComplete="new-password"
                           placeholder="Mínimo 6 caracteres" required />
                    <button type="button" className="input-action-btn"
                            onClick={() => setShowPass(s => !s)} tabIndex={-1}
                            aria-label="Mostrar/ocultar senha">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="pass-strength">
                      <div className="pass-strength-bar">
                        {[1,2,3,4].map(i => (
                          <span key={i} style={{ background: i <= passStrength ? strengthColor : '#e5e7eb' }} />
                        ))}
                      </div>
                      <span className="pass-strength-label" style={{ color: strengthColor }}>
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label><Lock size={13} /> Confirmar senha <span className="required">*</span></label>
                  <input type={showPass ? 'text' : 'password'} className="form-input"
                         value={form.confirm} onChange={upd('confirm')}
                         autoComplete="new-password" placeholder="Repita a senha" required />
                </div>
              </div>

              <label className="auth-checkbox">
                <input type="checkbox" checked={form.accept_terms} onChange={upd('accept_terms')} />
                <span>
                  Concordo com os <Link to="/sobre">termos de uso</Link> e a política de privacidade da Separi.
                </span>
              </label>

              <button type="submit" className="btn btn-primary btn-block mt-12" disabled={loading}>
                {loading ? <><span className="loader sm" /> Criando conta...</>
                         : <><UserPlus size={18} /> Criar minha conta</>}
              </button>
            </form>

            <div className="auth-footer">
              Já tem uma conta? <Link to="/login">Entrar</Link>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
