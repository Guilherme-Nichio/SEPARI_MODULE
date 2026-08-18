import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Seo from '../components/Seo'

export default function RedefinirSenha() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase processa o token do link na URL automaticamente (detectSessionInUrl: true).
    // Aguardamos a sessão ficar disponível para liberar o formulário.
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      setReady(!!data.session)
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setReady(!!sess)
    })
    return () => sub?.subscription?.unsubscribe()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Mínimo 6 caracteres')
    if (password !== confirm) return toast.error('As senhas não conferem')
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Senha atualizada com sucesso!')
    navigate('/perfil')
  }

  return (
    <>
      <Seo title="Redefinir senha · Separi" description="Defina uma nova senha para sua conta Separi." />
      <section className="auth-page-v2">
        <div className="auth-shell single-col">
          <div className="auth-card-v2" style={{ maxWidth: 480 }}>
            <div className="auth-mobile-logo">
              <Link to="/"><img src="/logo.png" alt="Separi" /></Link>
            </div>
            <div className="auth-icon-circle"><ShieldCheck size={28} /></div>
            <h1>Definir nova senha</h1>
            <p className="auth-subtitle">
              Use uma senha forte com pelo menos 8 caracteres misturando letras, números e símbolos.
            </p>

            {!ready ? (
              <div className="notice-card-inline">
                <p>Validando o link...</p>
                <Link to="/esqueci-senha" className="auth-tiny-link">Solicitar novo link</Link>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-group">
                  <label><Lock size={13} /> Nova senha</label>
                  <div className="input-with-action">
                    <input
                      type={showPass ? 'text' : 'password'} className="form-input"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      minLength={6} required placeholder="Mínimo 6 caracteres"
                    />
                    <button type="button" className="input-action-btn"
                            onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label><Lock size={13} /> Confirmar nova senha</label>
                  <input
                    type={showPass ? 'text' : 'password'} className="form-input"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    minLength={6} required placeholder="Repita a senha"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? <><span className="loader sm" /> Salvando...</> : 'Salvar nova senha'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
