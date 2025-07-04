
import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('useAuth: Initializing...')
    
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('useAuth: Error getting session:', error)
        } else {
          console.log('useAuth: Initial session:', session?.user?.email || 'No user')
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('useAuth: Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.email || 'No user')
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      console.log('useAuth: Cleaning up subscription')
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      console.log('useAuth: Attempting signup for:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      console.log('useAuth: SignUp result:', { data: data?.user?.email, error: error?.message })
      return { data, error }
    } catch (err) {
      console.error('useAuth: SignUp error:', err)
      return { data: null, error: err as any }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('useAuth: Attempting signin for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('useAuth: SignIn result:', { data: data?.user?.email, error: error?.message })
      return { data, error }
    } catch (err) {
      console.error('useAuth: SignIn error:', err)
      return { data: null, error: err as any }
    }
  }

  const signOut = async () => {
    try {
      console.log('useAuth: Attempting signout')
      const { error } = await supabase.auth.signOut()
      console.log('useAuth: SignOut result:', { error: error?.message })
      return { error }
    } catch (err) {
      console.error('useAuth: SignOut error:', err)
      return { error: err as any }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  }
}
