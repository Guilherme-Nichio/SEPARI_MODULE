import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId, userMeta = null, userEmail = null) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (data) {
      setProfile(data)
      return
    }

    // Profile não existe, cria defensivamente (cobre casos onde o trigger
    // não rodou ou onde o profile foi apagado mas auth.users continua)
    if (userEmail) {
      const newProfile = {
        id: userId,
        email: userEmail,
        full_name: userMeta?.full_name || '',
        company_name: userMeta?.company_name || '',
        cnpj: userMeta?.cnpj || '',
        phone: userMeta?.phone || '',
        role: 'customer'
      }
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .maybeSingle()

      if (created) setProfile(created)
      else if (createError) console.error('[AuthContext] profile create failed:', createError)
    }
  }

  useEffect(() => {
    // Carrega sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadProfile(session.user.id, session.user.user_metadata, session.user.email)
      }
      setLoading(false)
    })

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        loadProfile(session.user.id, session.user.user_metadata, session.user.email)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async ({ email, password, full_name, company_name, cnpj, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, company_name, cnpj, phone }
      }
    })
    return { data, error }
  }

  const resetPasswordForEmail = async (email) => {
    const redirectTo = `${window.location.origin}/redefinir-senha`
    return supabase.auth.resetPasswordForEmail(email, { redirectTo })
  }

  const updatePassword = async (newPassword) => {
    return supabase.auth.updateUser({ password: newPassword })
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }

  const refreshProfile = async () => {
    if (session?.user) {
      await loadProfile(session.user.id, session.user.user_metadata, session.user.email)
    }
  }

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,
    isAuthenticated: !!session,
    isAdmin: profile?.role === 'admin',
    signUp,
    signIn,
    signOut,
    refreshProfile,
    resetPasswordForEmail,
    updatePassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
