
import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      console.log('SignUp result:', { data, error })
      return { data, error }
    } catch (err) {
      console.error('SignUp error:', err)
      return { data: null, error: err as any }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('SignIn result:', { data, error })
      return { data, error }
    } catch (err) {
      console.error('SignIn error:', err)
      return { data: null, error: err as any }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      console.log('SignOut result:', { error })
      return { error }
    } catch (err) {
      console.error('SignOut error:', err)
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
