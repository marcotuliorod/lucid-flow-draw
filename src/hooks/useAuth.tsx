
import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { createSecureError } from '@/lib/validation'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('useAuth: Initializing...')
    }
    
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          if (import.meta.env.DEV) {
            console.error('useAuth: Error getting session:', error.message)
          }
        } else {
          if (import.meta.env.DEV) {
            console.log('useAuth: Initial session loaded')
          }
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('useAuth: Unexpected error:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (import.meta.env.DEV) {
          console.log('useAuth: Auth state changed:', event)
        }
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      if (import.meta.env.DEV) {
        console.log('useAuth: Cleaning up subscription')
      }
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      if (import.meta.env.DEV) {
        console.log('useAuth: Attempting signup')
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        if (import.meta.env.DEV) {
          console.error('useAuth: SignUp error:', error.message)
        }
      } else if (import.meta.env.DEV) {
        console.log('useAuth: SignUp successful')
      }
      
      return { data, error }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('useAuth: SignUp error:', err)
      }
      const secureError = createSecureError('Erro no cadastro', import.meta.env.DEV)
      return { data: null, error: { message: secureError } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (import.meta.env.DEV) {
        console.log('useAuth: Attempting signin')
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        if (import.meta.env.DEV) {
          console.error('useAuth: SignIn error:', error.message)
        }
      } else if (import.meta.env.DEV) {
        console.log('useAuth: SignIn successful')
      }
      
      return { data, error }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('useAuth: SignIn error:', err)
      }
      const secureError = createSecureError('Erro no login', import.meta.env.DEV)
      return { data: null, error: { message: secureError } }
    }
  }

  const signOut = async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('useAuth: Attempting signout')
      }
      const { error } = await supabase.auth.signOut()
      if (error) {
        if (import.meta.env.DEV) {
          console.error('useAuth: SignOut error:', error.message)
        }
      } else if (import.meta.env.DEV) {
        console.log('useAuth: SignOut successful')
      }
      return { error }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('useAuth: SignOut error:', err)
      }
      const secureError = createSecureError('Erro no logout', import.meta.env.DEV)
      return { error: { message: secureError } }
    }
  }

  const signInWithGoogle = async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('useAuth: Attempting Google signin')
      }

      // Validar se a URL de origem é segura
      const origin = window.location.origin
      if (!origin || (!origin.includes('localhost') && !origin.includes('https://'))) {
        return { 
          data: null, 
          error: { message: 'URL de redirecionamento inválida' } 
        }
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        if (import.meta.env.DEV) {
          console.error('useAuth: Google SignIn error:', error.message)
        }
        
        // Tratamento específico de erros do Google OAuth
        if (error.message?.includes('not configured')) {
          return { data: null, error: { message: 'Login com Google não está configurado no servidor' } }
        } else if (error.message?.includes('Invalid redirect')) {
          return { data: null, error: { message: 'Configuração de redirecionamento inválida' } }
        } else if (error.message?.includes('access_denied')) {
          return { data: null, error: { message: 'Acesso negado pelo usuário' } }
        }
        
        return { data: null, error: { message: 'Erro no login com Google' } }
      } else if (import.meta.env.DEV) {
        console.log('useAuth: Google SignIn initiated')
      }
      
      return { data, error }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('useAuth: Google SignIn error:', err)
      }
      const secureError = createSecureError('Erro no login com Google', import.meta.env.DEV)
      return { data: null, error: { message: secureError } }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  }
}
